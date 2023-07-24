<template>
  <view class="chat-page">
    <scroll-view
      scroll-y="true"
      @scroll="socketTarget.scroll"
      class="scroll-Y scroll-view-wrap"
      :scroll-top="socketTarget.scrollTop"
    >
      <view id="viewCommunicationBody">
        <a7-message-card
          :recordLoading="currentPlayId === message.id && recordLoading"
          :playing="currentPlayId === message.id && playing"
          @play="play(message)"
          v-for="message in messageList"
          :key="message.id"
          :self="message.self"
          :content="message.value"
          :createTime="message.createTime"
          :duration="message.duration"
        />
      </view>
    </scroll-view>
    <view class="footer-wrap">
      <view v-show="recording" class="prompt-ani prompt-layer prompt-layer-1">
        <view class="prompt-loader">
          <view class="em" v-for="(item, index) in 15" :key="index"></view>
        </view>
        <text class="p">{{ "剩余：" + second + "s" }}</text>
        <text class="span">松手结束录音</text>
      </view>
      <view class="message-wrap">
        <view
          class="voice-wrap right-wrap flex-center"
          :class="{ recording: recording }"
          @touchstart="start"
          @touchend="stop"
          @touchcancel="stop"
        >
          <image class="icon-72 icon-voice" src="../../static/images/mk.png">
          </image>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import useRecorder from "../../hooks/record/use-record.js";
import useWebsocketChat from "../../hooks/chat/use-websocket-chat.js";
import V3 from "../../hooks/asr/v3.js";
import { V1 } from "../../hooks/asr/v1.js";
import asrConfig from "../../hooks/asr/asr.js";
import ttsConfig from "../../hooks/asr/tts.js";
import { ref, reactive, computed, onBeforeUnmount } from "vue";
import { onLoad, onShow } from "@dcloudio/uni-app";
import useUserStore from "../../store/user.js";
import { getTimestampOfNDaysAgo } from "../../utils/tool.js";
const userStore = useUserStore();
let uid = null;
const socketTarget = ref({});
const fileMap = new Map();
const { start, stop, recording } = useRecorder(onStartCallback, onStopCallBack);
const isVoice = ref(true);
const second = ref(60);
const playing = ref(false);
const recordLoading = ref(false);
const messageList = ref([]);
const left_btn_src = computed(() => {
  return isVoice.value
    ? "https://web-alo7-com.oss-cn-beijing.aliyuncs.com/wx-teacher-app/alo7-read/jp.png"
    : "https://web-alo7-com.oss-cn-beijing.aliyuncs.com/wx-teacher-app/alo7-read/voice.png";
});
let currentPlayId = ref(null);
let timer = null;
const fs = wx.getFileSystemManager();
const audioContext = wx.createInnerAudioContext();
audioContext.autoplay = false;
onLoad((options) => {
  uid = options.uid;
  const minTime = getTimestampOfNDaysAgo();
  messageList.value = (wx.getStorageSync("messageList") || []).filter(
    (e) => e.createTime >= minTime
  );
});

onShow(() => {
  // 退至后台socket被中断，再次进入页面重新连接
  if (
    socketTarget.value.SocketTask &&
    socketTarget.value.SocketTask.currentStatus === "interrupted"
  ) {
    timeoutCallback();
  } else {
    //第一次进入页面 连接socket
    socketTarget.value = useWebsocketChat({
      messageList,
      uid,
      uuid: userStore.userInfo.uuid,
      first: true,
      timeoutCallback,
      play,
    });
  }
});

audioContext.onPlay((e) => {
  recordLoading.value = false;
  playing.value = true;
});
audioContext.onEnded((e) => {
  playing.value = false;
  currentPlayId.value = null;
});

/**
 * 当socketl 60s秒内没有传输或者小程序退到后台，socket会自动终端
 * timeoutCallback用于重新连接socket服务
 */
function timeoutCallback() {
  // const oldMessageList = socketTarget.value.messageList;
  socketTarget.value = useWebsocketChat({
    messageList,
    uid,
    uuid: userStore.userInfo.uuid,
    first: false,
    timeoutCallback,
    play,
  });
  // 同步之前的会话内容
  // socketTarget.value.messageList = oldMessageList;
}

/**
 * 开始录音回调
 */
function onStartCallback() {
  timer = setInterval(() => {
    second.value -= 1;
    if (second.value <= 0) {
      clearInterval(timer);
      second.value = 60;
    }
  }, 1000);
}

/**
 * 录音结束后的回调函数
 * @param {*} file
 */
function onStopCallBack(file) {
  clearInterval(timer);
  second.value = 60;

  // 转换成base64后，发送到腾讯云服务，获取翻译后的文本
  wx.getFileSystemManager().readFile({
    filePath: file.tempFilePath,
    encoding: "base64", //编码格式
    success: (res) => {
      //成功的回调
      tencentCloudApi(asrConfig["SentenceRecognition"], {
        EngSerViceType: "16k_en",
        SourceType: 1,
        VoiceFormat: "mp3",
        Data: res.data,
        DataLen: file.fileSize,
      })
        .then((result) => {
          // if (result.data.Response.Error) {
          //   throw result.data.Response.Error;
          // }
          // if (result.data.Response.Result == "") {
          //   throw {
          //     Code: "FailedOperation.ErrorRecognize",
          //   };
          // }
          socketTarget.value.inputMessage.value = "java";
          // socketTarget.value.inputMessage.value = result.data.Response.Result;
          // 将解析后的文本 作为message发送到gpt 服务
          socketTarget.value.sendMessage(socketTarget.value.inputMessage.value);
        })
        .catch((err) => {
          switch (err.Code) {
            case "FailedOperation.ErrorRecognize":
              uni.showToast({
                title: "抱歉，我听不太清楚，请声音大一点",
                icon: "none",
              });
          }
          // loadingMode.text = "我听不太清楚";
        });
    },
  });
}

/**
 * 将文本合成语音并播放
 * @param {*} message
 */
function play(message) {
  currentPlayId.value = message.id;
  recordLoading.value = true;
  // 如果之前已经合成过，则直接复用

  if (fileMap.get(message.id)) {
    audioContext.src = fileMap.get(message.id);
    audioContext.play();
    console.log("复用");
  } else {
    //注意 语音合成最多支持1800个英文字符
    if (message.value.length >= 1750) {
      uni.showToast({
        title: "抱歉内容太多了,难倒我了",
        icon: "none",
      });
      recordLoading.value = false;
      return;
    }
    const { Signature, params } = V1(ttsConfig.TextToStreamAudio, {
      Text: message.value,
      SessionId: message.id,
      VoiceType: 1051,
    });
    wx.request({
      method: "POST",
      url: "https://tts.cloud.tencent.com/stream",
      header: {
        "Content-Type": "application/json",
        Authorization: Signature,
      },
      responseType: "arraybuffer", // 设置响应类型为 arraybuffer
      data: params,
      success(res) {
        // 获取到响应的二进制数据
        const arrayBuffer = res.data;

        // 将 arrayBuffer 转为 base64 字符串
        const base64String = wx.arrayBufferToBase64(arrayBuffer);

        // 将 base64 字符串转为文件
        const filePath = `${wx.env.USER_DATA_PATH}/${message.id}.mp3`;
        wx.getFileSystemManager().writeFile({
          filePath,
          data: base64String,
          encoding: "base64",
          success(e) {
            console.log("文件保存成功", e);
            fileMap.set(message.id, filePath);
            audioContext.src = filePath;
            audioContext.messageId = message.id;
            audioContext.play();
            const timer = setInterval(() => {
              console.log(12, audioContext.duration);
              if (audioContext.duration) {
                clearInterval(timer);
                for (let i = 0; i < messageList.value.length; i++) {
                  if (messageList.value[i].id === audioContext.messageId) {
                    messageList.value[i].duration =
                      audioContext.duration.toFixed(2);
                    socketTarget.value.saveMessageListData();
                    break;
                  }
                }
              }
            }, 1000);

            // 可以使用 filePath 进行后续操作，如播放音频或显示图像等
          },
          fail(error) {
            console.error("文件保存失败", error);
          },
        });
      },
      fail(error) {
        console.error("网络请求失败", error);
      },
    });
  }
}

/**
 * 卸载音频和socket
 */
onBeforeUnmount(() => {
  socketTarget.value.close();
  audioContext.destroy();
});

/**
 * 腾讯云api服务调用函数
 */
function tencentCloudApi(config, data) {
  const {
    authorization,
    timestamp,
    host,
    action,
    version,
    region,
    ContentType,
  } = V3(config, data);
  return uni.request({
    url: `https://${host}`,
    method: "POST",
    header: {
      Authorization: authorization,
      "Content-Type": ContentType,
      Host: host,
      "X-TC-Action": action,
      "X-TC-Timestamp": timestamp,
      "X-TC-Version": version,
      "X-TC-Region": region,
    },
    data,
  });
}
</script>

<style>
@import url(../../static/style/record.css);
@import url(../../static/style/spinner.css);
@import url(./index.css);
</style>../../hooks/record/use-record.js