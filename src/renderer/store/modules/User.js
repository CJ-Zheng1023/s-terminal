import axios from '@/common/scripts/axios'
const MODULE_CONTEXT = '/user'
export default {
  namespaced: true,
  state () {
    return {
      user: {}
    }
  },
  mutations: {
    login (state, data) {
      state.user = data.user
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
        axios.post(`${MODULE_CONTEXT}/login`, {
          username,
          password
        }).then(response => {
          commit('login', response.data)
          resolve(response.data.flag)
        }).catch(e => {
          console.log(e)
          reject(e)
        })
      })
    }
  }
}
