<template>
  <div class="home">
    <div class="logo">
      <chess24-logo />
    </div>
    <tech-challenge/>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import TechChallenge from '@components/TechChallenge.vue'
import Chess24Logo from '@components/Chess24Logo.vue'

@Component({
  components: {
    TechChallenge,
    Chess24Logo
  }
})
export default class Home extends Vue {
  @Prop() private color!: string
}
</script>

<style lang="scss" scoped>
</style>
