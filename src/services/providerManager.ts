import { AIProvider, ProviderConfig } from '@/providers/base';
import { ChatGPTProvider } from '@/providers/chatgpt';
import { GeminiProvider } from '@/providers/gemini';
import { QwenProvider } from '@/providers/qwen';
import { DoubanProvider } from '@/providers/douban';
import { YuanbaoProvider } from '@/providers/yuanbao';

export class ProviderManager {
  private providers: Map<string, AIProvider> = new Map();

  constructor() {
    this.registerProviders();
  }

  private registerProviders(): void {
    this.providers.set('chatgpt', new ChatGPTProvider());
    this.providers.set('gemini', new GeminiProvider());
    this.providers.set('qwen', new QwenProvider());
    this.providers.set('douban', new DoubanProvider());
    this.providers.set('yuanbao', new YuanbaoProvider());
  }

  /**
   * Get a provider by ID
   */
  getProvider(providerId: string): AIProvider | undefined {
    return this.providers.get(providerId);
  }

  /**
   * Get all providers
   */
  getAllProviders(): Map<string, AIProvider> {
    return this.providers;
  }

  /**
   * Update provider configuration
   */
  updateProviderConfig(providerId: string, config: Partial<ProviderConfig>): void {
    const provider = this.providers.get(providerId);
    if (provider) {
      provider.updateConfig(config);
    }
  }

  /**
   * Check if a provider is configured
   */
  isProviderConfigured(providerId: string): boolean {
    const provider = this.providers.get(providerId);
    return provider ? provider.isConfigured() : false;
  }

  /**
   * Get all configured providers
   */
  getConfiguredProviders(): AIProvider[] {
    const configured: AIProvider[] = [];
    for (const provider of this.providers.values()) {
      if (provider.isConfigured()) {
        configured.push(provider);
      }
    }
    return configured;
  }

  /**
   * Validate a provider's configuration
   */
  async validateProvider(providerId: string): Promise<boolean> {
    const provider = this.providers.get(providerId);
    if (!provider) {
      return false;
    }
    try {
      return await provider.validateConfig();
    } catch {
      return false;
    }
  }

  /**
   * Send a message to a specific provider
   */
  async sendMessage(
    providerId: string,
    message: string,
    conversationHistory?: Array<{ role: string; content: string }>
  ): Promise<string> {
    const provider = this.providers.get(providerId);
    if (!provider) {
      throw new Error(`Provider ${providerId} not found`);
    }
    return provider.sendMessage(message, conversationHistory);
  }

  /**
   * Send a message with streaming response
   */
  async streamMessage(
    providerId: string,
    message: string,
    onChunk: (chunk: string) => void,
    onComplete: () => void,
    onError: (error: Error) => void,
    conversationHistory?: Array<{ role: string; content: string }>
  ): Promise<void> {
    const provider = this.providers.get(providerId);
    if (!provider) {
      throw new Error(`Provider ${providerId} not found`);
    }
    return provider.streamMessage(
      message,
      { onChunk, onComplete, onError },
      conversationHistory
    );
  }

  /**
   * Send message to multiple providers concurrently
   */
  async sendMessageToMultiple(
    providerIds: string[],
    message: string,
    conversationHistory?: Array<{ role: string; content: string }>
  ): Promise<Map<string, string>> {
    const results = new Map<string, string>();
    const promises = providerIds.map(async (id) => {
      try {
        const response = await this.sendMessage(id, message, conversationHistory);
        results.set(id, response);
      } catch (error) {
        results.set(id, `Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    });

    await Promise.all(promises);
    return results;
  }
}

// Export singleton instance
export const providerManager = new ProviderManager();
