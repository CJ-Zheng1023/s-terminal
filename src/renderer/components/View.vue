<template>
  <div class="box" ref="scroller">
    <div>
      <div class="box-header">
        <h2>{{process.title}}</h2>
      </div>
      <div class="box-body">
        <div class="panel">{{process.description}}</div>
        <div class="panel">
          <div class="tools">
            <i class="fa fa-play-circle-o btn-run" v-tooltip.top-center="'运行程序'"></i>
          </div>
          <pre v-for="(item, index) in codeList">{{index + 1}}   {{item}}</pre>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import BScroll from 'better-scroll'
  export default {
    props: ['process'],
    computed: {
      codeList () {
        if (this.process.code) {
          return this.process.code.split('\n')
        } else {
          return []
        }
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
    }
  }
</script>
<style scoped>
  .box{
    background-color: #2f2136;
    height: 100%;
    position: relative;
  }
  .box-header{
    padding: 15px 20px;
    text-align: center;
  }
  .box-header h2{
    font-size: 18px;
    color: #fff;
    margin: 0;
  }
  .box-body{
    padding: 0 10%;
  }
  .panel{
    padding: 15px 20px;
    background-color: #484b52;
    color: #c0c3c2;
    margin: 20px 0;
    border-radius: 4px;
    position: relative;
  }
  .panel .tools{
    text-align: right;
  }
  .panel .tools i{
    cursor: pointer;
    margin: 0 3px;
  }
  .panel .tools i:hover{
    transform: scale(1.2);
  }
  .btn-run {
    color: #67C23A;
  }
</style>