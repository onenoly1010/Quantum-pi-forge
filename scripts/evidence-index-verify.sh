#!/usr/bin/env bash
set -Eeuo pipefail
ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
cd "$ROOT"
MANIFEST="evidence/manifests/repo-evidence-index.sha256"
[ -f "$MANIFEST" ] || { echo "ERROR: missing $MANIFEST" >&2; exit 1; }
echo "=== verifying evidence manifest ==="
sha256sum -c "$MANIFEST"
echo
echo "=== verifying required files ==="
for file in evidence/INDEX.md evidence/claims/SCHEMA.md evidence/claims/QPF-REPO-EVIDENCE-INDEX-v1.md scripts/evidence-index-refresh.sh scripts/evidence-index-verify.sh; do
  [ -f "$file" ] || { echo "ERROR: missing required file: $file" >&2; exit 1; }
  echo "OK: $file"
done
echo
echo "Evidence index verified."
