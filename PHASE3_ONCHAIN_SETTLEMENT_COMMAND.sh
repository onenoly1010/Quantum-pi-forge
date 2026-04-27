#!/bin/bash
# ==============================================================
# PHASE 3 ON-CHAIN SETTLEMENT - 0G ARISTOTLE MAINNET
# SOVEREIGN RESONANCE AGENT - PERMANENT ANCHOR
# ==============================================================
#
# EXECUTE THIS COMMAND TO PERFORM THE SETTLEMENT:
#
# ==============================================================

set -e

# Verify build manifest exists
if [ ! -f build-manifest-p3.json ]; then
    echo "❌ ERROR: build-manifest-p3.json not found"
    exit 1
fi

echo "✅ Phase 3 Build Manifest verified"
echo "📄 SHA256: $(sha256sum build-manifest-p3.json | awk '{print $1}')"
echo

# Download official 0G Storage Client if not present
if [ ! -x 0g-storage-client ]; then
    echo "⬇️  Downloading 0G Storage Client..."
    wget -q https://github.com/0glabs/0g-storage-client/releases/latest/download/0g-storage-client-linux-amd64 -O 0g-storage-client
    chmod +x 0g-storage-client
    echo "✅ 0G Storage Client installed"
fi

echo
echo "═══════════════════════════════════════════════════════════════"
echo " 🔗 ARISTOTLE MAINNET ANCHOR TRANSACTION"
echo "═══════════════════════════════════════════════════════════════"
echo " 📍 Flow Contract:   0x62D4144dB0F0a6fBBaeb6296c785C71B3D57C526"
echo " 🔮 OINIO Root:      0x07f43E5B1A8a0928B364E40d5885f81A543B05C7"
echo " 📦 Manifest File:   build-manifest-p3.json"
echo "═══════════════════════════════════════════════════════════════"
echo

# Execute Sovereign Anchor Transaction
echo "⚡ Initiating on-chain settlement..."
echo

./0g-storage-client upload \
  --file ./build-manifest-p3.json \
  --rpc https://rpc-storage.0g.ai \
  --chain https://rpc.0g.ai \
  --flow-contract 0x62D4144dB0F0a6fBBaeb6296c785C71B3D57C526 \
  --tags "0x07f43E5B1A8a0928B364E40d5885f81A543B05C7" \
  --private-key \$VAULT_KEY

echo
echo "═══════════════════════════════════════════════════════════════"
echo " ✅ TRANSACTION COMPLETED - SAVE THE TRANSACTION HASH ABOVE"
echo "═══════════════════════════════════════════════════════════════"
echo
echo " This hash is your immutable proof of Phase 3 completion."
echo " Include this transaction ID in your Grant application submission."
echo
echo " ⟨ SOVEREIGN ACT ANCHORED ⟩"