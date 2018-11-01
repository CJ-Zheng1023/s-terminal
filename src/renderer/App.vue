<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 's-terminal'
  }
</script>

<style>
  html, body, #app{
    height: 100%;
  }
  body{
    overflow: hidden;
  }

</style>
