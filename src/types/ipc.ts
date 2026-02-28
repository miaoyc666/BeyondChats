/**
 * IPC通信类型定义
 */

/**
 * IPC通道枚举
 */
export enum IPCChannel {
  // 应用控制
  APP_READY = 'app:ready',
  APP_QUIT = 'app:quit',
  APP_MINIMIZE = 'app:minimize',
  APP_MAXIMIZE = 'app:maximize',
  APP_RESTORE = 'app:restore',

  // 会话管理
  SESSION_SAVE = 'session:save',
  SESSION_LOAD = 'session:load',
  SESSION_CLEAR = 'session:clear',
  SESSION_CHECK = 'session:check',

  // 错误处理
  ERROR_REPORT = 'error:report',

  // AI状态监控
  AI_STATUS_CHANGE = 'ai-status:change',
}
