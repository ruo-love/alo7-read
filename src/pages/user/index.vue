<template>
  <view>
    <a7-cell-card
      margin="0"
      padding="16px"
      left_icon_src="../../static/images/portrait_boy@3x.png"
      hide_right_icon
      show_bottom_line
      :content="userInfo.chineseName"
    >
    </a7-cell-card>
    <a7-cell-card
      margin="0"
      padding="16px"
      title="英文名"
      hide_right_icon
      show_bottom_line
      :content="userInfo.englishName"
    >
    </a7-cell-card>
    <a7-cell-card
      margin="0"
      padding="16px"
      title="爱乐号"
      hide_right_icon
      show_bottom_line
      :content="userInfo.passportId"
    >
    </a7-cell-card>
    <a7-cell-card
      margin="0"
      padding="16px"
      title="手机号"
      hide_right_icon
      show_bottom_line
    >
      <view @click="toggleAccount">
        <text class="phone">{{ formatPhone }}</text
        ><text class="tip">切换账号</text>
      </view>
    </a7-cell-card>
  </view>
</template>
<script setup>
import { computed } from "vue";
import useUserStore from "../../store/user.js";
const { userInfo, logout } = useUserStore();

const formatPhone = computed(() =>
  userInfo.mobilePhone?.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2")
);

function toggleAccount() {
  uni.showModal({
    title: "提示",
    content: "确定要切换账号吗？",
    success: function (res) {
      if (res.confirm) {
        logout();
      } else if (res.cancel) {
        console.log("用户点击取消");
      }
    },
  });
}
</script>
<style lang="scss" scoped>
.tip {
  margin-left: 20px;
  font-size: 16px;
  color: #25a5f7;
  text-align: center;
}
</style>