#!/usr/bin/env node

/**
 * 开发环境启动脚本
 * 使用 vite-plugin-electron 来正确处理 Electron 和 Vite 的集成
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🚀 启动 BeyondChats 开发环境...');
console.log('📝 提示: 使用 Ctrl+C 停止开发服务器');
console.log('');

// 设置环境变量
process.env.NODE_ENV = 'development';

// 首先启动 Vite dev server
console.log('📦 启动 Vite 开发服务器...');

const viteArgs = [
  'vite',
  '--config', 'vite.config.ts'
];

const viteProcess = spawn('npx', viteArgs, {
  stdio: 'inherit',
  shell: process.platform === 'win32',
  cwd: process.cwd()
});

// 等待 Vite 启动后再启动 Electron
let viteReady = false;
const stdout = viteProcess.stdout || viteProcess.stderr;

setTimeout(() => {
  if (!viteReady) {
    console.log('⚡ 启动 Electron...');
    
    // 编译 Electron 代码
    const tscProcess = spawn('npm', ['run', 'build:electron'], {
      stdio: 'inherit',
      shell: true,
      cwd: process.cwd()
    });
    
    tscProcess.on('close', (code) => {
      if (code === 0) {
        // 启动 Electron
        const electronProcess = spawn('electron', ['.'], {
          stdio: 'inherit',
          cwd: process.cwd(),
          env: { ...process.env, VITE_DEV_SERVER_URL: 'http://localhost:5173' }
        });
        
        // 处理 Electron 进程的关闭
        electronProcess.on('close', () => {
          console.log('\n✅ Electron 已关闭');
          process.exit(0);
        });
      }
    });
  }
}, 3000);

// 处理进程退出
process.on('SIGINT', () => {
  console.log('\n🛑 正在停止开发服务器...');
  viteProcess.kill('SIGINT');
  process.exit(0);
});

viteProcess.on('close', (code) => {
  console.log(`\n✅ 开发服务器已停止 (退出码: ${code})`);
  process.exit(code);
});
