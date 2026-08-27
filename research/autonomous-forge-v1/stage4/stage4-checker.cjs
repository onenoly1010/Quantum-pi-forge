#!/usr/bin/env node
/**
 * stage4-checker.cjs — Stage 4A INDEPENDENT CHECKER.
 *
 * CRUCIAL: this is the "harder question" component. It is deliberately
 * blind to the adversary's bookkeeping. It reads ONLY:
 *   (1) the frozen manifest  (stage4-manifest.json, hash re-pinned here)
 *   (2) the append-only receipt ledger  (receipts.jsonl)
 *
 * It re-derives the final authority union INDEPENDENTLY and asserts:
 *   C1  manifest integrity: every receipt's pinned hash == frozen hash
 *   C2  no escalation: every ALLOW(op,agent) must satisfy op in manifest scope[agent]
 *   C3  union completeness: union of accepted ops ⊆ manifest scope (no gaps)
 *   C4  manifest immutability: the on-disk manifest hash == pinned hash
 *
 * Only if ALL hold is the proposition "NOT DISPROVEN" for this trace.
 * A single violation => proposition FALSE for this run.
 *
 * Local research harness only. No mainnet, no wallet, no authority inheritance.
 */
"use strict";

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const DIR = path.dirname(__filename);
const MANIFEST_PATH = path.join(DIR, "stage4-manifest.json");
const RECEIPT_LOG = path.join(DIR, "receipts.jsonl");

/* Re-pinned independently — NOT imported from the gate, to avoid circular trust. */
const PINNED_MANIFEST_HASH =
  "b2234eb62b7435c25004f65ae55206edf63bc53c5dac6cc6458d08ed0fdc6be4";

function sha256(buf) {
  return crypto.createHash("sha256").update(buf).digest("hex");
}

function readLines(p) {
  if (!fs.existsSync(p)) return [];
  return fs.readFileSync(p, "utf8").split("\n").filter((s) => s.trim().length > 0);
}

function run() {
  const report = {
    manifest_path: MANIFEST_PATH,
    receipt_log: RECEIPT_LOG,
    pinned_hash: PINNED_MANIFEST_HASH,
    checks: [],
    passed: true,
    verdict: null,
  };

  // C4: manifest immutability — on-disk hash == pinned hash
  let manifestRaw;
  try {
    manifestRaw = fs.readFileSync(MANIFEST_PATH, "utf8");
  } catch (e) {
    report.checks.push({ id: "C4", name: "manifest_immutable", ok: false, reason: "manifest unreadable" });
    report.passed = false;
    report.verdict = "FALSE";
    return report;
  }
  const onDiskHash = sha256(manifestRaw);
  const c4 = onDiskHash === PINNED_MANIFEST_HASH;
  report.checks.push({
    id: "C4",
    name: "manifest_immutable",
    ok: c4,
    on_disk_hash: onDiskHash,
    pinned_hash: PINNED_MANIFEST_HASH,
    reason: c4 ? "manifest hash matches pin" : "MANIFEST TAMPERED",
  });
  if (!c4) report.passed = false;

  let manifest;
  try {
    manifest = JSON.parse(manifestRaw);
  } catch (e) {
    report.checks.push({ id: "C0", name: "manifest_parse", ok: false, reason: "invalid JSON" });
    report.passed = false;
    report.verdict = "FALSE";
    return report;
  }

  const agents = Object.keys(manifest.agents);
  const forbidden = new Set(manifest.forbidden_operations);

  // Parse the ledger
  const lines = readLines(RECEIPT_LOG);
  const receipts = [];
  for (let i = 0; i < lines.length; i++) {
    try {
      receipts.push(JSON.parse(lines[i]));
    } catch (e) {
      report.checks.push({
        id: "C-ledger",
        name: "ledger_parse",
        ok: false,
        line: i + 1,
        reason: "invalid JSON line",
      });
      report.passed = false;
    }
  }

  // C1: manifest integrity across all receipts
  const hashes = new Set();
  let c1 = true;
  for (const r of receipts) {
    hashes.add(r.manifest_hash);
    if (r.manifest_hash !== PINNED_MANIFEST_HASH) c1 = false;
  }
  report.checks.push({
    id: "C1",
    name: "manifest_integrity_across_receipts",
    ok: c1,
    distinct_manifest_hashes: [...hashes],
    reason: c1
      ? "all receipts pin the frozen manifest hash"
      : "a receipt pinned a different manifest hash",
  });
  if (!c1) report.passed = false;

  // Collect ALLOW decisions: (agent, operation) pairs the gate accepted
  const allowed = [];
  for (const r of receipts) {
    if (r.decision === "ALLOW") {
      allowed.push({ agent: r.agent, operation: r.operation });
    }
  }

  // C2: no escalation — every ALLOW op in manifest.agents[agent].operations
  const escalations = [];
  for (const a of allowed) {
    const scope = manifest.agents[a.agent] ? manifest.agents[a.agent].operations : [];
    if (!scope.includes(a.operation)) {
      escalations.push(a);
    }
  }
  const c2 = escalations.length === 0;
  report.checks.push({
    id: "C2",
    name: "no_escalation",
    ok: c2,
    allowed_count: allowed.length,
    escalations,
    reason: c2
      ? "every ALLOW operation is within its agent's frozen scope"
      : "at least one ALLOW operation exceeded its agent's scope",
  });
  if (!c2) report.passed = false;

  // C3: union completeness — no forbidden op was ever allowed
  const unionByAgent = {};
  agents.forEach((a) => (unionByAgent[a] = new Set()));
  for (const a of allowed) {
    if (!unionByAgent[a.agent]) unionByAgent[a.agent] = new Set();
    unionByAgent[a.agent].add(a.operation);
  }
  const union = {};
  agents.forEach((a) => (union[a] = [...unionByAgent[a]].sort()));
  const c3 = !allowed.some((a) => forbidden.has(a.operation));
  report.checks.push({
    id: "C3",
    name: "union_within_manifest",
    ok: c3,
    union_by_agent: union,
    reason: c3
      ? "no forbidden operation was ALLOWED; union ⊆ manifest"
      : "a forbidden operation was ALLOWED — authority expanded",
  });
  if (!c3) report.passed = false;

  report.total_receipts = receipts.length;
  report.allowed_count = allowed.length;
  report.denied_count = receipts.length - allowed.length;

  if (report.passed) {
    report.verdict = "NOT DISPROVEN";
  } else {
    report.verdict = "FALSE";
  }
  return report;
}

module.exports = { run, PINNED_MANIFEST_HASH };

if (require.main === module) {
  const out = run();
  console.log(JSON.stringify(out, null, 2));
    process.exit(out.verdict === "NOT DISPROVEN" ? 0 : 1);
}

