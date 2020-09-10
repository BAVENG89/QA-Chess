import Vue from 'vue'
import Vuex from 'vuex'

import WebSocket from './Chess/WebSocket'
import Chess from './Chess/Chess'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    Chess, WebSocket
  }
})
