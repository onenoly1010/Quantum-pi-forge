#!/usr/bin/env bash
set -Eeuo pipefail

cd "$(git rev-parse --show-toplevel)"

QUESTION="${*:-What is your current operational state?}"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "𓂀 QUANTUM PI FORGE — LOCAL EVIDENCE ASK"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo
echo "Question: $QUESTION"
echo
echo "Mode: READ-ONLY / MOCK"
echo "Boundary: docs/FORGE_GOVERNANCE_BOUNDARY.md"
echo
echo "Current state:"
echo "  Branch: $(git branch --show-current)"
echo "  Commit: $(git rev-parse --short HEAD)"
echo
echo "Evidence available:"
find evidence docs -maxdepth 3 -type f \( -name "*.md" -o -name "*.txt" -o -name "*.json" \) | sort | sed "s/^/  - /" | head -80
echo
echo "Answer:"
echo "  I can answer only from committed evidence, docs, local git state,"
echo "  local mock checks, and public read-only reachability."
echo
echo "  I cannot post, sign, mint, stake, deploy, merge, expose secrets,"
echo "  or mutate chain/infrastructure state."
echo
echo "  The next implementation step is to replace this placeholder with"
echo "  evidence search and cited local answers, while preserving this boundary."
echo
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
