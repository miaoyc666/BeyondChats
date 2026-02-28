<template>
  <div
    class="ai-card"
    :class="{
      minimized: config?.isMinimized,
      maximized: config?.isMaximized,
      'logged-in': provider.isLoggedIn,
    }"
    :style="cardStyle"
  >
    <!-- 卡片头部 -->
    <div class="card-header">
      <div class="header-left">
        <img :src="provider.icon" :alt="provider.name" class="provider-icon" />
        <span class="provider-name">{{ provider.name }}</span>
        <el-tag
          :type="provider.isLoggedIn ? 'success' : 'info'"
          size="small"
        >
          {{ provider.isLoggedIn ? '已登录' : '未登录' }}
        </el-tag>
      </div>

      <div class="header-right">
        <el-button
          v-if="!config?.isMaximized"
          size="small"
          circle
          icon="FullScreen"
          @click="toggleMaximized"
        />
        <el-button
          v-if="config?.isMaximized"
          size="small"
          circle
          icon="Close"
          @click="toggleMaximized"
        />
        <el-button
          size="small"
          circle
          :icon="config?.isMinimized ? 'ArrowUp' : 'ArrowDown'"
          @click="toggleMinimized"
        />
      </div>
    </div>

    <!-- WebView容器 -->
    <div v-show="!config?.isMinimized" class="webview-container">
      <WebView
        :provider="provider"
        :width="webviewWidth"
        :height="webviewHeight"
      />
    </div>

    <!-- 调整大小手柄 -->
    <div
      v-show="!config?.isMinimized"
      class="resize-handle"
      @mousedown="startResize"
    >
      <el-icon><Rank /></el-icon>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useLayoutStore } from '@/stores';
import WebView from './WebView.vue';
import type { AIProvider, CardConfig } from '@/stores/app';

interface Props {
  provider: AIProvider;
  config?: CardConfig;
}

const props = defineProps<Props>();
const layoutStore = useLayoutStore();


const cardStyle = computed(() => {
  if (!props.config) return {};

  return {
    width: `${props.config.size.width}px`,
    height: props.config.isMinimized ? 'auto' : `${props.config.size.height}px`,
    zIndex: props.config.zIndex,
    visibility: props.config.isHidden ? 'hidden' : 'visible',
    opacity: props.config.isHidden ? 0 : 1,
  };
});

const webviewWidth = computed(() => props.config?.size.width || 600);
const webviewHeight = computed(() => (props.config?.size.height || 600) - 60);

const toggleMinimized = () => {
  layoutStore.toggleCardMinimized(props.provider.id);
};

const toggleMaximized = () => {
  layoutStore.toggleCardMaximized(props.provider.id);
};

const startResize = (event: MouseEvent) => {
  event.preventDefault();

  const startX = event.clientX;
  const startY = event.clientY;
  const startWidth = props.config?.size.width || 600;
  const startHeight = props.config?.size.height || 600;

  const handleMouseMove = (e: MouseEvent) => {
    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;

    const newWidth = Math.max(startWidth + deltaX, 300);
    const newHeight = Math.max(startHeight + deltaY, 200);

    layoutStore.updateCardSize(props.provider.id, {
      width: newWidth,
      height: newHeight,
    });
  };

  const handleMouseUp = () => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', handleMouseUp);
};
</script>

<style scoped lang="css">
.ai-card {
  background: #fff;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: all 0.3s ease;
}

.ai-card.logged-in {
  border-color: #67c23a;
}

.ai-card.minimized {
  height: auto !important;
  min-height: 60px !important;
}

.ai-card.maximized {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  width: 100vw !important;
  height: 100vh !important;
  z-index: 1000 !important;
  border-color: #409eff;
  border-radius: 0 !important;
}

.ai-card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: #fafbfc;
  border-bottom: 1px solid #ebeef5;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.provider-icon {
  width: 20px;
  height: 20px;
  border-radius: 4px;
}

.provider-name {
  font-weight: 600;
  color: #1f2937;
  font-size: 14px;
}

.header-right {
  display: flex;
  gap: 4px;
}

.webview-container {
  flex: 1;
  overflow: auto;
  display: flex;
  flex-direction: column;
  min-height: 300px;
}


.resize-handle {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 16px;
  height: 16px;
  cursor: nw-resize;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f0f0;
  border-top-left-radius: 4px;
  color: #999;
}

.resize-handle:hover {
  color: #409eff;
  background: #e6f7ff;
}
</style>
