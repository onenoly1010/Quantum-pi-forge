#!/usr/bin/env bash
set -euo pipefail

IMAGE_DIGEST="$1"
PRIVATE_KEY="${COSIGN_PRIVATE_KEY_FILE:-./cosign.key}"

cosign sign --key "$PRIVATE_KEY" "$IMAGE_DIGEST"
echo "✅ Signed $IMAGE_DIGEST"