import Task from '@/common/scripts/task'
import Executor from '@/common/scripts/executor'
/**
 * 回车键命令
 * @param vm vue实例
 */
let cmdEnter = (vm) => {
  let input = vm.$refs.inputArea.innerText
  vm.historyIndex = -1
  vm.$refs.inputArea.innerText = ''
  let executor = new Executor()
  executor.addTask(new Task(input, vm))
  executor.execute()
  return false
}
/**
 * 根据索引位置获取历史命令
 * @param array  历史命令
 * @param index  索引位置
 */
let getHistory = (array, index) => array[array.length - 1 - index]
/**
 * 向上箭头命令
 * @param vm
 */
let cmdUpArrow = (vm) => {
  if (vm.historyIndex === vm.historyInput.length - 1) {
    return
  }
  vm.historyIndex = vm.historyIndex + 1
  let inputArea = vm.$refs.inputArea
  inputArea.innerText = getHistory(vm.historyInput, vm.historyIndex)
  let range = window.getSelection()
  range.selectAllChildren(inputArea)
  range.collapseToEnd()
}
/**
 * 向下箭头命令
 * @param vm
 */
let cmdDownArrow = (vm) => {
  if (vm.historyIndex <= 0) {
    return
  }
  let inputArea = vm.$refs.inputArea
  vm.historyIndex = vm.historyIndex - 1
  inputArea.innerText = getHistory(vm.historyInput, vm.historyIndex)
  let range = window.getSelection()
  range.selectAllChildren(inputArea)
  range.collapseToEnd()
}
/**
 *键盘Keycode对应的业务逻辑
 */
const _keyMap = {
  13: cmdEnter,
  38: cmdUpArrow,
  40: cmdDownArrow
}
export default {
  init (e, vm) {
    let keyCode = e.keyCode
    let cmd = _keyMap[keyCode]
    cmd && cmd(vm)
  },
  executeProcess (vm) {
    let code = vm.code
    let inputList = code.split(/\n+/)
    vm.$refs.inputArea.innerHTML = ''
    vm.historyIndex = -1
    vm.cursorIndex = -1
    let executor = new Executor()
    inputList.forEach(input => {
      executor.addTask(new Task(input, vm))
    })
    executor.execute()
  }
}
