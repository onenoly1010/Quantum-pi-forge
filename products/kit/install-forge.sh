#!/bin/bash
# Sovereign Local AI Forge Kit - One Line Installer
# OINIO GDR-001.1 Compliant | Linux Mint / Ubuntu
set -e

echo "███████╗ ██████╗ ██╗   ██╗███████╗██████╗ ███████╗██╗ ██████╗ ███╗   ██╗"
echo "██╔════╝██╔═══██╗██║   ██║██╔════╝██╔══██╗██╔════╝██║██╔════╝ ████╗  ██║"
echo "███████╗██║   ██║██║   ██║█████╗  ██████╔╝█████╗  ██║██║  ███╗██╔██╗ ██║"
echo "╚════██║██║   ██║╚██╗ ██╔╝██╔══╝  ██╔══██╗██╔══╝  ██║██║   ██║██║╚██╗██║"
echo "███████║╚██████╔╝ ╚████╔╝ ███████╗██║  ██║██║     ██║╚██████╔╝██║ ╚████║"
echo "╚══════╝ ╚═════╝   ╚═══╝  ╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝ ╚═════╝ ╚═╝  ╚═══╝"
echo ""
echo "SOVEREIGN LOCAL AI WORKPLACE INSTALLER"
echo "No cloud. No tokens. No surveillance. Just your Forge."
echo ""

# System update & dependencies
sudo apt update && sudo apt install -y git curl wget python3-pip python3-venv

# Install Ollama
curl -fsSL https://ollama.com/install.sh | sh

# Pull optimized models
ollama pull qwen2.5-coder:14b
ollama pull qwen2.5-coder:7b
ollama pull deepseek-r1:32b

# Install Aider
pip install aider-chat

# Install VS Code extensions
code --install-extension Continue.continue
code --install-extension ms-python.python
code --install-extension GitHub.copilot

# Copy configs
mkdir -p ~/.config
cp .aider.conf.yml ~/
cp continue-config.json ~/.continue/config.json
cp oinio-guardian.service /etc/systemd/system/

# Enable Guardian service
sudo systemctl daemon-reload
sudo systemctl enable --now oinio-guardian.service

# Add aliases
cat aliases >> ~/.bashrc

echo ""
echo "✅ INSTALL COMPLETE"
echo ""
echo "Your Sovereign AI Forge is now running."
echo "Log out and back in for aliases to activate."
echo ""
echo "Next steps:"
echo "  1. Open VS Code"
echo "  2. Press Ctrl+Shift+L to open Continue"
echo "  3. Type: 'guardian status'"
echo ""
echo "Welcome to the Constellation."