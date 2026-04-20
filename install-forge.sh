#!/bin/bash
set -e

echo "⚡ Quantum Pi Forge Installer v2.1"
echo "=================================="
echo

# RAM Detection - 7GB minimum requirement
TOTAL_RAM_KB=$(grep MemTotal /proc/meminfo | awk '{print $2}')
TOTAL_RAM_GB=$(( TOTAL_RAM_KB / 1024 / 1024 ))

echo "🔍 System Hardware Detection:"
echo "   Total RAM: ${TOTAL_RAM_GB}GB"

if [ "$TOTAL_RAM_GB" -ge 16 ]; then
    MODEL="qwen2.5-coder:7b"
    echo "   ✓ High memory system detected"
elif [ "$TOTAL_RAM_GB" -ge 7 ]; then
    MODEL="qwen2.5-coder:3b"
    echo "   ✓ Standard configuration detected"
else
    echo "   ❌ Insufficient RAM: Minimum 7GB required for Sovereign operation"
    exit 1
fi

echo
echo "📦 Selected Model: $MODEL"
echo

# Install Ollama if not present
if ! command -v ollama &> /dev/null; then
    echo "🔧 Installing Ollama runtime..."
    curl -fsSL https://ollama.com/install.sh | sh
    echo "   ✓ Ollama installed"
fi

# Pull the appropriate model
echo "🔄 Pulling model container: $MODEL"
ollama pull "$MODEL"
echo "   ✓ Model loaded locally"

echo
echo "🛡️  Starting Guardian Validation..."
echo

# Run Guardian in demo mode for immediate success confirmation
python3 guardian_v2.1.py --demo-mode

echo
echo "✅ INSTALLATION COMPLETE"
echo "=================================="
echo
echo "Next steps:"
echo " 1. Run 'aider' to start your sovereign agent workspace"
echo " 2. Use 'forge-status' at any time to check system health"
echo " 3. See QUICKSTART.md for full operation guide"
echo
echo "Welcome to the Sovereign Tech stack."