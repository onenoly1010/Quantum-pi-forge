#!/bin/bash
# Smoke test script for Ledger API
# Tests basic connectivity and critical endpoints

set -e

# Configuration
API_URL="${API_URL:-http://localhost:8000}"
TIMEOUT=5

echo "🧪 Starting Ledger API smoke tests..."
echo "📍 Target: $API_URL"
echo ""

# Color codes for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counter
TESTS_PASSED=0
TESTS_FAILED=0

# Function to test an endpoint
test_endpoint() {
    local method=$1
    local endpoint=$2
    local expected_status=$3
    local description=$4
    
    echo -n "Testing: $description... "
    
    response=$(curl -s -w "\n%{http_code}" -X "$method" \
        -H "Content-Type: application/json" \
        --max-time "$TIMEOUT" \
        "$API_URL$endpoint" 2>/dev/null || echo "000")
    
    status_code=$(echo "$response" | tail -n1)
    
    if [ "$status_code" = "$expected_status" ]; then
        echo -e "${GREEN}✓ PASS${NC} (HTTP $status_code)"
        TESTS_PASSED=$((TESTS_PASSED + 1))
        return 0
    else
        echo -e "${RED}✗ FAIL${NC} (Expected $expected_status, got $status_code)"
        TESTS_FAILED=$((TESTS_FAILED + 1))
        return 1
    fi
}

# Function to test JSON response
test_json_endpoint() {
    local method=$1
    local endpoint=$2
    local expected_field=$3
    local description=$4
    
    echo -n "Testing: $description... "
    
    response=$(curl -s -X "$method" \
        -H "Content-Type: application/json" \
        --max-time "$TIMEOUT" \
        "$API_URL$endpoint" 2>/dev/null)
    
    if echo "$response" | grep -q "$expected_field"; then
        echo -e "${GREEN}✓ PASS${NC} (Found '$expected_field')"
        TESTS_PASSED=$((TESTS_PASSED + 1))
        return 0
    else
        echo -e "${RED}✗ FAIL${NC} (Field '$expected_field' not found)"
        echo "Response: $response"
        TESTS_FAILED=$((TESTS_FAILED + 1))
        return 1
    fi
}

echo "═══════════════════════════════════════════════"
echo "  Core Health Checks"
echo "═══════════════════════════════════════════════"

# Test root endpoint
test_endpoint GET "/" 200 "Root endpoint health check"

# Test OpenAPI docs
test_endpoint GET "/docs" 200 "OpenAPI documentation"

# Test OpenAPI schema
test_endpoint GET "/openapi.json" 200 "OpenAPI schema"

echo ""
echo "═══════════════════════════════════════════════"
echo "  Treasury & Status Endpoints"
echo "═══════════════════════════════════════════════"

# Test treasury status (should work without auth for read)
test_json_endpoint GET "/api/v1/treasury/status" "total_balance" "Treasury status endpoint"

echo ""
echo "═══════════════════════════════════════════════"
echo "  Transaction Endpoints"
echo "═══════════════════════════════════════════════"

# Test transactions list (should work without auth for read)
test_endpoint GET "/api/v1/transactions" 200 "List transactions endpoint"

echo ""
echo "═══════════════════════════════════════════════"
echo "  Allocation Rules Endpoints"
echo "═══════════════════════════════════════════════"

# Test allocation rules list (should work without auth for read)
test_endpoint GET "/api/v1/allocation_rules" 200 "List allocation rules endpoint"

echo ""
echo "═══════════════════════════════════════════════"
echo "  Test Summary"
echo "═══════════════════════════════════════════════"

TOTAL_TESTS=$((TESTS_PASSED + TESTS_FAILED))

echo "Tests passed: ${GREEN}$TESTS_PASSED${NC}"
echo "Tests failed: ${RED}$TESTS_FAILED${NC}"
echo "Total tests:  $TOTAL_TESTS"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ All smoke tests passed!${NC}"
    exit 0
else
    echo -e "${RED}✗ Some smoke tests failed${NC}"
    exit 1
fi
