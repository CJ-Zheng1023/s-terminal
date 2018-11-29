import Vue from 'vue'
import axios from 'axios'
import qs from 'qs'
import config from '@/common/scripts/config'
import Utils from '@/common/scripts/utils'
axios.defaults.timeout = 20000
if (process.env.NODE_ENV === 'development') {
  axios.defaults.baseURL = config.dev_server_url
} else {
  axios.defaults.baseURL = config.pro_server_url
}
axios.interceptors.request.use((request) => {
  if (request.data && request.headers['Content-Type'] === 'application/x-www-form-urlencoded') {
    request.data = qs.stringify(request.data)
  }
  request.headers['token'] = Utils.getToken() || ''
  return request
})
axios.interceptors.response.use(
  response => {
    if (response.data.status === 200) {
      return response
    } else {
      Vue.prototype.$notify.error({
        title: '错误信息',
        message: response.data.message
      })
      throw new Error(response.data.message)
    }
  },
  error => {
    /* if (error.response) {
      switch (error.response.status) {
        case 403:
          window.localStorage.removeItem('token')
          window.localStorage.removeItem('userId')
          window.localStorage.removeItem('username')
          Vue.prototype.$alert('您的登录超时，请重新登录', '提示', {
            confirmButtonText: '确定',
            type: 'error'
          }).then(action => {
          })
          break
        default:
          Vue.prototype.$alert(`系统出了点问题。。。`, '提示', {
            confirmButtonText: '确定',
            type: 'error'
          })
      }
    } */
    return Promise.reject(error)
  }
)
export default axios
