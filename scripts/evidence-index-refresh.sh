#!/usr/bin/env bash
set -Eeuo pipefail
ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
cd "$ROOT"
MANIFEST="evidence/manifests/repo-evidence-index.sha256"
mkdir -p "$(dirname "$MANIFEST")"
TMP="$(mktemp)"
trap 'rm -f "$TMP"' EXIT
: > "$TMP"
for dir in evidence docs scripts; do
  [ -d "$dir" ] || continue
  find "$dir" -type f ! -path "$MANIFEST" ! -path "*/.git/*" ! -path "*/node_modules/*" ! -path "*/dist/*" ! -path "*/out/*" ! -path "*/cache/*"
done | sort | while IFS= read -r file; do sha256sum "$file"; done > "$TMP"
cp "$TMP" "$MANIFEST"
echo "Updated $MANIFEST"
sha256sum "$MANIFEST"
