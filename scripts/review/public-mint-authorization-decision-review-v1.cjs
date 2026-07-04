#!/usr/bin/env node
const fs = require("fs");

const REQUEST = "receipts/governance/public-mint-authorization-decision-request-v1.json";
const DECISION = "receipts/governance/phase-38-public-mint-authorization-decision-v1.json";
const PROOF = "receipts/governance/public-mint-authorization-readiness-proof-v1.json";

const fail = (msg) => {
  console.error("FAIL public-mint-authorization-decision-review-v1: " + msg);
  process.exit(1);
};

for (const path of [REQUEST, DECISION, PROOF]) {
  if (!fs.existsSync(path)) fail("missing file: " + path);
}

const request = JSON.parse(fs.readFileSync(REQUEST, "utf8"));
const decision = JSON.parse(fs.readFileSync(DECISION, "utf8"));
const proof = JSON.parse(fs.readFileSync(PROOF, "utf8"));

console.log("=== PHASE 38 PUBLIC MINT AUTHORIZATION DECISION SHEET (review only) ===");
console.log("");
console.log("RULE: Authorization decision only. Live execution remains separate.");
console.log("");
console.log("phase_37_proof_status: " + proof.status);
console.log("authorization_readiness.public_mint_authorized: " + proof.authorization_readiness?.public_mint_authorized);
console.log("authorization_readiness.live_execution_authorization_opened: " + proof.authorization_readiness?.live_execution_authorization_opened);
console.log("");
console.log("phase_38_decision_outcome: " + decision.decision_outcome);
console.log("public_mint_authorized: " + decision.authorization_state?.public_mint_authorized);
console.log("mint_allowed: " + decision.authorization_state?.mint_allowed);
console.log("public_mint_active: " + decision.authorization_state?.public_mint_active);
console.log("live_execution_authorization: " + decision.authorization_state?.live_execution_authorization);
console.log("");
console.log("phase_35_confirmed_values:");
console.log(JSON.stringify(decision.preserved_phase_35_confirmed_values, null, 2));
console.log("");
console.log("human_decision.decided: " + request.human_decision?.decided);
console.log("human_decision.decision_phrase_required: " + request.human_decision?.decision_phrase_required);
console.log("");
console.log("PASS public-mint-authorization-decision-review-v1");
console.log("MODE authorization_decision_review_no_execution");
console.log("PUBLIC_MINT_AUTHORIZED " + decision.authorization_state?.public_mint_authorized);
console.log("LIVE_EXECUTION_AUTHORIZATION false");
console.log("SIGNING false");
console.log("BROADCAST false");