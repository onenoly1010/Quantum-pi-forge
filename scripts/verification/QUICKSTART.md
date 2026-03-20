# Verification Framework - Quick Start Guide

Get started with multi-chain deployment verification in 5 minutes.

## Prerequisites

Install Foundry (required for RPC interactions):
```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

Verify installation:
```bash
cast --version
forge --version
```

## Setup Environment Variables

1. Copy the example file:
```bash
cp .env.verification.example .env.verification
```

2. Edit with your contract addresses:
```bash
nano .env.verification
```

3. Load the variables:
```bash
source .env.verification
```

## Run Verification

### Verify All Networks
```bash
./scripts/verification/verify-all.sh all
```

### Verify Specific Network

**Pi Network Mainnet:**
```bash
./scripts/verification/pi-network/verify-catalyst.sh mainnet
```

**Pi Network Testnet:**
```bash
./scripts/verification/pi-network/verify-catalyst.sh testnet
```

**0G Mainnet:**
```bash
./scripts/verification/zero-g/verify-uniswap.sh mainnet
```

**0G Testnet:**
```bash
./scripts/verification/zero-g/verify-uniswap.sh testnet
```

**Universal ERC20:**
```bash
./scripts/verification/universal/verify-erc20.sh \
  0x1234567890123456789012345678901234567890 \
  https://rpc.example.com \
  "Token Name" \
  "SYMBOL"
```

## View Reports

Reports are generated in the `reports/` directory:
```bash
# List all reports
ls -lh reports/

# View latest JSON report
cat reports/verification-summary-*.json | jq .

# Open HTML report in browser
open reports/verification-report-*.html  # macOS
xdg-open reports/verification-report-*.html  # Linux
```

## Example Output

```
🔮 Pi Network Catalyst Pool Verification
================================================================================
ℹ️  Network: Pi Network Mainnet
ℹ️  RPC: https://rpc.mainnet.pi.network

📋 Environment Configuration
================================================================================
✅ Catalyst Pool address is configured
✅ Model Royalty NFT address is configured

🌐 Network Connectivity
================================================================================
✅ RPC connected to Pi Network Mainnet (Block: 12345678)
✅ Chain ID verified: 314159

✅ All assertions passed! Verification completed successfully.
```

## Troubleshooting

### "Foundry 'cast' command not found"
Install Foundry: `curl -L https://foundry.paradigm.xyz | bash && foundryup`

### "Cannot connect to RPC"
Check your internet connection and verify the RPC URL is correct.

### "Missing required environment variables"
Make sure you've sourced the `.env.verification` file: `source .env.verification`

### "Invalid address format"
Ethereum addresses must be 42 characters: `0x` + 40 hex digits

## Next Steps

1. **Read Full Documentation:** See [docs/VERIFICATION.md](../../docs/VERIFICATION.md)
2. **Run Tests:** Execute `./tests/verification-tests.sh`
3. **Integrate with CI/CD:** See GitHub Actions workflow in `.github/workflows/verify-deployments.yml`
4. **Add New Chains:** Follow the guide in [docs/VERIFICATION.md](../../docs/VERIFICATION.md#adding-new-chains)

## Need Help?

- 📖 [Full Documentation](../../docs/VERIFICATION.md)
- 🧪 [Run Tests](../../tests/verification-tests.sh)
- 🔍 [Check Integration](../../tests/test-verification-integration.sh)

## Features at a Glance

✅ **Zero Human Error** - Automated assertions catch all misconfigurations  
✅ **Beautiful Output** - Color-coded, emoji-enhanced terminal UI  
✅ **Multi-Chain** - Pi Network, 0G, Ethereum, easily extensible  
✅ **CI/CD Ready** - JSON exports, GitHub Actions integration  
✅ **Comprehensive** - Validates deployment, configuration, balances, integrations  
