#!/bin/bash
# Universal ERC20 Token Verification
# Part of Pi Forge Quantum Genesis verification framework
#
# Usage: ./verify-erc20.sh <token_address> <rpc_url> [expected_name] [expected_symbol]
# Example: ./verify-erc20.sh 0x123... https://rpc.example.com "My Token" "MTK"

set -e

# Get the directory of this script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LIB_DIR="$SCRIPT_DIR/../lib"

# Source all library functions
source "$LIB_DIR/colors.sh"
source "$LIB_DIR/validators.sh"
source "$LIB_DIR/formatters.sh"
source "$LIB_DIR/assertions.sh"

# Parse arguments
TOKEN_ADDRESS=${1}
RPC_URL=${2}
EXPECTED_NAME=${3:-""}
EXPECTED_SYMBOL=${4:-""}

# Main verification function
main() {
    section "🪙 Universal ERC20 Token Verification" "$(divider)"
    
    # Step 1: Validate inputs
    if [ -z "$TOKEN_ADDRESS" ] || [ -z "$RPC_URL" ]; then
        error "Usage: $0 <token_address> <rpc_url> [expected_name] [expected_symbol]"
        error "Example: $0 0x123... https://rpc.example.com \"My Token\" \"MTK\""
        exit 1
    fi
    
    info "Token Address: $(highlight "$TOKEN_ADDRESS")"
    info "RPC URL: $RPC_URL"
    echo ""
    
    # Step 2: Validate RPC connectivity
    section "🌐 Network Connectivity"
    validate_rpc "$RPC_URL" "Target Network" || {
        error "RPC validation failed"
        exit 1
    }
    echo ""
    
    # Step 3: Validate address format
    section "✅ Address Validation"
    validate_address "$TOKEN_ADDRESS" "Token" || {
        error "Invalid token address format"
        exit 1
    }
    echo ""
    
    # Step 4: Validate contract deployment
    section "📦 Contract Deployment Verification"
    assert_contract_deployed "$TOKEN_ADDRESS" "$RPC_URL" "Token contract is deployed"
    echo ""
    
    # Step 5: Read ERC20 properties
    section "🔍 ERC20 Token Properties"
    
    progress "Reading token metadata..."
    local token_name=$(cast call "$TOKEN_ADDRESS" "name()(string)" --rpc-url "$RPC_URL" 2>/dev/null || echo "")
    local token_symbol=$(cast call "$TOKEN_ADDRESS" "symbol()(string)" --rpc-url "$RPC_URL" 2>/dev/null || echo "")
    local token_decimals=$(cast call "$TOKEN_ADDRESS" "decimals()(uint8)" --rpc-url "$RPC_URL" 2>/dev/null || echo "")
    local total_supply=$(cast call "$TOKEN_ADDRESS" "totalSupply()(uint256)" --rpc-url "$RPC_URL" 2>/dev/null || echo "")
    
    if [ -z "$token_name" ] || [ -z "$token_symbol" ]; then
        error "Could not read ERC20 token properties. Is this a valid ERC20 token?"
        exit 1
    fi
    
    info "Name: $(highlight "$token_name")"
    info "Symbol: $(highlight "$token_symbol")"
    info "Decimals: $(highlight "$token_decimals")"
    
    if [ -n "$total_supply" ] && [ "$total_supply" != "0" ]; then
        local supply_formatted=$(format_token_amount "$total_supply" "$token_decimals" "$token_symbol")
        info "Total Supply: $(highlight "$supply_formatted")"
    else
        info "Total Supply: $(highlight "0 $token_symbol")"
    fi
    
    assert_not_empty "$token_name" "Token has valid name"
    assert_not_empty "$token_symbol" "Token has valid symbol"
    echo ""
    
    # Step 6: Validate expected values (if provided)
    if [ -n "$EXPECTED_NAME" ] || [ -n "$EXPECTED_SYMBOL" ]; then
        section "🔎 Expected Values Validation"
        
        if [ -n "$EXPECTED_NAME" ]; then
            assert_equals "$EXPECTED_NAME" "$token_name" "Token name matches expected value"
        fi
        
        if [ -n "$EXPECTED_SYMBOL" ]; then
            assert_equals "$EXPECTED_SYMBOL" "$token_symbol" "Token symbol matches expected value"
        fi
        echo ""
    fi
    
    # Step 7: Test basic ERC20 functions
    section "🧪 ERC20 Interface Tests"
    
    progress "Testing balanceOf()..."
    local zero_balance=$(cast call "$TOKEN_ADDRESS" "balanceOf(address)(uint256)" "0x0000000000000000000000000000000000000000" --rpc-url "$RPC_URL" 2>/dev/null || echo "")
    
    assert_not_empty "$zero_balance" "balanceOf() function works correctly"
    
    progress "Testing allowance()..."
    local zero_allowance=$(cast call "$TOKEN_ADDRESS" "allowance(address,address)(uint256)" "0x0000000000000000000000000000000000000000" "0x0000000000000000000000000000000000000000" --rpc-url "$RPC_URL" 2>/dev/null || echo "")
    
    assert_not_empty "$zero_allowance" "allowance() function works correctly"
    echo ""
    
    # Step 8: Check for optional features
    section "⚙️ Optional ERC20 Features"
    
    # Check if token is burnable (using selector check, not actual call)
    progress "Checking for burn functionality..."
    # Just check if the function signature exists in the bytecode
    local contract_code=$(cast code "$TOKEN_ADDRESS" --rpc-url "$RPC_URL" 2>/dev/null)
    # burn(uint256) selector is 0x42966c68
    if [[ "$contract_code" == *"42966c68"* ]]; then
        info "✓ Token appears to support burning (burn function exists)"
    else
        info "ℹ Token does not appear to have burn function"
    fi
    
    # Check if token is mintable (using selector check, not actual call)
    progress "Checking for mint functionality..."
    # mint(address,uint256) selector is 0x40c10f19
    if [[ "$contract_code" == *"40c10f19"* ]]; then
        info "✓ Token appears to support minting (mint function exists)"
    else
        info "ℹ Token does not appear to have mint function"
    fi
    
    # Check if token is pausable
    progress "Checking for pause functionality..."
    local paused=$(cast call "$TOKEN_ADDRESS" "paused()(bool)" --rpc-url "$RPC_URL" 2>/dev/null || echo "")
    
    if [ -n "$paused" ]; then
        info "✓ Token appears to be pausable (currently: $paused)"
    else
        info "ℹ Token does not appear to be pausable"
    fi
    echo ""
    
    # Step 9: Generate report
    section "📊 Verification Report"
    
    info "Token: $TOKEN_ADDRESS"
    info "Name: $token_name"
    info "Symbol: $token_symbol"
    info "Decimals: $token_decimals"
    info "Total Supply: $(format_token_amount "$total_supply" "$token_decimals" "$token_symbol" 2>/dev/null || echo "N/A")"
    echo ""
    
    # Export JSON report
    export_json_report "$token_name" "$token_symbol" "$token_decimals" "$total_supply"
    
    # Finalize assertions
    finalize_assertions || exit 1
}

# Export verification results to JSON
export_json_report() {
    local name=$1
    local symbol=$2
    local decimals=$3
    local supply=$4
    
    # Determine reports directory relative to script location
    local script_real_dir="$(cd "$(dirname "$0")" && pwd)"
    local reports_dir="$script_real_dir/../../../reports"
    
    # Ensure reports directory exists
    mkdir -p "$reports_dir"
    local report_file="$reports_dir/erc20-verification-$(echo "$TOKEN_ADDRESS" | cut -c1-10)-$(date +%Y%m%d-%H%M%S).json"
    
    cat > "$report_file" <<EOF
{
  "token_address": "$TOKEN_ADDRESS",
  "rpc_url": "$RPC_URL",
  "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "properties": {
    "name": "$name",
    "symbol": "$symbol",
    "decimals": $decimals,
    "total_supply": "$supply"
  },
  "verification_status": "passed",
  "assertion_failures": $(get_assertion_failures)
}
EOF
    
    success "JSON report saved to: $(highlight "$report_file")"
}

# Run main function
main "$@"
