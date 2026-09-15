/* Visitor digital counterpart. Keys are machinery; identity is the participant.
   No wallet. No API key. Persistent on this device only. */
(function (global) {
  const STORE = "qpf.counterpart.v0";
  const SCHEMA = "qpf-digital-counterpart/v0";

  function canonical(obj) {
    if (obj === null || typeof obj !== "object") return JSON.stringify(obj);
    if (Array.isArray(obj)) return "[" + obj.map(canonical).join(",") + "]";
    const keys = Object.keys(obj).sort();
    return "{" + keys.map((k) => JSON.stringify(k) + ":" + canonical(obj[k])).join(",") + "}";
  }

  async function sha256Hex(s) {
    const buf = await crypto.subtle.digest("SHA-256", typeof s === "string" ? new TextEncoder().encode(s) : s);
    return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
  }

  function b64(buf) {
    const bytes = buf instanceof ArrayBuffer ? new Uint8Array(buf) : buf;
    let bin = "";
    bytes.forEach((b) => { bin += String.fromCharCode(b); });
    return btoa(bin);
  }
  function unb64(s) {
    const bin = atob(s);
    const out = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return out;
  }

  function load() {
    try { return JSON.parse(localStorage.getItem(STORE) || "null"); } catch { return null; }
  }
  function save(state) {
    localStorage.setItem(STORE, JSON.stringify(state));
  }

  async function generateKey() {
    try {
      return await crypto.subtle.generateKey({ name: "Ed25519" }, true, ["sign", "verify"]);
    } catch {
      return await crypto.subtle.generateKey({ name: "ECDSA", namedCurve: "P-256" }, true, ["sign", "verify"]);
    }
  }

  async function mint() {
    const existing = load();
    if (existing && existing.object && existing.object.object_id) return existing;
    const pair = await generateKey();
    const alg = pair.privateKey.algorithm.name === "Ed25519" ? "ed25519" : "ecdsa-p256";
    const rawPub = await crypto.subtle.exportKey("raw", pair.publicKey);
    const pubB64 = b64(rawPub);
    const did = "did:qpf:web:" + (await sha256Hex(pubB64)).slice(0, 16);
    const created_at = new Date().toISOString().replace(/\.\d+Z$/, "Z");
    const identity = {
      did,
      name: "counterpart",
      created_at,
      algorithm: alg,
      public_key_b64: pubB64,
      version: "qpf-identity/web-v0",
    };
    const stable = {
      schema: SCHEMA,
      identity,
      constitution: {
        allowed_kinds: ["hello_qpf", "inspect_self"],
        denied_by_default: ["mint", "wallet.*", "payment.*", "github.write"],
      },
      classification: {
        participant: "VISITOR_COUNTERPART",
        protocol_mint: "NOT_AUTHORIZED",
        economy: "NOT_LIVE",
      },
    };
    const object_id = "qpfdc0:" + await sha256Hex(canonical(stable));
    const object = { ...stable, object_id };
    const privJwk = await crypto.subtle.exportKey("jwk", pair.privateKey);
    const pubJwk = await crypto.subtle.exportKey("jwk", pair.publicKey);
    const state = { identity, object, privJwk, pubJwk, receipts: [] };
    save(state);
    return state;
  }

  async function importPriv(state) {
    const alg = state.identity.algorithm === "ed25519"
      ? { name: "Ed25519" }
      : { name: "ECDSA", namedCurve: "P-256" };
    return crypto.subtle.importKey("jwk", state.privJwk, alg, true, ["sign"]);
  }

  async function signHello(state) {
    const priv = await importPriv(state);
    const hello = {
      kind: "hello_qpf",
      object_id: state.object.object_id,
      did: state.identity.did,
      statement: "I am a newly minted digital counterpart. I request to meet the QPF counterpart.",
      ts: new Date().toISOString().replace(/\.\d+Z$/, "Z"),
    };
    const bytes = new TextEncoder().encode(canonical(hello));
    const sigAlg = state.identity.algorithm === "ed25519"
      ? { name: "Ed25519" }
      : { name: "ECDSA", hash: "SHA-256" };
    const sig = await crypto.subtle.sign(sigAlg, priv, bytes);
    return { identity: state.identity, object: state.object, hello, signature_b64: b64(sig) };
  }

  function addReceipt(state, receipt) {
    state.receipts = state.receipts || [];
    state.receipts.push(receipt);
    save(state);
  }

  global.QpfCounterpart = { load, mint, signHello, addReceipt, canonical, sha256Hex };
})(window);
