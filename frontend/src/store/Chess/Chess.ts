import Vue from 'vue'
import axios from 'axios'
import ChessRules from './ChessRules'

import { CONFIG_API } from '../../config'
import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import {
  ChessStoreInterface, ChessPieceInterface, ChessFieldInterface,
  ChessGameInterface, ChessPlayerInterface, ChessMoveInterface,
  SocketGameInterface, SocketMoveInterface
} from '../../interfaces/Chess'

@Module
export default class Chess extends VuexModule implements ChessStoreInterface {
  pieces: ChessPieceInterface[] = []
  fields: ChessFieldInterface[] = []

  lastPiece = 'b'
  movingPiece = ''

  game: ChessGameInterface = {
    sessionId: undefined,
    started: false,
    pending: true
  }

  player: ChessPlayerInterface = {
    isPlayer: false,
    isVisitor: false
  }

  @Mutation
  GAME_START (data: SocketGameInterface) {
    this.game = {
      sessionId: data.sessionId,
      started: true,
      pending: true
    }
    if (data.isPlayer) {
      this.player = {
        playerId: data.playerId,
        isPlayer: true,
        isVisitor: false,
        color: 'w'
      }
    }
  }

  @Mutation
  GAME_JOIN (data: SocketGameInterface) {
    this.game = {
      sessionId: data.sessionId,
      started: true,
      pending: false
    }
    if (data.isPlayer) {
      this.player = {
        playerId: data.playerId,
        isPlayer: true,
        isVisitor: false,
        color: 'b'
      }
    }
    if (!this.player.isPlayer) {
      this.player.isVisitor = true
    }
  }

  @Mutation
  GAME_QUIT () {
    this.game = {
      sessionId: '',
      started: false,
      pending: false
    }
    this.player = {
      playerId: '',
      isPlayer: false,
      isVisitor: false,
      color: ''
    }
    this.lastPiece = 'b'
  }

  @Mutation
  MOVING_PIECE (data: string) {
    this.movingPiece = data
  }

  @Mutation
  MOVE_PIECE (data: SocketMoveInterface) {
    const cur = this.pieces.find((piece: ChessPieceInterface) => piece.pos === data.from)
    const opp = this.pieces.find((piece: ChessPieceInterface) => piece.pos === data.to)

    if (cur) {
      cur.pos = data.to
      this.lastPiece = cur.color
    }

    if (opp) {
      const oppIdx = this.pieces.findIndex((piece: ChessPieceInterface) => piece.key === opp.key)
      this.pieces.splice(oppIdx, 1)
    }
  }

  @Mutation
  INIT_PIECES () {
    this.pieces = []

    const init = [
      { row: 8, color: 'b', pieces: 'rnbqkbnr' },
      { row: 7, color: 'b', pieces: 'pppppppp' },
      { row: 2, color: 'w', pieces: 'pppppppp' },
      { row: 1, color: 'w', pieces: 'rbnqkbnr' }
    ]

    let id = 0
    for (const item of init) {
      const row = item.row
      const color = item.color

      let idx = 0
      for (const name of item.pieces.split('')) {
        const col = 'abcdefgh'.substr(idx++, 1)
        const key = name + (id++)
        const pos = col + row
        this.pieces.push({ key, pos, name, color })
      }
    }
  }

  @Mutation
  INIT_FIELDS () {
    this.fields = []

    for (let row = 8; row > 0; row--) {
      for (let j = 0; j < 8; j++) {
        const col = 'abcdefgh'.substr(j, 1)
        const pos = col + row
        const key = 'f' + pos
        this.fields.push({ key, pos })
      }
    }
  }

  @Action
  async init () {
    this.context.commit('INIT_PIECES')
    this.context.commit('INIT_FIELDS')

    axios
      .get(CONFIG_API)
      .then(response => {
        if (response.status === 200) {
          const data = response.data

          for (const move of data.moves) {
            this.context.commit('MOVE_PIECE', move)
          }

          this.game.sessionId = data._id
          this.game.started = data.started
          this.game.pending = data.pending

          if (!data.pending) {
            this.player.isPlayer = false
            this.player.isVisitor = true
          }
        }
      })
      .catch((err: Error) => {
        Vue.prototype.$noty.error('<b>Server</b><p>Could not connect to chess API Server</p><small><pre>Error: Network Error</pre></small>')
        console.log(err.message)
      })
  }

  @Action
  startGame () {
    Vue.prototype.$socket.sendObj({
      request: 'startGame'
    })
  }

  @Action({ commit: 'GAME_START' })
  gameStart (data: SocketGameInterface) {
    return data
  }

  @Action
  joinGame () {
    Vue.prototype.$socket.sendObj({
      request: 'joinGame',
      sessionId: this.game.sessionId
    })
  }

  @Action({ commit: 'GAME_JOIN' })
  gameJoin (data: SocketGameInterface) {
    return data
  }

  @Action
  quitGame () {
    Vue.prototype.$socket.sendObj({
      request: 'quitGame',
      sessionId: this.game.sessionId
    })
  }

  @Action
  quitGameIfPlayer () {
    if (this.player.isPlayer) {
      this.context.dispatch('quitGame')
    }
  }

  @Action
  gameQuit () {
    this.context.commit('GAME_QUIT')
    this.context.commit('INIT_PIECES')
    this.context.commit('INIT_FIELDS')
  }

  @Action
  startMoving (data: string) {
    this.context.commit('MOVING_PIECE', data)
  }

  @Action
  endMoving () {
    this.context.commit('MOVING_PIECE', '')
  }

  @Action
  movePiece (data: ChessMoveInterface) {
    const allowed = ChessRules.validateMove(this, data)

    if (allowed) {
      this.context.commit('MOVE_PIECE', data)

      Vue.prototype.$socket.sendObj({
        request: 'pieceMove',
        sessionId: this.game.sessionId,
        playerId: this.player.playerId,
        data
      })
    }
  }

  @Action({ commit: 'MOVE_PIECE' })
  pieceMove (data: ChessMoveInterface) {
    return data
  }

  @Action
  validateMove (to: string) {
    const from = this.movingPiece
    return ChessRules.validateMove(this, { from, to }) || ChessRules.isSame({ from, to })
  }

  get Pieces () { return this.pieces }
  get Fields () { return this.fields }
  get Player () { return this.player }
  get isStarted () { return this.game.started }
  get isPending () { return this.game.pending }
  get isPlayer () { return this.player.isPlayer }
  get isVisitor () { return this.player.isVisitor }

  get isTurn () {
    if (!this.game.pending && this.player.isPlayer && this.player.color !== this.lastPiece) {
      return true
    }
    return false
  }
}
