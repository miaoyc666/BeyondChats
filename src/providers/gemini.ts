import { AIProvider, StreamOptions, ProviderConfig } from './base';
import axios from 'axios';

export class GeminiProvider extends AIProvider {
  constructor(config: ProviderConfig = {}) {
    super('Gemini', {
      baseUrl: 'https://generativelanguage.googleapis.com/v1beta/models',
      model: 'gemini-pro',
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
      throw new Error('Gemini is not configured. Please provide an API key.');
    }

    try {
      const contents = [
        ...(conversationHistory || []).map((msg) => ({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }],
        })),
        {
          role: 'user',
          parts: [{ text: message }],
        },
      ];

      const response = await axios.post(
        `${this.config.baseUrl}/${this.config.model}:generateContent?key=${this.config.apiKey}`,
        {
          contents,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2000,
          },
        },
        {
          timeout: this.config.timeout,
        }
      );

      return response.data.candidates[0]?.content?.parts[0]?.text || '';
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Gemini API Error: ${error.message}`);
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
      throw new Error('Gemini is not configured. Please provide an API key.');
    }

    try {
      const contents = [
        ...(conversationHistory || []).map((msg) => ({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }],
        })),
        {
          role: 'user',
          parts: [{ text: message }],
        },
      ];

      const response = await axios.post(
        `${this.config.baseUrl}/${this.config.model}:streamGenerateContent?key=${this.config.apiKey}`,
        {
          contents,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2000,
          },
        },
        {
          timeout: this.config.timeout,
          responseType: 'stream',
        }
      );

      response.data.on('data', (chunk: Buffer) => {
        const lines = chunk.toString().split('\n');
        for (const line of lines) {
          if (line.trim()) {
            try {
              const parsed = JSON.parse(line);
              const text =
                parsed.candidates?.[0]?.content?.parts?.[0]?.text || '';
              if (text) {
                options.onChunk?.(text);
              }
            } catch (e) {
              // Ignore parse errors
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
        const err = new Error(`Gemini API Error: ${error.message}`);
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
      const response = await axios.get(
        `${this.config.baseUrl}?key=${this.config.apiKey}`,
        {
          timeout: this.config.timeout,
        }
      );

      return response.status === 200;
    } catch (error) {
      return false;
    }
  }
}
