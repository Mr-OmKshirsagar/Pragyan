// Simple in-memory redis mock used by tests
class FakeRedis {
  store: Map<string,string> = new Map();
  locks: Set<string> = new Set();
  ready = true;
  async get(k: string) { return this.store.get(k) ?? null }
  async set(k: string, v: string, ttl?: number) { this.store.set(k, v); if (ttl) setTimeout(()=>this.store.delete(k), ttl*1000); }
  async del(k:string) { this.store.delete(k) }
  async incr(k:string){ const v = Number(this.store.get(k) || '0')+1; this.store.set(k,String(v)); return v }
  async incrBy(k:string,amt:number){ const v = Number(this.store.get(k) || '0')+amt; this.store.set(k,String(v)); return v }
  async expire(k:string, s:number){ /* noop */ }
  isReady(){ return this.ready }
  async acquireLock(k:string, ttl=10000){ if (this.locks.has(k)) return false; this.locks.add(k); setTimeout(()=>this.locks.delete(k), ttl); return true }
  async releaseLock(k:string){ this.locks.delete(k) }
  async waitForKey(k:string, timeoutMs=15000){ const start=Date.now(); while(Date.now()-start<timeoutMs){ const v=this.store.get(k); if(v) return v; await new Promise(r=>setTimeout(r,50)) } return null }
}

module.exports = { redisClient: new FakeRedis() };
