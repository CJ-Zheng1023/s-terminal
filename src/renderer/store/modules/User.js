import axios from '@/common/scripts/axios'
import Utils from '@/common/scripts/utils'
const MODULE_CONTEXT = '/admin-service'
export default {
  namespaced: true,
  state () {
    return {
      user: {
        username: Utils.getUserName()
      }
    }
  },
  mutations: {
    login (state, data) {
      state.user.username = data.username
    },
    logout (state) {
      state.user.username = ''
    }
  },
  actions: {
    register ({commit}, {username, password}) {
      return new Promise((resolve, reject) => {
        axios.post(`${MODULE_CONTEXT}/register`, {
          username,
          password
        }).then(response => {
          resolve(response.data.flag)
        }).catch(e => {
          console.log(e)
          reject(e)
        })
      })
    },
    login ({commit}, {username, password}) {
      return new Promise((resolve, reject) => {
        axios.post(`${MODULE_CONTEXT}/auth`, {
          username,
          password
        }, {
          headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).then(response => {
          resolve(response.data)
        }).catch(e => {
          console.log(e)
          reject(e)
        })
      })
    },
    queryUser ({commit}) {
      return new Promise((resolve, reject) => {
        axios.post(`${MODULE_CONTEXT}/user/info`).then(response => {
          commit('login', response.data.data)
          resolve(response.data)
        }).catch(e => {
          console.log(e)
          reject(e)
        })
      })
    },
    logout ({commit}) {
      commit('logout')
    }
  }
}
