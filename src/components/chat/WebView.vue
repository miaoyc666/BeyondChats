<template>
  <div class="webview-wrapper" :style="{ width: `${width}px`, height: `${height}px` }">
    <iframe
      :id="provider.webviewId"
      :key="provider.id"
      class="webview"
      :src="provider.url"
      :sandbox="`allow-same-origin allow-scripts allow-popups allow-forms allow-storage 
        allow-modals allow-presentation allow-orientation-lock allow-top-navigation-by-user-activation`"
      @load="handleLoad"
      @error="handleError"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useAppStore } from '@/stores';
import type { AIProvider } from '@/stores/app';

interface Props {
  provider: AIProvider;
  width: number;
  height: number;
}

const props = defineProps<Props>();
const appStore = useAppStore();

const handleLoad = () => {
  console.log(`[WebView] Loaded for ${props.provider.name}`);
  
  // Update provider status
  const provider = appStore.getProvider(props.provider.id);
  if (provider) {
    provider.loadingState = 'loaded';
  }
};

const handleError = () => {
  console.error(`[WebView] Error loading ${props.provider.name}`);
  
  // Update provider status
  const provider = appStore.getProvider(props.provider.id);
  if (provider) {
    provider.loadingState = 'error';
    provider.lastError = 'Failed to load WebView';
  }
};

onMounted(() => {
  // Update loading state
  const provider = appStore.getProvider(props.provider.id);
  if (provider) {
    provider.loadingState = 'loading';
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
}

.webview {
  flex: 1;
  width: 100%;
  height: 100%;
  border: none;
}
</style>
