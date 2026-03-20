# 0G Uniswap V2 - Quick Start Guide

## TL;DR

Deploy a complete Uniswap V2 fork to 0G Aristotle Mainnet in under 3 hours.

```bash
# 1. Setup (5 minutes)
cd contracts/0g-uniswap-v2
./scripts/setup.sh

# 2. Configure (5 minutes)
cp .env.example .env
# Edit .env with your PRIVATE_KEY and DEPLOYER address

# 3. Deploy (45 minutes)
./scripts/deploy.sh

# 4. Update init code hash (5 minutes)
# Copy PAIR_INIT_CODE_HASH from logs
# Edit lib/v2-periphery/contracts/libraries/UniswapV2Library.sol
forge build

# 5. Deploy Router (15 minutes)
./scripts/deploy.sh --resume

# 6. Validate (10 minutes)
./scripts/post-deploy.sh
```

## What Gets Deployed

| Contract | Purpose | Gas Cost |
|----------|---------|----------|
| **W0G** | Wraps native 0G into ERC-20 | ~0.007 0G |
| **UniswapV2Factory** | Creates trading pairs | ~0.025 0G |
| **UniswapV2Router02** | Executes swaps and adds liquidity | ~0.035 0G |

**Total Cost**: ~0.07 0G + buffer = **0.1 0G recommended**

## Prerequisites

### Required
- ✅ [Foundry](https://book.getfoundry.sh/) installed
- ✅ Wallet with 0.5 0G balance
- ✅ Private key (hardware wallet recommended)

### Optional
- 📝 Block explorer API key (for verification)
- 🔐 Multisig wallet (for production feeToSetter)

## Step-by-Step Deployment

### 1. Install Foundry (if not installed)

```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

Verify installation:
```bash
forge --version
```

### 2. Navigate to Project

```bash
cd /path/to/pi-forge-quantum-genesis/contracts/0g-uniswap-v2
```

### 3. Run Setup Script

```bash
./scripts/setup.sh
```

This installs:
- forge-std (Foundry testing library)
- OpenZeppelin Contracts v4.9.3
- Uniswap v2-core
- Uniswap v2-periphery

### 4. Configure Environment

```bash
cp .env.example .env
nano .env  # or use your favorite editor
```

**Required Variables:**
```bash
PRIVATE_KEY=0x...                    # Your wallet private key
DEPLOYER=0x...                       # Your wallet address
FEE_TO_SETTER=0x...                  # Same as DEPLOYER initially
RPC_URL=https://evmrpc.0g.ai         # Already set
CHAIN_ID=16661                       # Already set
```

**Check Your Balance:**
```bash
cast balance $DEPLOYER --rpc-url https://evmrpc.0g.ai
```

Should show at least 500000000000000000 wei (0.5 0G)

### 5. Deploy W0G and Factory

```bash
./scripts/deploy.sh
```

**Expected Output:**
```
=== Pre-Deployment Safety Checks ===
✅ Balance check: PASSED
✅ RPC connectivity: PASSED

🚀 Starting deployment...

=== Step 1: Deploying W0G ===
W0G deployed at: 0x...

=== Step 2: Deploying UniswapV2Factory ===
Factory deployed at: 0x...

PAIR_INIT_CODE_HASH:
0x96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f

=== Deployment Summary ===
W0G: 0x...
Factory: 0x...
```

**CRITICAL:** Copy the PAIR_INIT_CODE_HASH!

### 6. Update Init Code Hash

Open the file:
```bash
nano lib/v2-periphery/contracts/libraries/UniswapV2Library.sol
```

Find the `pairFor` function (around line 23) and replace the init code hash:

```solidity
// BEFORE
hex'96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f'

// AFTER (use YOUR hash from deployment logs)
hex'YOUR_ACTUAL_PAIR_INIT_CODE_HASH_HERE'
```

Save and recompile:
```bash
forge build
```

### 7. Deploy Router

```bash
./scripts/deploy.sh --resume
```

**Expected Output:**
```
=== Step 4: Deploying UniswapV2Router02 ===
Router02 deployed at: 0x...

=== Deployment Summary ===
Router: 0x...
```

### 8. Post-Deployment Validation

```bash
./scripts/post-deploy.sh
```

This:
- ✅ Validates all contracts are deployed
- ✅ Checks W0G name/symbol
- ✅ Generates deployment report
- ✅ Creates integration instructions

**Expected Output:**
```
✅ W0G contract validated
✅ Factory contract validated
✅ Router contract validated

📄 Report saved to: artifacts/deployment-report-TIMESTAMP.txt
```

### 9. Create .env.launch

```bash
nano .env.launch
```

Add (using addresses from deployment):
```bash
ZERO_G_W0G=0x...
ZERO_G_FACTORY=0x...
ZERO_G_UNIVERSAL_ROUTER=0x...
ZERO_G_RPC=https://evmrpc.0g.ai
```

## Integrate with Pi Forge

### 1. Update Root Environment

Copy addresses to main `.env`:
```bash
# In project root
nano .env
```

Add:
```bash
ZERO_G_W0G=0x...
ZERO_G_FACTORY=0x...
ZERO_G_UNIVERSAL_ROUTER=0x...
ZERO_G_RPC=https://evmrpc.0g.ai
ZERO_G_CHAIN_ID=16661
```

### 2. Test Backend Integration

```python
# Test in Python REPL
from server.integrations import ZeroGSwapClient
from server.config import ZERO_G_CONFIG, validate_zero_g_config

# Validate config
print(validate_zero_g_config())  # Should return True

# Test client creation
client = ZeroGSwapClient(
    rpc_url=ZERO_G_CONFIG["rpc_url"],
    router_address=ZERO_G_CONFIG["contracts"]["router"],
    w0g_address=ZERO_G_CONFIG["contracts"]["w0g"]
)

print("✅ Integration ready!")
```

### 3. Test a Simple Quote

```python
from web3 import Web3

token_a = ZERO_G_CONFIG["contracts"]["w0g"]
token_b = "0x..."  # Some other token address

amounts = client.get_amounts_out(
    Web3.to_wei(1, 'ether'),
    [token_a, token_b]
)

print(f"1 W0G = {Web3.from_wei(amounts[1], 'ether')} tokens")
```

## Verify on Block Explorer

Visit Chainscan to verify contracts:

- **W0G**: https://chainscan.0g.ai/address/YOUR_W0G_ADDRESS
- **Factory**: https://chainscan.0g.ai/address/YOUR_FACTORY_ADDRESS
- **Router**: https://chainscan.0g.ai/address/YOUR_ROUTER_ADDRESS

## Common Issues

### "Insufficient balance for deployment"
**Solution**: Add more 0G to your deployer wallet

### "RPC connection failed"
**Solution**: Check internet connection and RPC URL

### "Contract verification failed"
**Solution**: Use manual verification on Chainscan with flattened source:
```bash
forge flatten src/W0G.sol > W0G_flat.sol
```

### "Init code hash mismatch"
**Solution**: Ensure you copied the EXACT hash from deployment logs

### "forge: command not found"
**Solution**: Install Foundry and run `foundryup`

## Next Steps

1. ✅ Create test token pairs
2. ✅ Add initial liquidity
3. ✅ Execute test swaps
4. ✅ Monitor gas costs
5. ✅ Set up frontend integration
6. ✅ Configure monitoring alerts

## Security Checklist

- [ ] Private key stored securely (hardware wallet)
- [ ] `.env` in `.gitignore`
- [ ] feeToSetter is correct address
- [ ] All contracts verified on Chainscan
- [ ] Test swap executed successfully
- [ ] Monitoring configured
- [ ] Team notified

## Production Recommendations

1. **Use Multisig for feeToSetter**
   - Deploy Gnosis Safe on 0G
   - Transfer feeToSetter ownership
   - Require 2-of-3 signatures

2. **Monitor Everything**
   - Set up alerts for large swaps
   - Track liquidity changes
   - Monitor gas prices

3. **Have a Plan B**
   - Document emergency procedures
   - Know how to pause if needed
   - Have backup RPC endpoints

## Support

- 📚 [Full Documentation](./README.md)
- 📋 [Deployment Checklist](./DEPLOYMENT_CHECKLIST.md)
- 💡 [Integration Examples](./INTEGRATION_EXAMPLE.md)
- 🔧 [Troubleshooting Guide](./README.md#troubleshooting)

## Estimated Timeline

| Phase | Time |
|-------|------|
| Setup & Installation | 10 min |
| Configuration | 10 min |
| W0G + Factory Deploy | 30 min |
| Init Hash Update | 5 min |
| Router Deploy | 15 min |
| Validation | 15 min |
| Integration | 20 min |
| Testing | 15 min |
| **TOTAL** | **~2 hours** |

---

**Ready to deploy?** Start with `./scripts/setup.sh` 🚀

**Questions?** Check the [main README](./README.md) for detailed documentation.

**Security concern?** Review the [deployment checklist](./DEPLOYMENT_CHECKLIST.md) first.
