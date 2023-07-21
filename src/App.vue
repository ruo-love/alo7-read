<script>
export default {
  onLaunch: function () {
    console.log("App Launch", import.meta.env.VITE_api_base);
  },
  onShow: function () {
    console.log("App Show");
  },
  onHide: function () {
    console.log("App Hide");
  },
};
</script>

<style lang="scss">
@import 'uview-plus/index.scss';
@import url("./static/style/common.css");

/*每个页面公共css */
</style>
