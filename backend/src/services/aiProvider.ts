import { config } from '@/config/env';

import { AIProviderAdapter, AIProviderOptions } from './AIProviderBase';
import { GeminiProvider } from './GeminiProvider';
import { LocalAIProvider } from './LocalAIProvider';

type ProviderMode = 'local' | 'gemini';

class AIProviderFacade implements AIProviderAdapter {
  private provider: AIProviderAdapter;
  private mode: ProviderMode;

  constructor() {
    this.mode = this.resolveMode();
    this.provider = this.createProvider(this.mode);
  }

  private resolveMode(): ProviderMode {
    const configured = String(config.ai.provider || process.env.AI_PROVIDER || '').toLowerCase();
    return configured === 'local' ? 'local' : 'gemini';
  }

  private createProvider(mode: ProviderMode): AIProviderAdapter {
    return mode === 'local' ? new LocalAIProvider() : new GeminiProvider();
  }

  setProvider(provider: AIProviderAdapter): void {
    this.provider = provider;
    this.mode = provider.getProviderName() === 'local' ? 'local' : 'gemini';
  }

  getProviderName(): string {
    return this.provider.getProviderName();
  }

  getModel(): string {
    return this.provider.getModel();
  }

  getRuntime() {
    return {
      provider: this.getProviderName(),
      model: this.getModel(),
      configuredMode: this.mode,
    };
  }

  async generateText(prompt: string, opts?: AIProviderOptions): Promise<string> {
    return this.provider.generateText(prompt, opts);
  }

  async generateJsonRaw(prompt: string, opts?: AIProviderOptions): Promise<string> {
    return this.provider.generateJsonRaw(prompt, opts);
  }

  async generateJsonValidated<T>(prompt: string, validateFn: (raw: unknown) => T, opts?: AIProviderOptions): Promise<T> {
    return (this.provider as any).generateJsonValidated(prompt, validateFn, opts);
  }
}

export const aiProvider = new AIProviderFacade();

export default aiProvider;

