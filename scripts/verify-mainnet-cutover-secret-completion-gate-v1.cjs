#!/usr/bin/env node
const fs = require("fs");

const receiptPath = "receipts/autonomous/mainnet-cutover-secret-completion-gate-v1.json";
const docPath = "docs/autonomous/MAINNET_CUTOVER_SECRET_COMPLETION_GATE_V1.md";

function fail(message) {
  console.error(`FAIL mainnet-cutover-secret-completion-gate-v1: ${message}`);
  process.exit(1);
}

if (!fs.existsSync(receiptPath)) fail(`missing ${receiptPath}`);
if (!fs.existsSync(docPath)) fail(`missing ${docPath}`);

const receipt = JSON.parse(fs.readFileSync(receiptPath, "utf8"));
const doc = fs.readFileSync(docPath, "utf8");

if (receipt.schema !== "qpf.autonomous.mainnet_cutover_secret_completion_gate.v1") fail("schema mismatch");
if (receipt.status !== "SEALED_SECRET_COMPLETION_BLOCKED") fail("status mismatch");
if (receipt.branch !== "autonomous/mainnet-cutover-secret-completion-gate-v1") fail("branch mismatch");
if (receipt.base_main_commit !== "f0fdf1b") fail("base main commit mismatch");

if (receipt.cutover_executed !== false) fail("cutover boundary mismatch");
if (receipt.deployment_executed !== false) fail("deployment boundary mismatch");
if (receipt.broadcast_executed !== false) fail("broadcast boundary mismatch");
if (receipt.secret_values_printed !== false) fail("secret values must not be printed");

for (const [name, status] of Object.entries(receipt.baseline_verification || {})) {
  if (status !== "PASS") fail(`${name} did not PASS`);
}

const secrets = receipt.local_secret_presence || {};
if (secrets.CLOUDFLARE_ACCOUNT_ID !== "PRESENT") fail("CLOUDFLARE_ACCOUNT_ID should be PRESENT");

for (const key of [
  "DISCORD_WEBHOOK_URL",
  "TELEGRAM_BOT_TOKEN",
  "TELEGRAM_CHAT_ID",
  "TWITTER_API_KEY",
  "TWITTER_API_SECRET",
  "TWITTER_ACCESS_TOKEN",
  "TWITTER_ACCESS_SECRET",
  "CLOUDFLARE_API_TOKEN",
  "ZERO_G_W0G",
  "ZERO_G_FACTORY",
  "ZERO_G_ROUTER",
  "ZERO_G_UNIVERSAL_ROUTER",
  "CATALYST_POOL_ADDRESS",
  "MODEL_ROYALTY_NFT_ADDRESS",
  "COSIGN_PRIVATE_KEY"
]) {
  if (secrets[key] !== "EMPTY") fail(`${key} expected EMPTY`);
  if (!receipt.blocking_missing_inputs.includes(key)) fail(`${key} missing from blocking list`);
}

const result = receipt.completion_result || {};
if (result.secret_completion_ready !== false) fail("secret completion should be blocked");
if (result.mainnet_cutover_ready_to_execute !== false) fail("mainnet cutover must not be ready");
if (result.only_present_required_secret !== "CLOUDFLARE_ACCOUNT_ID") fail("present required secret mismatch");

const claims = receipt.claim_boundary || {};
if (claims.secret_completion_gate_defined !== true) fail("secret gate claim mismatch");
if (claims.secret_completion_ready !== false) fail("secret completion claim mismatch");
if (claims.mainnet_cutover_ready_to_execute !== false) fail("ready-to-execute boundary mismatch");
if (claims.mainnet_cutover_complete !== false) fail("cutover complete boundary mismatch");
if (claims.deployment_complete !== false) fail("deployment boundary mismatch");
if (claims.broadcast_complete !== false) fail("broadcast boundary mismatch");
if (claims.unsupervised_autonomy_active !== false) fail("unsupervised autonomy boundary mismatch");

if (receipt.next_authorized_lane !== "mainnet-cutover-secret-remediation-plan-v1") fail("next lane mismatch");

for (const term of [
  "SEALED_SECRET_COMPLETION_BLOCKED",
  "f0fdf1b",
  "No cutover was executed",
  "No deployment was executed",
  "No broadcast was executed",
  "No secret values were printed",
  "CLOUDFLARE_ACCOUNT_ID",
  "DISCORD_WEBHOOK_URL",
  "TELEGRAM_BOT_TOKEN",
  "TWITTER_API_KEY",
  "COSIGN_PRIVATE_KEY",
  "Secret completion is blocked",
  "Mainnet cutover is not ready to execute",
  "mainnet-cutover-secret-remediation-plan-v1",
  "must not perform mainnet cutover"
]) {
  if (!doc.includes(term)) fail(`doc missing required term: ${term}`);
}

console.log("PASS mainnet-cutover-secret-completion-gate-v1");
