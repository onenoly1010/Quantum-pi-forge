import { verifyWithWASM } from "./wasm-loader";
import { EdgeProofCache } from "./cache/edge-proof-cache";

export async function adjudicateStateWASM(env: any, input: any) {
  const cache = new EdgeProofCache(env.KV);
  const cacheKey = `${input.stateRoot}:${input.path}`;

  const cached = await cache.get(cacheKey);
  if (cached) return JSON.parse(cached);

  const valid = await verifyWithWASM(
    input.stateRoot,
    input.path,
    input.value,
    input.proof
  );

  const result = {
    status: valid ? "verified" : "rejected",
    source: "wasm-svl",
    timestamp: Date.now()
  };

  await cache.set(cacheKey, result, 60);

  return result;
}