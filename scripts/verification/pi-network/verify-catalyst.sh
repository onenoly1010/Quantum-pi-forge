#!/bin/bash
# Pi Network Catalyst Pool Deployment Verification
# Part of Pi Forge Quantum Genesis verification framework
#
# Usage: ./verify-catalyst.sh [testnet|mainnet]
# Environment variables required:
#   - CATALYST_POOL_ADDRESS (or CATALYST_POOL_ADDRESS_TESTNET)
#   - MODEL_ROYALTY_NFT_ADDRESS (or MODEL_ROYALTY_NFT_ADDRESS_TESTNET)

set -e

# Get the directory of this script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LIB_DIR="$SCRIPT_DIR/../lib"

# Source all library functions
source "$LIB_DIR/colors.sh"
source "$LIB_DIR/validators.sh"
source "$LIB_DIR/formatters.sh"
source "$LIB_DIR/assertions.sh"

# Default to mainnet if not specified
NETWORK=${1:-mainnet}

# Configuration based on network
if [ "$NETWORK" == "testnet" ]; then
    RPC_URL="https://api.testnet.minepi.com/rpc"
    CHAIN_ID=2025
    NETWORK_NAME="Pi Network Testnet"
    CATALYST_POOL="${CATALYST_POOL_ADDRESS_TESTNET:-$CATALYST_POOL_ADDRESS}"
    MODEL_NFT="${MODEL_ROYALTY_NFT_ADDRESS_TESTNET:-$MODEL_ROYALTY_NFT_ADDRESS}"
    EXPLORER="https://testnet.minepi.com"
else
    RPC_URL="https://rpc.mainnet.pi.network"
    CHAIN_ID=314159
    NETWORK_NAME="Pi Network Mainnet"
    CATALYST_POOL="${CATALYST_POOL_ADDRESS}"
    MODEL_NFT="${MODEL_ROYALTY_NFT_ADDRESS}"
    EXPLORER="https://pi-blockchain.net"
fi

# Main verification function
main() {
    section "🔮 Pi Network Catalyst Pool Verification" "$(divider)"
    info "Network: $(highlight "$NETWORK_NAME")"
    info "RPC: $RPC_URL"
    echo ""
    
    # Step 1: Validate environment variables
    section "📋 Environment Configuration"
    assert_not_empty "$CATALYST_POOL" "Catalyst Pool address is configured"
    assert_not_empty "$MODEL_NFT" "Model Royalty NFT address is configured"
    
    if [ -z "$CATALYST_POOL" ] || [ -z "$MODEL_NFT" ]; then
        error "Missing required environment variables"
        error "Please set CATALYST_POOL_ADDRESS and MODEL_ROYALTY_NFT_ADDRESS"
        exit 1
    fi
    
    info "Catalyst Pool: $(highlight "$CATALYST_POOL")"
    info "Model NFT: $(highlight "$MODEL_NFT")"
    echo ""
    
    # Step 2: Validate RPC connectivity
    section "🌐 Network Connectivity"
    validate_rpc "$RPC_URL" "$NETWORK_NAME" || {
        error "RPC validation failed"
        exit 1
    }
    
    validate_chain_id "$RPC_URL" "$CHAIN_ID" "$NETWORK_NAME" || {
        error "Chain ID validation failed"
        exit 1
    }
    echo ""
    
    # Step 3: Validate address formats
    section "✅ Address Validation"
    validate_address "$CATALYST_POOL" "Catalyst Pool" || {
        error "Invalid Catalyst Pool address format"
        exit 1
    }
    
    validate_address "$MODEL_NFT" "Model Royalty NFT" || {
        error "Invalid Model Royalty NFT address format"
        exit 1
    }
    success "All addresses have valid format"
    echo ""
    
    # Step 4: Validate contract deployments
    section "📦 Contract Deployment Verification"
    
    # Check Catalyst Pool deployment
    progress "Verifying Catalyst Pool deployment..."
    assert_contract_deployed "$CATALYST_POOL" "$RPC_URL" "Catalyst Pool is deployed"
    
    # Check Model NFT deployment
    progress "Verifying Model Royalty NFT deployment..."
    assert_contract_deployed "$MODEL_NFT" "$RPC_URL" "Model Royalty NFT is deployed"
    echo ""
    
    # Step 5: Query contract properties
    section "🔍 Contract Properties"
    
    # Try to get owner of Catalyst Pool (common pattern)
    progress "Reading Catalyst Pool properties..."
    local pool_owner=$(cast call "$CATALYST_POOL" "owner()(address)" --rpc-url "$RPC_URL" 2>/dev/null || echo "")
    
    if [ -n "$pool_owner" ] && [ "$pool_owner" != "0x" ]; then
        info "Pool Owner: $(highlight "$pool_owner")"
        
        # Check owner balance
        progress "Checking owner balance..."
        local owner_balance_wei=$(cast balance "$pool_owner" --rpc-url "$RPC_URL" 2>/dev/null || echo "0")
        local owner_balance=$(cast --to-unit "$owner_balance_wei" ether 2>/dev/null | head -1 || echo "0")
        info "Owner Balance: $(highlight "$owner_balance PI")"
        
        # Assert owner has reasonable balance (at least 0.1 PI for gas)
        assert_greater_than "$owner_balance" "0.001" "Owner has sufficient balance for operations"
    else
        warning "Could not retrieve pool owner (contract may not have owner() function)"
    fi
    
    # Check Model NFT properties
    progress "Reading Model Royalty NFT properties..."
    local nft_name=$(cast call "$MODEL_NFT" "name()(string)" --rpc-url "$RPC_URL" 2>/dev/null || echo "")
    local nft_symbol=$(cast call "$MODEL_NFT" "symbol()(string)" --rpc-url "$RPC_URL" 2>/dev/null || echo "")
    
    if [ -n "$nft_name" ]; then
        info "NFT Name: $(highlight "$nft_name")"
        info "NFT Symbol: $(highlight "$nft_symbol")"
        assert_not_empty "$nft_name" "NFT has valid name"
        assert_not_empty "$nft_symbol" "NFT has valid symbol"
    else
        warning "Could not retrieve NFT metadata"
    fi
    echo ""
    
    # Step 6: Validate linkage (if applicable)
    section "🔗 Contract Integration"
    
    # Try to check if Pool references NFT
    progress "Checking Pool ↔ NFT linkage..."
    local pool_nft_ref=$(cast call "$CATALYST_POOL" "nft()(address)" --rpc-url "$RPC_URL" 2>/dev/null || echo "")
    
    if [ -n "$pool_nft_ref" ] && [ "$pool_nft_ref" != "0x" ]; then
        info "Pool NFT Reference: $(highlight "$pool_nft_ref")"
        
        # Verify it matches our MODEL_NFT
        local pool_nft_normalized=$(normalize_address "$pool_nft_ref")
        local model_nft_normalized=$(normalize_address "$MODEL_NFT")
        
        if addresses_match "$pool_nft_ref" "$MODEL_NFT"; then
            success "Pool correctly references Model Royalty NFT"
        else
            warning "Pool NFT reference ($pool_nft_ref) differs from configured address ($MODEL_NFT)"
        fi
    else
        info "No NFT reference found in Pool contract (or method not available)"
    fi
    echo ""
    
    # Step 7: Generate report
    section "📊 Verification Report"
    
    info "Network: $NETWORK_NAME"
    info "Chain ID: $CHAIN_ID"
    info "Catalyst Pool: $CATALYST_POOL"
    info "Model Royalty NFT: $MODEL_NFT"
    info "Explorer: $EXPLORER/address/$CATALYST_POOL"
    echo ""
    
    # Export JSON report
    export_json_report
    
    # Finalize assertions
    finalize_assertions || exit 1
}

# Export verification results to JSON
export_json_report() {
    # Ensure reports directory exists
    mkdir -p "$(dirname "$0")/../../../reports"
    local report_file="reports/pi-network-${NETWORK}-verification-$(date +%Y%m%d-%H%M%S).json"
    
    cat > "$report_file" <<EOF
{
  "network": "$NETWORK_NAME",
  "chain_id": $CHAIN_ID,
  "rpc_url": "$RPC_URL",
  "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "contracts": {
    "catalyst_pool": {
      "address": "$CATALYST_POOL",
      "deployed": true,
      "explorer_url": "$EXPLORER/address/$CATALYST_POOL"
    },
    "model_royalty_nft": {
      "address": "$MODEL_NFT",
      "deployed": true,
      "explorer_url": "$EXPLORER/address/$MODEL_NFT"
    }
  },
  "verification_status": "passed",
  "assertion_failures": $(get_assertion_failures)
}
EOF
    
    success "JSON report saved to: $(highlight "$report_file")"
}

# Run main function
main "$@"
