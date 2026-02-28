<template>
  <div class="settings-view">
    <!-- Debug Mode Toggle Card -->
    <el-card class="debug-card">
      <template #header>
        <div class="card-header">
          <span>🐛 Debug Mode</span>
          <el-switch v-model="debugModeEnabled" @change="toggleDebugMode" />
        </div>
      </template>
      <div class="debug-info">
        <p v-if="debugModeEnabled" class="debug-status">
          ✅ Debug mode is <strong>ENABLED</strong>. Check browser console for detailed logs.
        </p>
        <p v-else class="debug-status">
          ❌ Debug mode is <strong>DISABLED</strong>. 
        </p>
        <p class="debug-hint">
          💡 Tip: In console, you can use:
          <code>window.__debug.enable()</code> or 
          <code>window.__debug.disable()</code>
        </p>
      </div>
    </el-card>

    <el-card class="settings-card">
      <template #header>
        <div class="card-header">
          <span>AI Configuration</span>
          <el-button text type="primary" @click="saveAllSettings">
            Save All
          </el-button>
        </div>
      </template>

      <el-tabs>
        <el-tab-pane
          v-for="ai in availableAIs"
          :key="ai.id"
          :label="ai.name"
        >
          <div class="settings-form">
            <div class="form-group">
              <label>{{ ai.name }} Configuration</label>
              <el-form :model="formData[ai.id]" label-width="120px">
                <el-form-item label="Enable">
                  <el-switch
                    v-model="formData[ai.id].enabled"
                    @change="onToggleProvider(ai.id)"
                  />
                </el-form-item>

                <el-form-item
                  v-if="ai.id !== 'douban'"
                  label="API Key"
                >
                  <el-input
                    v-model="formData[ai.id].apiKey"
                    type="password"
                    placeholder="Enter your API key"
                    show-password
                  />
                  <p class="help-text">
                    Get your API key from the official website
                  </p>
                </el-form-item>

                <el-form-item
                  v-if="ai.id === 'douban'"
                  label="Session Token"
                >
                  <el-input
                    v-model="formData[ai.id].sessionToken"
                    type="password"
                    placeholder="Enter your session token"
                    show-password
                  />
                  <p class="help-text">
                    Get session token from browser DevTools
                  </p>
                </el-form-item>

                <el-form-item v-if="ai.id !== 'yuanbao'" label="Base URL">
                  <el-input
                    v-model="formData[ai.id].baseUrl"
                    placeholder="API base URL (optional)"
                  />
                </el-form-item>

                <el-form-item label="Model">
                  <el-input
                    v-model="formData[ai.id].model"
                    placeholder="Model name"
                  />
                </el-form-item>

                <el-form-item>
                  <el-button
                    type="primary"
                    @click="testConnection(ai.id)"
                    :loading="testingProviders.has(ai.id)"
                  >
                    Test Connection
                  </el-button>
                  <el-button @click="saveSettings(ai.id)">
                    Save Configuration
                  </el-button>
                </el-form-item>

                <div
                  v-if="testResults.has(ai.id)"
                  class="test-result"
                  :class="testResults.get(ai.id) ? 'success' : 'error'"
                >
                  <span>
                    {{ testResults.get(ai.id) ? '✓ Connection successful' : '✗ Connection failed' }}
                  </span>
                </div>
              </el-form>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>

      <div class="settings-info">
        <el-alert title="API Configuration Guide" type="info" :closable="false">
          <template #default>
            <ul class="guide-list">
              <li>
                <strong>ChatGPT:</strong> Get API key from
                <a href="https://platform.openai.com/api-keys" target="_blank">
                  OpenAI Platform
                </a>
              </li>
              <li>
                <strong>Gemini:</strong> Get API key from
                <a href="https://aistudio.google.com" target="_blank">
                  Google AI Studio
                </a>
              </li>
              <li>
                <strong>Qwen:</strong> Get API key from
                <a href="https://dashscope.aliyun.com" target="_blank">
                  Aliyun DashScope
                </a>
              </li>
              <li>
                <strong>Douban:</strong> Use web session token from browser
              </li>
              <li>
                <strong>Yuanbao:</strong> Use Tencent Hunyuan API or web token
              </li>
            </ul>
          </template>
        </el-alert>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useAppStore } from '@/stores/app';
import { providerManager } from '@/services/providerManager';
import { setDebugMode, isDebugMode } from '@/utils/debug';
import { ElMessage } from 'element-plus';

const appStore = useAppStore();
const debugModeEnabled = ref(isDebugMode());

interface FormDataItem {
  enabled: boolean;
  apiKey?: string;
  sessionToken?: string;
  baseUrl?: string;
  model?: string;
}

const availableAIs = ref([
  { id: 'chatgpt', name: 'ChatGPT' },
  { id: 'gemini', name: 'Gemini' },
  { id: 'qwen', name: 'Qwen (千问)' },
  { id: 'douban', name: 'Douban (豆包)' },
  { id: 'yuanbao', name: 'Yuanbao (元宝)' },
]);

const formData = reactive<Record<string, FormDataItem>>({});
const testingProviders = ref<Set<string>>(new Set());
const testResults = ref<Map<string, boolean>>(new Map());

onMounted(() => {
  loadSettings();
});

const toggleDebugMode = (enabled: boolean) => {
  setDebugMode(enabled);
  if (enabled) {
    ElMessage.success('Debug mode enabled - Check browser console');
  } else {
    ElMessage.info('Debug mode disabled');
  }
};

const loadSettings = () => {
  const configs = appStore.getAIConfigurations();
  for (const ai of availableAIs.value) {
    const config = configs[ai.id];
    formData[ai.id] = {
      enabled: config?.enabled || false,
      apiKey: config?.apiKey || '',
      sessionToken: config?.customConfig?.sessionToken || '',
      baseUrl: config?.baseUrl || '',
      model: config?.model || '',
    };
  }
};

const saveSettings = (aiId: string) => {
  const data = formData[aiId];
  const config = {
    enabled: data.enabled,
    apiKey: data.apiKey,
    baseUrl: data.baseUrl,
    model: data.model,
    customConfig: {
      sessionToken: data.sessionToken,
    },
  };

  appStore.updateAIConfig(aiId, config);
  providerManager.updateProviderConfig(aiId, config);
  ElMessage.success(`${availableAIs.value.find(a => a.id === aiId)?.name} settings saved`);
};

const saveAllSettings = () => {
  for (const ai of availableAIs.value) {
    saveSettings(ai.id);
  }
};

const testConnection = async (aiId: string) => {
  testingProviders.value.add(aiId);
  try {
    saveSettings(aiId);
    const isValid = await providerManager.validateProvider(aiId);
    testResults.value.set(aiId, isValid);

    if (isValid) {
      ElMessage.success('Connection successful!');
    } else {
      ElMessage.error('Connection failed. Please check your credentials.');
    }
  } catch (error) {
    testResults.value.set(aiId, false);
    ElMessage.error(
      `Connection error: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  } finally {
    testingProviders.value.delete(aiId);
  }
};

const onToggleProvider = (aiId: string) => {
  formData[aiId].enabled = !formData[aiId].enabled;
};
</script>

<style scoped lang="css">
.settings-view {
  padding: 20px;
  background: #f5f7fa;
  height: 100%;
  overflow-y: auto;
}

.debug-card {
  max-width: 900px;
  margin: 0 auto 20px;
  background: #fef3c7;
  border: 1px solid #fcd34d;
}

.debug-info {
  padding: 12px 0;
}

.debug-status {
  margin: 8px 0;
  font-size: 14px;
  color: #92400e;
}

.debug-hint {
  margin: 12px 0 0;
  padding-top: 12px;
  border-top: 1px solid #fcd34d;
  font-size: 13px;
  color: #92400e;
  font-style: italic;
}

.debug-hint code {
  background: #fef08a;
  padding: 2px 6px;
  border-radius: 3px;
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 12px;
}

.settings-card {
  max-width: 900px;
  margin: 0 auto;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  font-size: 16px;
}

.settings-form {
  padding: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-weight: 600;
  margin-bottom: 12px;
  color: #1f2937;
}

.help-text {
  margin-top: 6px;
  font-size: 12px;
  color: #909399;
}

.test-result {
  margin-top: 12px;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 14px;

  &.success {
    background: #f0f9ff;
    color: #0ea5e9;
    border: 1px solid #0ea5e9;
  }

  &.error {
    background: #fef2f2;
    color: #ef4444;
    border: 1px solid #ef4444;
  }
}

.settings-info {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #ebeef5;
}

.guide-list {
  list-style: none;
  padding: 0;
  margin: 0;

  li {
    margin: 8px 0;
    line-height: 1.6;

    a {
      color: #409eff;
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }
  }
}
</style>
