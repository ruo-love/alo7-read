<template>
  <div class="a7-scroll-tabs">
    <scroll-view
      class="scroll-view-container"
      :scroll-x="true"
      @scroll="scroll"
      scroll-left="120"
      :scroll-into-view="scrollIntoView"
    >
      <view
        class="a7-scroll-tabs-item item"
        v-for="item in 10"
        :id="item"
        :key="item"
        >{{ item }}</view
      >
    </scroll-view>
  </div>
</template>
<script>
export default {
  props: {},
  data() {
    return {
      scrollIntoView: "",
    };
  },
  methods: {
    scroll(e) {
      //   console.log(e);
    },
  },
  watch: {
    scrollIntoView(val) {
      console.log(val);
    },
  },
};
</script>
<style lang="scss" scoped>
.a7-scroll-tabs {
  border: 1px solid red;
  .scroll-view-container {
    white-space: nowrap;
    .a7-scroll-tabs-item {
      display: inline-block;
    }
    .item {
      margin: 10px 20px;
      width: 80px;
      height: 80px;
      line-height: 300rpx;
      text-align: center;
      font-size: 36rpx;
      border: 1px solid yellow;
      border-radius: 50%;
    }
  }
}
</style>