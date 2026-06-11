const fs = require("fs");

function fail(message) {
  console.error("FAIL public-status-v1:", message);
  process.exit(1);
}

if (!fs.existsSync("STATUS.md")) fail("missing STATUS.md");
if (!fs.existsSync("AUDIT.md")) fail("missing AUDIT.md");
if (!fs.existsSync("README.md")) fail("missing README.md");

const status = fs.readFileSync("STATUS.md", "utf8");

const required = [
  "Parked. Locally auditable. Non-executing.",
  "eb73032",
  "[AUDIT.md](./AUDIT.md)",
  "npm run audit:full-local",
  "mainnet_cutover_approval_granted = false",
  "mainnet_cutover_executed = false",
  "deployment_executed = false",
  "broadcast_executed = false",
  "state_changing_transaction_executed = false",
  "Hosted CI success is not claimed as canonical proof",
  "not production readiness"
];

for (const needle of required) {
  if (!status.includes(needle)) fail(`STATUS.md missing: ${needle}`);
}

console.log("PASS public-status-v1");
