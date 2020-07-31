import Vue from 'vue'
import Router from 'vue-router'
import index from '@/components/index'
import recommand from '@/components/recommand' //推荐
import rankList from '@/components/rankList' //排行榜
import search from '@/components/search' //搜索




Vue.use(Router)

export default new Router({
    routes: [{
        path: '/',
        name: 'index',
        component: index,
        redirect: '/recommand', //推荐直接显示在首页
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
    }]
})