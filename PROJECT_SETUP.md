# BeyondChats - Project Setup Summary

## 🎯 项目概述

BeyondChats 是一个多 AI 模型聊天桌面应用程序，基于 Electron + Vue3 + TypeScript 构建。支持同时与多个 AI 模型（ChatGPT、Gemini、豆包、千问、元宝）进行对话。

## 📁 项目结构

```
BeyondChats/
├── electron/                 # Electron 主进程
│   ├── main.ts              # 应用入口和窗口管理
│   ├── preload.ts           # 预加载脚本，暴露 API 给前端
│   └── tsconfig.json        # TypeScript 配置
├── src/                     # Vue3 前端源代码
│   ├── main.ts              # 应用入口
│   ├── App.vue              # 根组件
│   ├── providers/           # AI 服务提供商实现
│   │   ├── base.ts          # 基础 Provider 类
│   │   ├── chatgpt.ts       # ChatGPT Provider
│   │   ├── gemini.ts        # Gemini Provider
│   │   ├── qwen.ts          # 千问 Provider
│   │   ├── douban.ts        # 豆包 Provider
│   │   └── yuanbao.ts       # 元宝 Provider
│   ├── services/
│   │   └── providerManager.ts  # Provider 管理器
│   ├── stores/              # Pinia 状态管理
│   │   └── app.ts           # 应用全局状态
│   ├── router/              # Vue Router 路由
│   │   └── index.ts
│   ├── views/               # 页面组件
│   │   ├── ChatView.vue     # 单个 AI 聊天页面
│   │   ├── SettingsView.vue # 设置页面
│   │   └── MultiChatView.vue # 多 AI 对话页面
│   ├── types/               # TypeScript 类型定义
│   │   ├── global.d.ts
│   │   └── electron.ts
├── public/                  # 静态资源
│   └── icons/              # AI 模型图标
├── index.html              # HTML 模板
├── vite.config.ts          # Vite 构建配置
├── tsconfig.json           # TypeScript 配置
├── package.json            # 项目依赖和脚本
└── .env                    # 环境变量
```

## 🔧 技术栈

- **桌面框架**: Electron 28.x
- **前端框架**: Vue 3.3.x + Vite 5.x
- **UI 组件库**: Element Plus 2.4.x
- **状态管理**: Pinia 2.1.x
- **路由**: Vue Router 4.2.x
- **HTTP 客户端**: Axios 1.6.x
- **开发语言**: TypeScript 5.3.x
- **构建工具**: Electron Builder 24.x

## 🚀 快速开始

### 安装依赖
```bash
npm install
```

### 开发模式
```bash
npm run dev
```
这会同时启动 Vite 开发服务器和 Electron 应用。

### 构建应用
```bash
# 通用构建
npm run build

# 平台特定构建
npm run build:mac    # macOS DMG 和 ZIP
npm run build:win    # Windows NSIS 和便携版
npm run build:linux  # Linux AppImage 和 DEB
```

### 其他命令
```bash
npm run type-check   # TypeScript 类型检查
npm run lint        # ESLint 代码检查
npm run format      # Prettier 代码格式化
npm run preview     # 预览打包后的应用
```

## 🧠 核心功能架构

### 1. AI Provider 系统

每个 AI 服务都实现了 `AIProvider` 基类：

```typescript
abstract class AIProvider {
  abstract isConfigured(): boolean;
  abstract sendMessage(message: string): Promise<string>;
  abstract streamMessage(message: string, options: StreamOptions): Promise<void>;
  abstract validateConfig(): Promise<boolean>;
}
```

**支持的 AI 服务**:
- ✅ **ChatGPT**: 使用 OpenAI 官方 API
- ✅ **Gemini**: 使用 Google AI Studio API
- ✅ **千问 (Qwen)**: 使用阿里云 DashScope API
- ✅ **豆包 (Douban)**: 支持字节跳动豆包 API
- ✅ **元宝 (Yuanbao)**: 支持腾讯元宝服务

### 2. Provider Manager

集中管理所有 AI 提供商：
- 提供商注册和检索
- 配置管理和验证
- 单个或批量消息发送
- 并发请求处理

### 3. 状态管理 (Pinia Store)

- **AI 配置**: 存储每个 AI 的 API 密钥和设置
- **聊天会话**: 管理对话历史和消息
- **用户偏好**: 应用全局设置

### 4. 用户界面

**页面**:
- 🔀 **ChatView**: 与单个 AI 模型对话
- ⚙️ **SettingsView**: 配置 AI 服务和验证连接
- 🎯 **MultiChatView**: 同时向多个 AI 发送消息并比较响应

## 📖 使用指南

### 配置 AI 服务

1. 打开应用后进入 **Settings** 页面
2. 在各个 AI 服务的标签页中输入 API 密钥
3. 点击 **Test Connection** 验证配置
4. 点击 **Save Configuration** 保存设置

### 单 AI 对话

1. 在左侧边栏选择一个 AI 模型
2. 在消息输入框中输入问题
3. 按 `Ctrl+Enter` 或点击 **Send** 发送
4. 等待 AI 回复并查看对话历史

### 多 AI 对话

1. 进入 **Multi-Chat** 页面
2. 确保至少配置并启用了一个 AI
3. 输入问题并点击 **Send to All**
4. 同时查看所有 AI 的响应

## 🔐 安全性说明

- 🔒 API 密钥存储在本地 Electron 存储中
- 🛡️ 建议使用环境变量或安全密钥管理服务
- ✅ 所有 API 请求通过 HTTPS 传输
- 🚫 永远不要在代码中硬编码密钥

## ⚙️ API 密钥获取指南

### ChatGPT
- 访问: https://platform.openai.com/api-keys
- 创建新的 API 密钥
- 复制并粘贴到设置中

### Gemini
- 访问: https://aistudio.google.com
- 点击 "Get API Key"
- 创建新项目并获取 API 密钥

### 千问 (Qwen)
- 访问: https://dashscope.aliyun.com
- 登录阿里云账户
- 创建 API 密钥

### 豆包 (Douban)
- 访问: https://www.doubao.com
- 登录账户
- 从浏览器开发者工具获取会话令牌

### 元宝 (Yuanbao)
- 访问: https://yuanbao.tencent.com
- 登录腾讯账户
- 从浏览器开发者工具获取会话令牌

## 📝 开发指南

### 添加新的 AI 提供商

1. 创建新的 Provider 类（例如 `src/providers/newai.ts`）
2. 继承 `AIProvider` 基类
3. 实现所需的抽象方法
4. 在 `ProviderManager` 中注册新提供商
5. 更新 UI 组件以支持新的 AI

### 实现示例

```typescript
export class NewAIProvider extends AIProvider {
  constructor(config: ProviderConfig = {}) {
    super('NewAI', {
      baseUrl: 'https://api.newai.com/v1',
      model: 'new-model',
      timeout: 30000,
      ...config,
    });
  }

  isConfigured(): boolean {
    return !!(this.config.apiKey && this.config.apiKey.trim().length > 0);
  }

  async sendMessage(message: string): Promise<string> {
    // 实现消息发送逻辑
  }

  async streamMessage(message: string, options: StreamOptions): Promise<void> {
    // 实现流式消息发送逻辑
  }

  async validateConfig(): Promise<boolean> {
    // 实现配置验证逻辑
  }
}
```

## 🐛 故障排除

### 应用无法启动
- 检查 Node.js 版本（需要 14+）
- 清除 `node_modules` 并重新安装
- 检查端口 5173 是否被占用

### API 请求失败
- 验证 API 密钥是否正确
- 检查网络连接
- 查看浏览器开发者工具的网络标签

### 配置无法保存
- 检查磁盘空间
- 确保有正确的文件权限
- 查看应用日志获取详细信息

## 📦 下一步改进方向

- [ ] 增加更多 AI 提供商支持
- [ ] 实现消息加密存储
- [ ] 添加消息导出功能
- [ ] 实现插件系统
- [ ] 优化 UI/UX
- [ ] 添加语音输入/输出
- [ ] 支持代理和 VPN
- [ ] 性能优化和缓存

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📧 联系方式

- GitHub: https://github.com/miaoyc666/BeyondChats
