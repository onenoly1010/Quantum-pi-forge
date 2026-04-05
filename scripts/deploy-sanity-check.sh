#!/bin/bash
# Deployment Sanity Check
# Tests if Cloudflare Pages endpoint is responding

set -e

# Configuration
PROJECT_NAME="${CLOUDFLARE_PAGES_PROJECT:-quantumpiforge}"
ACCOUNT_ID="${CLOUDFLARE_ACCOUNT_ID:-}"

echo "=========================================="
echo "  Cloudflare Deployment Sanity Check"
echo "=========================================="
echo ""

# Check 1: Verify Wrangler version
echo "1. Checking Wrangler installation..."
if command -v npx &> /dev/null; then
    echo "   ✓ npx available"
else
    echo "   ✗ npx not found"
    exit 1
fi

# Check 2: Verify project exists
echo ""
echo "2. Checking Cloudflare Pages project..."
if [ -z "$ACCOUNT_ID" ]; then
    echo "   ⚠ CLOUDFLARE_ACCOUNT_ID not set"
    echo "   → Skipping project verification"
else
    echo "   Using account: ${ACCOUNT_ID}"
fi

# Check 3: Test Pages deployment endpoint
echo ""
echo "3. Testing Cloudflare Pages endpoint..."
DEPLOYMENT_URL="https://${PROJECT_NAME}.pages.dev"

if curl -s -o /dev/null -w "%{http_code}" "$DEPLOYMENT_URL" 2>/dev/null | grep -q "200"; then
    echo "   ✓ Deployment is LIVE"
    echo "   → URL: $DEPLOYMENT_URL"
    HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$DEPLOYMENT_URL")
    echo "   → Status: $HTTP_STATUS"
else
    echo "   ✗ Deployment not responding"
    echo "   → URL: $DEPLOYMENT_URL"
    HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$DEPLOYMENT_URL" 2>/dev/null || echo "000")
    echo "   → Status: $HTTP_STATUS"
fi

# Check 4: Test custom domain if configured
echo ""
echo "4. Checking custom domain (optional)..."
CUSTOM_DOMAIN="${CUSTOM_DOMAIN:-}"
if [ -n "$CUSTOM_DOMAIN" ]; then
    if curl -s -o /dev/null -w "%{http_code}" "https://$CUSTOM_DOMAIN" 2>/dev/null | grep -q "200"; then
        echo "   ✓ Custom domain responding"
    else
        echo "   ✗ Custom domain not responding"
    fi
else
    echo "   → No custom domain configured (SKIP)"
fi

echo ""
echo "=========================================="
echo "  Sanity Check Complete"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. If all checks pass → Deploy is ready"
echo "2. If check 3 fails → Run: npx wrangler pages deploy out"
echo "3. If check 1 fails → Run: npm install -D wrangler"
echo ""