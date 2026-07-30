#!/usr/bin/env node
/**
 * Compact operator view — queue depth, oldest job, claim expiry, retry success.
 * NO_WALLET_TOUCH only. Writes artifacts/kpi/operator-view.md + .json
 */
"use strict";

const fs = require("fs");
const path = require("path");
const { readRecent, countByType } = require("./events.cjs");

const ROOT = path.resolve(__dirname, "../..");
const QUEUE_PATH = path.join(ROOT, "docs/activation/living-forge/queue/queue-state-v1.json");
const OUT_JSON = path.join(ROOT, "artifacts/kpi/operator-view.json");
const OUT_MD = path.join(ROOT, "artifacts/kpi/operator-view.md");
const DEAD_LETTER = path.join(ROOT, "artifacts/kpi/dead-letter.jsonl");

function now() {
  return new Date().toISOString().replace(/\.\d{3}Z$/, "Z");
}

function loadQueue() {
  return JSON.parse(fs.readFileSync(QUEUE_PATH, "utf8"));
}

function build() {
  const q = loadQueue();
  const tasks = q.tasks || [];
  const nowMs = Date.now();
  const dayAgo = nowMs - 24 * 3600 * 1000;

  const open = tasks.filter((t) => t.status === "open" || t.status === "in_progress");
  const inProgress = tasks.filter((t) => t.status === "in_progress");
  const dead = tasks.filter((t) => t.status === "dead_letter");
  const openAges = open
    .map((t) => {
      const c = t.created_at_utc ? Date.parse(t.created_at_utc) : null;
      return c ? (nowMs - c) / 3600000 : 0;
    })
    .filter((x) => x > 0);
  const oldestHours = openAges.length ? Math.max(...openAges) : 0;

  const events24 = countByType(dayAgo);
  const claimed = events24.claimed || 0;
  const completed = events24.completed || 0;
  const failed = events24.failed || 0;
  const expired = events24.expired || 0;
  const retried = events24.retried || 0;
  const deadLettered = events24.dead_lettered || 0;
  const escalated = events24.escalated || 0;
  const denom = completed + failed;
  const retrySuccessRate =
    claimed === 0 ? null : Number(((completed / Math.max(claimed, 1)) * 100).toFixed(1));

  const view = {
    schema: "qpf.operator_view.v1",
    at_utc: now(),
    no_wallet_touch: true,
    queue_depth: {
      open: tasks.filter((t) => t.status === "open").length,
      in_progress: inProgress.length,
      dead_letter: dead.length,
      open_p3: tasks.filter((t) => t.status === "open" && t.priority === 3).length,
      open_p0_p1: tasks.filter(
        (t) => (t.priority === 0 || t.priority === 1) && (t.status === "open" || t.status === "in_progress")
      ).length,
      total_tasks: tasks.length,
    },
    oldest_job_age_hours: Number(oldestHours.toFixed(1)),
    claim_expiry_count_24h: expired,
    retry_count_24h: retried,
    retry_success_rate_pct: retrySuccessRate,
    events_24h: events24,
    throughput_24h: { claimed, completed, failed, dead_lettered: deadLettered, escalated },
    metrics: q.metrics || {},
    recent_events: readRecent(12),
  };

  const md = [
    "# Operator View",
    "",
    `**At:** ${view.at_utc}`,
    `**NO_WALLET_TOUCH:** true`,
    "",
    "| Metric | Value |",
    "| --- | ---: |",
    `| Queue open | ${view.queue_depth.open} |`,
    `| In progress | ${view.queue_depth.in_progress} |`,
    `| Open P3 | ${view.queue_depth.open_p3} |`,
    `| Open P0–P1 | ${view.queue_depth.open_p0_p1} |`,
    `| Dead letter | ${view.queue_depth.dead_letter} |`,
    `| Oldest job age (h) | ${view.oldest_job_age_hours} |`,
    `| Claim expiries 24h | ${view.claim_expiry_count_24h} |`,
    `| Retries 24h | ${view.retry_count_24h} |`,
    `| Claim→complete % 24h | ${view.retry_success_rate_pct ?? "n/a"} |`,
    `| Escalated 24h | ${escalated} |`,
    "",
    "## Events (24h)",
    "",
    "```json",
    JSON.stringify(events24, null, 2),
    "```",
    "",
  ].join("\n");

  fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
  fs.writeFileSync(OUT_JSON, JSON.stringify(view, null, 2) + "\n");
  fs.writeFileSync(OUT_MD, md + "\n");
  // touch dead-letter file so path exists
  if (!fs.existsSync(DEAD_LETTER)) fs.writeFileSync(DEAD_LETTER, "");
  return view;
}

if (require.main === module) {
  process.env.NO_WALLET_TOUCH = "true";
  console.log(JSON.stringify(build(), null, 2));
}

module.exports = { build };
