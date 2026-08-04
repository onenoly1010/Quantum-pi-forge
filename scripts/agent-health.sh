#!/usr/bin/env bash
# agent-health.sh — Local multi-agent cockpit health check
#
# Purpose: separate AI-connection failures from repository/project failures.
# Default mode is fast and read-only. Never signs, broadcasts, or opens wallets.
#
# Usage:
#   ./scripts/agent-health.sh              # status board (fast)
#   ./scripts/agent-health.sh --verify     # also run evidence + build
#   ./scripts/agent-health.sh --json       # machine-readable summary on stderr board + json stdout
#   ./scripts/agent-health.sh --help
#
# Exit codes:
#   0  local control plane usable (Grok and/or Ollama + git repo OK)
#   1  critical local failure (repo missing, no usable local AI)
#   2  degraded (local OK but Copilot/GitHub connectivity issues)

set -u

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
VERIFY=0
JSON=0
TIMEOUT_SEC="${AGENT_HEALTH_TIMEOUT:-3}"

for arg in "$@"; do
  case "$arg" in
    --verify|-v) VERIFY=1 ;;
    --json|-j) JSON=1 ;;
    --help|-h)
      sed -n '2,20p' "$0" | sed 's/^# \?//'
      exit 0
      ;;
  esac
done

# --- state ---
GROK_OK=0
GROK_AUTH=0
GROK_PROC=0
OLLAMA_OK=0
COPILOT_BIN=0
COPILOT_PROC=0
COPILOT_API=0
GH_AUTH=0
GH_API=0
REPO_GIT=0
REPO_CLEAN=0
EVIDENCE_STATUS="pending"
BUILD_STATUS="pending"
CRITICAL=0
DEGRADED=0

ok()   { printf '✓ %s\n' "$*"; }
bad()  { printf '✗ %s\n' "$*"; }
warn() { printf '! %s\n' "$*"; }
info() { printf '  %s\n' "$*"; }

http_code() {
  local url="$1"
  # Prefer curl with hard timeout; treat any transport failure as 000
  local code
  code="$(curl -sS -o /dev/null -w '%{http_code}' --connect-timeout "$TIMEOUT_SEC" --max-time "$TIMEOUT_SEC" -I "$url" 2>/dev/null || true)"
  if [[ -z "$code" ]]; then
    echo "000"
  else
    echo "$code"
  fi
}

section() {
  printf '\n%s\n' "$1"
}

# --- LOCAL GROK ---
section "LOCAL AI"
if command -v grok >/dev/null 2>&1 || [[ -x "${HOME}/.grok/bin/grok" ]]; then
  GROK_BIN="$(command -v grok 2>/dev/null || true)"
  [[ -z "$GROK_BIN" && -x "${HOME}/.grok/bin/grok" ]] && GROK_BIN="${HOME}/.grok/bin/grok"
  ver="$("$GROK_BIN" --version 2>/dev/null | head -1 || echo unknown)"
  ok "Grok available ($ver)"
  GROK_OK=1
  info "bin: $GROK_BIN"
else
  bad "Grok CLI not found"
fi

if [[ -f "${HOME}/.grok/auth.json" ]]; then
  ok "Grok auth present (${HOME}/.grok/auth.json)"
  GROK_AUTH=1
else
  bad "Grok auth missing"
  [[ "$GROK_OK" -eq 1 ]] && DEGRADED=1
fi

if pgrep -u "$(id -u)" -f '(^|/)grok( |$)' >/dev/null 2>&1; then
  ok "Grok process running"
  GROK_PROC=1
  # Show active session cwd if available (no secrets)
  if [[ -f "${HOME}/.grok/active_sessions.json" ]] && command -v python3 >/dev/null 2>&1; then
    python3 - <<'PY' 2>/dev/null || true
import json, os
p = os.path.expanduser("~/.grok/active_sessions.json")
try:
    data = json.load(open(p))
except Exception:
    raise SystemExit
if isinstance(data, list):
    for s in data[:5]:
        sid = str(s.get("session_id", "?"))[:8]
        cwd = s.get("cwd", "?")
        pid = s.get("pid", "?")
        print(f"  session {sid}… pid={pid} cwd={cwd}")
elif isinstance(data, dict):
    print(f"  sessions file keys: {list(data.keys())[:6]}")
PY
  fi
else
  warn "Grok process not detected (CLI may still be invocable)"
fi

if command -v ollama >/dev/null 2>&1; then
  ollama_code="$(http_code "http://127.0.0.1:11434/")"
  if [[ "$ollama_code" == "200" ]] || curl -sS --connect-timeout 2 --max-time 2 "http://127.0.0.1:11434/api/tags" >/dev/null 2>&1; then
    ok "Ollama API reachable (127.0.0.1:11434)"
    OLLAMA_OK=1
    model_count="$(curl -sS --connect-timeout 2 --max-time 2 http://127.0.0.1:11434/api/tags 2>/dev/null | python3 -c 'import sys,json; d=json.load(sys.stdin); print(len(d.get("models",[])))' 2>/dev/null || echo '?')"
    info "models registered: $model_count"
  else
    bad "Ollama binary present but API unreachable"
    DEGRADED=1
  fi
else
  warn "Ollama not installed (optional local model plane)"
fi

if [[ "$GROK_OK" -eq 0 && "$OLLAMA_OK" -eq 0 ]]; then
  CRITICAL=1
fi

# --- COPILOT ---
section "COPILOT"
if command -v copilot >/dev/null 2>&1 || [[ -x "${HOME}/.local/bin/copilot" ]]; then
  COPILOT_PATH="$(command -v copilot 2>/dev/null || echo "${HOME}/.local/bin/copilot")"
  cver="$("$COPILOT_PATH" --version 2>/dev/null | head -1 || echo unknown)"
  ok "Copilot CLI installed ($cver)"
  COPILOT_BIN=1
  info "bin: $COPILOT_PATH"
else
  bad "Copilot CLI not found"
  DEGRADED=1
fi

if pgrep -u "$(id -u)" -f '(^|/)copilot( |$)' >/dev/null 2>&1; then
  ok "Copilot process running"
  COPILOT_PROC=1
else
  warn "Copilot process not running"
fi

# HEAD to individual API often returns 404 without auth — treat TCP+HTTP response as "reachable"
# Failure mode is timeout / 000 / connection error.
copilot_host_code="$(http_code "https://api.individual.githubcopilot.com")"
if [[ "$copilot_host_code" == "000" ]]; then
  bad "Copilot API endpoint unreachable (timeout/connect failure)"
  DEGRADED=1
  COPILOT_API=0
else
  # 401/403/404 all mean the host answered — connectivity OK; auth may still be broken in-session
  ok "Copilot API host responds (HTTP $copilot_host_code)"
  COPILOT_API=1
  if [[ "$copilot_host_code" == "401" || "$copilot_host_code" == "403" ]]; then
    warn "HTTP $copilot_host_code may indicate auth/session issue"
    DEGRADED=1
  fi
fi

# Recent log signal (connection layer only)
log_dir="${HOME}/.copilot/logs"
if [[ -d "$log_dir" ]]; then
  latest_log="$(ls -t "$log_dir"/process-*.log 2>/dev/null | head -1 || true)"
  if [[ -n "${latest_log:-}" ]]; then
    if grep -Eiq 'api.individual.githubcopilot.com|submitEvents reported a transient failure|timed out waiting for bridge' "$latest_log" 2>/dev/null; then
      warn "Recent Copilot log shows connection/session export issues"
      info "log: $latest_log"
      DEGRADED=1
    else
      info "latest log: $(basename "$latest_log") (no recent API timeout signature in scan)"
    fi
  fi
fi

# --- GITHUB (gh) ---
section "GITHUB CLI"
if command -v gh >/dev/null 2>&1; then
  if gh auth status >/dev/null 2>&1; then
    ok "gh authenticated"
    GH_AUTH=1
    # account name only
    acct="$(gh api user --jq .login 2>/dev/null || echo unknown)"
    info "account: $acct"
  else
    bad "gh not authenticated"
    DEGRADED=1
  fi
else
  warn "gh not installed (optional for PR workflows)"
fi

gh_code="$(http_code "https://api.github.com")"
if [[ "$gh_code" == "200" || "$gh_code" == "301" || "$gh_code" == "302" ]]; then
  ok "GitHub API reachable (HTTP $gh_code)"
  GH_API=1
else
  bad "GitHub API not reachable (HTTP $gh_code)"
  DEGRADED=1
fi

# --- REPOSITORY ---
section "REPOSITORY"
cd "$ROOT_DIR" || { bad "cannot cd to $ROOT_DIR"; CRITICAL=1; }

if [[ -d "$ROOT_DIR/.git" ]]; then
  ok "git repository: $ROOT_DIR"
  REPO_GIT=1
else
  bad "not a git repository: $ROOT_DIR"
  CRITICAL=1
fi

if [[ "$REPO_GIT" -eq 1 ]]; then
  branch="$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo '?')"
  head="$(git rev-parse --short HEAD 2>/dev/null || echo '?')"
  info "branch: $branch @ $head"
  if git diff --quiet && git diff --cached --quiet && [[ -z "$(git status --porcelain 2>/dev/null | head -1)" ]]; then
    ok "worktree clean"
    REPO_CLEAN=1
  else
    warn "worktree dirty (local changes present)"
    dirty_n="$(git status --porcelain 2>/dev/null | wc -l | tr -d ' ')"
    info "changed paths: $dirty_n"
  fi
fi

# --- EVIDENCE / BUILD ---
section "EVIDENCE / BUILD"
if [[ "$VERIFY" -eq 1 ]]; then
  info "running npm run verify:evidence …"
  if npm run verify:evidence >/tmp/agent-health-evidence.log 2>&1; then
    ok "evidence verification PASS"
    EVIDENCE_STATUS="pass"
  else
    bad "evidence verification FAIL (see /tmp/agent-health-evidence.log)"
    EVIDENCE_STATUS="fail"
    CRITICAL=1
  fi
  info "running npm run build …"
  if npm run build >/tmp/agent-health-build.log 2>&1; then
    ok "build PASS"
    BUILD_STATUS="pass"
  else
    bad "build FAIL (see /tmp/agent-health-build.log)"
    BUILD_STATUS="fail"
    CRITICAL=1
  fi
else
  info "evidence: pending  (run with --verify)"
  info "build:    pending  (run with --verify)"
  EVIDENCE_STATUS="pending"
  BUILD_STATUS="pending"
fi

# --- AUTHORITY ---
section "AUTHORITY BOUNDARY"
info "You authorize irreversible external actions."
info "Agents may prepare (read-only verify, draft, dry-run)."
info "Gated: wallet prompt, signing, broadcast, mint open, LP, stake, bridge, treasury."
if [[ -f "$ROOT_DIR/docs/governance/PUBLIC_MINT_EXECUTION_PATH_PACKAGE_V1.md" ]]; then
  ok "execution-path package present (NO-GO checklist)"
else
  warn "execution-path package not found"
fi
if [[ -f "$ROOT_DIR/receipts/governance/execution-preflight-reconciliation-v1.json" ]]; then
  ok "execution preflight receipt present (sealed NO-GO posture)"
fi

# --- COOPERATION HINT ---
section "COOPERATION"
if [[ "$GROK_OK" -eq 1 && "$COPILOT_BIN" -eq 1 ]]; then
  if [[ "$COPILOT_API" -eq 0 || "$DEGRADED" -eq 1 ]]; then
    info "Prefer Grok for orchestration while Copilot connection is degraded."
    info "Use Copilot for IDE completion / PR context when its session recovers."
  else
    info "Both agents available — Grok = control plane reasoning; Copilot = IDE/PR assist."
  fi
elif [[ "$GROK_OK" -eq 1 ]]; then
  info "Grok-only mode: continue verification/planning; repair Copilot separately."
elif [[ "$COPILOT_BIN" -eq 1 ]]; then
  info "Copilot-only mode: keep changes in git; restore Grok when possible."
fi
info "Source of truth: git repository + receipts/ — not any AI session."

# --- SUMMARY ---
section "SUMMARY"
if [[ "$CRITICAL" -eq 1 ]]; then
  bad "CRITICAL — local control plane not fully usable"
  exit_code=1
elif [[ "$DEGRADED" -eq 1 ]]; then
  warn "DEGRADED — continue with Grok; fix Copilot/network separately"
  exit_code=2
else
  ok "HEALTHY — multi-agent control plane ready"
  exit_code=0
fi

if [[ "$JSON" -eq 1 ]]; then
  python3 - <<PY
import json
print(json.dumps({
  "grok": {"cli": bool($GROK_OK), "auth": bool($GROK_AUTH), "process": bool($GROK_PROC)},
  "ollama": bool($OLLAMA_OK),
  "copilot": {"cli": bool($COPILOT_BIN), "process": bool($COPILOT_PROC), "api": bool($COPILOT_API)},
  "github": {"auth": bool($GH_AUTH), "api": bool($GH_API)},
  "repository": {"git": bool($REPO_GIT), "clean": bool($REPO_CLEAN), "root": r"""$ROOT_DIR"""},
  "evidence": "$EVIDENCE_STATUS",
  "build": "$BUILD_STATUS",
  "exit_code": $exit_code,
  "authority": "human_only_for_external_actions"
}, indent=2))
PY
fi

exit "$exit_code"
