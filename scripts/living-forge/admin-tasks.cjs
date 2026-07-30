#!/usr/bin/env node
/**
 * Day-3 admin P3 task runners — docs/PR/grant only.
 * NO_WALLET_TOUCH. No merge, no send, no wallet.
 */
"use strict";

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { execSync } = require("child_process");

const ROOT = path.resolve(__dirname, "../..");
const HEARTBEAT_DIR = path.join(ROOT, "docs/activation/living-forge/heartbeats");
const ADMIN_OUT = path.join(ROOT, "artifacts/kpi/admin");
const GRANT_TRACKER = path.join(ROOT, "0G_GRANT_STATUS_TRACKING.md");
const GRANT_SNAP = path.join(ADMIN_OUT, "grant-tracker-snapshot.json");

function now() {
  return new Date().toISOString().replace(/\.\d{3}Z$/, "Z");
}

function tsFile() {
  return now().replace(/[:.]/g, "").slice(0, 15);
}

function sh(cmd, timeoutMs = 60000) {
  try {
    const out = execSync(cmd, {
      cwd: ROOT,
      encoding: "utf8",
      timeout: timeoutMs,
      stdio: ["ignore", "pipe", "pipe"],
      env: { ...process.env, NO_WALLET_TOUCH: "true" },
    });
    return { ok: true, out: out || "", code: 0 };
  } catch (e) {
    return {
      ok: false,
      out: ((e.stdout || "") + (e.stderr || "") + (e.message || "")).slice(0, 12000),
      code: e.status == null ? 1 : e.status,
    };
  }
}

function ensureDirs() {
  fs.mkdirSync(HEARTBEAT_DIR, { recursive: true });
  fs.mkdirSync(ADMIN_OUT, { recursive: true });
}

function sha256(text) {
  return crypto.createHash("sha256").update(text).digest("hex");
}

/**
 * Scan selected docs for stale "pending" / TODO language and old mtimes.
 */
function staleDocScan(opts = {}) {
  ensureDirs();
  const maxAgeDays = opts.maxAgeDays || 30;
  const roots = opts.roots || [
    "docs",
    "STATUS.md",
    "README.md",
    "0G_GRANT_STATUS_TRACKING.md",
    "docs/activation",
    "docs/governance",
  ];
  const pendingRe = /\b(PENDING|TODO|TBD|FIXME|AWAITING|not yet|GATE_FALSE)\b/i;
  const cutoff = Date.now() - maxAgeDays * 86400000;
  const findings = [];

  function walk(rel) {
    const abs = path.join(ROOT, rel);
    if (!fs.existsSync(abs)) return;
    const st = fs.statSync(abs);
    if (st.isDirectory()) {
      if (rel.includes("node_modules") || rel.includes(".git")) return;
      let entries = [];
      try {
        entries = fs.readdirSync(abs);
      } catch {
        return;
      }
      for (const e of entries) {
        if (e === "node_modules" || e === ".git" || e === "cache") continue;
        walk(path.join(rel, e));
      }
      return;
    }
    if (!/\.(md|json)$/i.test(rel)) return;
    // skip noisy generated heartbeats
    if (rel.includes("heartbeats/") || rel.includes("artifacts/kpi/history")) return;
    let text = "";
    try {
      text = fs.readFileSync(abs, "utf8");
    } catch {
      return;
    }
    const ageDays = (Date.now() - st.mtimeMs) / 86400000;
    const hasPending = pendingRe.test(text);
    const old = st.mtimeMs < cutoff;
    if (!hasPending && !old) return;
    // only flag old if also has pending-like language, or very old pending docs
    if (hasPending || (old && pendingRe.test(text.slice(0, 2000)))) {
      const lines = text.split("\n");
      const hits = [];
      for (let i = 0; i < lines.length && hits.length < 5; i++) {
        if (pendingRe.test(lines[i])) hits.push({ line: i + 1, text: lines[i].trim().slice(0, 160) });
      }
      findings.push({
        path: rel.replace(/\\/g, "/"),
        mtime_utc: new Date(st.mtimeMs).toISOString(),
        age_days: Number(ageDays.toFixed(1)),
        older_than_days: maxAgeDays,
        pending_hits: hits,
      });
    }
  }

  for (const r of roots) walk(r);
  findings.sort((a, b) => b.age_days - a.age_days);

  const report = {
    schema: "qpf.admin.stale_doc_scan.v1",
    at_utc: now(),
    no_wallet_touch: true,
    max_age_days: maxAgeDays,
    count: findings.length,
    findings: findings.slice(0, 80),
  };
  const outPath = path.join(ADMIN_OUT, `stale-doc-scan-${tsFile()}.json`);
  const latest = path.join(ADMIN_OUT, "stale-doc-scan-latest.json");
  fs.writeFileSync(outPath, JSON.stringify(report, null, 2) + "\n");
  fs.writeFileSync(latest, JSON.stringify(report, null, 2) + "\n");
  fs.writeFileSync(path.join(HEARTBEAT_DIR, `stale-doc-scan-${tsFile()}.json`), JSON.stringify(report, null, 2) + "\n");

  return {
    ok: true,
    summary: `stale-doc scan findings=${report.count} (max_age_days=${maxAgeDays})`,
    detail: latest,
    report,
  };
}

/**
 * Deterministic PR classification via gh (no merge).
 * MERGEABLE => SAFE_CANDIDATE, CONFLICTING => HOLD, else UNKNOWN.
 */
function openPrClassify() {
  ensureDirs();
  const r = sh(
    'gh pr list --repo onenoly1010/Quantum-pi-forge --state open --limit 30 --json number,title,url,isDraft,mergeable,headRefName,baseRefName,updatedAt 2>&1',
    90000
  );
  let prs = [];
  if (r.ok) {
    try {
      prs = JSON.parse(r.out);
    } catch {
      prs = [];
    }
  }

  const classified = (Array.isArray(prs) ? prs : []).map((pr) => {
    let verdict = "UNKNOWN_REVIEW";
    if (pr.isDraft) verdict = "DRAFT_HOLD";
    else if (pr.mergeable === "MERGEABLE") verdict = "SAFE_CANDIDATE";
    else if (pr.mergeable === "CONFLICTING") verdict = "HOLD_BLOCKED";
    else if (pr.mergeable === "UNKNOWN") verdict = "UNKNOWN_REVIEW";
    return {
      number: pr.number,
      title: pr.title,
      url: pr.url,
      head: pr.headRefName,
      base: pr.baseRefName,
      mergeable: pr.mergeable,
      isDraft: pr.isDraft,
      updatedAt: pr.updatedAt,
      verdict,
      note: "Deterministic only — AI commentary is non-authoritative; no auto-merge",
    };
  });

  const report = {
    schema: "qpf.admin.open_pr_classify.v1",
    at_utc: now(),
    no_wallet_touch: true,
    gh_ok: r.ok,
    gh_error: r.ok ? null : r.out.slice(0, 500),
    count: classified.length,
    safe_candidates: classified.filter((c) => c.verdict === "SAFE_CANDIDATE").map((c) => c.number),
    hold_blocked: classified.filter((c) => c.verdict === "HOLD_BLOCKED").map((c) => c.number),
    prs: classified,
  };

  const outPath = path.join(ADMIN_OUT, `open-pr-classify-${tsFile()}.json`);
  const latest = path.join(ADMIN_OUT, "open-pr-classify-latest.json");
  const md = [
    "# Open PR Classification (deterministic)",
    "",
    `**At:** ${report.at_utc}`,
    `**NO_WALLET_TOUCH:** true`,
    `**Count:** ${report.count}`,
    "",
    "| # | Verdict | Mergeable | Title |",
    "| ---: | --- | --- | --- |",
    ...classified.map(
      (c) => `| ${c.number} | ${c.verdict} | ${c.mergeable} | ${String(c.title).replace(/\|/g, "/")} |`
    ),
    "",
    "_No merges. No wallet actions. Human decides._",
    "",
  ].join("\n");

  fs.writeFileSync(outPath, JSON.stringify(report, null, 2) + "\n");
  fs.writeFileSync(latest, JSON.stringify(report, null, 2) + "\n");
  fs.writeFileSync(path.join(ADMIN_OUT, "open-pr-classify-latest.md"), md);
  fs.writeFileSync(path.join(HEARTBEAT_DIR, `open-pr-classify-${tsFile()}.json`), JSON.stringify(report, null, 2) + "\n");

  // ok even if gh fails — surface error in summary for observability
  return {
    ok: true,
    summary: r.ok
      ? `PR classify n=${report.count} safe=${report.safe_candidates.length} hold=${report.hold_blocked.length}`
      : `PR classify gh_unavailable n=0 (${(report.gh_error || "").slice(0, 80)})`,
    detail: latest,
    report,
  };
}

/**
 * Diff grant tracker against last snapshot (content hash + section hints).
 */
function grantTrackerDiff() {
  ensureDirs();
  if (!fs.existsSync(GRANT_TRACKER)) {
    return { ok: false, summary: "grant tracker missing", detail: GRANT_TRACKER };
  }
  const text = fs.readFileSync(GRANT_TRACKER, "utf8");
  const hash = sha256(text);
  const st = fs.statSync(GRANT_TRACKER);
  const prev = fs.existsSync(GRANT_SNAP) ? JSON.parse(fs.readFileSync(GRANT_SNAP, "utf8")) : null;

  const statusLine = (text.match(/Current Status\s*\|\s*\*\*([^*]+)\*\*/i) || [])[1] || null;
  const guildRef = (text.match(/Guild Reference ID\s*\|\s*([^\n|]+)/i) || [])[1] || null;

  const current = {
    at_utc: now(),
    path: "0G_GRANT_STATUS_TRACKING.md",
    sha256: hash,
    bytes: text.length,
    mtime_utc: st.mtime.toISOString(),
    status_line: statusLine,
    guild_ref: guildRef && guildRef.trim(),
  };

  const changed = !prev || prev.sha256 !== hash;
  const report = {
    schema: "qpf.admin.grant_tracker_diff.v1",
    at_utc: now(),
    no_wallet_touch: true,
    changed,
    previous: prev
      ? { sha256: prev.sha256, at_utc: prev.at_utc, status_line: prev.status_line }
      : null,
    current,
    delta: changed
      ? {
          hash_changed: !prev || prev.sha256 !== hash,
          status_changed: !!(prev && prev.status_line !== current.status_line),
          first_snapshot: !prev,
        }
      : { hash_changed: false, status_changed: false, first_snapshot: false },
  };

  // update snapshot after diff
  fs.writeFileSync(GRANT_SNAP, JSON.stringify(current, null, 2) + "\n");
  const outPath = path.join(ADMIN_OUT, `grant-tracker-diff-${tsFile()}.json`);
  const latest = path.join(ADMIN_OUT, "grant-tracker-diff-latest.json");
  fs.writeFileSync(outPath, JSON.stringify(report, null, 2) + "\n");
  fs.writeFileSync(latest, JSON.stringify(report, null, 2) + "\n");
  fs.writeFileSync(path.join(HEARTBEAT_DIR, `grant-tracker-diff-${tsFile()}.json`), JSON.stringify(report, null, 2) + "\n");

  return {
    ok: true,
    summary: changed
      ? `grant-tracker CHANGED sha=${hash.slice(0, 12)} status=${current.status_line || "?"}`
      : `grant-tracker unchanged sha=${hash.slice(0, 12)}`,
    detail: latest,
    report,
  };
}

module.exports = {
  staleDocScan,
  openPrClassify,
  grantTrackerDiff,
};

if (require.main === module) {
  process.env.NO_WALLET_TOUCH = "true";
  const cmd = process.argv[2] || "all";
  const out = {};
  if (cmd === "stale" || cmd === "all") out.stale = staleDocScan();
  if (cmd === "pr" || cmd === "all") out.pr = openPrClassify();
  if (cmd === "grant" || cmd === "all") out.grant = grantTrackerDiff();
  console.log(JSON.stringify(out, null, 2));
}
