#!/bin/bash
# Offline Dev Guardian Uninstaller
set -euo pipefail

INSTALL_DIR="$HOME/offline-dev-guardian"

echo "⚠️  Starting Offline Dev Guardian uninstall..."
echo "This will remove all installed components. This action cannot be undone."
read -p "Are you sure you want to continue? [y/N] " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Uninstall cancelled."
    exit 0
fi

# Stop and disable service
echo "🛑 Stopping guardian service..."
systemctl --user stop offline-guardian.service 2>/dev/null || true
systemctl --user disable offline-guardian.service 2>/dev/null || true
rm -f "$HOME/.config/systemd/user/offline-guardian.service"
systemctl --user daemon-reload

# Remove aliases
echo "🗑️  Removing shell aliases..."
sed -i '/# Offline Dev Guardian aliases/,/alias forge-start/d' "$HOME/.bash_aliases" 2>/dev/null || true

# Remove Continue config backup
if [ -f "$HOME/.continue/config.yaml" ]; then
    echo "⚠️  Continue config will not be removed automatically"
    echo "   Manually remove $HOME/.continue/config.yaml if desired"
fi

# Remove installation directory
echo "🗑️  Removing installation directory..."
rm -rf "$INSTALL_DIR"

echo ""
echo "✅ Uninstall complete!"
echo ""
echo "Note: Ollama, Aider, and system packages were NOT removed"
echo "To remove them completely run:"
echo "  pip3 uninstall -y aider-chat"
echo "  curl -fsSL https://ollama.com/uninstall.sh | sh"