#!/usr/bin/env bash
set -euo pipefail

DOC="docs/observers/OINIO_LOCAL_OBSERVER_EVIDENCE_INDEX_V1.md"
RECEIPT="receipts/observers/oinio-local-observer-evidence-index-v1.json"

test -f "$DOC"
test -f "$RECEIPT"

grep -q "ALL_IRREVERSIBLE_FLAGS_LOCKED_FALSE=true" "$DOC"
grep -q "Old resonance worker reuse: FALSE" "$DOC"
grep -q "Owned QPF source only: TRUE" "$DOC"
grep -q "Network send: FALSE" "$DOC"
grep -q "Live execution: FALSE" "$DOC"
grep -q "Private key present: FALSE" "$DOC"
grep -q "Wallet actions: FALSE" "$DOC"
grep -q "Transaction broadcast: FALSE" "$DOC"

jq -e '
  .index == "OINIO_LOCAL_OBSERVER_EVIDENCE_INDEX_V1" and
  .status == "VERIFIED" and
  .old_resonance_worker_reuse == false and
  .owned_qpf_source_only == true and
  .network_send == false and
  .all_irreversible_flags_locked_false == true and
  .live_execution == false and
  .private_key_present == false and
  .wallet_actions == false and
  .signing_attempted == false and
  .transaction_broadcast == false and
  .repo_mutation_by_observer == false and
  (.local_observer_design_plan_sha256 | type == "string" and length == 64) and
  (.local_observer_spec_sha256 | type == "string" and length == 64)
' "$RECEIPT" >/dev/null

echo "PASS oinio-local-observer-evidence-index-v1"
echo "OLD_RESONANCE_WORKER_REUSE false"
echo "OWNED_QPF_SOURCE_ONLY true"
echo "NETWORK_SEND false"
echo "LIVE_EXECUTION false"
echo "PRIVATE_KEY_PRESENT false"
echo "WALLET_ACTIONS false"
echo "SIGNING_ATTEMPTED false"
echo "TRANSACTION_BROADCAST false"
echo "DOC $DOC"
echo "RECEIPT $RECEIPT"
