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
    queryProcessList (state, obj) {
      obj.data.processList.forEach(item => {
        item.active = false
      })
      if (obj.ifAppend) {
        state.processList.push(...obj.data.processList)
      } else {
        state.processList = obj.data.processList
      }
      state.pagination = obj.data.pagination
    },
    addProcess (state, process) {
      state.processList.unshift(process)
    },
    updateProcess (state, process) {
      state.processList.forEach(item => {
        if (item.id === process.id) {
          item.title = process.title
          item.description = process.description
          item.code = process.code
        }
      })
    },
    activeProcess (state, id) {
      state.processList.forEach(item => {
        if (id === item.id) {
          item.active = true
        } else {
          item.active = false
        }
      })
    }
  },
  actions: {
    /**
     * @param commit
     * @param start
     * @param size
     * @param ifAppend  是否给集合追加数据  true追加     false重置集合
     * @returns {Promise}
     */
    queryProcessList ({commit}, {start, size, ifAppend}) {
      return new Promise((resolve, reject) => {
        axios.get(`${MODULE_CONTEXT}/list?start=${start}&size=${size}`).then(response => {
          commit('queryProcessList', {data: response.data, ifAppend})
          resolve()
        }).catch(e => {
          console.log(e)
          reject(e)
        })
      })
    },
    saveProcess ({commit}, process) {
      return new Promise((resolve, reject) => {
        axios.post(`${MODULE_CONTEXT}/save`, process).then(response => {
          resolve(response.data)
        }).catch(e => {
          console.log(e)
          reject(e)
        })
      })
    },
    addProcess ({commit}, process) {
      commit('addProcess', process)
    },
    updateProcess ({commit}, process) {
      commit('updateProcess', process)
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
    activeProcess ({commit}, id) {
      commit('activeProcess', id)
    }
  }
}
