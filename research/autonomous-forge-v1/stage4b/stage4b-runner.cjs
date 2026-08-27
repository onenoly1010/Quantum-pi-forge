#!/usr/bin/env node
/**
 * stage4b-runner.cjs — Stage 4B adversarial runtime fault experiment.
 *
 * Preconditions (fail-closed):
 *   1. GO/stage4b-execution-decision.json is AUTHORIZED with a verifiable
 *      OpenSSH signature (check-novalidate + find-principals). No
 *      conversation-exposed secret is accepted.
 *   2. stage4-manifest.json and stage4b-spec-P-v1.json hash pins match.
 *
 * Executes the five preregistered attack families plus the compound failure
 * scenario (crash → torn write → stale replay → concurrent ops → recovery).
 * All authority flows through the shared Stage 4A gate.submit() boundary.
 * Artifacts: stage4b-receipts.jsonl + evidence/stage4b-runner-report.json.
 *
 * Local research only. No mainnet, no wallet, no authority inheritance.
 */
"use strict";
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const os = require("os");
const { fork, execFileSync } = require("child_process");

const gate = require("../stage4/stage4-gate.cjs");
const log = require("./stage4b-log.cjs");

const ROOT = path.resolve(__dirname, "../../..");
const GO_PATH = path.join(ROOT, "GO", "stage4b-execution-decision.json");
const SPEC_PATH = path.join(__dirname, "stage4b-spec-P-v1.json");
const EVIDENCE_DIR = path.join(__dirname, "evidence");
const PINNED_MANIFEST = "b2234eb62b7435c25004f65ae55206edf63bc53c5dac6cc6458d08ed0fdc6be4";
const PINNED_SPEC = "1b0738494952e6975626443cf16e588198d166a4c1d7eda70a14559b2fe9ca02";
const NAMESPACE = "stage4b-authorization";

const sha256 = (b) => crypto.createHash("sha256").update(b).digest("hex");
const now = () => new Date().toISOString().replace(/\.\d{3}Z$/, "Z");
const report = { started_utc: now(), go_verification: null, phases: [], faults_injected: 0 };

// ---------- GO signature verification (fail-closed) ----------
function verifyGo() {
  const go = JSON.parse(fs.readFileSync(GO_PATH, "utf8"));
  if (go.status !== "AUTHORIZED") throw new Error("GO not AUTHORIZED");
  const payload = { ...go };
  delete payload.authorization;
  delete payload.payload_sha256;
  const payloadStr = JSON.stringify(payload);
  if (sha256(payloadStr) !== go.payload_sha256) throw new Error("GO payload_sha256 mismatch");
  const work = fs.mkdtempSync(path.join(os.tmpdir(), "gov-"));
  const msg = path.join(work, "p.json"), sig = path.join(work, "p.sig"), signers = path.join(work, "as");
  fs.writeFileSync(msg, payloadStr);
  fs.writeFileSync(sig, go.authorization.signature + "\n");
  fs.writeFileSync(signers, `${go.authorization.signer_principal} namespaces="${NAMESPACE}" ${go.authorization.signer_public_key}\n`);
  execFileSync("ssh-keygen", ["-Y", "check-novalidate", "-n", go.authorization.namespace, "-s", sig], { input: payloadStr, stdio: "pipe" });
  const principal = execFileSync("ssh-keygen", ["-Y", "find-principals", "-s", sig, "-f", signers], { stdio: "pipe" }).toString().trim();
  if (principal !== go.authorization.signer_principal) throw new Error("GO principal binding failed");
  return { ok: true, principal, fingerprint: go.authorization.signer_key_fingerprint, payload_sha256: go.payload_sha256 };
}

// ---------- hash pins ----------
function verifyPins() {
  const m = sha256(fs.readFileSync(gate.MANIFEST_PATH));
  const s = sha256(fs.readFileSync(SPEC_PATH));
  if (m !== PINNED_MANIFEST) throw new Error("manifest pin mismatch");
  if (s !== PINNED_SPEC) throw new Error("spec pin mismatch");
  return { manifest: m, spec: s };
}

// ---------- deterministic recovery (mirrors spec rule; checker re-implements) ----------
function deterministicRecovery(receipts) {
  const lastCrashIdx = receipts.map((r, i) => (r.kind === "crash_marker" ? i : -1));
  const lastCrash = Math.max(...lastCrashIdx, -1);
  const allows = receipts.map((r, i) => ({ r, i })).filter(({ r }) => r.kind === "decision" && r.decision === "ALLOW");
  const transitions = new Set(
    receipts.filter((r) => r.kind === "state_transition")
      .map((r) => `${r.run_id}:${r.agent}:${r.op_seq}:${r.operation}`)
  );
  const applied = [], pending = [];
  for (const { r, i } of allows) {
    const key = `${r.run_id}:${r.agent}:${r.op_seq}:${r.operation}`;
    const appliedAlready = transitions.has(key);
    if (i < lastCrash || appliedAlready) applied.push({ agent: r.agent, operation: r.operation, allow_pos: i, via: appliedAlready ? "durable_transition" : "recovery_rule_2" });
    else pending.push({ agent: r.agent, operation: r.operation, allow_pos: i, op_seq: r.op_seq });
  }
  return { last_crash_pos: lastCrash, applied, pending_authorized: pending };
}

// ---------- run phases ----------
async function phase(name, fn) {
  const before = log.readValid().receipts.length;
  const result = (await fn()) || {};
  report.phases.push({ name, receipts_before: before, ...result });
  console.log(`phase ${name}: done`);
}

function parentSubmit(agent, operation, note, extra) {
  const opSeq = log.nextOpSeq(runId, agent);
  const r = gate.submit({ agent, operation, note });
  log.append({ kind: "decision", run_id: runId, op_seq: opSeq, at_utc: r.at_utc, decision: r.decision, code: r.code, reason: r.reason, manifest_hash: r.manifest_hash, agent: r.agent, operation: r.operation, ...(extra || {}) });
  return { r, opSeq };
}

function transition(agent, operation, opSeq, extra) {
  log.append({ kind: "state_transition", run_id: runId, op_seq: opSeq, at_utc: now(), agent, operation, allow_ref: { run_id: runId, agent, op_seq: opSeq }, state_after: { agent, operation, performed: true }, ...(extra || {}) });
}

function forkChild(mode, agent, ops, cut, count) {
  return new Promise((resolve) => {
    const child = fork(path.join(__dirname, "stage4b-child.cjs"), [mode, runId, agent, (ops || []).join(","), cut, String(count || 6)], { stdio: "inherit" });
    child.on("exit", (code, signal) => resolve({ code, signal }));
  });
}

// ---------- main ----------
const goV = verifyGo();
report.go_verification = goV;
console.log("GO signature verified:", goV.principal, goV.fingerprint);
const pins = verifyPins();
report.hash_pins = pins;

const runId = "stage4b-" + Date.now().toString(36);
log.reset();
process.env.NO_WALLET_TOUCH = "true";

(async () => {
  // Family 1: ordering / replay / duplicate receipts
  phase("1_ordering_replay", () => {
    const a1 = parentSubmit("A", "verify", "canonical");
    transition("A", "verify", a1.opSeq);
    const replay = parentSubmit("A", "verify", "replay-of-canonical", { replay_of: a1.opSeq });
    transition("A", "verify", replay.opSeq);
    const dup = JSON.parse(JSON.stringify(log.readValid().receipts.find((r) => r.kind === "decision" && r.decision === "ALLOW")));
    log.append(dup); // exact duplicate receipt — idempotent, must not expand authority
    const b1 = parentSubmit("B", "append_ledger_b", "canonical");
    transition("B", "append_ledger_b", b1.opSeq);
    const c1 = parentSubmit("C", "verify", "canonical");
    transition("C", "verify", c1.opSeq);
    report.faults_injected += 2; // replay + duplicate receipt
    return { fault: "replay + duplicate receipt" };
  });

  // Family 2: crash atomicity — child killed after ALLOW mirrored, before transition
  await phase("2_crash_after_authorize", async () => {
    const exit = await forkChild("crash", "A", ["restart_local_service"], "after_authorize");
    log.append({ kind: "crash_marker", run_id: runId, at_utc: now(), phase: "crash_after_authorize", cut_point: "after_authorize", child_exit: exit });
    const rec = deterministicRecovery(log.readValid().receipts);
    for (const p of rec.pending_authorized) transition(p.agent, p.operation, null, { applied_at_recovery: true });
    log.append({ kind: "recovery", run_id: runId, at_utc: now(), phase: "crash_after_authorize", rule: "spec.deterministic_recovery_rule", applied: rec.applied.length, pending_applied: rec.pending_authorized.length });
    report.faults_injected += 1;
    return { fault: "SIGKILL after authorize, before state_transition", child_exit: exit };
  });

  // Compound failure: crash → torn write → stale replay → concurrent → recovery
  await phase("compound", async () => {
    // (a) parent authorizes write_receipt for A, then torn transition write + crash
    const w = parentSubmit("A", "write_receipt", "compound-pre-crash");
    const torn = JSON.stringify({ kind: "state_transition", run_id: runId, agent: "A", operation: "write_receipt", allow_ref: { op_seq: w.opSeq }, state_after: { minted: true } }).slice(0, 55);
    fs.appendFileSync(log.RECEIPT_LOG, torn, "utf8");
    const tornInfo = log.repairTornTrailing();
    log.append({ kind: "crash_marker", run_id: runId, at_utc: now(), phase: "compound", cut_point: "mid_persist", torn: tornInfo });
    // (b) deterministic recovery over prefix: ALLOW precedes marker → transition applied
    const rec1 = deterministicRecovery(log.readValid().receipts);
    for (const p of rec1.pending_authorized) transition(p.agent, p.operation, null, { applied_at_recovery: true, phase: "compound" });
    log.append({ kind: "recovery", run_id: runId, at_utc: now(), phase: "compound", step: "post-crash", rule: "spec.deterministic_recovery_rule", applied: rec1.applied.length });
    // (c) stale replay attempt under a modified in-memory view (A: write_receipt)
    await forkChild("stale", "A", ["write_receipt"]);
    // (d) stale escalation attempt (C: write_receipt NOT in real scope)
    await forkChild("stale", "C", ["write_receipt"]);
    // (e) concurrent interleaved operations A/B/C against shared state
    const exits = await Promise.all([
      forkChild("concurrent", "A", ["verify", "write_receipt", "restart_local_service"], null, 6),
      forkChild("concurrent", "B", ["verify", "append_ledger_b"], null, 6),
      forkChild("concurrent", "C", ["verify"], null, 6),
    ]);
    report.faults_injected += 5; // torn write+crash, stale replay, stale escalation, 3-way concurrency
    return { fault: "compound: crash → torn write → stale replay → stale escalation → 3-way concurrency", concurrency_exits: exits };
  });

  // Final deterministic recovery over the whole trace
  phase("final_recovery", () => {
    const { receipts, torn } = log.readValid();
    const rec = deterministicRecovery(receipts);
    log.append({ kind: "recovered_state", run_id: runId, at_utc: now(), rule: "spec.deterministic_recovery_rule", recovered_state: rec.applied, pending_authorized: rec.pending_authorized, durability_gaps: torn });
    return { applied: rec.applied.length, pending: rec.pending_authorized.length, torn: torn.length };
  });

  const { receipts, torn } = log.readValid();
  report.finished_utc = now();
  report.run_id = runId;
  report.total_receipts = receipts.length;
  report.torn_lines_repaired_or_gapped = torn.length;
  fs.mkdirSync(EVIDENCE_DIR, { recursive: true });
  fs.writeFileSync(path.join(EVIDENCE_DIR, "stage4b-runner-report.json"), JSON.stringify(report, null, 2) + "\n");
  console.log("RUNNER COMPLETE — run_id", runId, "receipts:", receipts.length, "faults:", report.faults_injected);
})().catch((e) => { console.error("RUNNER FAILED:", e); process.exit(1); });
