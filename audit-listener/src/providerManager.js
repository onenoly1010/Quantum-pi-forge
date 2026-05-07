import { createProviderPool } from "./providerFactory.js";
import { markFailure, markSuccess, checkBlockDrift } from "./health.js";

export class ProviderManager {
  constructor() {
    this.providers = createProviderPool();
    this.activeIndex = 0;
    this.currentSubscription = null;

    console.log(`🔌 Initialized provider pool with ${this.providers.length} RPC endpoints`);

    // Periodic health check
    setInterval(() => {
      checkBlockDrift(this.providers);
      this.printHealthStatus();
    }, 30000);
  }

  getActiveProvider() {
    const healthy = this.providers.filter(p => p.healthy);

    if (healthy.length === 0) {
      console.log("⚠️ NO HEALTHY RPC PROVIDERS AVAILABLE");
      return this.providers[0];
    }

    return healthy[this.activeIndex % healthy.length];
  }

  rotateProvider() {
    const healthy = this.providers.filter(p => p.healthy);

    if (healthy.length === 0) return;

    this.activeIndex = (this.activeIndex + 1) % healthy.length;

    const newActive = this.getActiveProvider();
    console.log(`🔄 Failover complete. Now using RPC ${newActive.id}`);
  }

  handleSuccess(providerWrapper, blockNumber) {
    markSuccess(providerWrapper, blockNumber);
  }

  handleFailure(providerWrapper) {
    markFailure(providerWrapper);

    if (!providerWrapper.healthy) {
      this.rotateProvider();
      this.resubscribe();
    }
  }

  printHealthStatus() {
    console.log("\n📊 RPC Provider Status:");
    this.providers.forEach(p => {
      const status = p.healthy ? "✅ HEALTHY" : "❌ FAILED";
      console.log(`   RPC ${p.id}: ${status} | failures: ${p.failures} | block: ${p.lastBlock}`);
    });
    console.log("");
  }

  setSubscription(subscriptionFn) {
    this.subscriptionFn = subscriptionFn;
    this.resubscribe();
  }

  resubscribe() {
    if (this.currentSubscription) {
      try {
        this.currentSubscription.removeAllListeners();
      } catch (e) {}
    }

    const active = this.getActiveProvider();
    this.currentSubscription = this.subscriptionFn(active);
  }
}