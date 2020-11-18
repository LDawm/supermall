import {debounce} from "./utils";
import {TOP_DISTANCE} from "./const";
import {POP, NEW, SELL} from "./const";

import BackTop from "components/content/backTop/BackTop";
import {BACK_POSITION} from "./const"

export const itemListenerMixin = {
  data() {
    return {
      itemImageListener: null
    }
  },
  mounted(){
    let refresh = debounce(this.$refs.scroll.refresh,100)

    this.itemImageListener = () =>{
      refresh()
    }
    this.$bus.$on('itemImgLoad',this.itemImageListener)
  }
}

export const backTopMixin = {
  components: {
    BackTop
  },
  data() {
    return {
      isShowBackTop: false
    }
  },
  methods: {
    backTop() {
      this.$refs.scroll.scrollTo(0,0,300)
    },
    listenShowBackTop(position) {
      this.isShowBackTop = -position.y > BACK_POSITION
    }
  }
}

export const tabControlMixin = {
  data: function () {
    return {
      currentType: POP
    }
  },
  methods: {
    tabClick(index) {
      switch (index) {
        case 0:
          this.currentType = POP
          break
        case 1:
          this.currentType = NEW
          break
        case 2:
          this.currentType = SELL
          break
      }
      console.log(this.currentType);
    }
  }
}
