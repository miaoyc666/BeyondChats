import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';

let mainWindow: BrowserWindow | null = null;
const isDev = !app.isPackaged;

// Get the correct path for preload script
const getPreloadPath = (): string => {
  if (isDev) {
    return path.join(__dirname, 'preload.js');
  }
  // In production, preload is in the same directory as main.js (dist/electron/)
  return path.join(__dirname, 'preload.js');
};

// Get the correct path for index.html
const getIndexPath = (): string => {
  if (isDev) {
    return 'http://localhost:5173';
  }
  // In production, renderer files are in dist/renderer/
  const indexPath = path.join(__dirname, '../renderer/index.html');
  return `file://${indexPath}`;
};

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
    },
  });

  const startUrl = getIndexPath();
  console.log(`[Electron] Loading URL: ${startUrl}`);
  console.log(`[Electron] isDev: ${isDev}`);
  console.log(`[Electron] app.isPackaged: ${app.isPackaged}`);

  mainWindow.loadURL(startUrl).catch((err) => {
    console.error('[Electron] Failed to load URL:', err);
  });

  // Open devTools for debugging in dev mode only
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Log when page loads
  mainWindow.webContents.on('did-finish-load', () => {
    console.log('[Electron] Page loaded successfully');
  });

  // Log any errors
  mainWindow.webContents.on('crashed', () => {
    console.error('[Electron] Renderer process crashed');
  });
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// IPC handlers for window control
ipcMain.handle('get-app-version', () => {
  return app.getVersion();
});

ipcMain.handle('get-app-path', () => {
  return app.getAppPath();
});

ipcMain.handle('minimize-window', () => {
  mainWindow?.minimize();
});

ipcMain.handle('maximize-window', () => {
  if (mainWindow?.isMaximized()) {
    mainWindow.unmaximize();
  } else {
    mainWindow?.maximize();
  }
});

ipcMain.handle('close-window', () => {
  mainWindow?.close();
});

// IPC handlers for dev tools
ipcMain.handle('open-dev-tools', () => {
  mainWindow?.webContents.openDevTools();
});

ipcMain.handle('close-dev-tools', () => {
  mainWindow?.webContents.closeDevTools();
});

// IPC handlers for WebView communication
ipcMain.handle('send-to-webview', (event, { webviewId, message }) => {
  // This can be extended to send messages to specific WebViews
  console.log(`[IPC] Sending to ${webviewId}:`, message);
});
