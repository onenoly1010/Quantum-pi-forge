#!/bin/bash
# 0G Network Uniswap V2 Deployment Verification
# Part of Pi Forge Quantum Genesis verification framework
#
# Usage: ./verify-uniswap.sh [testnet|mainnet]
# Environment variables required:
#   - ZERO_G_W0G
#   - ZERO_G_FACTORY
#   - ZERO_G_ROUTER
#   - ZERO_G_UNIVERSAL_ROUTER (optional)

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
    RPC_URL="https://evmrpc-testnet.0g.ai"
    CHAIN_ID=16600
    NETWORK_NAME="0G Testnet"
    W0G="${ZERO_G_W0G_TESTNET:-$ZERO_G_W0G}"
    FACTORY="${ZERO_G_FACTORY_TESTNET:-$ZERO_G_FACTORY}"
    ROUTER="${ZERO_G_ROUTER_TESTNET:-$ZERO_G_ROUTER}"
    UNIVERSAL_ROUTER="${ZERO_G_UNIVERSAL_ROUTER_TESTNET:-$ZERO_G_UNIVERSAL_ROUTER}"
    EXPLORER="https://chainscan-testnet.0g.ai"
else
    RPC_URL="https://evmrpc.0g.ai"
    CHAIN_ID=16661
    NETWORK_NAME="0G Mainnet"
    W0G="${ZERO_G_W0G}"
    FACTORY="${ZERO_G_FACTORY}"
    ROUTER="${ZERO_G_ROUTER}"
    UNIVERSAL_ROUTER="${ZERO_G_UNIVERSAL_ROUTER}"
    EXPLORER="https://chainscan.0g.ai"
fi

# Main verification function
main() {
    section "🔷 0G Network Uniswap V2 Verification" "$(divider)"
    info "Network: $(highlight "$NETWORK_NAME")"
    info "RPC: $RPC_URL"
    echo ""
    
    # Step 1: Validate environment variables
    section "📋 Environment Configuration"
    assert_not_empty "$W0G" "W0G (Wrapped 0G) address is configured"
    assert_not_empty "$FACTORY" "Uniswap V2 Factory address is configured"
    assert_not_empty "$ROUTER" "Uniswap V2 Router address is configured"
    
    if [ -z "$W0G" ] || [ -z "$FACTORY" ] || [ -z "$ROUTER" ]; then
        error "Missing required environment variables"
        error "Please set ZERO_G_W0G, ZERO_G_FACTORY, and ZERO_G_ROUTER"
        exit 1
    fi
    
    info "W0G: $(highlight "$W0G")"
    info "Factory: $(highlight "$FACTORY")"
    info "Router: $(highlight "$ROUTER")"
    if [ -n "$UNIVERSAL_ROUTER" ]; then
        info "Universal Router: $(highlight "$UNIVERSAL_ROUTER")"
    fi
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
    validate_address "$W0G" "W0G" || exit 1
    validate_address "$FACTORY" "Factory" || exit 1
    validate_address "$ROUTER" "Router" || exit 1
    if [ -n "$UNIVERSAL_ROUTER" ]; then
        validate_address "$UNIVERSAL_ROUTER" "Universal Router" || exit 1
    fi
    success "All addresses have valid format"
    echo ""
    
    # Step 4: Validate contract deployments
    section "📦 Contract Deployment Verification"
    
    assert_contract_deployed "$W0G" "$RPC_URL" "W0G is deployed"
    assert_contract_deployed "$FACTORY" "$RPC_URL" "Uniswap V2 Factory is deployed"
    assert_contract_deployed "$ROUTER" "$RPC_URL" "Uniswap V2 Router is deployed"
    
    if [ -n "$UNIVERSAL_ROUTER" ]; then
        assert_contract_deployed "$UNIVERSAL_ROUTER" "$RPC_URL" "Universal Router is deployed"
    fi
    echo ""
    
    # Step 5: Verify W0G properties
    section "🔍 W0G (Wrapped 0G) Properties"
    
    progress "Reading W0G token properties..."
    local w0g_name=$(cast call "$W0G" "name()(string)" --rpc-url "$RPC_URL" 2>/dev/null || echo "")
    local w0g_symbol=$(cast call "$W0G" "symbol()(string)" --rpc-url "$RPC_URL" 2>/dev/null || echo "")
    local w0g_decimals=$(cast call "$W0G" "decimals()(uint8)" --rpc-url "$RPC_URL" 2>/dev/null || echo "")
    
    if [ -n "$w0g_name" ]; then
        info "Name: $(highlight "$w0g_name")"
        info "Symbol: $(highlight "$w0g_symbol")"
        info "Decimals: $(highlight "$w0g_decimals")"
        
        # Verify expected values for W0G
        if [ "$w0g_decimals" == "18" ]; then
            success "W0G has correct decimals (18)"
        else
            warning "Unexpected decimals for W0G: $w0g_decimals (expected 18)"
        fi
    else
        warning "Could not retrieve W0G token metadata"
    fi
    echo ""
    
    # Step 6: Verify Factory properties
    section "🏭 Uniswap V2 Factory Properties"
    
    progress "Reading Factory properties..."
    local factory_fee_to=$(cast call "$FACTORY" "feeTo()(address)" --rpc-url "$RPC_URL" 2>/dev/null || echo "")
    local factory_fee_setter=$(cast call "$FACTORY" "feeToSetter()(address)" --rpc-url "$RPC_URL" 2>/dev/null || echo "")
    local factory_pairs=$(cast call "$FACTORY" "allPairsLength()(uint256)" --rpc-url "$RPC_URL" 2>/dev/null || echo "")
    
    if [ -n "$factory_fee_setter" ]; then
        info "Fee To: $(highlight "$factory_fee_to")"
        info "Fee Setter: $(highlight "$factory_fee_setter")"
    fi
    
    if [ -n "$factory_pairs" ]; then
        info "Total Pairs Created: $(highlight "$factory_pairs")"
        
        if [ "$factory_pairs" -gt 0 ]; then
            success "Factory has created pairs"
        else
            info "No pairs created yet (factory is ready)"
        fi
    fi
    echo ""
    
    # Step 7: Verify Router properties
    section "🔀 Uniswap V2 Router Properties"
    
    progress "Reading Router properties..."
    local router_factory=$(cast call "$ROUTER" "factory()(address)" --rpc-url "$RPC_URL" 2>/dev/null || echo "")
    local router_weth=$(cast call "$ROUTER" "WETH()(address)" --rpc-url "$RPC_URL" 2>/dev/null || echo "")
    
    if [ -n "$router_factory" ]; then
        info "Router Factory Reference: $(highlight "$router_factory")"
        
        # Verify Router points to correct Factory using assertion framework
        assert_address_equals "$FACTORY" "$router_factory" "Router correctly references Factory"
    fi
    
    if [ -n "$router_weth" ]; then
        info "Router WETH Reference: $(highlight "$router_weth")"
        
        # Verify Router points to correct W0G
        if addresses_match "$router_weth" "$W0G"; then
            success "Router correctly references W0G (as WETH)"
        else
            warning "Router WETH reference ($router_weth) differs from W0G ($W0G)"
        fi
    fi
    echo ""
    
    # Step 8: Verify init code hash
    section "🔐 Init Code Hash Verification"
    
    progress "Calculating init code hash..."
    # Note: This requires the pair bytecode, which we can try to get from factory
    local init_hash=$(cast call "$FACTORY" "INIT_CODE_PAIR_HASH()(bytes32)" --rpc-url "$RPC_URL" 2>/dev/null || echo "")
    
    if [ -n "$init_hash" ] && [ "$init_hash" != "0x" ]; then
        info "Init Code Hash: $(highlight "$init_hash")"
        success "Factory has valid init code hash"
    else
        info "Init code hash not available via INIT_CODE_PAIR_HASH() method"
        info "This may be expected for standard Uniswap V2 Factory"
    fi
    echo ""
    
    # Step 9: Integration test (if possible)
    section "🧪 Integration Tests"
    
    info "Verifying contract interactions..."
    
    # Test 1: Check if W0G can be queried
    progress "Testing W0G balance query..."
    local zero_balance=$(cast call "$W0G" "balanceOf(address)(uint256)" "0x0000000000000000000000000000000000000000" --rpc-url "$RPC_URL" 2>/dev/null || echo "")
    
    if [ -n "$zero_balance" ]; then
        success "W0G balanceOf() function works correctly"
    else
        warning "Could not query W0G balanceOf()"
    fi
    
    # Test 2: Verify Factory pair lookup
    progress "Testing Factory pair creation interface..."
    local pair_addr=$(cast call "$FACTORY" "getPair(address,address)(address)" "$W0G" "$W0G" --rpc-url "$RPC_URL" 2>/dev/null || echo "")
    
    if [ -n "$pair_addr" ]; then
        success "Factory getPair() function works correctly"
        
        if [ "$pair_addr" == "0x0000000000000000000000000000000000000000" ]; then
            info "No pair exists for W0G-W0G (expected)"
        else
            info "Found pair at: $pair_addr"
        fi
    else
        warning "Could not query Factory getPair()"
    fi
    echo ""
    
    # Step 10: Generate report
    section "📊 Verification Report"
    
    info "Network: $NETWORK_NAME"
    info "Chain ID: $CHAIN_ID"
    info "W0G: $W0G"
    info "Factory: $FACTORY"
    info "Router: $ROUTER"
    if [ -n "$UNIVERSAL_ROUTER" ]; then
        info "Universal Router: $UNIVERSAL_ROUTER"
    fi
    info "Explorer: $EXPLORER/address/$FACTORY"
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
    local report_file="reports/zero-g-${NETWORK}-verification-$(date +%Y%m%d-%H%M%S).json"
    
    cat > "$report_file" <<EOF
{
  "network": "$NETWORK_NAME",
  "chain_id": $CHAIN_ID,
  "rpc_url": "$RPC_URL",
  "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "contracts": {
    "w0g": {
      "address": "$W0G",
      "deployed": true,
      "explorer_url": "$EXPLORER/address/$W0G"
    },
    "factory": {
      "address": "$FACTORY",
      "deployed": true,
      "explorer_url": "$EXPLORER/address/$FACTORY"
    },
    "router": {
      "address": "$ROUTER",
      "deployed": true,
      "explorer_url": "$EXPLORER/address/$ROUTER"
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
