# 0G DEX Deployment - Quick Start Guide

**Emergency deployment to unblock OINIO flash-launch (Issue #108)**

⏱️ **Timeline**: 2-4 hours  
🎯 **Objective**: Deploy Uniswap V2 fork to 0G Aristotle Mainnet  
📊 **Status**: Ready for immediate deployment  

---

## Prerequisites (5 minutes)

### 1. Install Foundry
```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
forge --version
```

### 2. Prepare Wallet
- **Required Balance**: 0.5+ 0G tokens
- **Recommended**: 1.0 0G (includes testing buffer)
- **Get Testnet Tokens**: [0G Faucet](https://faucet.0g.ai) (if testing first)

### 3. Get Private Key
```bash
# If generating new wallet
cast wallet new

# If importing existing
cast wallet import deployment --interactive
```

---

## Method 1: Foundry Deployment (Recommended)

### Step 1: Setup (10 minutes)

```bash
# Clone repository (if not already)
cd /home/runner/work/pi-forge-quantum-genesis/pi-forge-quantum-genesis

# Navigate to deployment directory
cd contracts/0g-uniswap-v2

# Run setup script (installs dependencies)
./scripts/setup.sh

# Configure environment
cp .env.example .env
nano .env  # or vim, code, etc.
```

**Edit `.env` with your values**:
```bash
PRIVATE_KEY=your_private_key_here  # NO 0x prefix
DEPLOYER=0xYourWalletAddress
FEE_TO_SETTER=0xYourWalletAddress  # Can change after deployment
RPC_URL=https://evmrpc.0g.ai
CHAIN_ID=16661
```

### Step 2: Deploy Phase 1 (30 minutes)

```bash
# Deploy W0G + Factory
./scripts/deploy.sh
```

**📝 IMPORTANT**: Copy the `PAIR_INIT_CODE_HASH` from output:
```
=== PAIR_INIT_CODE_HASH ===
0xabcd1234...  # ← Copy this entire hash
```

### Step 3: Update Init Code Hash (5 minutes)

```bash
# Open library file
nano lib/v2-periphery/contracts/libraries/UniswapV2Library.sol

# Find line ~26 with:
hex'96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f'

# Replace with your PAIR_INIT_CODE_HASH:
hex'YOUR_HASH_HERE'

# Save and rebuild
forge build
```

### Step 4: Deploy Phase 2 (15 minutes)

```bash
# Deploy Router
./scripts/deploy.sh --resume
```

### Step 5: Post-Deployment (15 minutes)

```bash
# Create .env.launch with addresses
cat > .env.launch << EOF
ZERO_G_W0G=0xW0G_ADDRESS_FROM_LOGS
ZERO_G_FACTORY=0xFACTORY_ADDRESS_FROM_LOGS
ZERO_G_UNIVERSAL_ROUTER=0xROUTER_ADDRESS_FROM_LOGS
EOF

# Run validation
./scripts/post-deploy.sh
```

---

## Method 2: Python Deployment (Alternative)

### Step 1: Install Dependencies
```bash
pip3 install web3 eth-account
```

### Step 2: Set Environment Variables
```bash
export ZERO_G_RPC_URL="https://evmrpc.0g.ai"
export ZERO_G_CHAIN_ID="16661"
export DEPLOYER_PRIVATE_KEY="your_private_key"
export FEE_TO_SETTER="your_wallet_address"
```

### Step 3: Run Deployment
```bash
cd /home/runner/work/pi-forge-quantum-genesis/pi-forge-quantum-genesis
python scripts/deploy_0g_dex.py
```

**Note**: Python script requires pre-compiled Foundry artifacts. It's primarily a reference implementation. Use Foundry method for production.

---

## Method 3: GitHub Actions (Automated)

### Step 1: Configure Secrets

Go to **Settings → Secrets and variables → Actions** and add:

```
DEPLOYER_PRIVATE_KEY=your_private_key
DEPLOYER_ADDRESS=0xYourAddress
FEE_TO_SETTER=0xYourAddress
ZERO_G_RPC_URL=https://evmrpc.0g.ai
ZERO_G_CHAIN_ID=16661
```

### Step 2: Trigger Workflow

1. Go to **Actions** tab
2. Select "Deploy 0G DEX" workflow
3. Click "Run workflow"
4. Choose environment: `testnet` or `mainnet`
5. Enable contract verification: ✅
6. Click "Run workflow"

### Step 3: Monitor Deployment

- Watch workflow logs in real-time
- Download artifacts when complete
- Check deployment summary

---

## Verification (15 minutes)

### Python Verification Script

```bash
# Set contract addresses
export ZERO_G_W0G="0x..."
export ZERO_G_FACTORY="0x..."
export ZERO_G_UNIVERSAL_ROUTER="0x..."
export ZERO_G_RPC_URL="https://evmrpc.0g.ai"

# Run verification
python scripts/verify_0g_dex.py
```

**Expected Output**:
```
✅ W0G Exists: PASSED
✅ W0G Name: PASSED 'Wrapped 0G'
✅ W0G Symbol: PASSED 'W0G'
✅ Factory Exists: PASSED
✅ Router Exists: PASSED
✅ ALL TESTS PASSED ✅
```

### Block Explorer Verification

Visit deployed contracts:
- W0G: `https://chainscan.0g.ai/address/<W0G_ADDRESS>`
- Factory: `https://chainscan.0g.ai/address/<FACTORY_ADDRESS>`
- Router: `https://chainscan.0g.ai/address/<ROUTER_ADDRESS>`

---

## Testing (30 minutes)

### Test 1: Wrap 0G to W0G

```bash
cast send <W0G_ADDRESS> \
  "deposit()" \
  --value 0.01ether \
  --private-key <PRIVATE_KEY> \
  --rpc-url https://evmrpc.0g.ai

# Check W0G balance
cast call <W0G_ADDRESS> \
  "balanceOf(address)(uint256)" \
  <YOUR_ADDRESS> \
  --rpc-url https://evmrpc.0g.ai
```

### Test 2: Check Factory

```bash
cast call <FACTORY_ADDRESS> \
  "feeToSetter()(address)" \
  --rpc-url https://evmrpc.0g.ai

cast call <FACTORY_ADDRESS> \
  "allPairsLength()(uint256)" \
  --rpc-url https://evmrpc.0g.ai
```

### Test 3: Check Router

```bash
# Verify factory reference
cast call <ROUTER_ADDRESS> \
  "factory()(address)" \
  --rpc-url https://evmrpc.0g.ai

# Verify WETH reference (should match W0G)
cast call <ROUTER_ADDRESS> \
  "WETH()(address)" \
  --rpc-url https://evmrpc.0g.ai
```

---

## Integration with Pi Forge (30 minutes)

### Step 1: Update Root Environment

```bash
cd /home/runner/work/pi-forge-quantum-genesis/pi-forge-quantum-genesis

# Copy .env.launch.example
cp .env.launch.example .env.launch

# Edit with deployed addresses
nano .env.launch
```

Fill in:
```bash
ZERO_G_W0G=0x...
ZERO_G_FACTORY=0x...
ZERO_G_UNIVERSAL_ROUTER=0x...
ZERO_G_RPC=https://evmrpc.0g.ai
ZERO_G_CHAIN_ID=16661

ROUTER_SOURCE=self_deployed
ROUTER_DEPLOYED_BY=onenoly1010
ROUTER_TYPE=uniswap_v2
ROUTER_DEPLOYMENT_DATE=2025-12-19
```

### Step 2: Update Backend Config

Add to `server/config.py`:

```python
import os

ZERO_G_CONFIG = {
    "chain_id": int(os.getenv("ZERO_G_CHAIN_ID", "16661")),
    "rpc_url": os.getenv("ZERO_G_RPC", "https://evmrpc.0g.ai"),
    "router_address": os.getenv("ZERO_G_UNIVERSAL_ROUTER"),
    "factory_address": os.getenv("ZERO_G_FACTORY"),
    "w0g_address": os.getenv("ZERO_G_W0G"),
    "block_explorer": "https://chainscan.0g.ai"
}
```

### Step 3: Update Frontend

Add to frontend configuration:

```javascript
const ZERO_G_CONFIG = {
  chainId: 16661,
  rpcUrl: 'https://evmrpc.0g.ai',
  routerAddress: process.env.ZERO_G_UNIVERSAL_ROUTER,
  w0gAddress: process.env.ZERO_G_W0G,
  factoryAddress: process.env.ZERO_G_FACTORY
};
```

---

## Troubleshooting

### Issue: "Insufficient balance"
**Solution**: Send more 0G to deployer wallet. Need minimum 0.5 0G.

### Issue: "RPC connection failed"
**Solution**: 
```bash
# Test RPC
curl -X POST https://evmrpc.0g.ai \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_chainId","params":[],"id":1}'
```

### Issue: "Build failed"
**Solution**:
```bash
forge clean
rm -rf lib cache out
./scripts/setup.sh
```

### Issue: "Init code hash mismatch"
**Solution**: Re-deploy Factory, copy new hash, update UniswapV2Library.sol, rebuild, deploy Router.

---

## Post-Deployment Checklist

- [ ] All contracts deployed successfully
- [ ] Contracts verified on Chainscan
- [ ] `.env.launch` created with addresses
- [ ] Python verification passed
- [ ] W0G wrap/unwrap tested
- [ ] Router factory reference correct
- [ ] Router WETH reference correct
- [ ] Pi Forge `.env` updated
- [ ] Backend config updated
- [ ] Frontend config updated
- [ ] Test swap executed (optional)
- [ ] Documentation updated
- [ ] Issue #108 updated
- [ ] Team notified

---

## Security Recommendations

### Immediate Actions
1. **Never commit private keys**
2. **Test on testnet first**
3. **Verify all addresses match**

### Post-Deployment
1. **Transfer feeToSetter to multisig**
   ```bash
   cast send <FACTORY_ADDRESS> \
     "setFeeToSetter(address)" \
     <MULTISIG_ADDRESS> \
     --private-key <CURRENT_FEE_TO_SETTER_KEY> \
     --rpc-url https://evmrpc.0g.ai
   ```

2. **Monitor transactions**
3. **Set up alerts**
4. **Document emergency procedures**

---

## Resources

- **Full Documentation**: `docs/0G_DEX_DEPLOYMENT.md`
- **Contract README**: `contracts/0g-dex/README.md`
- **Foundry Setup**: `contracts/0g-uniswap-v2/README.md`
- **0G Docs**: https://docs.0g.ai
- **Uniswap V2 Docs**: https://docs.uniswap.org/contracts/v2
- **Block Explorer**: https://chainscan.0g.ai

---

## Timeline Summary

| Phase | Duration | Activity |
|-------|----------|----------|
| **Setup** | 15 min | Install Foundry, configure wallet |
| **Deploy Phase 1** | 30 min | Deploy W0G + Factory |
| **Update Hash** | 5 min | Update UniswapV2Library.sol |
| **Deploy Phase 2** | 15 min | Deploy Router |
| **Verification** | 30 min | Run tests, verify contracts |
| **Integration** | 30 min | Update Pi Forge configs |
| **Testing** | 30 min | Execute test transactions |
| **Documentation** | 15 min | Update docs, close Issue #108 |
| **Total** | **2.5-3 hours** | End-to-end deployment |

---

## Success Criteria

✅ **Technical**:
- All contracts deployed and verified
- Python verification passes all tests
- Test transactions successful

✅ **Business**:
- OINIO flash-launch unblocked
- Issue #108 closed
- Team notified

✅ **Security**:
- No private keys committed
- Multisig configured
- Monitoring enabled

---

**Need Help?**
- Review full guide: `docs/0G_DEX_DEPLOYMENT.md`
- Check troubleshooting section above
- Open GitHub issue for deployment problems

**Ready to Deploy?** Start with Method 1 (Foundry) → Step 1 above! 🚀
