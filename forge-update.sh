#!/bin/bash
set -euo pipefail

# Offline Dev Guardian Update Script
# Quantum Pi Forge

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

INSTALL_DIR="$HOME/.offline-dev-guardian"
VENV_DIR="$INSTALL_DIR/venv"
CONFIG_DIR="$INSTALL_DIR/config"

echo -e "${BLUE}
╔══════════════════════════════════════════════════════════════╗
║                OFFLINE DEV GUARDIAN UPDATE                  ║
╚══════════════════════════════════════════════════════════════╝
${NC}"

# Get current model
MODEL=$(grep '^model:' $CONFIG_DIR/aider.conf | cut -d'/' -f2)

echo -e "\n${YELLOW}[1/4] Updating Guardian scripts...${NC}"
cd $INSTALL_DIR
if git rev-parse --git-dir > /dev/null 2>&1; then
  git pull --quiet
  echo -e "  ${GREEN}✓ Scripts updated${NC}"
else
  echo -e "  ${YELLOW}⚠ Not a git repository, skipping script update${NC}"
fi

echo -e "\n${YELLOW}[2/4] Updating Aider...${NC}"
source $VENV_DIR/bin/activate
pip install --quiet --upgrade pip
pip install --quiet --upgrade aider-chat
echo -e "  ${GREEN}✓ Aider updated to latest version${NC}"

echo -e "\n${YELLOW}[3/4] Updating coding model: $MODEL...${NC}"
ollama pull $MODEL
echo -e "  ${GREEN}✓ Model updated${NC}"

echo -e "\n${YELLOW}[4/4] Running health check...${NC}"
$INSTALL_DIR/guardian-check.sh

echo -e "\n${GREEN}✅ Update complete!${NC}"
echo -e "\nAll components are now up to date."
echo -e "Run ${YELLOW}forge-status${NC} to verify system health."