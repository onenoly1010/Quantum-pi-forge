import { resolveForgeLocal } from '../config/forge-config.node.js';
import { JsonRpcProvider } from 'ethers';

async function verify() {
  const forge = resolveForgeLocal();

  const provider = new JsonRpcProvider("https://evmrpc-testnet.0g.ai");

  const logs = await provider.getLogs({
    address: forge.address,
    fromBlock: forge.fromBlock,
    toBlock: "latest",
    topics: [forge.topic]
  });

  console.log(`📊 Guardians: ${logs.length}`);

  if (logs.length === 0) {
    throw new Error("System not initialized");
  }

  console.log("✅ System verified");
}

verify();