import {shell} from 'electron'
import xlsx from 'node-xlsx'
import config from '@/common/scripts/config'
let crypto = require('crypto')
let os = require('os')
let fs = require('fs')
let path = require('path')

const USER_NAME_KEY = 'username'
const TOKEN_KEY = 'token'
const LATEST_CMD = 'latest_cmd'
const getItem = (key) => window.localStorage.getItem(key)
const setItem = (key, value) => window.localStorage.setItem(key, value)
const removeItem = (key) => window.localStorage.removeItem(key)
const stringToArray = (str, format = ',') => {
  return str ? str.split(format) : []
}
export default {
  idGenerator () {
    let buf = crypto.randomBytes(16)
    return buf.toString('hex')
  },
  isLogin () {
    return !!this.getUserName()
  },
  getUserName () {
    return getItem(USER_NAME_KEY)
  },
  getToken () {
    return getItem(TOKEN_KEY)
  },
  setUserName (value) {
    setItem(USER_NAME_KEY, value)
  },
  setToken (value) {
    setItem(TOKEN_KEY, value)
  },
  clearStorage () {
    removeItem(USER_NAME_KEY)
    removeItem(TOKEN_KEY)
  },
  exportExcel (exportData) {
    let exportPath = path.join(os.homedir(), '结果集.xlsx')
    let buffer = xlsx.build([
      {
        name: 'sheet1',
        data: exportData
      }
    ])
    fs.writeFile(exportPath, buffer, (error) => {
      if (error) {
        console.error(error)
      }
      shell.openExternal(`file://${exportPath}`)
    })
  },
  // 获取近期使用的命令集合，用于在欢迎面板展示
  getLatestCmd () {
    return stringToArray(getItem(LATEST_CMD))
  },
  // 添加近期使用的命令
  addLatestCmd (cmd) {
    const max = config.max_latest_cmd
    let cmdArray = stringToArray(getItem(LATEST_CMD))
    if (cmdArray.length > max) {
      cmdArray.shift()
    }
    cmdArray.push(cmd)
    setItem(LATEST_CMD, cmdArray.toString())
  }
}
