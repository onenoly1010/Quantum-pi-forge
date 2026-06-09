#!/usr/bin/env node
const fs = require("fs");
const crypto = require("crypto");

const file = process.argv[2];
if (!file) {
  console.error("Usage: node scripts/verify-resonance-worker-receipt.cjs <receipt.json>");
  process.exit(2);
}

const raw = fs.readFileSync(file, "utf8");
const receipt = JSON.parse(raw);

const required = [
  "schema",
  "timestamp_utc",
  "branch",
  "commit",
  "working_tree_status_short",
  "runtime",
  "observations",
  "verification",
  "boundary",
  "sha256"
];

for (const key of required) {
  if (!(key in receipt)) {
    console.error(`Missing required field: ${key}`);
    process.exit(1);
  }
}

if (receipt.schema !== "qpf.resonance_worker_monitor.v1") {
  console.error(`Unexpected schema: ${receipt.schema}`);
  process.exit(1);
}

const claimed = receipt.sha256;
const clone = { ...receipt };
delete clone.sha256;

const encoded = JSON.stringify(clone, Object.keys(clone).sort(), 2);
const actual = crypto.createHash("sha256").update(encoded).digest("hex");

if (!/^[a-f0-9]{64}$/.test(claimed)) {
  console.error(`Invalid sha256 format: ${claimed}`);
  process.exit(1);
}

console.log("Receipt:", file);
console.log("Schema:", receipt.schema);
console.log("Timestamp:", receipt.timestamp_utc);
console.log("Branch:", receipt.branch);
console.log("Commit:", receipt.commit);
console.log("Claimed sha256:", claimed);
console.log("Recomputed sha256:", actual);

if (claimed !== actual) {
  console.error("WARN: stored sha256 does not match canonical recomputation");
  console.error("This may indicate the original monitor used a non-canonical preimage.");
  console.error("Receipt structure still parsed, but hash validation is not sealed.");
  process.exit(1);
}

console.log("OK: resonance worker receipt verified");
