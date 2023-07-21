import { defineStore } from "pinia";
import { login_API, register_API } from "../api/user";

export default defineStore("user", {
  state: () => {
    return {
      auth_info: wx.getStorageSync("auth_info") || {},
    };
  },
  getters: {
    isLogin: (state) => (state.auth_info?.meta?.accessToken ? true : false),
    userInfo: (state) => state.auth_info.data,
  },
  actions: {
    async login(data) {
      const params = {
        serviceName: "axt-api",
        userType: "USER",
      };
      try {
        const res = await login_API({
          ...params,
          ...data,
        });
        this.auth_info = res;
        uni.setStorageSync("auth_info", res);
        return res;
      } catch (err) {
        console.log(err);
        return Promise.reject(err);
      }
    },
    async register(data) {
      const params = {
        serviceName: "axt-api",
        userRole: "TEACHER",
      };
      const res = await register_API({
        ...params,
        ...data,
      });
      if (res.statusCode === 200) {
        uni.showToast({
          title: "注册成功",
          icon: "none",
        });
        return Promise.resolve(res);
      } else {
        uni.showToast({
          title: res.data,
          icon: "none",
        });
        return Promise.reject(res);
      }
    },
    logout() {
      this.accessToken = null;
      this.mobilePhone = null;
      this.userInfo;
      uni.removeStorageSync("accessToken");
      uni.removeStorageSync("mobilePhone");
      uni.navigateTo({
        url: "/pages/login/index",
      });
    },
  },
});
