<template>
  <div
    class="webview-wrapper"
    :class="{ loading: isLoading, error: hasError }"
  >
    <!-- 加载状态 -->
    <div
      v-if="isLoading"
      class="loading-overlay"
    >
      <el-icon class="loading-icon">
        <Loading />
      </el-icon>
      <p>正在加载 {{ provider.name }}...</p>
    </div>

    <!-- 错误状态 -->
    <div
      v-if="hasError"
      class="error-overlay"
    >
      <el-icon class="error-icon">
        <Warning />
      </el-icon>
      <p>{{ errorMessage }}</p>
      <el-button
        type="primary"
        @click="retry"
      >
        重试
      </el-button>
    </div>

    <!-- WebView容器 -->
    <div
      :id="webviewId"
      class="webview-container"
      :style="{
        visibility: hasError ? 'hidden' : 'visible',
        opacity: isLoading && isInitialLoad ? '0.5' : '1'
      }"
    />
  </div>
</template>

<script setup lang="ts">
import {
  ref, computed, onMounted, onUnmounted, watch
} from 'vue'
import { Loading, Warning } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import type { AIProvider } from '@/stores/app'

// Props
interface Props {
  provider: AIProvider
  width?: number
  height?: number
  autoLoad?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  width: 800,
  height: 600,
  autoLoad: true
})

// Emits
interface Emits {
  (e: 'ready'): void
  (e: 'loading', loading: boolean): void
  (e: 'error', error: string): void
  (e: 'login-status-changed', isLoggedIn: boolean): void
  (e: 'title-changed', title: string): void
  (e: 'url-changed', url: string): void
}

const emit = defineEmits<Emits>()

// 响应式数据
const isLoading = ref(false)
const hasError = ref(false)
const errorMessage = ref('')
const webviewElement = ref<Electron.WebviewTag | null>(null)
const retryCount = ref(0)
const maxRetries = 3
const isInitialLoad = ref(true)
const currentUrl = ref('')

// 计算属性
const webviewId = computed(() => `webview-${props.provider.id}`)

/**
 * 创建WebView元素
 */
const createWebView = async(): Promise<void> => {
  console.log(`Creating WebView for ${props.provider.name}`)

  const container = document.getElementById(webviewId.value)
  if (!container) {
    console.error(`WebView container not found: ${webviewId.value}`)
    return
  }

  // 清空容器
  container.innerHTML = ''

  // 创建webview元素
  const webview = document.createElement('webview') as Electron.WebviewTag
  webview.id = `${webviewId.value}-element`
  webview.src = props.provider.url
  webview.style.width = '100%'
  webview.style.height = '100%'
  webview.style.border = 'none'

  // 初始化URL状态
  currentUrl.value = props.provider.url
  isInitialLoad.value = true

  // 设置webview属性
  webview.setAttribute('nodeintegration', 'false')
  webview.setAttribute('websecurity', 'true')
  webview.setAttribute('allowpopups', 'true')
  webview.setAttribute('useragent', getUserAgent())
  webview.setAttribute('partition', `persist:${props.provider.id}`)

  // 设置preload脚本
  if (window.electronAPI) {
    try {
      const preloadPath = await window.electronAPI.getPreloadPath('webview-preload.js')
      webview.setAttribute('preload', `file://${preloadPath}`)
      console.log(`Preload script set for ${props.provider.name}: file://${preloadPath}`)
    } catch (e) {
      console.error('Failed to get preload path:', e)
    }
  }

  console.log(`WebView created for ${props.provider.name}, URL: ${props.provider.url}`)

  // 添加到容器
  container.appendChild(webview)
  webviewElement.value = webview

  // 绑定事件
  bindWebViewEvents(webview)
}

/**
 * 获取用户代理字符串
 */
const getUserAgent = (): string => {
  const baseUA = navigator.userAgent
  // 添加自定义标识，避免被某些网站检测为自动化工具
  return baseUA.replace(/Electron\/[\d.]+\s/, '')
}

/**
 * 绑定WebView事件
 */
const bindWebViewEvents = (webview: Electron.WebviewTag): void => {
  // 页面开始加载
  webview.addEventListener('did-start-loading', () => {
    console.log(`${props.provider.name} started loading`)
    isLoading.value = true
    hasError.value = false
    emit('loading', true)
  })

  // 页面加载完成
  webview.addEventListener('did-finish-load', () => {
    console.log(`${props.provider.name} finished loading`)
    isLoading.value = false
    hasError.value = false
    currentUrl.value = webview.src
    isInitialLoad.value = false
    emit('loading', false)
    emit('ready')
  })

  // 页面加载失败
  webview.addEventListener('did-fail-load', (event: any) => {
    if (event.errorCode === -3) return // 用户取消

    console.error(`${props.provider.name} load failed:`, event.errorDescription)
    isLoading.value = false
    hasError.value = true
    errorMessage.value = `加载失败: ${event.errorDescription || '未知错误'}`
    emit('loading', false)
    emit('error', errorMessage.value)
  })

  // 页面标题变化
  webview.addEventListener('page-title-updated', (event: any) => {
    console.log(`${props.provider.name} title changed:`, event.title)
    emit('title-changed', event.title)
  })

  // URL变化
  webview.addEventListener('will-navigate', (event: any) => {
    console.log(`${props.provider.name} navigating to:`, event.url)
    emit('url-changed', event.url)
  })

  // 新窗口请求
  webview.addEventListener('new-window', (event: any) => {
    // 在默认浏览器中打开
    if (window.electronAPI) {
      window.electronAPI.openExternal(event.url)
    }
  })

  // 崩溃事件
  webview.addEventListener('crashed', () => {
    console.error(`${props.provider.name} crashed`)
    isLoading.value = false
    hasError.value = true
    errorMessage.value = '页面已崩溃，请重新加载'
    emit('error', errorMessage.value)
  })
}

/**
 * 重试加载
 */
const retry = (): void => {
  if (retryCount.value >= maxRetries) {
    ElMessage.error(`${props.provider.name} 重试次数已达上限`)
    return
  }

  retryCount.value++
  hasError.value = false
  errorMessage.value = ''

  if (webviewElement.value) {
    webviewElement.value.reload()
  } else {
    createWebView()
  }
}

onMounted(async() => {
  console.log(`WebView mounted for ${props.provider.name}, autoLoad: ${props.autoLoad}`)

  if (props.autoLoad) {
    await createWebView()
  }
})

onUnmounted(() => {
  // 清理WebView
  if (webviewElement.value) {
    const container = document.getElementById(webviewId.value)
    if (container) {
      container.innerHTML = ''
    }
    webviewElement.value = null
  }
})

// 监听provider变化
watch(
  () => props.provider.url,
  (newUrl) => {
    if (webviewElement.value && newUrl) {
      webviewElement.value.src = newUrl
    }
  }
)
</script>

<style scoped lang="css">
.webview-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  background: white;
  overflow: hidden;
}

.webview-container {
  width: 100%;
  height: 100%;
}

.loading-overlay,
.error-overlay {
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

.loading-icon {
  font-size: 32px;
  color: var(--el-color-primary);
  animation: spin 1s linear infinite;
}

.error-icon {
  font-size: 32px;
  color: var(--el-color-danger);
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-overlay p,
.error-overlay p {
  font-size: 14px;
  color: var(--el-text-color-secondary);
  margin: 0;
}

.webview-wrapper.loading .webview-container {
  opacity: 0.5;
}

.webview-wrapper.error .webview-container {
  display: none;
}
</style>
