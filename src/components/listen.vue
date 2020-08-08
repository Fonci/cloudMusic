<template>
  <div class="wrap">
    <!-- 遮罩背景 -->
    <div class="bg" :style="{'background-image':'url('+musicPic+')'}"></div>
    <!-- 歌名 歌手 -->
    <div class="aboutMusic">
      <div class="back" @click="goBack"></div>
      <div>
        <p>{{musicName}}</p>
        <p style=";font-size:13px;margin-top:5px;">
          <span v-for="(item,index) in singer" :key="index">{{item.name}}&emsp;</span>
        </p>
      </div>
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
    </div>
    <!-- 进度条 -->
    <div class="progress">
      <div style="width:100%;">
        <div class="progress_bg"></div>
        <div class="progress_move" :style="{'width':progressNum+'%'}"></div>
      </div>
    </div>
    <div class="play_time">
      <div>{{progressTime}}</div>
      <div>{{fullTime}}</div>
    </div>
    <!-- 大歌词面板-->
    <div class="lyric" v-if="showLyric" @click="showLyricPage()">
      <div class="lyric_box" :style="{'top': (150- 21 * (currentIndex + 1) + 'px')}">
        <p
          v-for="(item,index) in musicLyric"
          :key="index"
          :style="{'color': index === currentIndex ? 'green' : '#8e9ba1'}"
        >{{item[1]}}</p>
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
    <audio ref="audio" :src="musicUrl" autoplay></audio>
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
      currentIndex: -1, //当前播放歌词的index
      duration: "",
      timmer: "",
      flag: 0, //控制歌词时间

      lyric: "",
      progressNum: 0, //进度条数据
      progressTime: "00:00", //进度条时间
      fullTime: "00:00", //歌曲全部时间
    }; //
  },
  mounted() {},
  created() {
    // 进入页面 获取所有播放歌单的id 用于切歌
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
    // setTimeout(() => {
    //   this.currentTime = this.$refs.audio.currentTime;
    //   console.log(this.$refs.audio.currentTime); //当前播放时间
    // }, 300);
  },

  methods: {
    // 返回上一页
    goBack() {
      this.$router.go(-1);
    },
    // 获取歌曲封面
    async getMusic(id) {
      const { data: res } = await this.$http.get("/song/detail", {
        params: {
          ids: id,
        },
      });
      this.singer = res.songs[0].ar; //歌手名 数组
      this.musicName = res.songs[0].name; //歌名
      this.musicPic = res.songs[0].al.picUrl; //封面图片
    },
    // 获取歌词
    async getLyric(id) {
      const { data: res } = await this.$http.get("/lyric", {
        params: {
          id: id,
        },
      });
      // 判断歌词是否为空
      if (res.lrc) {
        var arr = res.lrc.lyric.split("\n");
        var timeArr = [];
        var timeReg = /\[\d{2}:\d{2}\.\d{3}\]/g;
        this.musicLyric = [];
        for (var i in arr) {
          var time = arr[i].match(timeReg); //切割出时间
          var value = arr[i].replace(timeReg, ""); //获取歌词
          if (time) {
            for (let j = 0; j < time.length; j++) {
              let t = time[j].slice(1, -1).split(":"); //t[0]分钟，t[1]秒
              let timeArr = parseInt(t[0], 10) * 60 + parseFloat(t[1]);
              this.musicLyric.push([timeArr, value]); //以[时间(秒)，歌词]的形式存进result
            }
          }
        }
        // console.log(this.musicLyric);
      } else {
        this.musicLyric.push([0, "暂无歌词"]);
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
        this.timmer = setInterval(() => {
          if (this.$refs.audio) {
            this.currentTime = this.$refs.audio.currentTime; //当前播放时间
            this.duration = this.$refs.audio.duration; //总播放时间

            // console.log(this.duration);
            // 进度条总时间
            if (this.duration < 60) {
              this.fullTime =
                parseInt(this.duration) > 10 || parseInt(this.duration) == 10
                  ? "00:" + parseInt(this.duration)
                  : "00:0" + parseInt(this.duration);
            } else {
              // 分钟
              let minute =
                this.duration / 60 < 10
                  ? "0" + parseInt(this.duration / 60)
                  : parseInt(this.duration / 60);
              // 秒
              let second =
                parseInt(
                  (this.duration / 60 - parseInt(this.duration / 60)) * 60
                ) > 10 ||
                parseInt(
                  (this.duration / 60 - parseInt(this.duration / 60)) * 60
                ) == 10
                  ? parseInt(
                      (this.duration / 60 - parseInt(this.duration / 60)) * 60
                    )
                  : "0" +
                    parseInt(
                      (this.duration / 60 - parseInt(this.duration / 60)) * 60
                    );
              this.fullTime = minute + ":" + second;
            }
          }
        }, 1000);
      }
    },
    // 播放上一首
    playLast() {
      for (var i in this.playingSongs) {
        if (this.musicId === this.playingSongs[i]) {
          if (i > 0) {
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
  },
  beforeDestroy() {
    //页面关闭时清除定时器
    clearInterval(this.timmer);
  },
  watch: {
    // 播放完直接切下一首
    currentTime: function (v) {
      if (v == this.duration) {
        this.playNext();
      }
      // 歌词滚动
      let currentIndex = 0;
      for (let i = 0; i < this.musicLyric.length; i++) {
        if (v > this.musicLyric[i][0] - 1) {
          currentIndex = i;
        }
      }
      this.currentIndex = currentIndex;

      // 进度条
      this.progressNum = (v / this.duration) * 100; //进度条滚动进度

      // 进度条变化时间
      if (v < 60) {
        this.progressTime =
          parseInt(v) < 10 ? "00:0" + parseInt(v) : "00:" + parseInt(v);
      } else {
        // 分钟
        let minute = v / 60 < 10 ? "0" + parseInt(v / 60) : parseInt(v / 60);
        // 秒
        let second =
          parseInt((v / 60 - parseInt(v / 60)) * 60) > 10 ||
          parseInt((v / 60 - parseInt(v / 60)) * 60) == 10
            ? parseInt((v / 60 - parseInt(v / 60)) * 60)
            : "0" + parseInt((v / 60 - parseInt(v / 60)) * 60);
        this.progressTime = minute + ":" + second;
      }
    },
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
  padding: 5px 0 5px 8px;
  background-color: rgba(255, 255, 255, 0.096);
  display: flex;
}
.back {
  width: 30px;
  height: 30px;
  font-size: 30px;
  background: url(../assets/back.png) no-repeat 0 0;
  background-size: cover;
  margin-top: 8px;
  margin-right: 20px;
}
.pic_box {
  padding: 80px 20px;
  position: fixed;
  top: 50px;
  left: 0;
  right: 0;
  bottom: 100px;
  /* border-bottom: 1px solid rgba(128, 128, 128, 0.219); */
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
  bottom: 120px;
  color: white;
  overflow: hidden;
  /* border: 1px solid rgba(0, 128, 0, 0.308); */
}
.lyric_box {
  width: 100%;
  height: 100%;
  margin: 0 auto;
  position: absolute;
  left: 0;
  top: 0;
  bottom: 50px;
}
.lyric_box p {
  margin-bottom: 8px;
  overflow: hidden;
}
.progress {
  width: 100%;
  position: absolute;
  left: 0;
  bottom: 100px;
  color: white;
}
.progress_bg {
  width: 100%;
  height: 1px;
  border-bottom: 3px solid rgb(197, 188, 188);
  position: absolute;
  left: 0;
  bottom: 6px;
}
.progress_move {
  width: 0%;
  height: 1px;
  border-bottom: 3px solid rgb(113, 211, 68);
  position: absolute;
  left: 0;
  bottom: 6px;
}
.play_time {
  width: 100%;
  position: absolute;
  left: 0;
  bottom: 85px;
  color: white;
  font-size: 12px;
  display: flex;
  justify-content: space-between;
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