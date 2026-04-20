#!/bin/bash
# Offline Dev Guardian v1.5 - Installer
set -e

echo "🛡️ Welcome to Offline Dev Guardian"
echo "================================="
echo ""
echo "This installer will:"
echo "  ✔ Detect your system capabilities"
echo "  ✔ Setup isolated virtual environment"
echo "  ✔ Install Aider coding assistant"
echo "  ✔ Pull optimized local AI model"
echo "  ✔ Run full system validation"
echo ""
echo "🛠️ Initiating setup..."

# 1. Hardware Detection
TOTAL_RAM=$(free -g | awk '/^Mem:/{print $2}')
echo "✔ Detected System RAM: ${TOTAL_RAM}GB"

if [ "$TOTAL_RAM" -lt 10 ]; then
    MODEL="qwen2.5-coder:3b"
    echo "⚠️ Low RAM detected. Selecting optimized model: $MODEL"
else
    MODEL="qwen2.5-coder:7b"
    echo "✅ Selecting performance model: $MODEL"
fi

# 2. Environment Setup
python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip aider-chat psutil requests
echo "✔ Virtual environment and Aider installed."

# 3. Model Provisioning (Requires Ollama)
if command -v ollama &> /dev/null; then
    echo "✔ Ollama detected. Pulling $MODEL..."
    ollama pull $MODEL
else
    echo "❌ Ollama not found. Please install it from ollama.com and re-run."
    exit 1
fi

# 4. Guardian Activation (The Success Hit)
echo "🚀 Running Guardian Initial Validation..."
python3 guardian_v2.1.py --demo-mode

# 5. Global Aliases
echo "alias aider='$(pwd)/venv/bin/aider'" >> ~/.bashrc
echo "alias forge-status='python3 $(pwd)/guardian_v2.1.py --demo-mode'" >> ~/.bashrc
echo "✔ Aliases added to .bashrc. Run 'source ~/.bashrc' to activate."

echo "==============================================="
echo "✅ INSTALLATION COMPLETE. WELCOME TO THE FORGE."
echo "==============================================="