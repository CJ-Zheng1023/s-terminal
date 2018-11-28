<template>
  <div>
    <div v-html="log.data"></div>
  </div>
</template>
<script>
  export default {
    props: ['log']
  }
</script>