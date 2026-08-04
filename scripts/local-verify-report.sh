#!/usr/bin/env bash
# local-verify-report.sh — Deterministic local verification contract
#
# Produces a shared factual baseline that every assistant must read
# instead of trusting conversation history.
#
# Authority note:
#   Git itself (status/log/diff/refs/tracked files) is CANONICAL truth.
#   This report is a POINT-IN-TIME SNAPSHOT for multi-agent coordination.
#   After the repo changes, re-run this script; do not treat a stale report
#   as current state.
#
# Contract outputs (always overwritten):
#   reports/local-verify-report.md
#   reports/local-verify-report.json
#
# Stamped copies:
#   reports/archive/local-verify-report-<UTC>.{md,json}
#
# Never: git commit, git push, wallet, signing, broadcast, deploy.
#
# Usage:
#   ./scripts/local-verify-report.sh
#   ./scripts/local-verify-report.sh --quick
#
# Exit codes:
#   0  selected checks passed; agent plane healthy
#   1  verification/build/repo failure
#   2  verification OK; agent plane degraded (e.g. Copilot)

set -u

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

QUICK=0
while [[ $# -gt 0 ]]; do
  case "$1" in
    --quick|-q) QUICK=1; shift ;;
    --help|-h)
      sed -n '2,28p' "$0" | sed 's/^# \?//'
      exit 0
      ;;
    *)
      echo "ERROR: unknown arg: $1" >&2
      exit 1
      ;;
  esac
done

TS_UTC="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
TS_FILE="$(date -u +%Y%m%dT%H%M%SZ)"
HOST="$(hostname 2>/dev/null || echo unknown)"
MODE="$([[ "$QUICK" -eq 1 ]] && echo quick || echo full)"

REPORTS_DIR="$ROOT_DIR/reports"
ARCHIVE_DIR="$REPORTS_DIR/archive"
mkdir -p "$REPORTS_DIR" "$ARCHIVE_DIR"

MD_PATH="$REPORTS_DIR/local-verify-report.md"
JSON_PATH="$REPORTS_DIR/local-verify-report.json"
MD_STAMP="$ARCHIVE_DIR/local-verify-report-${TS_FILE}.md"
JSON_STAMP="$ARCHIVE_DIR/local-verify-report-${TS_FILE}.json"

LOG_DIR="$(mktemp -d /tmp/qpf-local-verify.XXXXXX)"
LISTS_DIR="$LOG_DIR/lists"
mkdir -p "$LISTS_DIR"

# --- state ---
BRANCH="?"
HEAD_SHORT="?"
HEAD_FULL="?"
ORIGIN_MAIN="n/a"
AHEAD=0
BEHIND=0
WORKTREE_CLEAN=false
REPO_OK=false
EVIDENCE="skipped"
BUILD="skipped"
TESTS="n/a"
LINT="n/a"
AGENT_HEALTH="skipped"
AGENT_EXIT=0
PR_COUNT="n/a"
PR_SAMPLE=""
OVERALL_EXIT=0
FAILURES_FILE="$LISTS_DIR/failures.txt"
: >"$FAILURES_FILE"
: >"$LISTS_DIR/modified.txt"
: >"$LISTS_DIR/untracked.txt"
: >"$LISTS_DIR/deleted.txt"
: >"$LISTS_DIR/ops_candidates.txt"
: >"$LISTS_DIR/noise.txt"
: >"$LISTS_DIR/recommendations.txt"

pass() { echo "PASS: $*"; }
fail() { echo "FAIL: $*"; echo "$*" >>"$FAILURES_FILE"; OVERALL_EXIT=1; }
note() { echo "NOTE: $*"; }
rec()  { echo "$*" >>"$LISTS_DIR/recommendations.txt"; }

# --- git facts ---
if [[ -d .git ]]; then
  REPO_OK=true
  BRANCH="$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo '?')"
  HEAD_FULL="$(git rev-parse HEAD 2>/dev/null || echo '?')"
  HEAD_SHORT="$(git rev-parse --short HEAD 2>/dev/null || echo '?')"
  if git rev-parse origin/main >/dev/null 2>&1; then
    ORIGIN_MAIN="$(git rev-parse --short origin/main 2>/dev/null || echo n/a)"
    # left = commits on origin not in HEAD (behind), right = commits on HEAD not in origin (ahead)
    read -r BEHIND AHEAD <<<"$(git rev-list --left-right --count origin/main...HEAD 2>/dev/null || echo '0 0')"
  fi
  porcelain="$(git status --porcelain 2>/dev/null || true)"
  if [[ -z "$porcelain" ]]; then
    WORKTREE_CLEAN=true
  else
    WORKTREE_CLEAN=false
    while IFS= read -r line; do
      [[ -z "$line" ]] && continue
      code="${line:0:2}"
      path="${line:3}"
      # untracked
      if [[ "$code" == "??" ]]; then
        echo "$path" >>"$LISTS_DIR/untracked.txt"
      elif [[ "$code" == *D* || "$code" == " D" ]]; then
        echo "$path" >>"$LISTS_DIR/deleted.txt"
        echo "$path" >>"$LISTS_DIR/modified.txt"
      else
        echo "$path" >>"$LISTS_DIR/modified.txt"
      fi
      case "$path" in
        scripts/agent-health.sh|scripts/local-verify-report.sh|docs/ops/*|receipts/ops/*)
          echo "$path" >>"$LISTS_DIR/ops_candidates.txt"
          ;;
        docs/activation/living-forge/*|docs/activation/reality/*)
          echo "$path" >>"$LISTS_DIR/noise.txt"
          ;;
        reports/local-verify-report.md|reports/local-verify-report.json|reports/archive/*)
          echo "$path" >>"$LISTS_DIR/noise.txt"
          ;;
      esac
    done <<<"$porcelain"
  fi
  pass "git repository readable"
else
  fail "not a git repository"
fi

git status --porcelain >"$LOG_DIR/git-status.txt" 2>&1 || true
git log --oneline --decorate -10 >"$LOG_DIR/git-log.txt" 2>&1 || true
git diff --stat >"$LOG_DIR/git-diff-stat.txt" 2>&1 || true
git diff --cached --stat >"$LOG_DIR/git-diff-cached-stat.txt" 2>&1 || true

# --- agent health ---
if [[ -x "$ROOT_DIR/scripts/agent-health.sh" ]]; then
  "$ROOT_DIR/scripts/agent-health.sh" >"$LOG_DIR/agent-health.txt" 2>&1
  AGENT_EXIT=$?
  case "$AGENT_EXIT" in
    0) AGENT_HEALTH="healthy"; pass "agent-health exit 0" ;;
    2) AGENT_HEALTH="degraded"; note "agent-health exit 2 (degraded — often Copilot)" ;;
    *) AGENT_HEALTH="fail"; fail "agent-health exit $AGENT_EXIT" ;;
  esac
else
  AGENT_HEALTH="missing"
  note "scripts/agent-health.sh missing"
fi

# --- evidence + build ---
if [[ "$QUICK" -eq 0 ]]; then
  npm run verify:evidence >"$LOG_DIR/verify-evidence.txt" 2>&1
  ev=$?
  if [[ $ev -eq 0 ]]; then
    EVIDENCE="PASS"
    pass "npm run verify:evidence"
  else
    EVIDENCE="FAIL"
    fail "npm run verify:evidence (exit $ev)"
  fi

  npm run build >"$LOG_DIR/build.txt" 2>&1
  bd=$?
  if [[ $bd -eq 0 ]]; then
    BUILD="PASS"
    pass "npm run build"
  else
    BUILD="FAIL"
    fail "npm run build (exit $bd)"
  fi
else
  note "quick mode: skipped evidence and build"
fi

# --- optional tests / lint (report n/a if no script) ---
if node -e "const p=require('./package.json'); process.exit(p.scripts&&p.scripts.test?0:1)" 2>/dev/null; then
  npm test >"$LOG_DIR/test.txt" 2>&1
  if [[ $? -eq 0 ]]; then TESTS="PASS"; else TESTS="FAIL"; fail "npm test"; fi
else
  TESTS="n/a"
fi
if node -e "const p=require('./package.json'); process.exit(p.scripts&&p.scripts.lint?0:1)" 2>/dev/null; then
  npm run lint >"$LOG_DIR/lint.txt" 2>&1
  if [[ $? -eq 0 ]]; then LINT="PASS"; else LINT="FAIL"; fail "npm run lint"; fi
else
  LINT="n/a"
fi

# --- PRs ---
if command -v gh >/dev/null 2>&1 && gh auth status >/dev/null 2>&1; then
  PR_COUNT="$(gh pr list --limit 50 --json number --jq 'length' 2>/dev/null || echo '?')"
  PR_SAMPLE="$(gh pr list --limit 10 --json number,title --jq '[.[] | "#\(.number) \(.title)"] | join(" | ")' 2>/dev/null || true)"
fi

# --- recommendations (interpretation; not facts) ---
if [[ "$EVIDENCE" == "FAIL" || "$BUILD" == "FAIL" ]]; then
  rec "Needs cleanup: evidence or build failed — do not commit or push until fixed."
elif [[ "$WORKTREE_CLEAN" == "true" ]]; then
  rec "Working tree clean; no local commit pending from dirty files."
else
  if [[ -s "$LISTS_DIR/ops_candidates.txt" ]]; then
    rec "Ops cockpit files untracked/modified — isolated ops-only commit is a candidate (human GO required)."
  fi
  if [[ -s "$LISTS_DIR/noise.txt" ]]; then
    rec "Review generated/runtime files (living-forge/reality/reports) — exclude from ops commits."
  fi
  if [[ ! -s "$LISTS_DIR/ops_candidates.txt" && -s "$LISTS_DIR/modified.txt" ]]; then
    rec "Dirty worktree is not classified as ops cockpit — review before any commit."
  fi
fi

if [[ "$AHEAD" -gt 0 ]]; then
  rec "Local branch is ahead of origin/main by $AHEAD — push is optional and requires separate human GO."
fi
if [[ "$BEHIND" -gt 0 ]]; then
  rec "Local branch is behind origin/main by $BEHIND — pull/rebase before push."
fi
if [[ "$AGENT_HEALTH" == "degraded" ]]; then
  rec "Agent plane degraded (often Copilot) — continue with Grok/local tools; not a repository failure."
fi
if [[ "$EVIDENCE" == "PASS" && "$BUILD" == "PASS" && "$OVERALL_EXIT" -eq 0 ]]; then
  if [[ "$WORKTREE_CLEAN" == "true" && "$AHEAD" -eq 0 ]]; then
    rec "No outstanding local mutations; hold or start new prepare work."
  elif [[ -s "$LISTS_DIR/ops_candidates.txt" ]]; then
    rec "Safe to consider ops-only commit after human review of staged set (not auto-approved)."
  fi
fi
if [[ ! -s "$LISTS_DIR/recommendations.txt" ]]; then
  rec "No automated recommendation beyond re-running this report after changes."
fi

# --- final exit ---
FINAL_EXIT=$OVERALL_EXIT
if [[ $OVERALL_EXIT -eq 0 && "$AGENT_HEALTH" == "degraded" ]]; then
  FINAL_EXIT=2
fi

# --- write MD + JSON via python (single source for lists) ---
export LV_ROOT="$ROOT_DIR"
export LV_TS_UTC="$TS_UTC"
export LV_HOST="$HOST"
export LV_MODE="$MODE"
export LV_BRANCH="$BRANCH"
export LV_HEAD_SHORT="$HEAD_SHORT"
export LV_HEAD_FULL="$HEAD_FULL"
export LV_ORIGIN_MAIN="$ORIGIN_MAIN"
export LV_AHEAD="$AHEAD"
export LV_BEHIND="$BEHIND"
export LV_WORKTREE_CLEAN="$WORKTREE_CLEAN"
export LV_REPO_OK="$REPO_OK"
export LV_EVIDENCE="$EVIDENCE"
export LV_BUILD="$BUILD"
export LV_TESTS="$TESTS"
export LV_LINT="$LINT"
export LV_AGENT_HEALTH="$AGENT_HEALTH"
export LV_AGENT_EXIT="$AGENT_EXIT"
export LV_PR_COUNT="$PR_COUNT"
export LV_PR_SAMPLE="$PR_SAMPLE"
export LV_FINAL_EXIT="$FINAL_EXIT"
export LV_MD_PATH="$MD_PATH"
export LV_JSON_PATH="$JSON_PATH"
export LV_MD_STAMP="$MD_STAMP"
export LV_JSON_STAMP="$JSON_STAMP"
export LV_LOG_DIR="$LOG_DIR"
export LV_LISTS_DIR="$LISTS_DIR"
export LV_QUICK="$QUICK"

python3 <<'PY'
import json, os, pathlib

def read_lines(path):
    p = pathlib.Path(path)
    if not p.exists():
        return []
    return [ln.strip() for ln in p.read_text(errors="replace").splitlines() if ln.strip()]

def read_tail(path, n=30):
    p = pathlib.Path(path)
    if not p.exists():
        return "(missing)"
    lines = p.read_text(errors="replace").splitlines()
    return "\n".join(lines[-n:]) if lines else "(empty)"

lists = os.environ["LV_LISTS_DIR"]
log = os.environ["LV_LOG_DIR"]
modified = read_lines(f"{lists}/modified.txt")
untracked = read_lines(f"{lists}/untracked.txt")
deleted = read_lines(f"{lists}/deleted.txt")
ops = read_lines(f"{lists}/ops_candidates.txt")
noise = read_lines(f"{lists}/noise.txt")
failures = read_lines(f"{lists}/failures.txt")
recs = read_lines(f"{lists}/recommendations.txt")

clean = os.environ["LV_WORKTREE_CLEAN"] == "true"
repo_ok = os.environ["LV_REPO_OK"] == "true"
ahead = int(os.environ.get("LV_AHEAD") or 0)
behind = int(os.environ.get("LV_BEHIND") or 0)
final_exit = int(os.environ.get("LV_FINAL_EXIT") or 0)

payload = {
    "schema": "qpf.ops.local_verify_report.v1",
    "contract": "reports/local-verify-report.{md,json}",
    "timestamp": os.environ["LV_TS_UTC"],
    "host": os.environ["LV_HOST"],
    "mode": os.environ["LV_MODE"],
    "tool": "scripts/local-verify-report.sh",
    "exit_code": final_exit,
    "authority": "git_repository_canonical_report_is_point_in_time_snapshot",
    "facts": {
        "git": {
            "repository_ok": repo_ok,
            "branch": os.environ["LV_BRANCH"],
            "commit": os.environ["LV_HEAD_FULL"],
            "commit_short": os.environ["LV_HEAD_SHORT"],
            "origin_main": os.environ["LV_ORIGIN_MAIN"],
            "ahead": ahead,
            "behind": behind,
            "clean": clean,
        },
        "working_tree": {
            "modified": modified,
            "untracked": untracked,
            "deleted": deleted,
            "ops_candidates": ops,
            "runtime_noise": noise,
        },
        "verification": {
            "build": os.environ["LV_BUILD"],
            "tests": os.environ["LV_TESTS"],
            "lint": os.environ["LV_LINT"],
            "evidence": os.environ["LV_EVIDENCE"],
        },
        "agents": {
            "health": os.environ["LV_AGENT_HEALTH"],
            "health_exit": int(os.environ.get("LV_AGENT_EXIT") or 0),
        },
        "github": {
            "open_pr_count": os.environ["LV_PR_COUNT"],
            "open_pr_sample": os.environ.get("LV_PR_SAMPLE") or "",
        },
        "failures": failures,
    },
    "recommendations": recs,
    "paths": {
        "markdown": "reports/local-verify-report.md",
        "json": "reports/local-verify-report.json",
        "logs": os.environ["LV_LOG_DIR"],
    },
}

md_path = pathlib.Path(os.environ["LV_MD_PATH"])
json_path = pathlib.Path(os.environ["LV_JSON_PATH"])
md_stamp = pathlib.Path(os.environ["LV_MD_STAMP"])
json_stamp = pathlib.Path(os.environ["LV_JSON_STAMP"])

def bullets(items, empty="(none)"):
    if not items:
        return empty
    return "\n".join(f"- `{i}`" if not i.startswith("(") else f"- {i}" for i in items)

def plain_bullets(items, empty="(none)"):
    if not items:
        return empty
    return "\n".join(f"- {i}" for i in items)

md = f"""# Local Verify Report (contract)

**Timestamp:** {payload['timestamp']}  
**Host:** {payload['host']}  
**Mode:** {payload['mode']}  
**Tool:** `{payload['tool']}`  
**Exit code:** `{final_exit}`  

> **Contract:** Assistants should start from this snapshot (and the JSON twin) rather than conversation history.  
> **Canonical truth:** the Git repository itself (`git status`, `git log`, `git diff`, refs, tracked files).  
> **This file:** point-in-time report only — re-run after any mutation; AI systems are not authoritative.

---

## Facts

These fields are measured by scripts on this machine. They are not opinions.

### Git

| Field | Value |
| --- | --- |
| Repository OK | `{repo_ok}` |
| Branch | `{payload['facts']['git']['branch']}` |
| Commit (short) | `{payload['facts']['git']['commit_short']}` |
| Commit (full) | `{payload['facts']['git']['commit']}` |
| origin/main | `{payload['facts']['git']['origin_main']}` |
| Ahead of origin | `{ahead}` |
| Behind origin | `{behind}` |
| Working tree clean | `{clean}` |

### Working tree

**Modified / deleted (tracked):**

{bullets(modified)}

**Untracked:**

{bullets(untracked)}

**Classified ops candidates:**

{bullets(ops)}

**Classified runtime/generated noise:**

{bullets(noise)}

### Verification

| Check | Result |
| --- | --- |
| Build | **{payload['facts']['verification']['build']}** |
| Tests | **{payload['facts']['verification']['tests']}** |
| Lint | **{payload['facts']['verification']['lint']}** |
| Evidence | **{payload['facts']['verification']['evidence']}** |

### Agents / network (infra facts)

| Field | Value |
| --- | --- |
| Agent health | **{payload['facts']['agents']['health']}** (exit {payload['facts']['agents']['health_exit']}) |
| Open PRs (gh) | {payload['facts']['github']['open_pr_count']} |

### Failures (facts)

{plain_bullets(failures)}

### Git log (last 10)

```
{read_tail(f"{log}/git-log.txt", 15)}
```

### Git status (porcelain)

```
{read_tail(f"{log}/git-status.txt", 80)}
```

### Evidence excerpt

```
{read_tail(f"{log}/verify-evidence.txt", 25)}
```

### Build excerpt

```
{read_tail(f"{log}/build.txt", 20)}
```

---

## Recommendations

Interpretation only. **Not** verified repository state. Human decides.

{plain_bullets(recs)}

---

## Authority boundary

| Without further GO | Requires explicit human GO |
| --- | --- |
| Re-run this report | `git commit` |
| AI review of this contract | `git push` / tags |
| Inspect / prepare / dry-run | Wallet / signing / broadcast / mint / LP / bridge |

**Semantic ladder:** prepared → verified → approved → executed  
This report establishes **facts** (and optional recommendations). It does not approve or execute.

---

## Agent roles

| Agent | Use of this report |
| --- | --- |
| Copilot | Read before proposing code changes |
| Grok | Critique risks against facts |
| Local LLM (Ollama) | Summarize / cross-check |
| Human | Authorize commit / push / hold |

---

## Paths

| Artifact | Path |
| --- | --- |
| Markdown contract | `reports/local-verify-report.md` |
| JSON contract | `reports/local-verify-report.json` |
| Stamped MD | `{md_stamp}` |
| Stamped JSON | `{json_stamp}` |
| Raw logs | `{log}` |
"""

md_path.write_text(md)
json_path.write_text(json.dumps(payload, indent=2) + "\n")
md_stamp.write_text(md)
json_stamp.write_text(json.dumps(payload, indent=2) + "\n")
print(f"Wrote: {md_path}")
print(f"Wrote: {json_path}")
print(f"Stamped: {md_stamp}")
print(f"Stamped: {json_stamp}")
print(f"Logs: {log}")
print(f"FINAL_EXIT={final_exit}")
PY

exit "$FINAL_EXIT"
