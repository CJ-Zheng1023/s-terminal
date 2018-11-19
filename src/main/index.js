'use strict'

import { app, BrowserWindow, dialog, ipcMain } from 'electron'
const fs = require('fs')

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    minHeight: 563,
    useContentSize: true,
    minWidth: 1000
    // frame: false
    // titleBarStyle: 'hidden'
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
ipcMain.on('download', (event, {code, name}) => {
  console.log(name)
  dialog.showSaveDialog({
    title: '下载代码',
    filters: [
      {name: name, extensions: ['txt']}
    ]
  }, (fileName) => {
    if (fileName) {
      fs.writeFile(fileName, code, (error) => {
        if (error) {
          console.error(error)
        }
        dialog.showMessageBox({
          type: 'info',
          message: '下载成功！',
          buttons: ['确定']
        })
      })
    }
  })
})
