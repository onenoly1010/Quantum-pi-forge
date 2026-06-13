#!/usr/bin/env node
const fs = require("fs");
const crypto = require("crypto");

const receiptPath = "receipts/press-agent/local-runtime-health-v2.json";
const docPath = "docs/press-agent/LOCAL_RUNTIME_HEALTH_V2.md";

function fail(msg) {
  console.error(`FAIL press-agent-local-runtime-health-v2: ${msg}`);
  process.exit(1);
}

if (!fs.existsSync(receiptPath)) fail(`missing ${receiptPath}`);
if (!fs.existsSync(docPath)) fail(`missing ${docPath}`);

const receipt = JSON.parse(fs.readFileSync(receiptPath, "utf8"));
const doc = fs.readFileSync(docPath, "utf8");

if (receipt.schema !== "qpf.press_agent.local_runtime_health.v2") fail("schema mismatch");
if (receipt.canonical_branch !== "main") fail("canonical branch mismatch");

if (receipt.runtime.port !== 3001) fail("port mismatch");
if (receipt.runtime.health_http_status !== 200) fail("health status mismatch");
if (receipt.runtime.health_pass !== true) fail("health pass not true");
if (receipt.runtime.server_started_by_script !== true) fail("server start not recorded");
if (receipt.runtime.server_stopped_by_script !== true) fail("server stop not recorded");

if (receipt.sealed_checks.cross_platform_determinism_v1 !== "PASS") fail("determinism check not sealed PASS");
if (receipt.sealed_checks.press_agent_discord_webhook_diagnostic_v1 !== "PASS") fail("discord diagnostic not sealed PASS");
if (receipt.sealed_checks.press_agent_readonly_readiness_v1 !== "PASS") fail("readonly readiness not sealed PASS");

const posture = receipt.posture || {};
if (posture.mode !== "local_runtime_health_only") fail("posture mode mismatch");
if (posture.discord_send_attempted_by_runtime_probe !== false) fail("runtime discord send posture mismatch");
if (posture.network_post_attempted_by_runtime_probe !== false) fail("runtime network post posture mismatch");
if (posture.deployments !== false) fail("deployment posture mismatch");
if (posture.chain_actions !== false) fail("chain action posture mismatch");
if (posture.keys_used !== false) fail("keys used posture mismatch");
if (posture.execution_receipt_present !== false) fail("execution receipt posture mismatch");

for (const needle of [
  "PRESS_AGENT_HEALTH_PASS=true",
  "EXECUTION_RECEIPT_PRESENT=false",
  "POSTURE=local_runtime_health_only",
  "DEPLOYMENTS=false",
  "CHAIN_ACTIONS=false",
  "KEYS_USED=false"
]) {
  if (!doc.includes(needle)) fail(`doc missing ${needle}`);
}

if (receipt.source_log_path && fs.existsSync(receipt.source_log_path)) {
  const actual = crypto
    .createHash("sha256")
    .update(fs.readFileSync(receipt.source_log_path))
    .digest("hex");

  if (actual !== receipt.source_log_sha256) {
    fail("source log sha256 mismatch");
  }
}

console.log("PASS press-agent-local-runtime-health-v2");
console.log(`receipt=${receiptPath}`);
console.log(`source_log_sha256=${receipt.source_log_sha256}`);
