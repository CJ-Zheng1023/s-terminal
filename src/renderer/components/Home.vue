<template>
    <div>
        <header>
            <div class="logo">
                <i class="fa fa-2x fa-joomla"></i>
                <span>批处理系统</span>
            </div>
            <div class="actions">
                <i class="fa fa-cog" v-tooltip.top-center="'设置'"></i>
                <span class="separation"></span>
                <el-dropdown trigger="click">
                    <span class="el-dropdown-link">
                        郑成杰
                        <i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item>切换账号</el-dropdown-item>
                        <el-dropdown-item>退出</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </header>
        <div class="wrapper">
            <aside>
                <div class="inner">
                    <div class="inner-header">
                        <div class="input-item">
                            <el-input size="mini" placeholder="请输入批处理名称" prefix-icon="el-icon-search" v-model="searchInput">
                            </el-input>
                        </div>
                        <div class="title-item">
                            <span>批处理列表</span>
                            <i class="fa fa-plus-square-o" v-tooltip.top-center="'新建批处理'"></i>
                        </div>
                    </div>
                    <div class="inner-body">
                        <div class="process-list" ref="processListScroll">
                            <ul>
                                <li :class="{active: item.active}" v-for="item in processList" :key="item.id">
                                    <h3>{{item.title}}</h3>
                                    <p>{{item.description}}</p>
                                    <div class="actions">
                                        <i class="fa fa-check btn-run" v-tooltip.top-center="'运行程序'"></i>
                                        <i class="fa fa-edit btn-edit" v-tooltip.top-center="'修改程序'"></i>
                                        <i class="fa fa-close btn-delete" v-tooltip.top-center="'删除程序'"></i>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </aside>
            <main>
                <div class="inner">
                    <div class="command-list" ref="commandListScroll">
                        <command></command>
                    </div>
                </div>
            </main>
        </div>
    </div>
</template>
<script>
  import BScroll from 'better-scroll'
  import Command from './Command'
  import {mapState, mapActions} from 'vuex'
  export default {
    components: {
      Command
    },
    data () {
      return {
        searchInput: '',
        processListLoading: false
      }
    },
    computed: {
      ...mapState('Process', [
        'processList',
        'pagination'
      ])
    },
    methods: {
      ...mapActions('Process', [
        'queryProcessList'
      ])
    },
    mounted () {
      this.queryProcessList({start: 0, size: 10}).then(() => {
        this.processScroll = new BScroll(this.$refs.processListScroll, {
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
        this.processScroll.on('scrollEnd', () => {
          let pagination = this.pagination
          if (pagination.start + pagination.size > pagination.total) {
            return false
          }
          if (this.processScroll.y <= (this.processScroll.maxScrollY + 50)) {
            this.queryProcessList({start: pagination.start + pagination.size, size: 10}).then(() => {
              // this.processScroll.refresh()
            })
          }
        })
      })
      this.$nextTick(() => {
        this.commandScroll = new BScroll(this.$refs.commandListScroll, {
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
    .el-dropdown {
        color: #fff;
    }

    .el-dropdown-link {
        cursor: pointer;
    }

    header {
        height: 60px;
        background-color: #464646;
        color: #fff;
        padding: 0 40px;
        overflow: hidden;
    }

    header .logo {
        line-height: 60px;
        float: left;
    }

    header .logo i {
        position: relative;
        top: 5px;
        margin-right: 10px;
    }

    header .actions {
        float: right;
        line-height: 60px;
    }

    header .actions i {
        cursor: pointer;
    }

    header .actions .separation {
        width: 1px;
        height: 20px;
        background-color: #fff;
        display: inline-block;
        position: relative;
        margin: 0 20px;
        top: 5px;
    }

    .wrapper {
        position: absolute;
        top: 60px;
        left: 0;
        right: 0;
        bottom: 0;
    }

    .wrapper aside {
        height: 100%;
        width: 300px;
        float: left;
        overflow: hidden;
        background-color: #484b52;
    }

    aside .inner {
        height: 100%;
        position: relative;
    }
    aside .inner .input-item {
        border-bottom: 1px solid #686b6c;
        padding: 20px 0;
        margin: 0 25px;
    }

    aside .inner .title-item {
        overflow: hidden;
        padding: 20px 25px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.18);
    }

    aside .inner .title-item span {
        float: left;
        color: #b4bdc3;
        font-weight: bold;
    }

    aside .inner .title-item i {
        margin-top: 2px;
        float: right;
        color: #b4bdc3;
        cursor: pointer;
    }

    aside .inner .title-item i:hover {
        color: #fff;
    }
    aside .inner .inner-body {
        position: absolute;
        top: 127px;
        left: 0;
        right: 0;
        bottom: 0;
    }
    aside .inner .process-list{
        height: 100%;
        overflow: hidden;
    }
    .process-list ul{
        padding: 0;
    }
    .process-list li{
        padding: 20px 30px;
        border-bottom: 1px solid #5a5d63;
        position: relative;
        word-break: break-all;
        word-wrap: break-word;
        line-height: 20px;
    }
    .process-list li .actions{
        position: absolute;
        right: 10px;
        bottom: 8px;
    }
    .process-list li .actions i{
        margin: 0 3px;
        cursor: pointer;
    }
    .process-list li .actions i:hover{
        transform: scale(1.2);
    }
    .process-list li .actions .btn-run{
        color: #67C23A;
    }
    .process-list li .actions .btn-edit{
        color: #E6A23C;
    }
    .process-list li .actions .btn-delete{
        color: #F56C6C;
    }
    .process-list li.active{
        background-color: #404349;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.18);
    }
    .process-list li.active:before{
        position: absolute;
        left: 0;
        top: 0;
        width: 4px;
        background-color: #11b683;
        height: 100%;
        content: '';

    }
    .process-list li h3{
        color: #fff;
        font-size: 15px;
        font-weight: normal;
        margin-bottom: 20px;
    }
    .process-list li p{
        color: #fff;
        font-size: 14px;
        margin-bottom: 20px;
    }
    .wrapper main {
        height: 100%;
        margin-left: 300px;
        overflow: auto;
        background-color: #2f3136;
    }
    main .inner{
        height: 100%;
        flex-basis: auto;
        width: 100%;
    }
    main .inner .command-list{
        height: 100%;
        overflow: hidden;
    }
</style>
