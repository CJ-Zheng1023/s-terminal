<template>
  <div>
    <codemirror v-model="log.data" :options="cmOptions"></codemirror>
  </div>
</template>
<script>
  import { codemirror } from 'vue-codemirror'
  import 'codemirror/lib/codemirror.css'
  export default {
    props: ['log'],
    components: {
      codemirror
    },
    data () {
      return {
        cmOptions: {
          // codemirror options
          tabSize: 4,
          mode: 'text/javascript',
          theme: 'base16-dark',
          lineNumbers: true,
          line: true
          // more codemirror options, 更多 codemirror 的高级配置...
        }
      }
    }
  }
</script>