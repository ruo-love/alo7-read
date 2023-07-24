<template>
  <view style="height: 100vh">
    <view class="login_bg_warp">
      <image
        mode="widthFix"
        style="width: 80%"
        src="https://web-alo7-com.oss-cn-beijing.aliyuncs.com/wx-teacher-app/images/img_landing_phone%202%402x.png"
      ></image>
    </view>
    <view class="login_control-warp">
      <view class="privacy_agreement_warp">
        <view>
          <image class="check_icon" :src="iconSrc" @click="changeChecked">
          </image>
        </view>
        <view>
          <text>同意</text>
          <text style="color: #25a5f7" @click="handlePrivacyAgreement('serve')"
            >《爱品优用户服务条款》</text
          >
          <text>和</text>
          <text
            style="color: #25a5f7"
            @click="handlePrivacyAgreement('privacy')"
            >《爱品优用户隐私条款》</text
          >
        </view>
      </view>
      <view>
        <button
          class="auth_login"
          :class="checked ? '' : 'loging_btn_unchecked'"
          hover-class="login_btn_hover"
          :open-type="checked ? 'getPhoneNumber' : ''"
          @click="showToast"
          @getphonenumber="authorizedLgin"
        >
          <text style="color: white">微信授权登录</text>
        </button>
      </view>
    </view>
  </view>
</template>
  <script setup>
import { computed, ref } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import { throttle } from "@/utils/tool";

const checked = ref(false);
const iconSrc = computed(() =>
  checked.value
    ? "https://web-alo7-com.oss-cn-beijing.aliyuncs.com/wx-teacher-app/images/ic_finish%402x.png"
    : "https://web-alo7-com.oss-cn-beijing.aliyuncs.com/wx-teacher-app/images/ic_no_checked%402x.png"
);

const showToast = throttle(() => {
  if (!checked.value) {
    uni.showToast({
      title: "请同意并阅读《爱品优用户服务条款》和《爱品优用户隐私条款》",
      icon: "none",
    });
  }
}, 1500);

function handlePrivacyAgreement(type) {
  uni.navigateTo({
    url: "/pages/privacy-agreement/index?type=" + type,
  });
}

function changeChecked() {
  checked.value = !checked.value;
  //   wx.a7.hideToast("toast");
}

async function authorizedLgin({ detail }) {
  //   const { openid } = nx.$local.get("mp_auth");
  //   const { code } = detail;
  //   if (code) {
  //     await nx.$call("app.bind", { code });
  //   } else {
  //     uni.showToast({
  //       title: "微信登录失败",
  //       icon: "none",
  //     });
  //   }
}

onLoad(async () => {
  //   await nx.$call("app.mpLogin");
  //   await nx.$call("user.getTeacherInfo");
});
</script>
  <style>
.login_bg_warp {
  padding-top: 30px;
  box-sizing: border-box;
  text-align: center;
}

.login_control-warp {
  box-sizing: border-box;
  width: 100%;
  padding: 0 48rpx;
  position: absolute;
  bottom: 26px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.privacy_agreement_warp {
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #999;
}

.auth_login {
  margin-top: 12px;
  font-size: 18px;
  text-align: center;
  height: 44px;
  line-height: 44px;
  border-radius: 44px;
  background-color: #08c160;
}

.loging_btn_unchecked {
  background-image: linear-gradient(269deg, #08c160 0%, #08c160 100%);
  opacity: 0.5;
}

.login_btn_hover {
  opacity: 0.8;
}

.check_icon {
  margin-right: 4px;
  width: 15px;
  height: 15px;
  vertical-align: bottom;
}
</style>
  