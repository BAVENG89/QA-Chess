<template>
  <div
    class="chessboard-piece"
    :class="classObject"
    :data-col="col"
    :data-row="row"
    :draggable="draggable"
    v-on:drop="onDrop"
    v-on:dragover="onDragOver"
    v-on:dragenter="onDragEnter"
    v-on:dragleave="onDragLeave"
    v-on:dragstart="onDragStart"
    v-on:dragend="onDragEnd">
    <img :class="{ hidden }" :src="image" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import type { ActionMethod } from 'vuex'
import { Action, Getter } from 'vuex-class'
import { ChessPlayerInterface, ChessPieceInterface } from '../../interfaces/Chess'
import chessPieceImages from './ChessPieceImages'

@Component
export default class ChessPiece extends Vue {
  @Prop() private piece!: ChessPieceInterface
  @Action('movePiece') movePiece!: ActionMethod
  @Action('startMoving') startMoving!: ActionMethod
  @Action('endMoving') endMoving!: ActionMethod
  @Action('validateMove') validateMove!: ActionMethod
  @Getter isTurn!: boolean
  @Getter Player!: ChessPlayerInterface

  hover = false
  hidden = false
  occupied = false

  get classObject () {
    return {
      hover: this.hover,
      occupied: this.occupied,
      'chessboard-piece-b': this.piece.color === 'b',
      'chessboard-piece-w': this.piece.color === 'w'
    }
  }

  onDragStart (ev: DragEvent): void {
    this.hidden = true

    const dt = ev.dataTransfer as DataTransfer
    dt.setData('text/plain', this.piece.pos)

    const img = new Image()
    img.src = this.image
    dt.setDragImage(img, 22, 22)

    this.startMoving(this.piece.pos)
  }

  onDragEnd (ev: DragEvent): void {
    (ev.dataTransfer as DataTransfer).clearData()

    this.hidden = false
    this.hover = false
    this.occupied = false

    this.endMoving()
  }

  onDrop (ev: DragEvent): void {
    ev.preventDefault()

    const from = (ev.dataTransfer as DataTransfer).getData('text')
    const to = this.piece.pos

    this.movePiece({ from, to })

    this.hover = false
    this.occupied = false
  }

  async onDragEnter (ev: DragEvent): Promise<void> {
    ev.preventDefault()

    const isValid = await this.validateMove(this.piece.pos)
    if (!isValid) {
      this.occupied = true
    }
    this.hover = true
  }

  onDragOver (ev: DragEvent): void {
    ev.preventDefault()
  }

  onDragLeave (ev: DragEvent): void {
    ev.preventDefault()

    this.occupied = false
    this.hover = false
  }

  get draggable () {
    return this.isTurn && this.Player.color === this.piece.color
  }

  get image () {
    return chessPieceImages[this.piece.color + this.piece.name]
  }

  get col () {
    return this.piece.pos.substr(0, 1)
  }

  get row () {
    return this.piece.pos.substr(1, 1)
  }
}
</script>

<style lang="scss">
.chessboard-piece {
  box-sizing: border-box;

  position: absolute;
  width: calc(100% / 8);
  height: calc(100% / 8);

  &.hover { background-color: rgb(70, 168, 80); }
  &.occupied.hover { background-color: rgb(189, 82, 82); }

  &[draggable=true] { cursor: pointer; }
  &[draggable=false] { user-select: none; }

  &[data-col="a"] { left: 0; }
  &[data-col="b"] { left: calc(100% / 8 * 1); }
  &[data-col="c"] { left: calc(100% / 8 * 2); }
  &[data-col="d"] { left: calc(100% / 8 * 3); }
  &[data-col="e"] { left: calc(100% / 8 * 4); }
  &[data-col="f"] { left: calc(100% / 8 * 5); }
  &[data-col="g"] { left: calc(100% / 8 * 6); }
  &[data-col="h"] { left: calc(100% / 8 * 7); }
  &[data-row="1"] { top: calc(100% / 8 * 7); }
  &[data-row="2"] { top: calc(100% / 8 * 6); }
  &[data-row="3"] { top: calc(100% / 8 * 5); }
  &[data-row="4"] { top: calc(100% / 8 * 4); }
  &[data-row="5"] { top: calc(100% / 8 * 3); }
  &[data-row="6"] { top: calc(100% / 8 * 2); }
  &[data-row="7"] { top: calc(100% / 8 * 1); }
  &[data-row="8"] { top: 0; }

  img {
    width: 45px;
    height: 45px;

    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    pointer-events: none;

    &.hidden {
      visibility: hidden;
    }
  }
}

.animated-b .chessboard-piece-b,
.animated-w .chessboard-piece-w,
.animated .chessboard-piece {
  transition: left 0.5s, top 0.5s;
}
</style>
