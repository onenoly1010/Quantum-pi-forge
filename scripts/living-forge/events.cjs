#!/usr/bin/env node
/**
 * Structured autonomy events for Day-2 observability.
 * Append-only JSONL + latest compact view.
 */
"use strict";

const fs = require("fs");
const path = require("path");
const os = require("os");

const ROOT = path.resolve(__dirname, "../..");
const EVENTS_DIR = path.join(ROOT, "artifacts", "kpi", "events");
const EVENTS_JSONL = path.join(EVENTS_DIR, "events.jsonl");
const EVENTS_LATEST = path.join(EVENTS_DIR, "latest-event.json");
const HOME_EVENTS = path.join(os.homedir(), ".forge-daemon", "kpi", "events.jsonl");

function now() {
  return new Date().toISOString().replace(/\.\d{3}Z$/, "Z");
}

function emit(type, payload = {}) {
  const event = {
    schema: "qpf.autonomy_event.v1",
    type, // claimed | expired | retried | dead_lettered | escalated | pulse | completed | failed | policy_block
    at_utc: now(),
    no_wallet_touch: process.env.NO_WALLET_TOUCH === "true",
    ...payload,
  };
  fs.mkdirSync(EVENTS_DIR, { recursive: true });
  fs.appendFileSync(EVENTS_JSONL, JSON.stringify(event) + "\n");
  fs.writeFileSync(EVENTS_LATEST, JSON.stringify(event, null, 2) + "\n");
  try {
    fs.mkdirSync(path.dirname(HOME_EVENTS), { recursive: true });
    fs.appendFileSync(HOME_EVENTS, JSON.stringify(event) + "\n");
  } catch {
    /* ignore home write errors */
  }
  return event;
}

function readRecent(limit = 50) {
  if (!fs.existsSync(EVENTS_JSONL)) return [];
  const lines = fs.readFileSync(EVENTS_JSONL, "utf8").trim().split("\n").filter(Boolean);
  return lines
    .slice(-limit)
    .map((l) => {
      try {
        return JSON.parse(l);
      } catch {
        return null;
      }
    })
    .filter(Boolean);
}

function countByType(sinceMs = 0) {
  const recent = readRecent(500);
  const counts = {};
  for (const e of recent) {
    const t = Date.parse(e.at_utc || 0);
    if (sinceMs && t < sinceMs) continue;
    counts[e.type] = (counts[e.type] || 0) + 1;
  }
  return counts;
}

module.exports = { emit, readRecent, countByType, EVENTS_JSONL, EVENTS_DIR };

if (require.main === module) {
  process.env.NO_WALLET_TOUCH = "true";
  const type = process.argv[2] || "pulse";
  console.log(JSON.stringify(emit(type, { source: "cli" }), null, 2));
}
