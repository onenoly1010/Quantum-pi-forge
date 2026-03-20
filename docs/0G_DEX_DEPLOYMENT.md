# 0G DEX Deployment Guide

## Executive Summary

This document provides complete instructions for deploying a Uniswap V2 fork to 0G Aristotle Mainnet to unblock the OINIO flash-launch system. The deployment fills the critical gap caused by the absence of a canonical DEX router on 0G.

**Status**: Ready for immediate deployment  
**Timeline**: 2-4 hours from start to completion  
**Prerequisites**: Funded wallet with 0.5+ 0G, Foundry installed  

---

## Table of Contents

1. [Background & Context](#background--context)
2. [Architecture Overview](#architecture-overview)
3. [Pre-Deployment Setup](#pre-deployment-setup)
4. [Deployment Methods](#deployment-methods)
5. [Post-Deployment Verification](#post-deployment-verification)
6. [Integration with Pi Forge](#integration-with-pi-forge)
7. [Testing & Validation](#testing--validation)
8. [Maintenance & Operations](#maintenance--operations)
9. [Troubleshooting](#troubleshooting)
10. [Security Considerations](#security-considerations)

---

## Background & Context

### Problem Statement
- **Issue**: #108 is 5 days overdue (deadline: 2025-12-16)
- **Blocker**: OINIO flash-launch at 99% completion, waiting for `ZERO_G_UNIVERSAL_ROUTER`
- **Root Cause**: No canonical DEX router exists on 0G Aristotle Mainnet
- **Solution**: Deploy battle-tested Uniswap V2 contracts as interim solution

### Network Information
- **Chain Name**: 0G Aristotle Mainnet
- **Chain ID**: 16661 (0x4115 in hex)
- **RPC URL**: https://evmrpc.0g.ai
- **Block Explorer**: https://chainscan.0g.ai
- **Native Token**: 0G (A0GI)
- **Launch Date**: September 22, 2025

---

## Architecture Overview

### Contract Components

```
┌──────────────────────────────────────────────────┐
│                 W0G (Wrapped 0G)                 │
│         Standard WETH9 Implementation            │
│    - deposit() payable: Wrap native 0G          │
│    - withdraw(uint): Unwrap to native 0G        │
│    - Standard ERC-20 interface                   │
└──────────────────────────────────────────────────┘
                         ▲
                         │ references
                         │
┌──────────────────────────────────────────────────┐
│           UniswapV2Factory                       │
│    - createPair(tokenA, tokenB)                 │
│    - getPair(tokenA, tokenB)                    │
│    - allPairsLength()                            │
│    - feeToSetter (for protocol fees)            │
└──────────────────────────────────────────────────┘
                         ▲
                         │ interacts
                         │
┌──────────────────────────────────────────────────┐
│          UniswapV2Router02                       │
│    - swapExactTokensForTokens()                 │
│    - swapExactETHForTokens()                    │
│    - addLiquidity(), removeLiquidity()          │
│    - Quote & amount calculation helpers         │
└──────────────────────────────────────────────────┘
```

### Repository Structure

```
pi-forge-quantum-genesis/
├── contracts/
│   ├── 0g-dex/                    # Reference Solidity contracts
│   │   ├── UniswapV2Factory.sol
│   │   ├── UniswapV2Pair.sol
│   │   ├── UniswapV2Router02.sol
│   │   └── README.md
│   │
│   └── 0g-uniswap-v2/             # Foundry deployment infrastructure
│       ├── src/
│       │   └── W0G.sol            # Wrapped 0G implementation
│       ├── script/
│       │   └── Deploy.s.sol       # Solidity deployment script
│       ├── scripts/
│       │   ├── setup.sh           # Dependency installation
│       │   ├── deploy.sh          # Main deployment script
│       │   └── post-deploy.sh     # Validation script
│       ├── test/
│       │   └── ZeroGDeployment.t.sol
│       ├── foundry.toml
│       └── .env.example
│
├── scripts/
│   ├── deploy_0g_dex.py          # Python deployment (reference)
│   └── verify_0g_dex.py          # Python verification
│
├── docs/
│   └── 0G_DEX_DEPLOYMENT.md      # This file
│
├── .env.launch.example            # Deployment config template
└── .github/workflows/
    └── deploy-0g-dex.yml          # CI/CD deployment workflow
```

---

## Pre-Deployment Setup

### 1. Install Prerequisites

#### Foundry (Required)
```bash
# Install Foundry
curl -L https://foundry.paradigm.xyz | bash
foundryup

# Verify installation
forge --version
cast --version
```

#### Python 3.8+ (Optional, for Python scripts)
```bash
python3 --version
pip3 install web3 eth-account
```

### 2. Prepare Deployment Wallet

#### Funding Requirements
- **Minimum**: 0.5 0G
- **Recommended**: 1.0 0G (includes buffer for testing)
- **Gas Estimates**:
  - W0G deployment: ~0.007 0G
  - Factory deployment: ~0.025 0G
  - Router deployment: ~0.035 0G
  - Testing operations: ~0.010 0G

#### Security Best Practices
```bash
# Generate new deployment wallet (if needed)
cast wallet new

# Or import existing wallet
cast wallet import deployment --interactive

# Check balance
cast balance <your-address> --rpc-url https://evmrpc.0g.ai
```

### 3. Configure Environment

#### Navigate to Deployment Directory
```bash
cd /home/runner/work/pi-forge-quantum-genesis/pi-forge-quantum-genesis/contracts/0g-uniswap-v2
```

#### Run Setup Script
```bash
./scripts/setup.sh
```

This will:
- Initialize git submodules (Uniswap V2 dependencies)
- Install forge-std, OpenZeppelin
- Build all contracts
- Create `.env` from template

#### Edit Configuration
```bash
# Copy and edit environment file
cp .env.example .env
nano .env  # or vim, code, etc.
```

Required variables:
```bash
PRIVATE_KEY=your_private_key_without_0x_prefix
DEPLOYER=your_wallet_address
FEE_TO_SETTER=your_wallet_address  # Can change after deployment
RPC_URL=https://evmrpc.0g.ai
CHAIN_ID=16661
```

⚠️ **SECURITY**: Never commit `.env` files! They are in `.gitignore`.

---

## Deployment Methods

### Method 1: Foundry Scripts (Recommended)

#### Phase 1: Deploy W0G + Factory

```bash
# Run deployment script
./scripts/deploy.sh
```

**Expected Output**:
```
==========================================
0G Uniswap V2 Fork - Deployment Script
==========================================

🔍 Validating environment configuration...
✅ Environment configuration validated

🔍 Running pre-flight checks...
   Testing RPC connectivity...
   ✅ RPC connectivity: OK
   Checking deployer balance...
   ✅ Deployer balance: OK
✅ All pre-flight checks passed

🔨 Building contracts...
✅ Build successful

🚀 Starting deployment to 0G Aristotle Mainnet...
   Chain ID: 16661
   RPC: https://evmrpc.0g.ai
   Deployer: 0x...
   Fee To Setter: 0x...

=== Step 1: Deploying W0G ===
W0G deployed at: 0xW0G_ADDRESS

=== Step 2: Deploying UniswapV2Factory ===
Factory deployed at: 0xFACTORY_ADDRESS

=== PAIR_INIT_CODE_HASH ===
0xINIT_CODE_HASH_64_CHARS

✅ Deployment completed successfully!
```

**CRITICAL**: Save the `PAIR_INIT_CODE_HASH` from output!

#### Phase 2: Update Init Code Hash

The Router requires the exact bytecode hash of pair contracts:

1. **Copy PAIR_INIT_CODE_HASH** from deployment logs
2. **Edit library file**:
   ```bash
   nano lib/v2-periphery/contracts/libraries/UniswapV2Library.sol
   ```
3. **Find and replace** in the `pairFor()` function:
   ```solidity
   // Before:
   hex'96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f'
   
   // After (use your hash):
   hex'YOUR_PAIR_INIT_CODE_HASH_HERE'
   ```
4. **Save and rebuild**:
   ```bash
   forge build
   ```

#### Phase 3: Deploy Router

```bash
./scripts/deploy.sh --resume
```

**Expected Output**:
```
📝 Resuming deployment (Router02 only)...

=== Step 4: Deploying UniswapV2Router02 ===
Router02 deployed at: 0xROUTER_ADDRESS

✅ Deployment completed successfully!
```

### Method 2: Python Script (Alternative)

```bash
# Set environment variables
export ZERO_G_RPC_URL="https://evmrpc.0g.ai"
export ZERO_G_CHAIN_ID="16661"
export DEPLOYER_PRIVATE_KEY="your_private_key"
export FEE_TO_SETTER="your_wallet_address"

# Run Python deployment
python scripts/deploy_0g_dex.py
```

⚠️ **Note**: Python script requires pre-compiled Foundry artifacts and is provided primarily as a reference. Use Foundry method for production.

---

## Post-Deployment Verification

### 1. Run Post-Deployment Script

```bash
cd contracts/0g-uniswap-v2
./scripts/post-deploy.sh
```

This script:
- Validates contract deployment
- Checks W0G name/symbol
- Verifies Factory functionality
- Tests Router connectivity
- Generates deployment report

### 2. Manual Contract Verification

#### Check W0G
```bash
# Get W0G name
cast call <W0G_ADDRESS> "name()(string)" --rpc-url https://evmrpc.0g.ai

# Expected: "Wrapped 0G"

# Get W0G symbol
cast call <W0G_ADDRESS> "symbol()(string)" --rpc-url https://evmrpc.0g.ai

# Expected: "W0G"
```

#### Check Factory
```bash
# Get feeToSetter
cast call <FACTORY_ADDRESS> "feeToSetter()(address)" --rpc-url https://evmrpc.0g.ai

# Check pairs count
cast call <FACTORY_ADDRESS> "allPairsLength()(uint256)" --rpc-url https://evmrpc.0g.ai
```

#### Check Router
```bash
# Verify factory reference
cast call <ROUTER_ADDRESS> "factory()(address)" --rpc-url https://evmrpc.0g.ai

# Verify WETH reference (should match W0G)
cast call <ROUTER_ADDRESS> "WETH()(address)" --rpc-url https://evmrpc.0g.ai
```

### 3. Python Verification Script

```bash
# Set addresses in environment
export ZERO_G_W0G="0x..."
export ZERO_G_FACTORY="0x..."
export ZERO_G_UNIVERSAL_ROUTER="0x..."

# Run verification
python scripts/verify_0g_dex.py
```

**Expected Output**:
```
========================================
0G DEX - Contract Verification Suite
========================================

Testing W0G (Wrapped 0G)
✅ W0G Exists: PASSED Code size: 2847 bytes
✅ W0G Name: PASSED 'Wrapped 0G'
✅ W0G Symbol: PASSED 'W0G'
✅ W0G Decimals: PASSED 18

Testing UniswapV2Factory
✅ Factory Exists: PASSED
✅ Factory feeToSetter: PASSED 0x...
✅ Factory Pairs: PASSED 0 pairs created

Testing UniswapV2Router02
✅ Router Exists: PASSED
✅ Router Factory: PASSED
✅ Router WETH: PASSED

========================================
✅ ALL TESTS PASSED ✅
========================================
```

### 4. Block Explorer Verification

Visit contracts on block explorer:
- W0G: `https://chainscan.0g.ai/address/<W0G_ADDRESS>`
- Factory: `https://chainscan.0g.ai/address/<FACTORY_ADDRESS>`
- Router: `https://chainscan.0g.ai/address/<ROUTER_ADDRESS>`

#### Verify Source Code
```bash
# W0G verification
forge verify-contract \
  <W0G_ADDRESS> \
  src/W0G.sol:W0G \
  --chain-id 16661 \
  --watch

# Factory verification
forge verify-contract \
  <FACTORY_ADDRESS> \
  lib/v2-core/contracts/UniswapV2Factory.sol:UniswapV2Factory \
  --constructor-args $(cast abi-encode "constructor(address)" <FEE_TO_SETTER>) \
  --chain-id 16661 \
  --watch

# Router verification
forge verify-contract \
  <ROUTER_ADDRESS> \
  lib/v2-periphery/contracts/UniswapV2Router02.sol:UniswapV2Router02 \
  --constructor-args $(cast abi-encode "constructor(address,address)" <FACTORY_ADDRESS> <W0G_ADDRESS>) \
  --chain-id 16661 \
  --watch
```

---

## Integration with Pi Forge

### 1. Update Root Environment File

Create `.env.launch` in repository root:

```bash
cd /home/runner/work/pi-forge-quantum-genesis/pi-forge-quantum-genesis
cp .env.launch.example .env.launch
```

Edit `.env.launch` with deployed addresses:
```bash
ZERO_G_CHAIN_ID=16661
ZERO_G_RPC_URL=https://evmrpc.0g.ai
ZERO_G_W0G=0x...          # From deployment
ZERO_G_FACTORY=0x...      # From deployment
ZERO_G_UNIVERSAL_ROUTER=0x...  # From deployment

ROUTER_SOURCE=self_deployed
ROUTER_DEPLOYED_BY=onenoly1010
ROUTER_TYPE=uniswap_v2
ROUTER_DEPLOYMENT_DATE=2025-12-19
```

### 2. Backend Configuration

Create/update `server/config.py`:

```python
import os
from typing import Dict

# 0G Aristotle Network Configuration
ZERO_G_CONFIG: Dict[str, any] = {
    "chain_id": int(os.getenv("ZERO_G_CHAIN_ID", "16661")),
    "rpc_url": os.getenv("ZERO_G_RPC_URL", "https://evmrpc.0g.ai"),
    "router_address": os.getenv("ZERO_G_UNIVERSAL_ROUTER"),
    "factory_address": os.getenv("ZERO_G_FACTORY"),
    "w0g_address": os.getenv("ZERO_G_W0G"),
    "block_explorer": "https://chainscan.0g.ai",
    "native_token": {
        "symbol": "0G",
        "decimals": 18,
        "name": "0G Token"
    },
    "gas_config": {
        "max_priority_fee": 2_000_000_000,  # 2 gwei
        "max_fee": 100_000_000_000,         # 100 gwei
    }
}

# Validate configuration
if not ZERO_G_CONFIG["router_address"]:
    raise ValueError("ZERO_G_UNIVERSAL_ROUTER not configured")
```

### 3. Create Swap Integration Module

Create `server/integrations/zero_g_swap.py`:

```python
from web3 import Web3
from typing import List, Tuple
import os

class ZeroGSwapClient:
    """Client for interacting with 0G DEX"""
    
    def __init__(self):
        self.w3 = Web3(Web3.HTTPProvider(os.getenv("ZERO_G_RPC_URL")))
        self.router_address = os.getenv("ZERO_G_UNIVERSAL_ROUTER")
        self.w0g_address = os.getenv("ZERO_G_W0G")
        
        # Load Router ABI (simplified)
        self.router_abi = [...] # Load from artifacts
        self.router = self.w3.eth.contract(
            address=self.router_address,
            abi=self.router_abi
        )
    
    def get_amounts_out(self, amount_in: int, path: List[str]) -> List[int]:
        """Get output amounts for a swap path"""
        return self.router.functions.getAmountsOut(amount_in, path).call()
    
    def swap_exact_tokens(
        self,
        amount_in: int,
        amount_out_min: int,
        path: List[str],
        to: str,
        deadline: int,
        private_key: str
    ) -> str:
        """Execute token swap"""
        # Build transaction
        swap_txn = self.router.functions.swapExactTokensForTokens(
            amount_in,
            amount_out_min,
            path,
            to,
            deadline
        ).build_transaction({
            'from': self.w3.eth.account.from_key(private_key).address,
            'nonce': self.w3.eth.get_transaction_count(
                self.w3.eth.account.from_key(private_key).address
            ),
            'gas': 200000,
            'gasPrice': self.w3.eth.gas_price
        })
        
        # Sign and send
        signed = self.w3.eth.account.sign_transaction(swap_txn, private_key)
        tx_hash = self.w3.eth.send_raw_transaction(signed.rawTransaction)
        
        return tx_hash.hex()
```

### 4. Frontend Integration

Update `frontend/pi-forge-integration.js`:

```javascript
// 0G DEX Configuration
const ZERO_G_CONFIG = {
  chainId: 16661,
  rpcUrl: 'https://evmrpc.0g.ai',
  routerAddress: process.env.ZERO_G_UNIVERSAL_ROUTER,
  w0gAddress: process.env.ZERO_G_W0G,
  factoryAddress: process.env.ZERO_G_FACTORY
};

// Router ABI (minimal)
const ROUTER_ABI = [
  'function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] path, address to, uint deadline) returns (uint[] amounts)',
  'function swapExactETHForTokens(uint amountOutMin, address[] path, address to, uint deadline) payable returns (uint[] amounts)',
  'function addLiquidity(address tokenA, address tokenB, uint amountADesired, uint amountBDesired, uint amountAMin, uint amountBMin, address to, uint deadline) returns (uint amountA, uint amountB, uint liquidity)',
  'function getAmountsOut(uint amountIn, address[] path) view returns (uint[] amounts)'
];

// Swap execution
async function executeSwap(tokenIn, tokenOut, amountIn, slippageBps = 50) {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  
  const router = new ethers.Contract(
    ZERO_G_CONFIG.routerAddress,
    ROUTER_ABI,
    signer
  );
  
  // Calculate minimum output with slippage
  const path = [tokenIn, tokenOut];
  const amounts = await router.getAmountsOut(amountIn, path);
  const amountOutMin = amounts[1].mul(10000 - slippageBps).div(10000);
  
  // Set deadline (20 minutes)
  const deadline = Math.floor(Date.now() / 1000) + 1200;
  
  // Execute swap
  const tx = await router.swapExactTokensForTokens(
    amountIn,
    amountOutMin,
    path,
    await signer.getAddress(),
    deadline
  );
  
  console.log(`Swap transaction: ${tx.hash}`);
  const receipt = await tx.wait();
  console.log(`Swap confirmed in block ${receipt.blockNumber}`);
  
  return receipt;
}
```

---

## Testing & Validation

### 1. Test W0G Wrapping

```bash
# Wrap 0.01 0G to W0G
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

# Unwrap 0.005 W0G
cast send <W0G_ADDRESS> \
  "withdraw(uint256)" \
  5000000000000000 \
  --private-key <PRIVATE_KEY> \
  --rpc-url https://evmrpc.0g.ai
```

### 2. Create Test Token Pair

You'll need two test ERC-20 tokens for this. If you don't have test tokens:

```solidity
// Deploy simple ERC20 test token
contract TestToken is ERC20 {
    constructor() ERC20("Test Token", "TEST") {
        _mint(msg.sender, 1000000 * 10**18);
    }
}
```

```bash
# Create pair
cast send <FACTORY_ADDRESS> \
  "createPair(address,address)" \
  <TOKEN_A_ADDRESS> \
  <TOKEN_B_ADDRESS> \
  --private-key <PRIVATE_KEY> \
  --rpc-url https://evmrpc.0g.ai

# Get pair address
cast call <FACTORY_ADDRESS> \
  "getPair(address,address)(address)" \
  <TOKEN_A_ADDRESS> \
  <TOKEN_B_ADDRESS> \
  --rpc-url https://evmrpc.0g.ai
```

### 3. Add Initial Liquidity

```bash
# Approve tokens for router
cast send <TOKEN_A_ADDRESS> \
  "approve(address,uint256)" \
  <ROUTER_ADDRESS> \
  1000000000000000000000 \
  --private-key <PRIVATE_KEY> \
  --rpc-url https://evmrpc.0g.ai

cast send <TOKEN_B_ADDRESS> \
  "approve(address,uint256)" \
  <ROUTER_ADDRESS> \
  1000000000000000000000 \
  --private-key <PRIVATE_KEY> \
  --rpc-url https://evmrpc.0g.ai

# Add liquidity via router
cast send <ROUTER_ADDRESS> \
  "addLiquidity(address,address,uint256,uint256,uint256,uint256,address,uint256)" \
  <TOKEN_A_ADDRESS> \
  <TOKEN_B_ADDRESS> \
  100000000000000000000 \  # 100 tokens
  100000000000000000000 \  # 100 tokens
  0 \                      # min A
  0 \                      # min B
  <YOUR_ADDRESS> \
  $(($(date +%s) + 1200)) \  # deadline
  --private-key <PRIVATE_KEY> \
  --rpc-url https://evmrpc.0g.ai
```

### 4. Execute Test Swap

```bash
# Swap 1 TOKEN_A for TOKEN_B
cast send <ROUTER_ADDRESS> \
  "swapExactTokensForTokens(uint256,uint256,address[],address,uint256)" \
  1000000000000000000 \  # 1 token in
  0 \                     # min out (set properly in production!)
  "[<TOKEN_A_ADDRESS>,<TOKEN_B_ADDRESS>]" \
  <YOUR_ADDRESS> \
  $(($(date +%s) + 1200)) \
  --private-key <PRIVATE_KEY> \
  --rpc-url https://evmrpc.0g.ai
```

---

## Maintenance & Operations

### Regular Monitoring

1. **Transaction Monitoring**:
   - Track swap volumes via block explorer
   - Monitor gas prices and adjust limits
   - Watch for failed transactions

2. **Liquidity Monitoring**:
   - Check pair reserves regularly
   - Monitor LP token distribution
   - Track fee accumulation

3. **Security Monitoring**:
   - Watch for unusual swap patterns
   - Monitor large liquidity withdrawals
   - Track factory pair creation

### Fee Management

```bash
# Check current feeTo address
cast call <FACTORY_ADDRESS> "feeTo()(address)" --rpc-url https://evmrpc.0g.ai

# Set feeTo address (protocol fees recipient)
cast send <FACTORY_ADDRESS> \
  "setFeeTo(address)" \
  <FEE_RECIPIENT_ADDRESS> \
  --private-key <FEE_TO_SETTER_PRIVATE_KEY> \
  --rpc-url https://evmrpc.0g.ai

# Transfer feeToSetter to multisig
cast send <FACTORY_ADDRESS> \
  "setFeeToSetter(address)" \
  <MULTISIG_ADDRESS> \
  --private-key <CURRENT_FEE_TO_SETTER_KEY> \
  --rpc-url https://evmrpc.0g.ai
```

### Backup Procedures

1. **Save all deployment artifacts**:
   ```bash
   cp -r contracts/0g-uniswap-v2/artifacts/ backups/deployment-$(date +%Y%m%d)/
   ```

2. **Document all addresses**:
   - Maintain offline copy of `.env.launch`
   - Store in team password manager
   - Keep transaction hashes for reference

3. **Contract ABIs**:
   - Export and version control
   - Store in multiple locations
   - Document any modifications

---

## Troubleshooting

### Common Issues

#### Build Failures

**Problem**: `forge build` fails with compilation errors

**Solutions**:
```bash
# Clean and rebuild
forge clean
rm -rf lib cache out
./scripts/setup.sh

# Update Foundry
foundryup

# Check Solidity version compatibility
forge --version
```

#### RPC Connection Errors

**Problem**: Cannot connect to 0G RPC

**Solutions**:
```bash
# Test RPC connectivity
curl -X POST https://evmrpc.0g.ai \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_chainId","params":[],"id":1}'

# Expected: {"jsonrpc":"2.0","id":1,"result":"0x4115"}

# Try alternative RPC (if available)
export ZERO_G_RPC_URL="https://alternative-rpc.0g.ai"

# Check network status
cast block-number --rpc-url https://evmrpc.0g.ai
```

#### Insufficient Gas

**Problem**: Transactions fail with "out of gas"

**Solutions**:
```bash
# Check gas price
cast gas-price --rpc-url https://evmrpc.0g.ai

# Increase gas limit in deployment script
# Edit .env:
export GAS_LIMIT=6000000

# Check deployer balance
cast balance <DEPLOYER_ADDRESS> --rpc-url https://evmrpc.0g.ai
```

#### Init Code Hash Mismatch

**Problem**: Router deployment fails or swaps revert

**Solution**:
1. Redeploy Factory and note PAIR_INIT_CODE_HASH
2. Update `lib/v2-periphery/contracts/libraries/UniswapV2Library.sol`
3. Rebuild: `forge build`
4. Redeploy Router: `./scripts/deploy.sh --resume`

#### Contract Verification Fails

**Problem**: `forge verify-contract` times out or fails

**Solutions**:
```bash
# Manual verification on block explorer
# 1. Visit contract on chainscan.0g.ai
# 2. Click "Verify & Publish"
# 3. Upload flattened source:

forge flatten src/W0G.sol > W0G_flat.sol

# 4. Select compiler version and optimization settings
# 5. Submit for verification
```

### Getting Help

- **0G Discord**: [Community support]
- **0G Documentation**: https://docs.0g.ai
- **Uniswap V2 Docs**: https://docs.uniswap.org/contracts/v2
- **Foundry Book**: https://book.getfoundry.sh
- **Issue Tracker**: GitHub Issues on pi-forge-quantum-genesis repository

---

## Security Considerations

### Pre-Deployment

1. **Private Key Security**:
   - Never commit private keys to version control
   - Use hardware wallet for mainnet deployments
   - Rotate keys after initial deployment
   - Store backups in secure offline location

2. **Code Audit**:
   - Contracts are based on audited Uniswap V2 code
   - Review any modifications carefully
   - Test thoroughly on testnet first

3. **Gas Price Protection**:
   - Set MAX_GAS_PRICE limit
   - Monitor gas prices before deployment
   - Have buffer in deployment wallet

### Post-Deployment

1. **Factory Ownership**:
   - Transfer `feeToSetter` to multisig ASAP
   - Document multisig signers
   - Test multisig functionality before live use

2. **Access Control**:
   - Limit who has access to deployment keys
   - Use principle of least privilege
   - Maintain audit log of all privileged operations

3. **Monitoring & Alerts**:
   - Set up transaction monitoring
   - Configure alerts for unusual activity
   - Regularly review swap patterns
   - Monitor for potential exploits

4. **Incident Response**:
   - Document emergency procedures
   - Maintain contact list for critical issues
   - Have rollback/migration plan ready
   - Regular security reviews

### Contract Immutability

⚠️ **Important**: Once deployed, these contracts are **immutable** and cannot be upgraded or paused.

- No admin functions to pause swaps
- No upgrade mechanisms
- Factory ownership only controls fee recipient
- Ensure thorough testing before mainnet deployment

### Future Migration Path

If/when a canonical DEX emerges on 0G:

1. Deploy liquidity to canonical DEX
2. Create incentives for migration
3. Gradually phase out self-deployed DEX
4. Maintain support for existing liquidity providers
5. Document migration process for users

---

## Deployment Checklist

### Pre-Deployment
- [ ] Foundry installed and updated
- [ ] Wallet funded with 0.5+ 0G
- [ ] `.env` configured with correct values
- [ ] Test RPC connectivity
- [ ] Run `./scripts/setup.sh` successfully
- [ ] All tests passing: `forge test`

### Deployment Phase 1
- [ ] Deploy W0G contract
- [ ] Deploy Factory contract
- [ ] Save PAIR_INIT_CODE_HASH
- [ ] Verify deployments on block explorer

### Deployment Phase 2
- [ ] Update UniswapV2Library.sol with init code hash
- [ ] Rebuild contracts: `forge build`
- [ ] Deploy Router contract
- [ ] Verify Router on block explorer

### Post-Deployment
- [ ] Run `./scripts/post-deploy.sh`
- [ ] Create `.env.launch` with addresses
- [ ] Test W0G wrap/unwrap
- [ ] Create test pair (optional)
- [ ] Add test liquidity (optional)
- [ ] Execute test swap (optional)
- [ ] Verify all contracts on Chainscan
- [ ] Run Python verification: `python scripts/verify_0g_dex.py`

### Integration
- [ ] Update root `.env` with 0G config
- [ ] Update `server/config.py`
- [ ] Create swap integration module
- [ ] Test backend connectivity
- [ ] Update frontend with contract addresses
- [ ] Test end-to-end swap flow

### Security & Operations
- [ ] Transfer feeToSetter to multisig
- [ ] Document all addresses in team wiki
- [ ] Set up monitoring alerts
- [ ] Create incident response plan
- [ ] Backup deployment artifacts
- [ ] Train team on operations procedures

### Communication
- [ ] Update Issue #108 with deployment details
- [ ] Announce deployment to team
- [ ] Document integration steps
- [ ] Create user guide for OINIO flash-launch
- [ ] Close Issue #108

---

## Success Metrics

### Technical Metrics
- ✅ All contracts deployed and verified
- ✅ W0G wraps/unwraps native 0G correctly
- ✅ Factory creates pairs successfully
- ✅ Router executes swaps with proper slippage
- ✅ Gas costs within expected ranges
- ✅ No failed transactions in testing

### Business Metrics
- ✅ OINIO flash-launch unblocked
- ✅ Issue #108 closed
- ✅ Deployment completed within 4-hour timeline
- ✅ Zero critical security issues
- ✅ Full documentation delivered
- ✅ Team trained on operations

---

## Conclusion

This deployment guide provides complete instructions for deploying a production-ready Uniswap V2 fork to 0G Aristotle Mainnet. The solution unblocks the OINIO flash-launch system while maintaining security best practices and operational excellence.

**Timeline**: 2-4 hours from start to completion  
**Status**: Ready for immediate deployment  
**Risk Level**: Low (battle-tested code, thorough testing)  

For questions or issues, contact the deployment team or open a GitHub issue.

---

**Document Version**: 1.0  
**Last Updated**: 2025-12-19  
**Maintained By**: Pi Forge Quantum Genesis Team  
**License**: MIT
