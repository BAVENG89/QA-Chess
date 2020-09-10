<template>
  <div>
    <div class="info">
      <div :class="{ center: !TurnMessage || !GameMessage }">
        <span v-if="TurnMessage" :class="{ 'animate__animated animate__pulse animate__infinite': isTurn }">{{ TurnMessage }}</span>
        <span v-if="GameMessage">{{ GameMessage }}</span>
      </div>
    </div>

    <ChessBoard/>

    <div class="ctrls">
      <button v-if="!isStarted" v-on:click="startGame" :disabled="!Socket.isConnected">Start new game</button>
      <button v-if="isStarted && !isPlayer && isPending" v-on:click="joinGame">Join a game</button>
      <button v-if="isPlayer||isVisitor" v-on:click="quitGame">Quit game</button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import type { ActionMethod } from 'vuex'
import { SocketInterface, ChessPlayerInterface } from '../../interfaces/Chess'
import ChessBoard from '@components/Chess/ChessBoard.vue'

@Component({
  components: {
    ChessBoard
  }
})
export default class ChessGame extends Vue {
  @Action init!: ActionMethod
  @Action startGame!: ActionMethod
  @Action joinGame!: ActionMethod
  @Action quitGame!: ActionMethod

  @Getter Socket!: SocketInterface
  @Getter isStarted!: boolean
  @Getter isPlayer!: boolean
  @Getter isVisitor!: boolean
  @Getter isPending!: boolean
  @Getter isTurn!: boolean
  @Getter Player!: ChessPlayerInterface

  beforeMount () {
    this.init()
  }

  get GameMessage () {
    if (this.isPending && this.isPlayer) {
      return 'Wait for opponent to join.'
    }

    if (!this.isPending && this.isPlayer) {
      return `You play the ${this.Player.color === 'w' ? 'white' : 'black'} pieces.`
    }

    if (!this.isPending && this.Player.isVisitor) {
      return 'The game has already started.'
    }

    return ''
  }

  get TurnMessage () {
    if (!this.isPending && this.isPlayer) {
      if (this.isTurn) {
        return 'It\'s is your turn.'
      } else {
        return 'It is your opponent\'s turn.'
      }
    }

    return ''
  }
}
</script>

<style lang="scss">
.info {
  height: 1em;
  margin-bottom: 1em;
  div {
    width: 380px;
    margin: 0 auto;

    &:not(.center) {
      span:first-child {
        float: left;
        &.animate__animated {
          font-weight: bold;
        }
      }
      span:last-child {
        float: right;
      }
    }
  }
}
.ctrls {
  margin-top:1em;
}
</style>
