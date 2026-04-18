#!/usr/bin/env bash
# OINIO Quorum Aggregator
set -euo pipefail

mkdir -p proposals
mkdir -p /var/lib/guardian/proposals

LAST_HASH_FILE="./local/etc/guardian/last_proposal.hash"
mkdir -p "$(dirname "$LAST_HASH_FILE")"

# Initialize genesis chain if not exists
if [[ ! -f "$LAST_HASH_FILE" ]]; then
    echo "sha256:0000000000000000000000000000000000000000000000000000000000000000" > "$LAST_HASH_FILE"
fi

LAST_HASH=$(cat "$LAST_HASH_FILE")

VALID_COUNT=0
VALID_PROPOSAL=""

for proposal in proposals/*.json 2>/dev/null; do
    [[ -f "$proposal" ]] || continue

    PREV_HASH=$(jq -r '.prev_proposal_hash' "$proposal" 2>/dev/null || echo "")

    if [[ "$PREV_HASH" != "$LAST_HASH" ]]; then
        echo "❌ Rejecting $proposal – does not extend current chain"
        rm "$proposal"
        continue
    fi

    # Signature verification would go here
    VALID_COUNT=$((VALID_COUNT + 1))
    VALID_PROPOSAL="$proposal"
done

if [[ $VALID_COUNT -eq 1 ]]; then
    echo "APPROVE"
    echo "$VALID_PROPOSAL"
    exit 0
else
    echo "REJECT"
    exit 1
fi