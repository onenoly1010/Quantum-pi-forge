import fs from 'fs';

export function resolveForgeLocal() {
  const raw = fs.readFileSync('./public/FORGE_REGISTRY_MANIFEST.json');
  const m = JSON.parse(raw);

  return {
    schemaVersion: m.schemaVersion,
    address: m.contractAddress,
    fromBlock: m.deploymentBlock,
    topic: m.eventTopic,
    chainId: m.chainId,
    rpcUrl: m.rpcUrl,
    abi: m.abi
  };
}
