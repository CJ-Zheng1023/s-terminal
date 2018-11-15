import Utils from '@/common/scripts/utils'
class Task {
  constructor (input, vm) {
    this.input = input
    this.vm = vm
  }
  run () {
    let {handler, params} = parse(this.input)
    addContent.call(this, 'cmd', this.input)
    addHistory.call(this)
    if (!handler) {
      addContent.call(this, 'result', `${this.input}是未识别的命令`)
      return
    }
    handler.apply(this, params)
  }
}
let parse = (input) => {
  let [cmd, ...params] = input.split(/ +/)
  return {
    handler: _handlerMap[cmd],
    params
  }
}
let clearHandler = function () {
  this.vm.contents = []
  addHistory.apply(this)
}
let switchDBHandler = function () {
  let db = arguments[0]
  if (!db) {
    addContent.call(this, 'result', `请输入数据库`)
    return
  }
  if (!_dbArray.includes(db)) {
    addContent.call(this, 'result', `数据库${db}不存在`)
    return
  }
  this.vm.db = db
}
let dbHandler = function () {
  addContent.call(this, 'result', `当前数据库:${this.vm.db}`)
}
let addContent = function (type, words) {
  this.vm.contents.push({
    id: Utils.idGenerator(),
    type,
    words
  })
}
let addHistory = function () {
  this.vm.historyInput.push(this.input)
}
const _handlerMap = {
  'clear': clearHandler,
  'sd': switchDBHandler,
  'db': dbHandler
}
const _dbArray = ['cnabs', 'dwpi']
export default Task
