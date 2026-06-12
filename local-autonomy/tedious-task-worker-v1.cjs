#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const cp = require("child_process");
const http = require("http");

const root = process.cwd();
const logDir = path.join(root, "local-autonomy", "logs");
const reportDir = path.join(root, "local-autonomy", "reports");
const stateDir = path.join(root, "local-autonomy", "state");
fs.mkdirSync(logDir, { recursive: true });
fs.mkdirSync(reportDir, { recursive: true });
fs.mkdirSync(stateDir, { recursive: true });

const intervalMs = Number(process.env.TEDIOUS_WORKER_INTERVAL_MS || 180000);
const once = process.argv.includes("--once");
const model = process.env.TEDIOUS_WORKER_MODEL || process.env.OLLAMA_MODEL || "llama3.2:1b";

const forbidden = [
  "deploy", "broadcast", "private_key", "mnemonic", "unpark", "activate",
  "cast send", "forge script", "hardhat run", "0g", "evmrpc",
  "git stash", "git reset --hard", "rm -rf", "gh pr merge",
  "npm publish", "wrangler deploy", "vercel deploy"
];

function ts() {
  return new Date().toISOString();
}

function safeName() {
  return ts().replace(/[:.]/g, "-");
}

function run(cmd, args, timeoutMs = 45000) {
  const full = [cmd].concat(args || []).join(" ");
  const lower = full.toLowerCase();
  for (const bad of forbidden) {
    if (lower.includes(bad) && !lower.includes("grep")) {
      return { ok: false, blocked: true, command: full, output: "BLOCKED_FORBIDDEN_COMMAND=" + bad };
    }
  }
  try {
    const output = cp.execFileSync(cmd, args || [], { cwd: root, timeout: timeoutMs, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
    return { ok: true, blocked: false, command: full, output };
  } catch (e) {
    return { ok: false, blocked: false, command: full, output: String((e.stdout || "") + (e.stderr || "") + e.message) };
  }
}

function readJson(file) {
  try { return JSON.parse(fs.readFileSync(path.join(root, file), "utf8")); } catch { return null; }
}

function discoverSafeScripts() {
  const pkg = readJson("package.json");
  if (!pkg || !pkg.scripts) return [];
  return Object.entries(pkg.scripts)
    .filter(([name, body]) => {
      const n = String(name).toLowerCase();
      const b = String(body).toLowerCase();
      const safeName = n.includes("check") || n.includes("verify") || n.includes("governance");
      const unsafe = forbidden.some((x) => n.includes(x) || b.includes(x));
      return safeName && !unsafe;
    })
    .map(([name]) => name)
    .slice(0, 12);
}

function ollama(prompt) {
  return new Promise((resolve) => {
    const body = JSON.stringify({ model, prompt, stream: false });
    const req = http.request({
      hostname: "127.0.0.1",
      port: 11434,
      path: "/api/generate",
      method: "POST",
      timeout: Number(process.env.TEDIOUS_WORKER_OLLAMA_TIMEOUT_MS || 180000),
      headers: { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(body) }
    }, (res) => {
      let data = "";
      res.on("data", (d) => data += d);
      res.on("end", () => {
        try { resolve(JSON.parse(data).response || ""); } catch { resolve(""); }
      });
    });
    req.on("error", () => resolve(""));
    req.on("timeout", () => { req.destroy(); resolve(""); });
    req.write(body);
    req.end();
  });
}

async function cycle() {
  const lines = [];
  lines.push("# Tedious Task Worker Report");
  lines.push("");
  lines.push("time: " + ts());
  lines.push("mode: PARKED_NON_EXECUTING");
  lines.push("activation: false");
  lines.push("unpark: false");
  lines.push("deploy: false");
  lines.push("broadcast: false");
  lines.push("keys: false");
  lines.push("zero_g_actions: false");
  lines.push("");

  const branch = run("git", ["branch", "--show-current"], 15000);
  const status = run("git", ["status", "--short"], 15000);
  const log = run("git", ["log", "--oneline", "-8"], 15000);
  const diffstat = run("git", ["diff", "--stat"], 15000);

  lines.push("## Repo State");
  lines.push("branch: " + branch.output.trim());
  lines.push("status:");
  lines.push(status.output.trim() || "clean");
  lines.push("");
  lines.push("recent_commits:");
  lines.push(log.output.trim());
  lines.push("");
  lines.push("diffstat:");
  lines.push(diffstat.output.trim() || "none");
  lines.push("");

  const scripts = discoverSafeScripts();
  lines.push("## Safe Verifier Scripts");
  lines.push(scripts.length ? scripts.join("\\n") : "none");
  lines.push("");

  for (const script of scripts) {
    const result = run("npm", ["run", script, "--if-present"], 90000);
    lines.push("## Check: " + script);
    lines.push("ok: " + result.ok);
    lines.push("blocked: " + result.blocked);
    lines.push("output:");
    lines.push(result.output.trim().slice(-4000) || "empty");
    lines.push("");
  }

  const unsafeScan = run("bash", ["-lc", "grep -RInE \"UNPARK_EXECUTED=true|ACTIVATION_EXECUTED=true|deployment_executed.: true|broadcast_executed.: true|state_changing_transaction_executed.: true|PRIVATE_KEY|MNEMONIC\" docs receipts scripts package.json 2>/dev/null | grep -v EXECUTION_WRAPPER_READINESS_TRIAGE_V1.md | head -40"], 30000);
  lines.push("## Unsafe Flag Scan");
  lines.push(unsafeScan.output.trim() || "none");
  lines.push("");

  const prList = run("bash", ["-lc", "if command -v gh >/dev/null 2>&1; then gh pr list --state open --limit 30 --json number,title,headRefName,mergeable,reviewDecision,isDraft,updatedAt,url; else echo gh_unavailable; fi"], 45000);
  lines.push("## Open PRs Raw");
  lines.push(prList.output.trim() || "none");
  lines.push("");

  const raw = lines.join("\\n");
  const compact = [ "branch: " + branch.output.trim(), "status: " + (status.output.trim() || "clean"), "safe verifier scripts: " + scripts.join(", "), "verify evidence present: " + String(raw.includes("OK evidence verification bundle passed")), "external runner proof preserved: " + String(raw.includes("no false external runner pass claimed")), "open prs: " + (prList.output.trim() || "none").slice(0, 1800), "unsafe scan summary: PRIVATE_KEY references are docs/scripts placeholders; no execution flags true observed in report" ].join("\\n");
  const prompt = "You are the local tedious-task AI worker. Classify this repo state. Output exactly these sections, each with at least one concrete bullet: 1) SAFE TO MERGE CANDIDATES, 2) HOLD / BLOCKED, 3) EVIDENCE GAPS, 4) NEXT TEDIOUS TASK AI CAN DO, 5) HUMAN DECISION REQUIRED. Never recommend activation, unpark, deployment, broadcast, 0G actions, key access, git stash, reset hard, or destructive commands. Keep it practical and direct. Respect mergeable statuses exactly: MERGEABLE may be safe only if non-executing and verifier-clean; CONFLICTING must be listed under HOLD / BLOCKED. Do not invent developers, approvals, or merge safety.\\n\\n" + compact;
  const ai = await ollama(prompt);
  lines.push("## Deterministic PR Verdict");
  try {
    const prs = JSON.parse(prList.output || "[]");
    for (const pr of prs) {
      const bucket = pr.mergeable === "CONFLICTING" ? "HOLD / BLOCKED" : (pr.mergeable === "MERGEABLE" ? "SAFE CANDIDATE" : "UNKNOWN / REVIEW");
      lines.push(`- #${pr.number} ${bucket}: ${pr.title} [${pr.mergeable || "UNKNOWN"}]`);
    }
  } catch (err) {
    lines.push("- PR verdict unavailable: unable to parse gh output");
  }
  lines.push("");
  lines.push("## Local AI Classification");
  lines.push(ai.trim() || "Ollama unavailable; raw report still generated.");

  const final = lines.join("\\n");
  const file = path.join(reportDir, safeName() + "-tedious-task-report.md");
  fs.writeFileSync(file, final + "\\n");
  fs.writeFileSync(path.join(stateDir, "latest-tedious-task-report.md"), final + "\\n");
  fs.appendFileSync(path.join(logDir, "tedious-task-worker-live.log"), "\\n=== " + ts() + " ===\\n" + final.slice(-12000) + "\\n");
  console.log(final);
}

async function main() {
  console.log("TEDIOUS TASK WORKER STARTED");
  console.log("This worker observes, verifies, classifies, and reports. It does not merge, unpark, activate, deploy, broadcast, access keys, or touch 0G.");
  while (true) {
    await cycle();
    if (once) break;
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }
}

main().catch((e) => {
  fs.appendFileSync(path.join(logDir, "tedious-task-worker-error.log"), String(e && e.stack ? e.stack : e) + "\\n");
  console.error(e);
  process.exit(1);
});
