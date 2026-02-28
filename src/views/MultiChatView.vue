<template>
  <div class="multi-chat-view">
    <div class="multi-chat-header">
      <h2>Multi-AI Chat</h2>
      <el-button
        type="primary"
        @click="sendToAll"
        :disabled="enabledProviders.length === 0 || !inputMessage.trim()"
      >
        Send to All
      </el-button>
    </div>

    <div class="multi-chat-input">
      <el-input
        v-model="inputMessage"
        type="textarea"
        :rows="4"
        placeholder="Type your message to send to all enabled AI models..."
        @keydown.ctrl.enter="sendToAll"
        @keydown.meta.enter="sendToAll"
      />
    </div>

    <div class="providers-status">
      <div class="status-header">Enabled AI Models:</div>
      <div class="status-grid">
        <div
          v-for="provider of enabledProviders"
          :key="provider"
          class="status-item"
        >
          <div class="provider-icon">
            <img :src="getProviderIcon(provider)" :alt="provider" />
          </div>
          <div class="provider-name">{{ getProviderName(provider) }}</div>
          <div
            class="provider-status"
            :class="getResponseStatus(provider)"
          >
            {{
              isLoading
                ? 'Thinking...'
                : responses.has(provider)
                  ? 'Done'
                  : 'Pending'
            }}
          </div>
        </div>
      </div>
    </div>

    <div v-if="responses.size > 0" class="responses-container">
      <div class="responses-header">Responses</div>
      <div class="responses-grid">
        <el-card
          v-for="[provider, response] of responses"
          :key="provider"
          class="response-card"
        >
          <template #header>
            <div class="response-header">
              <img :src="getProviderIcon(provider)" :alt="provider" />
              <span>{{ getProviderName(provider) }}</span>
            </div>
          </template>
          <div class="response-content">{{ response }}</div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useAppStore } from '@/stores/app';
import { providerManager } from '@/services/providerManager';
import { ElMessage } from 'element-plus';

const appStore = useAppStore();

const inputMessage = ref('');
const isLoading = ref(false);
const responses = ref<Map<string, string>>(new Map());

const enabledProviders = computed(() => {
  return appStore.getEnabledAIs.map((ai) => ai.id);
});

const sendToAll = async () => {
  if (!inputMessage.value.trim()) {
    ElMessage.warning('Please enter a message');
    return;
  }

  if (enabledProviders.value.length === 0) {
    ElMessage.warning('Please enable at least one AI model');
    return;
  }

  isLoading.value = true;
  responses.value.clear();

  try {
    const results = await providerManager.sendMessageToMultiple(
      enabledProviders.value,
      inputMessage.value
    );

    for (const [provider, response] of results) {
      responses.value.set(provider, response);
    }

    ElMessage.success('Responses received from all AI models');
  } catch (error) {
    ElMessage.error(
      `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  } finally {
    isLoading.value = false;
  }
};

const getProviderIcon = (provider: string): string => {
  const iconMap: Record<string, string> = {
    chatgpt: '/icons/chatgpt.svg',
    gemini: '/icons/gemini.svg',
    douban: '/icons/douban.svg',
    qwen: '/icons/qwen.svg',
    yuanbao: '/icons/yuanbao.svg',
  };
  return iconMap[provider] || '/icons/default.svg';
};

const getProviderName = (provider: string): string => {
  const nameMap: Record<string, string> = {
    chatgpt: 'ChatGPT',
    gemini: 'Gemini',
    douban: 'Douban (豆包)',
    qwen: 'Qwen (千问)',
    yuanbao: 'Yuanbao (元宝)',
  };
  return nameMap[provider] || provider;
};

const getResponseStatus = (provider: string): string => {
  if (isLoading.value) {
    return 'loading';
  }
  return responses.value.has(provider) ? 'done' : 'pending';
};
</script>

<style scoped lang="css">
.multi-chat-view {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 20px;
  gap: 20px;
  overflow-y: auto;
  background: #f5f7fa;
}

.multi-chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  h2 {
    margin: 0;
    font-size: 20px;
    font-weight: 600;
    color: #1f2937;
  }
}

.multi-chat-input {
  background: white;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.providers-status {
  background: white;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.status-header {
  font-weight: 600;
  margin-bottom: 12px;
  color: #1f2937;
}

.status-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
}

.status-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px;
  background: #f5f7fa;
  border-radius: 6px;
  text-align: center;
  gap: 8px;
}

.provider-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #fff;
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

.provider-name {
  font-size: 12px;
  font-weight: 500;
  color: #1f2937;
}

.provider-status {
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 3px;
  font-weight: 500;

  &.loading {
    background: #fef3c7;
    color: #92400e;
  }

  &.done {
    background: #dcfce7;
    color: #166534;
  }

  &.pending {
    background: #f3f4f6;
    color: #6b7280;
  }
}

.responses-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.responses-header {
  font-weight: 600;
  margin-bottom: 12px;
  color: #1f2937;
}

.responses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
  flex: 1;
  overflow-y: auto;
}

.response-card {
  display: flex;
  flex-direction: column;
}

.response-header {
  display: flex;
  align-items: center;
  gap: 8px;

  img {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    object-fit: cover;
  }

  span {
    font-weight: 600;
    color: #1f2937;
  }
}

.response-content {
  white-space: pre-wrap;
  word-wrap: break-word;
  line-height: 1.6;
  max-height: 400px;
  overflow-y: auto;
  color: #4b5563;
}
</style>
