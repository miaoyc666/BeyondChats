import { AIProvider, StreamOptions, ProviderConfig } from './base';
import axios from 'axios';

export class DoubanProvider extends AIProvider {
  constructor(config: ProviderConfig = {}) {
    super('Douban (豆包)', {
      baseUrl: 'https://api.doubao.com/v1',
      model: 'doubao-pro-4k',
      timeout: 30000,
      ...config,
    });
  }

  isConfigured(): boolean {
    return !!(this.config.apiKey && this.config.apiKey.trim().length > 0);
  }

  async sendMessage(
    message: string,
    conversationHistory?: Array<{ role: string; content: string }>
  ): Promise<string> {
    if (!this.isConfigured()) {
      throw new Error('Douban is not configured. Please provide an API key.');
    }

    try {
      const messages = [
        ...(conversationHistory || []),
        { role: 'user', content: message },
      ];

      const response = await axios.post(
        `${this.config.baseUrl}/chat/completions`,
        {
          model: this.config.model,
          messages,
          temperature: 0.7,
          max_tokens: 2000,
        },
        {
          headers: {
            Authorization: `Bearer ${this.config.apiKey}`,
            'Content-Type': 'application/json',
          },
          timeout: this.config.timeout,
        }
      );

      return response.data.choices[0]?.message?.content || '';
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Douban API Error: ${error.message}`);
      }
      throw error;
    }
  }

  async streamMessage(
    message: string,
    options: StreamOptions,
    conversationHistory?: Array<{ role: string; content: string }>
  ): Promise<void> {
    if (!this.isConfigured()) {
      throw new Error('Douban is not configured. Please provide an API key.');
    }

    try {
      const messages = [
        ...(conversationHistory || []),
        { role: 'user', content: message },
      ];

      const response = await axios.post(
        `${this.config.baseUrl}/chat/completions`,
        {
          model: this.config.model,
          messages,
          temperature: 0.7,
          max_tokens: 2000,
          stream: true,
        },
        {
          headers: {
            Authorization: `Bearer ${this.config.apiKey}`,
            'Content-Type': 'application/json',
          },
          timeout: this.config.timeout,
          responseType: 'stream',
        }
      );

      response.data.on('data', (chunk: Buffer) => {
        const lines = chunk.toString().split('\n');
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              options.onComplete?.();
              return;
            }
            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices[0]?.delta?.content || '';
              if (content) {
                options.onChunk?.(content);
              }
            } catch (e) {
              // Ignore parse errors
            }
          }
        }
      });

      response.data.on('error', (error: Error) => {
        options.onError?.(error);
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const err = new Error(`Douban API Error: ${error.message}`);
        options.onError?.(err);
      } else {
        options.onError?.(error as Error);
      }
    }
  }

  async validateConfig(): Promise<boolean> {
    if (!this.isConfigured()) {
      return false;
    }

    try {
      const response = await axios.post(
        `${this.config.baseUrl}/chat/completions`,
        {
          model: this.config.model,
          messages: [{ role: 'user', content: 'test' }],
          max_tokens: 10,
        },
        {
          headers: {
            Authorization: `Bearer ${this.config.apiKey}`,
            'Content-Type': 'application/json',
          },
          timeout: this.config.timeout,
        }
      );

      return response.status === 200;
    } catch (error) {
      return false;
    }
  }
}
