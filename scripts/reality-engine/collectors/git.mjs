/**
 * Git collector — HEAD, branch, dirty summary, recent commits.
 * Local filesystem only. Read-only.
 */
import { execSync } from "node:child_process";
import { ROOT, sha256Json, utcStamp } from "../lib/io.mjs";

function sh(cmd) {
  try {
    return {
      ok: true,
      out: execSync(cmd, {
        cwd: ROOT,
        encoding: "utf8",
        timeout: 15000,
        stdio: ["ignore", "pipe", "pipe"],
      }).trim(),
    };
  } catch (e) {
    return {
      ok: false,
      out: ((e.stdout || "") + (e.stderr || "") + (e.message || "")).trim().slice(0, 2000),
    };
  }
}

export async function collectGit(expected) {
  const timestamp = utcStamp();
  const limit = expected.git?.log_limit ?? 5;

  const base = {
    source: "git",
    collector: "git",
    timestamp,
    status: "PASS",
    head: null,
    branch: null,
    dirty: false,
    dirty_count: 0,
    dirty_sample: [],
    recent_commits: [],
    error: null,
  };

  const head = sh("git rev-parse HEAD");
  const branch = sh("git rev-parse --abbrev-ref HEAD");
  const porcelain = sh("git status --porcelain");
  const log = sh(`git log -n ${limit} --pretty=format:%H|%cI|%s`);

  if (!head.ok) {
    base.status = "UNAVAILABLE";
    base.error = head.out;
    base.payload_sha256 = sha256Json(base);
    return base;
  }

  base.head = head.out;
  base.branch = branch.ok ? branch.out : null;

  if (porcelain.ok) {
    const lines = porcelain.out ? porcelain.out.split("\n").filter(Boolean) : [];
    base.dirty_count = lines.length;
    base.dirty = lines.length > 0;
    base.dirty_sample = lines.slice(0, 20);
  }

  if (log.ok && log.out) {
    base.recent_commits = log.out.split("\n").map((line) => {
      const [hash, date, ...rest] = line.split("|");
      return { hash, date, subject: rest.join("|") };
    });
  }

  base.payload_sha256 = sha256Json({
    head: base.head,
    branch: base.branch,
    dirty_count: base.dirty_count,
    recent_commits: base.recent_commits.map((c) => c.hash),
  });
  return base;
}
