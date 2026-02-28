<template>
  <div id="app" class="app-container">
    <!-- 顶部导航栏 -->
    <div class="app-header">
      <div class="header-left">
        <h1 class="app-title">💬 BeyondChats</h1>
      </div>

      <div class="header-center">
        <div class="ai-selector">
          <div
            v-for="provider in providers"
            :key="provider.id"
            class="ai-badge"
            :class="{ selected: selectedProviders.includes(provider.id) }"
            @click="toggleProvider(provider.id)"
          >
            <img :src="provider.icon" :alt="provider.name" class="badge-icon" />
            <span class="badge-label">{{ provider.name }}</span>
          </div>
        </div>
      </div>

      <div class="header-right">
        <el-button
          type="primary"
          icon="Setting"
          circle
          @click="goToSettings"
        />
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="main-content">
      <!-- 统一输入区域 -->
      <div class="input-section">
        <UnifiedInput
          v-model="currentMessage"
          :selected-providers="selectedProviders"
          @send="handleSendMessage"
        />
      </div>

      <!-- AI卡片网格 -->
      <div class="cards-grid" :style="gridStyle">
        <AICard
          v-for="provider in visibleProviders"
          :key="provider.id"
          :provider="provider"
          :config="getCardConfig(provider.id)"
          class="card-item"
        />
      </div>
    </div>

    <!-- 路由视图（用于设置页面） -->
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAppStore, useLayoutStore } from '@/stores';
import UnifiedInput from '@/components/chat/UnifiedInput.vue';
import AICard from '@/components/chat/AICard.vue';

const router = useRouter();
const appStore = useAppStore();
const layoutStore = useLayoutStore();

// 响应式数据
const providers = computed(() => appStore.providers);
const selectedProviders = computed(() => appStore.selectedProviders);
const currentMessage = computed({
  get: () => appStore.currentMessage,
  set: (val) => {
    appStore.currentMessage = val;
  },
});

// 可见的 providers（被选中或启用的）
const visibleProviders = computed(() => {
  return providers.value.filter(provider => {
    const config = layoutStore.getCardConfig(provider.id);
    return provider.isEnabled && config.isVisible && !config.isHidden;
  });
});

// 网格样式
const gridStyle = computed(() => {
  const { columns, gap } = layoutStore.gridSettings;
  return {
    display: 'grid',
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    gap: `${gap}px`,
    padding: `${gap}px`,
    alignItems: 'start',
  };
});

// 切换 provider 选择
const toggleProvider = (providerId: string) => {
  const provider = appStore.getProvider(providerId);
  if (provider) {
    provider.isEnabled = !provider.isEnabled;
    appStore.toggleProviderSelection(providerId);
  }
};

// 获取卡片配置
const getCardConfig = (providerId: string) => {
  return layoutStore.getCardConfig(providerId);
};

// 发送消息
const handleSendMessage = async (message: string) => {
  // 广播消息到所有选中的 provider
  const aiCardRefs = document.querySelectorAll('.ai-card');
  // 具体的消息发送逻辑可以在这里实现
  console.log('Sending message:', message, 'to providers:', selectedProviders.value);
};

// 前往设置页面
const goToSettings = () => {
  router.push('/settings');
};

// 响应式布局
const handleResize = () => {
  layoutStore.updateWindowSize(window.innerWidth, window.innerHeight);
};

// 生命周期
onMounted(() => {
  // 初始化布局
  layoutStore.updateWindowSize(window.innerWidth, window.innerHeight);
  layoutStore.initializeCardConfigs(providers.value.map(p => p.id));
  layoutStore.loadLayoutConfig();

  // 监听窗口大小变化
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  layoutStore.saveLayoutConfig();
});
</script>

<style scoped lang="css">
.app-container {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f7fa;
}

/* 顶部导航栏 */
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  background: #fff;
  border-bottom: 1px solid #ebeef5;
  gap: 20px;
  flex-shrink: 0;
}

.header-left {
  min-width: 150px;
}

.app-title {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
}

.header-center {
  flex: 1;
  display: flex;
  justify-content: center;
  min-width: 0;
}

.ai-selector {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;
  max-height: 50px;
  overflow-y: auto;
}

.ai-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: #f0f2f5;
  border: 2px solid transparent;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  user-select: none;
  white-space: nowrap;
}

.ai-badge:hover {
  background: #e6e8eb;
}

.ai-badge.selected {
  background: #409eff;
  border-color: #0a66c2;
  color: #fff;
}

.badge-icon {
  width: 18px;
  height: 18px;
  border-radius: 3px;
}

.badge-label {
  font-size: 13px;
  font-weight: 500;
}

.header-right {
  min-width: 50px;
  display: flex;
  justify-content: flex-end;
}

/* 主要内容区域 */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  gap: 12px;
  padding: 8px;
}

.input-section {
  flex-shrink: 0;
  padding: 0 8px;
}

.cards-grid {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  min-height: 0;
}

.card-item {
  width: 100%;
  min-width: 300px;
}

/* 响应式布局 */
@media (max-width: 1400px) {
  .app-header {
    flex-wrap: wrap;
    gap: 12px;
  }

  .header-center {
    width: 100%;
    order: 3;
  }

  .ai-selector {
    justify-content: flex-start;
  }
}

@media (max-width: 900px) {
  .app-header {
    padding: 8px 12px;
  }

  .app-title {
    font-size: 16px;
  }
}
</style>
