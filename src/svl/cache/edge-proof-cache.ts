export class EdgeProofCache {
  constructor(private kv: KVNamespace) {}

  async get(key: string) {
    return this.kv.get(`svl:${key}`);
  }

  async set(key: string, value: any, ttl = 60) {
    await this.kv.put(
      `svl:${key}`,
      JSON.stringify(value),
      { expirationTtl: ttl }
    );
  }

  async hasValidCachedProof(key: string) {
    return await this.kv.get(`svl:${key}`) !== null;
  }
}