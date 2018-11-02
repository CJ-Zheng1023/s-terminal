<template>
    <div class="command-wrapper" tabindex="-1" @click="activePanel" @keydown="subscribeToKey">
        <div :class="[item.type === 'cmd' ? 'line-command' : 'line-result']" class="line" v-for="item in contents" :key="item.id">{{item.words}}</div>
        <div class="line line-command" v-html="inputHtml"></div>
    </div>
</template>
<script>
    import Commander from '@/common/scripts/commander'
    export default {
      data () {
        return {
          input: '',
          historyInput: [],
          contents: [],
          // -1表示光标在结尾
          cursorIndex: -1,
          // -1表示未选中历史命令
          historyIndex: -1
        }
      },
      computed: {
        inputHtml () {
          let html = ''
          let cursorIndex = this.cursorIndex
          let input = this.input
          if (cursorIndex === -1) {
            html = input.replace(/ /g, '&nbsp;') + `<span class="cursor cursor-blank"></span>`
          } else {
            let left = input.slice(0, cursorIndex).replace(/ /g, '&nbsp;')
            let cur = input.charAt(cursorIndex).replace(/ /g, '&nbsp;')
            let right = input.slice(cursorIndex + 1).replace(/ /g, '&nbsp;')
            html = `${left}<span class="cursor">${cur}</span>${right}`
          }
          return html
        }
      },
      methods: {
        activePanel (e) {
          e.target.focus()
        },
        subscribeToKey (e) {
          Commander.init(e, this)
        }
      }
    }
</script>
<style>
    .command-wrapper{
        min-height: 100%;
        padding: 15px 20px;
        box-sizing: border-box;
        color: #fff;
        font-size: 15px;
    }
    .command-wrapper:focus{
        border: none;
        outline: none;
    }
    .line{
        line-height: 20px;
        word-wrap: break-word;
        word-break: break-all;
    }
    .line.line-command{
        position: relative;
        height: 20px;
        padding-left: 15px;
    }
    .line.line-command:last-child{
        display: inline-block;
        min-height: 1px;
    }
    .line.line-command:before{
        position: absolute;
        left: 0;
        top: 0;
        content: ">";
    }
    .line.line-result{

    }
    .cursor{
        position: relative;
        display: inline-block;
        background-color: inherit;
        box-sizing: border-box;
        border: 1px solid #9cdaba;
    }
    .cursor.cursor-blank{
        left: 3px;
        top: 3px;
        min-width: 10px;
        min-height: 18px;
    }
    .command-wrapper:focus .cursor{
        background-color: #9cdaba;
        animation: cursor-blink 1.2s infinite;
    }
    @keyframes cursor-blink {
        0%{
            opacity: 1;
        }
        50%{
            opacity: 0;
        }
    }
</style>