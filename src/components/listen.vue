<template>
  <div class="wrap">
    <!-- 遮罩背景 -->
    <div class="bg" :style="{'background-image':'url('+musicPic+')'}"></div>
    <!-- 歌曲封面 -->
    <div class="pic_box">
      <div class="circle">
        <img class="picture" :src="musicPic" alt />
      </div>
    </div>
    <!-- 歌词 -->
    <div class="lyric"></div>
    <!-- 按钮组 -->
    <div class="btns">
      <!-- 顺序icon -->
      <img src="../assets/play_white.png" alt class="play_icon" />
      <!-- 播放 icon -->
      <div class="playbtn">
        <img src="../assets/last.png" alt class="play_icon" />
        <img src="../assets/pause.png" alt class="play_icon" />
        <img src="../assets/next.png" alt class="play_icon" />
      </div>
      <!-- 收藏 icon -->
      <img src="../assets/heart.png" alt class="play_icon" />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      musicId: "", //当前歌曲id
      musicPic: "", //歌曲封面
      musicUrl: "", //播放链接
      musicLyric: "", //歌词
      showPlayIcon: false, //显示播放按钮
    };
  },
  created() {
    this.musicId = window.sessionStorage.getItem("musicId");
    this.getMusic(this.musicId);
    this.getLyric(this.musicId);
    this.getMusicUrl(this.musicId);
  },
  methods: {
    // 获取歌曲封面
    async getMusic(id) {
      const { data: res } = await this.$http.get("/song/detail", {
        params: {
          ids: id,
        },
      });
      // console.log(res.songs[0]);
      this.musicPic = res.songs[0].al.picUrl;
    },
    // 获取歌词
    async getLyric(id) {
      const { data: res } = await this.$http.get("/lyric", {
        params: {
          id: id,
        },
      });
      this.musicLyric = res.lrc.lyric;
    },
    // 获取歌曲播放url
    async getMusicUrl(id) {
      const { data: res } = await this.$http.get("/song/url", {
        params: {
          id: id,
        },
      });
      this.musicUrl = res.data[0].url;
    },
  },
};
</script>

<style scoped>
.wrap {
  width: 100%;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.575);
  padding: 10px;
}
.bg {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background-position: center;
  -webkit-filter: blur(20px);
  filter: blur(20px);
  -webkit-transform: scale(1.5);
  -ms-transform: scale(1.5);
  transform: scale(1.5);
  z-index: -1;
}

.pic_box {
  padding: 80px 20px;
}
.circle {
  width: 300px;
  height: 300px;
  background: url(../assets/circle.png) no-repeat 0 0;
  background-size: cover;
  margin: 0 auto;
}
.pic_box .picture {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  margin-top: 50px;
  border: 1px solid transparent;
  animation: rotate 10s linear infinite;
}
@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.lyric {
  width: 100%;
  height: auto;
  padding: 15px 10px;
  color: white;
}
.btns {
  width: 100%;
  padding: 15px 0;
  display: flex;
  justify-content: space-around;
  position: fixed;
  bottom: 30px;
  left: 0;
}
.playbtn {
  width: 35%;
  display: flex;
  justify-content: space-between;
}
.play_icon {
  width: 30px;
  height: 30px;
}
</style>