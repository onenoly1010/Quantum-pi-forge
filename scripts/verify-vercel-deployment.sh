#!/bin/bash
set -euo pipefail

##############################################################################
# Vercel Deployment Verification Script
# Tests static frontend deployment and Pi Network integration readiness
##############################################################################

DEPLOYMENT_URL="${1:-}"
PI_APP_SECRET="${PI_APP_SECRET:-}"

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Counters
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

##############################################################################
# Helper Functions
##############################################################################

log_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

log_success() {
    echo -e "${GREEN}✓${NC} $1"
}

log_error() {
    echo -e "${RED}✗${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

test_http_endpoint() {
    local endpoint="$1"
    local description="$2"
    local expected_status="${3:-200}"
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    log_info "Testing: $description"
    
    local response=$(curl --max-time 10 -s -o /dev/null -w "%{http_code}" "$endpoint" 2>&1)
    
    if [ "$response" = "$expected_status" ]; then
        log_success "$description - Status: $response"
        PASSED_TESTS=$((PASSED_TESTS + 1))
        return 0
    else
        log_error "$description - Expected: $expected_status, Got: $response"
        FAILED_TESTS=$((FAILED_TESTS + 1))
        return 1
    fi
}

test_content_exists() {
    local endpoint="$1"
    local search_text="$2"
    local description="$3"
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    log_info "Testing: $description"
    
    local content=$(curl --max-time 10 -s "$endpoint" 2>&1)
    
    if echo "$content" | grep -q "$search_text"; then
        log_success "$description - Found: '$search_text'"
        PASSED_TESTS=$((PASSED_TESTS + 1))
        return 0
    else
        log_error "$description - Not found: '$search_text'"
        FAILED_TESTS=$((FAILED_TESTS + 1))
        echo "Sample content: ${content:0:200}..."
        return 1
    fi
}

##############################################################################
# Main Verification
##############################################################################

echo "═══════════════════════════════════════════════════════════════════"
echo "  Vercel Deployment Verification"
echo "═══════════════════════════════════════════════════════════════════"
echo ""

# Validate input
if [ -z "$DEPLOYMENT_URL" ]; then
    log_error "Usage: $0 <DEPLOYMENT_URL>"
    log_info "Example: $0 https://your-app.vercel.app"
    exit 1
fi

log_info "Deployment URL: $DEPLOYMENT_URL"
log_info "Starting verification..."
echo ""

##############################################################################
# Test 1: Homepage Accessibility
##############################################################################
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Test Suite 1: Static Site Accessibility"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

test_http_endpoint "$DEPLOYMENT_URL" "Homepage loads" || true
test_http_endpoint "$DEPLOYMENT_URL/index.html" "index.html accessible" || true
test_content_exists "$DEPLOYMENT_URL" "Pi Forge" "Homepage contains 'Pi Forge'" || true

##############################################################################
# Test 2: Frontend Pages
##############################################################################
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Test Suite 2: Frontend Pages"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

test_http_endpoint "$DEPLOYMENT_URL/ceremonial_interface.html" "Ceremonial Interface" || true
test_http_endpoint "$DEPLOYMENT_URL/resonance_dashboard.html" "Resonance Dashboard" || true
test_http_endpoint "$DEPLOYMENT_URL/spectral_command_shell.html" "Spectral Command Shell" "200" || true

##############################################################################
# Test 3: JavaScript Assets
##############################################################################
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Test Suite 3: JavaScript Integration"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

test_http_endpoint "$DEPLOYMENT_URL/pi-forge-integration.js" "Pi Forge Integration Script" || true
test_content_exists "$DEPLOYMENT_URL/pi-forge-integration.js" "PiForge" "Integration script contains PiForge object" || true

##############################################################################
# Test 4: Frontend Directory Structure
##############################################################################
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Test Suite 4: Frontend Directory"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

test_http_endpoint "$DEPLOYMENT_URL/frontend/index.html" "Frontend index.html" "200" || true
test_http_endpoint "$DEPLOYMENT_URL/frontend/pi-forge-integration.js" "Frontend integration.js" "200" || true

##############################################################################
# Test 5: Pi Network SDK Detection
##############################################################################
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Test Suite 5: Pi Network Integration"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check if homepage loads Pi SDK
TOTAL_TESTS=$((TOTAL_TESTS + 1))
log_info "Testing: Pi SDK script tag in homepage"
HOMEPAGE_CONTENT=$(curl --max-time 10 -s "$DEPLOYMENT_URL")
if echo "$HOMEPAGE_CONTENT" | grep -q "sdk.minepi.com/pi-sdk.js"; then
    log_success "Pi SDK script tag found in homepage"
else
    log_warning "Pi SDK script tag not found (may be loaded dynamically)"
fi

##############################################################################
# Test 6: API Proxy Configuration (if configured)
##############################################################################
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Test Suite 6: API Proxy (Optional)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Test if API proxy is configured (should return error if backend not connected)
TOTAL_TESTS=$((TOTAL_TESTS + 1))
log_info "Testing: API proxy configuration"
API_RESPONSE=$(curl --max-time 10 -s -o /dev/null -w "%{http_code}" "$DEPLOYMENT_URL/api/health" 2>&1)

if [ "$API_RESPONSE" = "200" ]; then
    log_success "API proxy working - Backend connected"
elif [ "$API_RESPONSE" = "404" ]; then
    log_warning "API proxy not configured (expected for static-only deployment)"
else
    log_warning "API proxy returned status: $API_RESPONSE"
fi

##############################################################################
# Test 7: Security Headers
##############################################################################
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Test Suite 7: Security Headers"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

TOTAL_TESTS=$((TOTAL_TESTS + 1))
log_info "Testing: X-Frame-Options header"
HEADERS=$(curl --max-time 10 -sI "$DEPLOYMENT_URL")
if echo "$HEADERS" | grep -qi "x-frame-options"; then
    log_success "X-Frame-Options header present"
else
    log_warning "X-Frame-Options header not found"
fi

TOTAL_TESTS=$((TOTAL_TESTS + 1))
log_info "Testing: X-Content-Type-Options header"
if echo "$HEADERS" | grep -qi "x-content-type-options"; then
    log_success "X-Content-Type-Options header present"
else
    log_warning "X-Content-Type-Options header not found"
fi

##############################################################################
# Summary
##############################################################################
echo ""
echo "═══════════════════════════════════════════════════════════════════"
echo "  Verification Summary"
echo "═══════════════════════════════════════════════════════════════════"
echo -e "Total Tests:  ${BLUE}$TOTAL_TESTS${NC}"
echo -e "Passed:       ${GREEN}$PASSED_TESTS${NC}"
echo -e "Failed:       ${RED}$FAILED_TESTS${NC}"
echo ""

if [ $FAILED_TESTS -eq 0 ]; then
    echo -e "${GREEN}✓ All critical tests passed!${NC}"
    echo ""
    log_info "Next steps:"
    echo "  1. Configure backend API URL in Vercel rewrites (vercel.json)"
    echo "  2. Set up environment variables in Vercel dashboard"
    echo "  3. Test Pi Network authentication flow"
    echo "  4. Deploy backend to Railway"
    exit 0
else
    echo -e "${RED}✗ Some tests failed. Please review the errors above.${NC}"
    echo ""
    exit 1
fi
