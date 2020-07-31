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
    <!-- 推荐歌单 -->
    <div class="recommand_music">
      <p class="title">
        <span>推荐歌单</span>
      </p>
      <div class="music_list">
        <div v-for="(item,index) in musicList" :key="index">
          <img class="recommand_music_pic" :src="item.picUrl" alt />
          <p class="listen_num">
            <i class="listen_icon"></i>
            <span>{{item.playCount?(item.playCount/10000).toFixed(2):''}}万</span>
          </p>
          <p class="recommand_music_name">{{item.name}}</p>
        </div>
      </div>
    </div>
    <!-- 最新音乐 -->
    <div class="recommand_music">
      <p class="title">
        <span>最新音乐</span>
      </p>
      <div class="music_new">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      bannerList: [], //轮播图数据
      musicList: [], //推荐歌单
      musicNew: [], //最新音乐
    };
  },
  created() {
    this.getCarousel();
    this.getRecommandMusic();
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
      }
    },
    // 获取推荐歌单
    async getRecommandMusic() {
      const { data: res } = await this.$http.get("/personalized", {
        params: {
          limit: 9,
        },
      });
      if (res.code == 200) {
        this.musicList = res.result;
        console.log(res.result);
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
.recommand_music {
  width: 100%;
  height: auto;
}
.title {
  border-left: 3px solid #8991f7;
  padding-left: 10px;
  text-align: left;
}
.music_list,
.music_new {
  width: 100%;
  height: auto;
  overflow: hidden;
}
.recommand_music_pic {
  width: 100%;
  height: 123px;
  position: absolute;
  left: 0;
  top: 0;
  border-radius: 3px;
  z-index: -1;
}
.music_list div {
  width: 33%;
  height: 180px;
  border-radius: 3px;
  float: left;
  margin-right: 1px;
  position: relative;
}
.music_new div {
  width: 100%;
  padding: 15px;
  border: 1px solid goldenrod;
}
.listen_num {
  color: white;
  font-size: 12px;
  text-align: right;
  margin: 2px;
}
.listen_icon {
  width: 16px;
  height: 16px;
  vertical-align: bottom;
  display: inline-block;
  background: url(../assets/listen.png) no-repeat 0 0;
  background-size: cover;
}
.recommand_music_name {
  width: 100%;
  height: auto;
  font-size: 14px;
  position: absolute;
  left: 0;
  top: 125px;
  margin:0;
  text-align: left;
}
</style>