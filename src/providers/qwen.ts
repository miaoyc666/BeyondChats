import { AIProvider, StreamOptions, ProviderConfig } from './base';
import axios from 'axios';

export class QwenProvider extends AIProvider {
  constructor(config: ProviderConfig = {}) {
    super('Qwen (千问)', {
      baseUrl: 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation',
      model: 'qwen-max',
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
      throw new Error('Qwen is not configured. Please provide an API key.');
    }

    try {
      const messages = [
        ...(conversationHistory || []),
        { role: 'user', content: message },
      ];

      const response = await axios.post(
        this.config.baseUrl || '',
        {
          model: this.config.model,
          messages,
          parameters: {
            temperature: 0.7,
            max_tokens: 2000,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${this.config.apiKey}`,
            'Content-Type': 'application/json',
          },
          timeout: this.config.timeout,
        }
      );

      return response.data.output?.text || '';
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Qwen API Error: ${error.message}`);
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
      throw new Error('Qwen is not configured. Please provide an API key.');
    }

    try {
      const messages = [
        ...(conversationHistory || []),
        { role: 'user', content: message },
      ];

      const response = await axios.post(
        this.config.baseUrl || '',
        {
          model: this.config.model,
          messages,
          parameters: {
            temperature: 0.7,
            max_tokens: 2000,
            incremental_output: true,
          },
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
          if (line.startsWith('data:')) {
            const data = line.slice(5).trim();
            if (data) {
              try {
                const parsed = JSON.parse(data);
                const content = parsed.output?.text || '';
                if (content) {
                  options.onChunk?.(content);
                }
              } catch (e) {
                // Ignore parse errors
              }
            }
          }
        }
      });

      response.data.on('end', () => {
        options.onComplete?.();
      });

      response.data.on('error', (error: Error) => {
        options.onError?.(error);
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const err = new Error(`Qwen API Error: ${error.message}`);
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
        this.config.baseUrl || '',
        {
          model: this.config.model,
          messages: [{ role: 'user', content: 'test' }],
          parameters: {
            max_tokens: 10,
          },
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
