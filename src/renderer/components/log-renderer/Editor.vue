<template>
  <div>
    <codemirror v-model="log.data"></codemirror>
  </div>
</template>
<script>
  import { codemirror } from 'vue-codemirror'
  import 'codemirror/lib/codemirror.css'
  export default {
    props: ['log'],
    components: {
      codemirror
    }
  }
</script>