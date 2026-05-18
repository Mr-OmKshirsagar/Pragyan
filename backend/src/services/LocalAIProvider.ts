import { AIProviderBase, AIProviderOptions, AIProviderResult } from './AIProviderBase';

export class LocalAIProvider extends AIProviderBase {
  getProviderName(): string {
    return 'local';
  }

  getModel(): string {
    return 'local-fallback';
  }

  protected shouldRetryError(): boolean {
    return false;
  }

  protected shouldRetryValidationError(): boolean {
    return false;
  }

  private unavailable(): never {
    throw new Error('Local AI provider is configured; remote AI calls are disabled.');
  }

  protected doGenerateText(_prompt: string, _opts?: AIProviderOptions): Promise<AIProviderResult<string>> {
    this.unavailable();
  }

  protected doGenerateJsonRaw(_prompt: string, _opts?: AIProviderOptions): Promise<AIProviderResult<string>> {
    this.unavailable();
  }
}
