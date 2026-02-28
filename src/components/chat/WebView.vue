<template>
  <div class="webview-wrapper" :style="{ width: `${width}px`, height: `${height}px` }">
    <iframe
      :id="provider.webviewId"
      class="webview"
      :src="provider.url"
      sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-storage"
      @load="handleLoad"
      @error="handleError"
    />
  </div>
</template>

<script setup lang="ts">
import type { AIProvider } from '@/stores/app';

interface Props {
  provider: AIProvider;
  width: number;
  height: number;
}

const props = defineProps<Props>();

const handleLoad = () => {
  console.log(`WebView loaded for ${props.provider.name}`);
};

const handleError = () => {
  console.error(`WebView error for ${props.provider.name}`);
};
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
