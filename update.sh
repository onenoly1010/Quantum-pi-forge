#!/bin/bash
# Offline Dev Guardian Updater
set -euo pipefail

INSTALL_DIR="$HOME/offline-dev-guardian"

echo "🔄 Running Offline Dev Guardian update..."

# Update system packages
sudo apt-get update -qq
sudo apt-get upgrade -y curl git python3-pip python3-venv inotify-tools

# Update Ollama if installed
if command -v ollama >/dev/null 2>&1; then
    echo "🧠 Updating Ollama..."
    curl -fsSL https://ollama.com/install.sh | sh
fi

# Pull latest models
echo "📥 Pulling latest model versions..."
ollama pull qwen2.5-coder:14b
ollama pull qwen2.5-coder:7b

# Update Aider
echo "🔧 Updating Aider..."
pip3 install --upgrade aider-chat

# Restart guardian service
systemctl --user restart offline-guardian.service 2>/dev/null || true

echo ""
echo "✅ Update complete!"
echo "All components have been updated to latest versions"