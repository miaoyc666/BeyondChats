import { contextBridge, ipcRenderer } from 'electron'

/**
 * 预加载脚本 - 在渲染进程中暴露安全的 API
 */
contextBridge.exposeInMainWorld('electronAPI', {
  // 应用信息
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  getSystemInfo: () => ipcRenderer.invoke('get-system-info'),

  // 窗口控制
  minimizeWindow: () => ipcRenderer.invoke('minimize-window'),
  closeWindow: () => ipcRenderer.invoke('close-window'),
  maximizeWindow: () => ipcRenderer.invoke('maximize-window'),
  unmaximizeWindow: () => ipcRenderer.invoke('unmaximize-window'),
  isMaximized: () => ipcRenderer.invoke('is-maximized'),
  toggleFullScreen: () => ipcRenderer.invoke('toggle-fullscreen'),

  // WebView管理
  sendMessageToWebView: (webviewId: string, message: string) => ipcRenderer.invoke('send-message-to-webview', { webviewId, message }),
  refreshWebView: (webviewId: string) => ipcRenderer.invoke('refresh-webview', webviewId),
  refreshAllWebViews: () => ipcRenderer.invoke('refresh-all-webviews'),
  loadWebView: (webviewId: string, url: string) => ipcRenderer.invoke('load-webview', { webviewId, url }),
  openDevTools: (webviewId: string) => ipcRenderer.invoke('open-devtools', webviewId),

  // 会话管理
  saveSession: (data: any) => ipcRenderer.invoke('session-save', data),
  loadSession: (data: any) => ipcRenderer.invoke('session-load', data),
  clearSession: (data: any) => ipcRenderer.invoke('session-clear', data),

  // 获取预加载脚本路径
  getPreloadPath: (preloadName: string) => ipcRenderer.invoke('get-preload-path', preloadName),

  // 外部链接
  openExternal: (url: string) => ipcRenderer.invoke('open-external', url),

  // 通用方法
  send: (channel: string, data: any) => {
    ipcRenderer.send(channel, data)
  },

  on: (channel: string, listener: (...args: any[]) => void) => {
    ipcRenderer.on(channel, (event, ...args) => listener(...args))
  },

  once: (channel: string, listener: (...args: any[]) => void) => {
    ipcRenderer.once(channel, (event, ...args) => listener(...args))
  },

  invoke: (channel: string, data?: any) => {
    return ipcRenderer.invoke(channel, data)
  },

  removeListener: (channel: string, callback: (...args: any[]) => void) => {
    ipcRenderer.removeListener(channel, callback)
  },

  removeAllListeners: (channel: string) => {
    ipcRenderer.removeAllListeners(channel)
  },
})
