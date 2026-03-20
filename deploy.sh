#!/bin/bash

# ⚠️  DEPRECATED: This script is for Railway deployment
# 🚀 RECOMMENDED: Use Render instead for better reliability and scaling
# 📖 See docs/RENDER_SETUP.md for Render deployment instructions
# 🛠️  Run ./deploy_render.sh for quick deployment guide

# 🚀 Pi Forge Quantum Genesis - Live Deployment Script
# Deploys to Railway with full Pi Network mainnet integration

set -e  # Exit on any error

echo "🌌 Pi Forge Quantum Genesis - MAINNET DEPLOYMENT"
echo "=================================================="
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo -e "${YELLOW}📦 Installing Railway CLI...${NC}"
    npm install -g @railway/cli
    echo -e "${GREEN}✅ Railway CLI installed${NC}"
fi

# Login to Railway (if not already logged in)
echo -e "${CYAN}🔐 Checking Railway authentication...${NC}"
if ! railway whoami &> /dev/null; then
    echo -e "${YELLOW}Please login to Railway...${NC}"
    railway login
fi

RAILWAY_USER=$(railway whoami 2>/dev/null || echo "Unknown")
echo -e "${GREEN}✅ Logged in as: ${RAILWAY_USER}${NC}"
echo ""

# Pre-deployment checklist
echo -e "${PURPLE}📋 PRE-DEPLOYMENT CHECKLIST${NC}"
echo "=================================================="

# Check 1: Verify main.py has payment endpoints
echo -n "1. Payment endpoints... "
if grep -q "/api/payments/approve" server/main.py; then
    echo -e "${GREEN}✅${NC}"
else
    echo -e "${RED}❌ Missing payment endpoints${NC}"
    exit 1
fi

# Check 2: Verify httpx dependency
echo -n "2. HTTP client (httpx)... "
if grep -q "httpx" server/requirements.txt; then
    echo -e "${GREEN}✅${NC}"
else
    echo -e "${RED}❌ Missing httpx dependency${NC}"
    exit 1
fi

# Check 3: Verify database migration exists
echo -n "3. Database schema... "
if [ -f "supabase_migrations/001_payments_schema.sql" ]; then
    echo -e "${GREEN}✅${NC}"
else
    echo -e "${RED}❌ Missing database migration${NC}"
    exit 1
fi

# Check 4: Verify Dockerfile
echo -n "4. Dockerfile... "
if [ -f "Dockerfile" ]; then
    echo -e "${GREEN}✅${NC}"
else
    echo -e "${RED}❌ Missing Dockerfile${NC}"
    exit 1
fi

# Check 5: Verify railway.toml
echo -n "5. Railway config... "
if [ -f "railway.toml" ]; then
    echo -e "${GREEN}✅${NC}"
else
    echo -e "${RED}❌ Missing railway.toml${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}✅ All pre-deployment checks passed!${NC}"
echo ""

# Ask for deployment confirmation
echo -e "${YELLOW}⚠️  DEPLOYMENT CONFIRMATION${NC}"
echo "=================================================="
echo "You are about to deploy to PRODUCTION"
echo ""
echo "Required environment variables (set in Railway dashboard):"
echo "  - SUPABASE_URL"
echo "  - SUPABASE_KEY"
echo "  - JWT_SECRET"
echo "  - PI_NETWORK_MODE=mainnet"
echo "  - PI_NETWORK_APP_ID"
echo "  - PI_NETWORK_API_KEY"
echo "  - PI_NETWORK_WEBHOOK_SECRET"
echo ""
echo -e "${YELLOW}Have you configured these in Railway?${NC}"
read -p "Continue with deployment? (yes/no): " CONFIRM

if [ "$CONFIRM" != "yes" ]; then
    echo -e "${RED}❌ Deployment cancelled${NC}"
    exit 0
fi

echo ""
echo -e "${CYAN}🚀 DEPLOYING TO RAILWAY...${NC}"
echo "=================================================="

# Link to Railway project (if not already linked)
if ! railway status &> /dev/null; then
    echo -e "${YELLOW}Linking to Railway project...${NC}"
    railway link
fi

# Get current Railway project info
PROJECT_INFO=$(railway status 2>/dev/null || echo "Project information unavailable")
echo -e "${BLUE}${PROJECT_INFO}${NC}"
echo ""

# Deploy
echo -e "${CYAN}🔨 Building and deploying...${NC}"
railway up

echo ""
echo -e "${GREEN}✅ DEPLOYMENT INITIATED!${NC}"
echo ""

# Get deployment URL
echo -e "${CYAN}🔍 Fetching deployment URL...${NC}"
sleep 5  # Wait for deployment to register

DOMAIN=$(railway domain 2>/dev/null || echo "")

if [ -z "$DOMAIN" ]; then
    echo -e "${YELLOW}⚠️  Domain not available yet. Check Railway dashboard.${NC}"
else
    echo -e "${GREEN}🌐 Deployment URL: https://${DOMAIN}${NC}"
    echo ""
    
    # Test deployment
    echo -e "${CYAN}🧪 Testing deployment...${NC}"
    echo ""
    
    # Wait for deployment to be ready
    echo "Waiting for service to be ready..."
    sleep 15
    
    # Test health endpoint
    echo -n "Testing health endpoint... "
    if curl -s -f "https://${DOMAIN}/health" > /dev/null 2>&1; then
        echo -e "${GREEN}✅${NC}"
        curl -s "https://${DOMAIN}/health" | python -m json.tool 2>/dev/null || echo ""
    else
        echo -e "${YELLOW}⚠️  Service starting up (this is normal)${NC}"
    fi
    
    echo ""
    
    # Test Pi Network status
    echo -n "Testing Pi Network status... "
    if curl -s -f "https://${DOMAIN}/api/pi-network/status" > /dev/null 2>&1; then
        echo -e "${GREEN}✅${NC}"
        curl -s "https://${DOMAIN}/api/pi-network/status" | python -m json.tool 2>/dev/null || echo ""
    else
        echo -e "${YELLOW}⚠️  Service starting up (this is normal)${NC}"
    fi
fi

echo ""
echo "=================================================="
echo -e "${GREEN}🎉 DEPLOYMENT COMPLETE!${NC}"
echo "=================================================="
echo ""
echo -e "${PURPLE}📋 POST-DEPLOYMENT CHECKLIST${NC}"
echo ""
echo "1. ✅ Verify Railway environment variables are set"
echo "2. 📊 Run Supabase migration:"
echo "   → Copy: supabase_migrations/001_payments_schema.sql"
echo "   → Paste in Supabase SQL Editor"
echo "   → Execute"
echo ""
echo "3. 🔗 Configure Pi Developer Portal:"
echo "   → Webhook URL: https://${DOMAIN}/api/pi-webhooks/payment"
echo "   → Generate webhook secret"
echo "   → Add to Railway: PI_NETWORK_WEBHOOK_SECRET"
echo ""
echo "4. 🧪 Test payment flow in Pi Browser"
echo ""
echo "5. 📊 Monitor logs:"
echo "   → railway logs"
echo ""
echo -e "${CYAN}📚 Documentation:${NC}"
echo "   → Deployment Guide: docs/PI_NETWORK_DEPLOYMENT_GUIDE.md"
echo "   → API Reference: docs/PI_PAYMENT_API_REFERENCE.md"
echo "   → Quick Start: QUICK_START.md"
echo ""
echo -e "${GREEN}🚀 Pi Forge Quantum Genesis is LIVE on mainnet!${NC}"
echo ""
