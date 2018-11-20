<template>
  <div :class="[{active: isActive}, 'bottom-bar']" @click="isActive = !isActive">
    <div class="title">
      <span>检索轨迹</span>
      <i v-show="!isActive" class="fa fa-angle-up"></i>
      <i v-show="isActive" class="fa fa-angle-down"></i>
    </div>
    <div class="content" ref="scroller">
      <div class="inner">
        <ul>
          <li v-for="(item, index) in searchHistoryList">
            <el-badge :value="item.total" :max=300>
              <el-tag size="small">{{item.db}}</el-tag>
            </el-badge>
            <span v-tooltip.top-center="item.exp">{{item.exp}}</span>
            <i class="fa fa-clipboard"></i>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
  import BScroll from 'better-scroll'
  export default {
    props: ['searchHistoryList'],
    data () {
      return {
        isActive: false
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
<style>
  .bottom-bar{
    position: fixed;
    bottom: -300px;
    right: 30px;
    width: 350px;
    z-index: 1;
    transition: bottom .5s;
  }
  .bottom-bar.active{
    bottom: 0;
  }
  .bottom-bar .title{
    padding: 10px 20px;
    color: #fff;
    background-color: #11b683;
    text-align: center;
    position: relative;
    font-size: 16px;
    cursor: pointer;
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
  }
  .bottom-bar .title:hover{
    background-color: #058f71;
  }
  .bottom-bar .title>i{
    position: absolute;
    right: 10px;
    top: 15px;
  }
  .bottom-bar .content{
    background-color: #fff;
    padding: 8px 25px;
    height: 300px;
    position: relative;
    overflow: hidden;
    box-sizing: border-box;
  }
  .bottom-bar .content li{
    position: relative;
    padding: 12px 20px 12px 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 14px;
    color: #2f3136;
  }
  .bottom-bar .content ul{
    padding: 0;
    margin: 0;
  }
  .bottom-bar .content li>span{
    margin-left: 30px;
  }
  .bottom-bar .content li i{
    position: absolute;
    right: 2px;
    top: 17px;
    cursor: pointer;
  }
</style>