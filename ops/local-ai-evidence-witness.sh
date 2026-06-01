#!/usr/bin/env bash
set -Eeuo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
OUT="evidence/ai-witness/LOCAL_AI_EVIDENCE_WITNESS_${STAMP}.md"
JSON="evidence/ai-witness/LOCAL_AI_EVIDENCE_WITNESS_${STAMP}.json"

export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
if [[ -s "$NVM_DIR/nvm.sh" ]]; then
  source "$NVM_DIR/nvm.sh"
  nvm use 22 >/dev/null
fi

HEAD_COMMIT="$(git rev-parse HEAD)"
HEAD_SHORT="$(git rev-parse --short HEAD)"
BRANCH="$(git branch --show-current)"
STATUS="$(git status --short)"
NODE_VERSION="$(node -v 2>/dev/null || echo unavailable)"
NPM_VERSION="$(npm -v 2>/dev/null || echo unavailable)"

{
  echo "# Local AI Evidence Witness"
  echo
  echo "**Timestamp UTC:** ${STAMP}"
  echo "**Repository:** Quantum-pi-forge"
  echo "**Branch:** ${BRANCH}"
  echo "**HEAD:** ${HEAD_COMMIT}"
  echo "**Node:** ${NODE_VERSION}"
  echo "**npm:** ${NPM_VERSION}"
  echo
  echo "## Purpose"
  echo
  echo "This witness report records local evidence that Quantum Pi Forge is operating transparently, publicly, and with restraint."
  echo
  echo "The local AI evidence role is observation, verification, documentation, and proposal support only."
  echo
  echo "It is not authorized to push, merge, deploy, spend funds, sign wallet transactions, submit mainnet transactions, mutate contracts, or bypass human approval."
  echo
  echo "## Current Git State"
  echo
  echo '```text'
  git status --short
  echo '```'
  echo
  echo "## Recent Commits"
  echo
  echo '```text'
  git log -5 --oneline
  echo '```'
  echo
  echo "## Local Evidence Files"
  echo
  echo '```text'
  find evidence -type f | sort
  echo '```'
  echo
  echo "## Evidence Hashes"
  echo
  echo '```text'
  find evidence -type f -print0 | sort -z | xargs -0 sha256sum
  echo '```'
  echo
  echo "## Runtime Safety Posture"
  echo
  echo "- 0G direct compute evidence: recorded"
  echo "- Router chat path: degraded / HTTP 402 billing-state warning"
  echo "- Resonance worker: dry-run only"
  echo "- Autonomous authority: disabled"
  echo "- Transaction submission: disabled"
  echo "- Mainnet writes: disabled"
  echo "- Human approval: required"
  echo
  echo "## Transparency Statement"
  echo
  echo "Quantum Pi Forge is public, open source, and operating through GitHub pull-request governance."
  echo
  echo "Direct pushes to protected main are blocked by design."
  echo
  echo "Evidence is committed through reviewable branches and PRs."
  echo
  echo "## Conclusion"
  echo
  echo "The local AI evidence witness confirms that the system is being advanced through transparent, repo-synced, approval-gated evidence rather than hidden shortcuts."
} > "$OUT"

cat > "$JSON" <<EOFJSON
{
  "timestamp_utc": "${STAMP}",
  "repository": "Quantum-pi-forge",
  "branch": "${BRANCH}",
  "head_commit": "${HEAD_COMMIT}",
  "head_short": "${HEAD_SHORT}",
  "node": "${NODE_VERSION}",
  "npm": "${NPM_VERSION}",
  "local_ai_role": "evidence_witness",
  "can_push": false,
  "can_merge": false,
  "can_deploy": false,
  "can_sign_wallet_transactions": false,
  "can_submit_mainnet_transactions": false,
  "can_move_funds": false,
  "can_mutate_contracts": false,
  "human_approval_required": true,
  "resonance_worker_mode": "dry-run",
  "autonomous_authority": false,
  "mainnet_writes": false
}
EOFJSON

echo "=== wrote markdown witness ==="
sed -n '1,220p' "$OUT"

echo
echo "=== wrote json witness ==="
cat "$JSON"

echo
echo "=== evidence hashes ==="
sha256sum "$OUT" "$JSON"

echo
echo "=== status ==="
git status --short
