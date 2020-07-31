// import http from '../main'


// 获取轮播图数据                   type:资源类型,对应以下类型,默认为 0 即PC    0: pc   1: android   2: iphone   3: ipad
const carousel = function(data) {
    return http.get('/banner', {
        params: {
            data
        }
    })
}
export default {
    carousel
}