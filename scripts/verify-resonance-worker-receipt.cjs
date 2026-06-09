#!/usr/bin/env node
const fs = require("fs");
const crypto = require("crypto");

const file = process.argv[2];

if (!file) {
  console.error("Usage: node scripts/verify-resonance-worker-receipt.cjs <receipt.json>");
  process.exit(2);
}

function sortDeep(value) {
  if (Array.isArray(value)) {
    return value.map(sortDeep);
  }

  if (value && typeof value === "object") {
    return Object.keys(value)
      .sort()
      .reduce((acc, key) => {
        acc[key] = sortDeep(value[key]);
        return acc;
      }, {});
  }

  return value;
}

let receipt;

try {
  receipt = JSON.parse(fs.readFileSync(file, "utf8"));
} catch (err) {
  console.error("Invalid JSON receipt:");
  console.error(err.message);
  process.exit(1);
}

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

if (!/^[a-f0-9]{64}$/.test(claimed)) {
  console.error(`Invalid sha256 format: ${claimed}`);
  process.exit(1);
}

const clone = { ...receipt };
delete clone.sha256;

const canonical = JSON.stringify(sortDeep(clone), null, 2);
const actual = crypto.createHash("sha256").update(canonical, "utf8").digest("hex");

console.log("Receipt:", file);
console.log("Schema:", receipt.schema);
console.log("Timestamp:", receipt.timestamp_utc);
console.log("Branch:", receipt.branch);
console.log("Commit:", receipt.commit);
console.log("Claimed sha256:", claimed);
console.log("Recomputed sha256:", actual);

if (claimed !== actual) {
  console.error("FAIL: stored sha256 does not match canonical recomputation");
  process.exit(1);
}

console.log("OK: resonance worker receipt verified");
