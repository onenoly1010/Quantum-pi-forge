/**
 * Briefing contract adapter.
 * Reuses reports from local-verify-report.sh + project-state.cjs.
 * Live git is authoritative. Does not invent a parallel SoR.
 *
 * prepared ≠ verified ≠ approved ≠ executed
 */
import { execFileSync, execSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(fileURLToPath(new URL(".", import.meta.url)), "../..");
export const VERIFY_REL = "reports/local-verify-report.json";
export const STATE_REL = "reports/project-state.json";
export const CONTRACT_FRESH = "CONTRACT_FRESH";
export const CONTRACT_STALE = "CONTRACT_STALE";
export const CONTRACT_UNAVAILABLE = "CONTRACT_UNAVAILABLE";

const DEFAULT_MAX_AGE_S = Number(process.env.QPF_BRIEF_CONTRACT_MAX_AGE_S || 1800);
const GENERATE_TIMEOUT_MS = Number(process.env.QPF_BRIEF_GENERATE_TIMEOUT_MS || 90000);

function parseTs(raw) {
  if (!raw || typeof raw !== "string") return null;
  const t = Date.parse(raw);
  return Number.isFinite(t) ? t : null;
}

export function liveGit(root = ROOT) {
  const facts = {
    repository_ok: existsSync(join(root, ".git")),
    branch: "?",
    commit: "?",
    commit_short: "?",
    ahead: null,
    behind: null,
    dirty_count: 0,
    clean: true,
    dirty_paths: [],
  };
  if (!facts.repository_ok) return facts;
  const git = (args) =>
    execFileSync("git", ["-C", root, ...args], {
      encoding: "utf8",
      timeout: 8000,
      stdio: ["ignore", "pipe", "pipe"],
    }).trim();
  try {
    facts.branch = git(["rev-parse", "--abbrev-ref", "HEAD"]) || "?";
    facts.commit = git(["rev-parse", "HEAD"]) || "?";
    facts.commit_short = git(["rev-parse", "--short", "HEAD"]) || "?";
    const porcelain = git(["status", "--porcelain"]);
    const paths = porcelain
      ? porcelain.split("\n").filter(Boolean).map((line) => {
          let p = line.slice(3).trim();
          if (p.includes(" -> ")) p = p.split(" -> ").pop();
          return p;
        })
      : [];
    facts.dirty_paths = paths;
    facts.dirty_count = paths.length;
    facts.clean = paths.length === 0;
    try {
      const lr = git(["rev-list", "--left-right", "--count", "origin/main...HEAD"]);
      const [behind, ahead] = lr.split(/\s+/);
      facts.behind = Number(behind);
      facts.ahead = Number(ahead);
    } catch {
      /* origin/main may be missing */
    }
  } catch {
    facts.repository_ok = false;
  }
  return facts;
}

function loadJson(path) {
  if (!existsSync(path)) return null;
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch {
    return null;
  }
}

function reportTimestamp(verify, state) {
  const times = [];
  const a = parseTs(verify?.timestamp);
  const b = parseTs(state?.generated_at);
  const c = parseTs(state?.verification?.report_timestamp);
  for (const t of [a, b, c]) if (t != null) times.push(t);
  return times.length ? Math.max(...times) : null;
}

export function defaultGenerator(root = ROOT) {
  const env = { ...process.env, NO_WALLET_TOUCH: "1" };
  delete env.OG_COMPUTE_LIVE;
  const script = join(root, "scripts/ai-cockpit.sh");
  try {
    const out = execFileSync("bash", [script, "--quick"], {
      cwd: root,
      env,
      encoding: "utf8",
      timeout: GENERATE_TIMEOUT_MS,
      stdio: ["ignore", "pipe", "pipe"],
    });
    return { exit: 0, note: String(out).slice(-2000) };
  } catch (e) {
    const status = typeof e.status === "number" ? e.status : 1;
    const note = String((e.stdout || "") + (e.stderr || "") + (e.message || "")).slice(-2000);
    // cockpit exit 2 = degraded agent plane; reports may still exist
    return { exit: status, note };
  }
}

export function ensureContract({
  root = ROOT,
  refresh = false,
  maxAgeS = DEFAULT_MAX_AGE_S,
  generator = defaultGenerator,
} = {}) {
  let generateExit = null;
  let generateNote = "";
  if (refresh) {
    const g = generator(root);
    generateExit = g.exit;
    generateNote = g.note || "";
  }
  const verify = loadJson(join(root, VERIFY_REL));
  const state = loadJson(join(root, STATE_REL));
  const live = liveGit(root);
  const now = Date.now();
  const ts = reportTimestamp(verify, state);
  const ageS = ts == null ? null : Math.max(0, (now - ts) / 1000);

  let status;
  if (!verify && !state) status = CONTRACT_UNAVAILABLE;
  else if (ageS == null || ageS > maxAgeS) status = CONTRACT_STALE;
  else status = CONTRACT_FRESH;

  if (refresh && generateExit != null && generateExit !== 0 && generateExit !== 2 && !verify && !state) {
    status = CONTRACT_UNAVAILABLE;
  }

  return {
    schema: "qpf.ops.briefing_contract.v1",
    state: status,
    authority:
      "git_repository_canonical; reports are point-in-time; chat is not authority; prepared≠verified≠approved≠executed",
    at: new Date(now).toISOString(),
    max_age_s: maxAgeS,
    contract_timestamp: ts ? new Date(ts).toISOString() : null,
    contract_age_s: ageS,
    verify_report_age_s: verify ? (now - (parseTs(verify.timestamp) || now)) / 1000 : null,
    project_state_age_s: state ? (now - (parseTs(state.generated_at) || now)) / 1000 : null,
    verify_present: Boolean(verify),
    project_state_present: Boolean(state),
    generate_exit: generateExit,
    generate_note: generateNote.slice(0, 500),
    live_git: live,
    verify_report: verify,
    project_state: state,
    safety: {
      read_only: true,
      signed: false,
      broadcast: false,
      wallet: false,
      economic: "NOT AUTHORIZED",
    },
  };
}

export function postureFromRepo(root = ROOT) {
  const expected = loadJson(
    join(root, "docs/activation/reality/expected/expected-config-v1.json"),
  );
  const chainId = expected?.chain?.chain_id ?? 16661;
  return {
    network: "0G Aristotle Mainnet",
    chain_id: chainId,
    identity_sor: "Docs DEPLOYMENT_SET",
    designation: "qpf.designation.docs.deployment_set.16661.v1",
    economic: "NOT AUTHORIZED",
    compute_spend: "NOT AUTHORIZED (no live Router/Direct from this layer)",
    wallet: "blocked",
    source: "docs/activation/reality/expected/expected-config-v1.json + docs/ai policy",
  };
}

export function authFromState(state) {
  const exec = state?.execution || {};
  return {
    source: "reports/project-state.json execution + phase",
    public_activation: exec.public_activation || "unknown",
    posture: exec.posture || "unknown",
    phase_status: state?.phase?.status || "unknown",
    phase: state?.phase?.number ?? null,
    awaiting_invented: false,
  };
}
