#!/usr/bin/env bash
# Living Forge event-driven standby.
# Local gates are STABLE — do not re-prove them on every FS noise.
# Wake for NEW evidence; idle when nothing relevant changed.
# No signing, no fund movement, no secrets.
set -uo pipefail

ROOT="/home/kris/Quantum-pi-forge"
LOG_DIR="/home/kris/.forge-daemon"
LOG="$LOG_DIR/living-forge-event.log"
STATE_DIR="$ROOT/docs/activation/living-forge/monitors"
mkdir -p "$LOG_DIR" "$STATE_DIR"
cd "$ROOT" || exit 1

export PATH="${HOME}/.nvm/versions/node/v22.22.3/bin:${PATH}:/usr/local/bin:/usr/bin"

log() { echo "$(date -u +%Y-%m-%dT%H:%M:%SZ) $*" | tee -a "$LOG"; }

# Narrow watches: avoid docs/activation/living-forge/heartbeats|monitors (self-wake thrash)
WATCH_PATHS=(
  "$ROOT/.git/refs/heads"
  "$ROOT/receipts/spiral-return"
  "$ROOT/docs/activation/command"
  "$ROOT/docs/activation/living-forge/FOUNDER_RECEIVING_AUTHORITY_V1.md"
  "$ROOT/docs/activation/living-forge/receiving-operational-state-v1.json"
  "$ROOT/docs/activation/living-forge/HUMAN_ACTION_QUEUE_V1.md"
  "$ROOT/0G_GRANT_STATUS_TRACKING.md"
  "$ROOT/contracts/DEPLOYED_ADDRESSES.md"
  "$ROOT/package.json"
  "$ROOT/scripts/living-forge"
)

DEBOUNCE_SEC="${LIVING_FORGE_DEBOUNCE_SEC:-10}"
# Long safety pulse — local integrity already proven; only re-check if silent too long
SAFETY_IDLE_SEC="${LIVING_FORGE_SAFETY_IDLE_SEC:-21600}"  # 6h

classify_and_run() {
  local reason="$1"
  local paths_hint="${2:-}"
  log "WAKE reason=$reason paths_hint=${paths_hint:0:200}"

  if ! command -v node >/dev/null 2>&1; then
    log "ERROR node not found"
    return 1
  fi

  # Always: funding/receive signal monitor (cheap, new-evidence oriented)
  node scripts/living-forge/monitor-funding-signals.cjs >>"$LOG" 2>&1 || true

  # Full drain only on structural change or safety pulse — not every form touch
  local full=0
  case "$reason" in
    startup|safety_idle_timeout|git_or_package_or_scripts)
      full=1
      ;;
    *)
      if echo "$paths_hint" | grep -qE 'refs/heads|package\.json|scripts/living-forge|DEPLOYED_ADDRESSES|0G_GRANT'; then
        full=1
      fi
      ;;
  esac

  if [[ $full -eq 1 ]]; then
    log "WORK full_authorized_drain"
    node scripts/living-forge/scheduler.cjs --drain >>"$LOG" 2>&1 || true
  else
    log "WORK funding_monitor_only (local gates stable; skip re-audit)"
  fi

  echo "{\"at\":\"$(date -u +%Y-%m-%dT%H:%M:%SZ)\",\"reason\":\"$reason\",\"full_drain\":$full,\"mode\":\"event_driven_stable\"}" \
    >"$STATE_DIR/last-event-wake.json"
  log "IDLE awaiting new evidence"
}

run_authorized_work() {
  classify_and_run "$1" ""
}

# Startup: one full pulse to establish baseline, then idle
run_authorized_work "startup"

IN_ARGS=()
for p in "${WATCH_PATHS[@]}"; do
  [[ -e "$p" ]] && IN_ARGS+=("$p")
done

if [[ ${#IN_ARGS[@]} -eq 0 ]]; then
  log "ERROR no watch paths"
  while true; do sleep "$SAFETY_IDLE_SEC"; run_authorized_work "safety_idle"; done
fi

log "STANDBY event-driven watches=${#IN_ARGS[@]} debounce=${DEBOUNCE_SEC}s safety_idle=${SAFETY_IDLE_SEC}s posture=stable_local_gates"

while true; do
  # Capture event line for classification
  ev_line=""
  if ev_line=$(inotifywait -q -r -t "$SAFETY_IDLE_SEC" \
    -e modify,create,delete,move,close_write \
    --format '%w%f' \
    "${IN_ARGS[@]}" 2>>"$LOG"); then
    sleep "$DEBOUNCE_SEC"
    # coalesce burst
    while more=$(inotifywait -q -r -t 1 -e modify,create,delete,move,close_write --format '%w%f' "${IN_ARGS[@]}" 2>/dev/null); do
      ev_line="$ev_line $more"
      sleep 1
    done
    # Ignore pure heartbeat/monitor self-noise if any leaked in
    if echo "$ev_line" | grep -qE 'heartbeats/|monitors/last-event|monitors/funding-monitor-20'; then
      if ! echo "$ev_line" | grep -qE 'funding-receiving-form|GRANT_STATUS|0G_GRANT|refs/heads|package\.json|spiral-return-secured|spiral-return-funding'; then
        log "SKIP self-noise event"
        continue
      fi
    fi
    if echo "$ev_line" | grep -qE 'refs/heads|package\.json|scripts/living-forge|DEPLOYED_ADDRESSES'; then
      classify_and_run "git_or_package_or_scripts" "$ev_line"
    else
      classify_and_run "funding_or_command_docs_change" "$ev_line"
    fi
  else
    ec=$?
    if [[ $ec -eq 2 ]]; then
      run_authorized_work "safety_idle_timeout"
    else
      log "inotifywait exit=$ec; sleep 30"
      sleep 30
    fi
  fi
done
