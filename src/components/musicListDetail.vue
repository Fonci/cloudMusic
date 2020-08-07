<template>
  <div class="wrap">
    <!-- 歌手榜详情 -->
    <div class="singerRank" v-if="musicListType=='singer'">
      <p class="singer_title">云音乐歌手榜</p>
      <!-- tabs -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane
          v-for="(item,index) in singerType"
          :key="index"
          :name="item.type"
          :label="item.area"
        >
          <div
            class="singer_list"
            v-for="(item,index) in singerList"
            :key="item.id"
            @click="goSingerMusic(item.id)"
          >
            <!-- 排序 -->
            <div class="singer_order">
              <p
                style="font-size:18px;font-weight:bold;margin-top:25px;margin-bottom:8px;"
              >{{index+1}}</p>
              <p
                class="up_down"
                style="color:red;"
                v-if="(index+1)>item.lastRank"
              >+{{(index+1)-item.lastRank}}</p>
              <p
                class="up_down"
                style="color:green;"
                v-if="(index+1)<=item.lastRank"
              >-{{item.lastRank-(index+1)}}</p>
            </div>
            <!-- 歌手照片 -->
            <img
              style="width:90px;height:80px;margin-left:15px;border-radius:5px;"
              :src="item.picUrl"
              alt
            />
            <!-- 歌手姓名 -->
            <div style="margin-left:20px;text-align:left;">
              <p class="singer_name">
                {{item.name}}
                <span v-if="item.trans">{{item.trans}}</span>
              </p>
              <p class="follow_people">热度：{{(item.score/10000).toFixed(2)}}万</p>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- 排行榜/歌单详情 -->
    <div class="rank" v-if="musicListType=='rank'">
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
              <span>{{(playlist.playCount/10000).toFixed(2)}}万</span>
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
        <div class="music" v-for="(song,index) in songs" :key="index" @click="goListen(song.id)">
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
      // =====排行榜data=====
      showMore: true,
      MusicListId: "",
      playlist: {
        creator: {},
        tags: {},
        description: "",
      },
      ids: "",
      songs: {},
      // =====歌手榜data=====
      musicListType: "", //排行榜类型  分辨是否是歌手榜
      // type : 地区 1: 华语 2: 欧美 3: 韩国 4: 日本
      singerType: [
        {
          type: "1",
          area: "华语",
        },
        {
          type: "2",
          area: "欧美",
        },
        {
          type: "3",
          area: "韩国",
        },
        {
          type: "4",
          area: "日本",
        },
      ],
      activeName: "1",
      singerList: [], //歌手列表
      singerUpdateTime: "", //数据更新时间
    };
  },
  created() {
    // 获得歌单id,获取歌单详情所有歌曲数据
    this.MusicListId = window.sessionStorage.getItem("MusicListId");
    this.musicListType = window.sessionStorage.getItem("MusicListType"); //榜单类型
    if (this.musicListType == "rank") {
      this.getMusicList(this.MusicListId);
    } else {
      this.getSingerList(this.activeName);
    }
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
          // 正在播放的列表中的所有音乐id 用于切歌
          let arr = [];
          for (var i in res.songs) {
            arr.push(res.songs[i].id);
          }
          window.sessionStorage.setItem("playingSongs", arr);
        }
      }
    },
    // 看到更多信息
    showMoreInfo() {
      this.showMore = !this.showMore;
    },
    // 进入听歌页面
    goListen(id) {
      // 播放歌曲的id 传给播放页面
      window.sessionStorage.setItem("musicId", id);
      // 进入播放页面
      this.$router.push("/listen");
    },
    // 查询歌手榜
    async getSingerList(type) {
      const { data: res } = await this.$http.get("/toplist/artist", {
        params: {
          type: type,
        },
      });

      if (res.code == 200) {
        this.singerList = res.list.artists;
        this.singerUpdateTime = res.list.updateTime;
      }
    },
    //切换tabs
    handleClick() {
      this.getSingerList(this.activeName);
    },
    // 进入歌手所有歌曲详情
    goSingerMusic(id) {
      window.sessionStorage.setItem("singerId", id);
      this.$router.push("/singerAllMusic");
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
  white-space: pre;
  font-size: 12px;
  color: #666;
  overflow: hidden;
  text-align: left;
  /* 超出隐藏 */
  text-overflow: ellipsis;
  /* 超出文本设置为... */
  display: -webkit-box;
  /* 转换为盒子模型 */
  -webkit-line-clamp: 3;
  /* 设置文本为3行 */
  -webkit-box-orient: vertical;
  /* 从顶部向底部垂直布置子元素 */
}
.normal {
  text-align: left;
  white-space: normal;
  font-size: 12px;
  color: #666;
  /* white-space: pre;  空白会被浏览器保留 其行为方式类似 HTML 中的 <pre> 标签 */
  white-space: pre;
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
/* 歌手榜 */
.singer_title {
  background-color: #8991f7;
  color: white;
  font-size: 20px;
  padding: 10px 0;
}
.singer_list {
  display: flex;
  padding: 8px 0 8px 15px;
  /* justify-content: space-around; */
  border-bottom: 1px solid rgba(180, 70, 70, 0.226);
}
.up_down {
  font-size: 12px;
}
.singerRank p {
  margin: 0;
}
.singerRank .singer_name {
  margin-top: 18px;
  margin-bottom: 8px;
  font-size: 16px;
  font-weight: bold;
  white-space: nowrap;
}
.singerRank .follow_people {
  font-size: 12px;
  color: gray;
}
</style>