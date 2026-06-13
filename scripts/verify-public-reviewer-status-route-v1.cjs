#!/usr/bin/env node
const fs = require("fs");
const crypto = require("crypto");

const pagePath = "deploy/trust/reviewer-status.html";
const outPath = "out/trust/reviewer-status.html";
const docPath = "docs/governance/PUBLIC_REVIEWER_STATUS_ROUTE_V1.md";
const receiptPath = "receipts/governance/public-reviewer-status-route-v1.json";

function fail(msg) {
  console.error(`FAIL public-reviewer-status-route-v1: ${msg}`);
  process.exit(1);
}

function sha(path) {
  return crypto.createHash("sha256").update(fs.readFileSync(path)).digest("hex");
}

for (const path of [pagePath, docPath, receiptPath]) {
  if (!fs.existsSync(path)) fail(`missing ${path}`);
}

const receipt = JSON.parse(fs.readFileSync(receiptPath, "utf8"));
const page = fs.readFileSync(pagePath, "utf8");
const doc = fs.readFileSync(docPath, "utf8");

if (receipt.schema !== "qpf.governance.public_reviewer_status_route_v1") fail("schema mismatch");
if (receipt.route.source_path !== pagePath) fail("route source path mismatch");
if (receipt.route.public_path !== "/trust/reviewer-status.html") fail("public path mismatch");
if (receipt.route.sha256 !== sha(pagePath)) fail("page sha mismatch");
if (receipt.documentation.path !== docPath) fail("doc path mismatch");
if (receipt.documentation.sha256 !== sha(docPath)) fail("doc sha mismatch");

const posture = receipt.posture || {};
for (const [key, expected] of Object.entries({
  readonly_public_route: true,
  send_authorized: false,
  network_post_attempted: false,
  deployments: false,
  chain_actions: false,
  keys_used: false,
  execution_receipt_present: false
})) {
  if (posture[key] !== expected) fail(`posture mismatch: ${key}`);
}

for (const needle of [
  "Quantum Pi Forge / OINIO Reviewer Status",
  "REVIEWER_STATUS_CONSOLIDATION=SEALED",
  "PRESS_AGENT_STACK=SEALED",
  "EXECUTION_RECEIPT_PRESENT=false",
  "SEND_AUTHORIZED=false",
  "NETWORK_POST_ATTEMPTED=false",
  "DEPLOYMENTS=false",
  "CHAIN_ACTIONS=false",
  "KEYS_USED=false",
  "https://github.com/onenoly1010/Quantum-pi-forge/issues/328",
  "docs/governance/REVIEWER_STATUS_CONSOLIDATION_V1.md"
]) {
  if (!page.includes(needle)) fail(`page missing ${needle}`);
}

for (const needle of [
  "/trust/reviewer-status.html",
  "READONLY_PUBLIC_ROUTE=true",
  "SEND_AUTHORIZED=false",
  "EXECUTION_RECEIPT_PRESENT=false"
]) {
  if (!doc.includes(needle)) fail(`doc missing ${needle}`);
}

if (fs.existsSync("receipts/execution/v2-mainnet-cutover-execution-v1.json")) {
  fail("execution receipt present");
}

if (fs.existsSync(outPath)) {
  const out = fs.readFileSync(outPath, "utf8");
  if (!out.includes("Quantum Pi Forge / OINIO Reviewer Status")) fail("built output missing title");
  if (!out.includes("EXECUTION_RECEIPT_PRESENT=false")) fail("built output missing execution posture");
}

console.log("PASS public-reviewer-status-route-v1");
console.log(`route=/trust/reviewer-status.html`);
console.log(`page_sha256=${receipt.route.sha256}`);
console.log(`canonical_main=${receipt.canonical_main_short}`);
