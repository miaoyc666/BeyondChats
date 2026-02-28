/**
 * Electron API 类型定义
 */

interface ElectronAPI {
  // 应用信息
  getAppVersion(): Promise<string>
  getSystemInfo(): Promise<any>

  // 窗口控制
  minimizeWindow(): Promise<void>
  closeWindow(): Promise<void>
  maximizeWindow(): Promise<void>
  unmaximizeWindow(): Promise<void>
  isMaximized(): Promise<boolean>
  toggleFullScreen(): Promise<void>

  // WebView管理
  sendMessageToWebView(webviewId: string, message: string): Promise<void>
  refreshWebView(webviewId: string): Promise<void>
  refreshAllWebViews(): Promise<void>
  loadWebView(webviewId: string, url: string): Promise<void>
  openDevTools(webviewId: string): Promise<void>

  // 会话管理
  saveSession(data: { providerId: string }): Promise<{ success: boolean }>
  loadSession(data: { providerId: string }): Promise<{ sessionData?: any; exists: boolean }>
  clearSession(data: { providerId: string }): Promise<{ success: boolean }>

  // 其他功能
  openExternal(url: string): Promise<void>

  // 获取预加载脚本路径
  getPreloadPath(preloadName: string): Promise<string>

  // 通用方法
  send(channel: string, data: any): void
  on(channel: string, listener: (...args: any[]) => void): void
  once(channel: string, listener: (...args: any[]) => void): void
  invoke(channel: string, data?: any): Promise<any>
  removeListener(channel: string, callback: (...args: any[]) => void): void
  removeAllListeners(channel: string): void
}

interface Window {
  electronAPI: ElectronAPI
}

export {}
