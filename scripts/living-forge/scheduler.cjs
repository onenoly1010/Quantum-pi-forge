#!/usr/bin/env node
/**
 * Living Forge scheduler — persistent queue claim + P3 autonomous execution.
 * No signing, no wallet moves, no commit/push, no secrets.
 *
 * Usage:
 *   node scripts/living-forge/scheduler.cjs              # one cycle
 *   node scripts/living-forge/scheduler.cjs --seed       # seed default tasks
 *   node scripts/living-forge/scheduler.cjs --drain      # run until no P3 left
 *   node scripts/living-forge/scheduler.cjs --human-queue # print P0/P1 only
 */
"use strict";

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const ROOT = path.resolve(__dirname, "../..");
const QUEUE_PATH = path.join(ROOT, "docs/activation/living-forge/queue/queue-state-v1.json");
const HEARTBEAT_DIR = path.join(ROOT, "docs/activation/living-forge/heartbeats");
const HUMAN_QUEUE_PATH = path.join(ROOT, "docs/activation/living-forge/HUMAN_ACTION_QUEUE_V1.md");

function now() {
  return new Date().toISOString().replace(/\.\d{3}Z$/, "Z");
}

function loadQueue() {
  const raw = fs.readFileSync(QUEUE_PATH, "utf8");
  return JSON.parse(raw);
}

function saveQueue(q) {
  q.updated_at_utc = now();
  fs.writeFileSync(QUEUE_PATH, JSON.stringify(q, null, 2) + "\n");
}

function sh(cmd, timeoutMs = 120000) {
  try {
    const out = execSync(cmd, {
      cwd: ROOT,
      encoding: "utf8",
      timeout: timeoutMs,
      stdio: ["ignore", "pipe", "pipe"],
    });
    return { ok: true, out: (out || "").slice(0, 8000), code: 0 };
  } catch (e) {
    return {
      ok: false,
      out: ((e.stdout || "") + (e.stderr || "") + (e.message || "")).slice(0, 8000),
      code: e.status == null ? 1 : e.status,
    };
  }
}

/** Health/recurring tasks re-open after this many ms when --drain or --once with reopen */
const RECURRING_TTL_MS = 15 * 60 * 1000;

const SEED_TASKS = [
  {
    id: "P3-health-evidence-index",
    priority: 3,
    title: "Verify evidence index",
    status: "open",
    action: "verify_evidence_index",
    recurring: true,
  },
  {
    id: "P3-health-wallet-preflight",
    priority: 3,
    title: "Wallet preflight non-executing",
    status: "open",
    action: "wallet_preflight",
    recurring: true,
  },
  {
    id: "P3-health-build",
    priority: 3,
    title: "Static site build",
    status: "open",
    action: "npm_build",
    recurring: true,
  },
  {
    id: "P3-inventory-offline-paths",
    priority: 3,
    title: "Inventory offline-critical paths",
    status: "open",
    action: "offline_inventory",
    recurring: true,
  },
  {
    id: "P3-classify-dirty-tree",
    priority: 3,
    title: "Classify dirty working tree",
    status: "open",
    action: "dirty_tree_classify",
    recurring: true,
  },
  {
    id: "P3-funding-status-snapshot",
    priority: 3,
    title: "Snapshot funding PENDING state from sealed files",
    status: "open",
    action: "funding_snapshot",
    recurring: true,
  },
  {
    id: "P3-human-queue-refresh",
    priority: 3,
    title: "Refresh ranked human action queue",
    status: "open",
    action: "write_human_queue",
    recurring: true,
  },
  {
    id: "P3-funding-monitor",
    priority: 3,
    title: "Funding signal monitor (read-only)",
    status: "open",
    action: "funding_monitor",
    recurring: true,
  },
  {
    id: "P3-reality-engine",
    priority: 3,
    title: "Reality Engine collect+diff+brief (read-only)",
    status: "open",
    action: "reality_engine",
    recurring: true,
  },
  {
    id: "P2-grant-external",
    priority: 2,
    title: "Grant portal status (external human identity)",
    status: "open",
    action: "external_only",
    owner: "kris",
  },
  {
    id: "P1-receiving-spec",
    priority: 1,
    title: "Fill FUNDING_RECEIVING_SPEC public destination fields",
    status: "open",
    action: "human_only",
    owner: "kris",
  },
  {
    id: "P1-spiral-deadline",
    priority: 1,
    title: "Authorize Spiral Return deadline date",
    status: "open",
    action: "human_only",
    owner: "kris",
  },
  {
    id: "P1-physical-M01-M04",
    priority: 1,
    title: "Confirm or WAIVE physical readiness M-01..M-04",
    status: "open",
    action: "human_only",
    owner: "kris",
  },
  {
    id: "P1-authorize-commit",
    priority: 1,
    title: "Authorize commit of activation/living-forge evidence pack",
    status: "open",
    action: "human_only",
    owner: "kris",
  },
  {
    id: "P0-any-sign-or-transfer",
    priority: 0,
    title: "No sign/transfer unless explicitly authorized (standing guard)",
    status: "open",
    action: "guard",
    owner: "policy",
  },
];

function seed(q) {
  const byId = new Map(q.tasks.map((t) => [t.id, t]));
  for (const t of SEED_TASKS) {
    if (!byId.has(t.id)) {
      q.tasks.push({ ...t, created_at_utc: now(), attempts: 0, last_result: null });
    } else {
      // Keep recurring flag current from seed definition
      const existing = byId.get(t.id);
      if (t.recurring) existing.recurring = true;
    }
  }
  return q;
}

/**
 * Re-open recurring done/failed tasks.
 * force=true (on --drain): always re-open so heartbeat stays live.
 * force=false: only if older than RECURRING_TTL_MS.
 */
function reopenRecurring(q, force) {
  const cutoff = Date.now() - RECURRING_TTL_MS;
  let n = 0;
  for (const t of q.tasks) {
    if (!t.recurring) continue;
    if (t.status !== "done" && t.status !== "failed") continue;
    const finished = t.finished_at_utc ? Date.parse(t.finished_at_utc) : 0;
    if (force || !finished || finished <= cutoff) {
      t.status = "open";
      t.reopened_at_utc = now();
      n++;
    }
  }
  return n;
}

function claimNextP3(q) {
  const open = q.tasks
    .filter((t) => t.status === "open" && t.priority === 3)
    .sort((a, b) => a.id.localeCompare(b.id));
  return open[0] || null;
}

function runAction(task) {
  const ts = now().replace(/[:.]/g, "").slice(0, 15);
  switch (task.action) {
    case "verify_evidence_index": {
      const r = sh("npm run verify:evidence-index");
      return { ok: r.ok, summary: r.ok ? "evidence-index PASS" : "evidence-index FAIL", detail: r.out };
    }
    case "wallet_preflight": {
      const r = sh("npm run security:wallet-preflight-gate:v1:check");
      const pass = r.ok && /WALLET_PREFLIGHT_GATE_V1_PASS=TRUE/.test(r.out);
      return { ok: pass, summary: pass ? "wallet preflight PASS non-executing" : "wallet preflight FAIL", detail: r.out.slice(-1500) };
    }
    case "npm_build": {
      const r = sh("npm run build", 180000);
      return { ok: r.ok, summary: r.ok ? "build PASS" : "build FAIL", detail: r.out.slice(-1500) };
    }
    case "offline_inventory": {
      const paths = [
        "README.md",
        "STATUS.md",
        "REVIEWER_START_HERE.md",
        "AUDIT.md",
        "evidence/INDEX.md",
        "contracts/DEPLOYED_ADDRESSES.md",
        "0G_GRANT_STATUS_TRACKING.md",
        "docs/activation/command/MISSION_DASHBOARD_V1.md",
        "docs/activation/command/FUNDING_RECEIVING_SPEC_V1.md",
        "docs/activation/living-forge/ESCALATION_POLICY_V1.md",
        "receipts/spiral-return/spiral-return-funding-action-plan-v1.json",
      ];
      const lines = paths.map((p) => {
        const abs = path.join(ROOT, p);
        return `${fs.existsSync(abs) ? "EXISTS" : "MISSING"} ${p}`;
      });
      const outPath = path.join(HEARTBEAT_DIR, `offline-inventory-${ts}.txt`);
      fs.mkdirSync(HEARTBEAT_DIR, { recursive: true });
      fs.writeFileSync(outPath, lines.join("\n") + "\n");
      const missing = lines.filter((l) => l.startsWith("MISSING")).length;
      return { ok: missing === 0, summary: `offline inventory missing=${missing}`, detail: outPath };
    }
    case "dirty_tree_classify": {
      const r = sh("git status --porcelain");
      const lines = (r.out || "").trim().split("\n").filter(Boolean);
      const classified = lines.map((line) => {
        const f = line.replace(/^.../, "").trim();
        let cls = "AI_or_agent_work";
        if (f.startsWith("cache/") || f.includes("compile-cache")) cls = "build_artifact";
        if (f.includes("node_modules")) cls = "dependency_noise";
        return { line, class: cls };
      });
      const outPath = path.join(HEARTBEAT_DIR, `dirty-tree-${ts}.json`);
      fs.mkdirSync(HEARTBEAT_DIR, { recursive: true });
      fs.writeFileSync(
        outPath,
        JSON.stringify({ at: now(), count: classified.length, items: classified }, null, 2) + "\n"
      );
      return { ok: true, summary: `dirty tree classified n=${classified.length}`, detail: outPath };
    }
    case "funding_snapshot": {
      const plan = JSON.parse(
        fs.readFileSync(path.join(ROOT, "receipts/spiral-return/spiral-return-funding-action-plan-v1.json"), "utf8")
      );
      const snap = {
        at: now(),
        confirmed_secured_total: plan.confirmed_secured_total,
        remaining_gap: plan.remaining_gap,
        funding_movement: plan.funding_movement,
        currency: plan.currency,
        status: plan.confirmed_secured_total > 0 ? "VERIFIED_FUNDS" : "PENDING_NO_SECURED_FUNDS",
      };
      const outPath = path.join(HEARTBEAT_DIR, `funding-snapshot-${ts}.json`);
      fs.mkdirSync(HEARTBEAT_DIR, { recursive: true });
      fs.writeFileSync(outPath, JSON.stringify(snap, null, 2) + "\n");
      return { ok: true, summary: `funding ${snap.status} secured=${snap.confirmed_secured_total}`, detail: outPath };
    }
    case "write_human_queue": {
      writeHumanQueue(loadQueue());
      return { ok: true, summary: "human queue refreshed", detail: HUMAN_QUEUE_PATH };
    }
    case "funding_monitor": {
      const r = sh("node scripts/living-forge/monitor-funding-signals.cjs");
      return {
        ok: r.ok,
        summary: r.ok ? "funding monitor ok" : "funding monitor fail",
        detail: r.out.slice(-800),
      };
    }
    case "reality_engine": {
      const r = sh("npm run reality:run", 120000);
      return {
        ok: r.ok,
        summary: r.ok ? "reality engine ok" : "reality engine fail",
        detail: r.out.slice(-1200),
      };
    }
    default:
      return { ok: false, summary: `unknown or non-autonomous action ${task.action}`, detail: "" };
  }
}

function writeHumanQueue(q) {
  // Control-grouped queue: you vs external. No repeated "no funds" monologue.
  const lines = [
    "# HUMAN ACTION QUEUE v1",
    "",
    `Updated: ${now()}`,
    "Mode: Event-driven standby (idle until state change)",
    "",
    "Local autonomous prep is complete when P3=0. Agent wakes on repo/docs changes.",
    "",
    "## Controlled by you",
    "",
    "| Rank | Task | Artifact |",
    "| ---: | --- | --- |",
    "| 1 | Configure receiving form | `docs/activation/command/funding-receiving-form-v1.json` |",
    "| 2 | AUTHORIZE TO RECEIVE | `docs/activation/command/AUTHORIZE_TO_RECEIVE_READY_V1.md` |",
    "| 3 | Merge PR #614 | https://github.com/onenoly1010/Quantum-pi-forge/pull/614 |",
    "| 4 | Send Guild follow-up | `docs/activation/command/grant-package/` |",
    "| 5 | Send revenue offer | `docs/activation/command/revenue/OFFER_ONE_PAGER_AUDIT_WALKTHROUGH_V1.md` |",
    "| 6 | Spiral deadline + physical M-01…M-04 | spiral-return state |",
    "",
    "## Controlled by external parties",
    "",
    "| Task | Party | Agent role |",
    "| --- | --- | --- |",
    "| Grant decision / payout | 0G Guild | Monitor + prepared packages |",
    "| Client payment | Customer | Offer ready |",
    "",
    "## Standing P0",
    "",
    "- Sign / spend / transfer / legal-as-Kris require explicit confirmation.",
    "",
  ];
  const openP3 = q.tasks.filter((t) => t.status === "open" && t.priority === 3).length;
  lines.push(`Open P3 autonomous tasks: **${openP3}**`);
  lines.push("");
  fs.writeFileSync(HUMAN_QUEUE_PATH, lines.join("\n"));
}

function writeHeartbeat(cycle) {
  fs.mkdirSync(HEARTBEAT_DIR, { recursive: true });
  const p = path.join(HEARTBEAT_DIR, `heartbeat-${now().replace(/[:.]/g, "").slice(0, 15)}.json`);
  fs.writeFileSync(p, JSON.stringify(cycle, null, 2) + "\n");
  return p;
}

function main() {
  const args = process.argv.slice(2);
  let q = loadQueue();
  const drain = args.includes("--drain");

  // Always seed missing tasks; always apply recurring flags
  q = seed(q);
  const reopened = reopenRecurring(q, drain);
  if (reopened) q.metrics.last_reopen_count = reopened;
  saveQueue(q);

  if (args.includes("--human-queue")) {
    writeHumanQueue(q);
    console.log("HUMAN_QUEUE", HUMAN_QUEUE_PATH);
    return;
  }

  // --seed alone: seed+reopen+human queue, no execute
  if (args.includes("--seed") && !drain && args.length === 1) {
    writeHumanQueue(q);
    console.log(JSON.stringify({ phase: "seed", reopened, tasks: q.tasks.length }));
    return;
  }

  const completed = [];
  let guard = 0;
  const max = drain ? 50 : 1;

  while (guard++ < max) {
    const task = claimNextP3(q);
    if (!task) break;

    task.status = "in_progress";
    task.attempts = (task.attempts || 0) + 1;
    task.started_at_utc = now();
    saveQueue(q);

    const result = runAction(task);
    task.last_result = { ok: result.ok, summary: result.summary, at: now() };
    task.status = result.ok ? "done" : "failed";
    task.finished_at_utc = now();
    if (result.ok) q.metrics.autonomous_completed = (q.metrics.autonomous_completed || 0) + 1;
    q.metrics.last_scheduler_run_utc = now();
    saveQueue(q);
    completed.push({ id: task.id, ...result });

    const hb = writeHeartbeat({
      at: now(),
      task: task.id,
      result: result.summary,
      ok: result.ok,
      remaining_p3: q.tasks.filter((t) => t.status === "open" && t.priority === 3).length,
    });
    console.log(JSON.stringify({ task: task.id, ok: result.ok, summary: result.summary, heartbeat: hb }));

    if (!drain) break;
  }

  // Always refresh human queue when P3 exhausted or after drain
  const remainingP3 = q.tasks.filter((t) => t.status === "open" && t.priority === 3).length;
  if (remainingP3 === 0 || drain) {
    writeHumanQueue(q);
    console.log(JSON.stringify({ phase: "human_queue", path: HUMAN_QUEUE_PATH, remaining_p3: remainingP3 }));
  }

  if (remainingP3 === 0) {
    console.log(
      JSON.stringify({
        phase: "escalation",
        message: "No autonomous P3 work remains. Human queue is the interrupt surface.",
        path: HUMAN_QUEUE_PATH,
      })
    );
  }
}

main();
