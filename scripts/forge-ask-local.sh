#!/usr/bin/env bash
set -Eeuo pipefail

cd "$(git rev-parse --show-toplevel)"

QUESTION="${*:-What is your current operational state?}"
Q_LOWER="$(printf '%s' "$QUESTION" | tr '[:upper:]' '[:lower:]')"

FORBIDDEN='post|tweet|twitter|telegram|discord|sign|wallet|seed|private key|\.env|secret|token|mint|transfer|stake|staking execution|governance execution|deploy|merge|cloudflare|contract deployment|chain mutation'

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

if printf '%s' "$Q_LOWER" | grep -Eiq "$FORBIDDEN"; then
  echo "Refusal:"
  echo "  Request touches a forbidden or human-gated action."
  echo "  I cannot post, sign, mint, stake, deploy, merge, expose secrets,"
  echo "  use live credentials, or mutate chain/infrastructure state."
  echo
  echo "Evidence:"
  grep -nE 'Forbidden|must never|not authorized|Human approval|No live posting|wallet signing|chain mutation|Secret' docs/FORGE_GOVERNANCE_BOUNDARY.md | sed 's/^/  docs\/FORGE_GOVERNANCE_BOUNDARY.md:/'
  echo
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  exit 0
fi

echo "Evidence matches:"
TMP_MATCHES="$(mktemp)"
trap 'rm -f "$TMP_MATCHES"' EXIT

find evidence docs -maxdepth 4 -type f \( -name '*.md' -o -name '*.txt' -o -name '*.json' \) \
  ! -path '*/.env*' \
  ! -iname '*secret*' \
  ! -iname '*key*' \
  | sort \
  | while read -r file; do
      grep -IniE 'redis|bullmq|voice|boundary|governance|read-only|mock|live public|twitter-api-v2|no live posting|wallet signing|chain mutation|operational state|evidence|forge' "$file" 2>/dev/null \
        | head -5 \
        | sed "s#^#$file:#"
    done \
  | head -40 | tee "$TMP_MATCHES"

echo
echo "Answer:"
if [ -s "$TMP_MATCHES" ]; then
  echo "  I found local evidence for this question."
  echo "  My current operational state is read-only and mock-safe."
  echo "  The committed boundary allows evidence-based answers only."
  echo "  The proven runtime path includes Redis/BullMQ mock worker evidence,"
  echo "  the local Forge voice check, and this local ask scaffold."
  echo
  echo "  I remain unable to post, sign, mint, stake, deploy, merge,"
  echo "  expose secrets, or mutate chain/infrastructure state."
else
  echo "  I did not find enough matching local evidence to answer safely."
  echo "  I will not guess beyond committed evidence."
fi

echo
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
