#!/bin/bash
set -euo pipefail
export DEPLOYER_KEY="${DEPLOYER_KEY:-}"
if [ -z "$DEPLOYER_KEY" ]; then
  echo "ERROR: DEPLOYER_KEY is not set."
  echo "Run: export DEPLOYER_KEY='0xYOUR_PRIVATE_KEY_HERE'"
  exit 1
fi
cd "$(dirname "$0")/../contracts"
forge script script/DeployYieldRouter.s.sol:DeployYieldRouter \
  --rpc-url https://evmrpc.0g.ai \
  --slow \
  --gas-estimate-multiplier 200 \
  --broadcast