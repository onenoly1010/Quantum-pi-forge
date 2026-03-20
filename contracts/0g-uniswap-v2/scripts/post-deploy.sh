#!/bin/bash

# =============================================================================
# Post-Deployment Script for 0G Uniswap V2 Fork
# =============================================================================
# This script performs post-deployment validation and setup
# Usage: ./scripts/post-deploy.sh
# =============================================================================

set -e  # Exit on error

echo "================================================"
echo "0G Uniswap V2 Fork - Post-Deployment Script"
echo "================================================"
echo ""

# Navigate to project directory
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_DIR"

# Load environment variables
if [ ! -f ".env" ]; then
    echo "❌ .env file not found!"
    exit 1
fi

source .env

# Check if .env.launch exists
if [ ! -f ".env.launch" ]; then
    echo "❌ .env.launch not found!"
    echo "Please create .env.launch with deployed contract addresses:"
    echo ""
    echo "ZERO_G_W0G=<address>"
    echo "ZERO_G_FACTORY=<address>"
    echo "ZERO_G_UNIVERSAL_ROUTER=<address>"
    echo ""
    exit 1
fi

source .env.launch

echo "📋 Loaded deployment addresses:"
echo "   W0G: $ZERO_G_W0G"
echo "   Factory: $ZERO_G_FACTORY"
echo "   Router: $ZERO_G_UNIVERSAL_ROUTER"
echo ""

# Validate addresses are set
if [ -z "$ZERO_G_W0G" ] || [ -z "$ZERO_G_FACTORY" ] || [ -z "$ZERO_G_UNIVERSAL_ROUTER" ]; then
    echo "❌ Missing contract addresses in .env.launch"
    exit 1
fi

echo "✅ All contract addresses present"
echo ""

# Contract validation tests
echo "🔍 Validating deployed contracts..."

# Test 1: W0G contract validation
echo "   Testing W0G contract..."
W0G_NAME=$(cast call $ZERO_G_W0G "name()(string)" --rpc-url $RPC_URL 2>/dev/null || echo "")
if [ "$W0G_NAME" == "Wrapped 0G" ]; then
    echo "   ✅ W0G contract validated"
else
    echo "   ⚠️  W0G name check: '$W0G_NAME' (expected 'Wrapped 0G')"
fi

# Test 2: Check W0G symbol
W0G_SYMBOL=$(cast call $ZERO_G_W0G "symbol()(string)" --rpc-url $RPC_URL 2>/dev/null || echo "")
if [ "$W0G_SYMBOL" == "W0G" ]; then
    echo "   ✅ W0G symbol validated"
else
    echo "   ⚠️  W0G symbol check: '$W0G_SYMBOL' (expected 'W0G')"
fi

# Test 3: Factory validation
echo "   Testing Factory contract..."
if [ -n "$ZERO_G_FACTORY" ] && [ "$ZERO_G_FACTORY" != "0x0000000000000000000000000000000000000000" ]; then
    FACTORY_CODE=$(cast code $ZERO_G_FACTORY --rpc-url $RPC_URL 2>/dev/null || echo "0x")
    if [ ${#FACTORY_CODE} -gt 4 ]; then
        echo "   ✅ Factory contract validated"
    else
        echo "   ⚠️  Factory contract not found at address"
    fi
fi

# Test 4: Router validation
echo "   Testing Router contract..."
if [ -n "$ZERO_G_UNIVERSAL_ROUTER" ] && [ "$ZERO_G_UNIVERSAL_ROUTER" != "0x0000000000000000000000000000000000000000" ]; then
    ROUTER_CODE=$(cast code $ZERO_G_UNIVERSAL_ROUTER --rpc-url $RPC_URL 2>/dev/null || echo "0x")
    if [ ${#ROUTER_CODE} -gt 4 ]; then
        echo "   ✅ Router contract validated"
    else
        echo "   ⚠️  Router contract not found at address"
    fi
fi

echo ""
echo "✅ Contract validation complete"
echo ""

# Generate deployment report
echo "📄 Generating deployment report..."

REPORT_FILE="artifacts/deployment-report-$(date +%Y%m%d-%H%M%S).txt"
mkdir -p artifacts

cat > $REPORT_FILE <<EOF
=================================================
0G UNISWAP V2 FORK - DEPLOYMENT REPORT
=================================================

Deployment Date: $(date)
Network: 0G Aristotle Mainnet
Chain ID: 16661
RPC URL: $RPC_URL

=================================================
DEPLOYED CONTRACT ADDRESSES
=================================================

W0G (Wrapped 0G):
  Address: $ZERO_G_W0G
  Explorer: https://chainscan.0g.ai/address/$ZERO_G_W0G

Factory:
  Address: $ZERO_G_FACTORY
  Explorer: https://chainscan.0g.ai/address/$ZERO_G_FACTORY

Router02:
  Address: $ZERO_G_UNIVERSAL_ROUTER
  Explorer: https://chainscan.0g.ai/address/$ZERO_G_UNIVERSAL_ROUTER

Deployer: $DEPLOYER
Fee To Setter: $FEE_TO_SETTER

=================================================
INTEGRATION VARIABLES FOR PI FORGE
=================================================

Add these to your Pi Forge .env file:

ZERO_G_W0G=$ZERO_G_W0G
ZERO_G_FACTORY=$ZERO_G_FACTORY
ZERO_G_UNIVERSAL_ROUTER=$ZERO_G_UNIVERSAL_ROUTER
ZERO_G_RPC=https://evmrpc.0g.ai

=================================================
NEXT STEPS
=================================================

1. Verify contracts on block explorer (if not auto-verified):
   https://chainscan.0g.ai

2. Test basic functionality:
   - Wrap/unwrap 0G
   - Create a test pair
   - Add liquidity
   - Execute a swap

3. Update Pi Forge configuration:
   - Add environment variables above to root .env
   - Update server/config.py with 0G network
   - Create integration module in server/integrations/

4. Security recommendations:
   - Transfer feeToSetter to multisig
   - Monitor initial transactions
   - Set up alerts for unusual activity

5. Documentation:
   - Update project README with contract addresses
   - Document integration steps for frontend
   - Create API documentation for swap endpoints

=================================================
SECURITY CHECKLIST
=================================================

[ ] Contract addresses verified on block explorer
[ ] Source code verified on Chainscan
[ ] Initial test swap executed successfully
[ ] Fee recipient (feeToSetter) configured correctly
[ ] Monitoring and alerts configured
[ ] Emergency procedures documented
[ ] Team notified of deployment
[ ] Frontend integration tested

=================================================
EOF

echo "   Report saved to: $REPORT_FILE"
echo ""

# Display summary
cat $REPORT_FILE

echo ""
echo "================================================"
echo "🎉 Post-Deployment Process Complete!"
echo "================================================"
echo ""
echo "Next: Integrate with Pi Forge by running:"
echo "   1. Copy contract addresses to root .env"
echo "   2. Update server configuration"
echo "   3. Test integration endpoints"
echo ""
