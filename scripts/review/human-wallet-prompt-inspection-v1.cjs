#!/usr/bin/env node
const fs = require("fs");

const SHEET = "receipts/governance/public-mint-wallet-prompt-inspection-v1.json";

const fail = (msg) => {
  console.error("FAIL human-wallet-prompt-inspection-v1: " + msg);
  process.exit(1);
};

if (!fs.existsSync(SHEET)) fail("missing inspection sheet: " + SHEET);

const sheet = JSON.parse(fs.readFileSync(SHEET, "utf8"));

if (sheet.status !== "INSPECTION_ONLY_NO_WALLET_PROMPT_TRIGGERED") {
  fail("inspection sheet must remain inspection-only");
}

if (sheet.network?.chain_id !== 16661) fail("chainId must be 16661");
if (sheet.network?.name !== "0G Aristotle Mainnet") fail("network must be 0G Aristotle Mainnet");

for (const key of [
  "signing",
  "broadcast",
  "public_mint_execution",
  "wallet_actions",
  "wallet_prompt",
  "wallet_prompt_triggered",
  "automatic_wallet_signing_approval",
]) {
  if (sheet.execution_boundaries?.[key] !== false) {
    fail("execution_boundaries." + key + " must be false");
  }
}

if (sheet.human_approval?.currently_authorized !== false) {
  fail("human approval must not be pre-authorized");
}

console.log("=== PUBLIC MINT WALLET PROMPT INSPECTION (Kris review only) ===");
console.log("");
console.log("NETWORK: " + sheet.network.name + " (chainId " + sheet.network.chain_id + ")");
console.log("RULE: " + sheet.human_approval.rule);
console.log("");

for (const prompt of sheet.wallet_prompt_sequence) {
  console.log("--- Prompt " + prompt.prompt_number + " ---");
  console.log("Summary: " + prompt.user_facing_summary);
  console.log("Contract: " + prompt.contract_address + " (" + prompt.contract_name + ")");
  console.log("Function: " + prompt.function + " " + prompt.signature);
  console.log("Selector: " + prompt.selector);
  console.log("Args: " + JSON.stringify(prompt.args));
  console.log("Native value: " + prompt.native_value);
  if (prompt.minter_recipient) console.log("Minter/recipient: " + prompt.minter_recipient);
  if (prompt.minter_note) console.log("Note: " + prompt.minter_note);
  if (prompt.recipient_note) console.log("Note: " + prompt.recipient_note);
  console.log("");
}

console.log("EXPECTED VALUE:");
console.log(JSON.stringify(sheet.expected_value, null, 2));
console.log("");
console.log("GAS INSPECTION:");
console.log(JSON.stringify(sheet.gas_inspection, null, 2));
console.log("");
console.log("ABORT CONDITIONS:");
for (const item of sheet.abort_conditions) console.log("- " + item);
console.log("");
console.log("PASS human-wallet-prompt-inspection-v1");
console.log("MODE inspection_only_no_wallet_prompt");
console.log("SIGNING false");
console.log("BROADCAST false");
console.log("HUMAN_APPROVAL_AUTHORIZED false");