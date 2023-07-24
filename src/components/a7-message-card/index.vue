<template>
  <view
    v-if="content.length"
    class="a7-message-card"
    :class="self ? 'self' : 'robot'"
  >
    <view class="message-wrap">
      <view v-if="!self" class="control-wrap">
        <view class="play-btn">
          <image
            v-if="recordLoading"
            src="../../static/images/recordloading.gif"
            class="icon-20 round"
          ></image>
          <image
            @click="$emit('play', content)"
            v-else-if="!self && !recordLoading"
            class="icon-20 round"
            :src="
              playing
                ? '../../static/images/btn_playsource_playing.gif'
                : '../../static/images/btn_playsource@3x.png'
            "
          ></image>
          <text v-if="duration" class="duration">{{ duration }}</text>
        </view>
        <image
          @click="$emit('translate', content)"
          class="translate-btn icon-30"
          src="../../static/images/fanyi.png"
        ></image>
      </view>
      <view class="content">
        {{ content }}
      </view>
      <view v-if="!self && text.length" class="translate-content">{{
        text
      }}</view>
    </view>
  </view>
</template>

<script>
export default {
  emits: ["play", "translate"],
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
    duration: {
      type: [String, Number],
      default: 0,
    },
    text: {
      type: String,
      default: "",
    },
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

<style scoped lang="scss">
.a7-message-card {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  &.self {
    align-items: flex-end;
  }
}

.message-wrap {
  max-width: 75% !important;
}
.robot .message-wrap {
  display: inline-block;
  margin-top: 16px;
  padding: 30rpx;
  padding-bottom: 10rpx;
  font-size: 16px;
  color: #fff;
  background-color: #0092ff;
  border-radius: 8px;
  box-shadow: none;
}
.self .message-wrap {
  display: flex;
  justify-content: flex-end;
  background-color: unset;
  box-shadow: none;
}
.control-wrap {
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .play-btn {
    display: flex;
    align-items: center;
    padding: 0px 4px;
    height: 30px;
    background-color: #79bff5;
    border-radius: 10px;
    .duration {
      margin-left: 6px;
      color: #fff;
      font-size: 12px;
    }
  }
  .translate-btn {
  }
}

.self .message-wrap .content {
  margin: 8px 0;
  padding: 30rpx;
  font-size: 16px;
  color: #fff;
  background-color: rgba($color: #378fff, $alpha: 0.8);
  border-radius: 8px;
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
.translate-content {
  margin-top: 6px;
  font-size: 14px;
  color: #79bff5;
}
</style>