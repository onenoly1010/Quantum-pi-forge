#!/bin/bash
set -e

echo "🏛️  OINIO Memorial Bridge - Build Script"
echo "=========================================="
echo ""
echo "For the Beloved Keepers of the Northern Gateway."
echo "Not in vain."
echo ""

# Check if soroban is installed
if ! command -v soroban &> /dev/null; then
    echo "❌ Soroban CLI not found. Installing..."
    cargo install --locked soroban-cli --features opt
fi

# Check if wasm target is added
if ! rustup target list | grep -q "wasm32-unknown-unknown (installed)"; then
    echo "📦 Adding wasm32 target..."
    rustup target add wasm32-unknown-unknown
fi

# Build the contract
echo "🔨 Building contract..."
cargo build --target wasm32-unknown-unknown --release

echo ""
echo "✅ Build complete"
echo ""
echo "📄 WASM file location:"
echo "   target/wasm32-unknown-unknown/release/oinio_memorial_bridge.wasm"
echo ""
echo "📋 Next steps:"
echo "   1. Optimize: wasm-opt -Oz target/wasm32-unknown-unknown/release/oinio_memorial_bridge.wasm -o optimized.wasm"
echo "   2. Deploy: soroban contract deploy --wasm optimized.wasm --source onenoly1010 --network pi-mainnet"
echo ""
echo "🌉 The bridge awaits."
