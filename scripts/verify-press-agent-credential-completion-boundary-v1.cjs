#!/usr/bin/env node
const fs = require("fs");

const receiptPath = "receipts/press-agent/press-agent-credential-completion-boundary-v1.json";
const docPath = "docs/press-agent/PRESS_AGENT_CREDENTIAL_COMPLETION_BOUNDARY_V1.md";

function fail(message) {
  console.error(`FAIL press-agent-credential-completion-boundary-v1: ${message}`);
  process.exit(1);
}

if (!fs.existsSync(receiptPath)) fail(`missing ${receiptPath}`);
if (!fs.existsSync(docPath)) fail(`missing ${docPath}`);

const receipt = JSON.parse(fs.readFileSync(receiptPath, "utf8"));
const doc = fs.readFileSync(docPath, "utf8");

if (receipt.schema !== "qpf.press_agent.credential_completion_boundary.v1") fail("schema mismatch");
if (receipt.status !== "SEALED_BOUNDARY") fail("status mismatch");
if (receipt.base_main_commit !== "e013bd2") fail("base main commit mismatch");
if (receipt.branch !== "press-agent/credential-completion-boundary-v1") fail("branch mismatch");

const expectedCredentialState = {
  PORT: "PRESENT",
  DISCORD_WEBHOOK_URL: "PRESENT",
  TELEGRAM_BOT_TOKEN: "EMPTY",
  TELEGRAM_CHAT_ID: "EMPTY",
  TWITTER_API_KEY: "EMPTY",
  TWITTER_API_SECRET: "EMPTY",
  TWITTER_ACCESS_TOKEN: "EMPTY",
  TWITTER_ACCESS_SECRET: "EMPTY"
};

for (const [key, expected] of Object.entries(expectedCredentialState)) {
  if (!receipt.credential_state || receipt.credential_state[key] !== expected) {
    fail(`credential state mismatch for ${key}`);
  }
}

if (receipt.proof_state["press-agent:discord-only-proof:v1:check"] !== "PASS") fail("discord proof not PASS");
if (receipt.claim_boundary.discord_channel_ready !== true) fail("discord boundary mismatch");
if (receipt.claim_boundary.telegram_channel_ready !== false) fail("telegram boundary mismatch");
if (receipt.claim_boundary.twitter_channel_ready !== false) fail("twitter boundary mismatch");
if (receipt.claim_boundary.full_press_agent_live !== false) fail("full live boundary mismatch");
if (receipt.claim_boundary.external_multichannel_broadcast_proven !== false) fail("broadcast proof boundary mismatch");

if (receipt.operator_secret_policy.secrets_printed_to_terminal !== false) fail("secret print policy mismatch");
if (receipt.operator_secret_policy.secrets_committed_to_repo !== false) fail("secret commit policy mismatch");
if (receipt.operator_secret_policy.safe_inspection_mode !== "presence_only") fail("inspection mode mismatch");

const requiredDocTerms = [
  "SEALED_BOUNDARY",
  "e013bd2",
  "DISCORD_WEBHOOK_URL",
  "TELEGRAM_BOT_TOKEN",
  "TWITTER_API_KEY",
  "Discord-only proof passed",
  "does not claim",
  "Full Press Agent live",
  "No secret values should be committed"
];

for (const term of requiredDocTerms) {
  if (!doc.includes(term)) fail(`doc missing required term: ${term}`);
}

console.log("PASS press-agent-credential-completion-boundary-v1");
