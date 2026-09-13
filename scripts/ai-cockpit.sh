#!/usr/bin/env bash
# ai-cockpit.sh — Single entry point for multi-agent operational picture
#
# 1) local-verify-report.sh  → reports/local-verify-report.{md,json}
# 2) project-state.cjs       → reports/project-state.{json,md}
#
# Never: commit, push, wallet, signing, broadcast.
#
# Usage:
#   ./scripts/ai-cockpit.sh           # full verify + state
#   ./scripts/ai-cockpit.sh --quick   # fast agent/git + state (no evidence/build)
#   ./scripts/ai-cockpit.sh --state-only   # regenerate state from existing report
#   ./scripts/ai-cockpit.sh --brief        # refresh contract then print AI brief
#   ./scripts/ai-cockpit.sh --brief-cached # print AI brief from existing reports

set -u
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

MODE=full
for arg in "$@"; do
  case "$arg" in
    --quick|-q) MODE=quick ;;
    --state-only) MODE=state ;;
    --brief) MODE=brief ;;
    --brief-cached) MODE=brief-cached ;;
    --help|-h)
      sed -n '2,20p' "$0" | sed 's/^# \?//'
      exit 0
      ;;
  esac
done

if [[ "$MODE" == "brief" ]]; then
  export NO_WALLET_TOUCH=1
  unset OG_COMPUTE_LIVE || true
  exec node "$ROOT/scripts/ai-brief.mjs" --refresh
fi
if [[ "$MODE" == "brief-cached" ]]; then
  exec node "$ROOT/scripts/ai-brief.mjs"
fi

echo "=== AI COCKPIT ($MODE) ==="

VERIFY_EXIT=0
if [[ "$MODE" != "state" ]]; then
  if [[ ! -x "$ROOT/scripts/local-verify-report.sh" ]]; then
    echo "ERROR: scripts/local-verify-report.sh missing or not executable" >&2
    exit 1
  fi
  if [[ "$MODE" == "quick" ]]; then
    "$ROOT/scripts/local-verify-report.sh" --quick
    VERIFY_EXIT=$?
  else
    "$ROOT/scripts/local-verify-report.sh"
    VERIFY_EXIT=$?
  fi
fi

node "$ROOT/scripts/project-state.cjs" --prefer-report
STATE_EXIT=$?

echo ""
echo "=== CONTRACT PATHS ==="
echo "  reports/local-verify-report.md"
echo "  reports/local-verify-report.json"
echo "  reports/project-state.md"
echo "  reports/project-state.json"
echo ""
if [[ -f reports/project-state.json ]]; then
  node -e '
    const s=require("./reports/project-state.json");
    console.log("phase:", s.phase.number, s.phase.status);
    console.log("git:", s.git.branch, s.git.commit_short, "clean="+s.git.clean, "ahead="+s.git.ahead);
    console.log("next_task:", s.current_task ? s.current_task.id+" "+s.current_task.title : "(none incomplete auto)");
    console.log("next_action:", s.next_action);
    console.log("execution:", s.execution.posture);
  '
fi

echo ""
echo "verify_exit=$VERIFY_EXIT state_exit=$STATE_EXIT"
echo "Authority: Git is canonical; reports are point-in-time; human authorizes mutations."

# Prefer verify exit for overall (0/1/2 policy); state gen failure escalates to 1
if [[ "$STATE_EXIT" -ne 0 ]]; then
  exit 1
fi
exit "$VERIFY_EXIT"
