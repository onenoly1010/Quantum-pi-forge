const fs = require("fs");
const path = require("path");

const root = process.cwd();
const docPath = path.join(root, "docs/public/PUBLIC_VERIFICATION_DEMO_GATE_V1.md");
const receiptPath = path.join(root, "receipts/public/public-verification-demo-gate-v1.json");

function fail(message) {
  console.error(`FAIL public-verification-demo-gate-v1: ${message}`);
  process.exit(1);
}

if (!fs.existsSync(docPath)) fail("missing public demo gate doc");
if (!fs.existsSync(receiptPath)) fail("missing public demo gate receipt");

const doc = fs.readFileSync(docPath, "utf8");
const receipt = JSON.parse(fs.readFileSync(receiptPath, "utf8"));

const requiredDocStrings = [
  "STATUS: REVIEWER_SAFE_DEMO",
  "MODE: DRY_RUN_ONLY",
  "CHAIN_ID: 16661",
  "PUBLIC_VERIFICATION_DEMO_GATE_V1=PASS",
  "NETWORK_CHECKED=true",
  "ARTIFACT_REPLAY_VERIFIED=true",
  "UPLOAD_ATTEMPTED=false",
  "TRANSACTION_BROADCAST=false",
  "PRIVATE_KEY_PRESENT=false",
  "LIVE_EXECUTION=false",
  "REVIEWER_SAFE=true",
  "npm run public:verification-demo:v1"
];

for (const expected of requiredDocStrings) {
  if (!doc.includes(expected)) fail(`doc missing ${expected}`);
}

const requiredReceipt = {
  gate: "PUBLIC_VERIFICATION_DEMO_GATE_V1",
  status: "PASS",
  mode: "DRY_RUN_ONLY",
  network: "0G Aristotle Mainnet",
  chain_id: 16661,
  network_checked: true,
  artifact_replay_verified: true,
  upload_attempted: false,
  transaction_broadcast: false,
  private_key_present: false,
  live_execution: false,
  reviewer_safe: true,
  wallet_use_authorized: false,
  funding_authorized: false,
  staking_authorized: false,
  approval_authorized: false,
  liquidity_authorized: false,
  deployment_authorized: false,
  operational_activation_authorized: false
};

for (const [key, value] of Object.entries(requiredReceipt)) {
  if (receipt[key] !== value) fail(`receipt ${key} expected ${value} got ${receipt[key]}`);
}

if (process.env.PRIVATE_KEY || process.env.WALLET_PRIVATE_KEY || process.env.DEPLOYER_PRIVATE_KEY) {
  fail("private key environment variable is present");
}

console.log("PUBLIC_VERIFICATION_DEMO_GATE_V1=PASS");
console.log("NETWORK_CHECKED=true");
console.log("ARTIFACT_REPLAY_VERIFIED=true");
console.log("UPLOAD_ATTEMPTED=false");
console.log("TRANSACTION_BROADCAST=false");
console.log("PRIVATE_KEY_PRESENT=false");
console.log("LIVE_EXECUTION=false");
console.log("REVIEWER_SAFE=true");
