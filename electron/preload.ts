import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

// Define the API object that will be exposed to the renderer process
const api = {
  // Window controls
  minimizeWindow: () => ipcRenderer.invoke('minimize-window'),
  maximizeWindow: () => ipcRenderer.invoke('maximize-window'),
  closeWindow: () => ipcRenderer.invoke('close-window'),

  // App info
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  getAppPath: () => ipcRenderer.invoke('get-app-path'),

  // IPC send/receive for custom messages
  send: (channel: string, data: any) => {
    ipcRenderer.send(channel, data);
  },

  on: (channel: string, listener: (...args: any[]) => void) => {
    ipcRenderer.on(channel, (event: IpcRendererEvent, ...args: any[]) =>
      listener(...args)
    );
  },

  once: (channel: string, listener: (...args: any[]) => void) => {
    ipcRenderer.once(channel, (event: IpcRendererEvent, ...args: any[]) =>
      listener(...args)
    );
  },

  invoke: (channel: string, data?: any) => {
    return ipcRenderer.invoke(channel, data);
  },
};

// Expose the API to the renderer process
contextBridge.exposeInMainWorld('electron', api);
