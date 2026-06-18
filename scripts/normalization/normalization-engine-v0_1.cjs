const crypto = require("crypto");

const ALLOWED_KINDS = new Set([
  "sovereign_claim",
  "resonance_oracle_io",
  "evidence_receipt",
  "gate_state_transition",
  "qualia_fragment_minimal"
]);

const UNSAFE_FIELDS = [
  "private_key",
  "mnemonic",
  "signing_requested",
  "execution_requested",
  "rpc_mutation_requested",
  "deployment_requested",
  "funding_requested",
  "liquidity_requested",
  "wallet_action_requested"
];

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function canonicalize(value) {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (isPlainObject(value)) {
    return Object.keys(value).sort().reduce((acc, key) => {
      acc[key] = canonicalize(value[key]);
      return acc;
    }, {});
  }
  return value;
}

function canonicalString(value) {
  return JSON.stringify(canonicalize(value));
}

function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function findUnsafeFields(value, prefix = "") {
  const found = [];
  if (!isPlainObject(value) && !Array.isArray(value)) return found;
  if (Array.isArray(value)) {
    value.forEach((item, index) => {
      found.push(...findUnsafeFields(item, `${prefix}[${index}]`));
    });
    return found;
  }
  for (const [key, child] of Object.entries(value)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (UNSAFE_FIELDS.includes(key) && child === true) found.push(path);
    if (key === "private_key" || key === "mnemonic") found.push(path);
    found.push(...findUnsafeFields(child, path));
  }
  return found;
}

function normalize(raw) {
  const reasons = [];
  if (!isPlainObject(raw)) reasons.push("input_not_plain_object");
  if (isPlainObject(raw) && !ALLOWED_KINDS.has(raw.kind)) reasons.push("unsupported_kind");
  if (isPlainObject(raw) && raw.version !== "v0.1") reasons.push("version_mismatch");
  if (isPlainObject(raw) && !isPlainObject(raw.payload)) reasons.push("payload_not_plain_object");
  const unsafeFields = isPlainObject(raw) ? findUnsafeFields(raw) : [];
  if (unsafeFields.length > 0) reasons.push("unsafe_fields:" + unsafeFields.join(","));

  if (reasons.length > 0) {
    return {
      accepted: false,
      quarantine: true,
      reasons,
      normalized: null,
      canonical_hash: null
    };
  }

  const normalized = {
    kind: raw.kind,
    version: raw.version,
    payload: canonicalize(raw.payload),
    normalization: {
      engine: "normalization-engine-v0.1",
      mode: "LOCAL_DRY_RUN_ONLY",
      rpc_mutation_attempted: false,
      signing_attempted: false,
      deployment_attempted: false,
      funding_attempted: false,
      liquidity_attempted: false
    }
  };

  const canonical = canonicalString(normalized);
  return {
    accepted: true,
    quarantine: false,
    reasons: [],
    normalized,
    canonical_hash: sha256(canonical)
  };
}

module.exports = {
  normalize,
  canonicalize,
  canonicalString,
  sha256,
  ALLOWED_KINDS,
  UNSAFE_FIELDS
};
