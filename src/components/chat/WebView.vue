<template>
  <div class="webview-wrapper" :style="{ width: `${width}px`, height: `${height}px` }">
    <!-- 加载中状态 -->
    <div v-if="isLoading" class="loading-state">
      <div class="spinner"></div>
      <p>正在加载 {{ provider.name }}...</p>
    </div>

    <!-- WebView iframe -->
    <iframe
      v-show="!isLoading"
      :id="provider.webviewId"
      :key="provider.id"
      class="webview"
      :src="provider.url"
      sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-modals allow-presentation allow-orientation-lock"
      @load="handleLoad"
      @error="handleError"
    />

    <!-- 错误提示 -->
    <div v-if="hasError" class="error-state">
      <div class="error-icon">⚠️</div>
      <p class="error-title">{{ provider.name }} 加载失败</p>
      <p class="error-desc">{{ errorMessage }}</p>
      <button class="retry-btn" @click="retryLoad">重新加载</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAppStore } from '@/stores';
import type { AIProvider } from '@/stores/app';

interface Props {
  provider: AIProvider;
  width: number;
  height: number;
}

const props = defineProps<Props>();
const appStore = useAppStore();

const isLoading = ref(true);
const hasError = ref(false);
const errorMessage = ref('');

const handleLoad = () => {
  console.log(`[WebView] Loaded for ${props.provider.name}`);
  isLoading.value = false;
  hasError.value = false;
  
  // Update provider status
  const provider = appStore.getProvider(props.provider.id);
  if (provider) {
    provider.loadingState = 'loaded';
  }
};

const handleError = () => {
  console.error(`[WebView] Error loading ${props.provider.name}`);
  isLoading.value = false;
  hasError.value = true;
  
  // 根据不同的 provider 提供不同的错误信息
  const errorTexts: Record<string, string> = {
    'chatgpt': '由于安全策略限制，无法在本应用中直接加载。请在浏览器中访问 chat.openai.com',
    'gemini': '由于安全策略限制，无法在本应用中直接加载。请在浏览器中访问 gemini.google.com',
    'qwen': '加载失败，请检查网络连接或稍后重试',
    'douban': '加载失败，请检查网络连接或稍后重试',
    'yuanbao': '加载失败，请检查网络连接或稍后重试',
  };
  
  errorMessage.value = errorTexts[props.provider.id] || '加载失败，请检查网络连接';
  
  // Update provider status
  const provider = appStore.getProvider(props.provider.id);
  if (provider) {
    provider.loadingState = 'error';
    provider.lastError = errorMessage.value;
  }
};

const retryLoad = () => {
  isLoading.value = true;
  hasError.value = false;
  
  // 通过刷新 iframe 重新加载
  const iframe = document.getElementById(props.provider.webviewId) as HTMLIFrameElement;
  if (iframe) {
    iframe.src = props.provider.url;
  }
};

onMounted(() => {
  // Update loading state
  const provider = appStore.getProvider(props.provider.id);
  if (provider) {
    provider.loadingState = 'loading';
  }
  
  // 设置加载超时（30秒）
  const timeout = setTimeout(() => {
    if (isLoading.value && !hasError.value) {
      handleError();
    }
  }, 30000);
  
  // 清理超时
  return () => clearTimeout(timeout);
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

.retry-btn {
  margin-top: 8px;
  padding: 8px 24px;
  background: #409eff;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.retry-btn:hover {
  background: #66b1ff;
}

.retry-btn:active {
  background: #0a66c2;
}
</style>
