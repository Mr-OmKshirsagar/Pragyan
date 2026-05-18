import { Request, Response, NextFunction } from 'express';

interface Bucket {
  tokens: number;
  lastRefill: number;
}

const buckets = new Map<string, Bucket>();

const MAX_TOKENS = 10; // requests
const REFILL_INTERVAL_MS = 60 * 1000; // refill per minute

function getKey(req: Request) {
  if ((req as any).user?.id) return `user:${(req as any).user.id}`;
  return `ip:${req.ip}`;
}

export function rateLimiter(req: Request, res: Response, next: NextFunction) {
  try {
    const key = getKey(req);
    const now = Date.now();
    let bucket = buckets.get(key);
    if (!bucket) {
      bucket = { tokens: MAX_TOKENS, lastRefill: now };
      buckets.set(key, bucket);
    }

    // refill
    const elapsed = now - bucket.lastRefill;
    if (elapsed > REFILL_INTERVAL_MS) {
      const cycles = Math.floor(elapsed / REFILL_INTERVAL_MS);
      bucket.tokens = Math.min(MAX_TOKENS, bucket.tokens + cycles * MAX_TOKENS);
      bucket.lastRefill = now;
    }

    if (bucket.tokens <= 0) {
      res.status(429).json({ success: false, message: 'Rate limit exceeded' });
      return;
    }

    bucket.tokens -= 1;
    next();
  } catch (err) {
    next();
  }
}

export default rateLimiter;
