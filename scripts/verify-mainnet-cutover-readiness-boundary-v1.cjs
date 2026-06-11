#!/usr/bin/env node
const fs = require("fs");

const receiptPath = "receipts/autonomous/mainnet-cutover-readiness-boundary-v1.json";
const docPath = "docs/autonomous/MAINNET_CUTOVER_READINESS_BOUNDARY_V1.md";

function fail(message) {
  console.error(`FAIL mainnet-cutover-readiness-boundary-v1: ${message}`);
  process.exit(1);
}

if (!fs.existsSync(receiptPath)) fail(`missing ${receiptPath}`);
if (!fs.existsSync(docPath)) fail(`missing ${docPath}`);

const receipt = JSON.parse(fs.readFileSync(receiptPath, "utf8"));
const doc = fs.readFileSync(docPath, "utf8");

if (receipt.schema !== "qpf.autonomous.mainnet_cutover_readiness_boundary.v1") fail("schema mismatch");
if (receipt.status !== "SEALED_BOUNDARY") fail("status mismatch");
if (receipt.branch !== "autonomous/mainnet-cutover-readiness-v1") fail("branch mismatch");
if (receipt.base_main_commit !== "373a3db") fail("base main commit mismatch");
if (receipt.readiness_mode !== "discovery_only") fail("readiness mode mismatch");

if (receipt.cutover_executed !== false) fail("cutover execution boundary mismatch");
if (receipt.deployment_executed !== false) fail("deployment execution boundary mismatch");
if (receipt.broadcast_executed !== false) fail("broadcast execution boundary mismatch");

for (const [name, status] of Object.entries(receipt.baseline_verification || {})) {
  if (status !== "PASS") fail(`${name} did not PASS`);
}

const discovery = receipt.discovery || {};
if (discovery.dedicated_mainnet_cutover_script_found !== false) fail("cutover script discovery mismatch");
if (discovery.dedicated_mainnet_cutover_package_script_found !== false) fail("cutover package script discovery mismatch");
if (discovery.site_deploy_surface_found !== true) fail("site deploy surface missing");
if (discovery.press_agent_workflow_found !== true) fail("press agent workflow missing");
if (discovery.deployment_verification_workflow_found !== true) fail("deployment verification workflow missing");

const known = receipt.known_boundaries || {};
if (known.press_agent_discord_only !== true) fail("press agent boundary mismatch");
if (known.telegram_ready !== false) fail("telegram boundary mismatch");
if (known.twitter_ready !== false) fail("twitter boundary mismatch");
if (known.mainnet_verification_secrets_required !== true) fail("mainnet secrets boundary mismatch");
if (known.operator_approval_required !== true) fail("operator approval boundary mismatch");
if (known.runtime_receipts_must_remain_uncommitted !== true) fail("runtime receipt boundary mismatch");

const claims = receipt.claim_boundary || {};
if (claims.mainnet_cutover_readiness_discovered !== true) fail("readiness discovery claim mismatch");
if (claims.mainnet_cutover_ready_to_execute !== false) fail("ready-to-execute boundary mismatch");
if (claims.mainnet_cutover_complete !== false) fail("cutover complete boundary mismatch");
if (claims.unsupervised_autonomy_active !== false) fail("unsupervised autonomy boundary mismatch");
if (claims.external_multichannel_broadcast_proven !== false) fail("broadcast boundary mismatch");

if (receipt.next_authorized_lane !== "mainnet-cutover-preflight-v1") fail("next lane mismatch");

const requiredDocTerms = [
  "373a3db",
  "discovery only",
  "No cutover was executed",
  "No deployment was executed",
  "No broadcast was executed",
  "Press Agent remains Discord-only",
  "mainnet cutover ready to execute",
  "mainnet cutover complete",
  "unsupervised autonomy active",
  "mainnet-cutover-preflight-v1",
  "must not perform mainnet cutover"
];

for (const term of requiredDocTerms) {
  if (!doc.includes(term)) fail(`doc missing required term: ${term}`);
}

console.log("PASS mainnet-cutover-readiness-boundary-v1");
