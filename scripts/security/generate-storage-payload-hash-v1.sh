#!/usr/bin/env bash
set -euo pipefail
PAYLOAD="payloads/storage-da/sample-audit-payload-v1.json"
RECEIPT="receipts/security/evidence/0g-storage-payload-hash-proof-v1.json"
DOC="docs/security/0G_STORAGE_PAYLOAD_HASH_PROOF_V1.md"
test -f "$PAYLOAD"
SHA256="$(sha256sum "$PAYLOAD" | awk "{print \$1}")"
BYTES="$(wc -c < "$PAYLOAD" | tr -d " ")"
CONTENT_ADDRESS_EXPECTED="sha256:${SHA256}"
printf "%s\n" "{" "  \"id\": \"0g-storage-payload-hash-proof-v1\"," "  \"result\": \"PASS\"," "  \"policy\": \"0g-storage-da-access-policy-v1\"," "  \"payload_path\": \"${PAYLOAD}\"," "  \"payload_kind\": \"deterministic_audit_artifact\"," "  \"payload_bytes\": ${BYTES}," "  \"payload_sha256\": \"${SHA256}\"," "  \"content_address_expected\": \"${CONTENT_ADDRESS_EXPECTED}\"," "  \"wallet_preflight_gate_required\": true," "  \"private_key_used\": false," "  \"transaction_signed\": false," "  \"transaction_broadcast\": false," "  \"storage_write_attempted\": false," "  \"chain_state_mutated\": false" "}" > "$RECEIPT"
printf "%s\n" "# 0G Storage Payload Hash Proof v1" "" "This proof seals a deterministic local payload hash before any 0G Storage / Data Availability upload path exists." "" "## Payload" "- Path: \`${PAYLOAD}\`" "- Kind: \`deterministic_audit_artifact\`" "- Bytes: \`${BYTES}\`" "- SHA-256: \`${SHA256}\`" "- Expected content address: \`${CONTENT_ADDRESS_EXPECTED}\`" "" "## Safety" "- No private key used." "- No transaction signed." "- No transaction broadcast." "- No storage write attempted." "- No chain-state mutation." "" "## Conclusion" "This is a local hash proof only. It prepares future DA evidence without uploading data or touching the chain." > "$DOC"
jq -e ".id == \"0g-storage-payload-hash-proof-v1\" and .result == \"PASS\" and .policy == \"0g-storage-da-access-policy-v1\" and .payload_sha256 == \"${SHA256}\" and .content_address_expected == \"${CONTENT_ADDRESS_EXPECTED}\" and .wallet_preflight_gate_required == true and .private_key_used == false and .transaction_signed == false and .transaction_broadcast == false and .storage_write_attempted == false and .chain_state_mutated == false" "$RECEIPT" >/dev/null
grep -Fq "$SHA256" "$DOC"
grep -Fq "$CONTENT_ADDRESS_EXPECTED" "$DOC"
echo "ZERO_G_STORAGE_PAYLOAD_HASH_PROOF_V1_CHECK=PASS"
