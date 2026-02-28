import { defineStore } from 'pinia';
import { ref, reactive } from 'vue';

export interface AIProvider {
  id: string;
  name: string;
  icon: string;
  url: string;
  isEnabled: boolean;
  isLoggedIn: boolean;
  loadingState: 'idle' | 'loading' | 'loaded' | 'error';
  lastError?: string;
  webviewId: string;
}

export interface CardConfig {
  isVisible: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  isHidden: boolean;
  size: {
    width: number;
    height: number;
  };
  zIndex: number;
}

export const useAppStore = defineStore('app', () => {
  // Providers state
  const providers = ref<AIProvider[]>([
    {
      id: 'chatgpt',
      name: 'ChatGPT',
      icon: '/icons/chatgpt.svg',
      url: 'https://chat.openai.com',
      isEnabled: false,
      isLoggedIn: false,
      loadingState: 'idle',
      webviewId: 'chatgpt-webview',
    },
    {
      id: 'gemini',
      name: 'Gemini',
      icon: '/icons/gemini.svg',
      url: 'https://gemini.google.com',
      isEnabled: false,
      isLoggedIn: false,
      loadingState: 'idle',
      webviewId: 'gemini-webview',
    },
    {
      id: 'qwen',
      name: 'Qwen (千问)',
      icon: '/icons/qwen.svg',
      url: 'https://qianwen.aliyun.com',
      isEnabled: false,
      isLoggedIn: false,
      loadingState: 'idle',
      webviewId: 'qwen-webview',
    },
    {
      id: 'douban',
      name: 'Douban (豆包)',
      icon: '/icons/douban.svg',
      url: 'https://www.doubao.com',
      isEnabled: false,
      isLoggedIn: false,
      loadingState: 'idle',
      webviewId: 'douban-webview',
    },
    {
      id: 'yuanbao',
      name: 'Yuanbao (元宝)',
      icon: '/icons/yuanbao.svg',
      url: 'https://yuanbao.tencent.com',
      isEnabled: false,
      isLoggedIn: false,
      loadingState: 'idle',
      webviewId: 'yuanbao-webview',
    },
  ]);

  const selectedProviders = ref<string[]>([]);
  const currentMessage = ref<string>('');
  const sendingStatus = reactive<Record<string, 'idle' | 'sending' | 'sent' | 'error'>>({});

  // Initialize sending status
  providers.value.forEach(provider => {
    sendingStatus[provider.id] = 'idle';
  });

  // Get single provider
  const getProvider = (providerId: string) => {
    return providers.value.find(p => p.id === providerId);
  };

  // Update provider login status
  const updateProviderLoginStatus = (providerId: string, isLoggedIn: boolean) => {
    const provider = getProvider(providerId);
    if (provider) {
      provider.isLoggedIn = isLoggedIn;
    }
  };

  // Toggle provider selection
  const toggleProviderSelection = (providerId: string) => {
    const index = selectedProviders.value.indexOf(providerId);
    if (index > -1) {
      selectedProviders.value.splice(index, 1);
    } else {
      selectedProviders.value.push(providerId);
    }
  };

  // Initialize conversations (if needed)
  const initializeConversations = () => {
    // Can be used to load saved conversations
  };

  return {
    providers,
    selectedProviders,
    currentMessage,
    sendingStatus,
    getProvider,
    updateProviderLoginStatus,
    toggleProviderSelection,
    initializeConversations,
  };
});
