const fs = require("fs");

const receiptPath = "receipts/governance/v2-scope-definition.json";
const docPath = "docs/governance/V2_SCOPE_DEFINITION.md";

function fail(message) {
  console.error(`FAIL v2-scope-definition: ${message}`);
  process.exit(1);
}

if (!fs.existsSync(receiptPath) || !fs.existsSync(docPath)) {
  fail("missing required v2 scope definition artifacts");
}

const receipt = JSON.parse(fs.readFileSync(receiptPath, "utf8"));
if (receipt.governance_version !== "v2") fail("governance_version signature must be v2");
if (receipt.posture.v1_cycle_closed !== true) fail("v1_cycle_closed assertion conflict");
if (receipt.posture.v2_execution_authorized !== false) fail("safety breach: v2 execution prematurely authorized");

console.log("PASS v2-scope-definition");
