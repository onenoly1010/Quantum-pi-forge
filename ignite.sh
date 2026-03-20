#!/bin/bash

# 🔥 IGNITION SEQUENCE - Pi Forge Quantum Genesis
# One-command deployment to production mainnet

echo "🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥"
echo "  ██████╗ ██╗    ███████╗ ██████╗ ██████╗  ██████╗ ███████╗"
echo "  ██╔══██╗██║    ██╔════╝██╔═══██╗██╔══██╗██╔════╝ ██╔════╝"
echo "  ██████╔╝██║    █████╗  ██║   ██║██████╔╝██║  ███╗█████╗  "
echo "  ██╔═══╝ ██║    ██╔══╝  ██║   ██║██╔══██╗██║   ██║██╔══╝  "
echo "  ██║     ██║    ██║     ╚██████╔╝██║  ██║╚██████╔╝███████╗"
echo "  ╚═╝     ╚═╝    ╚═╝      ╚═════╝ ╚═╝  ╚═╝ ╚═════╝ ╚══════╝"
echo ""
echo "     🌌 QUANTUM GENESIS - MAINNET IGNITION 🌌"
echo "🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥"
echo ""

# Colors
GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
PURPLE='\033[0;35m'
NC='\033[0m'

# Countdown
echo -e "${CYAN}🚀 INITIATING IGNITION SEQUENCE...${NC}"
echo ""
for i in {5..1}; do
    echo -e "${YELLOW}   T-$i seconds...${NC}"
    sleep 1
done
echo ""
echo -e "${GREEN}🔥 IGNITION!${NC}"
echo ""
sleep 1

# Run deployment
./deploy.sh

echo ""
echo "🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥"
echo -e "${GREEN}✨ QUANTUM GENESIS ACTIVATED ✨${NC}"
echo "🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥"
