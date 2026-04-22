#!/bin/bash
set -euo pipefail

VALIDATION_HASH=$1
PR_NUMBER=$2
COMMIT_SHA=$3

ATT_DIR="canon/attestations"
ATT_FILE="${ATT_DIR}/${PR_NUMBER}-${COMMIT_SHA}.json"

mkdir -p "${ATT_DIR}"

cat > "${ATT_FILE}" <<EOF
{
  "pr_number": "${PR_NUMBER}",
  "commit_sha": "${COMMIT_SHA}",
  "validation_hash": "${VALIDATION_HASH}",
  "timestamp": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "version": "1.0"
}
EOF

# Generate detached signature if GPG is configured
if command -v gpg > /dev/null; then
  gpg --batch --yes --armor --detach-sign "${ATT_FILE}" 2>/dev/null || true
fi

echo "Created attestation: ${ATT_FILE}"