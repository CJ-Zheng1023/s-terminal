<template>
  <div class="mask">
    <div class="box">
      <i class="fa fa-close" @click="close"></i>
      <div v-show="showLoginForm">
        <div class="box-header">
          <h2 class="title">用 户 登 录</h2>
        </div>
        <div class="box-body">
          <el-form :model="loginForm" :rules="loginRules" ref="loginForm">
            <el-form-item prop="username" class="form-item">
              <i class="fa fa-user"></i>
              <el-input v-model="loginForm.username" class="input-icon"></el-input>
            </el-form-item>
            <el-form-item prop="password" class="form-item">
              <i class="fa fa-lock"></i>
              <el-input type="password" v-model="loginForm.password" class="input-icon"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button :loading="loginBtnLoading" class="btn-submit" size="small" type="warning"
                         @click="submitLoginForm">
                登 录
                <i class="fa fa-arrow-circle-o-right"></i>
              </el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="box-footer">
          <div class="actions">
            <span @click="changeBox">注册新用户</span>
          </div>
        </div>
      </div>
      <div v-show="!showLoginForm">
        <div class="box-header">
          <h2 class="title">用 户 注 册</h2>
        </div>
        <div class="box-body">
          <el-form :model="registerForm" :rules="registerRules" ref="registerForm">
            <el-form-item prop="username" class="form-item">
              <i class="fa fa-user"></i>
              <el-input v-model="registerForm.username" class="input-icon"></el-input>
            </el-form-item>
            <el-form-item prop="password" class="form-item">
              <i class="fa fa-lock"></i>
              <el-input type="password" v-model="registerForm.password" class="input-icon"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button :loading="registerBtnLoading" class="btn-submit" size="small" type="warning"
                         @click="submitRegisterForm">
                注 册
                <i class="fa fa-user-plus"></i>
              </el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="box-footer">
          <div class="actions">
            <span @click="changeBox">用户登录</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import { mapState, mapActions } from 'vuex'
  import Utils from '@/common/scripts/utils'

  export default {
    data () {
      return {
        loginBtnLoading: false,
        registerBtnLoading: false,
        showLoginForm: true,
        loginForm: {
          username: '',
          password: ''
        },
        loginRules: {
          username: [
            {required: true, message: '请输入账号', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'}
          ]
        },
        registerForm: {
          username: '',
          password: ''
        },
        registerRules: {
          username: [
            {required: true, message: '请输入账号', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'}
          ]
        }
      }
    },
    computed: {
      ...mapState('User', [
        'user'
      ])
    },
    methods: {
      changeBox () {
        this.$refs['loginForm'].resetFields()
        this.$refs['registerForm'].resetFields()
        this.showLoginForm = !this.showLoginForm
      },
      close () {
        this.$emit('close')
      },
      submitRegisterForm () {
        this.registerBtnLoading = true
        this.$refs['registerForm'].validate((valid) => {
          if (valid) {
            this.register({
              username: this.registerForm.username,
              password: this.registerForm.password
            }).then((code) => {
              if (code === 2) {
                this.$notify.error({
                  title: '错误信息',
                  message: '您输入的账号已被占用'
                })
              } else if (code === 0) {
                this.$notify.error({
                  title: '错误信息',
                  message: '注册失败'
                })
              } else {
                this.$alert('注册成功，请您在登录窗口登录', '提示', {
                  type: 'success',
                  confirmButtonText: '确定',
                  callback: action => {
                    this.changeBox()
                  }
                })
              }
              this.registerBtnLoading = false
            }).catch(e => {
              this.$notify.error({
                title: '错误信息',
                message: '注册失败'
              })
              this.registerBtnLoading = false
            })
          } else {
            this.registerBtnLoading = false
          }
        })
      },
      submitLoginForm () {
        this.loginBtnLoading = true
        this.$refs['loginForm'].validate((valid) => {
          if (valid) {
            this.login({
              username: this.loginForm.username,
              password: this.loginForm.password
            }).then((data) => {
              Utils.setToken(data.data)
              return this.queryUser()
            }).then(data => {
              Utils.setUserName(data.data.username)
              window.location.reload()
              this.loginBtnLoading = false
            }).catch(e => {
              this.loginBtnLoading = false
            })
          } else {
            this.loginBtnLoading = false
          }
        })
      },
      ...mapActions('User', [
        'queryUser',
        'register',
        'login'
      ])
    }
  }
</script>
<style scoped>
  .mask {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, .5);
    z-index: 2;
  }

  .box {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 300px;
    padding: 15px 50px;
    background-color: #fff;
    border-radius: 4px;
  }

  .box > i {
    position: absolute;
    right: 7px;
    top: 5px;
    cursor: pointer;
    color: #dddddd;
  }

  .box > i:hover {
    transform: scale(1.2);
  }

  .box-header .title {
    color: #ff6c2f;
    font-size: 20px;
    text-align: center;
    margin-bottom: 30px;
  }

  .btn-submit {
    background-color: #ff6c2f;
    border-color: #ff6c2f;
    width: 100%;
  }

  .btn-submit:hover {
    background-color: #ff902e;
    border-color: #ff902e;
  }

  .actions {
    padding-top: 10px;
    border-top: 1px solid #dddddd;
    text-align: right;
  }

  .actions > span {
    font-size: 14px;
    color: #ff6c2f;
    cursor: pointer;
  }
</style>