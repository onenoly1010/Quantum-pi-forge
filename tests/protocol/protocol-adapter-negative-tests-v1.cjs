const fs = require("fs");
const path = require("path");

const receiptPath = path.join("receipts", "protocol", "protocol-adapter-negative-tests-v1.json");

function classify(intent) {
  const blocked = [];
  if (intent.execution_requested === true) blocked.push("execution_requested");
  if (intent.signing_requested === true) blocked.push("signing_requested");
  if (intent.rpc_mutation_requested === true) blocked.push("rpc_mutation_requested");
  if (intent.deployment_requested === true) blocked.push("deployment_requested");
  if (intent.funding_requested === true) blocked.push("funding_requested");
  if (intent.liquidity_requested === true) blocked.push("liquidity_requested");
  if (intent.private_key_required === true) blocked.push("private_key_required");
  return {
    accepted: blocked.length === 0,
    blocked_reasons: blocked
  };
}

const cases = [
  { name: "reject-execution", execution_requested: true },
  { name: "reject-signing", signing_requested: true },
  { name: "reject-rpc-mutation", rpc_mutation_requested: true },
  { name: "reject-deployment", deployment_requested: true },
  { name: "reject-funding", funding_requested: true },
  { name: "reject-liquidity", liquidity_requested: true },
  { name: "reject-private-key", private_key_required: true },
  { name: "allow-pure-dry-run", execution_requested: false }
];

const results = cases.map((testCase) => ({
  name: testCase.name,
  intent: testCase,
  result: classify(testCase)
}));

for (const item of results) {
  if (item.name === "allow-pure-dry-run") {
    if (item.result.accepted !== true) {
      console.error("FAIL protocol-adapter-negative-tests-v1:", item.name, "should be accepted");
      process.exit(1);
    }
  } else {
    if (item.result.accepted !== false) {
      console.error("FAIL protocol-adapter-negative-tests-v1:", item.name, "should be rejected");
      process.exit(1);
    }
    if (item.result.blocked_reasons.length < 1) {
      console.error("FAIL protocol-adapter-negative-tests-v1:", item.name, "missing blocked reason");
      process.exit(1);
    }
  }
}

const receipt = {
  receipt: "protocol-adapter-negative-tests-v1",
  mode: "DRY_RUN_ONLY",
  total_cases: results.length,
  rejected_cases: results.filter((item) => item.result.accepted === false).length,
  accepted_cases: results.filter((item) => item.result.accepted === true).length,
  live_execution_authorized: false,
  signing_authorized: false,
  rpc_mutation_authorized: false,
  deployment_authorized: false,
  funding_authorized: false,
  liquidity_authorized: false,
  results
};

fs.mkdirSync(path.dirname(receiptPath), { recursive: true });
fs.writeFileSync(receiptPath, JSON.stringify(receipt, null, 2) + "\n");
console.log("PASS protocol-adapter-negative-tests-v1");
