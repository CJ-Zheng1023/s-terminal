export default {
  namespaced: true,
  state () {
    return {
      historyInput: [],
      logs: [],
      db: '',
      exp: ''
    }
  },
  mutations: {
    addLog (state, {type, data}) {
      state.logs.push({
        type,
        data
      })
    },
    clearLogs (state) {
      state.logs = []
    },
    addHistory (state, input) {
      state.historyInput.push(input)
    },
    switchDataBase (state, db) {
      state.db = db
    },
    switchExp (state, exp) {
      state.exp = exp
    }
  },
  actions: {
    addLog ({commit}, {type, data}) {
      return new Promise((resolve, reject) => {
        commit('addLog', {type, data})
        resolve()
      })
    },
    clearLogs ({commit}) {
      commit('clearLogs')
    },
    addHistory ({commit}, input) {
      return new Promise((resolve, reject) => {
        commit('addHistory', input)
        resolve()
      })
    },
    switchDataBase ({commit}, db) {
      commit('switchDataBase', db)
    },
    switchExp ({commit}, exp) {
      commit('switchExp', exp)
    }
  }
}
