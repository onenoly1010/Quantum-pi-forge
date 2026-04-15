import { IncrementalVerifier } from "../pkg/incremental/svl_wasm";
import { ProofWindowCache } from "./cache/proof-window";
import { StreamingRPCFetcher } from "./streaming-rpc-fetcher";

export async function adjudicateStreaming(env: any, address: string) {
  const cache = new ProofWindowCache(env.KV, env.R2);
  
  // 1. Get current canonical head from DO
  const head = await env.CIRCUIT_DO.get("global").then(stub => stub.fetch("/state"));
  const currentRoot = head.stateRoot;
  
  // 2. Check if we have a cached window for this root
  let verifier: IncrementalVerifier;
  const cachedWindow = await cache.getWindow(currentRoot);
  
  if (cachedWindow) {
    verifier = IncrementalVerifier.new(cachedWindow.root);
    for (const node of cachedWindow.nodes) {
      verifier.apply_delta(new Uint8Array(Buffer.from(node, "hex")), new Uint8Array());
    }
  } else {
    verifier = IncrementalVerifier.new(currentRoot);
  }
  
  // 3. Stream proof from RPC and verify incrementally
  const fetcher = new StreamingRPCFetcher(env.RPC_URL);
  let proofBuffer = new Uint8Array();
  
  for await (const chunk of fetcher.streamProofs(currentRoot, address)) {
    proofBuffer = concatUint8Arrays(proofBuffer, chunk);
    // Try to parse and verify incremental pieces
    if (isCompleteProofSegment(proofBuffer)) {
      const valid = verifier.apply_delta(proofBuffer.slice(0, 32), proofBuffer.slice(32));
      if (!valid) {
        // Immediately reject; circuit breaker gets failure
        await env.CIRCUIT_DO.get("global").fetch("/failure");
        return { status: "rejected", reason: "incremental proof failed" };
      }
      proofBuffer = new Uint8Array(); // reset for next segment
    }
  }
  
  // 4. Finalize and cache the updated window
  const finalRoot = verifier.finalize_root(currentRoot);
  await cache.setWindow(currentRoot, {
    root: currentRoot,
    nodes: verifier.window,
    verified: true,
    lastUpdated: Date.now()
  });
  
  return { status: "verified", method: "streaming-incremental" };
}

function concatUint8Arrays(a: Uint8Array, b: Uint8Array): Uint8Array {
  const result = new Uint8Array(a.length + b.length);
  result.set(a, 0);
  result.set(b, a.length);
  return result;
}

function isCompleteProofSegment(buffer: Uint8Array): boolean {
  return buffer.length >= 64;
}