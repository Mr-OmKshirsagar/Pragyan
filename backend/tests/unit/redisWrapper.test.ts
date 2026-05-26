import redisClient from '@/lib/redis';

describe('redisWrapper fallback', () => {
  const makeRedis = () => new ((redisClient as any).constructor)() as any;

  it('uses in-memory fallback when not configured', async () => {
    const redis = makeRedis();
    if (redis.isReady) { redis.ready = false; }
    await redis.set('test:key', 'value', 1);
    const v = await redis.get('test:key');
    expect(v).toBe('value');
    await redis.incr('counter');
    await redis.incrBy('counter', 2);
    await redis.expire('counter', 1);
    await redis.del('test:key');
    const v2 = await redis.get('test:key');
    expect(v2).toBeNull();
  });

  it('covers ready-path methods when redis is available', async () => {
    const redis = makeRedis();
    redis.ready = true;
    redis.client = {
      get: jest.fn().mockResolvedValue('value'),
      set: jest.fn().mockResolvedValue('OK'),
      setEx: jest.fn().mockResolvedValue('OK'),
      del: jest.fn().mockResolvedValue(1),
      incr: jest.fn().mockResolvedValue(2),
      incrBy: jest.fn().mockResolvedValue(4),
      expire: jest.fn().mockResolvedValue(true),
    };
    expect(await redis.get('ready:key')).toBe('value');
    await redis.set('ready:key', 'next', 10);
    expect(await redis.incr('n')).toBe(2);
    expect(await redis.incrBy('n', 2)).toBe(4);
    await redis.expire('n', 1);
    await redis.del('ready:key');
  });

  it('acquire and release in-memory lock', async () => {
    const redis = makeRedis();
    redis.ready = false;
    redis.client = null;
    const ok = await redis.acquireLock('lk:1', 1000);
    expect(ok).toBe(true);
    const ok2 = await redis.acquireLock('lk:1', 1000);
    expect(ok2).toBe(false);
    await redis.releaseLock('lk:1');
    const ok3 = await redis.acquireLock('lk:1', 1000);
    expect(ok3).toBe(true);
  });

  it('waits for a key to appear', async () => {
    const redis = makeRedis();
    redis.ready = false;
    redis.client = null;
    const promise = redis.waitForKey('later:key', 500);
    setTimeout(async () => {
      await redis.set('later:key', 'ready');
    }, 20);
    const value = await promise;
    expect(value).toBe('ready');
  });
});
