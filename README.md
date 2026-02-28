# 🤖 BeyondChats - Multi-AI Chat Desktop Application

[![GitHub](https://img.shields.io/badge/GitHub-miaoyc666/BeyondChats-blue?logo=github)](https://github.com/miaoyc666/BeyondChats)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/Version-0.1.0-brightgreen)](https://github.com/miaoyc666/BeyondChats/releases)

> 🎉 **声明**: 本项目完全由 AI 编程助手实现

---

## 📖 项目简介

**BeyondChats** 是一个创新的多 AI 模型聊天桌面应用程序，使用 **Electron + Vue3 + TypeScript** 构建。

它解决了用户需要同时与多个 AI 模型进行对话的痛点，通过单一统一的界面，用户可以：

- 💬 与单个 AI 模型深入对话
- 🎯 同时向多个 AI 发送相同问题
- 📊 实时对比不同 AI 的回答质量
- ⚙️ 灵活配置多个 AI 服务的 API 密钥

## 🌟 支持的 AI 服务

| AI 模型 | 服务商 | 状态 | 类型 |
|--------|------|------|------|
| **ChatGPT** | OpenAI | ✅ 支持 | API |
| **Gemini** | Google | ✅ 支持 | API |
| **千问 (Qwen)** | 阿里云 | ✅ 支持 | API |
| **豆包 (Douban)** | 字节跳动 | ✅ 支持 | API |
| **元宝 (Yuanbao)** | 腾讯 | ✅ 支持 | API/Web |

> 💡 **易于扩展**: 只需实现 `AIProvider` 接口即可添加新的 AI 服务

## 🏗️ 架构特色

### 🎨 现代化技术栈（已重构为 WebView 架构）
```
┌─────────────────────────────────────────────────────────┐
│         Electron 主进程                                 │
│  (窗口管理、IPC 通信、应用生命周期)                     │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│      Vue3 + Vite 渲染进程 (网格布局)                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  AICard 1    │  │  AICard 2    │  │  AICard 3    │  │
│  │ ┌──────────┐ │  │ ┌──────────┐ │  │ ┌──────────┐ │  │
│  │ │ WebView  │ │  │ │ WebView  │ │  │ │ WebView  │ │  │
│  │ │ChatGPT   │ │  │ │ Gemini   │ │  │ │  Qwen    │ │  │
│  │ └──────────┘ │  │ └──────────┘ │  │ └──────────┘ │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│                                                         │
│  上层: UnifiedInput（统一输入）| SettingsModal（设置） │
│  中层: Pinia 状态管理 (App, Layout, Chat)              │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│     嵌入式 WebView (iframe)                             │
│  直接加载 AI 官方网站 (chat.openai.com 等)             │
└─────────────────────────────────────────────────────────┘
```

### 🔧 核心特性

- ✅ **网格布局系统** - 支持 1-4 列自适应显示
- ✅ **WebView 集成** - 直接嵌入 AI 官方网站
- ✅ **卡片操作** - 最小化、最大化、调整大小、隐藏
- ✅ **统一输入** - 同步发送消息给所有已选 AI
- ✅ **响应式设计** - 自动适配不同屏幕尺寸
- ✅ **状态管理** - Pinia 集中式状态管理
- ✅ **类型安全** - 完整的 TypeScript 支持
- ✅ **多平台** - macOS、Windows、Linux
- ✅ **Debug 工具** - 内置调试模式

## 🚀 快速开始

### 前置要求
- Node.js >= 14.x
- npm >= 6.x

### 安装步骤

1️⃣ **克隆项目**
```bash
git clone git@github.com:miaoyc666/BeyondChats.git
cd BeyondChats
```

2️⃣ **安装依赖**
```bash
npm install
```

3️⃣ **启动开发环境**
```bash
npm run dev
```

4️⃣ **配置 AI 服务**
- 打开应用窗口
- 点击 **Settings** 进入配置页面
- 为每个 AI 输入对应的 API 密钥
- 点击 **Test Connection** 验证配置

5️⃣ **开始聊天**
- 在左侧选择一个 AI 模型
- 输入你的问题
- 按 `Ctrl+Enter` 发送或点击 **Send** 按钮


## 🎮 使用指南

### 单个 AI 聊天

1. 在左侧边栏选择一个已配置的 AI 模型
2. 在消息输入框中输入你的问题
3. 按 `Ctrl+Enter` 或点击 **Send** 按钮
4. 等待 AI 回复并查看对话历史

**示例问题**:
- "What is machine learning?"
- "How do I learn TypeScript?"
- "Explain quantum computing in simple terms"

### 多 AI 对话

1. 在左侧选择 **Multi-Chat** 或导航到多聊天视图
2. 确保至少配置并启用了一个 AI
3. 在消息框中输入相同的问题
4. 点击 **Send to All** 按钮
5. 同时查看所有 AI 的不同回答
6. 对比分析各 AI 的响应质量

## 🔑 API 密钥配置

### ChatGPT (OpenAI)
- 访问: https://platform.openai.com/api-keys
- 创建新的 Secret Key
- 复制密钥到应用设置中

### Gemini (Google)
- 访问: https://aistudio.google.com
- 点击 "Get API Key"
- 创建并复制 API 密钥

### 千问 (Qwen) - 阿里云
- 访问: https://dashscope.aliyun.com
- 登录阿里云账户
- 创建 API 密钥

### 豆包 (Douban) - 字节跳动
- 访问: https://www.doubao.com
- 登录账户后获取会话令牌
- 从浏览器开发者工具提取

### 元宝 (Yuanbao) - 腾讯
- 访问: https://yuanbao.tencent.com
- 登录腾讯账户
- 从浏览器开发者工具提取会话令牌

## 📦 项目结构

```
BeyondChats/
├── electron/                 # Electron 主进程
│   ├── main.ts              # 应用入口
│   ├── preload.ts           # 预加载脚本
│   └── tsconfig.json        # TypeScript 配置
├── src/                     # Vue3 前端源代码
│   ├── main.ts              # 应用入口
│   ├── App.vue              # 根组件
│   ├── providers/           # AI 提供商实现
│   │   ├── base.ts          # 基类
│   │   ├── chatgpt.ts       # ChatGPT
│   │   ├── gemini.ts        # Gemini
│   │   ├── qwen.ts          # 千问
│   │   ├── douban.ts        # 豆包
│   │   └── yuanbao.ts       # 元宝
│   ├── services/            # 服务层
│   ├── stores/              # Pinia 状态管理
│   ├── router/              # Vue Router 配置
│   ├── views/               # 页面组件
│   └── types/               # TypeScript 类型
├── public/                  # 静态资源
└── index.html              # HTML 模板
```

## 🛠️ 开发命令

```bash
# 开发模式 (同时启动 Vite 和 Electron)
npm run dev

# 构建应用
npm run build              # 全平台
npm run build:mac         # macOS 只
npm run build:win         # Windows 只
npm run build:linux       # Linux 只

# 代码质量
npm run lint              # ESLint 检查
npm run format            # 代码格式化
npm run type-check        # TypeScript 检查

# 其他
npm run preview           # 预览打包应用
```

## 🏆 技术栈

| 技术 | 版本 | 用途 |
|-----|------|------|
| **Electron** | ^28.0.0 | 桌面应用框架 |
| **Vue** | ^3.3.13 | UI 框架 |
| **Vite** | ^5.0.7 | 构建工具 |
| **TypeScript** | ^5.3.3 | 编程语言 |
| **Pinia** | ^2.1.7 | 状态管理 |
| **Vue Router** | ^4.2.5 | 路由管理 |
| **Element Plus** | ^2.4.4 | UI 组件库 |
| **Axios** | ^1.6.2 | HTTP 客户端 |

## 🔐 安全性

本应用采取以下安全措施：

- 🔒 **Context Isolation** - Electron 上下文隔离
- 🛡️ **HTTPS 通信** - 所有 API 请求加密传输
- 🔑 **本地存储** - API 密钥仅存储在本地
- 🚫 **禁用 Node Integration** - 防止代码注入

> ⚠️ **建议**: 对于生产环境，建议使用密钥管理服务而不是直接存储

## 💡 扩展应用

### 添加新的 AI 提供商

1. 创建新的 Provider 类:
```typescript
// src/providers/myai.ts
export class MyAIProvider extends AIProvider {
  constructor(config: ProviderConfig = {}) {
    super('MyAI', config);
  }

  isConfigured(): boolean {
    // 实现配置检查
  }

  async sendMessage(message: string): Promise<string> {
    // 实现消息发送
  }

  async streamMessage(message: string, options: StreamOptions): Promise<void> {
    // 实现流式响应
  }

  async validateConfig(): Promise<boolean> {
    // 实现配置验证
  }
}
```

2. 在 `ProviderManager` 中注册:
```typescript
this.providers.set('myai', new MyAIProvider());
```

3. 更新 UI 组件支持新的 AI 模型

## 🐛 故障排除

### 应用无法启动
```bash
# 清除依赖并重新安装
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### 连接超时错误
- 检查网络连接
- 验证 API 密钥正确性
- 查看浏览器开发者工具网络标签

### 消息无响应
- 确保 API 密钥有效
- 检查 API 配额/额度
- 查看浏览器控制台错误信息

## 📦 构建和打包

### macOS 应用打包

#### 环境要求

| 要求 | 版本 | 说明 |
|------|------|------|
| **macOS** | 10.13+ | 最低系统版本 |
| **Node.js** | 18+ | **必须** 18.0.0 或更高 |
| **npm** | 9+ | 通常与 Node.js 18+ 一起安装 |
| **磁盘空间** | 2GB+ | 用于构建和输出 |

#### 检查环境
```bash
node -v    # 应该输出 v18.x.x 或更高
npm -v     # 应该输出 9.x.x 或更高
```

**如果 Node.js 版本过低**，使用 nvm 升级：
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.zshrc
nvm install 18
nvm use 18
```

#### 构建步骤

1️⃣ **构建 macOS 应用**
```bash
npm run build:mac
```

或构建所有平台：
```bash
npm run build
```

构建会分三个阶段进行：
1. 构建渲染进程（Vite，1-2 分钟）
2. 编译主进程（TypeScript，10-30 秒）
3. 打包应用（Electron Builder，2-3 分钟）

**总耗时**：首次 5-10 分钟，后续更快（使用缓存）

2️⃣ **输出文件**

在 `dist/` 目录下会生成：
- `BeyondChats-x.x.x.dmg` - macOS 安装程序（推荐）
- `BeyondChats-x.x.x.zip` - 压缩应用包

3️⃣ **安装应用**

**方式一：使用 DMG（推荐）**
- 双击 `BeyondChats-x.x.x.dmg`
- 将 BeyondChats 拖到 Applications 文件夹
- 打开 Applications 运行应用

**方式二：从 ZIP 直接运行**
```bash
unzip dist/BeyondChats-x.x.x.zip
open BeyondChats.app
```

首次运行若提示"无法验证开发者"：
- 右击 BeyondChats.app
- 选择"打开"
- 在对话框点击"打开"

#### 代码签名（可选）

对于分发应用，可进行代码签名：
```bash
# 自签名（开发用）
codesign -s - dist/BeyondChats.app

# 验证签名
codesign -v dist/BeyondChats.app
```

#### 故障排除

**构建失败：Node 版本过低**
```bash
# 错误: TypeError: crypto$2.getRandomValues is not a function
# 解决: 升级到 Node.js 18+
nvm install 18 && nvm use 18
npm run build:mac
```

**应用无法启动**
- 检查 API 密钥是否正确配置
- 查看应用日志：`~/Library/Logs/BeyondChats/`
- 尝试重新安装应用

**磁盘空间不足**
```bash
rm -rf dist node_modules/.cache
# 确保有至少 2GB 空闲空间
df -h
```

## 📄 许可证

本项目采用 [MIT License](./LICENSE) - 可自由使用、修改和发布

## 🤝 贡献

欢迎提交 Issues 和 Pull Requests！

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开一个 Pull Request

## 📞 联系方式

- 🐙 **GitHub**: https://github.com/miaoyc666/BeyondChats
- 📧 **邮件**: dev@beyondchats.com
- 💬 **讨论**: [GitHub Discussions](https://github.com/miaoyc666/BeyondChats/discussions)

---

<div align="center">

### 💫 用 AI 构建 AI 应用

> 本项目完全由 AI 实现，展示了现代 AI 编程助手的强大能力

**[立即开始](#-快速开始)** | **[查看文档](./GETTING_STARTED.md)** | **[提交 Issue](https://github.com/miaoyc666/BeyondChats/issues)**

</div>

---

**版本**: 0.1.0 | **更新**: 2026-02-28 | **状态**: MVP ✅ 已完成
