<template>
  <div class="hello">
    <ChessGame/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import ChessGame from '@components/Chess/ChessGame.vue'

@Component({
  components: {
    ChessGame
  }
})
export default class TechChallenge extends Vue { }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
a {
  color: #42b983;
}

.hint {
  display: inline-flex;
  align-items: center;
  line-height: 1;
}
</style>
