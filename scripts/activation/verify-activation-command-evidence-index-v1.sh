#!/usr/bin/env bash
set -euo pipefail

DOC="docs/activation/ACTIVATION_COMMAND_EVIDENCE_INDEX_V1.md"
RECEIPT="receipts/activation/activation-command-evidence-index-v1.json"

test -f "$DOC"
test -f "$RECEIPT"

grep -q "ALL_IRREVERSIBLE_FLAGS_LOCKED_FALSE=true" "$DOC"
grep -q "Live execution: FALSE" "$DOC"
grep -q "Private key present: FALSE" "$DOC"
grep -q "Wallet actions: FALSE" "$DOC"
grep -q "Transaction broadcast: FALSE" "$DOC"

jq -e '
  .index == "ACTIVATION_COMMAND_EVIDENCE_INDEX_V1" and
  .status == "VERIFIED" and
  .all_irreversible_flags_locked_false == true and
  .live_execution == false and
  .private_key_present == false and
  .wallet_actions == false and
  .signing_attempted == false and
  .transaction_broadcast == false and
  .repo_mutation_by_activation_command == false and
  (.activation_command_open_sha256 | type == "string" and length == 64) and
  (.activation_readiness_verifier_sha256 | type == "string" and length == 64)
' "$RECEIPT" >/dev/null

echo "PASS activation-command-evidence-index-v1"
echo "ALL_IRREVERSIBLE_FLAGS_LOCKED_FALSE true"
echo "LIVE_EXECUTION false"
echo "PRIVATE_KEY_PRESENT false"
echo "WALLET_ACTIONS false"
echo "SIGNING_ATTEMPTED false"
echo "TRANSACTION_BROADCAST false"
echo "DOC $DOC"
echo "RECEIPT $RECEIPT"
