#!/bin/bash
set -euo pipefail

# Offline Dev Guardian Installer
# Quantum Pi Forge - https://github.com/onenoly1010/Quantum-pi-forge
# One command local AI coding stack that stays working

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

INSTALL_DIR="$HOME/.offline-dev-guardian"
VENV_DIR="$INSTALL_DIR/venv"
LOG_DIR="$INSTALL_DIR/logs"
CONFIG_DIR="$INSTALL_DIR/config"

echo -e "${BLUE}
╔══════════════════════════════════════════════════════════════╗
║                OFFLINE DEV GUARDIAN                         ║
║              Local AI Coding Stack Installer                ║
╚══════════════════════════════════════════════════════════════╝
${NC}"

# ------------------------------------------------------------------------------
# Hardware Detection
# ------------------------------------------------------------------------------
echo -e "\n${YELLOW}[1/8] Detecting system hardware...${NC}"

TOTAL_RAM=$(free -m | awk '/^Mem:/{print $2}')
CPU_CORES=$(nproc)
DISK_FREE=$(df -m $HOME | awk 'NR==2 {print $4}')

echo "  • RAM: ${TOTAL_RAM}MB"
echo "  • CPU: ${CPU_CORES} cores"
echo "  • Free disk: ${DISK_FREE}MB"

# Determine recommended model based on RAM
if [ $TOTAL_RAM -ge 32000 ]; then
  RECOMMENDED_MODEL="qwen2.5-coder:14b"
  echo -e "  ${GREEN}✓ Excellent system, recommended model: 14B${NC}"
elif [ $TOTAL_RAM -ge 16000 ]; then
  RECOMMENDED_MODEL="qwen2.5-coder:7b"
  echo -e "  ${GREEN}✓ Good system, recommended model: 7B${NC}"
elif [ $TOTAL_RAM -ge 12000 ]; then
  RECOMMENDED_MODEL="qwen2.5-coder:7b-q4_K_M"
  echo -e "  ${YELLOW}⚠ Minimum RAM, using quantized model${NC}"
else
  echo -e "  ${RED}✗ WARNING: Less than 12GB RAM detected${NC}"
  echo -e "  ${YELLOW}  This may not work well. Continue at your own risk.${NC}"
  RECOMMENDED_MODEL="qwen2.5-coder:3b"
fi

# ------------------------------------------------------------------------------
# Create directory structure
# ------------------------------------------------------------------------------
echo -e "\n${YELLOW}[2/8] Creating installation directories...${NC}"
mkdir -p $INSTALL_DIR
mkdir -p $VENV_DIR
mkdir -p $LOG_DIR
mkdir -p $CONFIG_DIR

# ------------------------------------------------------------------------------
# Install Ollama if missing
# ------------------------------------------------------------------------------
echo -e "\n${YELLOW}[3/8] Checking Ollama installation...${NC}"
if ! command -v ollama &> /dev/null; then
  echo "  Installing Ollama..."
  curl -fsSL https://ollama.com/install.sh | sh
  echo "  Waiting for Ollama service to start..."
  sleep 10
else
  echo "  ${GREEN}✓ Ollama already installed${NC}"
fi

# Pull recommended model
echo -e "\n${YELLOW}[4/8] Downloading coding model...${NC}"
echo "  Model: $RECOMMENDED_MODEL"
ollama pull $RECOMMENDED_MODEL

# ------------------------------------------------------------------------------
# Create isolated Python venv for Aider
# ------------------------------------------------------------------------------
echo -e "\n${YELLOW}[5/8] Setting up isolated Aider environment...${NC}"

python3 -m venv $VENV_DIR

source $VENV_DIR/bin/activate
pip install --upgrade pip
pip install aider-chat

# Create aider config
cat > $CONFIG_DIR/aider.conf << EOF
model: ollama/$RECOMMENDED_MODEL
ollama-api-base: http://localhost:11434
edit-format: whole
pretty: true
show-diffs: true
auto-commits: false
no-auto-model: true
skip-check-updates: true
EOF

# ------------------------------------------------------------------------------
# Install Guardian health checker
# ------------------------------------------------------------------------------
echo -e "\n${YELLOW}[6/8] Installing Guardian health monitor...${NC}"

cat > $INSTALL_DIR/guardian-check.sh << 'EOF'
#!/bin/bash
INSTALL_DIR="$HOME/.offline-dev-guardian"
LOG_FILE="$INSTALL_DIR/logs/guardian.log"
CONFIG_DIR="$INSTALL_DIR/config"

mkdir -p $(dirname $LOG_FILE)
echo "[$(date '+%Y-%m-%d %H:%M:%S')] ----- Guardian Health Check Start -----" >> $LOG_FILE

ALL_OK=true

# Check Ollama is running
if curl -s http://localhost:11434/api/tags > /dev/null 2>&1; then
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] ✔ Ollama is running" >> $LOG_FILE
else
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] ✗ Ollama is NOT running" >> $LOG_FILE
  ALL_OK=false
fi

# Check model exists
MODEL=$(grep '^model:' $CONFIG_DIR/aider.conf | cut -d'/' -f2)
if ollama list | grep -q $MODEL; then
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] ✔ $MODEL model available" >> $LOG_FILE
else
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] ✗ $MODEL model missing" >> $LOG_FILE
  ALL_OK=false
fi

# Check Aider config
if [ -f "$CONFIG_DIR/aider.conf" ]; then
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] ✔ Aider config present" >> $LOG_FILE
else
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] ✗ Aider config missing" >> $LOG_FILE
  ALL_OK=false
fi

# Check disk space
DISK_FREE=$(df -m $HOME | awk 'NR==2 {print $4}')
if [ $DISK_FREE -gt 5000 ]; then
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] ✔ Disk space OK (${DISK_FREE}MB free)" >> $LOG_FILE
else
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] ✗ Low disk space: ${DISK_FREE}MB remaining" >> $LOG_FILE
  ALL_OK=false
fi

echo "[$(date '+%Y-%m-%d %H:%M:%S')] ----- Guardian Health Check Complete -----" >> $LOG_FILE
echo "" >> $LOG_FILE

if [ "$ALL_OK" = true ]; then
  exit 0
else
  exit 1
fi
EOF

chmod +x $INSTALL_DIR/guardian-check.sh

# Setup cron job for every 30 minutes
echo -e "\n${YELLOW}[7/8] Configuring background health checks...${NC}"
(crontab -l 2>/dev/null | grep -v guardian-check.sh; echo "*/30 * * * * $INSTALL_DIR/guardian-check.sh") | crontab -

# ------------------------------------------------------------------------------
# Install aliases and commands
# ------------------------------------------------------------------------------
echo -e "\n${YELLOW}[8/8] Setting up command aliases...${NC}"

cat > $INSTALL_DIR/forge-aliases.sh << EOF
# Offline Dev Guardian Aliases
alias aider='$VENV_DIR/bin/aider --config $CONFIG_DIR/aider.conf'
alias forge-status='$INSTALL_DIR/guardian-check.sh && tail -20 $LOG_DIR/guardian.log'
alias forge-update='cd $INSTALL_DIR && git pull && $VENV_DIR/bin/pip install --upgrade aider-chat && ollama pull $RECOMMENDED_MODEL'
EOF

# Add to shell rc
SHELL_RC="$HOME/.bashrc"
if [ -f "$HOME/.zshrc" ]; then
  SHELL_RC="$HOME/.zshrc"
fi

if ! grep -q "Offline Dev Guardian Aliases" $SHELL_RC; then
  echo "" >> $SHELL_RC
  cat $INSTALL_DIR/forge-aliases.sh >> $SHELL_RC
fi

# ------------------------------------------------------------------------------
# Installation Complete
# ------------------------------------------------------------------------------
echo -e "\n${GREEN}
╔══════════════════════════════════════════════════════════════╗
║                INSTALLATION COMPLETE!                       ║
╚══════════════════════════════════════════════════════════════╝
${NC}"

echo -e "
${GREEN}Available commands:${NC}
  aider           Start coding with local AI
  forge-status    Check system health status
  forge-update    Update all components

${YELLOW}Next steps:${NC}
  1. Restart your terminal or run: source $SHELL_RC
  2. Run 'forge-status' to verify everything is working
  3. Run 'aider' to start coding

${BLUE}Guardian will automatically check your system every 30 minutes
Logs are located at: $LOG_DIR/guardian.log${NC}

✅ Your code never leaves your machine. No API keys. No bills.
"