# 🐛 Debug Mode 指南

BeyondChats 提供了完整的 Debug 模式，帮助你调试应用问题。

## 启用 Debug 模式

### 方式 1：UI 开关（推荐）

1. 打开应用
2. 点击左侧边栏的 **Settings**
3. 在页面顶部找到 **🐛 Debug Mode** 卡片
4. 开启/关闭开关
5. 在浏览器控制台（F12 或 Cmd+Option+I）查看详细日志

### 方式 2：环境变量

编辑 `.env.local` 文件：

```bash
VITE_DEBUG=true   # 启用 debug
VITE_DEBUG=false  # 禁用 debug
```

然后重启开发服务器：

```bash
make dev
```

### 方式 3：浏览器控制台

在浏览器开发者工具的 Console 标签中运行：

```javascript
// 启用 Debug 模式
window.__debug.enable()

// 禁用 Debug 模式
window.__debug.disable()

// 查看当前状态
window.__debug.status()
```

## Debug 模式输出

启用 Debug 模式后，你会在浏览器控制台看到以下信息：

### 应用初始化日志

```
[HH:MM:SS] BeyondChats App Initialized
{
  debugMode: true,
  version: "0.1.0",
  env: "development"
}
```

### AI Provider 日志

```
[HH:MM:SS] AI Providers Registered
{
  providers: ["chatgpt", "gemini", "qwen", "douban", "yuanbao"]
}
```

### API 调用日志

```
🌐 API: POST api/chatgpt/message
Data: { message: "Hello", historyLength: 0 }
```

### 性能指标

```
⏱️  Message from chatgpt: 1234.56ms
```

### 响应日志

```
✅ SUCCESS: Got response from chatgpt
{ length: 512 }
```

## 日志级别

Debug 工具提供多个日志级别：

- **ℹ️ INFO** - 一般信息
- **⚠️ WARN** - 警告信息
- **❌ ERROR** - 错误信息
- **✅ SUCCESS** - 成功操作

## 使用示例

### 在代码中添加 Debug 日志

```typescript
import { debugLog, debugSuccess, debugError, debugPerformance } from '@/utils/debug';

// 记录一般日志
debugLog('User logged in', { userId: 123, username: 'john' });

// 记录成功
debugSuccess('Message sent', { messageId: 'abc123' });

// 记录错误
debugError('Failed to fetch', new Error('Network error'));

// 性能测试
const endTimer = debugPerformance('Processing data');
// ... do something
endTimer(); // 输出耗时
```

## 常见用途

### 1. 调试 AI API 调用

```
启用 Debug → 发送消息 → 查看 API 日志和响应时间
```

### 2. 追踪应用状态

```
启用 Debug → 执行操作 → 在控制台看到详细状态变化
```

### 3. 性能分析

```
启用 Debug → 执行操作 → 查看 ⏱️ 性能指标
```

### 4. 错误诊断

```
启用 Debug → 触发错误 → 查看 ❌ 错误堆栈和信息
```

## 生产环境

在生产环境中，Debug 模式默认为 **禁用**，以提高性能。但用户仍然可以在浏览器控制台中手动启用。

如需在生产环境中启用，可以在构建时设置环境变量：

```bash
VITE_DEBUG=true npm run build
```

## 性能影响

- **Debug 模式禁用**: ✅ 无性能影响（零开销）
- **Debug 模式启用**: 轻微的控制台输出开销（通常 < 1ms）

建议仅在开发和调试时启用 Debug 模式。

---

**需要帮助？** 查看浏览器控制台的详细日志信息。
