#!/usr/bin/env node
/**
 * stage4b-child.cjs — fault-injection child worker (spawned by stage4b-runner.cjs).
 *
 * Modes (argv): <mode> <runId> <agent> <opsCsv> [cutPoint] [count]
 *   crash      — submit first op, mirror ALLOW to 4B log, then:
 *                cut "after_authorize": die before state_transition (SIGKILL self)
 *                cut "mid_persist": write a torn (truncated) 4B receipt line, then die
 *   concurrent — loop `count` submits over opsCsv with random delays (interleaving)
 *   stale      — build a MODIFIED in-memory manifest view (grants agent extra ops),
 *                record stale_attempt, then submit through the REAL gate (disk re-read)
 *
 * Every authority decision goes through the shared Stage 4A gate.submit() boundary.
 * Local research only: no mainnet, no wallet, no authority inheritance.
 */
"use strict";
const { execSync } = require("child_process");
const gate = require("../stage4/stage4-gate.cjs");
const log = require("./stage4b-log.cjs");

process.env.NO_WALLET_TOUCH = "true";

const [mode, runId, agent, opsCsv, cutPoint, countArg] = process.argv.slice(2);
const ops = (opsCsv || "verify").split(",");
const count = parseInt(countArg || "6", 10);

function mirrorDecision(r, opSeq, extra) {
  log.append({
    kind: "decision", run_id: runId, op_seq: opSeq,
    at_utc: r.at_utc, decision: r.decision, code: r.code, reason: r.reason,
    manifest_hash: r.manifest_hash, agent: r.agent, operation: r.operation,
    ...(extra || {}),
  });
  return r;
}

function stateTransition(r, opSeq) {
  log.append({
    kind: "state_transition", run_id: runId, op_seq: opSeq,
    at_utc: new Date().toISOString().replace(/\.\d{3}Z$/, "Z"),
    agent: r.agent, operation: r.operation,
    allow_ref: { run_id: runId, agent: r.agent, op_seq: opSeq },
    state_after: { agent: r.agent, operation: r.operation, performed: true },
  });
}

if (mode === "crash") {
  const opSeq = log.nextOpSeq(runId, agent);
  const r = mirrorDecision(gate.submit({ agent, operation: ops[0], note: "crash-fault" }), opSeq);
  if (cutPoint === "mid_persist") {
    // Torn write: truncated JSON, no newline — simulates crash mid-append.
    const torn = JSON.stringify({ kind: "decision", run_id: runId, op_seq: opSeq + 1000, decision: "ALLOW", agent, operation: "mint", manifest_hash: "de.adbe.e" + "f".repeat(48) }).slice(0, 60);
    require("fs").appendFileSync(log.RECEIPT_LOG, torn, "utf8");
  }
  // Crash at the cut point (SIGKILL self — no cleanup handlers run).
  process.kill(process.pid, "SIGKILL");
} else if (mode === "concurrent") {
  for (let i = 0; i < count; i++) {
    const op = ops[i % ops.length];
    const opSeq = log.nextOpSeq(runId, agent);
    const r = mirrorDecision(gate.submit({ agent, operation: op, note: `concurrent-${i}` }), opSeq);
    if (r.decision === "ALLOW") stateTransition(r, opSeq);
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, Math.floor(Math.random() * 12));
  }
  process.exit(0);
} else if (mode === "stale") {
  // Intentionally stale/modified in-memory manifest snapshot.
  const real = JSON.parse(require("fs").readFileSync(gate.MANIFEST_PATH, "utf8"));
  const stale = JSON.parse(JSON.stringify(real));
  stale.agents[agent].operations = [...stale.agents[agent].operations, "mint", "write_receipt"];
  const staleHash = require("crypto").createHash("sha256").update(JSON.stringify(stale)).digest("hex");
  const opSeq = log.nextOpSeq(runId, agent);
  const r = gate.submit({ agent, operation: ops[0], note: "stale-view-attempt" });
  log.append({
    kind: "stale_attempt", run_id: runId, op_seq: opSeq,
    at_utc: new Date().toISOString().replace(/\.\d{3}Z$/, "Z"),
    agent, operation: ops[0],
    stale_view_manifest_hash: staleHash,
    stale_view_granted: ["mint", "write_receipt"],
    actual_decision: r.decision,
    actual_manifest_hash: r.manifest_hash,
    committed: r.decision === "ALLOW",
    note: "stale in-memory view; gate re-read authoritative on-disk manifest",
  });
  if (r.decision === "ALLOW") {
    mirrorDecision(r, opSeq, { stale_replay: true });
    stateTransition(r, opSeq);
  } else {
    mirrorDecision(r, opSeq, { stale_rejected: true });
  }
  process.exit(0);
} else {
  console.error("unknown mode", mode);
  process.exit(2);
}
