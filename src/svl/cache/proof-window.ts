export class ProofWindowCache {
  constructor(private kv: KVNamespace, private r2: R2Bucket) {}

  async getWindow(stateRoot: string): Promise<IncrementalWindow | null> {
    const key = `window:${stateRoot}`;
    const cached = await this.kv.get(key);
    if (cached) return JSON.parse(cached);
    
    // Fallback to R2 for larger historical windows
    const obj = await this.r2.get(key);
    if (obj) return JSON.parse(await obj.text());
    
    return null;
  }

  async setWindow(stateRoot: string, window: IncrementalWindow, ttl = 300) {
    const key = `window:${stateRoot}`;
    await this.kv.put(key, JSON.stringify(window), { expirationTtl: ttl });
    // Also persist to R2 for longer retention
    await this.r2.put(key, JSON.stringify(window));
  }

  async hasValidWindow(stateRoot: string): Promise<boolean> {
    const window = await this.getWindow(stateRoot);
    return window !== null && window.verified;
  }
}

interface IncrementalWindow {
  root: string;
  nodes: string[];
  verified: boolean;
  lastUpdated: number;
}