#!/usr/bin/env node
const fs = require("fs");
const { execSync } = require("child_process");

const SPEC = "receipts/governance/public-mint-execution-path-spec-v1.json";
const PHASE29 = "receipts/governance/phase-29-public-mint-execution-path-completion-v1.json";

const fail = (msg) => {
  console.error("FAIL phase-30-final-execution-review-reopen-v1: " + msg);
  process.exit(1);
};

if (!fs.existsSync(SPEC)) fail("missing path spec");
if (!fs.existsSync(PHASE29)) fail("missing phase 29 completion receipt");

const spec = JSON.parse(fs.readFileSync(SPEC, "utf8"));
const phase29 = JSON.parse(fs.readFileSync(PHASE29, "utf8"));

if (phase29.outcome !== "EXECUTION_PATH_IDENTIFIED_FOR_REVIEW_ONLY") {
  fail("phase 29 outcome must be EXECUTION_PATH_IDENTIFIED_FOR_REVIEW_ONLY");
}

const registry = spec.exact_mint_contract?.address;
if (registry !== "0x67aD7169184581f23D1E10B39d4eb4e98293E87a") fail("exact contract address missing");

const seq = spec.execution_sequence;
if (!Array.isArray(seq) || seq.length !== 2) fail("exact function sequence missing");
if (seq[0].function !== "approve" || seq[1].function !== "registerModel") fail("exact function missing");

if (!seq[1].args?.name || !seq[1].args?.metadataURI || !seq[1].args?.stakeAmount) {
  fail("exact args missing");
}

if (spec.expected_chain_id !== 16661) fail("chainId 16661 missing");

const reviewHarness = spec.exact_frontend_or_script_call?.review_harness;
if (!reviewHarness || !fs.existsSync(reviewHarness)) fail("exact review script missing");

if (spec.exact_frontend_or_script_call?.live_execution_script !== null) {
  fail("live execution script must remain null");
}

if (!spec.expected_wallet_prompt?.prompt_1 || !spec.expected_wallet_prompt?.prompt_2) {
  fail("expected wallet prompt missing");
}

if (!spec.expected_value?.oinio_stake_wei || spec.expected_value?.native_eth_or_0g !== "0") {
  fail("expected value missing");
}

if (!spec.expected_gas_behavior?.transaction_count) fail("expected gas behavior missing");
if (!spec.expected_success_receipt?.required_fields?.length) fail("expected success receipt missing");
if (!spec.abort_conditions?.length) fail("abort conditions missing");

if (spec.human_signing_gate !== "future_only_requires_separate_phase_after_final_execution_review") {
  fail("human signing gate must remain separate");
}

for (const key of [
  "signing",
  "broadcast",
  "public_mint_execution",
  "wallet_prompt",
  "final_human_signing_authorized",
]) {
  if (spec.execution_boundaries?.[key] !== false) {
    fail("execution_boundaries." + key + " must be false");
  }
}

execSync("npm run governance:public-mint-execution-path-review:v1:check", {
  stdio: "inherit",
});

console.log("PASS phase-30-final-execution-review-reopen-v1");
console.log("OUTCOME APPROVE_FINAL_EXECUTION_REVIEW_PENDING_HUMAN_SIGNING");
console.log("SIGNING false");
console.log("BROADCAST false");
console.log("PUBLIC_MINT_EXECUTION false");
console.log("HUMAN_SIGNING_GATE separate_future_only");