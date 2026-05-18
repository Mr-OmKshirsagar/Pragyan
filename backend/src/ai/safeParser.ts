import { ZodSchema } from 'zod';

/**
 * Safely parse and sanitize AI output using Zod schema.
 * Returns parsed value or throws a descriptive error.
 */
export function safeParseAIResponse<T>(raw: unknown, schema: ZodSchema<T>): T {
  try {
    return schema.parse(raw);
  } catch (err) {
    // Normalize error for callers
    throw new Error(`AI response validation failed: ${(err as Error).message}`);
  }
}

export default safeParseAIResponse;
