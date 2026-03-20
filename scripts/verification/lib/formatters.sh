#!/bin/bash
# Formatting utilities for deployment verification
# Part of Pi Forge Quantum Genesis verification framework

# Format wei to human-readable with symbol
# 
# IMPORTANT LIMITATION: This function only supports 18-decimal tokens.
# For tokens with different decimals, it will display the raw value with a warning.
# 
# Args:
#   $1 - wei_value: The token amount in wei (smallest unit)
#   $2 - decimals: Token decimals (default: 18, only 18 is fully supported)
#   $3 - symbol: Token symbol for display (default: "tokens")
#
# Returns:
#   Formatted string like "1.5 ETH" or raw value with warning for non-18 decimals
format_token_amount() {
    local wei_value=$1
    local decimals=${2:-18}
    local symbol=${3:-"tokens"}
    
    if ! command -v cast &> /dev/null; then
        echo "ERROR: Foundry 'cast' command not found"
        return 1
    fi
    
    # Only handles 18 decimals using cast's built-in conversion
    if [ "$decimals" != "18" ]; then
        # For non-18 decimals, display raw value with warning
        echo "$wei_value (raw) $symbol [Warning: ${decimals}-decimal conversion not implemented]"
        return 0
    fi
    
    # Convert wei to ether (handles 18 decimals)
    local human=$(cast --to-unit "$wei_value" ether 2>/dev/null | head -1)
    
    if [ -z "$human" ]; then
        echo "ERROR: Could not format amount"
        return 1
    fi
    
    echo "$human $symbol"
}

# Format timestamp to readable date
format_timestamp() {
    local ts=$1
    
    # Try GNU date first (Linux), then BSD date (macOS)
    date -d @"$ts" '+%Y-%m-%d %H:%M:%S UTC' 2>/dev/null || \
    date -r "$ts" '+%Y-%m-%d %H:%M:%S UTC' 2>/dev/null || \
    echo "$ts (raw)"
}

# Compare two addresses (case-insensitive)
addresses_match() {
    local addr1=$(echo "$1" | tr '[:upper:]' '[:lower:]')
    local addr2=$(echo "$2" | tr '[:upper:]' '[:lower:]')
    [ "$addr1" == "$addr2" ]
}

# Format large numbers with commas
format_number() {
    local num=$1
    printf "%'d" "$num" 2>/dev/null || echo "$num"
}

# Convert address to checksum format (lowercase for simplicity)
normalize_address() {
    echo "$1" | tr '[:upper:]' '[:lower:]'
}

# Truncate address for display (0x1234...5678)
truncate_address() {
    local addr=$1
    local prefix_len=${2:-6}
    local suffix_len=${3:-4}
    
    if [ ${#addr} -le $((prefix_len + suffix_len + 3)) ]; then
        echo "$addr"
    else
        echo "${addr:0:$prefix_len}...${addr: -$suffix_len}"
    fi
}

# Format gas amount to Gwei
format_gas() {
    local wei=$1
    if ! command -v cast &> /dev/null; then
        echo "$wei wei"
        return
    fi
    local gwei=$(cast --to-unit "$wei" gwei 2>/dev/null | head -1)
    echo "$gwei Gwei"
}

# Format percentage
format_percentage() {
    local numerator=$1
    local denominator=$2
    local percent=$(echo "scale=2; $numerator * 100 / $denominator" | bc -l)
    echo "$percent%"
}

# Export all functions
export -f format_token_amount format_timestamp addresses_match format_number
export -f normalize_address truncate_address format_gas format_percentage
