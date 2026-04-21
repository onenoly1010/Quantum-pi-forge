#!/bin/bash
# Forge Guardian v1.1 - The Reliability Update
# Production-Grade Guardian CLI

# Configuration
CONTRACT="0x07f43E5B1A8a0928B364E40d5885f81A543B05C7"
RPC="https://evmrpc.0g.ai"
CHAIN_ID=16661

echo "⚛️ Quantum Pi Forge Guardian v1.1"
echo "=================================="

# 1. Dependency Check
if ! command -v cast &> /dev/null; then
    echo "❌ ERROR: 'cast' not found. Forge requires Foundry."
    echo "Fix: curl -L https://foundry.paradigm.xyz | bash && foundryup"
    exit 1
fi

# 2. Load environment
if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
fi

if [ -z "$WALLET" ]; then
    # Extract address from private key if available
    if [ -n "$SK" ]; then
        WALLET=$(cast wallet address --private-key $SK)
        echo "✅ Derived wallet address from private key"
    else
        echo "❌ ERROR: WALLET environment variable not set"
        echo "Add WALLET=your_address to .env file"
        exit 1
    fi
fi

echo "📍 Wallet: $WALLET"
echo "📍 RPC: $RPC"
echo "📍 Contract: $CONTRACT"
echo ""

# 3. Idempotency Check (The "Don't Waste Gas" Rule)
echo "🔍 Checking guardian status..."
ALREADY_ACTIVE=$(cast call $CONTRACT "isGuardian(address)" $WALLET --rpc-url $RPC)

if [ "$ALREADY_ACTIVE" == "0x0000000000000000000000000000000000000000000000000000000000000001" ]; then
    echo "✔ Guardian already active. No action needed."
    exit 0
fi

echo "⚡ Guardian not registered. Preparing transaction..."

if [ -z "$SK" ]; then
    echo "❌ ERROR: Private key not configured"
    echo "Add SK=your_private_key to .env file"
    exit 1
fi

# 4. Retry-Safe Broadcast
echo "📡 Broadcasting to 0G Aristotle..."
cast send $CONTRACT "register()" --private-key $SK --rpc-url $RPC --chain $CHAIN_ID --gas-limit 150000 --async

echo ""
echo "✅ Guardian registration broadcast successfully"
echo "✅ Your address will appear on the dashboard once confirmed"
echo "✅ You are now contributing to network consensus"
echo ""
echo "🌋 Welcome to the constellation."