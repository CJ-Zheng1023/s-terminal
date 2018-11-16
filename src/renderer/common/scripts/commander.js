import Task from '@/common/scripts/task'
import Executor from '@/common/scripts/executor'
/**
 * 回车键命令
 * @param vm vue实例
 */
let cmdEnter = (vm) => {
  let input = vm.input
  vm.input = ''
  vm.historyIndex = -1
  vm.cursorIndex = -1
  let executor = new Executor()
  executor.addTask(new Task(input, vm))
  executor.execute()
}
/**
 * backspace键命令
 * @param vm  vue实例
 */
let cmdBackSpace = (vm) => {
  if (vm.cursorIndex === -1) {
    vm.input = vm.input.substr(0, vm.input.length - 1)
    return
  }
  if (vm.cursorIndex !== 0) {
    let input = vm.input
    let left = input.slice(0, vm.cursorIndex - 1)
    let right = input.slice(vm.cursorIndex)
    vm.input = left + right
    cmdLeftArrow(vm)
  }
}
/**
 * 左箭头命令
 * @param vm vue实例
 */
let cmdLeftArrow = (vm) => {
  if (vm.cursorIndex === -1) {
    vm.cursorIndex = vm.input.length - 1
    return
  }
  if (vm.cursorIndex !== 0) {
    vm.cursorIndex = vm.cursorIndex - 1
  }
}
/**
 * 右箭头命令
 * @param vm
 */
let cmdRightArrow = (vm) => {
  if (vm.cursorIndex === -1) {
    return
  }
  if (vm.cursorIndex !== vm.input.length) {
    vm.cursorIndex += 1
    if (vm.cursorIndex === vm.input.length) {
      vm.cursorIndex = -1
    }
  }
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
  vm.cursorIndex = -1
  vm.historyIndex = vm.historyIndex + 1
  vm.input = getHistory(vm.historyInput, vm.historyIndex)
}
/**
 * 向下箭头命令
 * @param vm
 */
let cmdDownArrow = (vm) => {
  if (vm.historyIndex <= 0) {
    return
  }
  vm.cursorIndex = -1
  vm.historyIndex = vm.historyIndex - 1
  vm.input = getHistory(vm.historyInput, vm.historyIndex)
}
/**
 * 输入字符
 * @param e 事件对象
 * @param vm  vue实例
 */
let addText = (e, vm) => {
  let keyCode = e.keyCode
  // 排除无意义的键盘键
  if (_specialKeys.includes(keyCode) || (keyCode >= 96 && keyCode <= 186) || (keyCode >= 193 && keyCode <= 254)) {
    return
  }
  if (vm.cursorIndex === -1) {
    vm.input += e.key
  } else {
    let left = vm.input.slice(0, vm.cursorIndex)
    let right = vm.input.slice(vm.cursorIndex)
    vm.input = left + e.key + right
    cmdRightArrow(vm)
  }
}
/**
 *键盘Keycode对应的业务逻辑
 */
const _keyMap = {
  13: cmdEnter,
  8: cmdBackSpace,
  37: cmdLeftArrow,
  38: cmdUpArrow,
  39: cmdRightArrow,
  40: cmdDownArrow
}
/**
 *无业务意义的键盘Keycode
 */
const _specialKeys = [9, 12, 16, 17, 18, 19, 20, 27, 33, 34, 35, 36, 41, 42, 43, 45, 46, 47]
export default {
  init (e, vm) {
    let keyCode = e.keyCode
    let cmd = _keyMap[keyCode]
    if (!cmd) {
      addText(e, vm)
    } else {
      cmd(vm)
    }
  },
  executeProcess (vm) {
    let code = vm.code
    let inputList = code.split('\n')
    vm.input = ''
    vm.historyIndex = -1
    vm.cursorIndex = -1
    let executor = new Executor()
    inputList.forEach(input => {
      executor.addTask(new Task(input, vm))
    })
    executor.execute()
  }
}
