const { app, BrowserWindow } = require('electron')
const path = require('path')

function createWindow() {
  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false  // 允许加载本地文件
    },
    icon: path.join(__dirname, 'dist', 'favicon.ico')
  })

  // 加载本地打包文件
  const indexPath = path.join(__dirname, 'dist', 'index.html')
  console.log('Loading:', indexPath)
  
  win.loadFile(indexPath)
  
  // 打开开发者工具（用于调试）
  // win.webContents.openDevTools()
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

// 错误处理
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error)
})
