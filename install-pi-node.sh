#!/bin/bash
# Pi Node Automatic Installation Script for Linux Mint 2026
# Account: onenoly11

set -e

echo "🔷 Pi Node Installation - Linux Mint 2026"
echo "🔷 Account: onenoly11"
echo "=========================================="

echo ""
echo "✅ Step 1/7: Installing prerequisites..."
sudo apt-get update
sudo apt-get install -y ca-certificates curl gnupg docker.io

echo ""
echo "✅ Step 2/7: Configuring Docker permissions..."
sudo usermod -aG docker $USER
echo "⚠️  YOU MUST LOG OUT AND BACK IN AFTER INSTALLATION COMPLETES"

echo ""
echo "✅ Step 2.5/7: Logging into Docker Hub..."
docker login -u onenoly1010@gmail.com
echo "✅ Docker account authenticated"

echo ""
echo "✅ Step 3/7: Adding official Pi repository..."
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://apt.minepi.com/repository.gpg.key | sudo gpg --dearmor -o /etc/apt/keyrings/pi-node.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/pi-node.gpg] https://apt.minepi.com/ stable main" | sudo tee /etc/apt/sources.list.d/pi-node.list > /dev/null

echo ""
echo "✅ Step 4/7: Installing pi-node package..."
sudo apt-get update
sudo apt-get install -y pi-node

echo ""
echo "✅ Step 5/7: Initializing node..."
echo "⚠️  Interactive wizard will start - enter your onenoly11 account when prompted"
pi-node initialize

echo ""
echo "✅ Step 6/7: Enabling auto-start on boot..."
systemctl enable --user pi-node
systemctl start --user pi-node

echo ""
echo "✅ Step 7/7: Verifying node status..."
sleep 5
pi-node status

echo ""
echo "=========================================="
echo "✅ Pi Node installation completed successfully!"
echo ""
echo "🔹 Important: Log out and log back in for Docker permissions to take effect"
echo "🔹 Open VS Code at ~/pi-node for Command Center"
echo "🔹 Ports 31400-31409 must be forwarded on your router"
echo "🔹 Run 'pi-node logs -f' to view live logs"
echo ""
echo "✅ Node is now running and linked to account: onenoly11"