import { CONFIG } from "./config.js";

export function markFailure(providerWrapper) {
  providerWrapper.failures += 1;
  providerWrapper.healthy = providerWrapper.failures < CONFIG.MAX_RPC_FAILURES;

  if (!providerWrapper.healthy) {
    console.log(`❌ RPC ${providerWrapper.id} marked unhealthy after ${providerWrapper.failures} failures`);
  }
}

export function markSuccess(providerWrapper, blockNumber) {
  providerWrapper.failures = 0;
  providerWrapper.lastBlock = blockNumber;
  providerWrapper.healthy = true;
}

export function checkBlockDrift(providers) {
  const healthyProviders = providers.filter(p => p.healthy && p.lastBlock > 0);

  if (healthyProviders.length < 2) return;

  const blocks = healthyProviders.map(p => p.lastBlock);
  const minBlock = Math.min(...blocks);
  const maxBlock = Math.max(...blocks);
  const drift = maxBlock - minBlock;

  if (drift > 5) {
    console.log(`⚠️ RPC DESYNC DETECTED: ${drift} blocks drift between providers`);
  }
}