<template>
    <div class="command-wrapper" tabindex="-1" @click="activePanel" @keydown="subscribeToKey">
        <div class="command-line">{{msg}}<span class="cursor"></span></div>
    </div>
</template>
<script>
    export default {
      data () {
        return {
          msg: ''
        }
      },
      methods: {
        activePanel (e) {
          e.target.focus()
        },
        subscribeToKey (e) {
          this.msg += e.key
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
    .command-line{
        position: relative;
        height: 20px;
        line-height: 20px;
        word-wrap: break-word;
        word-break: break-all;
    }
    .command-line:last-child{
        display: inline-block;
        padding-left: 15px;
        min-height: 1px;
    }
    .command-line:last-child:before{
        position: absolute;
        left: 0;
        top: 0;
        content: ">";
    }
    .cursor{
        position: relative;
        display: inline-block;
        top: 2px;
        left: 5px;
        width: 8px;
        height: 15px;
        background-color: inherit;
        box-sizing: border-box;
        border: 1px solid #9cdaba;
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