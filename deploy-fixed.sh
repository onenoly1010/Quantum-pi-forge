#!/bin/bash
set -e

# Color output for clarity
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Error handler
error_exit() {
    echo -e "${RED}✗ Deployment failed: $1${NC}" >&2
    exit 1
}

log_step() {
    echo -e "${GREEN}→ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

# 1. Production Build
log_step "Building Quantum Pi Forge..."
if ! npm run build; then
    error_exit "Build failed. Ensure Next.js is installed and vite.config.ts is properly configured."
fi

# Check if dist directory was created
if [ ! -d "./dist" ] && [ ! -d "./.next" ]; then
    error_exit "Build output directory not found. Next.js should create ./.next directory (configured in wrangler.toml as pages_build_output_dir)"
fi

BUILD_OUTPUT_DIR="${BUILD_OUTPUT_DIR:-./.next}"
log_step "Using build output directory: $BUILD_OUTPUT_DIR"

# 2. Deploy to Cloudflare Pages
log_step "Installing Wrangler CLI if not present..."
npm list -g @cloudflare/wrangler >/dev/null 2>&1 || npm install -g @cloudflare/wrangler

log_step "Deploying to Cloudflare Pages..."
if ! npx wrangler pages deploy "$BUILD_OUTPUT_DIR" --project-name=quantum-pi-forge; then
    error_exit "Cloudflare Pages deployment failed. Ensure:"
    echo "  - You are authenticated: wrangler login"
    echo "  - wrangler.toml is configured with [env.production] section"
    echo "  - Project 'quantum-pi-forge' exists in Cloudflare account"
fi

# 3. Decentralized Redundancy (Pinning to IPFS/Filecoin)
log_warning "IPFS/Filecoin pinning requires additional setup"
log_step "Checking for Web3 storage credentials..."

if [ -z "$WEB3_STORAGE_TOKEN" ]; then
    log_warning "WEB3_STORAGE_TOKEN not set. Skipping IPFS pinning."
    log_warning "To enable: export WEB3_STORAGE_TOKEN=<your-token> or set in .env"
    log_warning "Get a token from: https://web3.storage"
else
    log_step "Pinning build to IPFS via Web3.Storage..."
    
    # Install web3.storage CLI if needed
    npm list -g web3.storage >/dev/null 2>&1 || npm install -g web3.storage
    
    # Attempt to pin directory
    if BUILD_CID=$(w3 upload "$BUILD_OUTPUT_DIR" 2>&1 | grep -oE "bafy[A-Za-z0-9]{58}" | head -1); then
        log_step "Build pinned! CID: $BUILD_CID"
        
        # Create deployment log
        mkdir -p ./logs
        echo "$(date -u +%Y-%m-%dT%H:%M:%SZ): $BUILD_CID - Cloudflare Pages + IPFS" >> ./logs/deployment_history.log
        log_step "Deployment logged to ./logs/deployment_history.log"
    else
        log_warning "IPFS pinning failed or returned no CID. Cloudflare deployment succeeded (primary target)."
    fi
fi

log_step "✓ Deployment complete!"
