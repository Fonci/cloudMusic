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
        <span class="more">更多 》</span>
      </p>
      <div class="music_list">
        <div v-for="(item,index) in musicList" :key="index" @click="getMusicListDetail(item.id)">
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
        <span class="more">更多 》</span>
      </p>
      <div class="music_new">
        <div
          class="music_new_list"
          v-for="(item,index) in musicNew"
          :key="index"
          @click="goListen()"
        >
          <div style="width:90%;padding:15px 8px;">
            <p style="font-size:17px;margin:0;">{{item.name}}</p>
            <p style="font-size:12px;margin:0;margin-top:10px;color:gray;">
              <span>{{item.song.artists[0].name}}</span>
              <span v-if="item.song.artists.length>1">/{{item.song.artists[1].name}}</span>
              - {{item.song.album.name}}
            </p>
          </div>
          <div class="play"></div>
        </div>
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
    this.getMusicNew();
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
      }
    },
    // 获取歌单详情
    async getMusicListDetail(id) {
      // 存储所点击歌单的id,获取歌单详情页面数据
      window.sessionStorage.setItem("MusicListId", id);
      // 点击进入歌单详情页
      this.$router.push("/musicListDetail");
    },
    // 获取最新音乐
    async getMusicNew() {
      const { data: res } = await this.$http.get("/personalized/newsong");
      if (res.code == 200) {
        this.musicNew = res.result;
      }
    },
    // 进入听歌页面
    goListen() {
      this.$router.push("/listen");
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
  display: flex;
  justify-content: space-between;
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
.music_list > div {
  width: 33%;
  height: 180px;
  border-radius: 3px;
  float: left;
  margin-right: 1px;
  position: relative;
}
.music_new > div {
  width: 100%;
  border-bottom: 1px solid rgba(220, 220, 220, 0.747);
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
  padding: 0 4px;
  position: absolute;
  left: 0;
  top: 125px;
  margin: 0;
  text-align: left;
  /* 设置文本只显示两行，溢出的使用...代替 */
  overflow: hidden;
  /* 超出隐藏 */
  text-overflow: ellipsis;
  /* 超出文本设置为... */
  display: -webkit-box;
  /* 转换为盒子模型 */
  -webkit-line-clamp: 2;
  /* 设置文本为2行 */
  -webkit-box-orient: vertical;
  /* 从顶部向底部垂直布置子元素 */
}
.more {
  color: gray;
  font-size: 12px;
}
.music_new_list {
  display: flex;
  justify-content: space-around;
  text-align: left;
}
.play {
  width: 25px;
  height: 25px;
  background: url(../assets/play.png) no-repeat 0 0;
  background-size: cover;
  margin-top: 25px;
  margin-right: 10px;
}
</style>