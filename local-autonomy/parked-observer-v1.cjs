#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const cp = require("child_process");
const http = require("http");

const root = process.cwd();
const logDir = path.join(root, "local-autonomy", "logs");
const stateDir = path.join(root, "local-autonomy", "state");
fs.mkdirSync(logDir, { recursive: true });
fs.mkdirSync(stateDir, { recursive: true });

const intervalMs = Number(process.env.OBSERVER_INTERVAL_MS || 120000);
const allowBuild = process.env.OBSERVER_ALLOW_BUILD === "1";
const once = process.argv.includes("--once");

const forbidden = [
  "deploy", "broadcast", "private_key", "mnemonic", "unpark", "activate",
  "cast send", "forge script", "hardhat run", "0g", "evmrpc", "wallet",
  "git stash", "git reset --hard", "rm -rf"
];

function stamp() {
  return new Date().toISOString().replace(/[:.]/g, "-");
}

function writeLog(name, text) {
  fs.writeFileSync(path.join(logDir, `${stamp()}-${name}.log`), String(text) + "\n");
}

function run(cmd, args, timeoutMs = 45000) {
  const full = [cmd].concat(args || []).join(" ");
  const lower = full.toLowerCase();
  for (const bad of forbidden) {
    if (lower.includes(bad) && !lower.includes("grep") && !lower.includes("scan")) {
      return { ok: false, blocked: true, command: full, output: `BLOCKED_FORBIDDEN_COMMAND: ${bad}` };
    }
  }
  try {
    const output = cp.execFileSync(cmd, args || [], { cwd: root, timeout: timeoutMs, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
    return { ok: true, blocked: false, command: full, output };
  } catch (e) {
    return { ok: false, blocked: false, command: full, output: String((e.stdout || "") + (e.stderr || "") + "\n" + e.message) };
  }
}

function readJson(file) {
  try { return JSON.parse(fs.readFileSync(path.join(root, file), "utf8")); } catch { return null; }
}

function safePackageScripts() {
  const pkg = readJson("package.json");
  if (!pkg || !pkg.scripts) return [];
  const scripts = Object.keys(pkg.scripts);
  return scripts.filter((s) => {
    const body = String(pkg.scripts[s] || "").toLowerCase();
    const name = s.toLowerCase();
    const dangerous = forbidden.some((bad) => body.includes(bad) || name.includes(bad));
    const allowedName = name.includes("verify") || name.includes("check") || name.includes("governance") || name.includes("autonomous:mainnet-cutover-command-hash") || name.includes("autonomous:mainnet-cutover-final-operator-approval");
    return allowedName && !dangerous;
  });
}

function scanBoundary() {
  const hits = [];
  const files = [];
  for (const base of ["docs", "receipts", "local-autonomy"]) {
    const abs = path.join(root, base);
    if (!fs.existsSync(abs)) continue;
    const walk = (dir) => {
      for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
        const p = path.join(dir, ent.name);
        if (ent.isDirectory()) walk(p);
        else if (/\.(md|json|txt|log)$/i.test(ent.name)) files.push(p);
      }
    };
    walk(abs);
  }
  for (const f of files.slice(-400)) {
    let t = "";
    try { t = fs.readFileSync(f, "utf8"); } catch { continue; }
    if (t.includes("READY_TO_UNPARK_CANDIDATE=true") || t.includes("\"READY_TO_UNPARK_CANDIDATE\": true")) hits.push("READY_TO_UNPARK_CANDIDATE=true");
    if (t.includes("UNPARK_EXECUTED=false") || t.includes("\"UNPARK_EXECUTED\": false")) hits.push("UNPARK_EXECUTED=false");
    if (t.includes("ACTIVATION_BOUNDARY_REACHED=true") || t.includes("\"ACTIVATION_BOUNDARY_REACHED\": true")) hits.push("ACTIVATION_BOUNDARY_REACHED=true");
  }
  return Array.from(new Set(hits));
}

function ollamaGenerate(prompt) {
  return new Promise((resolve) => {
    const payload = JSON.stringify({ model: process.env.OBSERVER_MODEL || "qwen2.5-coder:7b", prompt, stream: false });
    const req = http.request({ hostname: "127.0.0.1", port: 11434, path: "/api/generate", method: "POST", timeout: 30000, headers: { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(payload) } }, (res) => {
      let data = "";
      res.on("data", (d) => data += d);
      res.on("end", () => {
        try { resolve(JSON.parse(data).response || ""); } catch { resolve(""); }
      });
    });
    req.on("error", () => resolve(""));
    req.on("timeout", () => { req.destroy(); resolve(""); });
    req.write(payload);
    req.end();
  });
}

async function cycle() {
  const report = [];
  report.push("PARKED_AUTONOMOUS_OBSERVER_V1");
  report.push("time=" + new Date().toISOString());
  report.push("NON_EXECUTING=true");
  report.push("UNPARK_EXECUTED=false");
  report.push("ACTIVATION_EXECUTED=false");
  report.push("DEPLOYMENT_EXECUTED=false");
  report.push("BROADCAST_EXECUTED=false");
  report.push("STATE_CHANGE_EXECUTED=false");
  report.push("KEY_ACCESS=false");
  report.push("ZERO_G_ACTIONS=false");

  const gitStatus = run("git", ["status", "--short"], 15000);
  const gitBranch = run("git", ["branch", "--show-current"], 15000);
  const gitLog = run("git", ["log", "--oneline", "-5"], 15000);
  report.push("--- git branch ---\n" + gitBranch.output.trim());
  report.push("--- git status ---\n" + (gitStatus.output.trim() || "clean"));
  report.push("--- git log ---\n" + gitLog.output.trim());

  const scripts = safePackageScripts();
  report.push("--- safe verifier scripts discovered ---\n" + (scripts.join("\n") || "none"));
  for (const s of scripts.slice(0, 8)) {
    const r = run("npm", ["run", s, "--if-present"], 90000);
    report.push(`--- npm run ${s} ---\nok=${r.ok}\nblocked=${r.blocked}\n${r.output}`);
  }

  if (allowBuild) {
    const b = run("npm", ["run", "build", "--if-present"], 120000);
    report.push(`--- optional build ---\nok=${b.ok}\n${b.output}`);
  } else {
    report.push("--- optional build ---\nskipped; set OBSERVER_ALLOW_BUILD=1 to allow local build observation");
  }

  const grep = run("bash", ["-lc", "grep -RInE \"PRIVATE_KEY|MNEMONIC|DEPLOY|BROADCAST|UNPARK_EXECUTED=true|ACTIVATION_EXECUTED=true|state_changing_transaction_executed.: true\" docs receipts scripts package.json 2>/dev/null | head -120"], 30000);
  report.push("--- unsafe flag scan ---\n" + (grep.output.trim() || "no unsafe flags found"));

  const boundaryHits = scanBoundary();
  report.push("--- boundary hits ---\n" + (boundaryHits.join("\n") || "none"));

  const summaryPrompt = "You are a local parked governance observer. Summarize this report in 8 lines max. Do not recommend activation, unpark, deployment, broadcast, 0G actions, key access, or state change. Report only readiness and blockers.\\n\\n" + report.join("\\n\\n").slice(-12000);
  const ai = await ollamaGenerate(summaryPrompt);
  if (ai) report.push("--- local ai summary ---\n" + ai.trim());
  else report.push("--- local ai summary ---\nOllama unavailable or model not loaded; observer continued without AI.");

  const text = report.join("\n\n");
  writeLog("observer-cycle", text);
  fs.writeFileSync(path.join(stateDir, "latest-report.txt"), text + "\n");
  console.log(text);

  const reached = boundaryHits.includes("READY_TO_UNPARK_CANDIDATE=true") && boundaryHits.includes("UNPARK_EXECUTED=false") && boundaryHits.includes("ACTIVATION_BOUNDARY_REACHED=true");
  if (reached) {
    const final = [
      "BOUNDARY_REACHED=true",
      "READY_TO_UNPARK_CANDIDATE=true",
      "UNPARK_EXECUTED=false",
      "ACTIVATION_BOUNDARY_REACHED=true",
      "STOPPING_BEFORE_ACTIVATION=true",
      "NO_ACTIVATION_PERFORMED=true"
    ].join("\n");
    fs.writeFileSync(path.join(stateDir, "boundary-reached.txt"), final + "\n");
    console.log(final);
    process.exit(0);
  }
}

async function main() {
  console.log("PARKED OBSERVER STARTED");
  console.log("This agent observes only. It will not activate, unpark, deploy, broadcast, access keys, or touch 0G.");
  while (true) {
    await cycle();
    if (once) break;
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }
}

main().catch((e) => {
  writeLog("observer-error", e && e.stack ? e.stack : String(e));
  console.error(e);
  process.exit(1);
});
