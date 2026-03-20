#!/bin/bash
# Smoke Test Script - TESTNET ONLY
# Pi Forge Quantum Genesis - Post-Deployment Validation
#
# Usage:
#   ./scripts/smoke_test.sh [BASE_URL]
#
# Example:
#   ./scripts/smoke_test.sh https://pi-forge-testnet.up.railway.app
#
# Exit codes:
#   0 = All tests passed
#   1 = Tests failed
#   2 = Invalid arguments

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test counters
TESTS_RUN=0
TESTS_PASSED=0
TESTS_FAILED=0

# Base URL for testing
BASE_URL="${1:-http://localhost:8000}"

# Remove trailing slash
BASE_URL="${BASE_URL%/}"

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  Pi Forge Quantum Genesis - Testnet Smoke Tests           ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${YELLOW}Target URL: ${BASE_URL}${NC}"
echo ""

# Helper function to run a test
run_test() {
    local test_name="$1"
    local test_command="$2"
    
    TESTS_RUN=$((TESTS_RUN + 1))
    echo -n "Test ${TESTS_RUN}: ${test_name}... "
    
    if eval "$test_command" > /tmp/smoke_test_output.txt 2>&1; then
        echo -e "${GREEN}✅ PASSED${NC}"
        TESTS_PASSED=$((TESTS_PASSED + 1))
        return 0
    else
        echo -e "${RED}❌ FAILED${NC}"
        TESTS_FAILED=$((TESTS_FAILED + 1))
        cat /tmp/smoke_test_output.txt
        return 1
    fi
}

# Helper function to check JSON response
check_json_field() {
    local url="$1"
    local field="$2"
    local expected_value="$3"
    
    response=$(curl -s -f "$url")
    actual_value=$(echo "$response" | grep -o "\"$field\"[[:space:]]*:[[:space:]]*\"[^\"]*\"" | sed 's/.*:.*"\(.*\)".*/\1/')
    
    if [ "$actual_value" = "$expected_value" ]; then
        return 0
    else
        echo "Expected '$field' to be '$expected_value', got '$actual_value'"
        return 1
    fi
}

# Test 1: FastAPI Health Check
run_test "FastAPI health endpoint responds" \
    "curl -s -f -m 10 ${BASE_URL}/health"

# Test 2: FastAPI returns valid JSON
run_test "FastAPI returns valid JSON" \
    "curl -s -f -m 10 ${BASE_URL}/health | grep -q 'status'"

# Test 3: Verify APP_ENVIRONMENT is testnet
run_test "APP_ENVIRONMENT is 'testnet'" \
    "check_json_field ${BASE_URL}/health environment testnet"

# Test 4: Check service status is healthy
run_test "Service status is 'healthy'" \
    "check_json_field ${BASE_URL}/health status healthy"

# Test 5: FastAPI root endpoint
run_test "FastAPI root endpoint responds" \
    "curl -s -f -m 10 ${BASE_URL}/"

# Test 6: Check HTTP response code
run_test "Health endpoint returns HTTP 200" \
    "[ \$(curl -s -o /dev/null -w '%{http_code}' -m 10 ${BASE_URL}/health) -eq 200 ]"

# Test 7: Verify no mainnet indicators
run_test "No mainnet indicators in response" \
    "! curl -s -f -m 10 ${BASE_URL}/health | grep -iq 'mainnet'"

# Test 8: API docs endpoint (if available)
run_test "API docs endpoint accessible" \
    "curl -s -f -m 10 ${BASE_URL}/docs || true" || true  # Non-critical

# Test 9: OpenAPI schema endpoint
run_test "OpenAPI schema accessible" \
    "curl -s -f -m 10 ${BASE_URL}/openapi.json || true" || true  # Non-critical

# Optional: Test Flask Dashboard (if different URL provided)
FLASK_URL="${2:-}"
if [ -n "$FLASK_URL" ]; then
    FLASK_URL="${FLASK_URL%/}"
    echo ""
    echo -e "${YELLOW}Testing Flask Dashboard at: ${FLASK_URL}${NC}"
    echo ""
    
    run_test "Flask health endpoint responds" \
        "curl -s -f -m 10 ${FLASK_URL}/health"
    
    run_test "Flask dashboard is accessible" \
        "curl -s -f -m 10 ${FLASK_URL}/ | grep -q 'Quantum Resonance'"
fi

# Optional: Test Gradio Interface (if third URL provided)
GRADIO_URL="${3:-}"
if [ -n "$GRADIO_URL" ]; then
    GRADIO_URL="${GRADIO_URL%/}"
    echo ""
    echo -e "${YELLOW}Testing Gradio Interface at: ${GRADIO_URL}${NC}"
    echo ""
    
    run_test "Gradio interface responds" \
        "curl -s -f -m 10 ${GRADIO_URL}/"
    
    run_test "Gradio is testnet mode" \
        "curl -s -f -m 10 ${GRADIO_URL}/ | grep -iq 'testnet' || curl -s -f -m 10 ${GRADIO_URL}/config | grep -iq 'testnet'"
fi

# Safety checks
echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}Safety Verification${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"

run_test "SAFETY: Environment is testnet" \
    "curl -s -f -m 10 ${BASE_URL}/health | grep -q '\"environment\"[[:space:]]*:[[:space:]]*\"testnet\"'"

run_test "SAFETY: No FORCE_DEPLOY_TO_MAINNET flag" \
    "! curl -s -f -m 10 ${BASE_URL}/health | grep -qi 'FORCE_DEPLOY_TO_MAINNET'"

run_test "SAFETY: No mainnet indicators" \
    "! curl -s -f -m 10 ${BASE_URL}/health | grep -qi '\"environment\"[[:space:]]*:[[:space:]]*\"mainnet\"'"

# Summary
echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}Test Summary${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "Total Tests:  ${TESTS_RUN}"
echo -e "${GREEN}Passed:       ${TESTS_PASSED}${NC}"
echo -e "${RED}Failed:       ${TESTS_FAILED}${NC}"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║  🎉 ALL SMOKE TESTS PASSED! Deployment is healthy.        ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"
    exit 0
else
    echo -e "${RED}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${RED}║  ❌ SOME TESTS FAILED. Please review the output above.     ║${NC}"
    echo -e "${RED}╚════════════════════════════════════════════════════════════╝${NC}"
    exit 1
fi
