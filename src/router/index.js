import Vue from 'vue'
import Router from 'vue-router'
import index from '@/components/index' //首页
import recommand from '@/components/recommand' //推荐页面
import rankList from '@/components/rankList' //排行榜
import search from '@/components/search' //搜索页面
import musicListDetail from '@/components/musicListDetail' //歌单详情页
import listen from '@/components/listen' //听歌 页面





Vue.use(Router)

export default new Router({
    routes: [{
        path: '/',
        name: 'index',
        component: index,
        redirect: '/recommand', //进入首页 直接显示推荐页面
        children: [{
            path: '/recommand',
            component: recommand
        }, {
            path: '/rankList',
            component: rankList
        }, {
            path: '/search',
            component: search
        }]
    }, {
        path: '/musicListDetail',
        component: musicListDetail
    }, {
        path: '/listen',
        component: listen
    }]
})