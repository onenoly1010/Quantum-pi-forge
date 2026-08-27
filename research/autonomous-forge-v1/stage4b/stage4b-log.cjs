#!/usr/bin/env node
/**
 * stage4b-log.cjs — append-only 4B receipt log helper.
 * Used by the runner and its child workers ONLY. The blind checker
 * (stage4b-checker.cjs) deliberately does NOT import this module.
 */
"use strict";
const fs = require("fs");
const path = require("path");

const DIR = __dirname;
const RECEIPT_LOG = path.join(DIR, "stage4b-receipts.jsonl");

let seqCounter = {};

function append(rec) {
  fs.appendFileSync(RECEIPT_LOG, JSON.stringify(rec) + "\n", "utf8");
}

/** Per-(run_id, agent) monotonic operation sequence for attribution (C6).
 *  Derived from the log itself so that parent and child processes share one
 *  sequence per agent (a per-process counter would collide across forks). */
function nextOpSeq(runId, agent) {
  const used = readValid().receipts.filter(
    (r) => r.kind === "decision" && r.run_id === runId && r.agent === agent
  ).length;
  return used + 1;
}

/**
 * Read the log. Returns { receipts, torn } where torn entries are
 * unparseable/truncated lines (durability gaps, never committed state).
 */
function readValid() {
  if (!fs.existsSync(RECEIPT_LOG)) return { receipts: [], torn: [] };
  const raw = fs.readFileSync(RECEIPT_LOG, "utf8");
  const lines = raw.split("\n");
  const receipts = [];
  const torn = [];
  lines.forEach((l, i) => {
    if (l.trim() === "") return;
    try {
      receipts.push(JSON.parse(l));
    } catch {
      torn.push({ line_no: i + 1, bytes: l.length, prefix: l.slice(0, 40) });
    }
  });
  return { receipts, torn };
}

/** Remove a torn trailing line (bytes after the last valid newline). */
function repairTornTrailing() {
  if (!fs.existsSync(RECEIPT_LOG)) return null;
  const raw = fs.readFileSync(RECEIPT_LOG, "utf8");
  const lastNl = raw.lastIndexOf("\n");
  const tail = raw.slice(lastNl + 1);
  if (tail.length === 0) return null;
  try { JSON.parse(tail); return null; } catch { /* torn */ }
  fs.writeFileSync(RECEIPT_LOG, raw.slice(0, lastNl + 1), "utf8");
  return { torn_bytes: tail.length, prefix: tail.slice(0, 40) };
}

function reset() {
  try { fs.unlinkSync(RECEIPT_LOG); } catch { /* absent */ }
  seqCounter = {};
}

module.exports = { RECEIPT_LOG, append, nextOpSeq, readValid, repairTornTrailing, reset };
