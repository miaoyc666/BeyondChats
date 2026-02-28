"use strict";
/**
 * IPC通信类型定义
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.IPCChannel = void 0;
/**
 * IPC通道枚举
 */
var IPCChannel;
(function (IPCChannel) {
    // 应用控制
    IPCChannel["APP_READY"] = "app:ready";
    IPCChannel["APP_QUIT"] = "app:quit";
    IPCChannel["APP_MINIMIZE"] = "app:minimize";
    IPCChannel["APP_MAXIMIZE"] = "app:maximize";
    IPCChannel["APP_RESTORE"] = "app:restore";
    // 会话管理
    IPCChannel["SESSION_SAVE"] = "session:save";
    IPCChannel["SESSION_LOAD"] = "session:load";
    IPCChannel["SESSION_CLEAR"] = "session:clear";
    IPCChannel["SESSION_CHECK"] = "session:check";
    // 错误处理
    IPCChannel["ERROR_REPORT"] = "error:report";
    // AI状态监控
    IPCChannel["AI_STATUS_CHANGE"] = "ai-status:change";
})(IPCChannel || (exports.IPCChannel = IPCChannel = {}));
