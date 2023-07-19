import { ref, reactive, computed, nextTick } from "vue";
import { debounce, getTimestampOfNDaysAgo } from "../../utils/tool.js";
import { generateUniqueUid } from "../../utils/tool.js";
const env = import.meta.env;

/**
 *
 * @param {*} uid socket 连接必须携带一个uid
 * @param {boolean} first 是否为第一次连接
 * @param {function} timeoutCallback 连接超时中断回调
 * @param {function} play pgt回复之后，需要将其内容语音播放
 * @returns {
 * }
 * sendMessage,发送消息函数
 * inputMessage,当前输入框内容存储对象
 * messageList,消息历史存储数组
 * loading,消息发送=》结束loading

 * close,关闭socket
 * scroll,监听scroll-view 滚动,更新scrollTop
 * scrollTop,当前scrollTop值
 * SocketTask,socket连接对象
 * hasMessage，当前输入框是否有值
 *
 */
export default function useWebsocketChat(
  uid,
  first = true,
  timeoutCallback,
  play
) {
  const inputMessage = reactive({
    value: "",
    self: true,
    id: "",
  });
  // 只缓存近N天的聊天记录
  const minTime = getTimestampOfNDaysAgo();
  const cacheMessageList = (wx.getStorageSync("messageList") || []).filter(
    (e) => e.createTime >= minTime
  );
  const messageList = ref(cacheMessageList);
  const loading = ref(false);
  const scrollTop = ref(0);
  let msg = "";
  let init = first;
  let index = messageList.value.length;
  let oldScrollTop = 0;
  const hasMessage = computed(() => {
    return inputMessage.value.trim().length > 0;
  });

  //开始连接
  const token = uni.getStorageSync("accessToken");
  let SocketTask = wx.connectSocket({
    url: `${env.VITE_api_chat_websocket}/websocket/${uid}?level=1`,
    protocols: [token],
  });

  // 监听连接成功
  SocketTask.onOpen((e) => {
    SocketTask.currentStatus = "open";
    console.log("😄您已成功接入ALO7_GPT websocket服务,开始解决你的问题", e);
    scrollBottom();
    if (!init) return false;
    msg = "";
    SocketTask.send({
      data: msg,
      success: () => {
        messageList.value[index] = {
          value: msg,
          self: false,
          createTime: Date.now(),
          id: generateUniqueUid(),
        };
        scrollBottom();
      },
    });
  });

  //监听消息接收
  SocketTask.onMessage((event) => {
    try {
      const content = JSON.parse(event.data).content;
      if (!!content) {
        if (init) {
          messageList.value[index].value += content;
        } else {
          messageList.value[index + 1].value += content;
        }
      }
    } catch (err) {
      switch (event.data) {
        case "[INTERRUPTED]":
        case "[MODEL_TIMEOUT]":
        case "TEMPERATURE_THRESHOLD":
        case "[TOKENS]":
          loading.value = false;
          break;
        case "[DONE]":
          saveMessageListData(messageList.value);
          if (init) {
            play(messageList.value[index]);
          } else {
            play(messageList.value[index + 1]);
          }
          scrollBottom();
          init = false;
          break;
        default:
          console.log("😄message error", err);
          break;
      }
    }
  });

  //监听连接关闭事件
  SocketTask.onClose((err) => {
    console.log("😄您已断开ALO7_GPT websocket服务", err);
    inputMessage.value = "";
    loading.value = false;
    if (err.code == 1006) {
      SocketTask.currentStatus = "timeout";
      timeoutCallback(err);
    } else if (err.reason === "interrupted") {
      SocketTask.currentStatus = "interrupted";
    } else {
      SocketTask.currentStatus = "close";
    }
  });

  wx.onSocketError((err) => {
    console.log("err", err);
  });
  //监听错误
  SocketTask.onError((err) => {
    console.log("连接错误，请联系ALO7-GPT开发者", err);
  });

  //关闭socket
  function close() {
    SocketTask.close();
  }

  //发送消息
  const sendMessage = debounce(async (content) => {
    if (SocketTask.currentStatus !== "open") return;
    msg = content;
    if (!hasMessage.value) return;
    loading.value = true;
    index = messageList.value.length;
    SocketTask.send({
      data: msg,
      success: (e) => {
        messageList.value[index] = {
          value: inputMessage.value,
          self: true,
          createTime: Date.now(),
          id: generateUniqueUid(),
        };
        messageList.value[index + 1] = {
          value: "",
          self: false,
          createTime: Date.now(),
          id: generateUniqueUid(),
        };
        inputMessage.value = "";
        scrollBottom();
      },
      fail: (e) => {
        console.log("sendMessage error", e);
      },
    });
  });

  //list滚动
  function scroll(e) {
    oldScrollTop = e.detail.scrollTop;
  }

  function scrollToTop(v) {
    scrollTop.value = oldScrollTop;
    nextTick(() => {
      scrollTop.value = v;
    });
  }

  //滚动到聊天列表底部
  function scrollBottom() {
    wx.createSelectorQuery()
      .select("#viewCommunicationBody")
      .boundingClientRect(function (rect) {
        scrollToTop(rect.height);
      })
      .exec();
  }

  //缓存聊天数据
  function saveMessageListData(messageList) {
    try {
      wx.setStorageSync("messageList", messageList);
    } catch (err) {
      console.log("saveMessageListData error", err);
    }
  }
  return {
    sendMessage,
    inputMessage,
    messageList,
    loading,

    close,
    scroll,
    scrollTop,
    SocketTask,
    hasMessage,
  };
}
