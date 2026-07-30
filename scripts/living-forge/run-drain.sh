#!/usr/bin/env bash
# Living Forge heartbeat — non-interactive, no secrets, no wallet moves.
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
LOG_DIR="${QPF_FORGE_DAEMON_DIR:-$HOME/.forge-daemon}"
mkdir -p "$LOG_DIR"
cd "$ROOT"
export NO_WALLET_TOUCH=true
export PATH="${HOME}/.nvm/versions/node/v22.22.3/bin:${PATH}:/usr/local/bin:/usr/bin"
unset PRIVATE_KEY DEPLOYER_PRIVATE_KEY FEE_TO_SETTER_PRIVATE_KEY COSIGN_PRIVATE_KEY MNEMONIC SEED PI_PRIVATE_KEY AI_PRIVATE_KEY 2>/dev/null || true
if ! command -v node >/dev/null 2>&1; then
  echo "$(date -u +%Y-%m-%dT%H:%M:%SZ) ERROR: node not found" >> "$LOG_DIR/living-forge.log"
  exit 1
fi
echo "$(date -u +%Y-%m-%dT%H:%M:%SZ) START living-forge drain no_wallet_touch=true root=$ROOT" >> "$LOG_DIR/living-forge.log"
node scripts/living-forge/scheduler.cjs --drain >> "$LOG_DIR/living-forge.log" 2>&1
echo "$(date -u +%Y-%m-%dT%H:%M:%SZ) END exit=$?" >> "$LOG_DIR/living-forge.log"
