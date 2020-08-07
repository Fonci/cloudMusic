<template>
  <!-- 查看更多页面 -->
  <div class="wrap" ref="container">
    <!-- 歌单列表 -->
    <div class="box" ref="inner">
      <p class="more_title">推荐歌单</p>
      <div class="music_list">
        <div
          class="music"
          v-for="(item,index) in musicList"
          :key="index"
          @click="getMusicListDetail(item.id)"
        >
          <img class="recommand_music_pic" :src="item.picUrl" alt />
          <p class="listen_num">
            <i class="listen_icon"></i>
            <span>{{item.playCount?(item.playCount/10000).toFixed(2):''}}万</span>
          </p>
          <p class="recommand_music_name">{{item.name}}</p>
        </div>
        <div style="clear:both" />
      </div>
      <div style="clear:both" />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      musicList: [],
      n: 1, //判断点击loadmore的数量
      containerHeight: 0,
      innerHeight: 0,
    };
  },
  mounted() {
    this.getRecommandMusic(12);
    setTimeout(() => {
      this.$nextTick(() => {
        // this.clientHeight = `${document.documentElement.clientHeight}`; //屏幕可视化的高度；
        this.containerHeight = this.$refs.container.clientHeight; //wrap 容器高度
        this.innerHeight = this.$refs.inner.offsetHeight; //box容器的高度
        this.$refs.container.addEventListener("scroll", this.loadMore);
      });
    }, 300);
  },
  created() {},
  methods: {
    // 获取推荐歌单
    async getRecommandMusic(limit) {
      if (limit < 225) {
        const { data: res } = await this.$http.get("/personalized", {
          params: {
            limit: limit,
          },
        });
        if (res.code == 200) {
          this.musicList = res.result;
        }
      }
    },
    // 获取歌单详情
    async getMusicListDetail(id) {
      // 存储所点击歌单的id,获取歌单详情页面数据
      window.sessionStorage.setItem("MusicListId", id);
      // 点击进入歌单详情页
      this.$router.push("/musicListDetail");
    },
    // 触底加载更多
    loadMore(e) {
      this.innerHeight = this.$refs.inner.offsetHeight; //加载更多 高度会变化 要重新赋值
      let scrollTop = e.target.scrollTop;
      if (scrollTop + this.containerHeight == this.innerHeight) {
        if (this.n < 18) {
          this.n++;
          this.getRecommandMusic(12 * this.n);
        }
      }
    },
  },
};
</script>

<style scoped>
.wrap {
  /* 固定大小 方便实现scroll功能 */
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  overflow: auto;
}
p {
  margin: 0;
}
.more_title {
  background-color: #8991f7;
  color: white;
  font-size: 20px;
  padding: 15px 0;
  margin-bottom: 10px;
}
.music_list {
  width: 100%;
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
.music_list .music {
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