<template>
  <div class="wrap">
    <el-input
      style="width:90%;margin-top:8px;"
      v-model="input"
      placeholder="音乐/专辑/歌手/歌单/用户"
      @change="searchResult()"
    ></el-input>
    <div class="searchList">
      <div
        class="music"
        v-for="(song,index) in resultSongs"
        :key="index"
        @click="goListen(song.id)"
      >
        <div style="width:85%;padding:15px 8px;overflow:hidden;">
          <p
            style="font-size:17px;margin:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;"
          >{{song.name}}</p>
          <p
            style="font-size:12px;margin:0;margin-top:10px;color:gray;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;"
          >
            <span>{{song.artists[0].name}}</span>
            <span v-if="song.artists.length>1">/{{song.artists[1].name}}</span>
            <span>-</span>
            {{song.album.name}}
          </p>
        </div>
        <div class="play"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      input: "",

      resultSongs: [],
    };
  },
  methods: {
    // /search
    // 搜索结果
    async searchResult() {
      const { data: res } = await this.$http.get("/search", {
        params: {
          type: 1,
          //type 1: 单曲, 10: 专辑, 100: 歌手, 1000: 歌单, 1002: 用户, 1004: MV, 1006: 歌词, 1009: 电台, 1014: 视频, 1018:综合
          limit: 15,
          keywords: this.input,
        },
      });
      if (res.code == 200) {
        this.resultSongs = res.result.songs;
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
.wrap {
  width: 100%;
  height: auto;
}
p {
  margin: 0;
}
.searchList {
  width: 100%;
  padding: 8px;
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
</style>