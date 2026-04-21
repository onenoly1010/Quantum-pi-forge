/**
 * Universal Forge Manifest Resolver
 * Single source of truth for all execution environments
 */

export async function resolveForge() {
  // Browser runtime
  if (typeof window !== 'undefined') {
    const res = await fetch('/FORGE_REGISTRY_MANIFEST.json');
    if (!res.ok) throw new Error("Manifest load failed");
    const m = await res.json();
    return validateManifest(m);
  }
  
  // Node runtime
  const fs = await import('fs');
  const raw = fs.readFileSync('./FORGE_REGISTRY_MANIFEST.json');
  const m = JSON.parse(raw);
  return validateManifest(m);
}

function validateManifest(m) {
  if (!m.contractAddress || !m.eventTopic || !m.deploymentBlock) {
    throw new Error("Invalid manifest structure");
  }

  return Object.freeze({
    address: m.contractAddress,
    fromBlock: m.deploymentBlock,
    topic: m.eventTopic,
    chainId: m.chainId,
    network: m.network
  });
}

/**
 * Immediate post transaction sync pattern
 * Eliminates polling blind window
 */
export async function afterTransactionSync(tx) {
  const receipt = await tx.wait();
  await syncFromChain();
  return receipt;
}

async function syncFromChain() {
  const forge = await resolveForge();
  
  if (typeof window !== 'undefined' && window.ethereum) {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const logs = await provider.getLogs({
      address: forge.address,
      fromBlock: forge.fromBlock,
      toBlock: "latest",
      topics: [forge.topic]
    });
    
    window.dispatchEvent(new CustomEvent('forge:sync', { detail: { logs } }));
    return logs;
  }
}