/**
 * Headless QPF birth protocol. No website dependency.
 * Does not invent contract methods. Does not mint, LP, or grant economic authority.
 */
export const PROTOCOL = "qpf-birth";
export const PROTOCOL_VERSION = "v1";
export const CHAIN_ID = 16661;
export const RPC = "https://evmrpc.0g.ai";

export const STATES = [
  "IDLE", "AUTH_REQUIRED", "AUTHORIZED", "CREATING", "IDENTITY_CREATED",
  "ATTESTING", "MAINNET_PENDING", "VERIFIED", "READY", "INTERACTING",
  "AUTH_FAILED", "CREATION_FAILED", "ATTESTATION_FAILED", "MAINNET_FAILED", "VERIFICATION_FAILED",
];

export const BOUNDARIES = {
  economic_authority: false,
  autonomous_execution: false,
  network_authority: false,
};

export function canonical(obj) {
  if (obj === null || typeof obj !== "object") return JSON.stringify(obj);
  if (Array.isArray(obj)) return "[" + obj.map(canonical).join(",") + "]";
  const keys = Object.keys(obj).sort();
  return "{" + keys.map((k) => JSON.stringify(k) + ":" + canonical(obj[k])).join(",") + "}";
}

export async function sha256Hex(s) {
  const buf = await crypto.subtle.digest("SHA-256", typeof s === "string" ? new TextEncoder().encode(s) : s);
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function hmacHex(secret, msg) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(msg));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function b64url(bytes) {
  let bin = "";
  const arr = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  arr.forEach((b) => { bin += String.fromCharCode(b); });
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

export function fromB64url(s) {
  const pad = s.length % 4 === 0 ? "" : "=".repeat(4 - (s.length % 4));
  const bin = atob(s.replace(/-/g, "+").replace(/_/g, "/") + pad);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

export async function issueChallenge(secret) {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  const challenge = b64url(bytes);
  const issued_at = Date.now();
  const mac = await hmacHex(secret, `challenge:${challenge}:${issued_at}`);
  return { state: "AUTH_REQUIRED", challenge, issued_at, mac, expires_in_ms: 300000 };
}

export async function verifyChallenge(secret, { challenge, issued_at, mac }) {
  if (!challenge || !issued_at || !mac) return false;
  if (Date.now() - Number(issued_at) > 300000) return false;
  const expect = await hmacHex(secret, `challenge:${challenge}:${issued_at}`);
  return expect === mac;
}

export async function createIdentity() {
  const pair = await crypto.subtle.generateKey({ name: "Ed25519" }, true, ["sign", "verify"]);
  const rawPub = await crypto.subtle.exportKey("raw", pair.publicKey);
  const pubB64 = btoa(String.fromCharCode(...new Uint8Array(rawPub)));
  // Private key is intentionally NOT exported: no party retains it.
  // Sessions authenticate via HMAC record_mac over the public record.
  const created_at = new Date().toISOString().replace(/\.\d+Z$/, "Z");
  const identity_id = "qpfdc0:" + await sha256Hex(canonical({
    protocol: PROTOCOL,
    protocol_version: PROTOCOL_VERSION,
    public_key: pubB64,
    key_algorithm: "ed25519",
    created_at,
  }));
  return {
    identity: {
      identity_id,
      public_key: pubB64,
      key_algorithm: "ed25519",
      created_at,
    },
    privJwk: undefined, // retired: private key never leaves keypair; kept as field for shape compat
  };
}

export async function buildManifest({ authorization_commitment, identity, protocol_commit }) {
  const initial_state = {
    memory_commitment: await sha256Hex("qpf-birth:memory:empty:" + identity.identity_id),
    configuration_commitment: await sha256Hex(canonical({ boundaries: BOUNDARIES, protocol: PROTOCOL })),
  };
  const unsigned = {
    protocol: PROTOCOL,
    protocol_version: PROTOCOL_VERSION,
    human_authorization: { authorization_commitment, method: "webauthn" },
    ai_identity: identity,
    initial_state,
    boundaries: { ...BOUNDARIES },
    provenance: { protocol_commit: protocol_commit || "unknown" },
    attestation: { chain_id: CHAIN_ID },
  };
  const birth_manifest_hash = await sha256Hex(canonical(unsigned));
  const birth_id = "qpfb0:" + birth_manifest_hash;
  unsigned.birth_id = birth_id;
  unsigned.provenance.birth_manifest_hash = birth_manifest_hash;
  unsigned.attestation.payload_hash = birth_manifest_hash;
  return unsigned;
}

export function publicRecord(record) {
  const copy = JSON.parse(JSON.stringify(record));
  delete copy.ai_secret_jwk;
  return copy;
}

export function canMeet(state) {
  return state === "VERIFIED" || state === "READY" || state === "INTERACTING";
}
