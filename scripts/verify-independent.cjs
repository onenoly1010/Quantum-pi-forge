#!/usr/bin/env node
/*
 * Substantive independent verifier (qpf-independent-verification-run-v2).
 *
 * Each check returns PASS, FAIL or UNKNOWN. A check that cannot be performed
 * is UNKNOWN, never PASS. Overall: FAIL if any FAIL; else UNKNOWN if any
 * UNKNOWN; else PASS. Exit codes: 0 PASS, 1 FAIL, 2 UNKNOWN, 3 verifier error.
 *
 * Offline by default. `--live` adds read-only JSON-RPC calls (eth_chainId,
 * eth_getCode) to QPF_RPC_URL (default https://evmrpc.0g.ai). Nothing is signed or sent.
 * `--build` (with --live) adds sid-build-bytecode-match: contracts/out artifacts from a
 * local `forge build` vs live code (see scripts/compare-build-bytecode.cjs). UNKNOWN without Foundry.
 *
 * It never writes deploy/independent-verification-v1.json (a historical receipt).
 * The only file it writes is the run record (default .qpf-runs/, which git ignores).
 */
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const os = require("os");
const { execFileSync } = require("child_process");

const RPC_EVIDENCE = "evidence/live-rpc-correspondence-v1.json";
const MANIFEST = "evidence/build-artifact-manifest-v1.json";
const SOURCE_ID = "deploy/source-identity-correspondence-v1.json";
const DEPLOYED = "deploy/deployed-addresses-verification.json";
const DERIVED_RPC = "deploy/live-rpc-correspondence-v1.json";
const EMPTY_CODE_SHA = crypto.createHash("sha256").update("0x").digest("hex");
const HEX64 = /^[0-9a-f]{64}$/;
const ADDR = /^0x[0-9a-fA-F]{40}$/;

const sha256 = (b) => crypto.createHash("sha256").update(b).digest("hex");

function check(input, id, description, fn) {
  try {
    const r = fn();
    return { input, id, description, result: r.result, observed: r.observed ?? null, detail: r.detail ?? null };
  } catch (e) {
    return { input, id, description, result: "UNKNOWN", observed: null, detail: `check could not run: ${e.message}` };
  }
}
const PASS = (observed, detail) => ({ result: "PASS", observed, detail });
const FAIL = (observed, detail) => ({ result: "FAIL", observed, detail });
const UNKNOWN = (observed, detail) => ({ result: "UNKNOWN", observed, detail });

function loadJson(root, rel) {
  const p = path.join(root, rel);
  if (!fs.existsSync(p)) return { missing: true };
  const raw = fs.readFileSync(p);
  try { return { json: JSON.parse(raw.toString("utf8")), sha256: sha256(raw) }; }
  catch (e) { return { malformed: e.message, sha256: sha256(raw) }; }
}

function gitAvailable(root) {
  try { execFileSync("git", ["-C", root, "rev-parse", "HEAD"], { stdio: "pipe" }); return true; } catch { return false; }
}

function offlineChecks(root) {
  const out = [];
  const rpc = loadJson(root, RPC_EVIDENCE);
  const man = loadJson(root, MANIFEST);
  const sid = loadJson(root, SOURCE_ID);
  const dep = loadJson(root, DEPLOYED);
  const der = loadJson(root, DERIVED_RPC);

  for (const [rel, f, schema] of [[RPC_EVIDENCE, rpc, "qpf-live-rpc-correspondence-evidence-v1"], [MANIFEST, man, "qpf-build-artifact-manifest-v1"], [SOURCE_ID, sid, "qpf-source-identity-correspondence-v1"]]) {
    out.push(check(rel, "parse-and-schema", "file exists, parses as JSON, schemaVersion is as expected", () => {
      if (f.missing) return FAIL("missing", "input file not found");
      if (f.malformed) return FAIL("malformed", f.malformed);
      return f.json.schemaVersion === schema ? PASS(f.json.schemaVersion) : FAIL(f.json.schemaVersion, `expected ${schema}`);
    }));
  }
  const R = rpc.json, M = man.json, S = sid.json, D = dep.json;

  // ---- live RPC evidence ----
  out.push(check(RPC_EVIDENCE, "rpc-chain-id", "recorded chainId equals expectedChainId and the deployed-addresses chain_id_hex", () => {
    if (!R) return UNKNOWN(null, "input unavailable");
    const declared = D?.phase_b_address_extraction?.chain_id_hex;
    const obs = { chainId: R.chainId, expectedChainId: R.expectedChainId, deployedAddressesChainIdHex: declared ?? null };
    if (R.chainId !== R.expectedChainId) return FAIL(obs, "chainId != expectedChainId");
    if (!declared) return UNKNOWN(obs, `${DEPLOYED} chain_id_hex unavailable`);
    return declared === R.chainId ? PASS(obs) : FAIL(obs, "chain differs from declared deployment chain");
  }));
  out.push(check(RPC_EVIDENCE, "rpc-entry-wellformed", "every entry has a valid address, positive integer codeByteLength, 64-hex codeSha256, and the top-level blockTag", () => {
    if (!R) return UNKNOWN(null, "input unavailable");
    const bad = (R.entries || []).filter((e) => !ADDR.test(e.address) || !Number.isInteger(e.codeByteLength) || e.codeByteLength <= 0 || !HEX64.test(e.codeSha256) || e.blockTag !== R.blockTag);
    const obs = { entries: (R.entries || []).length, malformed: bad.map((e) => e.address) };
    if (!obs.entries) return FAIL(obs, "no entries");
    return bad.length ? FAIL(obs) : PASS(obs);
  }));
  out.push(check(RPC_EVIDENCE, "rpc-addresses-match-declared", `entry addresses equal the contract list in ${DEPLOYED} (sourceReference)`, () => {
    if (!R) return UNKNOWN(null, "input unavailable");
    if (R.sourceReference !== DEPLOYED) return UNKNOWN({ sourceReference: R.sourceReference }, "unexpected sourceReference");
    const list = D?.phase_b_address_extraction?.contracts;
    if (!Array.isArray(list)) return UNKNOWN(null, `${DEPLOYED} contract list unavailable`);
    const a = new Set(R.entries.map((e) => e.address.toLowerCase()));
    const b = new Set(list.map((c) => String(c.address).toLowerCase()));
    const obs = { evidence: a.size, declared: b.size, onlyInEvidence: [...a].filter((x) => !b.has(x)), onlyDeclared: [...b].filter((x) => !a.has(x)) };
    return obs.onlyInEvidence.length || obs.onlyDeclared.length ? FAIL(obs) : PASS(obs);
  }));
  out.push(check(RPC_EVIDENCE, "rpc-derived-copy-consistent", `${DERIVED_RPC} repeats the same chainId, blockTag, byte lengths and code hashes`, () => {
    if (!R) return UNKNOWN(null, "input unavailable");
    if (!der.json) return UNKNOWN(null, `${DERIVED_RPC} unavailable`);
    const byAddr = new Map(der.json.entries.map((e) => [e.address.toLowerCase(), e]));
    const mismatches = [];
    if (der.json.chainId !== R.chainId) mismatches.push("chainId");
    if (der.json.blockTag !== R.blockTag) mismatches.push("blockTag");
    for (const e of R.entries) {
      const d = byAddr.get(e.address.toLowerCase());
      if (!d) { mismatches.push(`${e.address}:missing`); continue; }
      if (d.codeSha256 !== e.codeSha256) mismatches.push(`${e.address}:codeSha256`);
      if (d.codeByteLength !== e.codeByteLength) mismatches.push(`${e.address}:codeByteLength`);
    }
    return mismatches.length ? FAIL({ mismatches }) : PASS({ compared: R.entries.length });
  }));
  out.push(check(RPC_EVIDENCE, "rpc-live-code-match", "on-chain code at blockTag hashes to recorded values (needs --live)", () => UNKNOWN(null, "not run offline; pass --live for read-only eth_getCode")));

  // ---- build artifact manifest ----
  out.push(check(MANIFEST, "manifest-entry-wellformed", "each entry has a 64-hex hash, integer length, and the compilerConfiguration file exists", () => {
    if (!M) return UNKNOWN(null, "input unavailable");
    const bad = M.entries.filter((e) => !HEX64.test(e.normalizedRuntimeBytecodeSha256) || !Number.isInteger(e.runtimeBytecodeLength) || e.runtimeBytecodeLength < 0);
    const cfg = fs.existsSync(path.join(root, M.compilerConfiguration || ""));
    const obs = { entries: M.entries.length, malformed: bad.map((e) => e.artifactId), compilerConfigurationPresent: cfg };
    return bad.length || !cfg || !M.entries.length ? FAIL(obs) : PASS(obs);
  }));
  out.push(check(MANIFEST, "manifest-empty-bytecode-consistency", "entries with runtimeBytecodeLength 0 carry sha256(\"0x\"), and non-zero ones do not", () => {
    if (!M) return UNKNOWN(null, "input unavailable");
    const bad = M.entries.filter((e) => (e.runtimeBytecodeLength === 0) !== (e.normalizedRuntimeBytecodeSha256 === EMPTY_CODE_SHA));
    return bad.length ? FAIL({ inconsistent: bad.map((e) => e.artifactId) }) : PASS({ zeroLength: M.entries.filter((e) => e.runtimeBytecodeLength === 0).length, emptyHash: EMPTY_CODE_SHA });
  }));
  out.push(check(MANIFEST, "manifest-compiler-config-match", "compilerVersion and optimizer settings agree with contracts/foundry.toml (evmVersion not checked)", () => {
    if (!M) return UNKNOWN(null, "input unavailable");
    const p = path.join(root, M.compilerConfiguration || "");
    if (!fs.existsSync(p)) return FAIL(null, "compiler configuration missing");
    const toml = fs.readFileSync(p, "utf8");
    const solc = (toml.match(/^\s*solc_version\s*=\s*"([^"]+)"/m) || [])[1];
    const opt = (toml.match(/^\s*optimizer\s*=\s*(true|false)/m) || [])[1];
    const runs = Number((toml.match(/^\s*optimizer_runs\s*=\s*(\d+)/m) || [])[1]);
    const obs = { foundry: { solc, optimizer: opt, runs } };
    if (!solc || !opt || !runs) return UNKNOWN(obs, "could not parse foundry.toml");
    const bad = M.entries.filter((e) => !String(e.compilerVersion).startsWith(`${solc}+`) || e.optimizer?.enabled !== (opt === "true") || e.optimizer?.runs !== runs);
    obs.mismatched = bad.map((e) => e.artifactId);
    return bad.length ? FAIL(obs) : PASS(obs);
  }));
  out.push(check(MANIFEST, "manifest-sources-present", "each sourcePath exists under contracts/ (paths in uninitialised git submodules are UNKNOWN)", () => {
    if (!M) return UNKNOWN(null, "input unavailable");
    const missing = [], unknown = [];
    for (const src of new Set(M.entries.map((e) => e.sourcePath))) {
      if (fs.existsSync(path.join(root, "contracts", src))) continue;
      const m = src.match(/^lib\/([^/]+)\//);
      const libDir = m && path.join(root, "contracts", "lib", m[1]);
      if (libDir && (!fs.existsSync(libDir) || fs.readdirSync(libDir).length === 0)) unknown.push(src); else missing.push(src);
    }
    const obs = { missing, inUninitialisedSubmodule: unknown.length };
    if (missing.length) return FAIL(obs);
    if (unknown.length) return UNKNOWN(obs, "run `git submodule update --init contracts/lib/forge-std contracts/lib/openzeppelin-contracts` to check these");
    return PASS(obs);
  }));
  out.push(check(MANIFEST, "manifest-artifact-hashes", "recorded bytecode hashes match the artifact files (needs `cd contracts && forge build`)", () => {
    if (!M) return UNKNOWN(null, "input unavailable");
    if (!fs.existsSync(path.join(root, "contracts", "out"))) return UNKNOWN({ artifactDirectoryPresent: false }, "contracts/out is not versioned; build it locally with forge to check");
    const missing = [], mismatched = [];
    for (const e of M.entries) {
      const p = path.join(root, e.artifactPath);
      if (!fs.existsSync(p)) { missing.push(e.artifactPath); continue; }
      const a = JSON.parse(fs.readFileSync(p, "utf8"));
      const code = String(a.deployedBytecode?.object ?? a.deployedBytecode ?? "").toLowerCase();
      if (sha256(code) !== e.normalizedRuntimeBytecodeSha256) mismatched.push(e.artifactId);
    }
    const obs = { checked: M.entries.length - missing.length, missing, mismatched };
    if (mismatched.length) return FAIL(obs);
    if (missing.length) return UNKNOWN(obs, "some artifacts not built");
    return PASS(obs);
  }));

  // ---- source identity ----
  out.push(check(SOURCE_ID, "sid-addresses-match-rpc", `entry addresses equal the addresses in ${RPC_EVIDENCE}`, () => {
    if (!S || !R) return UNKNOWN(null, "input unavailable");
    const a = new Set(S.entries.map((e) => e.address.toLowerCase()));
    const b = new Set(R.entries.map((e) => e.address.toLowerCase()));
    const ids = S.entries.filter((e) => e.id !== e.address.toLowerCase()).map((e) => e.id);
    const obs = { onlyInSourceIdentity: [...a].filter((x) => !b.has(x)), onlyInRpc: [...b].filter((x) => !a.has(x)), idAddressMismatch: ids };
    return obs.onlyInSourceIdentity.length || obs.onlyInRpc.length || ids.length ? FAIL(obs) : PASS(obs);
  }));
  out.push(check(SOURCE_ID, "sid-artifact-directory-claim", "artifactDirectoryPresent agrees with whether contracts/out is versioned (git ls-files; filesystem if no git)", () => {
    if (!S) return UNKNOWN(null, "input unavailable");
    const dir = S.artifactDirectory || "contracts/out";
    // The claim is about the versioned tree: a local `forge build` output is gitignored and does not count.
    let actual, basis;
    if (gitAvailable(root)) { actual = execFileSync("git", ["-C", root, "ls-files", "--", dir], { encoding: "utf8" }).trim().length > 0; basis = "git ls-files"; }
    else { actual = fs.existsSync(path.join(root, dir)); basis = "filesystem (no git)"; }
    const obs = { claimed: S.artifactDirectoryPresent, actual, basis };
    return S.artifactDirectoryPresent === actual ? PASS(obs) : FAIL(obs);
  }));
  out.push(check(SOURCE_ID, "sid-states-justified", "no MATCHED state without a real artifactReference; references exist; UNKNOWN-for-unverified entries agree with derived correspondence", () => {
    if (!S) return UNKNOWN(null, "input unavailable");
    const problems = [];
    const derived = new Map((der.json?.entries || []).map((e) => [e.address.toLowerCase(), e.correspondenceState]));
    for (const e of S.entries) {
      if (!["MATCHED", "PARTIAL", "UNKNOWN", "MISMATCHED"].includes(e.sourceIdentityState)) problems.push(`${e.address}:state ${e.sourceIdentityState}`);
      if (e.sourceIdentityState === "MATCHED" && (e.artifactReference === "UNKNOWN" || !fs.existsSync(path.join(root, e.artifactReference)))) problems.push(`${e.address}:MATCHED without artifact`);
      for (const ref of [e.deploymentReference, e.compilerReference]) if (!fs.existsSync(path.join(root, ref))) problems.push(`${e.address}:missing ${ref}`);
      const d = derived.get(e.address.toLowerCase());
      if (/not VERIFIED/.test(e.comparisonMethod || "") && d === "VERIFIED") problems.push(`${e.address}:says deployment not VERIFIED but ${DERIVED_RPC} says VERIFIED`);
    }
    const counts = S.entries.reduce((c, e) => ((c[e.sourceIdentityState] = (c[e.sourceIdentityState] || 0) + 1), c), {});
    return problems.length ? FAIL({ problems, counts }) : PASS({ counts });
  }));
  out.push(check(SOURCE_ID, "sid-source-matches-chain", "deployed bytecode is shown to come from repo source (claim is not made by the evidence)", () =>
    UNKNOWN({ matched: 0 }, "no entry is MATCHED; source identity of the deployed contracts is not established by the evidence")));

  return { checks: out, inputs: { [RPC_EVIDENCE]: rpc.sha256 ?? null, [MANIFEST]: man.sha256 ?? null, [SOURCE_ID]: sid.sha256 ?? null, [DEPLOYED]: dep.sha256 ?? null, [DERIVED_RPC]: der.sha256 ?? null } };
}

async function liveCheck(root, network) {
  const R = loadJson(root, RPC_EVIDENCE).json;
  const desc = "on-chain code at blockTag hashes to recorded values (read-only eth_getCode)";
  if (!R) return { input: RPC_EVIDENCE, id: "rpc-live-code-match", description: desc, result: "UNKNOWN", observed: null, detail: "input unavailable" };
  const url = process.env.QPF_RPC_URL || R.rpcUrl;
  const call = async (method, params) => {
    network.push({ url, method, params });
    const res = await fetch(url, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }), signal: AbortSignal.timeout(15000) });
    const body = await res.json();
    if (body.error) throw new Error(`${method}: ${JSON.stringify(body.error)}`);
    return body.result;
  };
  try {
    const chainId = await call("eth_chainId", []);
    if (chainId !== R.chainId) return { input: RPC_EVIDENCE, id: "rpc-live-code-match", description: desc, result: "FAIL", observed: { chainId }, detail: "live chainId differs" };
    const mismatched = [], results = [];
    for (const e of R.entries) {
      const code = String(await call("eth_getCode", [e.address, e.blockTag])).toLowerCase();
      const obs = { address: e.address, codeByteLength: (code.length - 2) / 2, codeSha256: sha256(code) };
      results.push(obs);
      if (obs.codeSha256 !== e.codeSha256 || obs.codeByteLength !== e.codeByteLength) mismatched.push(e.address);
    }
    return { input: RPC_EVIDENCE, id: "rpc-live-code-match", description: desc, result: mismatched.length ? "FAIL" : "PASS", observed: { rpcUrl: url, chainId, results, mismatched }, detail: null };
  } catch (err) {
    return { input: RPC_EVIDENCE, id: "rpc-live-code-match", description: desc, result: "UNKNOWN", observed: { rpcUrl: url }, detail: `RPC unavailable or historical state not served: ${err.message}` };
  }
}

const BUILD_EVIDENCE = "evidence/source-identity-build-comparison-v1.json";
function forgeVersion() {
  try { return execFileSync("forge", ["--version"], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim().split("\n")[0]; } catch { return null; }
}

// --build: compare locally built runtime bytecode (contracts/out, from `forge build`) with live code.
// UNKNOWN when Foundry is absent, the artifacts are absent, or live code cannot be read. FAIL on any MISMATCH.
async function buildCheck(root, { getCode, forge = forgeVersion } = {}) {
  const id = "sid-build-bytecode-match", input = BUILD_EVIDENCE;
  const description = "runtime bytecode built locally from repo source equals live code after masking metadata hashes and immutables";
  const r = (result, observed, detail = null) => ({ input, id, description, result, observed, detail });
  const B = loadJson(root, BUILD_EVIDENCE).json;
  if (!B) return r("UNKNOWN", null, "build-comparison evidence unavailable");
  const fv = forge();
  if (!fv) return r("UNKNOWN", null, "Foundry (forge) not found on PATH; run with Foundry installed after `forge build` in contracts/");
  const { compareRuntime } = require("./compare-build-bytecode.cjs");
  const targets = (B.entries || []).filter((e) => e.verifierChecked);
  if (!targets.length) return r("UNKNOWN", { forge: fv }, "no entries marked verifierChecked");
  const results = [], unknown = [], mismatched = [];
  for (const e of targets) {
    const ap = path.join(root, e.artifact);
    if (!fs.existsSync(ap)) { unknown.push(e.address); results.push({ address: e.address, result: "UNKNOWN", detail: `missing ${e.artifact}; run forge build` }); continue; }
    const art = JSON.parse(fs.readFileSync(ap, "utf8"));
    let live;
    try { live = await getCode(e.address, e.blockTag); } catch (err) { unknown.push(e.address); results.push({ address: e.address, result: "UNKNOWN", detail: `live code unavailable: ${err.message}` }); continue; }
    const c = compareRuntime(art.deployedBytecode?.object || "", live, art.deployedBytecode?.immutableReferences);
    const res = { address: e.address, artifact: e.artifact, ...c };
    if (c.result === "MATCH" && e.expectedMaskedSha256 && c.builtMaskedSha256 !== e.expectedMaskedSha256) { res.result = "MISMATCH"; res.detail = "masked hash differs from evidence"; }
    if (res.result === "MISMATCH") mismatched.push(e.address); else if (res.result !== "MATCH") unknown.push(e.address);
    results.push(res);
  }
  const obs = { forge: fv, results, mismatched, unknown };
  return mismatched.length ? r("FAIL", obs) : unknown.length ? r("UNKNOWN", obs, "some targets could not be compared") : r("PASS", obs);
}

function overall(checks) {
  if (checks.some((c) => c.result === "FAIL")) return "FAIL";
  if (checks.some((c) => c.result === "UNKNOWN")) return "UNKNOWN";
  return "PASS";
}

function rpcGetCode(root, network) {
  const R = loadJson(root, RPC_EVIDENCE).json || {};
  const url = process.env.QPF_RPC_URL || R.rpcUrl;
  return async (address, blockTag) => {
    network.push({ url, method: "eth_getCode", params: [address, blockTag] });
    const res = await fetch(url, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "eth_getCode", params: [address, blockTag] }), signal: AbortSignal.timeout(15000) });
    const body = await res.json();
    if (body.error || typeof body.result !== "string") throw new Error(JSON.stringify(body.error || "no result"));
    return body.result;
  };
}

async function verify(root, { live = false, build = false, getCode, forge } = {}) {
  const network = [];
  const { checks, inputs } = offlineChecks(root);
  if (live) {
    const i = checks.findIndex((c) => c.id === "rpc-live-code-match");
    checks[i] = await liveCheck(root, network);
  }
  if (build) {
    const gc = getCode || (live ? rpcGetCode(root, network) : async () => { throw new Error("needs --live for read-only eth_getCode"); });
    checks.push(await buildCheck(root, { getCode: gc, forge }));
  }
  return { checks, inputs, network, overall: overall(checks) };
}

function arg(name) { const i = process.argv.indexOf(name); return i >= 0 ? process.argv[i + 1] : null; }

async function main() {
  const startedAt = new Date().toISOString();
  const root = path.resolve(arg("--root") || process.cwd());
  const live = process.argv.includes("--live");
  const build = process.argv.includes("--build");
  let commit = null;
  if (gitAvailable(root)) commit = execFileSync("git", ["-C", root, "rev-parse", "HEAD"], { encoding: "utf8" }).trim();
  const dirty = commit ? execFileSync("git", ["-C", root, "status", "--porcelain"], { encoding: "utf8" }).trim().length > 0 : null;
  const res = await verify(root, { live, build });
  const finishedAt = new Date().toISOString();
  const outRel = arg("--out") || path.join(".qpf-runs", `independent-verification-run-${startedAt.replace(/[:.]/g, "-")}.json`);
  const outPath = path.resolve(root, outRel);
  const exitCode = { PASS: 0, FAIL: 1, UNKNOWN: 2 }[res.overall];
  const record = {
    schemaVersion: "qpf-independent-verification-run-v2",
    note: "Observed run record. Supersedes nothing; deploy/independent-verification-v1.json is historical and is not rewritten.",
    startedAtUtc: startedAt, finishedAtUtc: finishedAt,
    commit, workingTreeDirty: dirty,
    environment: { node: process.version, platform: `${os.type()} ${os.release()} ${os.arch()}` },
    command: ["node", path.relative(process.cwd(), __filename), ...process.argv.slice(2)].join(" "),
    mode: (live ? "offline+live-readonly-rpc" : "offline") + (build ? "+build-bytecode" : ""),
    inputsSha256: res.inputs,
    checks: res.checks,
    counts: res.checks.reduce((c, x) => ((c[x.result] = (c[x.result] || 0) + 1), c), {}),
    overall: res.overall,
    exitCode,
    networkCalls: res.network,
    localFileWrites: [path.relative(root, outPath)],
    limitations: [
      "Operator identity is whatever the runner reports; this record does not prove who ran it.",
      "Offline checks show that the evidence files agree with each other and with the repo; they do not show that the chain observations were true.",
      "Source identity (deployed bytecode built from this repo's source) is not established by the current evidence.",
      "Digests show integrity, not identity or time.",
      "Grants no authority (externalVerifierAuthority: false)."
    ]
  };
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, `${JSON.stringify(record, null, 2)}\n`);
  for (const c of res.checks) console.log(`${c.result.padEnd(7)} ${c.input} :: ${c.id}${c.detail ? ` — ${c.detail}` : ""}`);
  console.log(`OVERALL ${res.overall} (${JSON.stringify(record.counts)}) commit=${commit} node=${process.version}`);
  console.log(`WROTE ${path.relative(root, outPath)} sha256=${sha256(fs.readFileSync(outPath))}`);
  process.exitCode = exitCode;
}

module.exports = { verify, overall, buildCheck, EMPTY_CODE_SHA };
if (require.main === module) main().catch((e) => { console.error(`ERROR verifier: ${e.stack || e.message}`); process.exitCode = 3; });
