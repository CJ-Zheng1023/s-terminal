<template>
  <div>
    <header style="-webkit-app-region: drag;">
      <div class="logo">
        <i class="fa fa-2x fa-joomla"></i>
        <span>批处理系统</span>
      </div>
      <div class="actions" style="-webkit-app-region: no-drag;">
        <template v-if="username">
          <i class="fa fa-cog" v-tooltip.top-center="'设置'" @click="showSettingDialog = true"></i>
          <span class="separation"></span>
          <el-dropdown trigger="click" @command="dropdownCommand">
                    <span class="el-dropdown-link">
                        {{username}}
                        <i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>切换账号</el-dropdown-item>
              <el-dropdown-item command="logout">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <span class="separation"></span>
        </template>
        <i class="fa fa-window-minimize" style="position: relative;top: -4px;" @click="minWindow"></i>
        <i :class="['fa', isMaxWindow ? 'fa-window-restore' : 'fa-window-maximize']" @click="maxWindow"></i>
        <i class="fa fa-window-close-o" @click="closeWindow"></i>
      </div>
    </header>
    <div class="wrapper">
      <main class="full-width">
        <div class="inner">
          <router-view></router-view>
        </div>
      </main>
    </div>
    <el-dialog title="设置" :visible.sync="showSettingDialog" @close="showSettingDialog = false">
      <div class="dialog-setting">
        <h3>快捷键</h3>
        <el-form :label-width="formLabelWidth">
          <el-form-item label="快捷键1">
            <el-input autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="快捷键2">
            <el-input autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="快捷键3">
            <el-input autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <h3>其他</h3>
        <el-form :label-width="formLabelWidth">
          <el-form-item label="下载目录">
            <el-input :value="downloadPath" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button size="small" plain>检查更新</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showSettingDialog = false" size="small">关 闭</el-button>
        <el-button @click="showSettingDialog = false" type="warning" class="btn-login" size="small">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import Utils from '@/common/scripts/utils'
  import {ipcRenderer} from 'electron'
  import {mapState, mapActions} from 'vuex'
  let path = require('path')
  let os = require('os')

  export default {
    data () {
      return {
        showSettingDialog: false,
        formLabelWidth: '100px',
        downloadPath: path.join(os.homedir()),
        isMaxWindow: false
      }
    },
    computed: {
      username () {
        return this.user.username
      },
      ...mapState('User', [
        'user'
      ])
    },
    methods: {
      minWindow () {
        ipcRenderer.send('min-window')
      },
      closeWindow () {
        ipcRenderer.send('close-window')
      },
      maxWindow () {
        ipcRenderer.send('max-window')
      },
      dropdownCommand (command) {
        if (command === 'logout') {
          Utils.clearStorage()
          this.logout()
          // this.$router.push({path: '/login'})
          window.location.reload()
        }
      },
      ...mapActions('User', [
        'logout'
      ])
    },
    mounted () {
      ipcRenderer.on('change-window-max', () => {
        this.isMaxWindow = !this.isMaxWindow
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
    border-bottom: 1px solid #565656;
    box-sizing: border-box;
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
    margin: 0 3px;
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
  .dialog-setting{
    padding: 0 15px;
  }
  .dialog-setting .el-form{
    padding: 5px 30px;
  }
  .dialog-setting .el-input{
    width: 300px;
  }
</style>
