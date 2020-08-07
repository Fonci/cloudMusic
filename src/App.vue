<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
html,
body,
#app {
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}
ul {
  list-style: none;
}
/* navTop */
.header .el-input__inner {
  border-radius: 20px;
}
/* 改造轮播图 分页器样式 */
.el-carousel__indicator--horizontal {
  padding: 2px 3px;
}
.el-carousel__button {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}
/* 歌手榜样式 */
.singerRank .el-tabs__active-bar {
  display: none !important;
}
.singerRank .el-tabs__nav {
  float: none;
  display: flex;
  justify-content: space-around;
}
.singerRank .el-tabs__header {
  margin: 0;
}
</style>
