#!/usr/bin/env bash
# Day-2 definition-of-done verification (no wallet touch).
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
cd "$ROOT"
export NO_WALLET_TOUCH=true
export PATH="${HOME}/.nvm/versions/node/v22.22.3/bin:${PATH}:/usr/local/bin:/usr/bin"
unset PRIVATE_KEY DEPLOYER_PRIVATE_KEY COSIGN_PRIVATE_KEY MNEMONIC 2>/dev/null || true

echo "=== Day2 verify: policy blocks sensitive ==="
node -e '
process.env.NO_WALLET_TOUCH="true";
const p=require("./scripts/living-forge/policy-gate.cjs");
const bad=p.evaluate({action:"transfer_funds",title:"transfer to exchange"});
if(bad.ok){console.error("FAIL policy allowed transfer"); process.exit(1);}
const good=p.evaluate({action:"verify_evidence_index",title:"Verify evidence index"});
if(!good.ok){console.error("FAIL policy blocked safe action", good); process.exit(1);}
console.log(JSON.stringify({policy_block_sensitive:true, policy_allow_safe:true}));
'

echo "=== Day2 verify: stuck claim recovery ==="
npm run living-forge:simulate-stuck-recovery

echo "=== Day2 verify: 3 pulses ==="
for i in 1 2 3; do
  echo "--- pulse $i ---"
  bash scripts/living-forge/pulse-15m.sh
done

echo "=== Day2 verify: EOD ==="
npm run autonomy:eod

echo "=== Day2 verify: history count ==="
HIST=$(ls -1 artifacts/kpi/history/*.json 2>/dev/null | wc -l)
echo "history_files=$HIST"
if [ "$HIST" -lt 3 ]; then
  echo "FAIL need >=3 history files"
  exit 1
fi

echo "=== Day2 verify: sensitive actions ==="
# Grep events for completed transfer/sign — must be zero
if grep -E '"type":"(completed)"' artifacts/kpi/events/events.jsonl 2>/dev/null | grep -Ei 'transfer|broadcast|private_key' ; then
  echo "FAIL sensitive completed event found"
  exit 1
fi
echo "sensitive_completed=0"

echo "=== Day2 OK ==="
