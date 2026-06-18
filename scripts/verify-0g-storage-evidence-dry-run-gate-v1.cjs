#!/usr/bin/env node
const fs = require("fs");
const crypto = require("crypto");
const receiptPath = "receipts/integration/0g-storage-evidence-dry-run-v1.json";
function sha256(buf) { return crypto.createHash("sha256").update(buf).digest("hex"); }
const r = JSON.parse(fs.readFileSync(receiptPath, "utf8"));
if (r.receipt !== "0g-storage-evidence-dry-run-gate-v1") throw new Error("BAD_RECEIPT_NAME");
if (r.status !== "PASS") throw new Error("BAD_STATUS");
if (r.mode !== "DRY_RUN_ONLY") throw new Error("BAD_MODE");
if (r.chain_id_observed !== 16661) throw new Error("BAD_CHAIN_ID");
if (r.upload_attempted !== false) throw new Error("UPLOAD_ATTEMPTED");
if (r.transaction_broadcast !== false) throw new Error("TRANSACTION_BROADCAST");
if (r.private_key_present !== false) throw new Error("PRIVATE_KEY_PRESENT");
if (r.live_execution !== false) throw new Error("LIVE_EXECUTION_TRUE");
const artifactBytes = fs.readFileSync(r.artifact_path);
if (sha256(artifactBytes) !== r.artifact_sha256) throw new Error("ARTIFACT_HASH_MISMATCH");
console.log("PASS verify-0g-storage-evidence-dry-run-gate-v1");
