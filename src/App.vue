<template>
  <div id="app">
    <div id="nav">
<!--      <router-link to="/">Home</router-link> |-->
<!--      <router-link to="/about">About</router-link> |-->
<!--      <router-link to="/live">开播</router-link> |-->
<!--      <router-link to="/play">观看</router-link> |-->
<!--      <router-link to="/demo">Demo</router-link>|-->
        <router-link to="/simpleLive">直播</router-link> |
        <router-link to="/simplePlay">观看</router-link>
    </div>
    <router-view/>
  </div>
</template>

<style>
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
</style>
