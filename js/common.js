axios.defaults.baseURL = './web/index.php';
Vue.prototype.$axios = axios;

Vue.use(window.VueAwesomeSwiper);
var nav = {
    data: function () {
        return {
            flagList: [
              {
                  "type":"top",
                  "name": "头条"
              },
              {
                  "type":"shehui",
                  "name": "社会"
              },
              {
                  "type":"guonei",
                  "name": "国内"
              },
              {
                  "type":"guoji",
                  "name": "国际"
              },
              {
                  "type":"yule",
                  "name": "娱乐"
              },
              {
                  "type":"tiyu",
                  "name": "体育"
              },
              {
                  "type":"junshi",
                  "name": "军事"
              },
              {
                  "type":"keji",
                  "name": "科技"
              },
              {
                  "type":"caijing",
                  "name": "财经"
              },
              {
                  "type":"shishang",
                  "name": "时尚"
              }
            ]
        }
    },
    created: function () {
        this.setNav()
    },
    methods: {
        setNav: function () {
            if (!this.$route.params.type) {
                router.push('top');
            }
            // this.$axios({
            //     method: 'get',
            // }).then(function (res) {
            //     this.flagList = res.data.flagList;
            // }.bind(this))
        }
    },
    template:   '<nav id="nav">\
                    <ul class="box-flag font-16 cf">\
                        <li class="l" v-for="item in flagList">\
                            <router-link :to="{name: \'news\',params: {type: item.type}}" replace>\
                            {{ item.name }}\
                            </router-link>\
                        </li>\
                    </ul>\
                </nav>'
}
var news = {
    components: {
        'LocalSwiper': VueAwesomeSwiper.swiper,
        'LocalSlide': VueAwesomeSwiper.swiperSlide
    },
    data: function () {
        return {
            newsList: [],
            txtNum: null,
            mescroll: null,
            swiperOption: {
                pagination: {
                  el: '.swiper-pagination',
                  dynamicBullets: true
                },
                spaceBetween: 30,
                effect: 'fade',
                // loop:true,
                autoplay: {
                  delay: 2500,
                  autoplayDisableOnInteraction : false,
                  disableOnInteraction: false
                }
             }
        }
    },
    watch:{
        '$route': function () {
            this.newsList = [];
            this.mescroll.resetUpScroll()
        }
    },
    created: function () {
        this.setTxtNum();
    },
    mounted: function () {
        var self = this;
        //判断是否横屏来截取对应的标题长度
        var evt = "onorientationchange" in window ? "orientationchange" : "resize";
        window.addEventListener(evt, self.setTxtNum, false);
        this.swiper.slideTo(0,0,false);
        this.initMescroll();
        // 上拉加载下拉刷新组件

    },
    methods: {
        initMescroll: function () {
            var self = this;
            this.mescroll = new MeScroll('mescroll',{
                down: {
                    callback: self.downCallback,
                    isLock: true
                },
                up: {
                    callback: self.upCallback,
                    page: {
                        size: 10
                    },
                    htmlNodata: '<p class="upwarp-nodata">O~ ^_^ ~O</p>'
                }
            })
        },
        upCallback: function (page) {
            this.setNewsData()
        },
        setTxtNum: function () {
            this.txtNum = parseInt(window.screen.width/16);
        },
        setNewsData: function () {
            var t = this.$route.params.type;
            this.$axios({
                method: 'get',
                params: {
                    type: t
                }
            }).then(function (res) {
                this.newsList = res['data']['result'].data;
                // this.mescroll.endBySize(this.newsList.length, res.data.newsList[t].totalNum)
                this.mescroll.endBySize(this.newsList.length,30)
            }.bind(this)).catch(function () {
                this.mescroll.endErr()
            }.bind(this))
        }
    },
    computed: {
        swiperList: function() {
            return this.newsList.slice(-3)
        },
        swiper: function() {
              return this.$refs.awesomeSwiper.swiper;
          }
    },
    template:
        '<div id="mescroll" class="mescroll">\
            <local-swiper ref="awesomeSwiper" :options="swiperOption">\
                <local-slide v-for="(item,index) in swiperList" :key="index">\
                    <img :src="item.thumbnail_pic_s" alt="">\
                </local-slide>\
                <div class="swiper-pagination"  slot="pagination"></div>\
            </local-swiper>\
            <ul class="new-list">\
                <li class="b-w-1"  v-for="item in newsList">\
                    <a class="cf" href="">\
                        <img class="pic l" :src="item.thumbnail_pic_s" alt="">\
                        <div class="info">\
                            <p class="font-14 title">\
                                {{ item.title.length < txtNum ? item.title : (item.title.substring(0,txtNum) + "...") }}\
                            </p>\
                            <p class="cf font-10 about">\
                                <em class="l">\
                                    {{ item.date }}\
                                </em>\
                                <em class="r">\
                                    {{ item.author_name }}\
                                </em>\
                            </p>\
                        </div>\
                    </a>\
                </li>\
            </ul>\
        </div>'
}
var router = new VueRouter({
    routes: [
        {
            path: '/:type',
            name: 'news',
            component: news,
        }
    ]
})
var app = new Vue({
    components: {
        navBar: nav
    },
    router: router
}).$mount('#app')
