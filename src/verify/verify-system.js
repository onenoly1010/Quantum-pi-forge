import { resolveForgeLocal } from '../config/forge-config.node.js';
import { JsonRpcProvider, Interface } from 'ethers';

async function verify() {
  const forge = resolveForgeLocal();

  const provider = new JsonRpcProvider(forge.rpcUrl);

  const logs = await provider.getLogs({
    address: forge.address.toLowerCase(),
    fromBlock: forge.fromBlock,
    toBlock: "latest",
    topics: [forge.topic]
  });

  console.log(`📊 Guardians: ${logs.length}`);

  if (logs.length === 0) {
    throw new Error("System not initialized");
  }

  // Verify event schema integrity
  const iface = new Interface(forge.abi);
  let decodeFailures = 0;

  for (const log of logs) {
    try {
      iface.parseLog(log);
    } catch (e) {
      decodeFailures++;
    }
  }

  if (decodeFailures > 0) {
    throw new Error(`Event schema mismatch: ${decodeFailures} logs failed to decode`);
  }

  console.log("✅ System verified | RPC: ok | Schema: ok");
}

verify();
