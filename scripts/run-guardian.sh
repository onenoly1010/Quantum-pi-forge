#!/bin/bash

PRIVATE_KEY=$1

if [ -z "$PRIVATE_KEY" ]; then
  echo "Usage: ./run-guardian.sh <private-key>"
  exit 1
fi

CONFIG=$(cat public/FORGE_REGISTRY_MANIFEST.json)

ADDRESS=$(echo $CONFIG | jq -r '.contractAddress')

RPC="https://evmrpc-testnet.0g.ai"

echo "🚀 Registering guardian..."

cast send $ADDRESS "register()" \
  --private-key $PRIVATE_KEY \
  --rpc-url $RPC

echo "✅ Done"