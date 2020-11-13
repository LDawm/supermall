<template>
  <div class="cart">
    <nav-bar  class="nav-bar">
      <div slot="center">购物车({{Length}})</div>
    </nav-bar>

    <cart-list/>

    <CartBottomBar/>
  </div>
</template>

<script>
  import NavBar from "components/common/navbar/NavBar";
  import CartList from "./childComps/CartList";
  import CartBottomBar from "./childComps/CartBottomBar";

  import { mapGetters } from "vuex"

  export default {
    name: "Cart",
    components: {
      CartList,
      NavBar,
      CartBottomBar
    },
    computed: {
      //两种语法
      //1:  ...mapGetters{['cartLength','cartList']}
      //2:
      ...mapGetters({
        Length: 'cartLength',
        list: 'cartList'
      })
    }
  }
</script>

<style scoped>
  .nav-bar {
    background-color: var(--color-tint);
    color: #fff;
    /*font-weight: 700;*/
  }
</style>
