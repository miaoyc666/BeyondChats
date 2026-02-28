# 🚀 快速启动指南

## 第一步：克隆项目

```bash
git clone git@github.com:miaoyc666/BeyondChats.git
cd BeyondChats
```

## 第二步：安装依赖

```bash
npm install
```

## 第三步：启动开发环境

```bash
npm run dev
```

这会启动两个进程：
- **Vite 开发服务器**: 运行在 http://localhost:5173
- **Electron 应用**: 自动打开应用窗口

## 第四步：配置 AI 服务

### 快速配置方式

1. 应用启动后，在左侧边栏找到一个 AI 模型（如 ChatGPT）
2. 点击 **Settings** 按钮
3. 选择对应的 AI 标签页
4. 输入你的 API 密钥
5. 点击 **Test Connection** 验证
6. 点击 **Save Configuration** 保存

### 获取 API 密钥

#### ChatGPT
```
1. 访问 https://platform.openai.com/api-keys
2. 登录或注册 OpenAI 账户
3. 点击 "Create new secret key"
4. 复制密钥
5. 粘贴到应用的 ChatGPT 设置中
```

#### Gemini
```
1. 访问 https://aistudio.google.com
2. 用 Google 账户登录
3. 点击 "Get API Key"
4. 创建 API 密钥
5. 复制粘贴到应用中
```

#### Qwen (千问)
```
1. 访问 https://dashscope.aliyun.com
2. 登录阿里云账户
3. 在左侧菜单找到 API 密钥管理
4. 创建新的 API 密钥
5. 复制粘贴到应用中
```

#### Douban (豆包)
```
1. 访问 https://www.doubao.com
2. 登录你的账户
3. 打开浏览器开发者工具 (F12)
4. 在 Network 或 Application 标签页找到会话令牌
5. 复制到应用的 Douban 设置中
```

#### Yuanbao (元宝)
```
1. 访问 https://yuanbao.tencent.com
2. 登录腾讯账户
3. 打开浏览器开发者工具 (F12)
4. 在 Network 或 Application 标签页找到会话令牌
5. 复制到应用的 Yuanbao 设置中
```

## 第五步：开始聊天

### 单个 AI 聊天

1. 从左侧选择一个已配置的 AI
2. 在消息框中输入你的问题
3. 按 `Ctrl+Enter` 或点击 **Send**
4. 等待 AI 回复

示例问题：
- "What is the capital of France?"
- "How do I learn TypeScript?"
- "Explain quantum computing in simple terms"

### 多 AI 对比

1. 在左侧选择 **Multi-Chat** 模式
2. 或从 App.vue 导航到多聊天视图
3. 输入同一个问题
4. 点击 **Send to All**
5. 同时查看所有 AI 的不同回答

## 常见问题

### Q: 应用启动时出现错误
**A:** 
1. 确保 Node.js 版本 >= 14
2. 删除 `node_modules` 文件夹
3. 重新运行 `npm install`
4. 重试 `npm run dev`

### Q: API 请求超时
**A:**
- 检查网络连接
- 检查 API 密钥是否正确
- 验证 API 服务是否可用
- 检查是否需要代理设置

### Q: 我的 API 密钥显示错误
**A:**
- 确保密钥完整复制（没有多余空格）
- 验证密钥未过期
- 检查密钥对应的服务是否启用
- 尝试重新创建新的 API 密钥

### Q: 多 AI 聊天无法工作
**A:**
- 确保至少配置了一个 AI
- 点击 Settings 中的"Enable"开关启用 AI
- 验证所有启用的 AI 的 API 密钥有效
- 查看浏览器控制台错误信息

## 生产构建

当准备发布应用时：

```bash
# 仅 macOS
npm run build:mac

# 仅 Windows
npm run build:win

# 仅 Linux
npm run build:linux

# 所有平台
npm run build
```

构建输出会在 `dist` 目录中。

## 开发技巧

### 调试应用

1. 应用启动时会自动打开开发者工具
2. 查看控制台错误日志
3. 使用 VS Code 调试器

### 热重载

- Vue 文件修改会自动热重载
- Electron 主进程修改需要手动重启应用

### 代码检查

```bash
# 检查代码质量
npm run lint

# 格式化代码
npm run format

# 类型检查
npm run type-check
```

## 下一步

- 📚 阅读 [PROJECT_SETUP.md](./PROJECT_SETUP.md) 了解完整架构
- 🔧 查看 [提供者实现](./src/providers/) 学习如何添加新的 AI
- 🎨 自定义 UI 样式和主题
- 🚀 部署你的应用

## 需要帮助？

- 检查 [项目设置文档](./PROJECT_SETUP.md)
- 查看 [GitHub Issues](https://github.com/miaoyc666/BeyondChats/issues)
- 提交新的 Issue 或 Pull Request

祝你使用愉快！ 🎉
