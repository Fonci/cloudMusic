<template>
  <div class="wrap">
    <!-- header -->
    <navTop></navTop>
    <!-- tab  -->
    <div class="tab_box">
      <div
        :class="[tab.id==tabIndex ?'tab tab_active':'tab']"
        v-for="tab in tabs"
        :key="tab.id"
        @click="changeTab(tab.id,tab.path)"
      >{{tab.name}}</div>
    </div>
    <!-- content -->
    <div class="content_box">
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
import navTop from "./navTop";

export default {
  components: {
    navTop,
  },
  data() {
    return {
      tabIndex: 1,
      tabs: [
        { name: "推荐", id: 1, path: "/recommand" },
        { name: "排行榜", id: 2, path: "/rankList" },
        { name: "搜索", id: 3, path: "/search" },
      ],
      routerPath: "",
    };
  },
  mounted() {
    window.sessionStorage.removeItem("playingSongs");
    // 刷新页面直接跳回第一个tab页面
    if (this.$route.path !== "/recommand") {
      this.$router.push("/recommand");
    }
  },
  methods: {
    // 切换tab
    changeTab(id, path) {
      this.tabIndex = id;
      this.routerPath = this.$route.path;
      // 防止同一tab多次点击
      if (this.routerPath !== path) {
        this.$router.push(path);
      }
    },
  },
};
</script>

<style scoped>
.wrap {
  width: 100%;
  height: auto;
}
.tab_box {
  width: 100%;
  height: 40px;
  background-color: #fff;
  display: flex;
  justify-content: space-around;
  border-bottom: 1px solid rgba(220, 220, 220, 0.747);
}
.tab_box .tab {
  width: 33%;
  height: 40px;
  line-height: 40px;
  font-size: 16px;
  cursor: pointer;
}
.tab_active {
  color: #8991f7;
  border-bottom: 2px solid #8991f7;
}
.content_box {
  margin-top: 2px;
}
</style>
