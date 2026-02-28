<template>
  <div id="app" class="app-container">
    <el-container class="main-layout">
      <!-- Header with title bar -->
      <el-header class="app-header">
        <div class="header-content">
          <div class="app-title">
            <span>BeyondChats</span>
          </div>
          <div class="window-controls">
            <el-button
              link
              type="primary"
              @click="minimizeWindow"
            >
              <el-icon><Minus /></el-icon>
            </el-button>
            <el-button
              link
              type="primary"
              @click="maximizeWindow"
            >
              <el-icon><FullScreen /></el-icon>
            </el-button>
            <el-button
              link
              type="primary"
              @click="closeWindow"
            >
              <el-icon><Close /></el-icon>
            </el-button>
          </div>
        </div>
      </el-header>

      <el-container class="app-body">
        <!-- Sidebar for AI selection -->
        <el-aside class="app-sidebar" width="250px">
          <div class="sidebar-content">
            <div class="ai-list">
              <div class="section-title">Available AI Models</div>
              <div
                v-for="ai in availableAIs"
                :key="ai.id"
                class="ai-item"
                :class="{ active: activeAI === ai.id }"
                @click="selectAI(ai.id)"
              >
                <div class="ai-icon">
                  <img :src="ai.icon" :alt="ai.name" />
                </div>
                <div class="ai-info">
                  <div class="ai-name">{{ ai.name }}</div>
                  <div class="ai-status">
                    <el-tag
                      :type="ai.configured ? 'success' : 'warning'"
                      size="small"
                    >
                      {{ ai.configured ? 'Ready' : 'Not Configured' }}
                    </el-tag>
                  </div>
                </div>
              </div>
            </div>

            <el-divider />

            <div class="sidebar-actions">
              <el-button type="primary" @click="goToSettings" block>
                <el-icon><Setting /></el-icon> Settings
              </el-button>
              <el-button @click="clearAllChats" block>
                <el-icon><Delete /></el-icon> Clear History
              </el-button>
            </div>
          </div>
        </el-aside>

        <!-- Main content area -->
        <el-main class="app-main">
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAppStore } from '@/stores/app';
import { Setting, Delete, Minus, FullScreen, Close } from '@element-plus/icons-vue';

const router = useRouter();
const appStore = useAppStore();

const activeAI = ref<string>('chatgpt');
const availableAIs = ref([
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    icon: '/icons/chatgpt.svg',
    configured: false,
  },
  {
    id: 'gemini',
    name: 'Gemini',
    icon: '/icons/gemini.svg',
    configured: false,
  },
  {
    id: 'douban',
    name: 'Douban (豆包)',
    icon: '/icons/douban.svg',
    configured: false,
  },
  {
    id: 'qwen',
    name: 'Qwen (千问)',
    icon: '/icons/qwen.svg',
    configured: false,
  },
  {
    id: 'yuanbao',
    name: 'Yuanbao (元宝)',
    icon: '/icons/yuanbao.svg',
    configured: false,
  },
]);

onMounted(() => {
  loadAIConfigurations();
});

const loadAIConfigurations = () => {
  // Load AI configurations from store
  const configs = appStore.getAIConfigurations();
  availableAIs.value = availableAIs.value.map((ai) => ({
    ...ai,
    configured: configs[ai.id]?.enabled || false,
  }));
};

const selectAI = (aiId: string) => {
  activeAI.value = aiId;
  router.push(`/chat/${aiId}`);
};

const goToSettings = () => {
  router.push('/settings');
};

const clearAllChats = () => {
  appStore.clearAllChats();
};

const minimizeWindow = () => {
  window.electron.minimizeWindow();
};

const maximizeWindow = () => {
  window.electron.maximizeWindow();
};

const closeWindow = () => {
  window.electron.closeWindow();
};
</script>

<style scoped lang="css">
.app-container {
  width: 100%;
  height: 100%;
  background: #f5f7fa;
}

.main-layout {
  width: 100%;
  height: 100%;
}

.app-header {
  background: #fff;
  border-bottom: 1px solid #ebeef5;
  padding: 0 16px;
  display: flex;
  align-items: center;
  user-select: none;
  -webkit-app-region: drag;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 100%;
}

.app-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  -webkit-app-region: no-drag;
}

.window-controls {
  display: flex;
  gap: 4px;
  -webkit-app-region: no-drag;
}

.app-body {
  height: calc(100% - 60px);
}

.app-sidebar {
  background: #fff;
  border-right: 1px solid #ebeef5;
  overflow-y: auto;
}

.sidebar-content {
  padding: 16px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.ai-list {
  flex: 1;
}

.section-title {
  font-size: 12px;
  color: #909399;
  text-transform: uppercase;
  font-weight: 600;
  margin-bottom: 8px;
  letter-spacing: 0.5px;
}

.ai-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  margin-bottom: 8px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #f5f7fa;

  &:hover {
    background: #e4e7f1;
  }

  &.active {
    background: #e6f7ff;
    border-left: 3px solid #409eff;
    padding-left: 9px;
  }
}

.ai-icon {
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  background: #f0f0f0;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.ai-info {
  flex: 1;
  min-width: 0;
}

.ai-name {
  font-size: 14px;
  font-weight: 500;
  color: #1f2937;
  margin-bottom: 4px;
}

.ai-status {
  display: flex;
  gap: 4px;
}

.sidebar-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.app-main {
  padding: 0;
  background: #f5f7fa;
}
</style>
