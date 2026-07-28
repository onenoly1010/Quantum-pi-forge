import { createHash } from "node:crypto";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
  readdirSync,
  unlinkSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
export const ROOT = join(__dirname, "../../..");
export const REALITY_ROOT = join(ROOT, "docs/activation/reality");
export const EXPECTED_PATH = join(REALITY_ROOT, "expected/expected-config-v1.json");
export const STATE_DIR = join(REALITY_ROOT, "state");
export const HISTORY_DIR = join(REALITY_ROOT, "history");
export const DIFF_DIR = join(REALITY_ROOT, "diffs");
export const BRIEF_DIR = join(REALITY_ROOT, "briefs");
export const ALERT_DIR = join(REALITY_ROOT, "alerts");
export const LATEST_STATE = join(STATE_DIR, "latest.json");
export const PREV_STATE = join(STATE_DIR, "previous.json");
export const LATEST_DIFF = join(DIFF_DIR, "latest.json");
export const LATEST_BRIEF = join(BRIEF_DIR, "LATEST.md");

export function ensureDirs() {
  for (const d of [STATE_DIR, HISTORY_DIR, DIFF_DIR, BRIEF_DIR, ALERT_DIR]) {
    mkdirSync(d, { recursive: true });
  }
}

export function readJson(path, fallback = null) {
  if (!existsSync(path)) return fallback;
  return JSON.parse(readFileSync(path, "utf8"));
}

export function writeJson(path, obj) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, JSON.stringify(obj, null, 2) + "\n");
}

export function writeText(path, text) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, text.endsWith("\n") ? text : text + "\n");
}

export function sha256Json(obj) {
  return createHash("sha256").update(JSON.stringify(obj)).digest("hex");
}

export function utcStamp() {
  return new Date().toISOString().replace(/\.\d{3}Z$/, "Z");
}

export function fileStamp(iso = utcStamp()) {
  return iso.replace(/[:.]/g, "");
}

export function loadExpected() {
  const cfg = readJson(EXPECTED_PATH);
  if (!cfg) {
    throw new Error(`Missing expected config: ${EXPECTED_PATH}`);
  }
  const envRpc = process.env.RPC_URL?.trim();
  if (envRpc) {
    cfg.chain = { ...cfg.chain, rpc_url: envRpc, rpc_url_source: "env:RPC_URL" };
  } else {
    cfg.chain = { ...cfg.chain, rpc_url_source: "expected-config" };
  }
  const envSafe = process.env.GUARDIAN_SAFE_ADDRESS?.trim();
  if (envSafe && /^0x[a-fA-F0-9]{40}$/.test(envSafe)) {
    cfg.safe = {
      ...cfg.safe,
      address: envSafe,
      status: "CONFIGURED_VIA_ENV",
      address_source: "env:GUARDIAN_SAFE_ADDRESS",
    };
  }
  return cfg;
}

/** Keep last N history files to avoid unbounded growth */
export function pruneHistory(keep = 48) {
  if (!existsSync(HISTORY_DIR)) return;
  const files = readdirSync(HISTORY_DIR)
    .filter((f) => f.endsWith(".json"))
    .sort()
    .reverse();
  for (const f of files.slice(keep)) {
    try {
      unlinkSync(join(HISTORY_DIR, f));
    } catch {
      /* ignore */
    }
  }
}
