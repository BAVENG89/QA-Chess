<template>
    <div class="chessboard" :class="classObject">
      <ChessField
        v-for="field in Fields"
        :key="field.key"
        :field="field"/>
      <ChessPiece
        v-for="piece in Pieces"
        :key="piece.key"
        :piece="piece"/>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import { ChessFieldInterface, ChessPieceInterface, ChessPlayerInterface } from '../../interfaces/Chess'

import ChessField from '@components/Chess/ChessField.vue'
import ChessPiece from '@components/Chess/ChessPiece.vue'

@Component({
  components: {
    ChessField,
    ChessPiece
  }
})
export default class ChessBoard extends Vue {
  @Getter private Fields!: ChessFieldInterface[]
  @Getter Pieces!: ChessPieceInterface[]
  @Getter Player!: ChessPlayerInterface
  @Getter isStarted!: boolean

  get classObject () {
    let res = ''
    if (this.isStarted) {
      res += 'animated'
      if (this.Player.color === 'w') {
        res += '-b'
      }
      if (this.Player.color === 'b') {
        res += '-w'
      }
    }
    return res
  }
}
</script>

<style lang="scss">
.chessboard {
  width: 400px;
  height: 400px;
  margin: 0 auto;
  position: relative;
}
</style>
