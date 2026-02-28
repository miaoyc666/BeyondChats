<template>
  <div class="chat-view">
    <div class="chat-container">
      <!-- Messages area -->
      <div class="messages-area">
        <div v-if="messages.length === 0" class="empty-state">
          <el-empty description="No messages yet. Start a conversation!" />
        </div>
        <div v-else class="messages-list">
          <div
            v-for="(msg, index) in messages"
            :key="index"
            class="message"
            :class="msg.role"
          >
            <div class="message-avatar">
              <img
                v-if="msg.role === 'assistant'"
                :src="getCurrentAIIcon()"
                :alt="msg.role"
              />
              <span v-else>You</span>
            </div>
            <div class="message-content">
              <div class="message-text">{{ msg.content }}</div>
              <div class="message-time">
                {{ formatTime(msg.timestamp) }}
              </div>
            </div>
          </div>
          <div v-if="isLoading" class="message assistant">
            <div class="message-avatar">
              <img :src="getCurrentAIIcon()" :alt="aiId" />
            </div>
            <div class="message-content">
              <div class="message-text loading">
                <el-icon class="is-loading">
                  <Loading />
                </el-icon>
                Thinking...
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Input area -->
      <div class="input-area">
        <el-input
          v-model="inputMessage"
          type="textarea"
          :rows="3"
          placeholder="Type your message here..."
          @keydown.ctrl.enter="sendMessage"
          @keydown.meta.enter="sendMessage"
        />
        <div class="input-actions">
          <el-button
            v-if="!isConfigured"
            type="warning"
            @click="goToSettings"
          >
            Configure AI
          </el-button>
          <el-button
            v-else
            type="primary"
            :loading="isLoading"
            @click="sendMessage"
          >
            Send
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAppStore } from '@/stores/app';
import { providerManager } from '@/services/providerManager';
import { Loading } from '@element-plus/icons-vue';

const route = useRoute();
const router = useRouter();
const appStore = useAppStore();

const aiId = computed(() => route.params.aiId as string);
const inputMessage = ref('');
const isLoading = ref(false);
const messages = ref<Array<{ role: string; content: string; timestamp: number }>>([]);
const messagesAreaEl = ref<HTMLElement>();

const isConfigured = computed(() => {
  return providerManager.isProviderConfigured(aiId.value);
});

onMounted(() => {
  loadMessages();
});

watch(
  () => aiId.value,
  () => {
    loadMessages();
  }
);

const loadMessages = async () => {
  const session = appStore.getChatSessions(aiId.value)[0];
  if (session) {
    messages.value = session.messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
      timestamp: msg.timestamp,
    }));
  } else {
    messages.value = [];
  }
  await nextTick();
  scrollToBottom();
};

const sendMessage = async () => {
  if (!inputMessage.value.trim()) {
    return;
  }

  if (!isConfigured.value) {
    ElMessage.warning('Please configure this AI first');
    return;
  }

  const userMessage = inputMessage.value;
  inputMessage.value = '';
  isLoading.value = true;

  // Add user message to messages list
  messages.value.push({
    role: 'user',
    content: userMessage,
    timestamp: Date.now(),
  });

  await nextTick();
  scrollToBottom();

  try {
    // Send message to provider
    const response = await providerManager.sendMessage(aiId.value, userMessage);

    // Add assistant response to messages list
    messages.value.push({
      role: 'assistant',
      content: response,
      timestamp: Date.now(),
    });
  } catch (error) {
    messages.value.push({
      role: 'assistant',
      content: `Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`,
      timestamp: Date.now(),
    });
  } finally {
    isLoading.value = false;
    await nextTick();
    scrollToBottom();
  }
};

const scrollToBottom = () => {
  if (messagesAreaEl.value) {
    messagesAreaEl.value.scrollTop = messagesAreaEl.value.scrollHeight;
  }
};

const getCurrentAIIcon = (): string => {
  const iconMap: Record<string, string> = {
    chatgpt: '/icons/chatgpt.svg',
    gemini: '/icons/gemini.svg',
    douban: '/icons/douban.svg',
    qwen: '/icons/qwen.svg',
    yuanbao: '/icons/yuanbao.svg',
  };
  return iconMap[aiId.value] || '/icons/default.svg';
};

const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const goToSettings = () => {
  router.push('/settings');
};

import { ElMessage } from 'element-plus';
</script>

<style scoped lang="css">
.chat-view {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.chat-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.messages-area {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
}

.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.messages-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.message {
  display: flex;
  gap: 12px;
  animation: slideIn 0.3s ease-out;
}

.message.user {
  flex-direction: row-reverse;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.message-avatar {
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  border-radius: 50%;
  background: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: #666;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.message-content {
  flex: 1;
  max-width: 70%;
}

.message.user .message-content {
  align-items: flex-end;
}

.message-text {
  padding: 8px 12px;
  border-radius: 8px;
  word-wrap: break-word;
  white-space: pre-wrap;
  line-height: 1.5;
}

.message.user .message-text {
  background: #409eff;
  color: white;
}

.message.assistant .message-text {
  background: #f5f7fa;
  color: #1f2937;
}

.message-text.loading {
  display: flex;
  align-items: center;
  gap: 8px;
}

.message-time {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
  padding: 0 12px;
}

.input-area {
  padding: 16px;
  border-top: 1px solid #ebeef5;
  background: #fff;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.input-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
</style>
