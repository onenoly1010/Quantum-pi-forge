#!/usr/bin/env bash
# Living Forge event-driven standby.
# Idle when nothing changes. Wake on filesystem/repo signals. Never exit unless killed.
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

WATCH_PATHS=(
  "$ROOT/.git/refs/heads"
  "$ROOT/receipts/spiral-return"
  "$ROOT/docs/activation"
  "$ROOT/0G_GRANT_STATUS_TRACKING.md"
  "$ROOT/contracts/DEPLOYED_ADDRESSES.md"
  "$ROOT/package.json"
  "$ROOT/scripts/living-forge"
)

# Debounce: batch rapid events
DEBOUNCE_SEC="${LIVING_FORGE_DEBOUNCE_SEC:-8}"
# Safety max idle pulse (seconds) if inotify misses something — long, not 15m thrash
SAFETY_IDLE_SEC="${LIVING_FORGE_SAFETY_IDLE_SEC:-7200}"

run_authorized_work() {
  local reason="$1"
  log "WAKE reason=$reason"
  if ! command -v node >/dev/null 2>&1; then
    log "ERROR node not found"
    return 1
  fi
  node scripts/living-forge/monitor-funding-signals.cjs >>"$LOG" 2>&1 || true
  node scripts/living-forge/scheduler.cjs --drain >>"$LOG" 2>&1 || true
  echo "{\"at\":\"$(date -u +%Y-%m-%dT%H:%M:%SZ)\",\"reason\":\"$reason\",\"mode\":\"event_driven\"}" \
    >"$STATE_DIR/last-event-wake.json"
  log "IDLE awaiting next state change"
}

# Initial pulse once at start
run_authorized_work "startup"

# Build inotify args for existing paths only
IN_ARGS=()
for p in "${WATCH_PATHS[@]}"; do
  if [[ -e "$p" ]]; then
    IN_ARGS+=("$p")
  fi
done

if [[ ${#IN_ARGS[@]} -eq 0 ]]; then
  log "ERROR no watch paths; falling back to long sleep loop"
  while true; do
    sleep "$SAFETY_IDLE_SEC"
    run_authorized_work "safety_idle"
  done
fi

log "STANDBY event-driven watches=${#IN_ARGS[@]} debounce=${DEBOUNCE_SEC}s safety_idle=${SAFETY_IDLE_SEC}s"

while true; do
  # -q quiet, -r recursive on dirs, timeout = safety idle
  if inotifywait -q -r -t "$SAFETY_IDLE_SEC" \
    -e modify,create,delete,move,attrib,close_write \
    "${IN_ARGS[@]}" >>"$LOG" 2>&1; then
    # Event observed — debounce
    sleep "$DEBOUNCE_SEC"
    # Drain any burst
    while inotifywait -q -r -t 1 \
      -e modify,create,delete,move,attrib,close_write \
      "${IN_ARGS[@]}" >/dev/null 2>&1; do
      sleep 1
    done
    run_authorized_work "filesystem_or_repo_change"
  else
    # timeout (exit 2) or error — safety pulse
    ec=$?
    if [[ $ec -eq 2 ]]; then
      run_authorized_work "safety_idle_timeout"
    else
      log "inotifywait exit=$ec; sleep 30 and retry"
      sleep 30
    fi
  fi
done
