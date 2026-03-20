#!/bin/bash
# Assertion framework for deployment verification
# Part of Pi Forge Quantum Genesis verification framework

# Get the directory of this script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/colors.sh"

# Global assertion failure counter
ASSERTION_FAILURES=0

# Assert equality
assert_equals() {
    local expected=$1
    local actual=$2
    local description=$3
    
    if [ "$expected" != "$actual" ]; then
        error "Assertion failed: $description"
        error "  Expected: $(highlight "$expected")"
        error "  Actual:   $(highlight "$actual")"
        ((ASSERTION_FAILURES++))
        return 1
    fi
    
    success "$description"
    return 0
}

# Assert address equality (case-insensitive)
assert_address_equals() {
    local expected=$(echo "$1" | tr '[:upper:]' '[:lower:]')
    local actual=$(echo "$2" | tr '[:upper:]' '[:lower:]')
    local description=$3
    
    if [ "$expected" != "$actual" ]; then
        error "Assertion failed: $description"
        error "  Expected: $(highlight "$expected")"
        error "  Actual:   $(highlight "$actual")"
        ((ASSERTION_FAILURES++))
        return 1
    fi
    
    success "$description"
    return 0
}

# Assert numeric comparison (greater than)
assert_greater_than() {
    local value=$1
    local min=$2
    local description=$3
    
    # Check if values are integers for direct comparison, otherwise use bc
    if [[ "$value" =~ ^[0-9]+$ ]] && [[ "$min" =~ ^[0-9]+$ ]]; then
        # Integer comparison
        if [ "$value" -le "$min" ]; then
            error "Assertion failed: $description"
            error "  Value: $(highlight "$value") (expected > $min)"
            ((ASSERTION_FAILURES++))
            return 1
        fi
    else
        # Floating point comparison using bc
        if (( $(echo "$value <= $min" | bc -l) )); then
            error "Assertion failed: $description"
            error "  Value: $(highlight "$value") (expected > $min)"
            ((ASSERTION_FAILURES++))
            return 1
        fi
    fi
    
    success "$description"
    return 0
}

# Assert numeric comparison (less than)
assert_less_than() {
    local value=$1
    local max=$2
    local description=$3
    
    # Use bc for floating point comparison
    if (( $(echo "$value >= $max" | bc -l) )); then
        error "Assertion failed: $description"
        error "  Value: $(highlight "$value") (expected < $max)"
        ((ASSERTION_FAILURES++))
        return 1
    fi
    
    success "$description"
    return 0
}

# Assert not empty
assert_not_empty() {
    local value=$1
    local description=$2
    
    if [ -z "$value" ]; then
        error "Assertion failed: $description"
        error "  Value is empty or undefined"
        ((ASSERTION_FAILURES++))
        return 1
    fi
    
    success "$description"
    return 0
}

# Assert true condition
assert_true() {
    local condition=$1
    local description=$2
    
    if [ "$condition" != "0" ] && [ "$condition" != "true" ]; then
        error "Assertion failed: $description"
        error "  Condition evaluated to false"
        ((ASSERTION_FAILURES++))
        return 1
    fi
    
    success "$description"
    return 0
}

# Assert contract deployed (has code)
assert_contract_deployed() {
    local addr=$1
    local rpc=$2
    local description=$3
    
    if ! command -v cast &> /dev/null; then
        error "Foundry 'cast' command not found"
        ((ASSERTION_FAILURES++))
        return 1
    fi
    
    local code=$(cast code "$addr" --rpc-url "$rpc" 2>/dev/null)
    
    if [ -z "$code" ] || [ "$code" == "0x" ]; then
        error "Assertion failed: $description"
        error "  No contract deployed at address: $addr"
        ((ASSERTION_FAILURES++))
        return 1
    fi
    
    success "$description"
    return 0
}

# Final assertion check - exit if any failures
finalize_assertions() {
    divider
    
    if [ $ASSERTION_FAILURES -gt 0 ]; then
        error "Verification FAILED with $ASSERTION_FAILURES assertion failure(s)"
        echo ""
        return 1
    fi
    
    success "All assertions passed! Verification completed successfully."
    echo ""
    return 0
}

# Reset assertion counter (for testing)
reset_assertions() {
    ASSERTION_FAILURES=0
}

# Get current failure count
get_assertion_failures() {
    echo $ASSERTION_FAILURES
}

# Export all functions
# Note: ASSERTION_FAILURES is exported for internal framework use only
# External scripts should use get_assertion_failures() to read the value
export -f assert_equals assert_address_equals assert_greater_than assert_less_than
export -f assert_not_empty assert_true assert_contract_deployed
export -f finalize_assertions reset_assertions get_assertion_failures
export ASSERTION_FAILURES
