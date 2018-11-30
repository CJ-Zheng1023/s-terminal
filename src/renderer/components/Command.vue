<template>
  <div class="box">
    <div class="box-body" ref="scroller">
      <div class="command-wrapper" @click="activePanel">
        <div :class="['line', item.type === 'cmd' ? 'line-command' : 'line-result']" v-for="item in logs"
             :key="item.id">
          <component :log="item" :is="item.type"></component>
        </div>
        <div v-show="!isLoading" class="line line-command">
          <div ref="inputArea" class="input-area" @keydown="subscribeToKey"></div>
        </div>
        <div v-show="isLoading" class="line line-command">
          <span><i class="fa fa-spinner fa-pulse"></i>请稍后...</span>
        </div>
      </div>
    </div>
    <div class="box-footer">
      <div class="info">
        <span>DB:</span>
        <span>{{db}}</span>
      </div>
    </div>
  </div>
</template>
<script>
  import {mapState, mapActions} from 'vuex'
  import BScroll from 'better-scroll'
  import components from '@/components/log-renderer/index'
  import Commander from '@/common/scripts/commander'

  export default {
    components,
    watch: {
      ifRun (newValue, oldValue) {
        if (newValue) {
          Commander.executeProcess(this)
        }
      },
      isLoading (newValue, oldValue) {
        if (!newValue) {
          process.nextTick(() => {
            this.activePanel()
          })
        }
      }
    },
    data () {
      return {
        // -1表示未选中历史命令
        historyIndex: -1,
        isLoading: false
      }
    },
    computed: {
      ...mapState('Command', [
        'historyInput',
        'logs',
        'db',
        'exp'
      ])
    },
    created () {
      this.addLog({type: 'welcome', data: ''})
      // this.addLog({type: 'editor', data: 'hello'})
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
    methods: {
      activePanel (e) {
        this.$refs.inputArea.focus()
      },
      subscribeToKey (e) {
        Commander.init(e, this)
      },
      ...mapActions('Command', [
        'addLog',
        'clearLogs',
        'addHistory',
        'switchDataBase',
        'switchExp'
      ])
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

  .command-wrapper .line div:focus {
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
    box-sizing: border-box;
    position: relative;
    padding-bottom: 60px;
  }
  .box-footer {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 60px;
    background-color: #464646;
    border-top: 1px solid #565656;
    box-sizing: border-box;
    color: #fff;
    padding: 0 40px;
    overflow: hidden;
  }
  .box-footer .info{
    float: right;
    line-height: 60px;
    font-size: 18px;
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
  .input-area{
    -webkit-user-modify: read-write-plaintext-only;
    min-height: 23px;
  }
</style>