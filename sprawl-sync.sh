#!/bin/bash
# OINIO Soul System: Master Sprawl Synchronization
# Sovereign Steward Sync Script
# Align all remote environments with Local Prime Truth
# Executed automatically by Cline/Codex agents on secret rotation

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ENV_FILE=".env.production"

if [ ! -f "$ENV_FILE" ]; then
    echo -e "${RED}❌ $ENV_FILE not found - cannot sync${NC}"
    exit 1
fi

echo ""
echo "🔮 OINIO Quantum Forge - Sovereign Sprawl Synchronization"
echo "========================================================"
echo ""

# 1. GitHub: Repository & Environment Secrets
echo "🛡️ Syncing GitHub Repository Secrets..."
gh secret set -f "$ENV_FILE"
echo "   ✅ GitHub secrets synchronized"

# 2. Cloudflare Pages: Monitor v2 Secrets
echo "⛅ Syncing Cloudflare Pages (Monitor v2)..."
wrangler secret bulk "$ENV_FILE" || echo "   ⚠️ Wrangler sync completed with warnings"
echo "   ✅ Cloudflare secrets synchronized"

# 3. Supabase: Database & Edge Function Keys
echo "⚡ Syncing Supabase Edge Function Secrets..."
while IFS= read -r line || [[ -n "$line" ]]; do
  if [[ ! "$line" =~ ^# ]] && [[ -n "$line" ]] && [[ "$line" == *"="* ]]; then
    supabase secrets set "$line" > /dev/null 2>&1
  fi
done < "$ENV_FILE"
echo "   ✅ Supabase secrets synchronized"

# 4. Railway: Backend Infrastructure
echo "🛤️ Syncing Railway Environment Variables..."
railway variables set --all < "$ENV_FILE" > /dev/null 2>&1
echo "   ✅ Railway variables synchronized"

# 5. 0G Aristotle: Decentralized Storage & Wallet
echo "🌐 Initializing 0G Storage Environment..."
if [ -d "0g-storage-ts-starter-kit" ]; then
  cp "$ENV_FILE" 0g-storage-ts-starter-kit/.env
  echo "   ✅ 0G Storage environment updated"
else
  echo "   ⚠️ 0G Storage directory not found, skipping"
fi

# 6. Local Agent Proxy Environment
echo "🔌 Syncing LiteLLM Proxy Environment..."
cp "$ENV_FILE" .env.proxy
echo "   ✅ Local proxy environment updated"

echo ""
echo "========================================================"
echo -e "${GREEN}✅ SPRAWL SYNC COMPLETE${NC}"
echo ""
echo "All agents are now authorized across the Forge."
echo "Sovereign truth propagated to all endpoints."
echo ""

exit 0