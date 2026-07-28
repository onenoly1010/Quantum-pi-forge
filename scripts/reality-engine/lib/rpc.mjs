/**
 * Minimal JSON-RPC helpers. Read-only. No signing.
 */
import { createHash } from "node:crypto";

export async function rpcCall(rpcUrl, method, params = [], timeoutMs = 20000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(rpcUrl, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
      signal: ctrl.signal,
    });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status} from RPC`);
    }
    const body = await res.json();
    if (body.error) {
      throw new Error(`RPC ${method}: ${body.error.message || JSON.stringify(body.error)}`);
    }
    return body.result;
  } finally {
    clearTimeout(t);
  }
}

export async function ethChainId(rpcUrl) {
  const hex = await rpcCall(rpcUrl, "eth_chainId");
  return Number.parseInt(hex, 16);
}

export async function ethBlockNumber(rpcUrl) {
  const hex = await rpcCall(rpcUrl, "eth_blockNumber");
  return Number.parseInt(hex, 16);
}

export async function ethGetCode(rpcUrl, address) {
  const code = await rpcCall(rpcUrl, "eth_getCode", [address, "latest"]);
  return code && code !== "0x" ? code : "0x";
}

export async function ethGetBalance(rpcUrl, address) {
  const hex = await rpcCall(rpcUrl, "eth_getBalance", [address, "latest"]);
  return BigInt(hex);
}

export async function ethCall(rpcUrl, to, data) {
  return rpcCall(rpcUrl, "eth_call", [{ to, data }, "latest"]);
}

/** Precomputed selectors via cast sig / keccak */
export const SIG = {
  "owner()": "0x8da5cb5b",
  "getOwners()": "0xa0e67e2b",
  "getThreshold()": "0xe75235b8",
  "nonce()": "0xaffed0e0",
  "OINIO_TOKEN()": "0x27de3446",
  "oinioToken()": "0xdcfb596e",
};

/** Decode address from 32-byte ABI word */
export function decodeAddress(hex) {
  if (!hex || hex === "0x" || hex.length < 66) return null;
  return ("0x" + hex.slice(-40)).toLowerCase();
}

/** Decode uint256 */
export function decodeUint(hex) {
  if (!hex || hex === "0x") return null;
  return BigInt(hex);
}

/**
 * Decode dynamic address[] from ABI encoding (getOwners).
 * Layout: offset, length, addresses...
 */
export function decodeAddressArray(hex) {
  if (!hex || hex === "0x" || hex.length < 2 + 64 * 2) return [];
  const data = hex.startsWith("0x") ? hex.slice(2) : hex;
  const offset = Number(BigInt("0x" + data.slice(0, 64)));
  const lenStart = offset * 2;
  if (lenStart + 64 > data.length) return [];
  const len = Number(BigInt("0x" + data.slice(lenStart, lenStart + 64)));
  const addrs = [];
  let p = lenStart + 64;
  for (let i = 0; i < len; i++) {
    const word = data.slice(p, p + 64);
    if (word.length < 64) break;
    addrs.push(("0x" + word.slice(24)).toLowerCase());
    p += 64;
  }
  return addrs;
}

export function codeMeta(code) {
  const raw = code && code !== "0x" ? code : "0x";
  const bytes = raw === "0x" ? 0 : (raw.length - 2) / 2;
  const hash =
    raw === "0x"
      ? null
      : createHash("sha256").update(Buffer.from(raw.slice(2), "hex")).digest("hex");
  return { has_code: bytes > 0, code_bytes: bytes, code_sha256: hash };
}

export function weiToEthString(wei) {
  const neg = wei < 0n;
  const w = neg ? -wei : wei;
  const base = 10n ** 18n;
  const whole = w / base;
  const frac = (w % base).toString().padStart(18, "0").replace(/0+$/, "");
  const s = frac ? `${whole}.${frac}` : whole.toString();
  return neg ? `-${s}` : s;
}
