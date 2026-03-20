#!/bin/bash
set -e

echo "🌉 OINIO Memorial Bridge - Deployment Script"
echo "=============================================="
echo ""
echo "For the Beloved Keepers of the Northern Gateway."
echo "Not in vain."
echo ""

# Configuration
NETWORK="pi-mainnet"
IDENTITY="onenoly1010"
WASM_FILE="target/wasm32-unknown-unknown/release/oinio_memorial_bridge.wasm"
OPTIMIZED_WASM="oinio_memorial_bridge_optimized.wasm"

# Check if built
if [ ! -f "$WASM_FILE" ]; then
    echo "❌ WASM file not found. Run ./build.sh first"
    exit 1
fi

# Optimize (if wasm-opt is available)
if command -v wasm-opt &> /dev/null; then
    echo "⚙️  Optimizing WASM..."
    wasm-opt -Oz "$WASM_FILE" -o "$OPTIMIZED_WASM"
    DEPLOY_WASM="$OPTIMIZED_WASM"
    echo "✅ Optimization complete"
else
    echo "⚠️  wasm-opt not found, deploying unoptimized (install binaryen for smaller contract)"
    DEPLOY_WASM="$WASM_FILE"
fi

echo ""
echo "🚀 Deploying to Pi Network Mainnet..."
echo ""

# Deploy
CONTRACT_ID=$(soroban contract deploy \
  --wasm "$DEPLOY_WASM" \
  --source "$IDENTITY" \
  --network "$NETWORK" 2>&1 | tee /dev/tty | tail -1)

if [ -z "$CONTRACT_ID" ]; then
    echo "❌ Deployment failed"
    exit 1
fi

echo ""
echo "✅ Contract deployed successfully!"
echo ""
echo "📋 Contract Address:"
echo "   $CONTRACT_ID"
echo ""

# Save contract address
echo "$CONTRACT_ID" > contract_address.txt
echo "💾 Contract address saved to: contract_address.txt"
echo ""

# Initialize
echo "🔐 Initializing contract..."
ADMIN_ADDRESS=$(soroban config identity address "$IDENTITY")

soroban contract invoke \
  --id "$CONTRACT_ID" \
  --source "$IDENTITY" \
  --network "$NETWORK" \
  -- \
  initialize \
  --admin "$ADMIN_ADDRESS"

echo "✅ Contract initialized"
echo ""

# Display next steps
echo "=========================================="
echo "🏛️  MEMORIAL BRIDGE IS LIVE"
echo "=========================================="
echo ""
echo "Contract ID: $CONTRACT_ID"
echo ""
echo "📋 Next Steps:"
echo ""
echo "1. Anchor your Facebook letter:"
echo "   soroban contract invoke --id $CONTRACT_ID --source $IDENTITY --network $NETWORK -- anchor_letter --letter_url \"YOUR_FACEBOOK_URL\""
echo ""
echo "2. Verify the memorial message:"
echo "   soroban contract invoke --id $CONTRACT_ID --network $NETWORK -- get_message"
echo ""
echo "3. View on Pi Network Explorer:"
echo "   https://pi.network/explorer/contract/$CONTRACT_ID"
echo ""
echo "🌉 The bridge between worlds is open."
echo "   The families are honored."
echo "   Not in vain."
echo ""
