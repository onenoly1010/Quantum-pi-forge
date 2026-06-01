#!/usr/bin/env bash
export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
if [[ -s "$NVM_DIR/nvm.sh" ]]; then
  # shellcheck disable=SC1090
  source "$NVM_DIR/nvm.sh"
  nvm use 22 >/dev/null
fi

NODE_MAJOR="$(node -p "process.versions.node.split('.')[0]")"
if [[ "$NODE_MAJOR" != "22" ]]; then
  echo "ERROR: Node 22 required, got $(node -v)"
  exit 1
fi
set -Eeuo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

LOG_DIR="$ROOT/logs"
mkdir -p "$LOG_DIR"
STAMP="$(date +%Y%m%d_%H%M%S)"
LOG_FILE="$LOG_DIR/local-workflow-$STAMP.log"

exec > >(tee -a "$LOG_FILE") 2>&1

section() {
  printf '\n=== %s ===\n' "$*"
}

section "local workflow start"
date -Is
pwd

section "git state"
git status --short
git branch --show-current
git rev-parse --short HEAD

section "remotes"
git remote -v

section "submodules"
git submodule sync --recursive
git submodule update --init --recursive
git submodule status --recursive

section "node/npm"
node -v
npm -v

section "dependency install"
if [[ -f package-lock.json ]]; then
  npm ci
elif [[ -f package.json ]]; then
  npm install
else
  echo "No package.json found; skipping npm install."
fi

section "available npm scripts"
if [[ -f package.json ]]; then
  npm run || true
fi

section "standard checks"
if [[ -f package.json ]]; then
  npm run lint --if-present
  npm run typecheck --if-present
  npm run test --if-present
  npm run build --if-present
fi

section "press agent verification"
if [[ -f verify-press-agent.sh ]]; then
  bash verify-press-agent.sh
else
  echo "verify-press-agent.sh not found; skipping."
fi

section "workflow command extraction reference"
if [[ -d .github/workflows ]]; then
  grep -R "^[[:space:]]*run:" -n .github/workflows || true
fi

section "local workflow complete"
date -Is
echo "Log written to: $LOG_FILE"
