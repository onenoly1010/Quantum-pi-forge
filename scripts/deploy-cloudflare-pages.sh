#!/usr/bin/env bash
set -Eeuo pipefail

PROJECT_NAME="${CLOUDFLARE_PAGES_PROJECT:-quantumpiforge}"
BRANCH_NAME="${CLOUDFLARE_PAGES_BRANCH:-main}"

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT_DIR="$ROOT/out"

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
