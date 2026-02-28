<template>
  <el-dialog
    v-model="showSettings"
    title="设置"
    width="600px"
    @close="goBack"
  >
    <!-- 开发者选项 -->
    <div class="settings-section">
      <h3>开发者选项</h3>
      <div class="settings-item">
        <span>Debug 模式</span>
        <el-switch
          v-model="debugMode"
          @change="toggleDebugMode"
        />
      </div>
      <div v-if="debugMode" class="debug-info">
        <p>Debug 模式已启用</p>
        <el-button @click="openDevTools">打开开发者工具</el-button>
      </div>
    </div>

    <!-- 布局设置 -->
    <el-divider />
    <div class="settings-section">
      <h3>布局设置</h3>
      <div class="settings-item">
        <span>网格列数</span>
        <el-select v-model="gridColumns" @change="updateGridColumns">
          <el-option label="1 列" :value="1" />
          <el-option label="2 列" :value="2" />
          <el-option label="3 列" :value="3" />
          <el-option label="4 列" :value="4" />
        </el-select>
      </div>
      <div class="settings-item">
        <span>间距 (px)</span>
        <el-input-number v-model="gridGap" @change="updateGridGap" :min="4" :max="32" />
      </div>
    </div>

    <!-- AI 提供商管理 -->
    <el-divider />
    <div class="settings-section">
      <h3>AI 提供商</h3>
      <div class="provider-list">
        <div
          v-for="provider in providers"
          :key="provider.id"
          class="provider-item"
        >
          <img :src="provider.icon" :alt="provider.name" class="provider-icon" />
          <span class="provider-name">{{ provider.name }}</span>
          <el-switch
            v-model="provider.isEnabled"
            @change="updateProvider(provider.id, { isEnabled: provider.isEnabled })"
          />
        </div>
      </div>
    </div>

    <!-- 关于 -->
    <el-divider />
    <div class="settings-section">
      <h3>关于</h3>
      <p class="about-text">
        <strong>BeyondChats</strong> - 多 AI 并排聊天工具<br />
        <span>v{{ appVersion }}</span>
      </p>
    </div>

    <template #footer>
      <el-button @click="goBack">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAppStore, useLayoutStore } from '@/stores';
import { debug } from '@/utils/debug';

const router = useRouter();
const appStore = useAppStore();
const layoutStore = useLayoutStore();

const showSettings = ref(true);
const debugMode = ref(false);
const gridColumns = ref(2);
const gridGap = ref(16);
const appVersion = ref('1.0.0');

const providers = computed(() => appStore.providers);

const toggleDebugMode = (value: boolean) => {
  debug.setEnabled(value);
  localStorage.setItem('debug-mode', value.toString());
};

const updateGridColumns = (value: number) => {
  layoutStore.gridSettings.columns = value;
};

const updateGridGap = (value: number) => {
  layoutStore.gridSettings.gap = value;
};

const updateProvider = (providerId: string, updates: any) => {
  const provider = appStore.getProvider(providerId);
  if (provider) {
    Object.assign(provider, updates);
  }
};

const openDevTools = () => {
  // 这在 Electron 环境中调用开发者工具
  window.electron?.ipcRenderer.invoke('open-dev-tools');
};

const goBack = () => {
  showSettings.value = false;
  router.back();
};

onMounted(() => {
  debugMode.value = debug.isEnabled();
  gridColumns.value = layoutStore.gridSettings.columns;
  gridGap.value = layoutStore.gridSettings.gap;
});
</script>

<style scoped lang="css">
.settings-section {
  margin-bottom: 20px;
}

.settings-section h3 {
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
}

.settings-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
  gap: 12px;
}

.settings-item span {
  font-size: 13px;
  color: #606266;
}

.debug-info {
  background: #fef0f0;
  border-left: 3px solid #fde4e4;
  padding: 12px;
  margin-top: 8px;
  border-radius: 4px;
  font-size: 12px;
}

.debug-info p {
  margin: 0 0 8px 0;
  color: #f56c6c;
}

.provider-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.provider-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: #f5f7fa;
  border-radius: 6px;
}

.provider-icon {
  width: 20px;
  height: 20px;
  border-radius: 4px;
}

.provider-name {
  flex: 1;
  font-size: 13px;
}

.about-text {
  margin: 0;
  font-size: 13px;
  line-height: 1.6;
  color: #606266;
}

:deep(.el-dialog__body) {
  max-height: 60vh;
  overflow-y: auto;
}
</style>
