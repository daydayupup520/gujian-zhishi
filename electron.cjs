const { app, BrowserWindow } = require('electron')
const path = require('path')
const { pathToFileURL } = require('url')

function createWindow() {
  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: true
    }
  })

  // 加载本地打包文件 - 使用 file:// 协议
  const indexPath = path.join(__dirname, 'dist', 'index.html')
  const fileUrl = pathToFileURL(indexPath).href
  win.loadURL(fileUrl)
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
