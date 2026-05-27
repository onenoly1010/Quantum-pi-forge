#!/usr/bin/env bash
set -Eeuo pipefail

PROJECT_NAME="${PROJECT_NAME:-quantumpiforge}"
BUILD_DIR="${BUILD_DIR:-out}"
LOG_DIR="${LOG_DIR:-logs}"
LOG_FILE="$LOG_DIR/deploy_history.log"

red() { printf '\033[0;31m%s\033[0m\n' "$*"; }
green() { printf '\033[0;32m%s\033[0m\n' "$*"; }
yellow() { printf '\033[1;33m%s\033[0m\n' "$*"; }

fail() {
  red "FAIL: $*"
  exit 1
}

trap 'red "Deploy failed near line $LINENO. Check output above."' ERR

yellow "=== Quantum Pi Forge deploy ==="

command -v node >/dev/null || fail "node is missing"
command -v npm >/dev/null || fail "npm is missing"

NODE_MAJOR="$(node -p 'process.versions.node.split(".")[0]')"
if [ "$NODE_MAJOR" -lt 22 ]; then
  fail "Node 22+ required. Current: $(node -v). Run: nvm install 22 && nvm use 22"
fi

if ! npx --yes wrangler --version >/dev/null 2>&1; then
  fail "Wrangler unavailable. Add it locally with: npm install -D wrangler"
fi

yellow "Checking Cloudflare authentication..."
if ! npx wrangler whoami >/dev/null 2>&1; then
  fail "Cloudflare auth missing. Run: npx wrangler login"
fi

yellow "Installing dependencies..."
if [ -f package-lock.json ]; then
  npm ci
else
  npm install
fi

yellow "Building Next.js app..."
npm run build

[ -d "$BUILD_DIR" ] || fail "Build directory '$BUILD_DIR' not found after npm run build"

mkdir -p "$LOG_DIR"

yellow "Deploying to Cloudflare Pages project: $PROJECT_NAME"
npx wrangler pages deploy "$BUILD_DIR" --project-name "$PROJECT_NAME"

{
  echo "timestamp=$(date -Is)"
  echo "project=$PROJECT_NAME"
  echo "build_dir=$BUILD_DIR"
  echo "git_commit=$(git rev-parse --short HEAD 2>/dev/null || echo unknown)"
  echo "---"
} >> "$LOG_FILE"

green "Cloudflare deploy completed."

if [ -n "${WEB3_STORAGE_TOKEN:-}" ]; then
  yellow "WEB3_STORAGE_TOKEN detected, but IPFS pinning is intentionally not enabled in this script."
  yellow "Reason: previous IPFS CLI/package path was unreliable."
else
  yellow "IPFS pinning skipped: WEB3_STORAGE_TOKEN not set."
fi

green "Done."
