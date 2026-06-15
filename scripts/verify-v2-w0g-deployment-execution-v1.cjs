#!/usr/bin/env node
const fs = require("fs");
const crypto = require("crypto");

const receiptPath = "receipts/execution/v2-w0g-deployment-execution-v1.json";
const expectedHash = "a2115f9e65809e37141526fb2b0883b0a1e93e0eb0690140e740853bc837ed21";

function fail(msg) {
  console.error("FAIL v2-w0g-deployment-execution-v1: " + msg);
  process.exit(1);
}

if (!fs.existsSync(receiptPath)) fail("missing execution receipt");

const r = JSON.parse(fs.readFileSync(receiptPath, "utf8"));
if (r.receipt !== "v2-w0g-deployment-execution-v1") fail("bad receipt id");
if (r.status !== "success") fail("status is not success");
if (r.chain_id_required !== 16661) fail("bad chain id");
if (r.deployment_scope !== "W0G_ONLY") fail("deployment scope must be W0G_ONLY");
if (r.full_dex_deployment !== false) fail("full_dex_deployment must be false");
if (r.command_sha256 !== expectedHash) fail("command hash mismatch");
if (!r.stdout_log || !fs.existsSync(r.stdout_log)) fail("stdout log missing");
if (!r.stderr_log || !fs.existsSync(r.stderr_log)) fail("stderr log missing");

const stdoutHash = crypto.createHash("sha256").update(fs.readFileSync(r.stdout_log)).digest("hex");
const stderrHash = crypto.createHash("sha256").update(fs.readFileSync(r.stderr_log)).digest("hex");
if (stdoutHash !== r.stdout_sha256) fail("stdout hash mismatch");
if (stderrHash !== r.stderr_sha256) fail("stderr hash mismatch");

console.log("PASS v2-w0g-deployment-execution-v1");
