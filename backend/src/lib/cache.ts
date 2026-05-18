// lightweight cache abstraction: prefer Redis if available, fallback to in-memory Map

type CacheValue = string;

class CacheStore {
  private client: any = null;
  private inMemory = new Map<string, { value: CacheValue; expiresAt?: number }>();
  private useRedis = false;

  constructor() {
    try {
      // try to require redis
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const redis = require('redis');
      const redisUrl = process.env.REDIS_URL || process.env.REDIS || 'redis://127.0.0.1:6379';
      const client = redis.createClient({ url: redisUrl });
      client.connect().then(() => {
        this.client = client;
        this.useRedis = true;
        console.info('Cache: connected to Redis at', redisUrl);
      }).catch((err: any) => {
        console.warn('Cache: redis connect failed, using in-memory cache', err?.message || err);
      });
    } catch (err) {
      // redis not installed or failed — continue with in-memory
      // console.info('Cache: redis not available, using in-memory cache');
    }
  }

  async get(key: string): Promise<CacheValue | null> {
    if (this.useRedis && this.client) {
      try {
        const v = await this.client.get(key);
        return v;
      } catch (e) {
        return null;
      }
    }

    const entry = this.inMemory.get(key);
    if (!entry) return null;
    if (entry.expiresAt && Date.now() > entry.expiresAt) {
      this.inMemory.delete(key);
      return null;
    }
    return entry.value;
  }

  async set(key: string, value: CacheValue, ttlSeconds?: number): Promise<void> {
    if (this.useRedis && this.client) {
      try {
        if (ttlSeconds) await this.client.setEx(key, ttlSeconds, value);
        else await this.client.set(key, value);
        return;
      } catch (e) {
        // fallthrough to in-memory
      }
    }

    const expiresAt = ttlSeconds ? Date.now() + ttlSeconds * 1000 : undefined;
    this.inMemory.set(key, { value, expiresAt });
  }
}

export const cache = new CacheStore();

export async function cacheGetParsed(key: string): Promise<any | null> {
  const raw = await cache.get(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export async function cacheSetParsed(key: string, obj: any, ttlSeconds?: number): Promise<void> {
  const raw = JSON.stringify(obj);
  await cache.set(key, raw, ttlSeconds);
}
