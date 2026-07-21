#!/usr/bin/env bash
# Read-only cast-based Safe hygiene (multi-chain). No keys, no signing.
set -euo pipefail

export PATH="${HOME}/.foundry/bin:${PATH}"
MIN_SECURE="${MIN_SECURE_THRESHOLD:-2}"
RPC_0G="${RPC_URL_0G:-https://evmrpc.0g.ai}"
RPC_ETH="${RPC_URL_ETH:-https://ethereum.publicnode.com}"

# network|address|label
SAFES=(
  "aristotle|0x8d088B88219D072aB035502065ee2410c2cb4389|guardian-prominent-0g"
  "aristotle|0xf50FeE9d77f5161581A47f48874fB3f99a9EDBd1|operator-f50f-0g"
  "aristotle|0xF69bA0dDAa323B07F57Fb02e0835391ba9DD08DE|trezor-f69-0g"
  "ethereum|0xF69bA0dDAa323B07F57Fb02e0835391ba9DD08DE|trezor-f69-eth"
)

if [[ -n "${SAFE_ADDRESS:-}" ]]; then
  net="${NETWORK:-aristotle}"
  SAFES=("${net}|${SAFE_ADDRESS}|env")
fi

if ! command -v cast >/dev/null 2>&1; then
  echo "cast not found; install foundry or use: npm run inspect"
  exit 1
fi

rpc_for() {
  case "$1" in
    aristotle|0g|og) echo "$RPC_0G" ;;
    ethereum|eth|mainnet) echo "$RPC_ETH" ;;
    *) echo "$RPC_0G" ;;
  esac
}

echo "=== QPF Safe cast diagnostic (READ ONLY, multi-chain) ==="
echo "minSecureThreshold: ${MIN_SECURE}"
echo

weak=0
for entry in "${SAFES[@]}"; do
  IFS='|' read -r net addr label <<<"$entry"
  if [[ -n "${NETWORK:-}" && "$net" != "$NETWORK" ]]; then
    continue
  fi
  rpc=$(rpc_for "$net")
  echo "--- ${label} ---"
  echo "Network: ${net}"
  echo "RPC: ${rpc}"
  echo "Address: ${addr}"
  thr=$(cast call "$addr" "getThreshold()(uint256)" --rpc-url "$rpc" 2>/dev/null || echo "ERR")
  owners=$(cast call "$addr" "getOwners()(address[])" --rpc-url "$rpc" 2>/dev/null || echo "ERR")
  nonce=$(cast call "$addr" "nonce()(uint256)" --rpc-url "$rpc" 2>/dev/null || echo "ERR")
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
  echo "Note: eth: and aristotle instances are independent."
  exit 2
fi
echo "Result: all inspected Safes meet minSecureThreshold=${MIN_SECURE}"
