<template>
  <div class="wrap">
    <div class="music_box">
      <!-- 歌手信息 -->
      <div
        class="singer_info"
        :style="{'background-image':'url('+artist.img1v1Url+')','background-position':'0 -20px'}"
      ></div>
      <div class="desc" style>
        <p class="singer_desc">
          歌手简介：
          <span>{{artist.briefDesc}}</span>
        </p>
      </div>
      <!-- 热门歌曲 -->
      <p class="tip_title">热门歌曲</p>
      <div class="musicList">
        <div class="music" v-for="(song,index) in hotSongs" :key="index" @click="goListen(song.id)">
          <div class="order">{{index+1}}</div>
          <div style="width:85%;padding:15px 8px;overflow:hidden;">
            <p
              style="font-size:17px;margin:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;"
            >
              {{song.name}}
              <span style="color:#888;" v-if="song.alia[0]">({{song.alia[0]}})</span>
            </p>
            <p
              style="font-size:12px;margin:0;margin-top:10px;color:gray;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;"
            >
              <span>{{song.ar[0].name}}</span>
              <span v-if="song.ar.length>1">/{{song.ar[1].name}}</span>
              <span>-</span>
              {{song.al.name}}
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
      singerId: "",
      hotSongs: [],
      artist: {
        picUrl: "",
      },
    };
  },
  created() {
    this.singerId = window.sessionStorage.getItem("singerId");
    this.getAllMusic(this.singerId);
  },
  methods: {
    //   获取所有热门歌曲
    async getAllMusic(id) {
      const { data: res } = await this.$http.get("/artists", {
        params: {
          id: id,
        },
      });
      if (res.code == 200) {
        this.hotSongs = res.hotSongs;
        this.artist = res.artist;
        // 正在播放的列表中的音乐id
        let arr = [];
        for (var i in res.hotSongs) {
          arr.push(res.hotSongs[i].id);
        }
        window.sessionStorage.setItem("playingSongs", arr);
      }
    },
    // 进入听歌页面
    goListen(id) {
      // 播放歌曲的id 传给播放页面
      window.sessionStorage.setItem("musicId", id);
      // 进入播放页面
      this.$router.push("/listen");
    },
  },
};
</script>

<style scoped>
p {
  margin: 0;
}
.singer_info {
  color: white;
  width: 100%;
  height: 200px;
  background-size: cover;
  text-align: left;
}
.singer_name {
  font-size: 20px;
  font-weight: bold;
}
.desc {
  text-align: left;
  padding: 10px;
}
.singer_desc {
  font-size: 12px;
  font-weight: bold;
}
.singer_desc span {
  font-weight: normal;
}
.music {
  display: flex;
  justify-content: space-around;
  text-align: left;
  border-bottom: 1px solid rgba(220, 220, 220, 0.747);
}
.order {
  color: rgb(170, 168, 168);
  line-height: 79px;
  margin: 0 8px;
}
.play {
  width: 25px;
  height: 25px;
  background: url(../assets/play.png) no-repeat 0 0;
  background-size: cover;
  margin-top: 25px;
  margin-right: 10px;
}
.tip_title {
  border-left: 3px solid #8991f7;
  padding-left: 10px;
  display: flex;
  justify-content: space-between;
}
</style>