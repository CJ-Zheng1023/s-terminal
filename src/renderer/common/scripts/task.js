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
      addContent.call(this, 'result', `${cmd}是未识别的命令,输入help查看使用说明`)
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
  let exp = ''
  Array.from(arguments).forEach(item => {
    exp = exp + ' ' + item
  })
  exp = exp.substring(0)
  if (!exp) {
    addContent.call(this, 'result', `${this.cmdObj.example(this.cmd)}`)
    done.call(this)
    return
  }
  this.vm.exp = exp
  addContent.call(this, 'result', `执行检索式:${exp}`)
  axios.post('/search').then(response => {
    let total = Number(response.data.total)
    addContent.call(this, 'result', `检索到${total}个专利`)
    addExpList.call(this, {total, exp, db: this.vm.db})
    this.executeNext()
  })
}
/**
 * 统计操作
 */
let statisticHandler = function () {
  if (!this.vm.exp) {
    addContent.call(this, 'result', `没有可统计结果集`)
    done.call(this)
    return
  }
  if (!arguments.length) {
    addContent.call(this, 'result', `缺少统计字段参数`)
    done.call(this)
    return
  }
  axios.get('/statistic').then(response => {
    let result = response.data.result
    let html = '<h4>统计结果</h4><table>'
    Object.keys(result).forEach(key => {
      html = `${html}<tr><td>${key}</td><td>${result[key]}</td></tr>`
    })
    html += '</table>'
    addContent.call(this, 'result', `${html}`, response.data.statisticData)
    this.executeNext()
  })
}
/**
 * 导出结果集
 */
let exportHandler = function () {
  if (!this.vm.exp) {
    addContent.call(this, 'result', `没有可导出结果集`)
    done.call(this)
    return
  }
  axios.get('/search/list').then(response => {
    let list = response.data.patentList
    let exportData = []
    list.forEach(item => {
      let arr = [item.an, item.title]
      exportData.push(arr)
    })
    addContent.call(this, 'result', `结果集导出完毕`)
    Utils.exportExcel(exportData)
    this.executeNext()
  })
}
/**
 * 记录输入命令和结果
 * @param type 内容类型 cmd：命令类型    result：结果类型
 * @param words 记录的内容
 * @param statisticData   统计数据
 */
let addContent = function (type, words, statisticData) {
  this.vm.contents.push({
    id: Utils.idGenerator(),
    type,
    words,
    statisticData
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
/**
 * 记录检索式
 * @param exp 检索式
 */
let addExpList = function (searchHistory) {
  this.vm.searchHistoryList.push(searchHistory)
}
/**
 * 修改父组件正在运行标识位
 */
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
    /**
     * 使用说明
     * @param cmd   命令
     * @returns {string} 使用说明字符串
     */
    example (cmd) {
      return `使用方法：${cmd} &lt;手机/ti&gt;`
    },
    handler: searchHandler
  },
  'st': {
    desc: '对结果集进行统计。',
    example (cmd) {
      return `使用方法：${cmd} &lt;统计字段&gt;`
    },
    handler: statisticHandler
  },
  'export': {
    desc: '导出结果集',
    handler: exportHandler
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
