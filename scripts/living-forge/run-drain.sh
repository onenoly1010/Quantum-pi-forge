#!/usr/bin/env bash
# Living Forge heartbeat — non-interactive, no secrets, no wallet moves.
set -euo pipefail
ROOT="/home/kris/Quantum-pi-forge"
LOG_DIR="/home/kris/.forge-daemon"
mkdir -p "$LOG_DIR"
cd "$ROOT"
export PATH="${HOME}/.nvm/versions/node/v22.22.3/bin:${PATH}:/usr/local/bin:/usr/bin"
if ! command -v node >/dev/null 2>&1; then
  echo "$(date -u +%Y-%m-%dT%H:%M:%SZ) ERROR: node not found" >> "$LOG_DIR/living-forge.log"
  exit 1
fi
echo "$(date -u +%Y-%m-%dT%H:%M:%SZ) START living-forge drain" >> "$LOG_DIR/living-forge.log"
node scripts/living-forge/scheduler.cjs --drain >> "$LOG_DIR/living-forge.log" 2>&1
echo "$(date -u +%Y-%m-%dT%H:%M:%SZ) END exit=$?" >> "$LOG_DIR/living-forge.log"
