import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export interface Message {
  id: string;
  providerId: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface Conversation {
  id: string;
  providerId: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

export const useChatStore = defineStore('chat', () => {
  const conversations = ref<Record<string, Conversation[]>>({});
  const currentMessage = ref<string>('');

  // Initialize conversations for all providers
  const initializeConversations = (providerIds: string[]) => {
    providerIds.forEach(id => {
      if (!conversations.value[id]) {
        conversations.value[id] = [];
      }
    });
  };

  // Get conversations for a provider
  const getConversations = (providerId: string) => {
    return computed(() => conversations.value[providerId] || []);
  };

  // Create new conversation
  const createConversation = (providerId: string, title?: string) => {
    if (!conversations.value[providerId]) {
      conversations.value[providerId] = [];
    }

    const conversation: Conversation = {
      id: `conv-${Date.now()}`,
      providerId,
      title: title || `Conversation ${Date.now()}`,
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    conversations.value[providerId].push(conversation);
    return conversation;
  };

  // Add message to conversation
  const addMessage = (providerId: string, conversationId: string, role: 'user' | 'assistant', content: string) => {
    const convs = conversations.value[providerId];
    if (convs) {
      const conv = convs.find(c => c.id === conversationId);
      if (conv) {
        conv.messages.push({
          id: `msg-${Date.now()}`,
          providerId,
          role,
          content,
          timestamp: Date.now(),
        });
        conv.updatedAt = Date.now();
      }
    }
  };

  // Clear all conversations
  const clearAllConversations = () => {
    Object.keys(conversations.value).forEach(key => {
      conversations.value[key] = [];
    });
  };

  return {
    conversations,
    currentMessage,
    initializeConversations,
    getConversations,
    createConversation,
    addMessage,
    clearAllConversations,
  };
});
