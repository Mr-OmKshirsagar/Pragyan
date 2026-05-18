jest.mock('@/services/aiProvider');
jest.mock('@/lib/redis');
jest.mock('@/ai/GeminiProvider', () => ({
  generateContent: jest.fn()
}));

import { generateQuestionsWithAI } from '@/ai/questionGenerator';
import { generateContent } from '@/ai/GeminiProvider';

const mockedGenerateContent = generateContent as jest.Mock;

describe('questionGenerator', () => {
  beforeEach(()=>{ jest.resetAllMocks(); });

  it('falls back to original questions when AI fails', async () => {
    mockedGenerateContent.mockRejectedValue(new Error('AI failure'));

    const questions = [ { id: 'q1', question: 'What is your skill?', options: ['A','B'] } ];
    const res = await generateQuestionsWithAI(questions as any);
    expect(res).toHaveLength(1);
    expect(res[0].question).toBe('What is your skill?');
  });

  it('uses cache to reduce AI calls', async () => {
    let callCount = 0;
    const responseData = [{ id: 'q1', question: 'Rephrased?', options: ['A','B'], hint: 'Short hint' }];
    mockedGenerateContent.mockImplementation(async () => { 
      callCount += 1; 
      return JSON.stringify(responseData);
    });

    const questions = [ { id: 'q1', question: 'What is your skill?', options: ['A','B'] } ];

    // force redis client to appear ready and use an in-memory cache for tests
    const redis = require('@/lib/redis').redisClient;
    if (redis) {
      redis.isReady = () => true;
      const store = new Map<string,string>();
      redis.get = async (k:string) => store.get(k) ?? null;
      redis.set = async (k:string,v:string,ttl?:number) => { store.set(k,v); if (ttl) setTimeout(()=>store.delete(k), ttl*1000) };
      redis.acquireLock = async (k:string, ttl=15000) => { if (store.has(k)) return false; store.set(k,'1'); setTimeout(()=>store.delete(k), ttl); return true };
      redis.releaseLock = async (k:string) => { store.delete(k) };
      redis.waitForKey = async (k:string, timeoutMs=15000) => { const start = Date.now(); while(Date.now()-start<timeoutMs){ const v=store.get(k); if(v) return v; await new Promise(r=>setTimeout(r,50)) } return null };
    }

    const first = await generateQuestionsWithAI(questions as any);
    const second = await generateQuestionsWithAI(questions as any);

    expect(callCount).toBe(1); // second should use cache provided by redis mock
    expect(first[0].question).toContain('Rephrased');
    expect(second[0].question).toContain('Rephrased');
  });
});
