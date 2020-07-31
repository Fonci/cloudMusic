<template>
  <div class="wrap">
    <div>排行榜</div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  created() {
    this.getRankList();
  },
  methods: {
    // 获取所有的榜单 热歌榜 新歌榜 歌手榜 等等
    async getRankList() {
      const { data: res } = await this.$http.get("/toplist");
      console.log(res);
      // /toplist
    },
  },
};
</script>

<style scoped>
.wrap {
  width: 100%;
  height: auto;
  margin: 0 auto;
}
</style>