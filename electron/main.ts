import { app, BrowserWindow, ipcMain, shell } from 'electron'
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
      webSecurity: false, // Allow loading external websites
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

ipcMain.handle('get-system-info', () => {
  return {
    platform: process.platform,
    arch: process.arch,
    nodeVersion: process.version,
  }
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

ipcMain.handle('unmaximize-window', () => {
  mainWindow?.unmaximize()
})

ipcMain.handle('is-maximized', () => {
  return mainWindow?.isMaximized() || false
})

ipcMain.handle('close-window', () => {
  mainWindow?.close()
})

ipcMain.handle('toggle-fullscreen', () => {
  if (mainWindow) {
    mainWindow.setFullScreen(!mainWindow.isFullScreen())
  }
})

// IPC handlers for WebView
ipcMain.handle('send-message-to-webview', (event, { webviewId, message }) => {
  console.log(`[IPC] Sending message to ${webviewId}:`, message)
  return { success: true }
})

ipcMain.handle('refresh-webview', (event, webviewId) => {
  console.log(`[IPC] Refreshing webview ${webviewId}`)
  return { success: true }
})

ipcMain.handle('refresh-all-webviews', () => {
  console.log(`[IPC] Refreshing all webviews`)
  return { success: true }
})

ipcMain.handle('load-webview', (event, { webviewId, url }) => {
  console.log(`[IPC] Loading webview ${webviewId} with URL ${url}`)
  return { success: true }
})

ipcMain.handle('open-devtools', (event, webviewId) => {
  console.log(`[IPC] Opening devtools for ${webviewId}`)
  return { success: true }
})

// IPC handlers for session management
ipcMain.handle('session-save', (event, data) => {
  console.log(`[IPC] Saving session for provider: ${data.providerId}`)
  return { success: true }
})

ipcMain.handle('session-load', (event, data) => {
  console.log(`[IPC] Loading session for provider: ${data.providerId}`)
  return { exists: true, sessionData: null }
})

ipcMain.handle('session-clear', (event, data) => {
  console.log(`[IPC] Clearing session for provider: ${data.providerId}`)
  return { success: true }
})

// IPC handler for getting preload path for webviews
ipcMain.handle('get-preload-path', (event, scriptName: string = 'webview-preload.js') => {
  const preloadPath = path.join(__dirname, scriptName)
  console.log(`[IPC] Returning preload path: ${preloadPath}`)
  return preloadPath
})

// Open external links in default browser
ipcMain.handle('open-external', (event, url: string) => {
  console.log(`[IPC] Opening external URL: ${url}`)
  shell.openExternal(url)
  return { success: true }
})
