<template>
<div id="detail">
  <DetailNavBar ref="nav" class="detail-nav" @titleClick="titleClick"></DetailNavBar>
  <Scroll class="content" :probe-type="3" ref="scroll" @scroll="contentScroll">
  <DetailSwiper :top-images="topImages"/>
  <detail-base-info :goods="goods"></detail-base-info>
  <detail-shop-info :shop="shop"/>
    <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"/>
    <DetailParamInfo ref="params" :param-info="paramInfo"></DetailParamInfo>
    <detail-comment-info ref="comment" :comment-info="commentInfo"/>
    <goods-list ref="recommend" :goods = "recommends"/>
  </Scroll>
  <detail-bottom-bar @addCart="addToCart"/>
  <back-top @click.native="backTop" v-show="isShowBackTop"></back-top>
  <toast message="hahha"/>
</div>
</template>

<script>
  import DetailNavBar from "./childComps/DetailNavBar";
  import DetailSwiper from "./childComps/DetailSwiper";
  import DetailBaseInfo from "./childComps/DetailBaseInfo";
  import DetailShopInfo from "./childComps/DetailShopInfo";
  import DetailGoodsInfo from "./childComps/DetailGoodsInfo";
  import DetailParamInfo from "./childComps/DetailParamInfo";
  import DetailCommentInfo from "./childComps/DetailCommentInfo"
  import DetailBottomBar from "./childComps/DetailBottomBar";
  import Toast from "components/common/toast/Toast";

  import Scroll from "components/common/scroll/Scroll";
  import GoodsList from "components/content/goods/GoodsList";

  import {getDetail,Goods,Shop,GooodsParam,getRecommend} from "network/detail";
  import {GoodsParam} from "../../network/detail";
  import {debounce} from "common/utils";
  import {itemListenerMixin,backTopMixin} from "common/mixin";

  import {mapActions} from "vuex"

  export default {
    name: "Detail",
    components: {
      Scroll,
      DetailNavBar,
      DetailSwiper,
      DetailBaseInfo,
      DetailShopInfo,
      DetailGoodsInfo,
      DetailParamInfo,
      DetailCommentInfo,
      GoodsList,
      DetailBottomBar,
      Toast
    },
    mixins: [itemListenerMixin,backTopMixin],
    data() {
      return {
        iid: null,
        res: null,
        topImages: [],
        goods: {},
        shop: {},
        detailInfo: {
          type: Object
        },
        paramInfo: {},
        commentInfo: {},
        recommends: [],
        themeTopYs: [],
        getThemeTopYs: null,
        currentIndex: 0
      }
    },
    created() {
      this.iid = this.$route.params.iid

      getDetail(this.iid).then(res =>{
        //获取顶部的轮播图数据
        const data = res.result;
        console.log(res);
        this.topImages = res.result.itemInfo.topImages

        //获取商品信息
        this.goods = new Goods(data.itemInfo,data.columns,data.shopInfo.services)

        // 创建店铺信息的对象
        this.shop = new Shop(data.shopInfo)

        //保存商品详情
        this.detailInfo = data.detailInfo

        //获取参数信息
        this.paramInfo = new GoodsParam(data.itemParams.info,data.itemParams.rule)

        //取出论信息
        if(data.rate.cRate !== 0)
        {
          this.commentInfo = data.rate.list[0]
        }
        //对赋值操作进行防抖
        this.getThemeTopYs = debounce(() =>{
          this.themeTopYs = []
          this.themeTopYs.push(0)
          this.themeTopYs.push(this.$refs.params.$el.offsetTop-44)
          this.themeTopYs.push(this.$refs.comment.$el.offsetTop-44)
          this.themeTopYs.push(this.$refs.recommend.$el.offsetTop-44)
          this.themeTopYs.push(Number.MAX_VALUE)
        },100)
        this.$nextTick(() => {

        })
      })

      //请求推荐数据
      getRecommend().then(res => {
        console.log(res);
        this.recommends = res.data.list;
      })
    },
    mounted() {

    },
    updated() {

    },
    destroyed() {
      this.$bus.$off('itemImgLoad',this.itemImageListener)
    },
    methods: {
      ...mapActions(['addCart']),
      imageLoad() {
        this.$refs.scroll.refresh()
        this.getThemeTopYs()
      },
      titleClick(index) {
        this.$refs.scroll.scrollTo(0,-this.themeTopYs[index],200)
      },
      contentScroll(position) {
        const positionY = -position.y
        let length = this.themeTopYs.length
        this.listenShowBackTop(position)
        for (let i =0; i< length-1;i++) {
          // parseInt(i)
          // if (positionY > this.themeTopYs[i] && positionY < this.themeTopYs[i+1]) {
          //   console.log(i);
          // if (this.currentIndex !== i &&((i < length - 1 && positionY >= this.themeTopYs[i] && positionY <
          //   this.themeTopYs[i+1]) || (i === length-1 && positionY > this.themeTopYs[i]))){
          //   this.currentIndex = i;
          //   this.$refs.nav.currentIndex = this.currentIndex
          if(this.currentIndex !== i && (positionY >= this.themeTopYs[i] &&
          positionY < this.themeTopYs[i+1])){
            this.currentIndex = i
            this.$refs.nav.currentIndex = this.currentIndex
          }
        }

      },
      addToCart() {
        const product = {}
        product.image = this.topImages[0]
        product.title = this.goods.title;
        product.desc = this.goods.desc;
        product.price = this.goods.realPrice;
        product.iid = this.iid;
        // this.$store.commit('addCart',product)
        this.addCart(product).then(res => {
          this.$toast.show(res,2000)
        })


        // this.$store.dispatch('addCart',product).then(res => {
        //   console.log(res);
        // })
      }
    }
  }
</script>

<style scoped>
 #detail{
  position: relative;
  z-index: 20;
  background-color: #fff;
   height: 100vh;
}
 .detail-nav {
   position: relative;
   z-index: 9;
   background-color: #fff;
 }
  .content {
    height: calc(100% - 44px - 49px);
    overflow: hidden;
  }
</style>
