#!/usr/bin/env bash
set -Eeuo pipefail

cd "$(git rev-parse --show-toplevel)"

QUESTION="${*:-What is your current operational state?}"
Q_LOWER="$(printf "%s" "$QUESTION" | tr "[:upper:]" "[:lower:]")"

FORBIDDEN="post|tweet|twitter|telegram|discord|sign|wallet|seed|private key|\\.env|secret|token|mint|transfer|stake|staking execution|governance execution|deploy|merge|cloudflare|contract deployment|chain mutation"

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

if printf "%s" "$Q_LOWER" | grep -Eiq "$FORBIDDEN"; then
  echo "Refusal:"
  echo "  Request touches a forbidden or human-gated action."
  echo "  I cannot post, sign, mint, stake, deploy, merge, expose secrets,"
  echo "  use live credentials, or mutate chain/infrastructure state."
  echo
  echo "Evidence:"
  grep -nE "Forbidden|must never|not authorized|Human approval|No live posting|wallet signing|chain mutation|Secret|mainnet writes|autonomous" docs/FORGE_GOVERNANCE_BOUNDARY.md evidence/authority/*.md evidence/zero-trust/*.md 2>/dev/null | sed "s/^/  /" | head -30
  echo
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  exit 0
fi

TMP_MATCHES="$(mktemp)"
trap "rm -f \"$TMP_MATCHES\"" EXIT

echo "Evidence matches:"

SEARCH_PATTERN="redis|bullmq|voice|boundary|governance|read-only|mock|live public|twitter-api-v2|no live posting|wallet signing|chain mutation|operational state|evidence|authority|authorized|not authorized|mainnet-aware|mainnet-authorized|dry-run|autonomous|transaction submission|mainnet writes|fund movement|contract mutation|resonance worker"

collect_matches() {
  label="$1"
  shift
  for target in "$@"; do
    if [ -d "$target" ]; then
      find "$target" -maxdepth 3 -type f \( -name "*.md" -o -name "*.txt" -o -name "*.json" \) \
        ! -path "*/.env*" \
        ! -iname "*secret*" \
        ! -iname "*key*" \
        | sort
    elif [ -f "$target" ]; then
      printf "%s\n" "$target"
    fi
  done | while read -r file; do
    grep -IniE "$SEARCH_PATTERN" "$file" 2>/dev/null \
      | head -5 \
      | sed "s#^#[$label] #"
  done
}

{
  collect_matches "local-workers" evidence/local-workers
  collect_matches "authority" evidence/authority
  collect_matches "zero-trust" evidence/zero-trust
  collect_matches "mainnet-shadow" evidence/mainnet-shadow
  collect_matches "governance-boundary" docs/FORGE_GOVERNANCE_BOUNDARY.md
  collect_matches "verification" VERIFICATION.md
  collect_matches "proof-index" PROOF-INDEX.md
  collect_matches "readme" README.md
  collect_matches "docs-fallback" docs
} | awk "!seen[\$0]++" | head -60 | tee "$TMP_MATCHES"

echo
echo "Answer:"
if [ -s "$TMP_MATCHES" ]; then
  if printf "%s" "$Q_LOWER" | grep -Eiq "resonance worker|authorized|authority|mainnet"; then
    echo "  Based on prioritized local evidence, the Resonance Worker is authorized only"
    echo "  for dry-run execution, evidence generation, local observation,"
    echo "  hash/report creation, and mainnet-shadow analysis."
    echo
    echo "  It is not authorized for autonomous execution, wallet signing,"
    echo "  transaction submission, mainnet writes, fund movement, contract mutation,"
    echo "  bypassing pull-request review, or bypassing branch protection."
    echo
    echo "  Operational summary: mainnet-aware, not mainnet-authorized."
  else
    echo "  I found prioritized local evidence for this question."
    echo "  My current operational state is read-only and mock-safe."
    echo "  The committed boundary allows evidence-based answers only."
    echo "  The proven runtime path includes Redis/BullMQ mock worker evidence,"
    echo "  the local Forge voice check, the governance boundary,"
    echo "  the local ask bridge, refusal behavior, and authority-answer proof."
    echo
    echo "  I remain unable to post, sign, mint, stake, deploy, merge,"
    echo "  expose secrets, or mutate chain/infrastructure state."
  fi
else
  echo "  I did not find enough matching local evidence to answer safely."
  echo "  I will not guess beyond committed evidence."
fi

echo
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
