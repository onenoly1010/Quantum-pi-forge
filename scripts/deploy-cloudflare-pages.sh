#!/usr/bin/env bash
set -Eeuo pipefail

PROJECT_NAME="${CLOUDFLARE_PAGES_PROJECT:-quantumpiforge}"
BRANCH_NAME="${CLOUDFLARE_PAGES_BRANCH:-main}"

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT_DIR="$ROOT/out"

# Deploy branch lock: remove after PR #887 merges (main still has withdrawn $2/$5 copy).
CURRENT_BRANCH="$(git -C "$ROOT" branch --show-current 2>/dev/null || echo unknown)"
if [[ "$CURRENT_BRANCH" == "main" ]]; then
  echo "ERROR: refusing to deploy from a 'main' checkout." >&2
  echo "Deploy only from 'feat/ext001-llms-faq' until PR #887 merges;" >&2
  echo "'main' still carries the withdrawn \$2/\$5 copy." >&2
  exit 1
fi
echo "  git branch: $CURRENT_BRANCH"

if [[ ! -d "$OUT_DIR" ]]; then
  echo "ERROR: missing build output directory: $OUT_DIR" >&2
  echo "Run: npm run build:cf" >&2
  exit 1
fi

TMP_DEPLOY="$(mktemp -d)"
cleanup() {
  rm -rf "$TMP_DEPLOY"
}
trap cleanup EXIT

cp -a "$OUT_DIR"/. "$TMP_DEPLOY"/

echo "Deploying Cloudflare Pages artifact from isolated directory:"
echo "  source: $OUT_DIR"
echo "  staged: $TMP_DEPLOY"
echo "  project: $PROJECT_NAME"
echo "  branch: $BRANCH_NAME"

cd "$TMP_DEPLOY"
npx wrangler pages deploy . \
  --project-name "$PROJECT_NAME" \
  --branch "$BRANCH_NAME"
