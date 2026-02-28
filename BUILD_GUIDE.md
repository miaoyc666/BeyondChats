# 📦 BeyondChats 打包指南

## macOS 应用打包完整指南

本指南详细说明如何将 BeyondChats 打包成可在 macOS 上运行的 `.app` 应用。

### 系统要求

| 要求 | 版本 | 说明 |
|-----|------|------|
| **macOS** | 10.13+ | 最低系统版本要求 |
| **Node.js** | 18+ | **重要**: 必须是 18.0.0 或更高版本 |
| **npm** | 9+ | 通常与 Node.js 18+ 一起安装 |
| **磁盘空间** | 2GB+ | 用于构建和输出文件 |

### 步骤一：准备环境

#### 1. 检查 Node.js 版本

```bash
node -v    # 应该输出 v18.x.x 或更高
npm -v     # 应该输出 9.x.x 或更高
```

**如果版本过低，需要升级**：

使用 Homebrew 升级：
```bash
# 安装 nvm（Node Version Manager）
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# 重启终端或运行
source ~/.zshrc

# 安装 Node.js 18
nvm install 18
nvm use 18

# 验证版本
node -v
```

或者访问 [nodejs.org](https://nodejs.org/) 直接下载安装。

#### 2. 克隆和准备项目

```bash
# 克隆项目
git clone git@github.com:miaoyc666/BeyondChats.git
cd BeyondChats

# 安装依赖
npm install
```

### 步骤二：构建应用

#### 方式一：只构建 macOS 应用（推荐）

```bash
npm run build:mac
```

#### 方式二：构建所有平台

```bash
npm run build
```

#### 构建过程说明

构建会分三个阶段进行：

1. **构建渲染进程** (`build:renderer`)
   - 使用 Vite 编译 Vue 前端代码
   - 输出到 `dist/renderer` 目录
   - 耗时：1-2 分钟

2. **编译主进程** (`build:electron`)
   - 使用 TypeScript 编译 Electron 主进程
   - 输出到 `dist/electron` 目录
   - 耗时：10-30 秒

3. **打包应用** (`build:app`)
   - 使用 Electron Builder 创建可安装包
   - 生成 DMG 和 ZIP 文件
   - 耗时：2-3 分钟

**总耗时**：首次构建需要 5-10 分钟，后续构建会更快（使用缓存）。

### 步骤三：输出文件

构建完成后，在 `dist/` 目录下会生成以下文件：

```
dist/
├── BeyondChats-0.1.0.dmg        # macOS 安装程序（推荐使用）
├── BeyondChats-0.1.0.zip        # 压缩应用包
├── BeyondChats-0.1.0-mac.yml    # 更新元数据
├── renderer/                     # 前端构建输出
└── electron/                     # Electron 主进程构建输出
```

### 步骤四：安装应用

#### 方式一：使用 DMG 安装（推荐用户使用）

1. 双击 `BeyondChats-0.1.0.dmg`
2. 在弹出的窗口中，将 BeyondChats 图标拖到 Applications 文件夹
3. 打开 Finder，进入 Applications 文件夹
4. 双击 BeyondChats 运行应用

**首次运行时**，macOS 可能提示"无法验证开发者"：
- 右击 BeyondChats.app
- 选择"打开"
- 在对话框中点击"打开"

#### 方式二：从 ZIP 直接运行

```bash
# 解压 ZIP 文件
unzip dist/BeyondChats-0.1.0.zip

# 运行应用
open BeyondChats.app
```

或直接双击 ZIP 文件解压后运行应用。

### 步骤五：验证应用

#### 验证应用完整性

```bash
# 查看应用结构
ls -la dist/BeyondChats.app/

# 检查应用信息
file dist/BeyondChats.app/Contents/MacOS/BeyondChats

# 查看应用 plist
cat dist/BeyondChats.app/Contents/Info.plist
```

#### 测试应用功能

1. 启动应用
2. 点击 Settings 配置 AI 服务
3. 输入任何 AI 的 API 密钥进行测试

### 高级配置

#### 代码签名（可选，用于分发）

对于要分发的应用，建议进行代码签名：

```bash
# 自签名（开发用）
codesign -s - dist/BeyondChats.app

# 验证签名
codesign -v dist/BeyondChats.app
```

对于生产分发，需要 Apple Developer Certificate：

```bash
# 使用开发者证书签名
codesign -s "Developer ID Application: Your Name (TEAM_ID)" \
  --entitlements entitlements.plist \
  dist/BeyondChats.app
```

#### 自定义应用信息

编辑 `package.json` 中的 `build` 配置：

```json
{
  "build": {
    "appId": "com.beyondchats.app",
    "productName": "BeyondChats",
    "mac": {
      "target": ["dmg", "zip"],
      "category": "public.app-category.productivity",
      "identity": null,
      "hardenedRuntime": true
    }
  }
}
```

### 故障排除

#### 构建失败：Node 版本过低

**错误信息**：`TypeError: crypto$2.getRandomValues is not a function`

**解决方案**：
```bash
nvm install 18
nvm use 18
npm run build:mac
```

#### 构建失败：磁盘空间不足

**解决方案**：
```bash
# 清理旧的构建缓存
rm -rf dist node_modules/.cache

# 确保有至少 2GB 空闲空间
df -h
```

#### 应用无法启动

**检查**：
1. 检查 API 密钥是否正确配置
2. 查看应用日志：`~/Library/Logs/BeyondChats/`
3. 尝试重新安装应用

#### DMG 文件损坏

**解决方案**：
```bash
# 重新生成 DMG
rm dist/BeyondChats-*.dmg
npm run build:mac
```

### 分发应用

#### 创建可分发的 ZIP 包

```bash
cd dist
zip -r BeyondChats-distribution.zip BeyondChats.app
```

#### 通过 GitHub Releases 分发

1. 在 GitHub 上创建新的 Release
2. 上传生成的 `BeyondChats-0.1.0.dmg` 和 `BeyondChats-0.1.0.zip`
3. 添加更新说明和已知问题

### 构建配置详解

项目的 `package.json` 中的 build 配置：

```json
{
  "build": {
    "appId": "com.beyondchats.app",          // 应用唯一标识
    "productName": "BeyondChats",             // 应用显示名称
    "directories": {
      "buildResources": "build",              // 资源文件目录
      "output": "dist"                        // 输出目录
    },
    "files": [
      "dist",                                 // 包含的文件
      "node_modules",
      "package.json"
    ],
    "mac": {
      "target": ["dmg", "zip"],               // 输出格式
      "category": "public.app-category.productivity"  // 应用分类
    }
  }
}
```

### 常见问题（FAQ）

**Q: 应用可以在 Intel 和 Apple Silicon Mac 上运行吗？**

A: 是的，当前配置支持两种架构。如需优化，可在 `package.json` 中配置：
```json
"mac": {
  "target": ["dmg"],
  "hardenedRuntime": true
}
```

**Q: 构建后的应用大小是多少？**

A: 通常在 200-300MB 之间（包含 Electron 和所有依赖）

**Q: 能否在 Windows 或 Linux 上构建 macOS 应用？**

A: 不能。macOS 应用必须在 macOS 上构建。

**Q: 如何更新已安装的应用？**

A: 下载新版本的 DMG，按照安装步骤覆盖安装即可。

### 相关文档

- [Electron Builder 官方文档](https://www.electron.build/)
- [macOS 应用打包指南](https://www.electron.build/configuration/mac)
- [Electron 官方文档](https://www.electronjs.org/docs)

---

**最后更新**: 2026-02-28  
**应用版本**: 0.1.0  
**支持系统**: macOS 10.13 及以上
