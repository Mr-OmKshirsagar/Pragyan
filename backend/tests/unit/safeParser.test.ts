import safeParseAIResponse from '@/ai/safeParser';
import { z } from 'zod';

describe('safeParseAIResponse', () => {
  it('throws descriptive error for invalid data', () => {
    const schema = z.object({ name: z.string() });
    expect(() => safeParseAIResponse({ foo: 'bar' }, schema)).toThrow(/AI response validation failed/);
  });

  it('returns parsed value when valid', () => {
    const schema = z.object({ name: z.string() });
    const parsed = safeParseAIResponse({ name: 'Alice' }, schema);
    expect(parsed).toEqual({ name: 'Alice' });
  });
});
