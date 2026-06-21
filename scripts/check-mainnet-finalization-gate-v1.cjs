const fs = require("fs");

const file = "docs/governance/MAINNET_FINALIZATION_GATE_V1.md";
const doc = fs.readFileSync(file, "utf8");

const required = [
  "Mainnet Finalization Gate v1",
  "classification-only",
  "WALLET_ACTIONS=false",
  "PRIVATE_KEY_REQUESTED=false",
  "DEPLOY_ATTEMPTED=false",
  "STAKE_ATTEMPTED=false",
  "MINT_ATTEMPTED=false",
  "TRANSACTION_BROADCAST=false",
  "PARTICIPANT_GROWTH_LOOP_STARTED=false",
  "VERIFIED_ONCHAIN",
  "STALE_DOC_CLAIM",
  "MISSING_DEPLOYMENT",
  "BLOCKED_BY_GOVERNANCE",
  "READY_FOR_OPERATOR_APPROVAL",
  "1.5% drip system",
  "real, consenting participants"
];

for (const item of required) {
  if (!doc.includes(item)) {
    throw new Error(`Missing required gate text: ${item}`);
  }
}

const forbidden = [
  "WALLET_ACTIONS=true",
  "PRIVATE_KEY_REQUESTED=true",
  "DEPLOY_ATTEMPTED=true",
  "STAKE_ATTEMPTED=true",
  "MINT_ATTEMPTED=true",
  "TRANSACTION_BROADCAST=true",
  "PARTICIPANT_GROWTH_LOOP_STARTED=true"
];

for (const item of forbidden) {
  if (doc.includes(item)) {
    throw new Error(`Forbidden live assertion present: ${item}`);
  }
}

console.log("PASS mainnet-finalization-gate-v1");
