#!/usr/bin/env bash
set -euo pipefail

DEPLOY_DIR="${1:-out}"

CANONICAL_CONTRACT="0x07f43E5B1A8a0928B364E40d5885f81A543B05C7"

FORBIDDEN_PATTERNS=(
  "localhost:8788"
  "localhost"
  "127\.0\.0\.1"
  "testnet"
  "devnet"
  "staging"
  "demo-mode"
  "fake"
  "rpc-testnet\.0g\.ai"
)

echo "=== Quantum Pi Forge production frontend sweep ==="
echo "Deploy dir: $DEPLOY_DIR"
echo "Canonical contract: $CANONICAL_CONTRACT"
echo

if [ ! -d "$DEPLOY_DIR" ]; then
  echo "❌ Deploy directory not found: $DEPLOY_DIR"
  exit 1
fi

echo "=== forbidden frontend string sweep ==="
for pattern in "${FORBIDDEN_PATTERNS[@]}"; do
  if find "$DEPLOY_DIR" \
      -type f \( -name "*.html" -o -name "*.js" -o -name "*.json" -o -name "*.css" \) \
      -not -path "$DEPLOY_DIR/run-guardian.sh" \
      -print0 \
    | xargs -0 grep -InE "$pattern" 2>/dev/null; then
    echo
    echo "❌ Forbidden production frontend string found: $pattern"
    exit 1
  fi
done

echo "✅ No forbidden frontend environment strings found."
echo

echo "=== contract address sweep ==="
ADDRESSES="$(
  find "$DEPLOY_DIR" \
    -type f \( -name "*.html" -o -name "*.js" -o -name "*.json" -o -name "*.css" \) \
    -print0 \
  | xargs -0 grep -ohE '0x[0-9a-fA-F]{40}' 2>/dev/null \
  | sort -u || true
)"

if [ -z "$ADDRESSES" ]; then
  echo "⚠️  No EVM-style contract addresses found in built frontend."
else
  echo "$ADDRESSES"

  BAD_ADDRESSES="$(
    echo "$ADDRESSES" | grep -vFx "$CANONICAL_CONTRACT" | grep -vFx "0x0000000000000000000000000000000000000000" || true
  )"

  if [ -n "$BAD_ADDRESSES" ]; then
    echo
    echo "❌ Non-canonical contract address(es) found:"
    echo "$BAD_ADDRESSES"
    exit 1
  fi

  echo "✅ Only canonical contract address found."
fi

echo
echo "✅ Production frontend sweep passed."
