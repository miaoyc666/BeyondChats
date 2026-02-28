<template>
  <div class="webview-wrapper">
    <!-- 加载中状态 -->
    <div v-if="isLoading" class="loading-state">
      <div class="spinner"></div>
      <p>正在加载 {{ provider.name }}...</p>
    </div>

    <!-- WebView 容器 -->
    <div
      v-show="!isLoading && !hasError"
      :id="`webview-container-${provider.id}`"
      class="webview-container"
    />

    <!-- 错误提示 -->
    <div v-if="hasError" class="error-state">
      <div class="error-icon">⚠️</div>
      <p class="error-title">{{ provider.name }} 加载失败</p>
      <p class="error-desc">{{ errorMessage }}</p>
      <div class="button-group">
        <button class="retry-btn" @click="retryLoad">重新加载</button>
        <a :href="provider.url" target="_blank" class="open-btn">在浏览器中打开</a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useAppStore } from '@/stores';
import type { AIProvider } from '@/stores/app';

interface Props {
  provider: AIProvider;
  width?: number;
  height?: number;
}

const props = withDefaults(defineProps<Props>(), {
  width: 800,
  height: 600,
});

const appStore = useAppStore();

const isLoading = ref(true);
const hasError = ref(false);
const errorMessage = ref('');
const webviewElement = ref<any>(null);

/**
 * 创建 WebView 元素
 */
const createWebView = async() => {
  const containerId = `webview-container-${props.provider.id}`;
  const container = document.getElementById(containerId);
  
  if (!container) {
    console.error(`[WebView] Container not found: ${containerId}`);
    return;
  }

  // 清空容器
  container.innerHTML = '';

  // 创建 webview 元素
  const webview = document.createElement('webview') as any;
  webview.id = `${props.provider.id}-webview`;
  webview.src = props.provider.url;
  webview.style.width = '100%';
  webview.style.height = '100%';
  webview.style.border = 'none';

  // 设置 webview 属性
  webview.setAttribute('nodeintegration', 'false');
  webview.setAttribute('allowpopups', 'true');
  webview.setAttribute('useragent', getUserAgent());
  webview.setAttribute('partition', `persist:${props.provider.id}`);

  // 设置 preload 脚本
  if (window.electron) {
    try {
      const preloadPath = await window.electron.getPreloadPath();
      webview.setAttribute('preload', `file://${preloadPath}`);
      console.log(`[WebView] Preload script set: file://${preloadPath}`);
    } catch (e) {
      console.warn('[WebView] Failed to get preload path:', e);
    }
  }

  console.log(`[WebView] Creating webview for ${props.provider.name}`);

  // 添加到容器
  container.appendChild(webview);
  webviewElement.value = webview;

  // 绑定事件
  bindWebViewEvents(webview);
};

/**
 * 获取用户代理字符串
 */
const getUserAgent = (): string => {
  const baseUA = navigator.userAgent;
  // 移除 Electron 标识，避免被某些网站检测为自动化工具
  return baseUA.replace(/Electron\/[\d.]+\s/, '');
};

/**
 * 绑定 WebView 事件
 */
const bindWebViewEvents = (webview: any) => {
  // 页面开始加载
  webview.addEventListener('did-start-loading', () => {
    console.log(`[WebView] ${props.provider.name} started loading`);
    isLoading.value = true;
    hasError.value = false;
  });

  // 页面加载完成
  webview.addEventListener('did-finish-load', () => {
    console.log(`[WebView] ${props.provider.name} finished loading`);
    isLoading.value = false;
    hasError.value = false;
    
    const provider = appStore.getProvider(props.provider.id);
    if (provider) {
      provider.loadingState = 'loaded';
    }
  });

  // 页面加载失败
  webview.addEventListener('did-fail-load', (event: any) => {
    if (event.errorCode === -3) return; // 用户取消，忽略
    
    console.error(`[WebView] ${props.provider.name} load failed:`, event.errorDescription);
    isLoading.value = false;
    hasError.value = true;
    errorMessage.value = event.errorDescription || '加载失败';
  });

  // 新窗口请求
  webview.addEventListener('new-window', (event: any) => {
    // 在默认浏览器中打开
    window.open(event.url, '_blank');
  });

  // 崩溃事件
  webview.addEventListener('crashed', () => {
    console.error(`[WebView] ${props.provider.name} crashed`);
    isLoading.value = false;
    hasError.value = true;
    errorMessage.value = '页面已崩溃，请重新加载';
  });
};

/**
 * 重新加载
 */
const retryLoad = () => {
  if (webviewElement.value) {
    isLoading.value = true;
    hasError.value = false;
    webviewElement.value.reload();
  } else {
    createWebView();
  }
};

onMounted(() => {
  // 延迟创建 WebView，确保 DOM 已准备好
  setTimeout(() => {
    createWebView();
  }, 100);
});

onUnmounted(() => {
  // 清理 WebView
  if (webviewElement.value) {
    const container = document.getElementById(`webview-container-${props.provider.id}`);
    if (container) {
      container.innerHTML = '';
    }
    webviewElement.value = null;
  }
});
</script>

<style scoped lang="css">
.webview-wrapper {
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  align-items: stretch;
  position: relative;
  background: #fff;
}

.webview-container {
  width: 100%;
  height: 100%;
  flex: 1;
}

.webview {
  flex: 1;
  width: 100%;
  height: 100%;
  border: none;
}

/* 加载状态 */
.loading-state {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #f9f9f9;
  gap: 16px;
  z-index: 10;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f0f0f0;
  border-top-color: #409eff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-state p {
  font-size: 14px;
  color: #606266;
  margin: 0;
}

/* 错误状态 */
.error-state {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #fef0f0;
  gap: 12px;
  z-index: 10;
  padding: 20px;
}

.error-icon {
  font-size: 40px;
}

.error-title {
  font-size: 16px;
  font-weight: 600;
  color: #f56c6c;
  margin: 0;
}

.error-desc {
  font-size: 13px;
  color: #606266;
  text-align: center;
  margin: 0;
  line-height: 1.5;
}

.button-group {
  display: flex;
  gap: 12px;
  margin-top: 12px;
  justify-content: center;
}

.retry-btn,
.open-btn {
  padding: 8px 24px;
  background: #409eff;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.retry-btn:hover,
.open-btn:hover {
  background: #66b1ff;
}

.retry-btn:active,
.open-btn:active {
  background: #0a66c2;
}
</style>
