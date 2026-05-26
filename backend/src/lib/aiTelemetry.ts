interface TelemetryStats {
  calls: number;
  tokens: number;
  failures: number;
  fallbackCount: number;
  serviceUnavailable: number;
  totalLatencyMs: number;
  cacheHits: number;
  providerCalls: Record<string, number>;
  providerFailures: Record<string, number>;
  providerFallbacks: Record<string, number>;
  providerServiceUnavailable: Record<string, number>;
}

const stats: TelemetryStats = {
  calls: 0,
  tokens: 0,
  failures: 0,
  fallbackCount: 0,
  serviceUnavailable: 0,
  totalLatencyMs: 0,
  cacheHits: 0,
  providerCalls: {},
  providerFailures: {},
  providerFallbacks: {},
  providerServiceUnavailable: {},
};

function normalizeProvider(providerOrTokens: string | number, tokensOrLatency?: number, latencyMaybe?: number) {
  if (typeof providerOrTokens === 'string') {
    return {
      provider: providerOrTokens,
      tokens: Number(tokensOrLatency || 0),
      latency: Number(latencyMaybe || 0),
    };
  }

  return {
    provider: 'unknown',
    tokens: Number(providerOrTokens || 0),
    latency: Number(tokensOrLatency || 0),
  };
}

export function recordCall(providerOrTokens: string | number, tokensOrLatency?: number, latencyMaybe?: number) {
  const { provider, tokens, latency } = normalizeProvider(providerOrTokens, tokensOrLatency, latencyMaybe);
  stats.calls += 1;
  stats.tokens += tokens;
  stats.totalLatencyMs += latency;
  stats.providerCalls[provider] = (stats.providerCalls[provider] || 0) + 1;
  try {
    const redis = require('@/lib/redis').redisClient;
    if (redis && redis.isReady && redis.isReady()) {
      // increment counters in redis for global metrics
      try { redis.incr('telemetry:ai:calls'); } catch {}
      try { redis.incrBy('telemetry:ai:tokens', tokens); } catch {}
      try { redis.incr('telemetry:ai:latency_total_ms'); } catch {}
      try { redis.incr(`telemetry:ai:calls:${provider}`); } catch {}
    }
  } catch (e) {
    // ignore
  }
}

export function recordCacheHit() {
  stats.cacheHits += 1;
}

export function recordFailure(provider = 'unknown') {
  stats.failures += 1;
  stats.providerFailures[provider] = (stats.providerFailures[provider] || 0) + 1;
  try { const redis = require('@/lib/redis').redisClient; if (redis && redis.isReady && redis.isReady()) redis.incr('telemetry:ai:failures').catch(()=>{}); } catch {}
}

export function recordFallback(provider = 'unknown') {
  stats.fallbackCount += 1;
  stats.providerFallbacks[provider] = (stats.providerFallbacks[provider] || 0) + 1;
  try { const redis = require('@/lib/redis').redisClient; if (redis && redis.isReady && redis.isReady()) redis.incr('telemetry:ai:fallbacks').catch(()=>{}); } catch {}
}

export function recordServiceUnavailable(provider = 'unknown') {
  stats.serviceUnavailable = (stats.serviceUnavailable || 0) + 1;
  stats.providerServiceUnavailable[provider] = (stats.providerServiceUnavailable[provider] || 0) + 1;
  try { const redis = require('@/lib/redis').redisClient; if (redis && redis.isReady && redis.isReady()) redis.incr('telemetry:ai:service_unavailable').catch(()=>{}); } catch {}
}

export function getTelemetry() {
  return {
    ...stats,
    averageLatencyMs: stats.calls ? Math.round(stats.totalLatencyMs / stats.calls) : 0,
  };
}

export default { recordCall, recordCacheHit, recordFailure, recordFallback, recordServiceUnavailable, getTelemetry };
