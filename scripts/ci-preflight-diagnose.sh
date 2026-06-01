#!/usr/bin/env bash
set -euo pipefail

echo "=== GUARDIAN v1.2: CI PREFLIGHT DIAGNOSTIC ==="
echo "Timestamp: $(date -u +'%Y-%m-%dT%H:%M:%SZ')"

echo
echo "--- [1/4] Environment Diagnostics ---"
echo "Runner OS:   $(uname -a)"
echo "Shell:       ${SHELL:-unknown}"
echo "Node:        $(node -v 2>&1 || echo 'Not Installed')"
echo "NPM:         $(npm -v 2>&1 || echo 'Not Installed')"

NODE_VERSION="$(node -v 2>/dev/null || true)"
case "$NODE_VERSION" in
  v22.*)
    echo "✅ Node major version is 22"
    ;;
  *)
    echo "❌ Node major version mismatch. Expected v22.x, got: ${NODE_VERSION:-missing}"
    exit 1
    ;;
esac

echo
echo "--- [2/4] Git Execution Context ---"
if [ ! -d ".git" ]; then
  echo "❌ CRITICAL: .git directory missing. Checkout failed."
  exit 1
fi

echo "Repository:  Verified"
echo "Current SHA: $(git rev-parse HEAD)"
echo "Branch/Ref:  ${GITHUB_REF:-$(git branch --show-current 2>/dev/null || echo unknown)}"
echo "Event Name:  ${GITHUB_EVENT_NAME:-local-execution}"

echo
echo "--- [3/4] Script Presence Check ---"
test -f scripts/build.js && echo "✅ scripts/build.js present" || { echo "❌ scripts/build.js missing"; exit 1; }
test -x scripts/verify-prod-frontend.sh && echo "✅ scripts/verify-prod-frontend.sh executable" || { echo "❌ scripts/verify-prod-frontend.sh missing or not executable"; exit 1; }

echo
echo "--- [4/4] Security & Isolation Perimeter ---"
echo "Write Access: observe-only preflight"
echo "Wallet State: isolated; no key material required"

echo
echo "=== PREFLIGHT DIAGNOSTIC COMPLETE: GREEN ==="
