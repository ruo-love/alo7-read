<template>
  <view
    v-if="content.length"
    class="a7-message-card"
    :class="self ? 'self' : 'robot'"
  >
    <view class="message-wrap">
      <!-- v-if="self" -->
      <view class="content">
        {{ content }}
      </view>
      <!-- <rich-text v-else :nodes="mdi.render(content)"></rich-text> -->
      <view style="display: flex; justify-content: flex-end; margin-top: 10px">
        <image
          v-if="recordLoading"
          src="../../static/images/recordloading.gif"
          class="icon-20"
        ></image>
        <image
          @click="$emit('play', content)"
          v-else-if="!self && !recordLoading"
          class="icon-20"
          :src="
            playing
              ? '../../static/images/btn_playsource_playing.gif'
              : '../../static/images/btn_playsource@3x.png'
          "
        ></image>
      </view>
    </view>
    <view :class="self ? 'self_time' : 'robot_time'">{{ time }}</view>
  </view>
</template>

<script>
// import {
// 	mdRender
// } from '../../utils/tool.js'

export default {
  emits: ["play"],
  props: {
    self: {
      type: Boolean,
      default: false,
    },
    content: {
      type: String,
      default: false,
    },
    playing: {
      type: Boolean,
      default: false,
    },
    recordLoading: {
      type: Boolean,
      default: false,
    },
    createTime: {
      type: Number,
      default: false,
    },
  },
  data() {
    return {
      // mdi: mdRender()
    };
  },
  computed: {
    time() {
      const date = new Date(this.createTime);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const formattedDateTime = `${year}年${month}月${day}日 ${hours}:${minutes}`;
      return formattedDateTime;
    },
  },
};
</script>

<style scoped>
.a7-message-card {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
}
.robot {
  display: flex;
}

.robot .message-wrap {
  display: inline-block;
  margin-top: 16px;
  padding: 30rpx;
  padding-bottom: 10rpx;
  font-size: 16px;
  color: #282c35;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0px 0px -10px #ccc;
}

.self .message-wrap {
  display: flex;
  justify-content: flex-end;
  background-color: unset;
}

.self .message-wrap .content {
  margin: 8px 0;
  padding: 30rpx;
  font-size: 16px;
  color: #fff;
  background-color: #0092ff;
  border-radius: 8px;
  box-shadow: 0px 0px -10px #ccc;
}

.content {
  display: inline-block;
}

.icon-20 {
  margin-left: 6px;
  width: 20px;
  height: 20px;
  vertical-align: middle;
}

.ani-play {
  animation: speaker-animation 1s infinite;
}

@keyframes speaker-animation {
  0%,
  100% {
    transform: scale(0.8);
  }

  50% {
    transform: scale(0.7);
  }
}
.robot_time,
.self_time {
  padding: 6px;
  font-size: 12px;
  color: #ccc;
}
.self_time {
  text-align: right;
}
</style>