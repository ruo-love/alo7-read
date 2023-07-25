import { defineStore } from "pinia";

export default defineStore("system", {
  state: () => ({
    statusBarHeight: 0,
    navigationHeight: 0,
    safeBottom:0
  }),
  actions: {
    async getStatusbarHeight() {
      const systemInfo = uni.getSystemInfoSync();

      this.safeBottom=systemInfo.screenHeight-systemInfo.safeArea.bottom
      this.statusBarHeight = systemInfo.statusBarHeight;
      const menuButtonInfo = uni.getMenuButtonBoundingClientRect();
      this.navigationHeight =
        (menuButtonInfo.top - this.statusBarHeight) * 2 + menuButtonInfo.height;
      console.log(this.navigationHeight);
    },
  },
  getters: {
    headerTop(state) {
      return state.statusBarHeight + state.navigationHeight;
    },
  },
});
