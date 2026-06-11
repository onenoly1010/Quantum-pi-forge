#!/usr/bin/env node
const fs = require("fs");

function fail(msg) {
  console.error("FAIL supervised-activation-runbook-v1: " + msg);
  process.exit(1);
}

const docPath = "docs/supervised-activation-runbook-v1.md";
const receiptPath = "receipts/autonomous/supervised-activation-runbook-v1.json";

if (!fs.existsSync(docPath)) fail("missing runbook");
if (!fs.existsSync(receiptPath)) fail("missing receipt");

const doc = fs.readFileSync(docPath, "utf8");
const receipt = JSON.parse(fs.readFileSync(receiptPath, "utf8"));

const required = [
  "Governed dry-run procedure.",
  "It does not grant new autonomous capability.",
  "It does not authorize live execution.",
  "It does not authorize wallet mutation.",
  "It does not authorize network mutation.",
  "It does not remove the operator intent gate.",
  "supervised_activation_mode == dry-run-only",
  "operator_intent_required == true",
  "activation_mode == dry-run-only",
  "network_mutation_allowed == false",
  "wallet_mutation_allowed == false",
  "unsupervised_execution_allowed == false",
  "npm run autonomous:supervised-activation:v1:check",
  "npm run autonomous:supervised-activation-runtime-hygiene:v1:check",
  "npm run autonomous:supervised-activation-refusal-tests:v1:check",
  "npm run autonomous:supervised-activation-readiness-index:v1:check",
  "npm run autonomous:supervised-activation:v1",
  "receipt_path_is_runtime_ignored == true",
  "receipt_is_dry_run_only == true",
  "operator_intent_recorded == true",
  "no_wallet_mutation_occurred == true",
  "no_network_mutation_occurred == true",
  "no_unsupervised_loop_started == true",
  "operator_intent_missing == true",
  "requested_mode_is_live == true",
  "requested_wallet_mutation == true",
  "requested_network_mutation == true",
  "requested_unsupervised_loop == true",
  "governance_chain_not_green == true",
  "A refusal is a valid safety outcome.",
  "does_not_claim_live_execution == true",
  "does_not_expand_activation_authority == true",
  "no_new_autonomous_capability == true",
  "no_live_execution_authorized == true",
  "no_wallet_mutation_authorized == true",
  "no_network_mutation_authorized == true"
];

for (const fragment of required) {
  if (!doc.includes(fragment)) fail("missing required text: " + fragment);
}

const expected = {
  receipt: "supervised-activation-runbook-v1",
  status: "sealed",
  scope: "documentation-verifier-receipt-only",
  activation_mode: "dry-run-only",
  operator_intent_required: true,
  live_execution_authorized: false,
  wallet_mutation_authorized: false,
  network_mutation_authorized: false,
  unsupervised_execution_authorized: false,
  runtime_receipts_ignored_by_git: true,
  historical_receipts_preserved: true,
  refusal_cases_documented: true,
  no_new_autonomous_capability: true
};

for (const [key, value] of Object.entries(expected)) {
  if (receipt[key] !== value) {
    fail("receipt." + key + " expected " + JSON.stringify(value) + " got " + JSON.stringify(receipt[key]));
  }
}

const forbidden = [
  "live_execution_authorized == true",
  "wallet_mutation_authorized == true",
  "network_mutation_authorized == true",
  "unsupervised_execution_authorized == true",
  "operator_intent_required == false",
  "activation_mode == live"
];

const docLines = doc
  .split(/\\r?\\n/)
  .map((line) => line.trim())
  .filter(Boolean);

for (const fragment of forbidden) {
  if (docLines.includes(fragment)) fail("forbidden text present: " + fragment);
}

console.log("PASS supervised-activation-runbook-v1");
