const { app, BrowserWindow } = require('electron')
const path = require('path')
const { pathToFileURL } = require('url')

function createWindow() {
  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false
    }
  })

  // 加载本地打包文件 - 使用 file:// 协议
  const indexPath = path.join(__dirname, 'dist', 'index.html')
  const fileUrl = pathToFileURL(indexPath).href
  console.log('Loading:', fileUrl)
  
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
