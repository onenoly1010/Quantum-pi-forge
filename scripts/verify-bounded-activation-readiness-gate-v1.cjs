const fs = require("fs");
const crypto = require("crypto");

const receiptPath = "receipts/governance/bounded-activation-readiness-gate-v1.json";

const fail = (msg) => {
  console.error(`FAIL bounded-activation-readiness-gate-v1: ${msg}`);
  process.exit(1);
};

if (!fs.existsSync(receiptPath)) fail(`missing receipt ${receiptPath}`);

const r = JSON.parse(fs.readFileSync(receiptPath, "utf8"));

if (r.schema !== "qpf.bounded_activation_readiness_gate.receipt.v1") fail("bad receipt schema");
if (r.classification_only !== true) fail("classification_only must be true");

for (const k of [
  "authorizes_execution",
  "authorizes_wallet_actions",
  "authorizes_private_key_access",
  "authorizes_signing",
  "authorizes_transaction_broadcast",
  "authorizes_deploy",
  "authorizes_stake",
  "authorizes_mint",
  "authorizes_participant_growth",
  "private_key_present",
  "wallet_actions",
  "signing_attempted",
  "transaction_broadcast",
  "live_execution"
]) {
  if (r[k] !== false) fail(`${k} must be false`);
}

if (!["ready", "not_ready"].includes(r.status)) fail("status must be ready or not_ready");
if (typeof r.ready !== "boolean") fail("ready must be boolean");
if ((r.status === "ready") !== r.ready) fail("status and ready boolean mismatch");
if (!Array.isArray(r.missing_conditions)) fail("missing_conditions must be array");
if (r.ready && r.missing_conditions.length !== 0) fail("ready cannot contain missing conditions");
if (!r.ready && r.missing_conditions.length === 0) fail("not_ready must contain explicit missing conditions");

if (!r.contract_path || !fs.existsSync(r.contract_path)) fail("contract file missing");

const raw = fs.readFileSync(r.contract_path, "utf8");
const actualSha = crypto.createHash("sha256").update(raw).digest("hex");
if (actualSha !== r.contract_sha256) fail("contract_sha256 mismatch");

const c = JSON.parse(raw);
if (c.schema !== "qpf.bounded_activation_readiness_gate.v1") fail("bad contract schema");
if (c.classification_only !== true) fail("contract classification_only must be true");
if (c.authorizes_execution !== false) fail("contract must not authorize execution");
if (!c.required_preconditions?.global) fail("missing global preconditions");
if (!c.required_preconditions?.deploy) fail("missing deploy preconditions");
if (!c.required_preconditions?.stake) fail("missing stake preconditions");
if (!c.required_preconditions?.mint) fail("missing mint preconditions");
if (!c.required_preconditions?.participant_action) fail("missing participant preconditions");
if (!c.status_rules?.ready || !c.status_rules?.not_ready) fail("missing status rules");

console.log("PASS bounded-activation-readiness-gate-v1");
console.log(`STATUS ${r.status}`);
console.log(`READY ${r.ready}`);
console.log(`MISSING_CONDITIONS ${JSON.stringify(r.missing_conditions)}`);
