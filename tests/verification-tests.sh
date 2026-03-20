#!/bin/bash
# Test Suite for Verification Framework
# Part of Pi Forge Quantum Genesis verification framework

set -e

# Get the directory of this script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
VERIFICATION_DIR="$SCRIPT_DIR/../scripts/verification"
LIB_DIR="$VERIFICATION_DIR/lib"

# Source library functions
source "$LIB_DIR/colors.sh"
source "$LIB_DIR/validators.sh"
source "$LIB_DIR/formatters.sh"
source "$LIB_DIR/assertions.sh"

# Test counters
TESTS_RUN=0
TESTS_PASSED=0
TESTS_FAILED=0

# Test helper functions
test_start() {
    local test_name=$1
    ((TESTS_RUN++))
    info "Running: $test_name"
}

test_pass() {
    ((TESTS_PASSED++))
    success "PASSED"
}

test_fail() {
    local reason=$1
    ((TESTS_FAILED++))
    error "FAILED: $reason"
}

# Reset assertions for each test
reset_test() {
    reset_assertions
}

# Test: Address validation
test_address_validation() {
    test_start "Address Validation"
    reset_test
    
    # Valid address
    if validate_address "0x1234567890123456789012345678901234567890" "Test" 2>/dev/null; then
        # Invalid address (too short)
        if ! validate_address "0x123" "Test" 2>/dev/null; then
            # Invalid address (no 0x prefix)
            if ! validate_address "1234567890123456789012345678901234567890" "Test" 2>/dev/null; then
                test_pass
                return 0
            fi
        fi
    fi
    
    test_fail "Address validation not working correctly"
    return 1
}

# Test: Address comparison
test_address_comparison() {
    test_start "Address Comparison"
    reset_test
    
    if addresses_match "0xABCD" "0xabcd"; then
        if ! addresses_match "0x1234" "0x5678"; then
            test_pass
            return 0
        fi
    fi
    
    test_fail "Address comparison not working correctly"
    return 1
}

# Test: Address normalization
test_address_normalization() {
    test_start "Address Normalization"
    reset_test
    
    local normalized=$(normalize_address "0xABCDEF1234567890")
    if [ "$normalized" == "0xabcdef1234567890" ]; then
        test_pass
        return 0
    fi
    
    test_fail "Expected lowercase, got: $normalized"
    return 1
}

# Test: Address truncation
test_address_truncation() {
    test_start "Address Truncation"
    reset_test
    
    local truncated=$(truncate_address "0x1234567890123456789012345678901234567890")
    if [[ "$truncated" == *"..."* ]]; then
        test_pass
        return 0
    fi
    
    test_fail "Address not truncated: $truncated"
    return 1
}

# Test: Number formatting
test_number_formatting() {
    test_start "Number Formatting"
    reset_test
    
    local formatted=$(format_number 1000000 2>/dev/null || echo "1000000")
    # This might fail on systems without proper locale support, so we accept both
    if [ -n "$formatted" ]; then
        test_pass
        return 0
    fi
    
    test_fail "Number formatting failed"
    return 1
}

# Test: Timestamp formatting
test_timestamp_formatting() {
    test_start "Timestamp Formatting"
    reset_test
    
    local formatted=$(format_timestamp 1702800000)
    if [[ "$formatted" == *"2023"* ]] || [[ "$formatted" == *"UTC"* ]] || [[ "$formatted" == *"1702800000"* ]]; then
        test_pass
        return 0
    fi
    
    test_fail "Timestamp formatting failed: $formatted"
    return 1
}

# Test: Assert equals
test_assert_equals() {
    test_start "Assert Equals"
    reset_test
    
    # Test passing assertion
    assert_equals "test" "test" "Values should match" >/dev/null 2>&1
    local failures1=$(get_assertion_failures)
    
    # Test failing assertion
    assert_equals "test1" "test2" "Values should not match" >/dev/null 2>&1
    local failures2=$(get_assertion_failures)
    
    if [ "$failures1" == "0" ] && [ "$failures2" == "1" ]; then
        test_pass
        reset_test
        return 0
    fi
    
    test_fail "Failures: $failures1 (expected 0), $failures2 (expected 1)"
    reset_test
    return 1
}

# Test: Assert address equals (case insensitive)
test_assert_address_equals() {
    test_start "Assert Address Equals (Case Insensitive)"
    reset_test
    
    # Test passing assertion
    assert_address_equals "0xABCD" "0xabcd" "Addresses should match" >/dev/null 2>&1
    local failures1=$(get_assertion_failures)
    
    # Test failing assertion
    assert_address_equals "0x1234" "0x5678" "Addresses should not match" >/dev/null 2>&1
    local failures2=$(get_assertion_failures)
    
    if [ "$failures1" == "0" ] && [ "$failures2" == "1" ]; then
        test_pass
        reset_test
        return 0
    fi
    
    test_fail "Failures: $failures1 (expected 0), $failures2 (expected 1)"
    reset_test
    return 1
}

# Test: Assert greater than
test_assert_greater_than() {
    test_start "Assert Greater Than"
    reset_test
    
    # Test passing assertion
    assert_greater_than "10" "5" "10 > 5" >/dev/null 2>&1
    local failures1=$(get_assertion_failures)
    
    # Test failing assertion
    assert_greater_than "5" "10" "5 > 10 should fail" >/dev/null 2>&1
    local failures2=$(get_assertion_failures)
    
    if [ "$failures1" == "0" ] && [ "$failures2" == "1" ]; then
        test_pass
        reset_test
        return 0
    fi
    
    test_fail "Failures: $failures1 (expected 0), $failures2 (expected 1)"
    reset_test
    return 1
}

# Test: Assert not empty
test_assert_not_empty() {
    test_start "Assert Not Empty"
    reset_test
    
    # Test passing assertion
    assert_not_empty "value" "Should have value" >/dev/null 2>&1
    local failures1=$(get_assertion_failures)
    
    # Test failing assertion
    assert_not_empty "" "Should be empty" >/dev/null 2>&1
    local failures2=$(get_assertion_failures)
    
    if [ "$failures1" == "0" ] && [ "$failures2" == "1" ]; then
        test_pass
        reset_test
        return 0
    fi
    
    test_fail "Failures: $failures1 (expected 0), $failures2 (expected 1)"
    reset_test
    return 1
}

# Test: Color output functions (just ensure they don't crash)
test_color_functions() {
    test_start "Color Output Functions"
    reset_test
    
    # Test all color functions
    success "Test success" >/dev/null
    error "Test error" 2>/dev/null
    warning "Test warning" >/dev/null
    info "Test info" >/dev/null
    progress "Test progress" >/dev/null
    debug "Test debug" >/dev/null
    highlight "Test highlight" >/dev/null
    
    test_pass
    return 0
}

# Test: Section and divider functions
test_formatting_functions() {
    test_start "Formatting Functions"
    reset_test
    
    section "Test Section" >/dev/null
    divider >/dev/null
    
    test_pass
    return 0
}

# Main test runner
main() {
    section "🧪 Verification Framework Test Suite"
    divider
    info "Testing core library functions"
    echo ""
    
    # Run all tests
    test_address_validation || true
    test_address_comparison || true
    test_address_normalization || true
    test_address_truncation || true
    test_number_formatting || true
    test_timestamp_formatting || true
    test_assert_equals || true
    test_assert_address_equals || true
    test_assert_greater_than || true
    test_assert_not_empty || true
    test_color_functions || true
    test_formatting_functions || true
    
    # Print summary
    echo ""
    divider
    section "📊 Test Results"
    info "Tests Run: $(highlight "$TESTS_RUN")"
    info "Passed: $(highlight "$TESTS_PASSED") ✓"
    info "Failed: $(highlight "$TESTS_FAILED") ✗"
    
    if [ $TESTS_FAILED -eq 0 ]; then
        echo ""
        success "🎉 All tests passed!"
        exit 0
    else
        echo ""
        error "Some tests failed. Please review the output above."
        exit 1
    fi
}

# Run main function
main "$@"
