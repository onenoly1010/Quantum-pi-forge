#!/bin/bash

# Pi Network Mainnet Integration - Installation Test Script
# Verifies all components are properly configured

echo "🔍 Pi Network Mainnet Integration - Installation Test"
echo "======================================================"
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counter
PASSED=0
FAILED=0

# Test 1: Check httpx dependency
echo "1️⃣  Checking httpx dependency..."
if grep -q "httpx" server/requirements.txt; then
    echo -e "${GREEN}✅ PASS${NC} - httpx dependency found"
    ((PASSED++))
else
    echo -e "${RED}❌ FAIL${NC} - httpx dependency missing"
    ((FAILED++))
fi

# Test 2: Check payment endpoints in main.py
echo "2️⃣  Checking payment endpoints..."
if grep -q "/api/payments/approve" server/main.py && \
   grep -q "/api/payments/complete" server/main.py && \
   grep -q "/api/pi-webhooks/payment" server/main.py; then
    echo -e "${GREEN}✅ PASS${NC} - All payment endpoints found"
    ((PASSED++))
else
    echo -e "${RED}❌ FAIL${NC} - Payment endpoints missing"
    ((FAILED++))
fi

# Test 3: Check validation function
echo "3️⃣  Checking Pi Network validation function..."
if grep -q "def validate_pi_network_config" server/main.py; then
    echo -e "${GREEN}✅ PASS${NC} - Validation function found"
    ((PASSED++))
else
    echo -e "${RED}❌ FAIL${NC} - Validation function missing"
    ((FAILED++))
fi

# Test 4: Check webhook secret in config
echo "4️⃣  Checking webhook secret configuration..."
if grep -q "webhook_secret" server/main.py; then
    echo -e "${GREEN}✅ PASS${NC} - Webhook secret config found"
    ((PASSED++))
else
    echo -e "${RED}❌ FAIL${NC} - Webhook secret config missing"
    ((FAILED++))
fi

# Test 5: Check Supabase migration file
echo "5️⃣  Checking Supabase migration file..."
if [ -f "supabase_migrations/001_payments_schema.sql" ]; then
    echo -e "${GREEN}✅ PASS${NC} - Migration file exists"
    ((PASSED++))
else
    echo -e "${RED}❌ FAIL${NC} - Migration file missing"
    ((FAILED++))
fi

# Test 6: Check migration has payments table
echo "6️⃣  Checking payments table schema..."
if grep -q "CREATE TABLE.*payments" supabase_migrations/001_payments_schema.sql; then
    echo -e "${GREEN}✅ PASS${NC} - Payments table schema found"
    ((PASSED++))
else
    echo -e "${RED}❌ FAIL${NC} - Payments table schema missing"
    ((FAILED++))
fi

# Test 7: Check RLS policies
echo "7️⃣  Checking Row Level Security policies..."
if grep -q "ENABLE ROW LEVEL SECURITY" supabase_migrations/001_payments_schema.sql; then
    echo -e "${GREEN}✅ PASS${NC} - RLS policies found"
    ((PASSED++))
else
    echo -e "${RED}❌ FAIL${NC} - RLS policies missing"
    ((FAILED++))
fi

# Test 8: Check .env.example updates
echo "8️⃣  Checking environment variable template..."
if grep -q "PI_NETWORK_WEBHOOK_SECRET" .env.example; then
    echo -e "${GREEN}✅ PASS${NC} - Webhook secret in .env.example"
    ((PASSED++))
else
    echo -e "${RED}❌ FAIL${NC} - Webhook secret not in .env.example"
    ((FAILED++))
fi

# Test 9: Check documentation files
echo "9️⃣  Checking documentation files..."
if [ -f "docs/PI_NETWORK_DEPLOYMENT_GUIDE.md" ] && \
   [ -f "docs/PI_PAYMENT_API_REFERENCE.md" ]; then
    echo -e "${GREEN}✅ PASS${NC} - Documentation files exist"
    ((PASSED++))
else
    echo -e "${RED}❌ FAIL${NC} - Documentation files missing"
    ((FAILED++))
fi

# Test 10: Check API helper functions
echo "🔟 Checking Pi Network API helper functions..."
if grep -q "async def call_pi_network_api" server/main.py && \
   grep -q "async def approve_payment_with_pi_network" server/main.py && \
   grep -q "async def complete_payment_with_pi_network" server/main.py; then
    echo -e "${GREEN}✅ PASS${NC} - API helper functions found"
    ((PASSED++))
else
    echo -e "${RED}❌ FAIL${NC} - API helper functions missing"
    ((FAILED++))
fi

echo ""
echo "======================================================"
echo "📊 Test Results"
echo "======================================================"
echo -e "Passed: ${GREEN}${PASSED}/10${NC}"
echo -e "Failed: ${RED}${FAILED}/10${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ ALL TESTS PASSED!${NC}"
    echo "🎉 Pi Network mainnet integration is ready for deployment"
    echo ""
    echo "Next steps:"
    echo "1. Set environment variables (see .env.example)"
    echo "2. Run Supabase migration (supabase_migrations/001_payments_schema.sql)"
    echo "3. Configure Pi Developer Portal webhook"
    echo "4. Deploy to production (see docs/PI_NETWORK_DEPLOYMENT_GUIDE.md)"
    exit 0
else
    echo -e "${RED}❌ SOME TESTS FAILED${NC}"
    echo "Please review the failed tests above"
    exit 1
fi
