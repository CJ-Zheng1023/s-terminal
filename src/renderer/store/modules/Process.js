import axios from '@/common/scripts/axios'
const MODULE_CONTEXT = '/process'
export default {
  namespaced: true,
  state () {
    return {
      processList: [],
      pagination: {}
    }
  },
  mutations: {
    queryProcessList (state, data) {
      state.processList.push(...data.processList)
      state.pagination = data.pagination
    }
  },
  actions: {
    queryProcessList ({commit}, {start, size}) {
      return new Promise((resolve, reject) => {
        axios.get(`${MODULE_CONTEXT}/list?start=${start}&size=${size}`).then(response => {
          commit('queryProcessList', response.data)
          resolve()
        }).catch(e => {
          console.log(e)
          reject(e)
        })
      })
    },
    addProcess ({commit}, process) {
      return new Promise((resolve, reject) => {
        axios.post(`${MODULE_CONTEXT}/add`, process).then(response => {
          resolve(response.data.flag)
        }).catch(e => {
          console.log(e)
          reject(e)
        })
      })
    },
    deleteProcess ({commit}, id) {
      return new Promise((resolve, reject) => {
        axios.post(`${MODULE_CONTEXT}/delete`, {id}).then(response => {
          resolve(response.data.flag)
        }).catch(e => {
          console.log(e)
          reject(e)
        })
      })
    },
    editProcess ({commit}, process) {
      return new Promise((resolve, reject) => {
        axios.post(`${MODULE_CONTEXT}/edit`, process).then(response => {
          resolve(response.data.flag)
        }).catch(e => {
          console.log(e)
          reject(e)
        })
      })
    }
  }
}
