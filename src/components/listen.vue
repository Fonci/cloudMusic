<template>
  <div class="wrap">
    <!-- 遮罩背景 -->
    <div class="bg" :style="{'background-image':'url('+musicPic+')'}"></div>
    <!-- 歌名 歌手 -->
    <div class="aboutMusic">
      <p>{{musicName}}</p>
      <p style=";font-size:13px;margin-top:5px;">
        <span v-for="(item,index) in singer" :key="index">{{item.name}}&emsp;</span>
      </p>
    </div>
    <!-- 歌曲封面 -->
    <div class="pic_box" v-if="showPic" @click="showLyricPage()">
      <div class="circle">
        <img
          class="picture"
          :src="musicPic"
          alt
          :style="{'animation':rotate?'rotate 10s linear infinite':'none'}"
        />
      </div>
      <!-- 小歌词 -->
      <p class="little_lyric">{{lyric}}</p>
    </div>
    <!-- 大歌词面板-->
    <div class="lyric" v-if="showLyric" @click="showLyricPage()">
      <div class="lyric_box">
        <div
          v-for="(item,index) in musicLyric"
          :key="index"
          :style="{'color':lyric===item[1]?'rgb(48, 139, 48)':'rgba(197, 188, 188, 0.884)'}"
        >{{item[1]}}</div>
      </div>
    </div>
    <!-- 按钮组 -->
    <div class="btns">
      <!-- 顺序icon -->
      <img src="../assets/play_white.png" alt class="play_icon" />
      <!-- 播放 icon -->
      <div class="playbtn">
        <img src="../assets/last.png" alt class="play_icon" @click="playLast" />
        <img
          v-if="showPlayIcon"
          src="../assets/play_white.png"
          alt
          class="play_icon"
          @click="playMusic()"
        />
        <img
          v-if="showPauseIcon"
          src="../assets/pause.png"
          alt
          class="play_icon"
          @click="playMusic()"
        />
        <img src="../assets/next.png" alt class="play_icon" @click="playNext" />
      </div>
      <!-- 收藏 icon -->
      <img src="../assets/heart.png" alt class="play_icon" />
    </div>
    <!-- 播放源 -->
    <audio ref="audio" :src="musicUrl" controls autoplay></audio>
  </div>
</template>

<script>
export default {
  data() {
    return {
      playingSongs: [], //所有的播放列表id
      musicIndex: 0, //播放歌曲的index
      musicName: "",
      singer: [],
      rotate: true, //图片旋转
      musicId: "", //当前歌曲id
      musicPic: "", //歌曲封面
      musicUrl: "", //播放链接
      showPic: true, //显示pic页面
      showLyric: false, //显示歌词页面
      musicLyric: [], //歌词
      showPlayIcon: false, //显示播放按钮
      showPauseIcon: true, //显示暂停按钮
      i: 1, //控制播放暂停
      currentTime: "",
      timmer: "",
      flag: 0, //控制歌词时间

      lyric: "",
    }; //
  },
  mounted() {},
  created() {
    // 进入页面 获取所有播放歌单的id
    if (window.sessionStorage.getItem("playingSongs")) {
      this.playingSongs = window.sessionStorage
        .getItem("playingSongs")
        .split(",");
    }

    this.musicId = window.sessionStorage.getItem("musicId");

    this.getMusic(this.musicId);
    this.getLyric(this.musicId);
    this.getMusicUrl(this.musicId);

    // 切歌时使用下标判断歌曲id
    for (var i in this.playingSongs) {
      if (this.musicId === this.playingSongs[i]) {
        this.musicIndex = i;
      }
    }
  },

  methods: {
    // 获取歌曲封面
    async getMusic(id) {
      const { data: res } = await this.$http.get("/song/detail", {
        params: {
          ids: id,
        },
      });
      this.singer = res.songs[0].ar; //歌手名 数组
      this.musicName = res.songs[0].al.name; //歌名
      this.musicPic = res.songs[0].al.picUrl; //封面图片
    },
    // 获取歌词
    async getLyric(id) {
      const { data: res } = await this.$http.get("/lyric", {
        params: {
          id: id,
        },
      });
      var arr = res.lrc.lyric.split("\n");
      var timeArr = [];
      var timeReg = /\[\d{2}:\d{2}\.\d{3}\]/g;
      this.musicLyric = [];
      for (var i in arr) {
        var time = arr[i].match(timeReg); //切割出所有的时间
        var value = arr[i].replace(timeReg, ""); //获取纯歌词文本
        if (time) {
          for (let j = 0; j < time.length; j++) {
            let t = time[j].slice(1, -1).split(":"); //t[0]分钟，t[1]秒
            let timeArr = parseInt(t[0], 10) * 60 + parseFloat(t[1]);
            this.musicLyric.push([timeArr, value]); //以[时间(秒)，歌词]的形式存进result
          }
        }
      }
      if (this.musicLyric) {
        this.timmer = setInterval(this.playLyric, 200); //定时器
        this.playLyric();
      }
    },
    // 获取歌曲播放url
    async getMusicUrl(id) {
      const { data: res } = await this.$http.get("/song/url", {
        params: {
          id: id,
        },
      });
      this.musicUrl = res.data[0].url;
      if (this.musicUrl) {
        window.sessionStorage.setItem("musicUrl", this.musicUrl);
      }
    },
    // 播放上一首
    playLast() {
      for (var i in this.playingSongs) {
        if (this.musicId === this.playingSongs[i]) {
          if (i > 0) {
            // 上一首
            i--;
            this.musicIndex--;
            this.musicId = this.playingSongs[i];
            this.getMusic(this.musicId);
            this.getLyric(this.musicId);
            this.getMusicUrl(this.musicId);
          }
        }
      }
    },
    // 播放下一首
    playNext() {
      this.musicIndex++;
      for (var i in this.playingSongs) {
        if (this.musicIndex < this.playingSongs.length) {
          this.musicId = this.playingSongs[this.musicIndex];
          this.getMusic(this.musicId);
          this.getLyric(this.musicId);
          this.getMusicUrl(this.musicId);
        }
      }
    },

    // 播放歌曲
    playMusic() {
      this.i += 1;
      if (this.i % 2 == 0) {
        this.$refs.audio.pause();
        clearInterval(this.timmer);
      } else {
        this.$refs.audio.play();
        this.timmer = setInterval(this.playLyric, 200);
      }
      this.showPlayIcon = !this.showPlayIcon;
      this.showPauseIcon = !this.showPauseIcon;
      this.rotate = !this.rotate;
    },
    // 显示歌词页面
    showLyricPage() {
      this.showPic = !this.showPic;
      this.showLyric = !this.showLyric;
    },
    // 播放歌词
    playLyric() {
      this.currentTime = this.$refs.audio.currentTime;
      if (this.currentTime) {
        if (
          this.currentTime > this.musicLyric[this.flag][0] &&
          this.currentTime < this.musicLyric[this.flag + 1][0]
        ) {
          this.lyric = this.musicLyric[this.flag][1];
        }
        this.flag =
          this.flag === this.musicLyric.length - 2 ? 0 : this.flag + 1;
      }
      if (
        this.currentTime > this.$refs.audio.duration ||
        this.currentTime == this.$refs.audio.duration
      ) {
        this.showPauseIcon = true;
        this.showPlayIcon = false;
      }
    },
  },
  beforeDestroy() {
    //页面关闭时清除定时器
    clearInterval(this.timmer);
  },
};
</script>

<style scoped>
p {
  margin: 0;
}
.wrap {
  width: 100%;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.575);
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
.aboutMusic {
  text-align: left;
  color: white;
  padding: 5px 0 5px 10px;
  background-color: rgba(255, 255, 255, 0.096);
}
.pic_box {
  padding: 80px 20px;
  position: fixed;
  top: 50px;
  left: 0;
  right: 0;
  bottom: 90px;
  border-bottom: 1px solid rgba(128, 128, 128, 0.219);
}
.little_lyric {
  width: 100%;
  position: absolute;
  bottom: 50px;
  left: 0;
  text-align: center;
  color: rgb(48, 139, 48);
  /* border:1px solid red; */
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
  /* animation: rotate 10s linear infinite; */
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
  padding: 100px 20px;
  position: fixed;
  top: 50px;
  left: 0;
  right: 0;
  bottom: 90px;
  color: white;
  /* border: 1px solid rgba(0, 128, 0, 0.308); */
}
.lyric_box {
  width: 70%;
  height: 80%;
  margin: 0 auto;
  /* border: 1px solid rgba(255, 0, 0, 0.486); */
  overflow: hidden;
  position: relative;
}
.lyric_box div {
  margin-bottom: 5px;
  overflow: hidden;

  top: 0;
  left: 0;
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