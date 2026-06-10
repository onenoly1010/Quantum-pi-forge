#!/usr/bin/env node
const fs = require("fs");
const docPath = "docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_V1.md";
const receiptPath = "receipts/governance/post-merge-governance-receipt-v1.json";
function fail(m){ console.error("FAIL: " + m); process.exit(1); }
function ok(m){ console.log("OK: " + m); }
if (!fs.existsSync(docPath)) fail("missing doc");
if (!fs.existsSync(receiptPath)) fail("missing receipt");
const doc = fs.readFileSync(docPath, "utf8");
const receipt = JSON.parse(fs.readFileSync(receiptPath, "utf8"));
for (const bad of ["active_governance_boundaryty", "expansion.l.tion.bounded", "adminisrestored"]) { if (doc.includes(bad)) fail("corrupted fragment found: " + bad); }
for (const term of ["temporary_override != governance_removal", "admin_merge != unrestricted_merge_policy", "restored_protection == active_governance_boundary", "ops/autonomous-execution-receipt-v1"]) { if (!doc.includes(term)) fail("missing term: " + term); }
if (receipt.schema !== "qpf.post_merge_governance_receipt.v1") fail("schema mismatch");
if (receipt.event.pull_request !== 174) fail("PR binding mismatch");
if (receipt.boundary.permanent_governance_removal !== false) fail("governance removal boundary mismatch");
if (receipt.restored_controls.required_pull_request_reviews !== true) fail("PR reviews not restored");
if (receipt.restored_controls.require_code_owner_reviews !== true) fail("code owner reviews not restored");
if (receipt.restored_controls.enforce_admins !== true) fail("admin enforcement not restored");
if (receipt.invariant !== "temporary_override != governance_removal") fail("invariant mismatch");
ok("post-merge governance receipt verified");
ok("temporary override boundary documented");
ok("restored controls recorded");
ok("next autonomous execution priority declared");
