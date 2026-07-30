#!/usr/bin/env node
/**
 * KPI snapshot — Day 1+2 — no wallet touch.
 *
 * Writes:
 *   artifacts/kpi/latest.json
 *   artifacts/kpi/history/<timestamp>.json
 *   artifacts/kpi/alerts-latest.json
 *   ~/.forge-daemon/kpi/latest.json + daily/
 *   docs/activation/living-forge/reports/kpi-latest.md
 */
"use strict";

const fs = require("fs");
const path = require("path");
const os = require("os");
const { execSync } = require("child_process");

process.env.NO_WALLET_TOUCH = "true";

const ROOT = path.resolve(__dirname, "..");
const QUEUE_PATH = path.join(ROOT, "docs/activation/living-forge/queue/queue-state-v1.json");
const HEARTBEAT_DIR = path.join(ROOT, "docs/activation/living-forge/heartbeats");
const HUMAN_QUEUE = path.join(ROOT, "docs/activation/living-forge/HUMAN_ACTION_QUEUE_V1.md");
const MATURITY_DOC = path.join(ROOT, "docs/autonomy-maturity.md");
const KPI_HOME = path.join(os.homedir(), ".forge-daemon", "kpi");
const ARTIFACTS_KPI = path.join(ROOT, "artifacts", "kpi");
const ARTIFACTS_HISTORY = path.join(ARTIFACTS_KPI, "history");
const ARTIFACTS_LATEST = path.join(ARTIFACTS_KPI, "latest.json");
const THRESHOLDS_PATH = path.join(ROOT, "scripts/living-forge/kpi-thresholds.json");
const REPORT_DIR = path.join(ROOT, "docs/activation/living-forge/reports");
const REPORT_MD = path.join(REPORT_DIR, "kpi-latest.md");
const STATE_JSON = path.join(ROOT, "docs/activation/living-forge/receiving-operational-state-v1.json");
const PREV_OPEN_P3_PATH = path.join(ARTIFACTS_KPI, "prev-open-p3.json");

function nowIso() {
  return new Date().toISOString().replace(/\.\d{3}Z$/, "Z");
}

function dayKey(d = new Date()) {
  return d.toISOString().slice(0, 10);
}

function readJson(p, fallback = null) {
  try {
    return JSON.parse(fs.readFileSync(p, "utf8"));
  } catch {
    return fallback;
  }
}

function sh(cmd, timeoutMs = 8000) {
  try {
    return execSync(cmd, {
      cwd: ROOT,
      encoding: "utf8",
      timeout: timeoutMs,
      stdio: ["ignore", "pipe", "pipe"],
      env: { ...process.env, NO_WALLET_TOUCH: "true" },
    }).trim();
  } catch (e) {
    return "";
  }
}

function listHeartbeats(limit = 200) {
  if (!fs.existsSync(HEARTBEAT_DIR)) return [];
  return fs
    .readdirSync(HEARTBEAT_DIR)
    .filter((f) => f.startsWith("heartbeat-") && f.endsWith(".json"))
    .map((f) => {
      const abs = path.join(HEARTBEAT_DIR, f);
      const st = fs.statSync(abs);
      return { file: f, abs, mtimeMs: st.mtimeMs, data: readJson(abs, null) };
    })
    .sort((a, b) => b.mtimeMs - a.mtimeMs)
    .slice(0, limit);
}

function countByStatus(tasks) {
  const out = { open: 0, in_progress: 0, done: 0, failed: 0, other: 0 };
  for (const t of tasks) {
    const s = t.status || "other";
    if (out[s] == null) out.other++;
    else out[s]++;
  }
  return out;
}

function priorityBuckets(tasks) {
  const buckets = { p0: 0, p1: 0, p2: 0, p3: 0, p4: 0 };
  for (const t of tasks) {
    if (t.status !== "open" && t.status !== "in_progress") continue;
    const p = Number(t.priority);
    if (p === 0) buckets.p0++;
    else if (p === 1) buckets.p1++;
    else if (p === 2) buckets.p2++;
    else if (p === 3) buckets.p3++;
    else if (p === 4) buckets.p4++;
  }
  return buckets;
}

function stuckInProgress(tasks, staleMs) {
  const now = Date.now();
  return tasks
    .filter((t) => t.status === "in_progress")
    .map((t) => {
      const started = t.started_at_utc ? Date.parse(t.started_at_utc) : 0;
      const ageMs = started ? now - started : null;
      return {
        id: t.id,
        title: t.title,
        started_at_utc: t.started_at_utc || null,
        age_ms: ageMs,
        stale: ageMs != null ? ageMs > staleMs : true,
        no_wallet_touch: t.no_wallet_touch === true || t.action === "wallet_preflight",
      };
    });
}

function successFailureFromHeartbeats(heartbeats, sinceMs) {
  let success = 0;
  let failure = 0;
  for (const hb of heartbeats) {
    if (hb.mtimeMs < sinceMs) continue;
    if (!hb.data) continue;
    if (hb.data.ok === true) success++;
    else if (hb.data.ok === false) failure++;
  }
  const total = success + failure;
  return {
    success,
    failure,
    total,
    success_rate: total === 0 ? null : Number((success / total).toFixed(4)),
  };
}

function approvalLatencyProxy(tasks) {
  // P0/P1 open items: age since created (human approval / action latency proxy)
  const now = Date.now();
  const items = tasks
    .filter((t) => (t.priority === 0 || t.priority === 1) && (t.status === "open" || t.status === "in_progress"))
    .map((t) => {
      const created = t.created_at_utc ? Date.parse(t.created_at_utc) : null;
      return {
        id: t.id,
        priority: t.priority,
        title: t.title,
        age_hours: created ? Number(((now - created) / 3600000).toFixed(1)) : null,
      };
    })
    .sort((a, b) => (b.age_hours || 0) - (a.age_hours || 0));

  const ages = items.map((i) => i.age_hours).filter((x) => x != null);
  const avg =
    ages.length === 0 ? null : Number((ages.reduce((a, b) => a + b, 0) / ages.length).toFixed(1));
  const max = ages.length === 0 ? null : Math.max(...ages);
  return { open_approval_items: items.length, avg_age_hours: avg, max_age_hours: max, top: items.slice(0, 8) };
}

function loadThresholds() {
  return (
    readJson(THRESHOLDS_PATH, null) || {
      alerts: {
        open_p3_max: 12,
        open_p0_p1_warn: 8,
        failure_rate_24h_max: 0.35,
        stale_claims_max: 0,
        queue_growth_delta_warn: 5,
        oldest_job_age_hours_warn: 48,
      },
      claim_stale_ms: 900000,
    }
  );
}

function serviceHints() {
  const living = sh("systemctl --user is-active living-forge-event.service 2>/dev/null");
  const runner = sh("systemctl --user is-active forgejo-runner.service 2>/dev/null");
  const pulse = sh("systemctl --user is-active qpf-autonomy-pulse.timer 2>/dev/null");
  const lfTimer = sh("systemctl --user is-active living-forge.timer 2>/dev/null");
  let ollama = "unknown";
  try {
    const tags = sh("curl -s --max-time 2 http://127.0.0.1:11434/api/tags");
    ollama = tags && tags.includes("models") ? "active" : "unreachable";
  } catch {
    ollama = "unreachable";
  }
  return {
    living_forge_event: living || "unknown",
    forgejo_runner: runner || "unknown",
    autonomy_pulse_timer: pulse || "unknown",
    living_forge_timer: lfTimer || "unknown",
    ollama: ollama,
  };
}

function maturityFromEvidence(snapshot) {
  let score = 1.0;
  if (snapshot.services.living_forge_event === "active") score += 0.8;
  if (snapshot.services.autonomy_pulse_timer === "active" || snapshot.services.living_forge_timer === "active")
    score += 0.3;
  if (snapshot.services.ollama === "active") score += 0.2;
  if ((snapshot.queue.metrics.autonomous_completed || 0) > 0) score += 0.5;
  if (snapshot.throughput_24h.total > 0) score += 0.3;
  if (snapshot.blocked.open_p0_p1 > 0) score += 0.1;
  if (snapshot.stuck_in_progress.filter((s) => s.stale).length === 0) score += 0.2;
  if (fs.existsSync(MATURITY_DOC)) score += 0.1;
  if (snapshot.alerts && snapshot.alerts.length === 0) score += 0.1;
  // Day-2 can reach ~3.5 when pulse timer active and clean queue
  const capped = Math.min(3.5, Number(score.toFixed(2)));
  return {
    score: capped,
    band: capped < 2 ? "1-2" : capped < 3 ? "2-3" : capped < 3.5 ? "3-partial" : "3.5",
    note: "Safe-scope ops only; commercial earn loop excluded",
  };
}

function evaluateAlerts(snapshot, thresholds) {
  const a = thresholds.alerts || {};
  const alerts = [];
  const staleN = snapshot.stuck_in_progress.filter((s) => s.stale).length;
  const failRate =
    snapshot.throughput_24h.total > 0 ? 1 - (snapshot.throughput_24h.success_rate || 0) : 0;
  const prev = readJson(PREV_OPEN_P3_PATH, { open_p3: snapshot.queue.open_p3 });
  const growth = snapshot.queue.open_p3 - (prev.open_p3 || 0);

  if (snapshot.queue.open_p3 > (a.open_p3_max ?? 12)) {
    alerts.push({
      level: "warn",
      code: "QUEUE_P3_HIGH",
      message: `open P3 ${snapshot.queue.open_p3} > max ${a.open_p3_max}`,
    });
  }
  if (snapshot.blocked.open_p0_p1 > (a.open_p0_p1_warn ?? 8)) {
    alerts.push({
      level: "info",
      code: "HUMAN_BACKLOG",
      message: `open P0–P1 ${snapshot.blocked.open_p0_p1} > warn ${a.open_p0_p1_warn}`,
    });
  }
  if (snapshot.throughput_24h.total >= 3 && failRate > (a.failure_rate_24h_max ?? 0.35)) {
    alerts.push({
      level: "warn",
      code: "FAILURE_RATE_HIGH",
      message: `failure rate ${(failRate * 100).toFixed(1)}% exceeds ${(a.failure_rate_24h_max * 100).toFixed(0)}%`,
    });
  }
  if (staleN > (a.stale_claims_max ?? 0)) {
    alerts.push({
      level: "critical",
      code: "STALE_CLAIMS",
      message: `${staleN} stale in_progress claim(s)`,
    });
  }
  if (growth > (a.queue_growth_delta_warn ?? 5)) {
    alerts.push({
      level: "warn",
      code: "QUEUE_GROWTH",
      message: `P3 grew by ${growth} since last pulse`,
    });
  }
  const oldest = snapshot.blocked.approval_latency.max_age_hours;
  if (oldest != null && oldest > (a.oldest_job_age_hours_warn ?? 48)) {
    alerts.push({
      level: "info",
      code: "OLD_HUMAN_JOB",
      message: `oldest P0–P1 age ${oldest}h > ${a.oldest_job_age_hours_warn}h`,
    });
  }
  if (process.env.NO_WALLET_TOUCH !== "true") {
    alerts.push({ level: "critical", code: "WALLET_TOUCH_GUARD_OFF", message: "NO_WALLET_TOUCH is not true" });
  }

  return { alerts, growth_delta_p3: growth, failure_rate_24h: failRate };
}

function buildSnapshot() {
  const at = nowIso();
  const thresholds = loadThresholds();
  const STALE_MS = thresholds.claim_stale_ms || 15 * 60 * 1000;
  const dayAgo = Date.now() - 24 * 3600 * 1000;

  const queue = readJson(QUEUE_PATH, { tasks: [], metrics: {} });
  const tasks = Array.isArray(queue.tasks) ? queue.tasks : [];
  const heartbeats = listHeartbeats(300);
  const thr = successFailureFromHeartbeats(heartbeats, dayAgo);
  const statusCounts = countByStatus(tasks);
  const pri = priorityBuckets(tasks);
  const stuck = stuckInProgress(tasks, STALE_MS);
  const approval = approvalLatencyProxy(tasks);
  const receiving = readJson(STATE_JSON, {});
  const services = serviceHints();

  const openP3 = tasks.filter((t) => t.status === "open" && t.priority === 3).length;
  const openBlocked = tasks.filter(
    (t) => (t.priority === 0 || t.priority === 1) && (t.status === "open" || t.status === "in_progress")
  ).length;
  const deadLetter = tasks.filter((t) => t.status === "dead_letter").length;

  const snapshot = {
    schema: "qpf.kpi_snapshot.v2",
    at_utc: at,
    day: dayKey(),
    no_wallet_touch: true,
    maturity: null,
    services,
    queue: {
      path: "docs/activation/living-forge/queue/queue-state-v1.json",
      metrics: queue.metrics || {},
      status_counts: statusCounts,
      open_by_priority: pri,
      open_p3: openP3,
      dead_letter: deadLetter,
    },
    throughput_24h: thr,
    blocked: {
      open_p0_p1: openBlocked,
      approval_latency: approval,
    },
    stuck_in_progress: stuck,
    funding: {
      ready_to_receive: receiving.ready_to_receive === true,
      verified_available_funds_cad: receiving.verified_available_funds_cad ?? null,
      mode: receiving.mode || null,
    },
    alerts: [],
    artifacts: {
      human_queue_exists: fs.existsSync(HUMAN_QUEUE),
      maturity_doc_exists: fs.existsSync(MATURITY_DOC),
      heartbeat_samples: heartbeats.length,
    },
  };

  const alertEval = evaluateAlerts(snapshot, thresholds);
  snapshot.alerts = alertEval.alerts;
  snapshot.alert_meta = {
    growth_delta_p3: alertEval.growth_delta_p3,
    failure_rate_24h: alertEval.failure_rate_24h,
  };
  snapshot.maturity = maturityFromEvidence(snapshot);
  return snapshot;
}

function toMarkdown(s) {
  const thr = s.throughput_24h;
  const rate =
    thr.success_rate == null ? "n/a (no heartbeats in 24h)" : `${(thr.success_rate * 100).toFixed(1)}%`;
  const stale = s.stuck_in_progress.filter((x) => x.stale);
  const lines = [
    "# Living Forge KPI Snapshot",
    "",
    `**At (UTC):** ${s.at_utc}`,
    `**NO_WALLET_TOUCH:** \`${s.no_wallet_touch}\``,
    `**Maturity (auto):** **${s.maturity.score}** (${s.maturity.band}) — ${s.maturity.note}`,
    "",
    "## Services",
    "",
    `| Unit | Status |`,
    `| --- | --- |`,
    `| living-forge-event | ${s.services.living_forge_event} |`,
    `| forgejo-runner | ${s.services.forgejo_runner} |`,
    `| autonomy-pulse timer | ${s.services.autonomy_pulse_timer} |`,
    `| living-forge timer | ${s.services.living_forge_timer} |`,
    `| ollama | ${s.services.ollama} |`,
    "",
    "## Alerts",
    "",
    s.alerts && s.alerts.length
      ? s.alerts.map((a) => `- **${a.level}** \`${a.code}\`: ${a.message}`).join("\n")
      : "_None._",
    "",
    "## Throughput (24h heartbeats)",
    "",
    `| Metric | Value |`,
    `| --- | --- |`,
    `| Success | ${thr.success} |`,
    `| Failure | ${thr.failure} |`,
    `| Total | ${thr.total} |`,
    `| Success rate | ${rate} |`,
    `| Lifetime autonomous_completed | ${s.queue.metrics.autonomous_completed ?? "?"} |`,
    "",
    "## Queue",
    "",
    `| Status | Count |`,
    `| --- | ---: |`,
    ...Object.entries(s.queue.status_counts).map(([k, v]) => `| ${k} | ${v} |`),
    "",
    `| Open priority | Count |`,
    `| --- | ---: |`,
    `| P0 | ${s.queue.open_by_priority.p0} |`,
    `| P1 | ${s.queue.open_by_priority.p1} |`,
    `| P2 | ${s.queue.open_by_priority.p2} |`,
    `| P3 | ${s.queue.open_by_priority.p3} |`,
    "",
    "## Blocked / approval latency (P0–P1 open)",
    "",
    `- Open approval items: **${s.blocked.approval_latency.open_approval_items}**`,
    `- Avg age (hours): **${s.blocked.approval_latency.avg_age_hours ?? "n/a"}**`,
    `- Max age (hours): **${s.blocked.approval_latency.max_age_hours ?? "n/a"}**`,
    "",
  ];

  if (s.blocked.approval_latency.top.length) {
    lines.push("| ID | P | Age (h) | Title |", "| --- | ---: | ---: | --- |");
    for (const t of s.blocked.approval_latency.top) {
      lines.push(`| ${t.id} | ${t.priority} | ${t.age_hours ?? "?"} | ${t.title} |`);
    }
    lines.push("");
  }

  lines.push("## Stuck in_progress", "");
  if (!s.stuck_in_progress.length) {
    lines.push("_None._", "");
  } else {
    lines.push("| ID | Stale | Age (h) | NO_WALLET | Title |", "| --- | --- | ---: | --- | --- |");
    for (const t of s.stuck_in_progress) {
      const ageH = t.age_ms == null ? "?" : (t.age_ms / 3600000).toFixed(1);
      lines.push(
        `| ${t.id} | ${t.stale ? "YES" : "no"} | ${ageH} | ${t.no_wallet_touch} | ${t.title || ""} |`
      );
    }
    lines.push("");
    if (stale.length) {
      lines.push(`**Action:** run \`npm run living-forge:unstick-claims\` (${stale.length} stale).`, "");
    }
  }

  lines.push(
    "## Funding (read-only)",
    "",
    `- ready_to_receive: **${s.funding.ready_to_receive}**`,
    `- verified_available_funds_cad: **${s.funding.verified_available_funds_cad}**`,
    `- mode: \`${s.funding.mode || "n/a"}\``,
    "",
    "## Guardrails",
    "",
    "- No signing, no fund movement, no key access from this snapshot.",
    "- See `docs/autonomy-maturity.md` for score definition and 30-day targets.",
    ""
  );

  return lines.join("\n");
}

function writeOutputs(snapshot, md) {
  fs.mkdirSync(path.join(KPI_HOME, "daily"), { recursive: true });
  fs.mkdirSync(REPORT_DIR, { recursive: true });
  fs.mkdirSync(ARTIFACTS_HISTORY, { recursive: true });

  const latestHome = path.join(KPI_HOME, "latest.json");
  const daily = path.join(KPI_HOME, "daily", `${snapshot.day}.json`);
  const ts = snapshot.at_utc.replace(/[:.]/g, "").replace("Z", "Z");
  const historyPath = path.join(ARTIFACTS_HISTORY, `${ts}.json`);
  const alertsPath = path.join(ARTIFACTS_KPI, "alerts-latest.json");

  fs.writeFileSync(latestHome, JSON.stringify(snapshot, null, 2) + "\n");
  fs.writeFileSync(daily, JSON.stringify(snapshot, null, 2) + "\n");
  fs.writeFileSync(ARTIFACTS_LATEST, JSON.stringify(snapshot, null, 2) + "\n");
  fs.writeFileSync(historyPath, JSON.stringify(snapshot, null, 2) + "\n");
  fs.writeFileSync(
    alertsPath,
    JSON.stringify(
      { at_utc: snapshot.at_utc, count: snapshot.alerts.length, alerts: snapshot.alerts, no_wallet_touch: true },
      null,
      2
    ) + "\n"
  );
  fs.writeFileSync(REPORT_MD, md);
  fs.writeFileSync(PREV_OPEN_P3_PATH, JSON.stringify({ open_p3: snapshot.queue.open_p3, at: snapshot.at_utc }) + "\n");

  const statePath = path.join(KPI_HOME, "kpi-state-v1.json");
  const prev = readJson(statePath, { samples: 0, history: [] });
  prev.samples = (prev.samples || 0) + 1;
  prev.updated_at_utc = snapshot.at_utc;
  prev.last_maturity_score = snapshot.maturity.score;
  prev.last_success_rate_24h = snapshot.throughput_24h.success_rate;
  prev.last_autonomous_completed = snapshot.queue.metrics.autonomous_completed;
  prev.last_alert_count = snapshot.alerts.length;
  prev.history = (prev.history || []).slice(-29).concat([
    {
      day: snapshot.day,
      at: snapshot.at_utc,
      maturity: snapshot.maturity.score,
      success_rate_24h: snapshot.throughput_24h.success_rate,
      stuck_stale: snapshot.stuck_in_progress.filter((x) => x.stale).length,
      open_p3: snapshot.queue.open_p3,
      open_p0_p1: snapshot.blocked.open_p0_p1,
      alerts: snapshot.alerts.length,
    },
  ]);
  fs.writeFileSync(statePath, JSON.stringify(prev, null, 2) + "\n");

  // prune history older than 200 files
  try {
    const files = fs
      .readdirSync(ARTIFACTS_HISTORY)
      .filter((f) => f.endsWith(".json"))
      .sort();
    while (files.length > 200) {
      const old = files.shift();
      fs.unlinkSync(path.join(ARTIFACTS_HISTORY, old));
    }
  } catch {
    /* ignore */
  }

  return {
    latest: ARTIFACTS_LATEST,
    history: historyPath,
    daily,
    home_latest: latestHome,
    report: REPORT_MD,
    alerts: alertsPath,
    state: statePath,
  };
}

function main() {
  process.env.NO_WALLET_TOUCH = "true";
  const snapshot = buildSnapshot();
  const md = toMarkdown(snapshot);
  const paths = writeOutputs(snapshot, md);

  const summary = {
    ok: true,
    no_wallet_touch: true,
    maturity: snapshot.maturity.score,
    band: snapshot.maturity.band,
    throughput_24h: snapshot.throughput_24h,
    stuck_stale: snapshot.stuck_in_progress.filter((x) => x.stale).length,
    open_p3: snapshot.queue.open_p3,
    open_p0_p1: snapshot.blocked.open_p0_p1,
    paths,
  };

  console.log(JSON.stringify(summary, null, 2));
  if (process.argv.includes("--stdout")) {
    console.log("\n--- markdown ---\n");
    console.log(md);
  }
}

main();
