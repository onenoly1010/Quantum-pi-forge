#!/usr/bin/env node
const fs = require("fs");
const crypto = require("crypto");
const path = require("path");

const SPEC_PATH = "receipts/governance/public-mint-execution-path-spec-v1.json";
const REGISTRY = path.join("contracts/src/OINIOModelRegistry.sol");
const TOKEN = path.join("contracts/src/OINIOToken.sol");

const fail = (msg) => {
  console.error("FAIL public-mint-execution-path-review-v1: " + msg);
  process.exit(1);
};

if (!fs.existsSync(SPEC_PATH)) fail("missing spec: " + SPEC_PATH);

const spec = JSON.parse(fs.readFileSync(SPEC_PATH, "utf8"));

if (spec.status !== "REVIEW_ONLY_NOT_EXECUTABLE") {
  fail("spec status must be REVIEW_ONLY_NOT_EXECUTABLE");
}

const boundaryKeys = [
  "signing",
  "broadcast",
  "public_mint_execution",
  "wallet_actions",
  "wallet_prompt",
  "private_key_access",
  "seed_phrase_request",
  "contract_changes",
  "liquidity_activation",
  "staking_activation",
  "bridge_activation",
  "yield_routing",
  "treasury_movement",
  "token_transfer",
  "automatic_wallet_signing",
  "final_human_signing_authorized",
];

for (const key of boundaryKeys) {
  if (spec.execution_boundaries?.[key] !== false) {
    fail("execution_boundaries." + key + " must be false");
  }
}

if (spec.exact_mint_contract?.address !== "0x67aD7169184581f23D1E10B39d4eb4e98293E87a") {
  fail("unexpected registry address");
}

if (spec.oinio_token?.address !== "0x75995EC0fdf881189850aeD864cB3f43c0DFCb58") {
  fail("unexpected OINIO token address");
}

if (spec.expected_chain_id !== 16661) {
  fail("expected_chain_id must be 16661");
}

if (!Array.isArray(spec.execution_sequence) || spec.execution_sequence.length !== 2) {
  fail("execution_sequence must contain exactly 2 steps");
}

const [approveStep, registerStep] = spec.execution_sequence;
if (approveStep.function !== "approve" || registerStep.function !== "registerModel") {
  fail("execution_sequence must be approve then registerModel");
}

if (spec.exact_frontend_or_script_call?.live_execution_script !== null) {
  fail("live_execution_script must remain null in review lane");
}

for (const src of [REGISTRY, TOKEN]) {
  if (!fs.existsSync(src)) fail("missing abi source: " + src);
  if (!fs.readFileSync(src, "utf8").includes("registerModel") && src.includes("Registry")) {
    fail("registry source missing registerModel");
  }
}

if (!spec.abort_conditions?.length) fail("abort_conditions required");
if (!spec.expected_wallet_prompt?.prompt_1 || !spec.expected_wallet_prompt?.prompt_2) {
  fail("expected_wallet_prompt prompts required");
}

const forbiddenPatterns = [
  /\.sendTransaction\s*\(/,
  /\.writeContract\s*\(/,
  /startBroadcast\s*\(/,
  /process\.env\.PRIVATE_KEY/,
  /\.connect\s*\(/,
  /\.getSigner\s*\(/,
];
const self = fs.readFileSync(__filename, "utf8");
for (const pattern of forbiddenPatterns) {
  if (pattern.test(self)) fail("review harness must not contain execution primitive matching " + pattern);
}

console.log("PASS public-mint-execution-path-review-v1");
console.log("MODE review_only_no_execution");
console.log("REGISTRY " + spec.exact_mint_contract.address);
console.log("CHAIN_ID " + spec.expected_chain_id);
console.log("REVIEW_HARNESS scripts/review/public-mint-execution-path-review-v1.cjs");
console.log("LIVE_EXECUTION_SCRIPT null");
console.log("SIGNING false");
console.log("BROADCAST false");
console.log("WALLET_PROMPT false");