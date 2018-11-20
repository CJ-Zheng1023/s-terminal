<template>
  <div class="box">
    <div class="box-header">终端&nbsp;&nbsp;(输入help，查看帮助)</div>
    <div class="box-body" ref="scroller">
      <div class="command-wrapper" tabindex="-1" @click="activePanel" @keydown="subscribeToKey">
        <div :class="[item.type === 'cmd' ? 'line-command' : 'line-result', 'line']" v-for="item in contents"
             :key="item.id">
          <line-content :item="item"></line-content>
        </div>
        <div class="line line-command" v-html="inputHtml"></div>
      </div>
    </div>
    <search-history :searchHistoryList="searchHistoryList"></search-history>
  </div>
</template>
<script>
  import BScroll from 'better-scroll'
  import Content from '@/components/Content'
  import SearchHistory from '@/components/SearchHistory'
  import Commander from '@/common/scripts/commander'

  export default {
    props: ['code', 'ifRun'],
    components: {
      LineContent: Content,
      SearchHistory
    },
    watch: {
      ifRun (newValue, oldValue) {
        if (newValue) {
          Commander.executeProcess(this)
        }
      }
    },
    data () {
      return {
        input: '',
        historyInput: [],
        contents: [],
        // -1表示光标在结尾
        cursorIndex: -1,
        // -1表示未选中历史命令
        historyIndex: -1,
        db: '',
        exp: '',
        // 历史检索式集合
        searchHistoryList: [],
        isLoading: false
      }
    },
    mounted () {
      this.$nextTick(() => {
        this.scroller = new BScroll(this.$refs.scroller, {
          probeType: 1,
          click: true,
          mouseWheel: {
            speed: 20,
            invert: false
          },
          scrollbar: {
            fade: false,
            interactive: true
          }
        })
      })
    },
    computed: {
      inputHtml () {
        let html = ''
        if (this.isLoading) {
          html = `<span><i class="fa fa-spinner fa-pulse"></i>请稍后...</span>`
          return html
        }
        let cursorIndex = this.cursorIndex
        let input = this.input
        if (cursorIndex === -1) {
          html = input.replace(/ /g, '&nbsp;') + `<span class="cursor cursor-blank">&nbsp;</span>`
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
<style scoped>
  .command-wrapper {
    min-height: 100%;
    padding: 15px 20px;
    box-sizing: border-box;
    color: #fff;
    font-size: 15px;
    background-color: #2f3136;
  }

  .command-wrapper:focus {
    border: none;
    outline: none;
  }

  .line {
    line-height: 23px;
    word-wrap: break-word;
    word-break: break-all;
  }

  .line.line-command {
    position: relative;
    padding-left: 15px;
  }

  .line.line-command:last-child {
    display: inline-block;
    min-height: 1px;
  }

  .line.line-command:before {
    position: absolute;
    left: 0;
    top: 0;
    content: ">";
  }

  .line.line-result {

  }
  .cursor.cursor-blank {

  }
  .box-body {
    height: 100%;
    overflow: hidden;
    position: relative;
  }
  .box {
    height: 100%;
    padding-top: 40px;
    box-sizing: border-box;
    position: relative;
  }

  .box-header {
    top: 0;
    left: 0;
    position: absolute;
    width: 100%;
    background-color: #393c3e;
    box-sizing: border-box;
    border-bottom: 1px solid #242627;
    color: #aaa;
    line-height: 30px;
    padding: 5px 15px;
  }
</style>