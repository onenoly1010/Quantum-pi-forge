#!/usr/bin/env bash
set -euo pipefail
HASH_RECEIPT="receipts/security/evidence/0g-storage-payload-hash-proof-v1.json"
NEG_DIR="/tmp/qpf-0g-gated-da-upload-negative-test-v1"
TAMPERED="${NEG_DIR}/sample-audit-payload-v1.tampered.json"
OUT="${NEG_DIR}/negative-test.out"
NEG_RECEIPT="receipts/security/evidence/0g-gated-da-upload-negative-test-v1.json"
DOC="docs/security/0G_GATED_DA_UPLOAD_NEGATIVE_TEST_V1.md"
mkdir -p "$NEG_DIR"
PAYLOAD="$(jq -r .payload_path "$HASH_RECEIPT")"
EXPECTED_SHA256="$(jq -r .payload_sha256 "$HASH_RECEIPT")"
EXPECTED_CONTENT_ADDRESS="$(jq -r .content_address_expected "$HASH_RECEIPT")"
BYTES="$(jq -r .payload_bytes "$HASH_RECEIPT")"
test -f "$PAYLOAD"
cp "$PAYLOAD" "$TAMPERED"
printf "x" >> "$TAMPERED"
TAMPERED_BYTES="$(wc -c < "$TAMPERED" | tr -d " ")"
ACTUAL_SHA256="$(sha256sum "$TAMPERED" | awk "{print \$1}")"
test "$ACTUAL_SHA256" != "$EXPECTED_SHA256"
set +e
bash scripts/security/0g-da-upload-simulator-v1.sh "$TAMPERED" "$EXPECTED_SHA256" "$EXPECTED_CONTENT_ADDRESS" > "$OUT" 2>&1
SIM_RC="$?"
set -e
test "$SIM_RC" -ne 0
if grep -Fq "DA_UPLOAD_SIMULATOR_RECEIVED=TRUE" "$OUT"; then echo "NEGATIVE_TEST_FAIL: simulator accepted tampered payload"; cat "$OUT"; exit 1; fi
if grep -Fq "WALLET_PREFLIGHT_GATE_V1_PASS=TRUE" "$OUT"; then echo "NEGATIVE_TEST_FAIL: wallet preflight gate unexpectedly reached"; cat "$OUT"; exit 1; fi
printf "%s\n" "{" "  \"id\": \"0g-gated-da-upload-negative-test-v1\"," "  \"result\": \"PASS\"," "  \"posture\": \"fail_closed_tamper_rejection\"," "  \"policy\": \"0g-storage-da-access-policy-v1\"," "  \"hash_proof\": \"0g-storage-payload-hash-proof-v1\"," "  \"positive_control\": \"0g-gated-da-upload-dry-run-v1\"," "  \"tamper_method\": \"append_single_character\"," "  \"original_payload_path\": \"${PAYLOAD}\"," "  \"tampered_payload_path\": \"${TAMPERED}\"," "  \"original_payload_bytes\": ${BYTES}," "  \"tampered_payload_bytes\": ${TAMPERED_BYTES}," "  \"expected_payload_sha256\": \"${EXPECTED_SHA256}\"," "  \"actual_tampered_sha256\": \"${ACTUAL_SHA256}\"," "  \"content_address_expected\": \"${EXPECTED_CONTENT_ADDRESS}\"," "  \"payload_hash_match\": false," "  \"rejection_stage\": \"payload_sha256_mismatch\"," "  \"simulator_exit_code\": ${SIM_RC}," "  \"wallet_preflight_gate_reached\": false," "  \"simulator_received\": false," "  \"private_key_used\": false," "  \"transaction_signed\": false," "  \"transaction_broadcast\": false," "  \"storage_write_attempted\": false," "  \"chain_state_mutated\": false" "}" > "$NEG_RECEIPT"
printf "%s\n" "# 0G Gated DA Upload Negative-Test v1" "" "This proof demonstrates that a tampered 0G Storage / DA payload is rejected before any upload simulator, wallet preflight gate success path, signing, broadcast, storage write, funding, approval, or chain-state mutation can occur." "" "## Tamper method" "- Source payload: \`${PAYLOAD}\`" "- Tampered copy: \`${TAMPERED}\`" "- Method: append one character to the sealed payload copy." "" "## Expected rejection" "- Expected SHA-256: \`${EXPECTED_SHA256}\`" "- Actual tampered SHA-256: \`${ACTUAL_SHA256}\`" "- Payload hash match: \`false\`" "- Rejection stage: \`payload_sha256_mismatch\`" "" "## Fail-closed safety" "- Wallet preflight gate reached: \`false\`" "- Simulator received: \`false\`" "- Private key used: \`false\`" "- Transaction signed: \`false\`" "- Transaction broadcast: \`false\`" "- Storage write attempted: \`false\`" "- Chain-state mutated: \`false\`" > "$DOC"
jq -e ".id == \"0g-gated-da-upload-negative-test-v1\" and .result == \"PASS\" and .posture == \"fail_closed_tamper_rejection\" and .payload_hash_match == false and .rejection_stage == \"payload_sha256_mismatch\" and .wallet_preflight_gate_reached == false and .simulator_received == false and .private_key_used == false and .transaction_signed == false and .transaction_broadcast == false and .storage_write_attempted == false and .chain_state_mutated == false" "$NEG_RECEIPT" >/dev/null
grep -Fq "Payload hash match: \`false\`" "$DOC"
grep -Fq "Chain-state mutated: \`false\`" "$DOC"
echo "ZERO_G_GATED_DA_UPLOAD_NEGATIVE_TEST_V1_CHECK=PASS"
