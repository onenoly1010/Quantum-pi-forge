#!/usr/bin/env node
const fs = require("fs");

const receiptPath = "receipts/autonomous/mainnet-cutover-secret-remediation-plan-v1.json";
const docPath = "docs/autonomous/MAINNET_CUTOVER_SECRET_REMEDIATION_PLAN_V1.md";

function fail(msg) {
  console.error(`FAIL mainnet-cutover-secret-remediation-plan-v1: ${msg}`);
  process.exit(1);
}

if (!fs.existsSync(receiptPath)) fail("missing receipt");
if (!fs.existsSync(docPath)) fail("missing doc");

const receipt = JSON.parse(fs.readFileSync(receiptPath, "utf8"));
const doc = fs.readFileSync(docPath, "utf8");

if (receipt.schema !== "qpf.autonomous.mainnet_cutover_secret_remediation_plan.v1") fail("schema mismatch");
if (receipt.status !== "SEALED_SECRET_REMEDIATION_PLAN") fail("status mismatch");
if (receipt.base_main_commit !== "5cda120") fail("base main mismatch");

for (const key of [
  "cutover_executed",
  "deployment_executed",
  "broadcast_executed",
  "secret_values_printed",
  "secrets_remediated_now"
]) {
  if (receipt[key] !== false) fail(`${key} must be false`);
}

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
  if (!receipt.missing_inputs_to_remediate.includes(key)) fail(`missing input: ${key}`);
  if (!doc.includes(key)) fail(`doc missing input: ${key}`);
}

if (!receipt.already_present_inputs.includes("CLOUDFLARE_ACCOUNT_ID")) fail("missing present input");
if (receipt.next_authorized_lane !== "mainnet-cutover-readonly-live-probe-v1") fail("next lane mismatch");

const claims = receipt.claim_boundary || {};
for (const key of [
  "secret_completion_ready",
  "mainnet_cutover_ready_to_execute",
  "mainnet_cutover_complete",
  "deployment_complete",
  "broadcast_complete",
  "unsupervised_autonomy_active"
]) {
  if (claims[key] !== false) fail(`${key} must be false`);
}

for (const term of [
  "SEALED_SECRET_REMEDIATION_PLAN",
  "No cutover was executed",
  "No deployment was executed",
  "No broadcast was executed",
  "No secret values were printed",
  "No secrets were remediated by this lane",
  "never commit secret values",
  "never print secret values",
  "record presence only",
  "mainnet-cutover-readonly-live-probe-v1",
  "must not perform mainnet cutover"
]) {
  if (!doc.includes(term)) fail(`doc missing term: ${term}`);
}

console.log("PASS mainnet-cutover-secret-remediation-plan-v1");
