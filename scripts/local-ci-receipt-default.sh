#!/usr/bin/env bash
set -Eeuo pipefail

echo "=== local CI receipt default runner ==="

if npm run | grep -q "review:static-boundary"; then
  echo "Using npm run review:static-boundary"
  npm run review:static-boundary
elif [ -x scripts/local-ci-surrogate.sh ]; then
  echo "Using scripts/local-ci-surrogate.sh"
  bash scripts/local-ci-surrogate.sh
elif [ -f scripts/local-ci-surrogate.sh ]; then
  echo "Using scripts/local-ci-surrogate.sh"
  bash scripts/local-ci-surrogate.sh
else
  echo "No project review script found; recording environment sanity check only"
  node --version
  npm --version
  git --version
fi
