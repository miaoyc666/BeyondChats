import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron'

// Define the API object that will be exposed to the renderer process
const api = {
  // Window controls
  minimizeWindow: () => ipcRenderer.invoke('minimize-window'),
  maximizeWindow: () => ipcRenderer.invoke('maximize-window'),
  closeWindow: () => ipcRenderer.invoke('close-window'),

  // App info
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  getAppPath: () => ipcRenderer.invoke('get-app-path'),

  // Dev tools
  openDevTools: () => ipcRenderer.invoke('open-dev-tools'),
  closeDevTools: () => ipcRenderer.invoke('close-dev-tools'),

  // WebView preload path
  getPreloadPath: (scriptName?: string) =>
    ipcRenderer.invoke('get-preload-path', scriptName),

  // Session management
  saveSession: (data: { providerId: string }) =>
    ipcRenderer.invoke('save-session', data),

  loadSession: (data: { providerId: string }) =>
    ipcRenderer.invoke('load-session', data),

  // External links
  openExternal: (url: string) =>
    ipcRenderer.invoke('open-external', url),

  // IPC send/receive for custom messages
  send: (channel: string, data: any) => {
    ipcRenderer.send(channel, data)
  },

  on: (channel: string, listener: (...args: any[]) => void) => {
    ipcRenderer.on(channel, (event: IpcRendererEvent, ...args: any[]) =>
      listener(...args)
    )
  },

  once: (channel: string, listener: (...args: any[]) => void) => {
    ipcRenderer.once(channel, (event: IpcRendererEvent, ...args: any[]) =>
      listener(...args)
    )
  },

  invoke: (channel: string, data?: any) => {
    return ipcRenderer.invoke(channel, data)
  },
}

// Expose the API to the renderer process
contextBridge.exposeInMainWorld('electron', api)
