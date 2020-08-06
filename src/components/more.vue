<template>
  <div class="wrap">
    <p class="more_title">推荐歌单</p>
    <!-- 歌单列表 -->
    <div class="box">
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

      <div class="load_more" @click="loadMore()">点击加载更多↓</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      musicList: [],
      n: 1, //判断点击loadmore的数量
    };
  },
  mounted() {},
  created() {
    this.getRecommandMusic(12);
  },
  methods: {
    // 获取推荐歌单
    async getRecommandMusic(limit) {
      const { data: res } = await this.$http.get("/personalized", {
        params: {
          limit: limit,
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
    // 加载更多
    loadMore() {
      this.n++;
      this.getRecommandMusic(12 * this.n);
    },
  },
};
</script>

<style scoped>
.wrap {
  width: 100%;
  height: auto;
}
p {
  margin: 0;
}
.more_title {
  background-color: #8991f7;
  color: white;
  font-size: 20px;
  padding: 15px 0;
}
.box {
  padding-top: 8px;
}
.music_list {
  width: 100%;
  height: auto;
  overflow: hidden;
  padding-left: 3px;
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
  width: 32%;
  height: 180px;
  border-radius: 3px;
  float: left;
  margin-right: 1%;
  position: relative;
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
.load_more {
  margin: 10px 0;
  color: #8991f7;
}
</style>