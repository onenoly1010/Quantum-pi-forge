#!/bin/bash

# =============================================================================
# Deployment Script for 0G Uniswap V2 Fork
# =============================================================================
# This script handles the complete deployment process with safety checks
# Usage: ./scripts/deploy.sh [--resume]
# =============================================================================

set -e  # Exit on error

echo "=========================================="
echo "0G Uniswap V2 Fork - Deployment Script"
echo "=========================================="
echo ""

# Navigate to project directory
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_DIR"

# Load environment variables
if [ ! -f ".env" ]; then
    echo "❌ .env file not found!"
    echo "Please create .env from .env.example and configure it"
    exit 1
fi

source .env

# Validate required environment variables
echo "🔍 Validating environment configuration..."

if [ -z "$PRIVATE_KEY" ]; then
    echo "❌ PRIVATE_KEY not set in .env"
    exit 1
fi

if [ -z "$DEPLOYER" ]; then
    echo "❌ DEPLOYER not set in .env"
    exit 1
fi

if [ -z "$RPC_URL" ]; then
    echo "❌ RPC_URL not set in .env"
    exit 1
fi

if [ -z "$FEE_TO_SETTER" ]; then
    echo "⚠️  FEE_TO_SETTER not set, using DEPLOYER address"
    FEE_TO_SETTER=$DEPLOYER
fi

echo "✅ Environment configuration validated"
echo ""

# Pre-flight checks
echo "🔍 Running pre-flight checks..."

# Check RPC connectivity
echo "   Testing RPC connectivity..."
EXPECTED_CHAIN_ID="0x4115"  # 16661 in hex for 0G Aristotle
RPC_CHECK=$(curl -s -X POST "$RPC_URL" \
    -H "Content-Type: application/json" \
    -d '{"jsonrpc":"2.0","method":"eth_chainId","params":[],"id":1}' | grep -o "\"result\":\"$EXPECTED_CHAIN_ID\"")

if [ -z "$RPC_CHECK" ]; then
    echo "❌ Failed to connect to 0G RPC endpoint or chain ID mismatch"
    echo "   Please verify RPC_URL in .env: $RPC_URL"
    echo "   Expected Chain ID: $EXPECTED_CHAIN_ID (16661)"
    exit 1
fi
echo "   ✅ RPC connectivity: OK"

# Check deployer balance
echo "   Checking deployer balance..."
BALANCE_HEX=$(curl -s -X POST "$RPC_URL" \
    -H "Content-Type: application/json" \
    -d "{\"jsonrpc\":\"2.0\",\"method\":\"eth_getBalance\",\"params\":[\"$DEPLOYER\",\"latest\"],\"id\":1}" \
    | grep -o '"result":"[^"]*"' | cut -d'"' -f4)

if [ -z "$BALANCE_HEX" ]; then
    echo "⚠️  Could not verify balance, proceeding anyway..."
else
    # Convert hex to decimal (simplified check)
    BALANCE_WEI=$(printf "%d" $BALANCE_HEX 2>/dev/null || echo "0")
    MIN_BALANCE_WEI=500000000000000000  # 0.5 0G in wei
    
    if [ "$BALANCE_WEI" -lt "$MIN_BALANCE_WEI" ]; then
        echo "❌ Insufficient balance for deployment"
        echo "   Current: ${BALANCE_WEI} wei"
        echo "   Required: ${MIN_BALANCE_WEI} wei (0.5 0G minimum)"
        exit 1
    fi
    echo "   ✅ Deployer balance: OK"
fi

echo "✅ All pre-flight checks passed"
echo ""

# Check if this is a resume operation
RESUME_FLAG=""
if [ "$1" == "--resume" ]; then
    echo "📝 Resuming deployment (Router02 only)..."
    RESUME_FLAG="--resume"
fi

# Build contracts
echo "🔨 Building contracts..."
forge build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix compilation errors."
    exit 1
fi
echo "✅ Build successful"
echo ""

# Prepare deployment command
DEPLOY_CMD="forge script script/Deploy.s.sol:Deploy \
    --rpc-url $RPC_URL \
    --private-key $PRIVATE_KEY \
    --broadcast \
    --legacy"

# Add verification flag if enabled
if [ "${VERIFY:-true}" == "true" ] && [ -n "$ETHERSCAN_API_KEY" ]; then
    DEPLOY_CMD="$DEPLOY_CMD --verify --etherscan-api-key $ETHERSCAN_API_KEY"
    echo "🔍 Contract verification enabled"
fi

# Execute deployment
echo ""
echo "🚀 Starting deployment to 0G Aristotle Mainnet..."
echo "   Chain ID: 16661"
echo "   RPC: $RPC_URL"
echo "   Deployer: $DEPLOYER"
echo "   Fee To Setter: $FEE_TO_SETTER"
echo ""
echo "⏳ This may take a few minutes..."
echo ""

# Run deployment
eval $DEPLOY_CMD

# Check deployment result
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Deployment completed successfully!"
    echo ""
    echo "=========================================="
    echo "Post-Deployment Instructions"
    echo "=========================================="
    echo ""
    echo "1. Check the deployment logs above for:"
    echo "   - W0G address"
    echo "   - Factory address"
    echo "   - PAIR_INIT_CODE_HASH"
    echo ""
    echo "2. If deploying Router02 next:"
    echo "   a. Update lib/v2-periphery/contracts/libraries/UniswapV2Library.sol"
    echo "   b. Replace the init code hash in pairFor() function"
    echo "   c. Run: forge build"
    echo "   d. Run: ./scripts/deploy.sh --resume"
    echo ""
    echo "3. Save addresses to .env.launch for Pi Forge integration"
    echo ""
    echo "4. Run post-deployment validation:"
    echo "   ./scripts/post-deploy.sh"
    echo ""
else
    echo ""
    echo "❌ Deployment failed. Please check errors above."
    exit 1
fi
