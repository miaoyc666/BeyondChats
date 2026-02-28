/**
 * Base class for all AI providers
 * Defines the interface that all AI providers must implement
 */

export interface StreamOptions {
  onChunk?: (chunk: string) => void;
  onComplete?: () => void;
  onError?: (error: Error) => void;
}

export interface ProviderConfig {
  apiKey?: string;
  baseUrl?: string;
  model?: string;
  timeout?: number;
  [key: string]: any;
}

export abstract class AIProvider {
  protected name: string;
  protected config: ProviderConfig;

  constructor(name: string, config: ProviderConfig) {
    this.name = name;
    this.config = config;
  }

  /**
   * Check if the provider is properly configured
   */
  abstract isConfigured(): boolean;

  /**
   * Send a message to the AI and get a response
   */
  abstract sendMessage(
    message: string,
    conversationHistory?: Array<{ role: string; content: string }>
  ): Promise<string>;

  /**
   * Send a message with streaming response
   */
  abstract streamMessage(
    message: string,
    options: StreamOptions,
    conversationHistory?: Array<{ role: string; content: string }>
  ): Promise<void>;

  /**
   * Validate configuration
   */
  abstract validateConfig(): Promise<boolean>;

  /**
   * Update provider configuration
   */
  updateConfig(config: Partial<ProviderConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Get provider name
   */
  getName(): string {
    return this.name;
  }

  /**
   * Get provider configuration
   */
  getConfig(): ProviderConfig {
    return this.config;
  }
}
