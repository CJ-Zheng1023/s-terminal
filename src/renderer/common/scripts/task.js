import Utils from '@/common/scripts/utils'
import axios from '@/common/scripts/axios'
/**
 * 任务类
 */
class Task {
  constructor (input, vm) {
    this.input = input.trim()
    this.vm = vm
  }

  /**
   * 执行任务
   */
  run () {
    if (!this.input) {
      addContent.call(this, 'cmd', '&nbsp;')
      done.call(this)
      return
    }
    let {cmd, cmdObj, params} = parse(this.input)
    addContent.call(this, 'cmd', this.input)
    addHistory.call(this)
    if (!cmdObj) {
      addContent.call(this, 'result', `${cmd}是未识别的命令`)
      done.call(this)
      return
    }
    this.cmd = cmd
    this.cmdObj = cmdObj
    cmdObj.handler.apply(this, params)
  }

  /**
   * 设置下一个任务
   * @param task 任务
   */
  setNext (task) {
    this.next = task
    return this
  }

  /**
   * 执行下一个任务
   */
  executeNext () {
    if (this.next) {
      this.next.run()
    } else {
      done.call(this)
    }
  }
}

/**
 * 解析命令
 * @param input
 * @returns {cmd: 命令, cmdObj: 命令对应的操作对象, params: 命令传入的参数}
 */
let parse = (input) => {
  let [cmd, ...params] = input.split(/ +/)
  return {
    cmd,
    cmdObj: _cmdMap[cmd],
    params
  }
}
/**
 * 清空操作
 */
let clearHandler = function () {
  this.vm.contents = []
  addHistory.apply(this)
  this.executeNext()
}
/**
 * 切换数据库操作
 */
let switchDBHandler = function () {
  let db = arguments[0]
  if (!db) {
    addContent.call(this, 'result', `${this.cmdObj.example(this.cmd)}`)
    done.call(this)
    return
  }
  if (!_dbArray.includes(db)) {
    addContent.call(this, 'result', `数据库${db}不存在`)
    done.call(this)
    return
  }
  this.vm.db = db
  this.executeNext()
}
/**
 * 显示当前数据库操作
 */
let dbHandler = function () {
  addContent.call(this, 'result', `当前数据库:${this.vm.db}`)
  this.executeNext()
}
/**
 * 帮助操作
 */
let helpHandler = function () {
  let html = `<table><thead><tr><th>命令</th><th>说明</th></tr></thead><tbody>`
  Object.keys(_cmdMap).forEach(item => {
    let content = _cmdMap[item].desc
    if (_cmdMap[item].example) {
      content += _cmdMap[item].example(item)
    }
    let tr = `<tr><td style="text-align: center">${item}</td><td style="text-align: center">${content}</td></tr>`
    html += tr
  })
  html += `</tbody></table>`
  addContent.call(this, 'result', `${html}`)
  this.executeNext()
}
/**
 * 检索操作
 */
let searchHandler = function () {
  if (!this.vm.db) {
    addContent.call(this, 'result', `请选择数据库`)
    done.call(this)
    return
  }
  let exp = arguments[0]
  if (!exp) {
    addContent.call(this, 'result', `${this.cmdObj.example(this.cmd)}`)
    done.call(this)
    return
  }
  this.vm.exp = exp
  addContent.call(this, 'result', `执行检索式:${exp}`)
  axios.post('/search').then(response => {
    addContent.call(this, 'result', `检索到${response.data.total}个专利`)
    this.executeNext()
  })
}
/**
 * 记录输入命令和结果
 * @param type 内容类型 cmd：命令类型    result：结果类型
 * @param words 记录的内容
 */
let addContent = function (type, words) {
  this.vm.contents.push({
    id: Utils.idGenerator(),
    type,
    words
  })
  process.nextTick(() => {
    this.vm.scroller.scrollTo(0, this.vm.scroller.maxScrollY)
  })
}
/**
 * 记录输入的命令
 */
let addHistory = function () {
  this.vm.historyInput.push(this.input)
  process.nextTick(() => {
    this.vm.scroller.scrollTo(0, this.vm.scroller.maxScrollY)
  })
}
let done = function () {
  this.vm.$emit('stop')
}
/**
 * 命令映射对象
 */
const _cmdMap = {
  'help': {
    desc: '使用说明',
    handler: helpHandler
  },
  'clear': {
    desc: '清除内容',
    handler: clearHandler
  },
  'sd': {
    desc: '选择数据库。',
    example (cmd) {
      return `使用方法：${cmd} &lt;${formatDBArray()}&gt;`
    },
    handler: switchDBHandler
  },
  'db': {
    desc: '显示当前数据库',
    handler: dbHandler
  },
  'search': {
    desc: '执行检索。',
    example (cmd) {
      return `使用方法：${cmd} &lt;手机/ti&gt;`
    },
    handler: searchHandler
  }
}
/**
 * 数据库集合
 */
const _dbArray = ['cnabs', 'dwpi']
/**
 * 格式化数据库集合转为字符串
 * @returns {string}   输出形式为  cnabs|dwpi
 */
let formatDBArray = function () {
  let dbs = ''
  _dbArray.forEach(item => {
    dbs = dbs + '|' + item
  })
  return dbs.substring(1)
}
export default Task
