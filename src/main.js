import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from "./store";

import toast from 'components/common/toast'
import FastClick from 'fastclick'
import VueLazyload from "vue-lazyload";

Vue.prototype.$bus = new Vue()

Vue.use(toast)

Vue.config.productionTip = false

FastClick.attach(document.body)
Vue.use(VueLazyload,{
  loading: require ('./assets/img/common/loading.png')
})

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
