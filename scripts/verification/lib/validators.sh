#!/bin/bash
# Validation functions for deployment verification
# Part of Pi Forge Quantum Genesis verification framework

# Get the directory of this script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/colors.sh"

# Validate that a contract exists at an address
validate_contract_exists() {
    local addr=$1
    local name=$2
    local rpc=$3
    
    info "Checking $name at $addr..."
    
    # Check if cast is available
    if ! command -v cast &> /dev/null; then
        error "Foundry 'cast' command not found. Please install Foundry."
        return 1
    fi
    
    local code=$(cast code "$addr" --rpc-url "$rpc" 2>/dev/null)
    
    if [ -z "$code" ] || [ "$code" == "0x" ]; then
        error "$name not deployed at $addr"
        return 1
    fi
    
    # Calculate bytecode size (remove 0x prefix and divide by 2)
    local code_length=${#code}
    local byte_count=$(( (code_length - 2) / 2 ))
    success "$name contract exists ($byte_count bytes)"
    return 0
}

# Validate RPC connectivity
validate_rpc() {
    local rpc=$1
    local chain_name=$2
    
    info "Testing RPC connectivity to $chain_name..."
    
    if ! command -v cast &> /dev/null; then
        error "Foundry 'cast' command not found. Please install Foundry."
        return 1
    fi
    
    local block=$(cast block-number --rpc-url "$rpc" 2>/dev/null)
    
    if [ -z "$block" ]; then
        error "Cannot connect to RPC: $rpc"
        return 1
    fi
    
    success "RPC connected to $chain_name (Block: $(highlight "$block"))"
    return 0
}

# Validate address format (Ethereum-style)
validate_address() {
    local addr=$1
    local name=${2:-"Address"}
    
    if [[ ! $addr =~ ^0x[a-fA-F0-9]{40}$ ]]; then
        error "Invalid address format for $name: $addr"
        return 1
    fi
    
    debug "Valid address format: $addr"
    return 0
}

# Check minimum balance requirement
validate_balance() {
    local addr=$1
    local min_balance=$2
    local rpc=$3
    local symbol=${4:-"ETH"}
    
    if ! command -v cast &> /dev/null; then
        error "Foundry 'cast' command not found. Please install Foundry."
        return 1
    fi
    
    local balance_wei=$(cast balance "$addr" --rpc-url "$rpc" 2>/dev/null)
    
    if [ -z "$balance_wei" ]; then
        error "Could not retrieve balance for $addr"
        return 1
    fi
    
    local balance=$(cast --to-unit "$balance_wei" ether 2>/dev/null | head -1)
    
    info "Balance: $(highlight "$balance $symbol")"
    
    # Use bc for floating point comparison
    if (( $(echo "$balance < $min_balance" | bc -l) )); then
        warning "Balance ($balance $symbol) below recommended minimum ($min_balance $symbol)"
        return 1
    fi
    
    return 0
}

# Validate chain ID matches expected
validate_chain_id() {
    local rpc=$1
    local expected_chain_id=$2
    local chain_name=$3
    
    if ! command -v cast &> /dev/null; then
        error "Foundry 'cast' command not found. Please install Foundry."
        return 1
    fi
    
    local actual_chain_id=$(cast chain-id --rpc-url "$rpc" 2>/dev/null)
    
    if [ -z "$actual_chain_id" ]; then
        error "Could not retrieve chain ID from RPC"
        return 1
    fi
    
    if [ "$actual_chain_id" != "$expected_chain_id" ]; then
        error "Chain ID mismatch for $chain_name. Expected: $expected_chain_id, Got: $actual_chain_id"
        return 1
    fi
    
    success "Chain ID verified: $(highlight "$actual_chain_id")"
    return 0
}

# Validate ERC20 token basic properties
validate_erc20_token() {
    local token_addr=$1
    local rpc=$2
    local expected_name=${3:-""}
    local expected_symbol=${4:-""}
    
    if ! command -v cast &> /dev/null; then
        error "Foundry 'cast' command not found. Please install Foundry."
        return 1
    fi
    
    # Check if contract exists
    validate_contract_exists "$token_addr" "ERC20 Token" "$rpc" || return 1
    
    # Get token properties
    local name=$(cast call "$token_addr" "name()(string)" --rpc-url "$rpc" 2>/dev/null)
    local symbol=$(cast call "$token_addr" "symbol()(string)" --rpc-url "$rpc" 2>/dev/null)
    local decimals=$(cast call "$token_addr" "decimals()(uint8)" --rpc-url "$rpc" 2>/dev/null)
    local total_supply=$(cast call "$token_addr" "totalSupply()(uint256)" --rpc-url "$rpc" 2>/dev/null)
    
    if [ -z "$name" ] || [ -z "$symbol" ]; then
        error "Could not read ERC20 token properties"
        return 1
    fi
    
    info "Token Name: $(highlight "$name")"
    info "Token Symbol: $(highlight "$symbol")"
    info "Decimals: $(highlight "$decimals")"
    
    # Verify expected values if provided
    if [ -n "$expected_name" ] && [ "$name" != "$expected_name" ]; then
        error "Token name mismatch. Expected: $expected_name, Got: $name"
        return 1
    fi
    
    if [ -n "$expected_symbol" ] && [ "$symbol" != "$expected_symbol" ]; then
        error "Token symbol mismatch. Expected: $expected_symbol, Got: $symbol"
        return 1
    fi
    
    return 0
}

# Export all functions
export -f validate_contract_exists validate_rpc validate_address validate_balance
export -f validate_chain_id validate_erc20_token
