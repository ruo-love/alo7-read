<template>
  <view @click="handleClick" class="cell-card-wrap" :class="show_bottom_line && 'show_bottom_line'" :style="cellStyle">
    <view v-if="show_fineshed_icon" class="fineshed_wrap fineshed_icon_wrap" :style="fineshedIconSize">
      <image
        class="fineshed_icon"
        v-if="fineshed"
        src="https://web-alo7-com.oss-cn-beijing.aliyuncs.com/wx-teacher-app/images/ic_vip%20succeed%402x.png"
      >
      </image>
      <image
        class="fineshed_icon"
        v-else
        src="https://web-alo7-com.oss-cn-beijing.aliyuncs.com/wx-teacher-app/images/ic_unfinish%402x.png"
      >
      </image>
    </view>
    <view v-if="left_icon_src.length" class="left_icon_wrap" :style="leftIconSize">
      <slot name="left_icon">
        <image class="left_icon" :class="{ circle: circle, logout_avator: gray }" :src="left_icon_src"></image>
      </slot>
    </view>
    <view class="title-wrap">
      <slot name="title">
        <view class="title">{{ title }}</view>
        <view class="sub_title">{{ sub_title }}</view>
      </slot>
      <slot name="bottom"></slot>
    </view>
    <view class="content-wrap">
      <!-- 此处默认插槽可搭配 cellContentModel 使用 ⬇️ -->
      <slot>
        <text class="content">{{ content }}</text>
      </slot>
      <slot name="right_icon">
        <image v-if="!hide_right_icon" class="right_icon" :src="right_icon_src"></image>
      </slot>
    </view>
  </view>
</template>

<script>
/**
 *
 */
export default {
  name: 'a7CellCard',
  emits: ['tapCell'],
  props: {
    left_icon_src: {
      //左侧Icon 图片地址
      type: String,
      default: ''
    },
    right_icon_src: {
      //右侧Icon 图片地址，如需隐藏需传递 hide_right_icon
      type: String,
      default: 'https://web-alo7-com.oss-cn-beijing.aliyuncs.com/wx-teacher-app/images/ic_arrows_list%402x.png'
    },
    hide_right_icon: {
      //隐藏右侧默认的icon
      type: Boolean,
      default: false
    },
    title: {
      //主标题
      type: String,
      default: ''
    },
    sub_title: {
      //副标题
      type: String,
      default: ''
    },
    content: {
      //右侧内容
      type: String,
      default: ''
    },
    circle: {
      //左侧icon 是否为圆形
      type: Boolean,
      default: false
    },
    fineshed: {
      //ineshed_icon 完成状态
      type: Boolean,
      default: false
    },
    show_fineshed_icon: {
      //是否显示fineshed_icon 默认不显示
      type: Boolean,
      default: false
    },
    cell_color: {
      //cell 背景色 不需要背景色可以设置为 'unset'
      type: String,
      default: '#fff'
    },
    card: {
      //卡片样式
      type: Boolean,
      default: false
    },
    padding: {
      //cellCard padding  单位px
      type: String,
      default: '8px 16px'
    },
    margin: {
      //cellCard margin  单位px
      type: String,
      default: '8px 16px'
    },
    fineshed_icon_size: {
      //左侧fineshed_icon 大小  单位px
      type: Number,
      default: 22
    },
    design_width: {
      // 设计稿大小 默认375
      type: Number,
      default: 375
    },
    left_icon_size: {
      //左侧icon 大小  单位px
      type: Number,
      default: 36
    },
    show_bottom_line: {
      //是否显示底部线条
      type: Boolean,
      default: false
    },
    gray: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    leftIconSize() {
      return `width:${this.toRpx(this.left_icon_size)}rpx;height:${this.toRpx(this.left_icon_size)}rpx;`;
    },
    fineshedIconSize() {
      return `width:${this.toRpx(this.fineshed_icon_size)}rpx;height:${this.toRpx(this.fineshed_icon_size)}rpx;`;
    },
    cellStyle() {
      const common = `padding:${this.padding};background-color: ${this.cell_color};margin:${this.margin};`;
      return this.card ? common + `border-radius: 10px;` : common;
    }
  },
  methods: {
    handleClick(e) {
      this.$emit('tapCell', e);
    },
    toRpx(v) {
      return (750 / this.design_width) * v;
    }
  }
};
</script>

<style scoped>
.cell-card-wrap {
  display: flex;
  font-size: 16px;
  align-items: center;
  color: #666666;
}

.content-wrap {
  display: flex;
  align-items: center;
  color: #999999;
}

.title-wrap {
  padding-left: 16rpx;
  flex: 1;
}

.sub_title {
  font-size: 13px;
  color: #999999;
}

.right_icon {
  margin-left: 8px;
  width: 10px;
  height: 18px;
}

.left_icon_wrap .left_icon {
  width: 100%;
  height: 100%;
}

.left_icon_wrap .circle {
  border-radius: 50%;
}

.fineshed_icon_wrap {
  margin-right: 40rpx;
  width: 44rpx;
  height: 44rpx;
}

.fineshed_icon_wrap .fineshed_icon {
  width: 100%;
  height: 100%;
}

.show_bottom_line {
  border-bottom: 0.8px solid #f3f2f2;
}
.logout_avator {
  filter: grayscale(100%);
}
</style>
