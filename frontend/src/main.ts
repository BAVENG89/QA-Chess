import Vue from 'vue'
import VueNoty from 'vuejs-noty'
import VueNativeSock from 'vue-native-websocket'

import App from './App.vue'
import router from './router'
import store from './store'

import { CONFIG_WS } from './config'

Vue.use(VueNoty, {
  timeout: 4000,
  progressBar: true,
  layout: 'topCenter'
})

Vue.use(VueNativeSock, CONFIG_WS, {
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 3000,
  store,
  format: 'json'
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  created: () => window.addEventListener('beforeunload', () => store.dispatch('quitGameIfPlayer')),
  render: h => h(App)
}).$mount('#app')
