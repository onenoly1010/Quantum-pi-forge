#!/usr/bin/env bash
set -euo pipefail

PROPOSAL="$1"
LOG="/var/log/guardian/gate.log"
PUBLIC_KEY="/etc/guardian/cosign.pub"

echo "=== GATE EXECUTION START ===" | tee -a "$LOG"

# 1. Quorum decision
RESULT=$(./quorum/engine.sh)
if [[ "$RESULT" != "APPROVE" ]]; then
  echo "❌ Quorum rejected execution" | tee -a "$LOG"
  exit 1
fi

# 2. Extract deterministic execution target
IMAGE_DIGEST=$(jq -r '.image_digest' "$PROPOSAL")
if [[ -z "$IMAGE_DIGEST" || "$IMAGE_DIGEST" == "null" ]]; then
  echo "❌ Missing image digest" | tee -a "$LOG"
  exit 1
fi

# 3. Cosign verification (local, air-gapped)
if ! cosign verify --key "$PUBLIC_KEY" "$IMAGE_DIGEST" > /dev/null 2>&1; then
  echo "❌ Cosign signature verification failed" | tee -a "$LOG"
  exit 1
fi
echo "✔ Cosign signature valid" | tee -a "$LOG"

# 4. Pull and run
docker pull "$IMAGE_DIGEST"
docker run --rm "$IMAGE_DIGEST"

echo "✅ Execution completed successfully" | tee -a "$LOG"

# Trigger Telemetry Update
/usr/local/bin/sidewinder.sh
