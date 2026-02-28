# 🚀 BeyondChats 快速启动指南

## 全新的网格布局设计

BeyondChats 已完全重构，采用**网格布局 + WebView** 架构，支持多个 AI 并排显示！

### 🎯 核心特性一览

```
┌─────────────────────────────────────────────────────┐
│                    BeyondChats                      │
├─────────────────────────────────────────────────────┤
│  🤖 ChatGPT      🤖 Gemini        🤖 Qwen          │
│  ┌──────────┐   ┌──────────┐    ┌──────────┐      │
│  │ WebView  │   │ WebView  │    │ WebView  │      │
│  │  (IFRAME)│   │  (IFRAME)│    │  (IFRAME)│      │
│  └──────────┘   └──────────┘    └──────────┘      │
│                                                     │
│  ┌─────────────────────────────────────────────┐  │
│  │ 📝 输入问题，同时发送给所有已选 AI...      │  │
│  │ [发送] [清空]                               │  │
│  └─────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

## ⚡ 30秒快速开始

### 1️⃣ 克隆并安装

```bash
git clone git@github.com:miaoyc666/BeyondChats.git
cd BeyondChats
npm install
```

### 2️⃣ 启动开发模式

```bash
make dev
# 或者
npm run dev
```

应用会自动在 `http://localhost:5173` 启动，同时 Electron 窗口打开。

### 3️⃣ 使用应用

1. **选择 AI**：点击顶部导航栏的 AI 徽章选择要使用的 AI 服务
2. **输入问题**：在底部输入框输入你的问题
3. **发送消息**：按 `Ctrl+Enter` 或点击"发送"按钮
4. **并排对比**：同时看到所有已选 AI 的回答

## 🎮 操作指南

### 卡片操作

每个 AI 卡片都支持以下操作：

| 操作 | 功能 | 说明 |
|------|------|------|
| **点击 AI 徽章** | 切换启用/禁用 | 蓝色=已启用，灰色=禁用 |
| **⬆️ 最小化** | 收起卡片内容 | 只显示标题栏 |
| **🔲 最大化** | 全屏显示 | 隐藏其他卡片 |
| **⟲ 调整大小** | 拖拽右下角 | 自定义卡片大小 |

### 快捷键

- `Ctrl+Enter` (或 `Cmd+Enter` on Mac) - 发送消息
- 打开设置 - 点击右上角⚙️图标

## 🛠️ 常用命令

```bash
# 开发
make dev              # 启动开发环境
make build            # 构建应用
make build-mac        # 构建 macOS 版本
make build-win        # 构建 Windows 版本

# 代码质量
make type-check       # 类型检查
make lint             # 代码检查
```

## 📋 项目结构

```
src/
├── App.vue                          # 主应用（网格布局）
├── components/
│   ├── chat/
│   │   ├── AICard.vue              # AI 卡片
│   │   ├── UnifiedInput.vue        # 统一输入框
│   │   └── WebView.vue             # WebView 包装器
│   └── SettingsModal.vue           # 设置对话框
├── stores/
│   ├── app.ts                      # AI 状态管理
│   ├── layout.ts                   # 布局状态管理
│   └── chat.ts                     # 聊天状态管理
├── router/
│   └── index.ts                    # 路由配置
└── utils/
    └── debug.ts                    # 调试工具
```

## 🔧 设置和配置

### 布局设置

在设置面板中可以调整：
- **网格列数**：1-4 列（自动适应窗口宽度）
- **卡片间距**：4-32px

### Debug 模式

启用 Debug 模式查看详细的开发日志：

1. 打开设置（⚙️）
2. 启用"Debug 模式"
3. 点击"打开开发者工具"查看控制台

### 布局持久化

卡片布局和设置会自动保存到浏览器 localStorage，关闭应用后重新启动会恢复之前的布局。

## 🚨 常见问题

### Q: 应用启动后页面是空白的

A: 这通常是因为 Node.js 版本过低。使用以下命令升级：

```bash
nvm install 20
nvm use 20
npm run dev
```

### Q: WebView 无法加载

A: 检查网络连接，并确保你能访问相应的 AI 网站（例如 `chat.openai.com`）

### Q: 消息没有被发送

A: 
1. 确保已选择至少一个 AI（顶部徽章应该是蓝色）
2. 检查输入框不为空
3. 查看浏览器开发者工具的控制台是否有错误

## 📚 深度了解

- **完整文档**：查看 [README.md](./README.md)
- **改造详情**：查看 [REFACTOR_NOTES.md](./REFACTOR_NOTES.md)
- **架构设计**：查看 [src/README.md](./src/README.md)（如果存在）

## 🎉 现在就开始吧！

```bash
npm install
npm run dev
```

然后打开浏览器，开始你的多 AI 对话之旅吧！

---

**提示**：第一次启动可能需要 1-2 分钟来编译 Vue 和 Electron。耐心等待! ⏳

**遇到问题？** 查看 README.md 中的"故障排除"部分或提交 Issue。
