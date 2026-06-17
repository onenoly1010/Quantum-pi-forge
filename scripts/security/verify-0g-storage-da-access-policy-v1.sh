#!/usr/bin/env bash
set -euo pipefail
jq -e '.id == "0g-storage-da-access-policy-v1" and .posture == "non_executing_storage_da_mapping" and .chain_id == 16661 and .wallet_preflight_gate_required == true and .private_key_used == false and .transaction_signed == false and .transaction_broadcast == false and .storage_write_attempted == false and .chain_state_mutated == false' receipts/security/evidence/0g-storage-da-access-policy-v1.json >/dev/null
grep -Fq 'Required gate: `scripts/security/wallet-preflight-gate-v1.sh`' docs/security/0G_STORAGE_DA_ACCESS_POLICY_V1.md
grep -Fq 'No direct storage upload without wallet preflight gate.' docs/security/0G_STORAGE_DA_ACCESS_POLICY_V1.md
echo "ZERO_G_STORAGE_DA_ACCESS_POLICY_V1_CHECK=PASS"
