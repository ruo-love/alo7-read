<template>
  <view class="select-grade-page">
    <view class="title"> 选择口语搭档 </view>
    <view class="tabs-wrap">
      <view class="tabs">
        <u-tabs
          :list="tabList"
          :current="currentTab"
          @change="switchTab"
          :inactiveStyle="tabStyle.inactiveStyle"
          :activeStyle="tabStyle.activeStyle"
          :lineColor="tabStyle.lineColor"
          :lineWidth="tabStyle.lineWidth"
          :lineHeight="tabStyle.lineHeight"
          :itemStyle="tabStyle.itemStyle"
        ></u-tabs>
      </view>
    </view>
    <view class="content-wrap">
      <view class="category-wrap my-20">
        <scroll-view
          scroll-with-animation
          enable-flex
          class="scroll-view-container"
          :scroll-left="scrollLeft"
          :scroll-x="true"
        >
          <view
            v-for="(category, i) in currentTabData"
            :key="i"
            class="a7-scroll-tabs-item mx-10"
            @click="selectCategory(i)"
          >
            <view
              class="category-item"
              :class="{ active: i == curentCategory }"
            >
              <img src="../../static/images/portrait_boy@3x.png" class="icon" />
              <view class="category-name">{{ category.name }}</view>
            </view>
          </view>
        </scroll-view>
      </view>
      <view class="title"> GE1级别 </view>
      <view class="title"> GE1级别 简单单词 </view>
    </view>
    <view class="text-center mt-20"
      ><view class="btn" @click="enterChatRoom">开始对话</view></view
    >
  </view>
</template>
<script setup>
import { ref, reactive, computed } from "vue";
import { generateUniqueUid } from "../../utils/tool";

const tabList = ref([
  {
    name: "入门",
    value: "A",
  },
  {
    name: "初级",
    value: "B",
  },
  {
    name: "高级",
    value: "C",
  },
]);
const tabStyle = reactive({
  inactiveStyle: {
    color: "#999",
    fontSize: "18px",
  },
  activeStyle: {
    color: "#1c1f2b",
    fontSize: "20px",
  },
  itemStyle: {
    flex: "1",
    paddingBottom: "10px",
  },
  lineColor: "#1c1f2b",
  lineWidth: 30,
  lineHeight: 4,
});
const curentCategory = ref(1);
const scrollLeft = ref(0);
const currentTab = ref(0);
const data = reactive({
  A: [
    {
      icon: "../../static/images/portrait_boy@3x.png",
      name: "Tony-A",
      tags: ["GE1级别", "简单单词"],
    },
    {
      icon: "../../static/images/portrait_boy@3x.png",
      name: "Amy-A",
      tags: ["GE1级别", "简单单词"],
    },
    {
      icon: "../../static/images/portrait_boy@3x.png",
      name: "TIM-A",
      tags: ["GE1级别", "简单单词"],
    },
    {
      icon: "../../static/images/portrait_boy@3x.png",
      name: "Bob-A",
      tags: ["GE1级别", "简单单词"],
    },
    {
      icon: "../../static/images/portrait_boy@3x.png",
      name: "Andy-A",
      tags: ["GE1级别", "简单单词"],
    },
  ],
  B: [
    {
      icon: "../../static/images/portrait_boy@3x.png",
      name: "Tony-B",
      tags: ["GE1级别", "简单单词"],
    },
    {
      icon: "../../static/images/portrait_boy@3x.png",
      name: "Amy-B",
      tags: ["GE1级别", "简单单词"],
    },
    {
      icon: "../../static/images/portrait_boy@3x.png",
      name: "TIM-B",
      tags: ["GE1级别", "简单单词"],
    },
    {
      icon: "../../static/images/portrait_boy@3x.png",
      name: "Bob-B",
      tags: ["GE1级别", "简单单词"],
    },
    {
      icon: "../../static/images/portrait_boy@3x.png",
      name: "Andy-B",
      tags: ["GE1级别", "简单单词"],
    },
  ],
  C: [
    {
      icon: "../../static/images/portrait_boy@3x.png",
      name: "Tony-C",
      tags: ["GE1级别", "简单单词"],
    },
    {
      icon: "../../static/images/portrait_boy@3x.png",
      name: "Amy-C",
      tags: ["GE1级别", "简单单词"],
    },
    {
      icon: "../../static/images/portrait_boy@3x.png",
      name: "TIM-C",
      tags: ["GE1级别", "简单单词"],
    },
    {
      icon: "../../static/images/portrait_boy@3x.png",
      name: "Bob-C",
      tags: ["GE1级别", "简单单词"],
    },
    {
      icon: "../../static/images/portrait_boy@3x.png",
      name: "Andy-C",
      tags: ["GE1级别", "简单单词"],
    },
  ],
});
const currentTabData = computed(() => {
  return data[tabList.value[currentTab.value].value];
});
function switchTab(item) {
  currentTab.value = item.index;
}
function selectCategory(index) {
  curentCategory.value = index;
  if (index >= 2) {
    scrollLeft.value = (index - 1) * 112;
  }
}
function enterChatRoom() {
  uni.navigateTo({
    url: "/pages/chat/index?uid=" + generateUniqueUid(),
  });
}
</script>
<style lang="scss" scoped>
.select-grade-page {
  box-sizing: border-box;
  padding: 40px 20px 0;
  height: 100vh;
  background-color: #fff;
  .title {
    height: 48px;
    line-height: 48px;
    text-align: center;
    font-size: 20px;
    color: #282c35;
  }
  .tabs-wrap {
    padding: 20px 40px;
    display: flex;
    justify-content: center;
    .tabs {
      width: 300px;
    }
  }
  .content-wrap {
    height: 300px;
  }
}

.category-wrap {
  text-align: center;
  .scroll-view-container {
    margin-left: -12px;
    white-space: nowrap;
    .a7-scroll-tabs-item {
      display: inline-block;
      width: 96px;
      height: 96px;
      line-height: 96px;

      .active {
        .category-name {
          font-size: 16px;
        }
        .icon {
          width: 72px;
          height: 72px;
        }
      }
    }
    .category-item {
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      align-items: center;
      .icon {
        width: 48px;
        height: 48px;
        border-radius: 50%;

        transition: all 0.3s ease-in-out;
      }
      .category-name {
        width: 100%;
        height: 30px;
        font-size: 12px;
        line-height: 30px;
        vertical-align: baseline;
        transition: all 0.3s ease-in-out;
      }
    }
  }
}
</style>