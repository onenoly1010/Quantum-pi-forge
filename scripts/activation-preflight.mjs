#!/usr/bin/env node
/**
 * Edge activation preflight — local execution gate before Cloudflare Pages deploy.
 *
 * Scope (strict):
 *   1. Build output includes a non-empty out/_headers with required security directives
 *   2. Project 0G RPC / chain configuration is present and correctly formatted
 *   3. Optional live eth_chainId probe against project-configured RPC only
 *
 * Does NOT:
 *   - Sign, spend, broadcast, or open wallets
 *   - Invent or substitute RPC endpoints
 *   - Deploy to Cloudflare
 *   - Authorize rebase/merge
 *
 * Usage:
 *   npm run activation:preflight
 *   npm run activation:preflight -- --skip-live-rpc
 *   npm run activation:preflight -- --require-build
 *
 * Exit: 0 EDGE_READY | 2 NOT_READY | 1 error
 */

import { existsSync, readFileSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

const EXPECTED_CHAIN_ID = 16661;
const PROJECT_RPC = "https://evmrpc.0g.ai";
const PROJECT_EXPLORER = "https://chainscan.0g.ai";

const MIN_HEADERS_BYTES = 64;
const REQUIRED_HEADER_TOKENS = [
  "Content-Security-Policy",
  "X-Content-Type-Options",
  "X-Frame-Options",
  "Strict-Transport-Security",
  "/metadata/*",
];

const args = new Set(process.argv.slice(2));
const SKIP_LIVE = args.has("--skip-live-rpc");
const REQUIRE_BUILD = args.has("--require-build");

/** @type {{ ok: boolean, label: string, measured: string, required: string, note?: string }[]} */
const facts = [];

function fact(ok, label, measured, required, note = "") {
  facts.push({
    ok: !!ok,
    label,
    measured: String(measured),
    required: String(required),
    note: note ? String(note) : "",
  });
}

function readText(rel) {
  const abs = join(ROOT, rel);
  if (!existsSync(abs)) return null;
  return readFileSync(abs, "utf8");
}

/**
 * Extract first https URL that looks like a 0G EVM RPC from known project files.
 * Never invents; only reports what is configured.
 */
function discoverProjectRpcConfig() {
  const sources = [];

  const deployed = readText("contracts/DEPLOYED_ADDRESSES.md");
  if (deployed) {
    const m = deployed.match(/RPC:\s*`?(https:\/\/[^\s`]+)`?/i);
    if (m) sources.push({ file: "contracts/DEPLOYED_ADDRESSES.md", rpc: m[1].replace(/[)>.,]+$/, "") });
  }

  const envExample = readText(".env.launch.example");
  if (envExample) {
    const m = envExample.match(/^\s*ZERO_G_RPC_URL\s*=\s*(\S+)/m);
    if (m && !m[1].startsWith("#")) {
      sources.push({ file: ".env.launch.example", rpc: m[1].trim() });
    }
    const c = envExample.match(/^\s*ZERO_G_CHAIN_ID\s*=\s*(\d+)/m);
    if (c) sources.push({ file: ".env.launch.example", chainId: Number(c[1]) });
  }

  const wrangler = readText("wrangler.toml");
  if (wrangler) {
    const m = wrangler.match(/OG_CHAIN_ID\s*=\s*"?(\d+)"?/);
    if (m) sources.push({ file: "wrangler.toml", chainId: Number(m[1]) });
  }

  const headers = readText("deploy/_headers") || readText("out/_headers");
  if (headers) {
    const m = headers.match(/https:\/\/evmrpc[^\s;"]+/);
    if (m) sources.push({ file: "deploy/_headers (CSP connect-src)", rpc: m[0] });
  }

  const envRpc = process.env.RPC_URL?.trim() || process.env.ZERO_G_RPC_URL?.trim();
  if (envRpc) {
    sources.push({ file: "env:RPC_URL|ZERO_G_RPC_URL", rpc: envRpc });
  }

  return sources;
}

function isValid0gRpcUrl(url) {
  if (typeof url !== "string" || !url.trim()) return { ok: false, reason: "empty" };
  let u;
  try {
    u = new URL(url.trim());
  } catch {
    return { ok: false, reason: "not a valid URL" };
  }
  if (u.protocol !== "https:") {
    return { ok: false, reason: `protocol must be https (got ${u.protocol})` };
  }
  // Project-standard host pattern for Aristotle public RPC
  const host = u.hostname.toLowerCase();
  const allowedHosts = new Set(["evmrpc.0g.ai", "evmrpc-testnet.0g.ai"]);
  if (!allowedHosts.has(host) && !host.endsWith(".0g.ai")) {
    return {
      ok: false,
      reason: `host ${host} is not a known 0G RPC host (project default ${PROJECT_RPC})`,
    };
  }
  return { ok: true, reason: "ok", host };
}

async function liveChainId(rpcUrl) {
  const res = await fetch(rpcUrl, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "eth_chainId", params: [] }),
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const body = await res.json();
  if (body.error) throw new Error(body.error.message || JSON.stringify(body.error));
  return Number.parseInt(body.result, 16);
}

function checkHeadersSource() {
  const src = join(ROOT, "deploy/_headers");
  fact(
    existsSync(src),
    "deploy/_headers exists (source of truth)",
    existsSync(src) ? "present" : "missing",
    "present",
  );
  if (!existsSync(src)) return null;
  const bytes = statSync(src).size;
  fact(
    bytes >= MIN_HEADERS_BYTES,
    "deploy/_headers non-empty",
    `${bytes} bytes`,
    `>= ${MIN_HEADERS_BYTES} bytes`,
  );
  return readFileSync(src, "utf8");
}

function checkHeadersOutput(requireBuild) {
  const outPath = join(ROOT, "out/_headers");
  if (!existsSync(outPath)) {
    if (requireBuild) {
      fact(false, "out/_headers exists after build", "missing", "present");
      return null;
    }
    // Auto-build once so the gate is usable without a manual npm run build
    try {
      console.log("out/_headers missing — running npm run build …\n");
      execSync("npm run build", { cwd: ROOT, stdio: "inherit" });
    } catch {
      fact(false, "npm run build", "failed", "exit 0");
      return null;
    }
  }
  fact(existsSync(outPath), "out/_headers exists (edge output)", existsSync(outPath) ? "present" : "missing", "present");
  if (!existsSync(outPath)) return null;

  const bytes = statSync(outPath).size;
  fact(
    bytes >= MIN_HEADERS_BYTES,
    "out/_headers non-empty",
    `${bytes} bytes`,
    `>= ${MIN_HEADERS_BYTES} bytes`,
  );
  const text = readFileSync(outPath, "utf8");
  for (const token of REQUIRED_HEADER_TOKENS) {
    fact(
      text.includes(token),
      `out/_headers contains ${token}`,
      text.includes(token) ? "yes" : "no",
      "yes",
    );
  }
  // CSP should allow project RPC (no invented hosts)
  fact(
    text.includes("evmrpc.0g.ai"),
    "CSP connect-src includes project 0G RPC host",
    text.includes("evmrpc.0g.ai") ? "evmrpc.0g.ai" : "absent",
    "evmrpc.0g.ai",
  );
  return text;
}

function checkMetadataDir() {
  const meta = join(ROOT, "out/metadata");
  const src = join(ROOT, "metadata");
  fact(existsSync(src), "metadata/ source directory", existsSync(src) ? "present" : "missing", "present");
  fact(
    existsSync(meta),
    "out/metadata/ present (public mint metadata)",
    existsSync(meta) ? "present" : "missing",
    "present (run build)",
  );
}

function checkRpcConfig() {
  const sources = discoverProjectRpcConfig();
  const rpcEntries = sources.filter((s) => s.rpc);
  const chainEntries = sources.filter((s) => s.chainId != null);

  fact(
    rpcEntries.length > 0,
    "Project RPC URL discovered from local config",
    rpcEntries.length ? rpcEntries.map((s) => `${s.file}→${s.rpc}`).join("; ") : "none",
    `at least one of DEPLOYED_ADDRESSES / .env.launch.example / env (default ${PROJECT_RPC})`,
  );

  // Prefer env override only if set; else project default from files
  const primary =
    process.env.RPC_URL?.trim() ||
    process.env.ZERO_G_RPC_URL?.trim() ||
    rpcEntries.find((s) => s.rpc === PROJECT_RPC)?.rpc ||
    rpcEntries[0]?.rpc ||
    null;

  if (primary) {
    const v = isValid0gRpcUrl(primary);
    fact(
      v.ok,
      "Primary RPC URL format (https + 0G host)",
      primary,
      `https URL on known 0G host (e.g. ${PROJECT_RPC})`,
      v.ok ? "" : v.reason,
    );
  } else {
    fact(false, "Primary RPC URL format", "unset", PROJECT_RPC, "No configured RPC located");
  }

  const chainIds = [...new Set(chainEntries.map((s) => s.chainId))];
  if (chainIds.length) {
    fact(
      chainIds.every((id) => id === EXPECTED_CHAIN_ID),
      "Configured chain ID is Aristotle mainnet",
      chainIds.join(","),
      String(EXPECTED_CHAIN_ID),
    );
  } else {
    fact(
      true,
      "Configured chain ID is Aristotle mainnet",
      "not pinned in scanned files (will use live probe / default)",
      String(EXPECTED_CHAIN_ID),
      "wrangler OG_CHAIN_ID or ZERO_G_CHAIN_ID recommended",
    );
  }

  // Consistency: discovered RPCs should not invent foreign chains as primary
  for (const s of rpcEntries) {
    const v = isValid0gRpcUrl(s.rpc);
    if (!v.ok) {
      fact(false, `RPC format (${s.file})`, s.rpc, "valid 0G https RPC", v.reason);
    }
  }

  return primary;
}

async function checkLiveRpc(rpcUrl) {
  if (!rpcUrl) {
    fact(false, "Live eth_chainId probe", "skipped (no RPC)", `chainId ${EXPECTED_CHAIN_ID}`);
    return;
  }
  try {
    const id = await liveChainId(rpcUrl);
    fact(
      id === EXPECTED_CHAIN_ID,
      "Live eth_chainId matches Aristotle",
      String(id),
      String(EXPECTED_CHAIN_ID),
      `RPC ${rpcUrl}`,
    );
  } catch (e) {
    fact(
      false,
      "Live eth_chainId probe",
      `error: ${String(e.message || e).slice(0, 120)}`,
      `reachable ${rpcUrl} → ${EXPECTED_CHAIN_ID}`,
    );
  }
}

function printReport() {
  console.log("EDGE ACTIVATION PREFLIGHT");
  console.log("Role: local gate before Cloudflare Pages deploy (not a signer)");
  console.log(`Project RPC default: ${PROJECT_RPC}`);
  console.log(`Expected chain ID:   ${EXPECTED_CHAIN_ID}`);
  console.log(`Explorer:            ${PROJECT_EXPLORER}`);
  console.log("");

  let allOk = true;
  for (const f of facts) {
    const mark = f.ok ? "✓" : "✗";
    if (!f.ok) allOk = false;
    console.log(`${mark} ${f.label}`);
    console.log(`    measured:  ${f.measured}`);
    console.log(`    required:  ${f.required}`);
    if (f.note) console.log(`    note:      ${f.note}`);
    console.log("");
  }

  if (allOk) {
    console.log("RESULT: EDGE_READY");
    console.log("Human may proceed with deploy / rebase-merge sequence (see ACTIVATION_RUNBOOK_V1.md).");
    return 0;
  }
  console.log("RESULT: NOT_READY");
  console.log("Stop. Fix ✗ items before edge deploy or main merge.");
  return 2;
}

async function main() {
  checkHeadersSource();
  checkHeadersOutput(REQUIRE_BUILD);
  checkMetadataDir();
  const rpc = checkRpcConfig();
  if (!SKIP_LIVE) {
    await checkLiveRpc(rpc || PROJECT_RPC);
  } else {
    fact(true, "Live eth_chainId probe", "skipped (--skip-live-rpc)", "optional");
  }

  const code = printReport();
  process.exit(code);
}

main().catch((e) => {
  console.error(e.stack || e.message || e);
  process.exit(1);
});
