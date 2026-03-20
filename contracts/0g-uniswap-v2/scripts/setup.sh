#!/bin/bash

# =============================================================================
# Setup Script for 0G Uniswap V2 Fork
# =============================================================================
# This script initializes the Foundry project with all required dependencies
# Usage: ./scripts/setup.sh
# =============================================================================

set -e  # Exit on error

echo "==================================="
echo "0G Uniswap V2 Fork - Setup Script"
echo "==================================="
echo ""

# Check if foundry is installed
if ! command -v forge &> /dev/null; then
    echo "❌ Foundry not found!"
    echo "Please install Foundry: https://book.getfoundry.sh/getting-started/installation"
    echo "Run: curl -L https://foundry.paradigm.xyz | bash && foundryup"
    exit 1
fi

echo "✅ Foundry detected: $(forge --version | head -n1)"
echo ""

# Navigate to project directory
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_DIR"

echo "📁 Project directory: $PROJECT_DIR"
echo ""

# Initialize git if not already initialized
if [ ! -d ".git" ]; then
    echo "🔧 Initializing git repository..."
    git init
fi

# Install forge-std
echo "📦 Installing forge-std..."
if [ ! -d "lib/forge-std" ]; then
    forge install foundry-rs/forge-std --no-commit
else
    echo "   forge-std already installed"
fi

# Install OpenZeppelin contracts
echo "📦 Installing OpenZeppelin contracts..."
if [ ! -d "lib/openzeppelin-contracts" ]; then
    forge install OpenZeppelin/openzeppelin-contracts@v4.9.3 --no-commit
else
    echo "   OpenZeppelin contracts already installed"
fi

# Install Uniswap V2 Core
echo "📦 Installing Uniswap V2 Core..."
if [ ! -d "lib/v2-core" ]; then
    forge install Uniswap/v2-core --no-commit
else
    echo "   Uniswap V2 Core already installed"
fi

# Install Uniswap V2 Periphery
echo "📦 Installing Uniswap V2 Periphery..."
if [ ! -d "lib/v2-periphery" ]; then
    forge install Uniswap/v2-periphery --no-commit
else
    echo "   Uniswap V2 Periphery already installed"
fi

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "   ⚠️  Please edit .env and add your PRIVATE_KEY and DEPLOYER address"
else
    echo "✅ .env file already exists"
fi

# Build contracts
echo ""
echo "🔨 Building contracts..."
forge build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Setup completed successfully!"
    echo ""
    echo "==================================="
    echo "Next Steps:"
    echo "==================================="
    echo "1. Edit .env file with your deployment credentials:"
    echo "   - PRIVATE_KEY (your wallet private key)"
    echo "   - DEPLOYER (your wallet address)"
    echo "   - FEE_TO_SETTER (initially use DEPLOYER address)"
    echo ""
    echo "2. Ensure you have at least 0.5 0G in your deployer wallet"
    echo ""
    echo "3. Run deployment:"
    echo "   ./scripts/deploy.sh"
    echo ""
    echo "4. For testing:"
    echo "   forge test -vvv"
    echo ""
else
    echo ""
    echo "❌ Build failed. Please check errors above."
    exit 1
fi
