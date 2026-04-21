export async function resolveForge() {
  const res = await fetch('/FORGE_REGISTRY_MANIFEST.json');
  if (!res.ok) throw new Error("Manifest load failed");

  const m = await res.json();

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
