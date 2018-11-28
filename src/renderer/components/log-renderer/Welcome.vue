<template>
  <div class="panel">
    <h2 class="panel-header">
      欢迎使用本系统！，您当前有<a href="javascript:;">(4)</a>条任务信息
    </h2>
    <div v-if="cmdList.length" class="panel-body">
      <div class="list-header">最近使用的命令:</div>
      <ul>
        <li v-for="cmd in cmdList">{{cmd}}</li>
      </ul>
    </div>
  </div>
</template>
<script>
  import utils from '@/common/scripts/utils'
  export default {
    data () {
      return {
        cmdList: utils.getLatestCmd()
      }
    }
  }
</script>
<style scoped>
  .panel{
    border: 1px dotted #e9e9ef;
    width: 600px;
    margin: 10px auto;
    padding: 15px 25px;
    box-sizing: border-box;
  }
  .panel-header{
    text-align: center;
    font-size: 20px;
    font-weight: bold;
    color: #29ffb5;
  }
  .list-header{
    color: #ffff35;
    font-size: 16px;
  }
  .panel-body ul li{
    color: #de31ff;
    font-size: 14px;
  }
</style>