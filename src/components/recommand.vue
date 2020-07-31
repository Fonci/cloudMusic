<template>
  <div class="wrap">
    <!-- 轮播图 -->
    <div class="carousel">
      <el-carousel trigger="click" height="150px" indicator-position>
        <el-carousel-item v-for="(item,index) in bannerList" :key="index">
          <img class="banner" :src="item.imageUrl" alt />
        </el-carousel-item>
      </el-carousel>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      bannerList: [],
    };
  },
  created() {
    this.getCarousel();
  },
  methods: {
    // 获取轮播图数据
    async getCarousel() {
      const { data: res } = await this.$http.get("/banner", {
        params: {
          type: 0,
        },
      });
      if (res.code == 200) {
        this.bannerList = res.banners;
        console.log(this.bannerList);
      }
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
.carousel {
  width: 100%;
  height: 150px;
  background-color: pink;
}
.banner {
  width: 100%;
  height: 150px;
}
</style>