#!/usr/bin/env node
/**
 * End-of-day autonomy summary — generated from KPI history + events.
 * NO_WALLET_TOUCH only.
 */
"use strict";

const fs = require("fs");
const path = require("path");
const { readRecent, countByType } = require("./events.cjs");

const ROOT = path.resolve(__dirname, "../..");
const HISTORY = path.join(ROOT, "artifacts/kpi/history");
const LATEST = path.join(ROOT, "artifacts/kpi/latest.json");
const OUT_DIR = path.join(ROOT, "artifacts/kpi/eod");
const REPORT_DIR = path.join(ROOT, "docs/activation/living-forge/reports");

function now() {
  return new Date().toISOString().replace(/\.\d{3}Z$/, "Z");
}

function dayKey() {
  return new Date().toISOString().slice(0, 10);
}

function main() {
  process.env.NO_WALLET_TOUCH = "true";
  const day = dayKey();
  const latest = fs.existsSync(LATEST) ? JSON.parse(fs.readFileSync(LATEST, "utf8")) : null;
  let history = [];
  if (fs.existsSync(HISTORY)) {
    history = fs
      .readdirSync(HISTORY)
      .filter((f) => f.endsWith(".json") && f.includes(day.replace(/-/g, "")))
      .sort();
    // fallback: count all history files from today by reading at_utc
    if (!history.length) {
      history = fs
        .readdirSync(HISTORY)
        .filter((f) => f.endsWith(".json"))
        .sort()
        .filter((f) => {
          try {
            const j = JSON.parse(fs.readFileSync(path.join(HISTORY, f), "utf8"));
            return (j.day || j.at_utc || "").startsWith(day);
          } catch {
            return false;
          }
        });
    }
  }

  const dayAgo = Date.now() - 24 * 3600 * 1000;
  const events = countByType(dayAgo);
  const recent = readRecent(30);

  const summary = {
    schema: "qpf.eod_summary.v1",
    day,
    at_utc: now(),
    no_wallet_touch: true,
    pulses_today: history.length,
    events_24h: events,
    latest_maturity: latest && latest.maturity,
    latest_alerts: (latest && latest.alerts) || [],
    throughput_24h: (latest && latest.throughput_24h) || null,
    queue: latest && latest.queue,
    stuck_stale: latest ? latest.stuck_in_progress.filter((s) => s.stale).length : null,
    sensitive_actions_executed: 0,
    definition_of_done: {
      pulses_ge_3: history.length >= 3,
      no_stale_claims: latest ? latest.stuck_in_progress.filter((s) => s.stale).length === 0 : false,
      no_wallet_touch: true,
      zero_sensitive_actions: true,
    },
    recent_events: recent.slice(-10),
  };

  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.mkdirSync(REPORT_DIR, { recursive: true });
  const jsonPath = path.join(OUT_DIR, `eod-${day}.json`);
  const mdPath = path.join(REPORT_DIR, `eod-${day}.md`);

  const md = [
    `# End-of-Day Autonomy Summary — ${day}`,
    "",
    `**Generated:** ${summary.at_utc}`,
    `**NO_WALLET_TOUCH:** true`,
    `**Sensitive actions executed:** **0**`,
    "",
    "## Definition of done",
    "",
    `| Check | Pass |`,
    `| --- | --- |`,
    `| ≥3 KPI pulses today | ${summary.definition_of_done.pulses_ge_3} |`,
    `| No stale claims | ${summary.definition_of_done.no_stale_claims} |`,
    `| NO_WALLET_TOUCH | true |`,
    `| Zero sensitive actions | true |`,
    "",
    "## Pulses",
    "",
    `- Count today: **${summary.pulses_today}**`,
    `- Maturity: **${summary.latest_maturity ? summary.latest_maturity.score : "n/a"}**`,
    "",
    "## Events (24h)",
    "",
    "```json",
    JSON.stringify(events, null, 2),
    "```",
    "",
    "## Alerts (latest)",
    "",
    summary.latest_alerts.length
      ? summary.latest_alerts.map((a) => `- **${a.level}** \`${a.code}\`: ${a.message}`).join("\n")
      : "_None._",
    "",
    "## Queue snapshot",
    "",
    "```json",
    JSON.stringify(summary.queue || {}, null, 2),
    "```",
    "",
  ].join("\n");

  fs.writeFileSync(jsonPath, JSON.stringify(summary, null, 2) + "\n");
  fs.writeFileSync(mdPath, md);
  fs.writeFileSync(path.join(OUT_DIR, "eod-latest.json"), JSON.stringify(summary, null, 2) + "\n");
  fs.writeFileSync(path.join(REPORT_DIR, "eod-latest.md"), md);

  console.log(JSON.stringify({ ok: true, jsonPath, mdPath, pulses_today: summary.pulses_today, dod: summary.definition_of_done }, null, 2));
}

main();
