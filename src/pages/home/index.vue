<template>
  <view
    class="home-page"
    :style="{
      'padding-top': systemStore.headerTop + 'px',
    }"
  >
    <view v-if="isLogin" class="home-wrap">
      <a7-cell-card
        left_icon_size="56"
        left_icon_src="../../static/images/portrait_boy@3x.png"
        padding="0"
        margin="0 0 40px"
        circle
        hide_right_icon
      >
        <template #title>
          <view class="title ml-20">{{ userInfo.chineseName }}</view>
        </template>
      </a7-cell-card>
      <view class="card my-20 p-20">
        <a7-cell-card hide_ri hide_right_icon padding="0" margin="30px 0">
          <template #title>
            <view class="title">Tony</view>
          </template>
          <template #right_icon>
            <image
              src="../../static/images/ic_shiyong@3x.png"
              mode="scaleToFill"
              class="icon-72 circle"
            />
          </template>
        </a7-cell-card>
        <view class="text-center">
          <view class="btn" @click="enterChatRoom"> 自由对话 </view>
        </view>
      </view>
      <view
        @click="navigateTo('/pages/select-grade/index')"
        class="card my-20 p-20"
      >
        <view class="title">选择口语搭档</view>
        <view class="flex" style="height: 48px; padding-top: 20px">
          <view class="sub-title">选择级别</view>
          <view class="text-center flex-1 overlap-wrap">
            <image
              src="../../static/images/portrait_boy@3x.png"
              mode="scaleToFill"
              class="icon-48 circle grade-icon"
            />
            <image
              src="../../static/images/portrait_boy@3x.png"
              mode="scaleToFill"
              class="icon-48 circle grade-icon"
            />
            <image
              src="../../static/images/portrait_boy@3x.png"
              mode="scaleToFill"
              class="icon-48 circle grade-icon"
            />
          </view>
        </view>
      </view>
    </view>
    <view v-else class="auth">
      <image
        class="bg"
        src="../../static/images/img_landing_phone@3x.png"
        mode="widthFix"
      ></image>
      <view class="auth-btn" @click="auth"> 授权登录 </view>
    </view>
  </view>
</template>

<script setup>
import { generateUniqueUid } from "../../utils/tool";
import useUserStore from "../../store/user.js";
import useSystemStore from "../../store/system.js";
import { navigateTo } from "../../utils/common.js";
const { isLogin, userInfo } = useUserStore();

const systemStore = useSystemStore();
systemStore.getStatusbarHeight();

function enterChatRoom() {
  uni.navigateTo({
    url: "/pages/chat/index?uid=" + generateUniqueUid(),
  });
}

function auth() {
  uni.navigateTo({
    url: "/pages/login/index",
  });
}
</script>

<style lang="scss" scoped>
.home-page {
  box-sizing: border-box;
  height: 100vh;
  background: #fff;
  .home-wrap {
    padding: 40rpx 80rpx;
    .title {
      font-size: 20px;
      color: #282c35;
    }
    .sub-title {
      width: 140px;
      line-height: 48px;
      font-size: 16px;
      color: #666;
    }
    .overlap-wrap {
      position: relative;
      .grade-icon {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
      }
      .grade-icon:nth-child(1) {
        left: 0px;
      }
      .grade-icon:nth-child(2) {
        left: 24px;
      }
      .grade-icon:nth-child(3) {
        left: 48px;
      }
    }
  }
}

.auth {
  text-align: center;
}
.auth-btn {
  position: absolute;
  left: 50%;
  bottom: 30px;
  transform: translateX(-50%);
  width: 50%;
  height: 50px;
  text-align: center;
  line-height: 50px;
  color: #fff;
  z-index: 999;
  border-radius: 50px;
  opacity: 1;
  background-color: #10b56d;
}
.auth-btn:active {
  opacity: 0.9;
}
</style>