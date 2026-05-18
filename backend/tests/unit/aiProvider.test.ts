jest.mock('@google/generative-ai');

import { AIProviderBase } from '@/services/AIProviderBase';
import { GeminiProvider } from '@/services/GeminiProvider';
import { aiProvider } from '@/services/aiProvider';

const geminiMock = require('@google/generative-ai').__mock;

class TestProvider extends AIProviderBase {
  constructor(private sequence: Array<string>) {
    super();
  }

  getProviderName(): string {
    return 'test';
  }

  getModel(): string {
    return 'test-model';
  }

  protected doGenerateText(): Promise<{ value: string }> {
    return Promise.resolve({ value: 'ok' });
  }

  protected async doGenerateJsonRaw(): Promise<{ value: string }> {
    const next = this.sequence.shift();
    if (!next) {
      throw new Error('sequence exhausted');
    }

    return { value: next };
  }
}

class QuotaProvider extends AIProviderBase {
  getProviderName(): string {
    return 'test';
  }

  getModel(): string {
    return 'test-model';
  }

  protected doGenerateText(): Promise<{ value: string }> {
    return Promise.reject({ status: 429, code: 'insufficient_quota', type: 'insufficient_quota', message: 'quota exceeded' });
  }

  protected doGenerateJsonRaw(): Promise<{ value: string }> {
    return Promise.reject({ status: 429, code: 'insufficient_quota', type: 'insufficient_quota', message: 'quota exceeded' });
  }
}

describe('aiProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    aiProvider.setProvider(new TestProvider(['{"ok":true}']));
  });

  it('delegates through the facade and validates json', async () => {
    const result = await aiProvider.generateJsonValidated('prompt', (raw) => raw as { ok: boolean });
    expect(result).toEqual({ ok: true });
  });

  it('retries parse failures then succeeds', async () => {
    const provider = new TestProvider(['not json', '{"ok":true}']);
    const result = await provider.generateJsonValidated('prompt', (raw) => raw as { ok: boolean });
    expect(result).toEqual({ ok: true });
  });

  it('fails fast on insufficient quota without retrying', async () => {
    const provider = new QuotaProvider();
    await expect(provider.generateJsonRaw('prompt')).rejects.toMatchObject({ code: 'insufficient_quota' });
  });

  it('uses Gemini provider responses', async () => {
    geminiMock.generateContentMock.mockResolvedValueOnce({
      response: Promise.resolve({
        text: () => '{"ok":true}',
        usageMetadata: { totalTokenCount: 11 },
      }),
    });

    const provider = new GeminiProvider();
    const text = await provider.generateJsonRaw('prompt');
    expect(text).toBe('{"ok":true}');
    expect(geminiMock.generateContentMock).toHaveBeenCalled();
  });
});
