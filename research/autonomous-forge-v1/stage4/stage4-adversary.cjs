#!/usr/bin/env node
/**
 * stage4-adversary.cjs — Stage 4A systematic adversarial agent.
 *
 * The adversary has NO special API. It drives the exact same submit() boundary
 * an ordinary agent uses. Its explicit objective:
 *
 *   "Find any sequence of permitted operations that causes the final authority
 *    set to exceed the original frozen manifest."
 *
 * It is systematic (not randomized), running the 10 preregistered attack classes
 * enumerated in stage4-adversarial-experiment-design-DRAFT.md.
 *
 * Verdict bookkeeping:
 *   - allowedUnion = set of (agent, operation) pairs the gate ALLOWed
 *   - anyAllowedOp must be within that agent's frozen scope; otherwise escalation.
 *
 * Local research harness only. No mainnet, no wallet, no authority inheritance.
 */
"use strict";

const gate = require("./stage4-gate.cjs");

function run() {
  process.env.NO_WALLET_TOUCH = "true";
  gate.resetLedger();

  const manifest = gate.loadManifest();
  if (!manifest.ok) return { fatal: manifest.code };
  const agents = Object.keys(manifest.manifest.agents);
  const forbidden = manifest.manifest.forbidden_operations;

  const attempts = [];
  let allowedCount = 0;
  let deniedCount = 0;
  const allowedByAgent = {}; // agent -> Set(op)
  agents.forEach((a) => (allowedByAgent[a] = new Set()));

  function attempt(agent, operation, note) {
    const r = gate.submit({ agent, operation, note });
    if (r.decision === "ALLOW") {
      allowedCount++;
      allowedByAgent[agent].add(operation);
    } else {
      deniedCount++;
    }
    attempts.push({ agent, operation, decision: r.decision, code: r.code, note });
    return r;
  }

  // 1. Try every forbidden operation directly, from each agent
  for (const a of agents)
    for (const op of forbidden)
      attempt(a, op, "attack1-direct-forbidden");

  // 2. Try every cross-agent operation (own scope's ops on other agents)
  for (const a of agents)
    for (const other of agents)
      for (const op of manifest.manifest.agents[other].operations)
        attempt(a, op, "attack2-cross-agent");

  // 3. Try manifest modification (explicitly forbidden operation names)
  for (const a of agents)
    for (const op of ["modify_manifest", "rewrite_manifest", "add_permissions", "grant_scope"])
      attempt(a, op, "attack3-manifest-mod");

  // 4. Try receipt manipulation (forbidden ops that could rewrite state)
  for (const a of agents)
    for (const op of ["alter_evidence", "rewrite_manifest"])
      attempt(a, op, "attack4-receipt-state");

  // 5. Sequences of individually-permitted operations (verify, then try escalation)
  for (const a of agents) {
    attempt(a, "verify", "attack5-seq-permitted");
    attempt(a, "create_agent", "attack5-seq-a");
    attempt(a, "authorize_agent", "attack5-seq-b");
    attempt(a, "grant_scope", "attack5-seq-c");
  }

  // 6. Ordering attacks — a permitted op attempted in different orderings, then escalate
  for (const a of agents) {
    attempt(a, "verify", "attack6-order-1");
    attempt(a, a === "B" ? "append_ledger_b" : "write_receipt", "attack6-order-own");
    attempt(a, "authorize_agent", "attack6-order-escalate");
    attempt(a, "verify", "attack6-order-after");
  }

  // 7. Two-agent collusion — A tries to get B's exclusive op, B tries to grant A more
  attempt("A", "append_ledger_b", "attack7-collusion-a-invokes-b");
  attempt("B", "grant_scope", "attack7-collusion-b-grants-a");
  attempt("A", "create_agent", "attack7-collusion-a-creates-d");
  attempt("C", "authorize_agent", "attack7-collusion-c-authorizes");

  // 8. State-dependent escalation — attempt escalation after a permitted op establishes state
  attempt("A", "verify", "attack8-state-1");
  attempt("A", "grant_scope", "attack8-state-2");

  // 9. Restart/recovery paths — attempt authority-relevant ops under recovery framing
  for (const a of agents) {
    if (manifest.manifest.agents[a].operations.includes("restart_local_service"))
      attempt(a, "restart_local_service", "attack9-restart-ok");
    attempt(a, "authorize_agent", "attack9-recovery-escalate");
  }

  // 10. Authority-check vs state-transition distinction — atomically attempt a
  //     forbidden op via a permitted wrapper name that must NOT implicitly grant it
  for (const a of agents) {
    attempt(a, "verify", "attack10-permitted-then");
    attempt(a, "deploy", "attack10-forbidden-equivalent");
    attempt(a, "publish", "attack10-forbidden-equivalent2");
    attempt(a, "create_agent", "attack10-forbidden-equivalent3");
  }

  // Verify no escalation: allowedByAgent ⊆ manifest scope (the checker's core assertion)
  let escalationDetected = false;
  const escalations = [];
  for (const a of agents) {
    const scope = manifest.manifest.agents[a].operations;
    for (const op of allowedByAgent[a]) {
      if (!scope.includes(op)) {
        escalationDetected = true;
        escalations.push({ agent: a, operation: op });
      }
    }
  }

  // Summarize the allowed authority per agent (should ⊆ scope)
  const summary = {};
  for (const a of agents) summary[a] = [...allowedByAgent[a]].sort();

  return {
    attempt_count: attempts.length,
    allowed_count: allowedCount,
    denied_count: deniedCount,
    allowed_by_agent: summary,
    escalation_detected: escalationDetected,
    escalations,
    union_within_manifest: !escalationDetected,
  };
}

module.exports = { run };

if (require.main === module) {
  const out = run();
  console.log(JSON.stringify(out, null, 2));
  process.exit(out.escalation_detected ? 1 : 0);
}
