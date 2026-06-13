#!/usr/bin/env node
const fs = require("fs");

const path = "receipts/press-agent/discord-webhook-diagnostic-v1.json";
const r = JSON.parse(fs.readFileSync(path, "utf8"));

function fail(msg) {
  console.error("FAIL discord-webhook-diagnostic-v1");
  console.error(msg);
  process.exit(1);
}

if (r.schema !== "qpf.press-agent.discord-webhook-diagnostic.v1") fail("bad schema");
if (r.webhook_name !== "QPF_BOT") fail("bad webhook name");
if (r.webhook_metadata_check.get_status !== 200) fail("bad get status");
if (r.webhook_metadata_check.webhook_valid !== true) fail("webhook not valid");
if (r.webhook_send_test.message_received !== true) fail("message not received");
if (!r.posture || r.posture.webhook_url_logged !== false) fail("webhook url logging posture invalid");
for (const k of ["deployments", "chain_actions", "publishes", "keys_used", "execution_receipt_present"]) {
  if (r.posture[k] !== false) fail(`bad posture ${k}`);
}
if (r.posture.diagnostic_only !== true) fail("not diagnostic only");

console.log("PASS discord-webhook-diagnostic-v1");
console.log(`head_commit=${r.short_head_commit}`);
console.log("webhook_name=QPF_BOT");
console.log("message_received=true");
