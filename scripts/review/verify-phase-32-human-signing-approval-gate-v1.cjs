#!/usr/bin/env node
const fs = require("fs");
const crypto = require("crypto");
const { execSync } = require("child_process");

const GATE = "receipts/governance/phase-32-explicit-human-signing-approval-gate-v1.json";
const REQUEST = "receipts/governance/public-mint-human-signing-approval-request-v1.json";
const INSPECTION = "receipts/governance/public-mint-wallet-prompt-inspection-v1.json";

const fail = (msg) => {
  console.error("FAIL phase-32-human-signing-approval-gate-v1: " + msg);
  process.exit(1);
};

for (const path of [GATE, REQUEST, INSPECTION]) {
  if (!fs.existsSync(path)) fail("missing file: " + path);
}

const gate = JSON.parse(fs.readFileSync(GATE, "utf8"));
const request = JSON.parse(fs.readFileSync(REQUEST, "utf8"));
const inspection = JSON.parse(fs.readFileSync(INSPECTION, "utf8"));

if (request.status !== "PENDING_KRIS_EXPLICIT_APPROVAL") {
  fail("approval request must remain pending until Kris explicitly approves");
}

if (request.kris_approval?.approved !== false) {
  fail("kris_approval.approved must be false");
}

if (gate.decision_outcome !== "NO_GO_SIGNING_NOT_AUTHORIZED") {
  fail("gate must remain NO_GO until Kris explicit approval is recorded separately");
}

const prompt = request.exact_prompt_to_approve;
if (prompt.chain_id !== 16661) fail("chainId must be 16661");
if (prompt.prompt_1.contract !== "0x75995EC0fdf881189850aeD864cB3f43c0DFCb58") fail("prompt 1 contract mismatch");
if (prompt.prompt_2.contract !== "0x67aD7169184581f23D1E10B39d4eb4e98293E87a") fail("prompt 2 contract mismatch");
if (prompt.prompt_1.function !== "approve(address,uint256)") fail("prompt 1 function mismatch");
if (prompt.prompt_2.function !== "registerModel(string,string,uint256)") fail("prompt 2 function mismatch");

for (const key of [
  "signing",
  "broadcast",
  "public_mint_execution",
  "wallet_actions",
  "automatic_approval",
  "wallet_prompt_triggered",
]) {
  if (request.execution_boundaries?.[key] !== false) {
    fail("request.execution_boundaries." + key + " must be false");
  }
  if (gate.execution_boundaries?.[key] !== false && key !== "automatic_approval") {
    if (gate.execution_boundaries?.[key] !== false) {
      fail("gate.execution_boundaries." + key + " must be false");
    }
  }
}

if (gate.execution_boundaries?.kris_explicit_yes_recorded !== false) {
  fail("kris_explicit_yes_recorded must be false");
}

if (gate.execution_boundaries?.automatic_wallet_signing_approval !== false) {
  fail("automatic_wallet_signing_approval must be false");
}

execSync("npm run governance:human-wallet-prompt-inspection:v1:check", { stdio: "inherit" });

const inspectionCanonical = JSON.stringify(
  { wallet_prompt_sequence: inspection.wallet_prompt_sequence, network: inspection.network },
  null,
  2
);
const promptFingerprint = crypto.createHash("sha256").update(inspectionCanonical).digest("hex");

console.log("PASS phase-32-human-signing-approval-gate-v1");
console.log("OUTCOME NO_GO_SIGNING_NOT_AUTHORIZED");
console.log("KRIS_EXPLICIT_APPROVAL false");
console.log("PROMPT_FINGERPRINT " + promptFingerprint);
console.log("SIGNING false");
console.log("BROADCAST false");
console.log("RULE " + gate.live_action_rule);