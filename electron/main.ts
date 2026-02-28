import { app, BrowserWindow, ipcMain, session, shell } from 'electron'
import * as path from 'path'
import { isDev } from './utils'

let mainWindow: BrowserWindow | null = null

// Get the correct path for preload script
const getPreloadPath = (): string => {
  const preloadPath = path.join(__dirname, 'preload.js')
  return preloadPath
}

// Get the correct path for index.html
const getIndexPath = (): string => {
  if (isDev) {
    return 'http://localhost:5173'
  }
  // In production, renderer files are in dist/renderer/
  const indexPath = path.join(__dirname, '../renderer/index.html')
  return `file://${indexPath}`
}

const createWindow = (): void => {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 600,
    webPreferences: {
      preload: getPreloadPath(),
      nodeIntegration: false,
      contextIsolation: true,
      webviewTag: true, // Enable <webview> tag
      webSecurity: false, // Allow loading external websites (required for webview)
    },
  })

  const startUrl = getIndexPath()
  console.log(`[Electron] Loading URL: ${startUrl}`)
  console.log(`[Electron] isDev: ${isDev}`)
  console.log(`[Electron] app.isPackaged: ${app.isPackaged}`)

  mainWindow.loadURL(startUrl).catch((err) => {
    console.error('[Electron] Failed to load URL:', err)
  })

  // Open devTools for debugging in dev mode only
  if (isDev) {
    mainWindow.webContents.openDevTools()
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  // Log when page loads
  mainWindow.webContents.on('did-finish-load', () => {
    console.log('[Electron] Page loaded successfully')
  })

  // Log any errors
  mainWindow.webContents.on('crashed', () => {
    console.error('[Electron] Renderer process crashed')
  })

  // Handle link clicks to open in browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http:') || url.startsWith('https:')) {
      shell.openExternal(url)
      return { action: 'deny' }
    }
    return { action: 'allow' }
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

// IPC handlers for window control
ipcMain.handle('get-app-version', () => {
  return app.getVersion()
})

ipcMain.handle('get-app-path', () => {
  return app.getAppPath()
})

ipcMain.handle('minimize-window', () => {
  mainWindow?.minimize()
})

ipcMain.handle('maximize-window', () => {
  if (mainWindow?.isMaximized()) {
    mainWindow.unmaximize()
  } else {
    mainWindow?.maximize()
  }
})

ipcMain.handle('close-window', () => {
  mainWindow?.close()
})

// IPC handlers for dev tools
ipcMain.handle('open-dev-tools', () => {
  mainWindow?.webContents.openDevTools()
})

ipcMain.handle('close-dev-tools', () => {
  mainWindow?.webContents.closeDevTools()
})

// IPC handler for getting preload path for webviews
ipcMain.handle('get-preload-path', (event, scriptName: string = 'webview-preload.js') => {
  const preloadPath = path.join(__dirname, scriptName)
  console.log(`[IPC] Returning preload path: ${preloadPath}`)
  return preloadPath
})

// IPC handler for saving session
ipcMain.handle('save-session', (event, data: { providerId: string }) => {
  console.log(`[IPC] Saving session for provider: ${data.providerId}`)
  // Session data is stored in the webview partition, no action needed here
  return { success: true }
})

// IPC handler for loading session
ipcMain.handle('load-session', (event, data: { providerId: string }) => {
  console.log(`[IPC] Loading session for provider: ${data.providerId}`)
  // Session data is automatically restored from partition
  return { exists: true, sessionData: null }
})

// Open external links in default browser
ipcMain.handle('open-external', (event, url: string) => {
  shell.openExternal(url)
})
