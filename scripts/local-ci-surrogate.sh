#!/usr/bin/env bash
set -Eeuo pipefail

echo "=== Quantum Pi Forge local CI surrogate ==="
echo "This script replaces GitHub Actions checks while Actions are unavailable."
echo

echo "=== git baseline ==="
git status --short
git branch --show-current
git rev-parse --short HEAD

echo
echo "=== Node environment ==="
export NVM_DIR="$HOME/.nvm"

if [[ -s "$NVM_DIR/nvm.sh" ]]; then
  # nvm.sh may return nonzero during auto-use if no default alias exists.
  # Load it with errexit disabled, then explicitly select Node 22.
  set +e
  set +u
  source "$NVM_DIR/nvm.sh"
  nvm_source_status=$?
  set -u
  set -e

  if [[ "$nvm_source_status" -ne 0 ]]; then
    echo "nvm.sh returned $nvm_source_status during auto-use; continuing with explicit Node 22 selection"
  fi

  if ! nvm use 22 >/dev/null 2>&1; then
    echo "Node 22 is not active via nvm; installing Node 22..."
    nvm install 22
    nvm use 22 >/dev/null
  fi
else
  echo "nvm not found at $NVM_DIR/nvm.sh; using system node if available"
fi

echo "node path: $(command -v node || true)"
echo "npm path:  $(command -v npm || true)"

command -v node >/dev/null
command -v npm >/dev/null

node -v
npm -v

echo
echo "=== dependency install ==="
npm ci

echo
echo "=== available npm scripts ==="
npm pkg get scripts || true

echo
echo "=== lint / test / build ==="
npm run lint --if-present
npm test --if-present
npm run build

echo
echo "=== evidence index verification ==="
npm run verify:evidence-index --if-present

echo
echo "=== static deploy artifact check ==="
if [[ -d deploy ]]; then
  test -f deploy/index.html
  echo "deploy/index.html present"
else
  echo "deploy/ not present; skipping static artifact check"
fi

echo
echo "=== canon script availability ==="
for f in \
  .github/scripts/validate-canon-state.py \
  .github/scripts/verify-canon-integrity.py \
  .github/scripts/check-conflicts.py
do
  if [[ -f "$f" ]]; then
    echo "FOUND $f"
  else
    echo "MISSING $f"
  fi
done

echo
echo "=== canon validation ==="
if [[ -f .github/scripts/validate-canon-state.py ]]; then
  if [[ -f canon/closure_claim.json ]]; then
    python3 .github/scripts/validate-canon-state.py --dir canon
  else
    echo "canon/closure_claim.json not present; skipping canon state validation"
  fi
fi

echo
echo "=== canon integrity ==="
if [[ -f .github/scripts/verify-canon-integrity.py ]]; then
  python3 .github/scripts/verify-canon-integrity.py \
    --canon-dir canon \
    --output /tmp/quantum-pi-forge-canon-integrity.json
fi

echo
echo "=== canon conflict check ==="
if [[ -f .github/scripts/check-conflicts.py ]]; then
  if [[ -n "${NEW_CANON_ARTIFACT:-}" && -f "$NEW_CANON_ARTIFACT" ]]; then
    python3 .github/scripts/check-conflicts.py \
      --canon-dir canon \
      --new-artifact "$NEW_CANON_ARTIFACT"
  else
    echo "NEW_CANON_ARTIFACT not set or file missing; skipping canon conflict check"
  fi
fi

echo
echo "=== final git state ==="
git status --short

echo
echo "✅ local CI surrogate completed"
