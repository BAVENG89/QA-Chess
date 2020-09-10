import Vue from 'vue'
import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { SocketInterface } from '../../interfaces/Chess'

@Module
export default class WebSocket extends VuexModule {
  socket: SocketInterface = {
    isConnected: false,
    isShutdown: false,
    reconnectError: false

  }

  @Action
  serverShutdown () {
    this.socket.isShutdown = true
    Vue.prototype.$noty.warning('<b>Shutdown</b><p>The server reports that it will be shut down.</p></small>')

    this.context.dispatch('quitGame')
  }

  @Mutation
  SOCKET_ONOPEN (ev: Event) {
    Vue.prototype.$socket = ev.currentTarget
    this.socket.isConnected = true
  }

  @Mutation
  SOCKET_ONCLOSE () {
    this.socket.isConnected = false
  }

  @Mutation
  SOCKET_ONERROR () {
    this.socket.isConnected = false
    if (this.socket.isShutdown) return
    Vue.prototype.$noty.error('<b>WebSocket</b><p>Error in connection establishment</p><small><pre>net::ERR_CONNECTION_REFUSED</pre></small>')
  }

  @Mutation
  SOCKET_RECONNECT (count: number) {
    this.socket.isConnected = false
    if (this.socket.isShutdown) return
    Vue.prototype.$noty.warning(`<b>WebSocket</b><p>Reconnect</p><small><pre>${count}. Attempt</pre></small>`)
  }

  @Mutation
  SOCKET_RECONNECT_ERROR (close: boolean) {
    this.socket.isConnected = false
    this.socket.reconnectError = true
    if (!this.socket.isShutdown && close) {
      Vue.prototype.$noty.info('<b>WebSocket</b><p>Error in reconnection, give up.</p>')
    }
  }

  get Socket () { return this.socket }
}
