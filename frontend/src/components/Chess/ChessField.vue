<template>
    <div
        class="chessboard-field"
        :class="classObject"
        v-on:drop="onDrop"
        v-on:dragover="onDragOver"
        v-on:dragleave="onDragLeave"></div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import type { ActionMethod } from 'vuex'
import { Action } from 'vuex-class'
import { ChessFieldInterface } from '../../interfaces/Chess'

@Component
export default class ChessField extends Vue {
  @Prop() private field!: ChessFieldInterface
  @Action('movePiece') movePiece!: ActionMethod

  classObject = {
    hover: false
  }

  onDrop (ev: DragEvent): void {
    ev.preventDefault()
    this.classObject.hover = false

    const from = (ev.dataTransfer as DataTransfer).getData('text')
    const to = this.field.pos

    this.movePiece({ from, to })
  }

  onDragOver (ev: DragEvent): void {
    ev.preventDefault()
    this.classObject.hover = true
  }

  onDragLeave (): void {
    this.classObject.hover = false
  }
}
</script>

<style lang="scss" scoped>
.chessboard-field {
  box-sizing: border-box;

  width: calc(100% / 8);
  height: calc(100% / 8);
  float: left;

  background-color: #fece9e;

  &:nth-child(-2n+8),
  &:nth-child(8) ~  &:nth-child(-2n+15),
  &:nth-child(16) ~ &:nth-child(-2n+24),
  &:nth-child(24) ~ &:nth-child(-2n+31),
  &:nth-child(32) ~ &:nth-child(-2n+40),
  &:nth-child(40) ~ &:nth-child(-2n+47),
  &:nth-child(48) ~ &:nth-child(-2n+56),
  &:nth-child(56) ~ &:nth-child(-2n+63) {
    background-color: #d28b48;
  }
  &.hover { background-color: rgb(70, 168, 80) !important; }
}
</style>
