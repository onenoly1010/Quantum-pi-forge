#!/usr/bin/env bash
# Day-2 15-minute autonomy pulse — NO_WALLET_TOUCH, no secrets, no spend.
# 1) unstick expired claims
# 2) light scheduler cycle (one P3 or drain-light)
# 3) KPI snapshot + operator view
set -euo pipefail

ROOT="/home/kris/Quantum-pi-forge"
LOG_DIR="/home/kris/.forge-daemon"
LOG="$LOG_DIR/autonomy-pulse.log"
mkdir -p "$LOG_DIR" "$ROOT/artifacts/kpi"

export NO_WALLET_TOUCH=true
export PATH="${HOME}/.nvm/versions/node/v22.22.3/bin:${PATH}:/usr/local/bin:/usr/bin"
# Refuse if keys leaked into environment
unset PRIVATE_KEY DEPLOYER_PRIVATE_KEY FEE_TO_SETTER_PRIVATE_KEY COSIGN_PRIVATE_KEY MNEMONIC SEED PI_PRIVATE_KEY AI_PRIVATE_KEY 2>/dev/null || true

cd "$ROOT" || exit 1

ts() { date -u +%Y-%m-%dT%H:%M:%SZ; }
log() { echo "$(ts) $*" | tee -a "$LOG"; }

if ! command -v node >/dev/null 2>&1; then
  log "ERROR node not found"
  exit 1
fi

log "PULSE_START no_wallet_touch=true"

# Structured pulse event
node -e "process.env.NO_WALLET_TOUCH='true'; require('./scripts/living-forge/events.cjs').emit('pulse',{source:'pulse-15m'})" >>"$LOG" 2>&1 || true

# 1) recover expired leases
node scripts/living-forge/scheduler.cjs --unstick-claims >>"$LOG" 2>&1 || true

# 2) one safe P3 cycle (avoid thrash; full drain stays on living-forge.timer optional)
node scripts/living-forge/scheduler.cjs >>"$LOG" 2>&1 || true

# 3) KPI + operator view
node scripts/kpi_snapshot.cjs >>"$LOG" 2>&1 || true
node scripts/living-forge/operator-view.cjs >>"$LOG" 2>&1 || true

log "PULSE_END"
exit 0
