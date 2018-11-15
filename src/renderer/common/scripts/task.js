import Utils from '@/common/scripts/utils'
class Task {
  constructor (input, vm) {
    this.input = input
    this.vm = vm
  }
  run () {
    let {handler, params} = parse(this.input)
    if (!handler) {
      addContent.call(this, 'cmd', this.input)
      addContent.call(this, 'result', `${this.input}是未识别的命令`)
      addHistory.call(this)
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
  'clear': clearHandler
}
export default Task
