#!/usr/bin/env bash
set -euo pipefail

REPORT_DIR="reports"
REPORT_FILE="$REPORT_DIR/local-ci-surrogate-$(date -u +%Y%m%dT%H%M%SZ).md"

mkdir -p "$REPORT_DIR"

status="PASSED"

log() {
  printf '%s\n' "$1" | tee -a "$REPORT_FILE"
}

fail() {
  status="FAILED"
  log "- ❌ $1"
}

pass() {
  log "- ✅ $1"
}

log "# Local CI Surrogate Report"
log ""
log "Generated: $(date -u +"%Y-%m-%dT%H:%M:%SZ")"
log "Commit: $(git rev-parse --short HEAD 2>/dev/null || echo unknown)"
log "Branch: $(git branch --show-current 2>/dev/null || echo unknown)"
log ""

log "## Environment Checks"

command -v git >/dev/null 2>&1 && pass "git available" || fail "git missing"
command -v node >/dev/null 2>&1 && pass "node available: $(node --version)" || fail "node missing"
command -v npm >/dev/null 2>&1 && pass "npm available: $(npm --version)" || fail "npm missing"

log ""
log "## Repository State"

if git diff --quiet && git diff --cached --quiet; then
  pass "working tree clean"
else
  fail "working tree has uncommitted changes"
fi

test -f REVIEWER_START_HERE.md && pass "REVIEWER_START_HERE.md present" || fail "REVIEWER_START_HERE.md missing"
test -f VERIFICATION.md && pass "VERIFICATION.md present" || fail "VERIFICATION.md missing"
test -f OFFICIAL_CHANNELS.md && pass "OFFICIAL_CHANNELS.md present" || fail "OFFICIAL_CHANNELS.md missing"
test -f EVIDENCE.md && pass "EVIDENCE.md present" || fail "EVIDENCE.md missing"
test -f docs/ARCHITECTURE_MAP.md && pass "docs/ARCHITECTURE_MAP.md present" || fail "docs/ARCHITECTURE_MAP.md missing"

log ""
log "## Press Agent Syntax Checks"

if test -d press-agent; then
  (
    cd press-agent
    node -c src/bots/twitter.js
    node -c src/bots/telegram.js
  ) && pass "press-agent bot syntax valid" || fail "press-agent bot syntax failed"
else
  fail "press-agent directory missing"
fi

log ""
log "## Safety Gate Checks"

if grep -R "PRESS_AGENT_LIVE_X_POST" press-agent/src/bots/twitter.js >/dev/null 2>&1; then
  pass "X/Twitter live posting gate present"
else
  log "- ⚠️ X/Twitter live posting gate not present on this branch; expected until PR #105 is merged"
fi

if grep -R "TELEGRAM_BOT_TOKEN" press-agent/src/bots/telegram.js >/dev/null 2>&1; then
  pass "Telegram requires explicit token"
else
  fail "Telegram token gate missing"
fi

log ""
log "## Final Result"
log ""
log "**$status**"

if [ "$status" = "FAILED" ]; then
  exit 1
fi
