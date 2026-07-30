#!/usr/bin/env node
/**
 * Living Forge scheduler — Day-2/3 claim lease + retries schema + admin P3.
 * No signing, no wallet moves, no secrets.
 * Standing env: NO_WALLET_TOUCH=true
 *
 * Usage:
 *   node scripts/living-forge/scheduler.cjs
 *   node scripts/living-forge/scheduler.cjs --seed
 *   node scripts/living-forge/scheduler.cjs --drain
 *   node scripts/living-forge/scheduler.cjs --human-queue
 *   node scripts/living-forge/scheduler.cjs --unstick-claims
 *   node scripts/living-forge/scheduler.cjs --simulate-stuck-claim
 */
"use strict";

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { execSync } = require("child_process");

process.env.NO_WALLET_TOUCH = "true";

const ROOT = path.resolve(__dirname, "../..");
const QUEUE_PATH = path.join(ROOT, "docs/activation/living-forge/queue/queue-state-v1.json");
const HEARTBEAT_DIR = path.join(ROOT, "docs/activation/living-forge/heartbeats");
const HUMAN_QUEUE_PATH = path.join(ROOT, "docs/activation/living-forge/HUMAN_ACTION_QUEUE_V1.md");
const DEAD_LETTER_PATH = path.join(ROOT, "artifacts/kpi/dead-letter.jsonl");
const THRESHOLDS_PATH = path.join(__dirname, "kpi-thresholds.json");
const RETRIES_SCHEMA_PATH = path.join(
  ROOT,
  "docs/activation/living-forge/queue/queue-retries-schema-v1.json"
);

const policy = require("./policy-gate.cjs");
const { emit } = require("./events.cjs");
const adminTasks = require("./admin-tasks.cjs");

function loadThresholds() {
  try {
    return JSON.parse(fs.readFileSync(THRESHOLDS_PATH, "utf8"));
  } catch {
    return {
      claim_lease_ms: 900000,
      claim_stale_ms: 900000,
      max_attempts_before_dead_letter: 5,
      recurring_ttl_ms: 900000,
    };
  }
}

const TH = loadThresholds();
const CLAIM_LEASE_MS = TH.claim_lease_ms || 15 * 60 * 1000;
const CLAIM_STALE_MS = TH.claim_stale_ms || CLAIM_LEASE_MS;
const MAX_ATTEMPTS_DL = TH.max_attempts_before_dead_letter || 5;
const RECURRING_TTL_MS = TH.recurring_ttl_ms || 15 * 60 * 1000;
const DEFAULT_BACKOFF_SEC = TH.default_backoff_sec || 60;
const MAX_BACKOFF_SEC = TH.max_backoff_sec || 3600;
const DEFAULT_RISK = TH.default_task_risk || "low";

function now() {
  return new Date().toISOString().replace(/\.\d{3}Z$/, "Z");
}

function loadQueue() {
  return JSON.parse(fs.readFileSync(QUEUE_PATH, "utf8"));
}

function saveQueue(q) {
  q.updated_at_utc = now();
  if (!q.metrics) q.metrics = {};
  fs.writeFileSync(QUEUE_PATH, JSON.stringify(q, null, 2) + "\n");
}

function sh(cmd, timeoutMs = 120000, extraEnv = {}) {
  try {
    const out = execSync(cmd, {
      cwd: ROOT,
      encoding: "utf8",
      timeout: timeoutMs,
      stdio: ["ignore", "pipe", "pipe"],
      env: {
        ...process.env,
        NO_WALLET_TOUCH: "true",
        ...extraEnv,
      },
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

function makeIdempotencyKey(task) {
  // Stable key for this logical attempt window: task + action + day hour bucket
  const bucket = new Date().toISOString().slice(0, 13); // YYYY-MM-DDTHH
  return crypto
    .createHash("sha256")
    .update(`${task.id}|${task.action}|${bucket}|${task.attempts || 0}`)
    .digest("hex")
    .slice(0, 16);
}

function appendDeadLetter(entry) {
  fs.mkdirSync(path.dirname(DEAD_LETTER_PATH), { recursive: true });
  fs.appendFileSync(DEAD_LETTER_PATH, JSON.stringify(entry) + "\n");
}

/**
 * Reopen expired leases / stale in_progress; normalize wallet safe-lane.
 */
function unstickStaleClaims(q, forceAllInProgress = false) {
  const nowMs = Date.now();
  const freed = [];
  for (const t of q.tasks) {
    if (t.action === "wallet_preflight" || t.id === "P3-health-wallet-preflight") {
      t.no_wallet_touch = true;
      t.safe_lane = "wallet_preflight_non_executing";
      t.title = "Wallet preflight (NO_WALLET_TOUCH, non-executing)";
      t.escalation_checkpoint =
        "Any key use, sign, broadcast, or gated post-preflight command requires P0 human approval";
    }

    if (t.status !== "in_progress") continue;

    const leaseUntil = t.claim_lease_until_utc ? Date.parse(t.claim_lease_until_utc) : 0;
    const started = t.started_at_utc ? Date.parse(t.started_at_utc) : 0;
    const age = started ? nowMs - started : Number.POSITIVE_INFINITY;
    const leaseExpired = leaseUntil ? nowMs > leaseUntil : true;
    const staleByAge = !started || age > CLAIM_STALE_MS;
    const stale = forceAllInProgress || leaseExpired || staleByAge;
    if (!stale) continue;

    t.status = "open";
    t.claim_id = null;
    t.claim_lease_until_utc = null;
    t.unstuck_at_utc = now();
    t.unstuck_reason = forceAllInProgress
      ? "manual_unstick_claims"
      : leaseExpired
        ? "claim_lease_expired"
        : "stale_in_progress_claim_timeout";
    t.consecutive_failures = t.consecutive_failures || 0;
    t.last_result = {
      ok: false,
      summary: `expired claim requeued (${t.unstuck_reason})`,
      at: now(),
    };
    emit("expired", {
      task_id: t.id,
      reason: t.unstuck_reason,
      age_ms: Number.isFinite(age) ? age : null,
    });
    freed.push({ id: t.id, reason: t.unstuck_reason, age_ms: Number.isFinite(age) ? age : null });
  }
  return freed;
}

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
    title: "Wallet preflight (NO_WALLET_TOUCH, non-executing)",
    status: "open",
    action: "wallet_preflight",
    recurring: true,
    no_wallet_touch: true,
    safe_lane: "wallet_preflight_non_executing",
    escalation_checkpoint:
      "Any key use, sign, broadcast, or gated post-preflight command requires P0 human approval",
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
    risk: "low",
    backoff_sec: 60,
    max_attempts: 5,
  },
  {
    id: "P3-stale-doc-scan",
    priority: 3,
    title: "Stale doc scan (pending claims / old mtimes)",
    status: "open",
    action: "stale_doc_scan",
    recurring: true,
    risk: "low",
    backoff_sec: 120,
    max_attempts: 5,
  },
  {
    id: "P3-open-pr-classify",
    priority: 3,
    title: "Classify open PRs (deterministic, no merge)",
    status: "open",
    action: "open_pr_classify",
    recurring: true,
    risk: "low",
    backoff_sec: 120,
    max_attempts: 5,
  },
  {
    id: "P3-grant-tracker-diff",
    priority: 3,
    title: "Grant tracker content diff vs last snapshot",
    status: "open",
    action: "grant_tracker_diff",
    recurring: true,
    risk: "low",
    backoff_sec: 120,
    max_attempts: 5,
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

function normalizeTaskSchema(t) {
  if (!t.risk) t.risk = DEFAULT_RISK;
  if (t.max_attempts == null) t.max_attempts = MAX_ATTEMPTS_DL;
  if (t.backoff_sec == null) t.backoff_sec = DEFAULT_BACKOFF_SEC;
  if (!Array.isArray(t.depends_on)) {
    if (typeof t.depends_on === "string" && t.depends_on) t.depends_on = [t.depends_on];
    else if (t.depends_on == null) t.depends_on = [];
  }
  if (t.consecutive_failures == null) t.consecutive_failures = 0;
  return t;
}

function seed(q) {
  if (!q.schema_version) q.schema_version = "queue-retries-v1";
  q.retries_schema = "docs/activation/living-forge/queue/queue-retries-schema-v1.json";
  const byId = new Map(q.tasks.map((t) => [t.id, t]));
  for (const t of SEED_TASKS) {
    if (!byId.has(t.id)) {
      q.tasks.push(
        normalizeTaskSchema({
          ...t,
          created_at_utc: now(),
          attempts: 0,
          consecutive_failures: 0,
          last_result: null,
          outcome: null,
        })
      );
    } else {
      const existing = byId.get(t.id);
      normalizeTaskSchema(existing);
      if (t.recurring) existing.recurring = true;
      if (t.risk) existing.risk = t.risk;
      if (t.backoff_sec != null) existing.backoff_sec = t.backoff_sec;
      if (t.max_attempts != null) existing.max_attempts = t.max_attempts;
      if (t.no_wallet_touch) existing.no_wallet_touch = true;
      if (t.safe_lane) existing.safe_lane = t.safe_lane;
      if (t.escalation_checkpoint) existing.escalation_checkpoint = t.escalation_checkpoint;
      if (t.title && t.action === "wallet_preflight") existing.title = t.title;
      if (
        t.title &&
        (t.action === "stale_doc_scan" || t.action === "open_pr_classify" || t.action === "grant_tracker_diff")
      ) {
        existing.title = t.title;
      }
    }
  }
  for (const t of q.tasks) normalizeTaskSchema(t);
  return q;
}

function dependsSatisfied(q, task) {
  const deps = task.depends_on || [];
  if (!deps.length) return true;
  const byId = new Map(q.tasks.map((t) => [t.id, t]));
  for (const id of deps) {
    const d = byId.get(id);
    if (!d || d.status !== "done") return false;
  }
  return true;
}

function isEligibleNow(task) {
  if (!task.next_eligible_at_utc) return true;
  const t = Date.parse(task.next_eligible_at_utc);
  if (!t) return true;
  return Date.now() >= t;
}

function computeBackoffSec(task) {
  const base = task.backoff_sec || DEFAULT_BACKOFF_SEC;
  const n = Math.max(1, task.consecutive_failures || 1);
  const delay = base * Math.pow(2, n - 1);
  return Math.min(delay, MAX_BACKOFF_SEC);
}

function reopenRecurring(q, force) {
  const cutoff = Date.now() - RECURRING_TTL_MS;
  let n = 0;
  for (const t of q.tasks) {
    if (!t.recurring) continue;
    if (t.status === "dead_letter") continue;
    if (t.status !== "done" && t.status !== "failed") continue;
    const finished = t.finished_at_utc ? Date.parse(t.finished_at_utc) : 0;
    if (force || !finished || finished <= cutoff) {
      t.status = "open";
      t.reopened_at_utc = now();
      t.claim_id = null;
      t.claim_lease_until_utc = null;
      n++;
    }
  }
  return n;
}

function claimNextP3(q) {
  const nowMs = Date.now();
  const open = q.tasks
    .filter((t) => {
      if (t.status !== "open" || t.priority !== 3) return false;
      if (t.risk && t.risk !== "low") return false; // Day 3: auto-run low only
      if (!isEligibleNow(t)) return false;
      if (!dependsSatisfied(q, t)) return false;
      return true;
    })
    .sort((a, b) => a.id.localeCompare(b.id));
  // skip tasks still in backoff (belt)
  return (
    open.find((t) => {
      if (!t.next_eligible_at_utc) return true;
      return Date.parse(t.next_eligible_at_utc) <= nowMs;
    }) || null
  );
}

function runAction(task) {
  const gate = policy.evaluate(task);
  if (!gate.ok) {
    emit("escalated", { task_id: task.id, action: task.action, code: gate.code, reason: gate.reason });
    return {
      ok: false,
      summary: `ESCALATE: ${gate.reason}`,
      detail: gate.code || "",
      policy: gate,
    };
  }

  const ts = now().replace(/[:.]/g, "").slice(0, 15);
  switch (task.action) {
    case "verify_evidence_index": {
      const r = sh("npm run verify:evidence-index");
      return { ok: r.ok, summary: r.ok ? "evidence-index PASS" : "evidence-index FAIL", detail: r.out };
    }
    case "wallet_preflight": {
      if (process.env.NO_WALLET_TOUCH !== "true") {
        return {
          ok: false,
          summary: "ESCALATE: NO_WALLET_TOUCH must be true for wallet_preflight",
          detail: "P0 checkpoint",
        };
      }
      if (process.env.PRIVATE_KEY || process.env.DEPLOYER_PRIVATE_KEY || process.env.COSIGN_PRIVATE_KEY) {
        return {
          ok: false,
          summary: "ESCALATE: private key env present — refusing wallet_preflight",
          detail: "P0 checkpoint",
        };
      }
      const r = sh("bash scripts/security/wallet-preflight-gate-v1.sh", 120000, {
        NO_WALLET_TOUCH: "true",
      });
      const pass = r.ok && /WALLET_PREFLIGHT_GATE_V1_PASS=TRUE/.test(r.out);
      return {
        ok: pass,
        summary: pass
          ? "wallet preflight PASS (NO_WALLET_TOUCH safe lane)"
          : "wallet preflight FAIL (safe lane, non-executing)",
        detail: r.out.slice(-1500),
      };
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
    case "stale_doc_scan":
      return adminTasks.staleDocScan();
    case "open_pr_classify":
      return adminTasks.openPrClassify();
    case "grant_tracker_diff":
      return adminTasks.grantTrackerDiff();
    default:
      return { ok: false, summary: `unknown or non-autonomous action ${task.action}`, detail: "" };
  }
}

function writeHumanQueue(q) {
  const lines = [
    "# HUMAN ACTION QUEUE v1",
    "",
    `Updated: ${now()}`,
    "Mode: Event-driven standby + 15m pulse (Day 2)",
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
    "- `NO_WALLET_TOUCH=true` on all autonomous jobs.",
    "",
  ];
  const openP3 = q.tasks.filter((t) => t.status === "open" && t.priority === 3).length;
  const dead = q.tasks.filter((t) => t.status === "dead_letter").length;
  lines.push(`Open P3 autonomous tasks: **${openP3}**`);
  if (dead) lines.push(`Dead-letter tasks: **${dead}** (see artifacts/kpi/dead-letter.jsonl)`);
  lines.push("");
  fs.writeFileSync(HUMAN_QUEUE_PATH, lines.join("\n"));
}

function writeHeartbeat(cycle) {
  fs.mkdirSync(HEARTBEAT_DIR, { recursive: true });
  const p = path.join(HEARTBEAT_DIR, `heartbeat-${now().replace(/[:.]/g, "").slice(0, 15)}.json`);
  fs.writeFileSync(p, JSON.stringify(cycle, null, 2) + "\n");
  return p;
}

function simulateStuckClaim(q) {
  // Prefer a cheap recurring task for simulation
  let t = q.tasks.find((x) => x.id === "P3-classify-dirty-tree") || q.tasks.find((x) => x.priority === 3);
  if (!t) throw new Error("no P3 task to simulate");
  const past = new Date(Date.now() - CLAIM_LEASE_MS - 60_000).toISOString().replace(/\.\d{3}Z$/, "Z");
  t.status = "in_progress";
  t.started_at_utc = past;
  t.claim_lease_until_utc = past;
  t.claim_id = "sim-stuck-" + Date.now();
  t.simulated_stuck = true;
  emit("claimed", { task_id: t.id, claim_id: t.claim_id, simulated: true });
  return t;
}

function claimTask(q, task) {
  const claimId = crypto.randomBytes(8).toString("hex");
  const leaseUntil = new Date(Date.now() + CLAIM_LEASE_MS).toISOString().replace(/\.\d{3}Z$/, "Z");
  const idem = makeIdempotencyKey(task);

  // Idempotency: if last successful result used same key, skip re-exec
  if (
    task.last_success_idempotency_key === idem &&
    task.last_result &&
    task.last_result.ok === true &&
    task.status === "open"
  ) {
    emit("retried", { task_id: task.id, idempotency_key: idem, skipped: true, reason: "idempotent_success" });
    task.status = "done";
    task.finished_at_utc = now();
    task.last_result = {
      ok: true,
      summary: "idempotent skip — prior success for key " + idem,
      at: now(),
      idempotent: true,
    };
    return { skipped: true, claimId, idem };
  }

  if ((task.attempts || 0) > 0 && task.last_result && task.last_result.ok === false) {
    emit("retried", { task_id: task.id, attempt: (task.attempts || 0) + 1, idempotency_key: idem });
  }

  task.status = "in_progress";
  task.attempts = (task.attempts || 0) + 1;
  task.started_at_utc = now();
  task.claim_id = claimId;
  task.claim_lease_until_utc = leaseUntil;
  task.idempotency_key = idem;
  if (task.action === "wallet_preflight") {
    task.no_wallet_touch = true;
    task.safe_lane = "wallet_preflight_non_executing";
  }
  emit("claimed", {
    task_id: task.id,
    claim_id: claimId,
    lease_until_utc: leaseUntil,
    idempotency_key: idem,
    attempt: task.attempts,
  });
  return { skipped: false, claimId, idem };
}

function finishTask(q, task, result) {
  const escalated = typeof result.summary === "string" && result.summary.startsWith("ESCALATE:");
  const maxAttempts = task.max_attempts != null ? task.max_attempts : MAX_ATTEMPTS_DL;
  task.last_result = {
    ok: result.ok,
    summary: result.summary,
    at: now(),
    escalated: !!escalated,
    claim_id: task.claim_id,
    idempotency_key: task.idempotency_key,
  };
  task.finished_at_utc = now();
  task.claim_lease_until_utc = null;

  if (result.ok) {
    task.status = "done";
    task.outcome = "success";
    task.consecutive_failures = 0;
    task.next_eligible_at_utc = null;
    task.last_success_idempotency_key = task.idempotency_key;
    q.metrics.autonomous_completed = (q.metrics.autonomous_completed || 0) + 1;
    emit("completed", { task_id: task.id, claim_id: task.claim_id, summary: result.summary });
  } else if (escalated) {
    task.status = "open";
    task.outcome = "escalated";
    task.escalated_at_utc = now();
    const delay = computeBackoffSec(task);
    task.next_eligible_at_utc = new Date(Date.now() + delay * 1000).toISOString().replace(/\.\d{3}Z$/, "Z");
    q.metrics.human_interruptions_this_session = (q.metrics.human_interruptions_this_session || 0) + 1;
    emit("escalated", { task_id: task.id, summary: result.summary, next_eligible_at_utc: task.next_eligible_at_utc });
  } else {
    task.consecutive_failures = (task.consecutive_failures || 0) + 1;
    task.outcome = "fail";

    // medium risk: one auto-retry then escalate (leave open for human attention)
    if (task.risk === "medium" && task.consecutive_failures > 1) {
      task.status = "open";
      task.outcome = "escalated";
      task.escalated_at_utc = now();
      emit("escalated", {
        task_id: task.id,
        summary: "medium risk max auto-retries exhausted",
        consecutive_failures: task.consecutive_failures,
      });
    } else if (task.consecutive_failures >= maxAttempts) {
      task.status = "dead_letter";
      task.outcome = "dead_letter";
      task.dead_lettered_at_utc = now();
      appendDeadLetter({
        at_utc: now(),
        task_id: task.id,
        action: task.action,
        attempts: task.attempts,
        consecutive_failures: task.consecutive_failures,
        last_result: task.last_result,
        no_wallet_touch: true,
      });
      emit("dead_lettered", {
        task_id: task.id,
        consecutive_failures: task.consecutive_failures,
        summary: result.summary,
      });
    } else {
      // failed + backoff then re-open for retry (recurring health) or leave failed until reopenRecurring
      const delay = computeBackoffSec(task);
      task.next_eligible_at_utc = new Date(Date.now() + delay * 1000).toISOString().replace(/\.\d{3}Z$/, "Z");
      task.status = "open"; // requeue with backoff (Day-3 retries schema)
      emit("retried", {
        task_id: task.id,
        summary: result.summary,
        consecutive_failures: task.consecutive_failures,
        next_eligible_at_utc: task.next_eligible_at_utc,
        backoff_sec: delay,
      });
      emit("failed", {
        task_id: task.id,
        summary: result.summary,
        consecutive_failures: task.consecutive_failures,
      });
    }
  }
  q.metrics.last_scheduler_run_utc = now();
}

function main() {
  const args = process.argv.slice(2);
  let q = loadQueue();
  if (!q.metrics) q.metrics = {};
  const drain = args.includes("--drain");
  const unstickOnly = args.includes("--unstick-claims");
  const simStuck = args.includes("--simulate-stuck-claim");

  q = seed(q);

  if (simStuck) {
    const t = simulateStuckClaim(q);
    saveQueue(q);
    console.log(JSON.stringify({ phase: "simulate_stuck", task: t.id, started_at_utc: t.started_at_utc }));
  }

  // Always expire leases; force all in_progress only on explicit --unstick-claims (without sim)
  const unstuck = unstickStaleClaims(q, unstickOnly && !simStuck);
  if (unstuck.length) {
    q.metrics.last_unstick_count = unstuck.length;
    q.metrics.last_unstick_utc = now();
    q.metrics.claim_expiry_total = (q.metrics.claim_expiry_total || 0) + unstuck.length;
    console.log(JSON.stringify({ phase: "unstick", freed: unstuck, no_wallet_touch: true }));
  }

  if (simStuck && args.includes("--verify-recovery")) {
    const t = q.tasks.find((x) => x.simulated_stuck) || q.tasks.find((x) => x.id === "P3-classify-dirty-tree");
    const ok = t && t.status === "open";
    console.log(
      JSON.stringify({
        phase: "verify_recovery",
        ok: !!ok,
        task: t && t.id,
        status: t && t.status,
        unstuck: unstuck.length,
        recovered: unstuck.length > 0 && !!ok,
        no_wallet_touch: true,
      })
    );
    if (t) delete t.simulated_stuck;
    saveQueue(q);
    if (!ok) process.exitCode = 1;
    return;
  }

  if (unstickOnly) {
    saveQueue(q);
    writeHumanQueue(q);
    console.log(
      JSON.stringify({
        phase: "unstick_complete",
        freed: unstuck.length,
        wallet_preflight_lane: "NO_WALLET_TOUCH",
        path: QUEUE_PATH,
      })
    );
    return;
  }

  const reopened = reopenRecurring(q, drain);
  if (reopened) q.metrics.last_reopen_count = reopened;
  saveQueue(q);

  if (args.includes("--human-queue")) {
    writeHumanQueue(q);
    console.log("HUMAN_QUEUE", HUMAN_QUEUE_PATH);
    return;
  }

  if (args.includes("--seed") && !drain && args.filter((a) => !a.startsWith("--seed")).every((a) => false) && args.length === 1) {
    writeHumanQueue(q);
    console.log(JSON.stringify({ phase: "seed", reopened, unstuck: unstuck.length, tasks: q.tasks.length }));
    return;
  }

  if (args.includes("--seed") && args.length === 1) {
    writeHumanQueue(q);
    console.log(JSON.stringify({ phase: "seed", reopened, unstuck: unstuck.length, tasks: q.tasks.length }));
    return;
  }

  const completed = [];
  let guard = 0;
  const max = drain ? 50 : 1;

  while (guard++ < max) {
    unstickStaleClaims(q, false);

    const task = claimNextP3(q);
    if (!task) break;

    const claim = claimTask(q, task);
    saveQueue(q);

    if (claim.skipped) {
      completed.push({ id: task.id, ok: true, summary: task.last_result.summary, idempotent: true });
      console.log(JSON.stringify({ task: task.id, ok: true, summary: task.last_result.summary, idempotent: true }));
      if (!drain) break;
      continue;
    }

    const result = runAction(task);
    finishTask(q, task, result);
    saveQueue(q);
    completed.push({ id: task.id, ...result });

    const hb = writeHeartbeat({
      at: now(),
      task: task.id,
      result: result.summary,
      ok: result.ok,
      claim_id: task.claim_id,
      idempotency_key: task.idempotency_key,
      no_wallet_touch: true,
      remaining_p3: q.tasks.filter((t) => t.status === "open" && t.priority === 3).length,
    });
    console.log(JSON.stringify({ task: task.id, ok: result.ok, summary: result.summary, heartbeat: hb }));

    if (!drain) break;
  }

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
