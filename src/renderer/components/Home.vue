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
        <el-dropdown v-if="username" trigger="click" @command="dropdownCommand">
                    <span class="el-dropdown-link">
                        {{username}}
                        <i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>切换账号</el-dropdown-item>
            <el-dropdown-item command="logout">退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-button size="mini" type="warning" class="btn-login" @click="showLoginDialog = true" v-else>未登录</el-button>
      </div>
    </header>
    <div class="wrapper">
      <aside v-if="username">
        <div class="inner">
          <div class="inner-header">
            <div class="input-item">
              <el-input size="mini" placeholder="请输入批处理名称" prefix-icon="el-icon-search" v-model="searchInput">
              </el-input>
            </div>
            <div class="title-item">
              <span>批处理列表</span>
              <i class="fa fa-plus-square-o" v-tooltip.top-center="'新建批处理'" @click="openSaveDialog('新建批处理')"></i>
            </div>
          </div>
          <div class="inner-body">
            <div class="process-list" ref="processListScroll">
              <ul>
                <li @click="selectItem(item)" :class="{active: item.active}" v-for="item in processList" :key="item.id">
                  <h3>{{item.title}}</h3>
                  <p>{{item.description}}</p>
                  <div class="actions">
                    <i class="fa fa-edit btn-edit" v-tooltip.top-center="'修改程序'" @click.stop="openSaveDialog('修改批处理',item)"></i>
                    <i class="fa fa-close btn-delete" v-tooltip.top-center="'删除程序'" @click.stop="deleteItem(item)"></i>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </aside>
      <main :class="[username ? '' : 'full-width']">
        <div class="inner">
          <div v-if="username" class="box-view">
            <process-view :process="activatedProcess" @run="runProcess"></process-view>
          </div>
          <div class="box-command">
            <command :ifRun="ifRun" :code="activatedProcess.code || ''" @stop="stopProcess"></command>
          </div>
        </div>
      </main>
    </div>
    <login v-if="showLoginDialog" @close="showLoginDialog = false"></login>
    <el-dialog :title="title" :visible.sync="showSaveDialog" @close="closeSaveDialog">
      <el-form :model.sync="process" :rules="processRules" :label-width="formLabelWidth" ref="processForm">
        <el-form-item label="批处理名称" prop="title">
          <el-input v-model="process.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="批处理描述" prop="description">
          <el-input type="textarea" rows="3" v-model="process.description"></el-input>
        </el-form-item>
        <el-form-item label="批处理代码" prop="code">
          <el-input type="textarea" rows="6" v-model="process.code"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeSaveDialog" size="small">关 闭</el-button>
        <el-button :loading="saveBtnLoading" type="warning" class="btn-login" size="small" @click="saveProcessForm">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import BScroll from 'better-scroll'
  import { mapState, mapActions } from 'vuex'
  import Utils from '@/common/scripts/utils'
  import Login from '@/components/Login'
  import Command from '@/components/Command'
  import ProcessView from '@/components/View'

  export default {
    data () {
      return {
        searchInput: '',
        title: '',
        processListLoading: false,
        username: Utils.getUserName(),
        showLoginDialog: false,
        showSaveDialog: false,
        formLabelWidth: '100px',
        saveBtnLoading: false,
        process: {
          id: '',
          title: '',
          description: '',
          code: ''
        },
        activatedProcess: {},
        processRules: {
          title: [
            {required: true, message: '请输入批处理标题', trigger: 'blur'}
          ],
          description: [
            {required: true, message: '请输入批处理描述', trigger: 'blur'}
          ],
          code: [
            {required: true, message: '平输入批处理代码', trigger: 'blur'}
          ]
        },
        ifRun: false
      }
    },
    components: {
      Login,
      Command,
      ProcessView
    },
    computed: {
      ...mapState('Process', [
        'processList',
        'pagination'
      ])
    },
    methods: {
      runProcess () {
        this.ifRun = true
      },
      stopProcess () {
        this.ifRun = false
      },
      selectItem (item) {
        this.activeProcess(item.id)
        this.activatedProcess = item
      },
      deleteItem (item) {
        this.$confirm(`此操作将永久删除批处理'${item.title}',是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteProcess(item.id).then(flag => {
            if (flag) {
              this.$alert(`批处理'${item.title}'删除成功`, '提示', {
                type: 'success',
                confirmButtonText: '确定',
                callback: action => {
                  this.showProcessList()
                }
              })
            } else {
              this.$notify.error({
                title: '错误信息',
                message: `批处理'${item.title}'删除失败`
              })
            }
          }).catch(e => {
            this.$notify.error({
              title: '错误信息',
              message: `批处理'${item.title}'删除失败`
            })
          })
        })
      },
      openSaveDialog (title, item) {
        this.title = title
        if (item) {
          this.process.title = item.title
          this.process.description = item.description
          this.process.code = item.code
          this.process.id = item.id
        }
        this.showSaveDialog = true
      },
      closeSaveDialog () {
        this.showSaveDialog = false
        this.$refs['processForm'].resetFields()
        this.process.id = ''
      },
      saveProcessForm () {
        this.$refs['processForm'].validate((valid) => {
          if (valid) {
            let {id, title, description, code} = this.process
            this.saveBtnLoading = true
            this.saveProcess({id, title, description, code}).then(data => {
              if (data.flag === 2) {
                this.$notify.error({
                  title: '错误信息',
                  message: '您输入的标题已被占用'
                })
              } else if (data.flag === 0) {
                this.$notify.error({
                  title: '错误信息',
                  message: '保存失败'
                })
              } else {
                this.$alert('保存成功', '提示', {
                  type: 'success',
                  confirmButtonText: '确定',
                  callback: action => {
                    let proc = data.process
                    if (id) {
                      this.updateProcess(proc)
                    } else {
                      this.addProcess(proc)
                    }
                    this.closeSaveDialog()
                  }
                })
              }
              this.saveBtnLoading = false
            }).catch(e => {
              this.$notify.error({
                title: '错误信息',
                message: '保存失败'
              })
              this.saveBtnLoading = false
            })
          }
        })
      },
      showProcessList () {
        this.queryProcessList({start: 0, size: 10, ifAppend: false}).then(() => {
          // 默认选中第一条
          this.selectItem(this.processList[0])
          if (this.processScroll) {
            return false
          }
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
          // 滚动条到达底部触发加载数据
          this.processScroll.on('scrollEnd', () => {
            if (this.processListLoading) {
              return false
            }
            let pagination = this.pagination
            if (pagination.start + pagination.size > pagination.total) {
              return false
            }
            if (this.processScroll.y <= (this.processScroll.maxScrollY + 50)) {
              this.processListLoading = true
              this.queryProcessList({start: pagination.start + pagination.size, size: 10, ifAppend: true}).then(() => {
                // this.processScroll.refresh()
                this.processListLoading = false
              })
            }
          })
        })
      },
      dropdownCommand (command) {
        if (command === 'logout') {
          Utils.clearStorage()
          window.location.reload()
        }
      },
      ...mapActions('Process', [
        'queryProcessList',
        'saveProcess',
        'addProcess',
        'updateProcess',
        'deleteProcess',
        'activeProcess'
      ])
    },
    mounted () {
      if (this.username) {
        this.showProcessList()
      }
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
    z-index: 1;
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

  aside .inner .process-list {
    height: 100%;
    overflow: hidden;
  }

  .process-list ul {
    padding: 0;
    margin: 0;
  }

  .process-list li {
    padding: 20px 30px;
    border-bottom: 1px solid #5a5d63;
    position: relative;
    word-break: break-all;
    word-wrap: break-word;
    line-height: 20px;
    cursor: pointer;
  }

  .process-list li .actions {
    position: absolute;
    right: 10px;
    bottom: 8px;
  }

  .process-list li .actions i {
    margin: 0 3px;
    cursor: pointer;
  }

  .process-list li .actions i:hover {
    transform: scale(1.2);
  }

  .process-list li .actions .btn-edit {
    color: #E6A23C;
  }

  .process-list li .actions .btn-delete {
    color: #F56C6C;
  }

  .process-list li.active {
    background-color: #404349;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.18);
  }
  .process-list li:hover{
    background-color: #404349;
  }
  .process-list li.active:before {
    position: absolute;
    left: 0;
    top: 0;
    width: 4px;
    background-color: #11b683;
    height: 100%;
    content: '';

  }

  .process-list li h3 {
    color: #fff;
    font-size: 15px;
    font-weight: normal;
    margin-bottom: 20px;
  }

  .process-list li p {
    color: #fff;
    font-size: 14px;
    margin-bottom: 20px;
  }

  .wrapper main {
    height: 100%;
    margin-left: 300px;
    overflow: hidden;
  }
  .wrapper main.full-width {
    margin-left: 0;
  }

  main .inner {
    height: 100%;
    width: 100%;
  }
  main .inner .box-view, main .inner .box-command{
    height: 50%;
    width: 100%;
  }
  .wrapper main.full-width .box-command{
    height: 100%;
  }

  .btn-login {
    background-color: #ff6c2f;
    border-color: #ff6c2f;
  }

  .btn-login:hover {
    background-color: #ff902e;
    border-color: #ff902e;
  }
  .el-textarea textarea{
    height: 100px;
  }
</style>
