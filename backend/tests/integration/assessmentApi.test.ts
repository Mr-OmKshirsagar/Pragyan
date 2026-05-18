jest.mock('@/lib/redis');
jest.mock('@/services/aiProvider', () => ({
  aiProvider: {
    generateJsonValidated: jest.fn().mockResolvedValue([]),
    generateJsonRaw: jest.fn().mockResolvedValue('{}'),
    generateText: jest.fn().mockResolvedValue('ok'),
  },
}));
import request from 'supertest';
import app from '@/app';

describe('Assessment API', ()=>{
  it('GET /api/assessment/questions returns 200 and array', async ()=>{
    const res = await request(app).get('/api/assessment/questions');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('rate limiter returns 429 after limit', async ()=>{
    // the redisRateLimiter uses ASSESSMENT_RATE_LIMIT env or default 20
    const limit = 5;
    process.env.ASSESSMENT_RATE_LIMIT = String(limit);
    const agent = request(app);
    // ensure redisClient reports ready so redis-backed limiter path is used
    const redis = require('@/lib/redis').redisClient;
    if (redis) {
      const counters: Record<string, number> = {};
      redis.isReady = () => true;
      redis.incr = async (k:string) => { counters[k] = (counters[k] || 0) + 1; return counters[k]; };
      redis.expire = async (_k:string, _s:number) => {};
    }
    for (let i=0;i<limit;i++) {
      const r = await agent.get('/api/assessment/questions');
      expect(r.status).toBe(200);
    }
    const r2 = await agent.get('/api/assessment/questions');
    expect(r2.status).toBe(429);
  });
});
