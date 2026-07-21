#!/usr/bin/env bash
# Read-only cast-based Safe hygiene (no keys, no signing).
# Prefer this when Node deps are unavailable or for air-gapped terminal AI tools.
set -euo pipefail

export PATH="${HOME}/.foundry/bin:${PATH}"
RPC_URL="${RPC_URL:-https://evmrpc.0g.ai}"
MIN_SECURE="${MIN_SECURE_THRESHOLD:-2}"

SAFES=(
  "0x8d088B88219D072aB035502065ee2410c2cb4389|guardian-prominent"
  "0xf50FeE9d77f5161581A47f48874fB3f99a9EDBd1|operator-f50f"
  "0xF69bA0dDAa323B07F57Fb02e0835391ba9DD08DE|trezor-f69"
)

if [[ -n "${SAFE_ADDRESS:-}" ]]; then
  SAFES=("${SAFE_ADDRESS}|env")
fi

if ! command -v cast >/dev/null 2>&1; then
  echo "cast not found; install foundry or use: npm run inspect"
  exit 1
fi

echo "=== QPF Safe cast diagnostic (READ ONLY) ==="
echo "RPC: ${RPC_URL}"
echo "minSecureThreshold: ${MIN_SECURE}"
echo

weak=0
for entry in "${SAFES[@]}"; do
  addr="${entry%%|*}"
  label="${entry##*|}"
  echo "--- ${label} ---"
  echo "Address: ${addr}"
  thr=$(cast call "$addr" "getThreshold()(uint256)" --rpc-url "$RPC_URL" 2>/dev/null || echo "ERR")
  owners=$(cast call "$addr" "getOwners()(address[])" --rpc-url "$RPC_URL" 2>/dev/null || echo "ERR")
  nonce=$(cast call "$addr" "nonce()(uint256)" --rpc-url "$RPC_URL" 2>/dev/null || echo "ERR")
  echo "Threshold: ${thr}"
  echo "Owners: ${owners}"
  echo "Nonce: ${nonce}"
  if [[ "$thr" =~ ^[0-9]+$ ]] && (( thr < MIN_SECURE )); then
    echo "Hygiene: WEAK (threshold < ${MIN_SECURE})"
    weak=1
  elif [[ "$thr" =~ ^[0-9]+$ ]]; then
    echo "Hygiene: OK (threshold >= ${MIN_SECURE})"
  else
    echo "Hygiene: ERROR (could not read)"
    weak=1
  fi
  echo
done

if (( weak == 1 )); then
  echo "Result: WEAK Safes present — do not sign pending queue on those accounts."
  exit 2
fi
echo "Result: all inspected Safes meet minSecureThreshold=${MIN_SECURE}"
