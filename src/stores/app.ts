import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export interface AIConfig {
  id: string;
  name: string;
  enabled: boolean;
  apiKey?: string;
  baseUrl?: string;
  model?: string;
  customConfig?: Record<string, any>;
}

export interface ChatMessage {
  id: string;
  aiId: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface ChatSession {
  id: string;
  title: string;
  aiId: string;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
}

export const useAppStore = defineStore('app', () => {
  const aiConfigs = ref<Record<string, AIConfig>>({
    chatgpt: {
      id: 'chatgpt',
      name: 'ChatGPT',
      enabled: false,
      model: 'gpt-4',
    },
    gemini: {
      id: 'gemini',
      name: 'Gemini',
      enabled: false,
      model: 'gemini-pro',
    },
    douban: {
      id: 'douban',
      name: 'Douban (豆包)',
      enabled: false,
      model: 'doubao',
    },
    qwen: {
      id: 'qwen',
      name: 'Qwen (千问)',
      enabled: false,
      model: 'qwen-max',
    },
    yuanbao: {
      id: 'yuanbao',
      name: 'Yuanbao (元宝)',
      enabled: false,
      model: 'yuanbao',
    },
  });

  const chatSessions = ref<ChatSession[]>([]);
  const currentSessionId = ref<string | null>(null);

  const getAIConfigurations = () => {
    return aiConfigs.value;
  };

  const updateAIConfig = (aiId: string, config: Partial<AIConfig>) => {
    if (aiConfigs.value[aiId]) {
      aiConfigs.value[aiId] = { ...aiConfigs.value[aiId], ...config };
    }
  };

  const getAIConfig = (aiId: string) => {
    return aiConfigs.value[aiId];
  };

  const createChatSession = (title: string, aiId: string) => {
    const sessionId = `session-${Date.now()}`;
    const session: ChatSession = {
      id: sessionId,
      title,
      aiId,
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    chatSessions.value.push(session);
    currentSessionId.value = sessionId;
    return session;
  };

  const getCurrentSession = computed(() => {
    return chatSessions.value.find((s) => s.id === currentSessionId.value);
  });

  const addMessage = (sessionId: string, message: ChatMessage) => {
    const session = chatSessions.value.find((s) => s.id === sessionId);
    if (session) {
      session.messages.push(message);
      session.updatedAt = Date.now();
    }
  };

  const getChatSessions = (aiId?: string) => {
    if (aiId) {
      return chatSessions.value.filter((s) => s.aiId === aiId);
    }
    return chatSessions.value;
  };

  const deleteChatSession = (sessionId: string) => {
    const index = chatSessions.value.findIndex((s) => s.id === sessionId);
    if (index > -1) {
      chatSessions.value.splice(index, 1);
    }
  };

  const clearAllChats = () => {
    chatSessions.value = [];
    currentSessionId.value = null;
  };

  const getEnabledAIs = computed(() => {
    return Object.values(aiConfigs.value).filter((config) => config.enabled);
  });

  return {
    aiConfigs,
    chatSessions,
    currentSessionId,
    getAIConfigurations,
    updateAIConfig,
    getAIConfig,
    createChatSession,
    getCurrentSession,
    addMessage,
    getChatSessions,
    deleteChatSession,
    clearAllChats,
    getEnabledAIs,
  };
});
