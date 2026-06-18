const fs = require("fs");
const path = require("path");
const { normalize } = require("../../scripts/normalization/normalization-engine-v0_1.cjs");

const receiptPath = path.join("receipts", "normalization", "normalization-engine-v0_1-tests.json");

const cases = [
  {
    name: "accept-sovereign-claim",
    input: { kind: "sovereign_claim", version: "v0.1", payload: { claim: "local-only declaration", steward: "OINIO" } },
    accepted: true
  },
  {
    name: "accept-resonance-oracle-io",
    input: { kind: "resonance_oracle_io", version: "v0.1", payload: { input: "signal", output: "coherent" } },
    accepted: true
  },
  {
    name: "accept-evidence-receipt",
    input: { kind: "evidence_receipt", version: "v0.1", payload: { receipt: "test", pass: true } },
    accepted: true
  },
  {
    name: "accept-gate-state-transition",
    input: { kind: "gate_state_transition", version: "v0.1", payload: { from: "CLOSED", to: "ACTIVE_DEVELOPMENT" } },
    accepted: true
  },
  {
    name: "accept-qualia-fragment-minimal",
    input: { kind: "qualia_fragment_minimal", version: "v0.1", payload: { fragment: "minimal", source: "local" } },
    accepted: true
  },
  {
    name: "reject-unsupported-kind",
    input: { kind: "unknown", version: "v0.1", payload: {} },
    accepted: false
  },
  {
    name: "reject-version-mismatch",
    input: { kind: "sovereign_claim", version: "v9.9", payload: {} },
    accepted: false
  },
  {
    name: "reject-unsafe-signing",
    input: { kind: "evidence_receipt", version: "v0.1", payload: { signing_requested: true } },
    accepted: false
  },
  {
    name: "reject-private-key",
    input: { kind: "evidence_receipt", version: "v0.1", payload: { private_key: "blocked" } },
    accepted: false
  }
];

const results = cases.map((item) => {
  const result = normalize(item.input);
  if (result.accepted !== item.accepted) {
    console.error("FAIL normalization-engine-v0.1:", item.name);
    console.error(JSON.stringify(result, null, 2));
    process.exit(1);
  }
  if (item.accepted && !result.canonical_hash) {
    console.error("FAIL normalization-engine-v0.1:", item.name, "missing canonical hash");
    process.exit(1);
  }
  if (!item.accepted && result.quarantine !== true) {
    console.error("FAIL normalization-engine-v0.1:", item.name, "must quarantine");
    process.exit(1);
  }
  return { name: item.name, accepted: result.accepted, quarantine: result.quarantine, reasons: result.reasons, canonical_hash: result.canonical_hash };
});

const receipt = {
  receipt: "normalization-engine-v0.1-tests",
  mode: "LOCAL_DRY_RUN_ONLY",
  total_cases: results.length,
  accepted_cases: results.filter((item) => item.accepted).length,
  quarantined_cases: results.filter((item) => item.quarantine).length,
  rpc_mutation_attempted: false,
  signing_attempted: false,
  deployment_attempted: false,
  funding_attempted: false,
  liquidity_attempted: false,
  results
};

fs.mkdirSync(path.dirname(receiptPath), { recursive: true });
fs.writeFileSync(receiptPath, JSON.stringify(receipt, null, 2) + "\n");
console.log("PASS normalization-engine-v0.1-tests");
