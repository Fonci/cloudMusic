<template>
  <div class="wrap">
    <!-- 歌单信息 -->
    <div class="musicListInfo">
      <!-- 图片部分-->
      <div class="musicListInfo_top">
        <div class="bg" :style="{'background-image':'url('+playlist.coverImgUrl+')'}"></div>
        <!-- 图片 -->
        <div class="pic_info">
          <img :src="playlist.coverImgUrl" alt />
          <span class="musicList_icon">歌单</span>
          <p class="listen_num">
            <i class="listen_icon"></i>
            <span>231.0万</span>
          </p>
        </div>
        <div style="margin-left:30px;width:60%;">
          <p class="title">{{playlist.name}}</p>
          <div style="text-align:left;margin-top:20px;">
            <img class="avatar" :src="playlist.creator.avatarUrl" alt />
            <span>{{playlist.creator.nickname}}</span>
          </div>
        </div>
      </div>
      <!-- 信息部分 -->
      <div class="musicListInfo_bottom">
        <p class="tag">
          标签：
          <span
            style="margin-right:5px;"
            v-for="(tag,index) in playlist.tags"
            :key="index"
          >{{tag}}</span>
        </p>
        <p :class="showMore?'intro':'normal'">{{playlist.description}}</p>
        <p style="text-align:right;">
          <img
            v-if="showMore"
            style="width:14px;height;14px;"
            src="../assets/down.png"
            alt
            @click="showMoreInfo()"
          />
          <img
            v-else
            style="width:14px;height;14px;"
            src="../assets/up.png"
            alt
            @click="showMoreInfo()"
          />
        </p>
      </div>
    </div>
    <!-- 歌曲列表 -->
    <p
      style="padding:10px 0 10px 10px;background-color:#eeeff0;color:#666;text-align:left;font-size:12px;"
    >歌曲列表</p>
    <!-- 歌单列表 -->
    <div class="musicList">
      <div class="music" v-for="(song,index) in songs" :key="index">
        <div class="order">{{index+1}}</div>
        <div style="width:85%;padding:15px 8px;">
          <p
            style="font-size:17px;margin:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;"
          >
            {{song.name}}
            <span style="color:#888;" v-if="song.alia[0]">({{song.alia[0]}})</span>
          </p>
          <p style="font-size:12px;margin:0;margin-top:10px;color:gray;">
            <span>{{song.ar[0].name}}</span>
            <span>-</span>
            {{song.al.name}}
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
      showMore: true,
      MusicListId: "",
      playlist: {
        creator: {},
        tags: {},
      },
      ids: "",
      songs: {},
    };
  },
  created() {
    // 获得歌单id,获取歌单详情数据
    this.MusicListId = window.sessionStorage.getItem("MusicListId");
    this.getMusicList(this.MusicListId);
  },
  methods: {
    // 获取歌单详情数据信息
    async getMusicList(id) {
      const { data: res } = await this.$http.get("/playlist/detail", {
        params: {
          id: id,
        },
      });
      if (res.code == 200) {
        this.playlist = res.playlist;
        let trackIds = res.playlist.trackIds;
        let arr = [];
        trackIds.forEach((k, v) => {
          arr.push(k.id);
        });
        this.ids = arr.join(",");
        this.getMusic();
      }
    },
    // 获取歌曲列表
    async getMusic() {
      if (this.ids) {
        const { data: res } = await this.$http.get("/song/detail", {
          params: {
            ids: this.ids,
          },
        });
        if (res.code == 200) {
          this.songs = res.songs;
        }
      }
    },
    // 看到更多信息
    showMoreInfo() {
      this.showMore = !this.showMore;
    },
  },
};
</script>

<style scoped>
p {
  margin: 0;
}
.musicListInfo {
  width: 100%;
}
.musicListInfo_top {
  padding: 20px 10px;
  display: flex;
  justify-content: space-around;
  position: relative;
  color: white;
  overflow: hidden;
}
.pic_info {
  width: 126px;
  height: 126px;
  position: relative;
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

.pic_info img {
  width: 100%;
  height: 100%;
  z-index: 1;
  position: absolute;
  left: 0;
  top: 0;
}
.musicList_icon {
  position: absolute;
  z-index: 3;
  top: 10px;
  left: 0;
  padding: 0 8px;
  height: 17px;
  color: #fff;
  font-size: 9px;
  text-align: center;
  line-height: 17px;
  background-color: rgba(217, 48, 48, 0.8);
  border-top-right-radius: 17px;
  border-bottom-right-radius: 17px;
}
.listen_num {
  color: white;
  font-size: 12px;
  z-index: 100;
  right: 5px;
  top: 5px;
  position: absolute;
}
.listen_icon {
  display: inline-block;
  vertical-align: bottom;
  width: 14px;
  height: 14px;
  background: url(../assets/listen.png) no-repeat 0 0;
  background-size: cover;
}
.title {
  margin-top: 20px;
  text-align: left;
  font-size: 17px;
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
.avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  vertical-align: middle;
}
.musicListInfo_bottom {
  padding: 12px;
}
.tag {
  margin-bottom: 10px;
  font-size: 14px;
  text-align: left;
  color: #666;
}
.tag span {
  border: 1px solid rgb(214, 207, 207);
  padding: 2px 4px;
  border-radius: 10px;
}
.intro {
  font-size: 12px;
  color: #666;
  overflow: hidden;
  /* 超出隐藏 */
  text-overflow: ellipsis;
  /* 超出文本设置为... */
  display: -webkit-box;
  /* 转换为盒子模型 */
  -webkit-line-clamp: 3;
  /* 设置文本为2行 */
  -webkit-box-orient: vertical;
  /* 从顶部向底部垂直布置子元素 */
}
.normal {
  text-align: left;
  white-space: normal;
  font-size: 12px;
  color: #666;
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