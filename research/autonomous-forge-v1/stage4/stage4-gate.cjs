#!/usr/bin/env node
/**
 * stage4-gate.cjs — Stage 4A shared authority gate.
 *
 * This is the SINGLE boundary through which every agent (honest and adversarial)
 * must submit an action. There is deliberately NO special API for the adversary:
 * it drives this exact same submit() interface.
 *
 * Properties (reused from the Stage-2 substrate):
 *   - NO_WALLET_TOUCH must be true
 *   - the authority manifest is hash-pinned in this module; tamper ⇒ DENY everything
 *   - global forbidden_operations always DENY
 *   - each agent is limited to its own scope.operations subset (cross-agent ⇒ DENY)
 *   - agents cannot create/authorize other agents or modify the manifest
 *   - every submit produces an append-only receipt (decision + state)
 *
 * This is a local, self-contained research harness. No mainnet, no wallet, no
 * authority inheritance, no load-bearing path. Nothing here grants authority.
 */
"use strict";

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const DIR = path.dirname(__filename);
const MANIFEST_PATH = path.join(DIR, "stage4-manifest.json");
const RECEIPT_DIR = path.join(DIR, "receipts");
const RECEIPT_LOG = path.join(DIR, "receipts.jsonl");

/** Pinned SHA-256 of stage4-manifest.json — recompute when the manifest changes. */
const PINNED_MANIFEST_HASH =
  "b2234eb62b7435c25004f65ae55206edf63bc53c5dac6cc6458d08ed0fdc6be4";

function nowIso() {
  return new Date().toISOString().replace(/\.\d{3}Z$/, "Z");
}

function sha256(buf) {
  return crypto.createHash("sha256").update(buf).digest("hex");
}

/** Load + verify the manifest. Returns { ok, manifest, hash, code } or { ok:false, code }. */
function loadManifest() {
  let raw;
  try {
    raw = fs.readFileSync(MANIFEST_PATH, "utf8");
  } catch (e) {
    return { ok: false, code: "MANIFEST_UNREADABLE", reason: e.message };
  }
  const hash = sha256(raw);
  if (hash !== PINNED_MANIFEST_HASH) {
    return {
      ok: false,
      code: "MANIFEST_TAMPER_DETECTED",
      reason: `expected ${PINNED_MANIFEST_HASH}, got ${hash}`,
      expected_hash: PINNED_MANIFEST_HASH,
      actual_hash: hash,
    };
  }
  let manifest;
  try {
    manifest = JSON.parse(raw);
  } catch (e) {
    return { ok: false, code: "MANIFEST_INVALID_JSON", reason: e.message };
  }
  return { ok: true, manifest, hash };
}

function ensureDirs() {
  fs.mkdirSync(RECEIPT_DIR, { recursive: true });
}
/**
 * Submit an action through the shared authority boundary.
 *
 * @param {Object} act - { agent, operation, target?, note? }
 * @returns {Object} receipt { decision, code, reason, manifest_hash, state }
 */
function submit(act = {}) {
  ensureDirs();
  const agent = String(act.agent || "");
  const operation = String(act.operation || "");
  const target = act.target ? String(act.target) : null;
  const note = act.note || null;
  const at = nowIso();

  // 0. Standing boundary
  if (process.env.NO_WALLET_TOUCH !== "true") {
    const r = { decision: "DENY", code: "NO_WALLET_TOUCH_REQUIRED", reason: "standing boundary", manifest_hash: null, agent, operation };
    persistReceipt({ at, ...r });
    return r;
  }

  // 1. Manifest integrity (hash-pinned, non-escalation)
  const loaded = loadManifest();
  if (!loaded.ok) {
    const r = { decision: "DENY", code: loaded.code, reason: loaded.reason, manifest_tamper: true, manifest_hash: loaded.actual_hash || null, agent, operation };
    persistReceipt({ at, ...r });
    return r;
  }
  const manifest = loaded.manifest;
  const manifestHash = loaded.hash;

  // 2. Agent must exist
  if (!manifest.agents[agent]) {
    const r = { decision: "DENY", code: "UNKNOWN_AGENT", reason: `no such agent '${agent}'`, manifest_hash: manifestHash, agent, operation };
    persistReceipt({ at, ...r });
    return r;
  }

  // 3. Global forbidden operations always DENY (authority creation, manifest write, etc.)
  if (manifest.forbidden_operations.includes(operation)) {
    const r = { decision: "DENY", code: "FORBIDDEN_OPERATION", reason: `operation '${operation}' is globally forbidden`, manifest_hash: manifestHash, agent, operation, target };
    persistReceipt({ at, ...r });
    return r;
  }

  // 4. Per-agent scope check — operation must be in THIS agent's scope
  const agentOps = manifest.agents[agent].operations || [];
  if (!agentOps.includes(operation)) {
    const r = { decision: "DENY", code: "OPERATION_NOT_IN_AGENT_SCOPE", reason: `'${operation}' not in agent ${agent} scope`, manifest_hash: manifestHash, agent, operation, target };
    persistReceipt({ at, ...r });
    return r;
  }

  // 5. ALLOW — operation within this agent's frozen scope
  const r = {
    decision: "ALLOW",
    code: "OK",
    reason: `'${operation}' is within agent ${agent} scope`,
    manifest_hash: manifestHash,
    agent,
    operation,
    target,
    note,
    state: { agent, operation, performed: true },
  };
  persistReceipt({ at, ...r });
  return r;
}

function persistReceipt(r) {
  const rec = { ...r, at_utc: r.at || nowIso() };
  fs.appendFileSync(RECEIPT_LOG, JSON.stringify(rec) + "\n", "utf8");
}

/** Reset the run-local ledger. */
function resetLedger() {
  try { if (fs.existsSync(RECEIPT_LOG)) fs.unlinkSync(RECEIPT_LOG); } catch { /* ignore */ }
}

/** Read the full append-only ledger as an array. */
function readLedger() {
  if (!fs.existsSync(RECEIPT_LOG)) return [];
  return fs
    .readFileSync(RECEIPT_LOG, "utf8")
    .split("\n")
    .filter(Boolean)
    .map((l) => JSON.parse(l));
}

module.exports = {
  submit,
  loadManifest,
  resetLedger,
  readLedger,
  verifyManifestHash: (raw) => ({ ok: sha256(raw) === PINNED_MANIFEST_HASH, hash: sha256(raw), expected: PINNED_MANIFEST_HASH }),
  PINNED_MANIFEST_HASH,
  MANIFEST_PATH,
  RECEIPT_LOG,
  RECEIPT_DIR,
};

if (require.main === module) {
  process.env.NO_WALLET_TOUCH = process.env.NO_WALLET_TOUCH || "true";
  const agent = process.argv[2] || "A";
  const op = process.argv[3] || "verify";
  console.log(JSON.stringify(submit({ agent, operation: op, target: process.argv[4] || null }), null, 2));
}

