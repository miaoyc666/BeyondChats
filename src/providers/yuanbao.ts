import { AIProvider, StreamOptions, ProviderConfig } from './base';
import axios from 'axios';

/**
 * Yuanbao (元宝) Provider
 * Note: Yuanbao doesn't have an official API as of now.
 * This is a placeholder implementation that would need to be adapted
 * for web scraping or if an official API becomes available.
 */
export class YuanbaoProvider extends AIProvider {
  constructor(config: ProviderConfig = {}) {
    super('Yuanbao (元宝)', {
      baseUrl: 'https://yuanbao.tencent.com/api',
      model: 'yuanbao-standard',
      timeout: 30000,
      ...config,
    });
  }

  isConfigured(): boolean {
    // Yuanbao requires authentication token or session
    return !!(
      this.config.sessionToken &&
      this.config.sessionToken.trim().length > 0
    );
  }

  async sendMessage(
    message: string,
    conversationHistory?: Array<{ role: string; content: string }>
  ): Promise<string> {
    if (!this.isConfigured()) {
      throw new Error(
        'Yuanbao is not configured. Please provide a session token.'
      );
    }

    try {
      const response = await axios.post(
        `${this.config.baseUrl}/chat`,
        {
          messages: [
            ...(conversationHistory || []),
            { role: 'user', content: message },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${this.config.sessionToken}`,
            'Content-Type': 'application/json',
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          },
          timeout: this.config.timeout,
        }
      );

      return response.data.reply || '';
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Yuanbao API Error: ${error.message}`);
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
      throw new Error(
        'Yuanbao is not configured. Please provide a session token.'
      );
    }

    try {
      const response = await axios.post(
        `${this.config.baseUrl}/chat`,
        {
          messages: [
            ...(conversationHistory || []),
            { role: 'user', content: message },
          ],
          stream: true,
        },
        {
          headers: {
            Authorization: `Bearer ${this.config.sessionToken}`,
            'Content-Type': 'application/json',
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          },
          timeout: this.config.timeout,
          responseType: 'stream',
        }
      );

      response.data.on('data', (chunk: Buffer) => {
        const text = chunk.toString();
        if (text) {
          try {
            const parsed = JSON.parse(text);
            const content = parsed.delta?.content || '';
            if (content) {
              options.onChunk?.(content);
            }
          } catch (e) {
            // Some responses might be plain text
            if (text.trim()) {
              options.onChunk?.(text);
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
        const err = new Error(`Yuanbao API Error: ${error.message}`);
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
        `${this.config.baseUrl}/chat`,
        {
          messages: [{ role: 'user', content: 'test' }],
        },
        {
          headers: {
            Authorization: `Bearer ${this.config.sessionToken}`,
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
