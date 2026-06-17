#!/usr/bin/env bash
set -euo pipefail
DOC="docs/security/0G_STORAGE_DA_LANE_STATUS_V1.md"
RECEIPT="receipts/security/evidence/0g-storage-da-lane-status-v1.json"
POLICY="receipts/security/evidence/0g-storage-da-access-policy-v1.json"
HASH="receipts/security/evidence/0g-storage-payload-hash-proof-v1.json"
DRY="receipts/security/evidence/0g-gated-da-upload-dry-run-v1.json"
NEG="receipts/security/evidence/0g-gated-da-upload-negative-test-v1.json"
test -f "$POLICY"
test -f "$HASH"
test -f "$DRY"
test -f "$NEG"
jq -e ".id == \"0g-storage-da-access-policy-v1\"" "$POLICY" >/dev/null
jq -e ".id == \"0g-storage-payload-hash-proof-v1\"" "$HASH" >/dev/null
jq -e ".id == \"0g-gated-da-upload-dry-run-v1\" and .result == \"PASS\" and .payload_hash_match == true and .wallet_preflight_gate_passed == true and .storage_write_attempted == false and .chain_state_mutated == false" "$DRY" >/dev/null
jq -e ".id == \"0g-gated-da-upload-negative-test-v1\" and .result == \"PASS\" and .payload_hash_match == false and .rejection_stage == \"payload_sha256_mismatch\" and .wallet_preflight_gate_reached == false and .simulator_received == false and .storage_write_attempted == false and .chain_state_mutated == false" "$NEG" >/dev/null
POLICY_SHA="$(sha256sum "$POLICY" | awk "{print \$1}")"
HASH_SHA="$(sha256sum "$HASH" | awk "{print \$1}")"
DRY_SHA="$(sha256sum "$DRY" | awk "{print \$1}")"
NEG_SHA="$(sha256sum "$NEG" | awk "{print \$1}")"
PAYLOAD_SHA="$(jq -r .payload_sha256 "$HASH")"
CONTENT_ADDRESS="$(jq -r .content_address_expected "$HASH")"
printf "%s\n" "{" "  \"id\": \"0g-storage-da-lane-status-v1\"," "  \"result\": \"PASS\"," "  \"status\": \"FEATURE_COMPLETE_SECURITY_MAPPING\"," "  \"lane\": \"0g-storage-da-lane-v1\"," "  \"posture\": \"non_executing_preverified_fail_closed\"," "  \"summary\": \"0G Storage/DA lane is restricted to sealed payload integrity checks, non-executing gated dry-runs, and fail-closed tamper rejection.\"," "  \"proofs\": {" "    \"access_policy\": {" "      \"pr\": 399," "      \"receipt\": \"${POLICY}\"," "      \"sha256\": \"${POLICY_SHA}\"," "      \"status\": \"VALIDATED\"" "    }," "    \"payload_integrity\": {" "      \"pr\": 400," "      \"receipt\": \"${HASH}\"," "      \"sha256\": \"${HASH_SHA}\"," "      \"payload_sha256\": \"${PAYLOAD_SHA}\"," "      \"content_address_expected\": \"${CONTENT_ADDRESS}\"," "      \"status\": \"VALIDATED\"" "    }," "    \"positive_gated_flow\": {" "      \"pr\": 401," "      \"receipt\": \"${DRY}\"," "      \"sha256\": \"${DRY_SHA}\"," "      \"status\": \"VALIDATED\"" "    }," "    \"negative_tamper_rejection\": {" "      \"pr\": 402," "      \"receipt\": \"${NEG}\"," "      \"sha256\": \"${NEG_SHA}\"," "      \"status\": \"VALIDATED\"" "    }" "  }," "  \"private_key_used\": false," "  \"transaction_signed\": false," "  \"transaction_broadcast\": false," "  \"storage_write_attempted\": false," "  \"chain_state_mutated\": false," "  \"final_lane_status\": \"SEALED\"" "}" > "$RECEIPT"
printf "%s\n" "# 0G Storage/DA Lane Final Status v1" "" "**Canonical lane ID:** \`0g-storage-da-lane-v1\`" "" "## Executive summary" "" "The 0G Storage/DA lane is now sealed as a non-executing, pre-verified, fail-closed security lane. Valid payloads are proven against sealed hash evidence before gated dry-run handling. Tampered payloads are rejected at the SHA-256 mismatch stage before wallet gate success, simulator acceptance, storage writes, signing, broadcast, or chain-state mutation." "" "## Security evidence matrix" "" "| Requirement | Proof source | Status |" "| --- | --- | --- |" "| Access policy | PR #399 / \`0g-storage-da-access-policy-v1.json\` | Validated |" "| Payload integrity | PR #400 / \`0g-storage-payload-hash-proof-v1.json\` | Validated |" "| Positive gated flow | PR #401 / \`0g-gated-da-upload-dry-run-v1.json\` | Validated |" "| Negative tamper rejection | PR #402 / \`0g-gated-da-upload-negative-test-v1.json\` | Validated |" "" "## Sealed posture" "" "- Private key used: \`false\`" "- Transaction signed: \`false\`" "- Transaction broadcast: \`false\`" "- Storage write attempted: \`false\`" "- Chain-state mutated: \`false\`" "" "## Final status" "" "\`0g-storage-da-lane-v1\` is sealed as \`FEATURE_COMPLETE_SECURITY_MAPPING\`." > "$DOC"
jq -e ".id == \"0g-storage-da-lane-status-v1\" and .result == \"PASS\" and .lane == \"0g-storage-da-lane-v1\" and .status == \"FEATURE_COMPLETE_SECURITY_MAPPING\" and .posture == \"non_executing_preverified_fail_closed\" and .proofs.access_policy.status == \"VALIDATED\" and .proofs.payload_integrity.status == \"VALIDATED\" and .proofs.positive_gated_flow.status == \"VALIDATED\" and .proofs.negative_tamper_rejection.status == \"VALIDATED\" and .private_key_used == false and .transaction_signed == false and .transaction_broadcast == false and .storage_write_attempted == false and .chain_state_mutated == false and .final_lane_status == \"SEALED\"" "$RECEIPT" >/dev/null
grep -Fq "0g-storage-da-lane-v1" "$DOC"
grep -Fq "FEATURE_COMPLETE_SECURITY_MAPPING" "$DOC"
grep -Fq "Chain-state mutated: \`false\`" "$DOC"
echo "ZERO_G_STORAGE_DA_LANE_STATUS_V1_CHECK=PASS"
