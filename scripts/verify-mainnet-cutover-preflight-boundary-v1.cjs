#!/usr/bin/env node
const fs = require("fs");

const receiptPath = "receipts/autonomous/mainnet-cutover-preflight-boundary-v1.json";
const docPath = "docs/autonomous/MAINNET_CUTOVER_PREFLIGHT_BOUNDARY_V1.md";

function fail(message) {
  console.error(`FAIL mainnet-cutover-preflight-boundary-v1: ${message}`);
  process.exit(1);
}

if (!fs.existsSync(receiptPath)) fail(`missing ${receiptPath}`);
if (!fs.existsSync(docPath)) fail(`missing ${docPath}`);

const receipt = JSON.parse(fs.readFileSync(receiptPath, "utf8"));
const doc = fs.readFileSync(docPath, "utf8");

if (receipt.schema !== "qpf.autonomous.mainnet_cutover_preflight_boundary.v1") fail("schema mismatch");
if (receipt.status !== "SEALED_PREFLIGHT_BLOCKED") fail("status mismatch");
if (receipt.branch !== "autonomous/mainnet-cutover-preflight-v1") fail("branch mismatch");
if (receipt.base_main_commit !== "f8852ee") fail("base main commit mismatch");
if (receipt.preflight_mode !== "discovery_only") fail("preflight mode mismatch");

if (receipt.cutover_executed !== false) fail("cutover execution boundary mismatch");
if (receipt.deployment_executed !== false) fail("deployment execution boundary mismatch");
if (receipt.broadcast_executed !== false) fail("broadcast execution boundary mismatch");

for (const [name, status] of Object.entries(receipt.baseline_verification || {})) {
  if (status !== "PASS") fail(`${name} did not PASS`);
}

const secrets = receipt.local_secret_presence || {};
if (secrets.DISCORD_WEBHOOK_URL !== "PRESENT") fail("discord secret should be present");

const requiredEmpty = [
  "TELEGRAM_BOT_TOKEN",
  "TELEGRAM_CHAT_ID",
  "TWITTER_API_KEY",
  "TWITTER_API_SECRET",
  "TWITTER_ACCESS_TOKEN",
  "TWITTER_ACCESS_SECRET",
  "CLOUDFLARE_API_TOKEN",
  "CLOUDFLARE_ACCOUNT_ID",
  "ZERO_G_W0G",
  "ZERO_G_FACTORY",
  "ZERO_G_ROUTER",
  "ZERO_G_UNIVERSAL_ROUTER",
  "CATALYST_POOL_ADDRESS",
  "MODEL_ROYALTY_NFT_ADDRESS",
  "COSIGN_PRIVATE_KEY"
];

for (const key of requiredEmpty) {
  if (secrets[key] !== "EMPTY") fail(`${key} expected EMPTY`);
}

const result = receipt.preflight_result || {};
if (result.mainnet_cutover_ready_to_execute !== false) fail("ready-to-execute boundary mismatch");
if (result.operator_approval_required !== true) fail("operator approval boundary mismatch");
if (result.rollback_plan_required !== true) fail("rollback plan boundary mismatch");
if (result.secret_completion_required !== true) fail("secret completion boundary mismatch");
if (result.live_verification_required !== true) fail("live verification boundary mismatch");

const claims = receipt.claim_boundary || {};
if (claims.preflight_discovery_completed !== true) fail("preflight discovery claim mismatch");
if (claims.mainnet_cutover_complete !== false) fail("mainnet cutover boundary mismatch");
if (claims.unsupervised_autonomy_active !== false) fail("unsupervised autonomy boundary mismatch");
if (claims.external_multichannel_broadcast_proven !== false) fail("broadcast boundary mismatch");
if (claims.site_deploy_claimed !== false) fail("site deploy claim boundary mismatch");
if (claims.contract_deploy_claimed !== false) fail("contract deploy claim boundary mismatch");

if (receipt.next_authorized_lane !== "mainnet-cutover-gate-definition-v1") fail("next lane mismatch");

const requiredDocTerms = [
  "SEALED_PREFLIGHT_BLOCKED",
  "f8852ee",
  "No cutover was executed",
  "No deployment was executed",
  "No broadcast was executed",
  "DISCORD_WEBHOOK_URL",
  "TELEGRAM_BOT_TOKEN",
  "TWITTER_API_KEY",
  "CLOUDFLARE_API_TOKEN",
  "ZERO_G_W0G",
  "CATALYST_POOL_ADDRESS",
  "Mainnet cutover is not ready to execute",
  "mainnet-cutover-gate-definition-v1",
  "must not perform mainnet cutover"
];

for (const term of requiredDocTerms) {
  if (!doc.includes(term)) fail(`doc missing required term: ${term}`);
}

console.log("PASS mainnet-cutover-preflight-boundary-v1");
