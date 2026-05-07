import { ProviderManager } from "./providerManager.js";
import { CONFIG } from "./config.js";
import { validateEvent, writeAuditLog } from "./pipeline.js";

export function startListener() {
  console.log(`✅ Quantum Pi Forge Audit Listener starting`);
  console.log(`🔍 Monitoring DEX contract: ${CONFIG.DEX_CONTRACT}`);
  console.log(`📋 Audit log: ${CONFIG.LOG_FILE}`);
  console.log("---------------------------------------------------");

  const manager = new ProviderManager();

  function createSubscription(providerWrapper) {
    const provider = providerWrapper.provider;
    const filter = { address: CONFIG.DEX_CONTRACT };

    console.log(`📡 Subscribing to events on RPC ${providerWrapper.id}`);

    provider.on(filter, async (log) => {
      try {
        const decoded = {
          module: "DEX",
          event: log.fragment?.name || "Unknown",
          args: log.args,
          tx: log.transactionHash,
          block: log.blockNumber,
          logIndex: log.index
        };

        console.log(`📦 Block ${decoded.block} | ${decoded.event} | ${decoded.tx.substring(0,18)}...`);

        const validationResult = validateEvent(decoded);

        writeAuditLog(validationResult);
        manager.handleSuccess(providerWrapper, log.blockNumber);

        if (validationResult.status === "PASS") {
          console.log(`  ✅ PASS`);
        } else if (validationResult.status === "FAIL") {
          console.log(`  ❌ FAIL: ${JSON.stringify(validationResult.violations)}`);
        } else {
          console.log(`  ⚠️  INVALID`);
        }

      } catch (err) {
        console.error(`Log processing error: ${err.message}`);
        manager.handleFailure(providerWrapper);
      }
    });

    provider.on("block", (blockNumber) => {
      manager.handleSuccess(providerWrapper, blockNumber);
    });

    provider.on("error", () => {
      manager.handleFailure(providerWrapper);
    });

    return provider;
  }

  manager.setSubscription(createSubscription);
}
