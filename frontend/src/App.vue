<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style lang="scss">
@import './assets/styles/animate.min.css';
@import '~vuejs-noty/dist/vuejs-noty.css';

body {
  font-family: Avenir, Helvetica, Arial, sans-serif;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

#noty_layout__topCenter {
  top: 5px;

  p {
    margin: 0.2em 0px 0px 0px;
  }
  pre {
    margin: 0.5em 0px 0px 0px
  }
}
</style>
