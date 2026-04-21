import { resolveForgeLocal } from '../config/forge-config.node.js';
import { JsonRpcProvider, Interface, getAddress } from 'ethers';

async function verify() {
  const forge = resolveForgeLocal();

  const provider = new JsonRpcProvider(forge.rpcUrl);

  // ✅ Enforce network identity
  const net = await provider.getNetwork();
  if (Number(net.chainId) !== forge.chainId) {
    throw new Error(`Wrong network: expected ${forge.chainId}, got ${net.chainId}`);
  }

  // ✅ Enforce checksum correctness
  const address = getAddress(forge.address);

  const logs = await provider.getLogs({
    address,
    fromBlock: forge.fromBlock,
    toBlock: "latest",
    topics: [forge.topic]
  });

  console.log(`📊 Guardians: ${logs.length}`);

  const iface = new Interface(forge.abi);

  let decodeFailures = 0;
  for (const log of logs) {
    try {
      iface.parseLog(log);
    } catch {
      decodeFailures++;
    }
  }

  if (decodeFailures > 0) {
    throw new Error(`Schema mismatch: ${decodeFailures} logs failed`);
  }

  console.log("✅ Verified: RPC + Network + Address + Schema");
}

verify();
