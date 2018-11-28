<template>
  <div>
    <h4>统计结果</h4>
    <table>
      <tr v-for="(value, key) in log.data.result">
        <td>{{key}}</td>
        <td>{{value}}</td>
      </tr>
    </table>
    <a href="javascript:;" @click="dialogVisible = true">图形展示</a>
    <el-dialog
      title="图形展示"
      :visible.sync="dialogVisible"
      :append-to-body="true"
      width="700px">
      <div class="radio-group">
        <el-radio-group size="mini" v-model="chartType">
          <el-radio-button label="pie">
            <i class="fa fa-pie-chart"></i>
          </el-radio-button>
          <el-radio-button label="histogram">
            <i class="fa fa-bar-chart"></i>
          </el-radio-button>
        </el-radio-group>
      </div>
      <ve-chart :data="log.data.statisticData" :settings="chartSettings"></ve-chart>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    props: ['log'],
    data () {
      return {
        dialogVisible: false,
        chartType: 'pie'
      }
    },
    computed: {
      chartSettings () {
        return {
          type: this.chartType
        }
      }
    }
  }
</script>
<style scoped>
  .radio-group{
    margin-bottom: 30px;
  }
</style>