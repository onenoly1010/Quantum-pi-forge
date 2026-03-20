# Pi Forge Quantum Genesis - Deployment Verification Guide

## Overview

This comprehensive verification system eliminates human error in multi-chain deployment validation across Pi Network, 0G Aristotle, and any future EVM chains. It provides automated assertions, color-coded reporting, and zero-tolerance error handling.

## Quick Start

### Prerequisites

1. **Foundry** - Install from [getfoundry.sh](https://book.getfoundry.sh/getting-started/installation)
   ```bash
   curl -L https://foundry.paradigm.xyz | bash
   foundryup
   ```

2. **bc** - For floating-point calculations (usually pre-installed)
   ```bash
   # Ubuntu/Debian
   sudo apt-get install bc
   
   # macOS
   brew install bc
   ```

3. **Environment Variables** - Set contract addresses in your environment or `.env` file

### Basic Usage

#### Verify All Networks
```bash
./scripts/verification/verify-all.sh all
```

#### Verify Specific Network
```bash
# Pi Network Mainnet
./scripts/verification/verify-all.sh pi-network-mainnet

# Pi Network Testnet
./scripts/verification/verify-all.sh pi-network-testnet

# 0G Mainnet
./scripts/verification/verify-all.sh zero-g-mainnet

# 0G Testnet
./scripts/verification/verify-all.sh zero-g-testnet
```

#### Verify Individual Deployments

**Pi Network:**
```bash
# Mainnet
./scripts/verification/pi-network/verify-catalyst.sh mainnet

# Testnet
./scripts/verification/pi-network/verify-catalyst.sh testnet
```

**0G Network:**
```bash
# Mainnet
./scripts/verification/zero-g/verify-uniswap.sh mainnet

# Testnet
./scripts/verification/zero-g/verify-uniswap.sh testnet
```

**Universal ERC20:**
```bash
./scripts/verification/universal/verify-erc20.sh \
  0x123... \
  https://rpc.example.com \
  "Token Name" \
  "SYMBOL"
```

## Environment Variables

### Pi Network Mainnet
```bash
export CATALYST_POOL_ADDRESS="0x..."
export MODEL_ROYALTY_NFT_ADDRESS="0x..."
```

### Pi Network Testnet
```bash
export CATALYST_POOL_ADDRESS_TESTNET="0x..."
export MODEL_ROYALTY_NFT_ADDRESS_TESTNET="0x..."
```

### 0G Mainnet
```bash
export ZERO_G_W0G="0x..."
export ZERO_G_FACTORY="0x..."
export ZERO_G_ROUTER="0x..."
export ZERO_G_UNIVERSAL_ROUTER="0x..."  # Optional
```

### 0G Testnet
```bash
export ZERO_G_W0G_TESTNET="0x..."
export ZERO_G_FACTORY_TESTNET="0x..."
export ZERO_G_ROUTER_TESTNET="0x..."
export ZERO_G_UNIVERSAL_ROUTER_TESTNET="0x..."  # Optional
```

### Using .env File
Create a `.env.verification` file:
```bash
# Copy from example
cp .env.example .env.verification

# Edit with your contract addresses
nano .env.verification

# Source it before running
source .env.verification
```

## Architecture

### Directory Structure
```
scripts/verification/
├── lib/
│   ├── colors.sh          # ANSI color codes and formatting
│   ├── validators.sh      # Reusable validation functions
│   ├── formatters.sh      # Decimal/unit formatting utilities
│   └── assertions.sh      # Assertion framework with exit codes
├── pi-network/
│   └── verify-catalyst.sh # Pi Network Catalyst verification
├── zero-g/
│   └── verify-uniswap.sh  # 0G Uniswap V2 verification
├── universal/
│   └── verify-erc20.sh    # Generic ERC20 verification
└── verify-all.sh          # Master orchestration script
```

### Core Libraries

#### colors.sh
Provides consistent, color-coded output:
- `success()` - Green checkmark for successful operations
- `error()` - Red X for failures
- `warning()` - Yellow warning triangle
- `info()` - Cyan information icon
- `section()` - Bold magenta section headers
- `highlight()` - Bold cyan for important values

#### validators.sh
Common validation functions:
- `validate_contract_exists()` - Check contract deployment
- `validate_rpc()` - Test RPC connectivity
- `validate_address()` - Validate Ethereum address format
- `validate_balance()` - Check minimum balance requirements
- `validate_chain_id()` - Verify chain ID
- `validate_erc20_token()` - Comprehensive ERC20 validation

#### formatters.sh
Data formatting utilities:
- `format_token_amount()` - Convert wei to human-readable
- `format_timestamp()` - Unix timestamp to date string
- `addresses_match()` - Case-insensitive address comparison
- `format_number()` - Add thousand separators
- `normalize_address()` - Convert to lowercase
- `truncate_address()` - Shorten for display

#### assertions.sh
Test-like assertion framework:
- `assert_equals()` - Assert equality
- `assert_address_equals()` - Assert address equality (case-insensitive)
- `assert_greater_than()` - Assert numeric comparison
- `assert_not_empty()` - Assert non-empty value
- `assert_contract_deployed()` - Assert contract exists
- `finalize_assertions()` - Exit with failure if any assertions failed

## Verification Features

### Pi Network Catalyst Pool
Verifies:
- ✅ Contract deployment at specified addresses
- ✅ RPC connectivity and chain ID
- ✅ Address format validation
- ✅ Contract properties (owner, NFT name/symbol)
- ✅ Owner balance sufficiency
- ✅ Pool ↔ NFT linkage (if applicable)
- ✅ JSON report export

### 0G Uniswap V2
Verifies:
- ✅ W0G (Wrapped 0G) deployment
- ✅ Factory deployment and properties
- ✅ Router deployment and configuration
- ✅ Universal Router (optional)
- ✅ Factory ↔ Router linkage
- ✅ W0G token properties (name, symbol, decimals)
- ✅ Init code hash (if available)
- ✅ Integration tests (balanceOf, getPair)
- ✅ JSON report export

### Universal ERC20
Verifies:
- ✅ Contract deployment
- ✅ Standard ERC20 interface
- ✅ Token metadata (name, symbol, decimals, supply)
- ✅ Optional features (burnable, mintable, pausable)
- ✅ Expected values validation
- ✅ JSON report export

## Reports

### JSON Reports
Each verification generates a timestamped JSON report in `reports/`:
- Individual network reports: `pi-network-mainnet-verification-*.json`
- Summary reports: `verification-summary-*.json`

Example JSON structure:
```json
{
  "network": "Pi Network Mainnet",
  "chain_id": 314159,
  "rpc_url": "https://rpc.mainnet.pi.network",
  "timestamp": "2024-12-17T03:49:35Z",
  "contracts": {
    "catalyst_pool": {
      "address": "0x123...",
      "deployed": true,
      "explorer_url": "https://pi-blockchain.net/address/0x123..."
    }
  },
  "verification_status": "passed",
  "assertion_failures": 0
}
```

### HTML Reports
Visual reports with color-coded status:
- Summary statistics (total, successful, failed)
- Individual network results
- Timestamp and network filter info
- Saved as: `verification-report-*.html`

## GitHub Actions Integration

### Workflow Dispatch
Trigger verification from GitHub UI:
1. Go to **Actions** tab
2. Select **Verify All Deployments**
3. Click **Run workflow**
4. Choose network filter
5. View results and download artifacts

### Automated Verification
Add to your deployment workflow:
```yaml
- name: Verify Deployment
  uses: ./.github/workflows/verify-deployments.yml
  with:
    network: pi-network-mainnet
```

### Secrets Configuration
Configure in **Settings → Secrets and variables → Actions**:
- `CATALYST_POOL_ADDRESS`
- `MODEL_ROYALTY_NFT_ADDRESS`
- `ZERO_G_W0G`
- `ZERO_G_FACTORY`
- `ZERO_G_ROUTER`
- And testnet equivalents

## Adding New Chains

### 1. Add Network Configuration
Edit `config/networks.json`:
```json
{
  "my-chain": {
    "rpc": "https://rpc.mychain.com",
    "chain_id": 12345,
    "native_symbol": "MCT",
    "explorer": "https://explorer.mychain.com",
    "contracts": {
      "token": "${MY_CHAIN_TOKEN}",
      "factory": "${MY_CHAIN_FACTORY}"
    }
  }
}
```

### 2. Create Verification Script
```bash
#!/bin/bash
# scripts/verification/my-chain/verify-deployment.sh

set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LIB_DIR="$SCRIPT_DIR/../lib"

source "$LIB_DIR/colors.sh"
source "$LIB_DIR/validators.sh"
source "$LIB_DIR/formatters.sh"
source "$LIB_DIR/assertions.sh"

# Your verification logic here
main() {
    section "My Chain Verification"
    # Add validation steps
    finalize_assertions || exit 1
}

main "$@"
```

### 3. Update Master Script
Edit `scripts/verification/verify-all.sh` to include your chain:
```bash
if [ "$NETWORK_FILTER" == "all" ] || [ "$NETWORK_FILTER" == "my-chain" ]; then
    section "My Chain Verification"
    run_verification \
        "$SCRIPT_DIR/my-chain/verify-deployment.sh" \
        "mainnet" \
        "My Chain Deployment" || true
fi
```

### 4. Update GitHub Actions
Add environment variables to `.github/workflows/verify-deployments.yml`:
```yaml
env:
  MY_CHAIN_TOKEN: ${{ secrets.MY_CHAIN_TOKEN }}
  MY_CHAIN_FACTORY: ${{ secrets.MY_CHAIN_FACTORY }}
```

## Troubleshooting

### Common Issues

#### "Foundry 'cast' command not found"
**Solution:** Install Foundry
```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

#### "Cannot connect to RPC"
**Possible causes:**
1. RPC endpoint is down or incorrect
2. Network connectivity issues
3. Rate limiting

**Solution:** Verify RPC URL manually
```bash
cast block-number --rpc-url https://rpc.example.com
```

#### "Invalid address format"
**Cause:** Address doesn't match `0x[40 hex chars]` pattern

**Solution:** Check your environment variables
```bash
echo $CATALYST_POOL_ADDRESS
# Should output: 0x1234567890123456789012345678901234567890
```

#### "Contract not deployed"
**Possible causes:**
1. Incorrect address
2. Wrong network/RPC
3. Contract hasn't been deployed yet

**Solution:** Verify on block explorer
```bash
cast code $YOUR_ADDRESS --rpc-url $YOUR_RPC
# Should output bytecode, not "0x"
```

#### "Assertion failed"
**Cause:** Verification found a mismatch

**Solution:** Review the specific assertion that failed. The output will show:
- Expected value
- Actual value
- Description of what was being checked

### Debug Mode

Enable debug output:
```bash
DEBUG=1 ./scripts/verification/verify-all.sh all
```

This shows additional information about:
- Address validations
- RPC calls
- Intermediate calculations

### Verbose Mode

For maximum detail with `cast` commands:
```bash
# Add -vvv to cast calls in scripts
cast call $ADDR "function()" --rpc-url $RPC -vvv
```

## Best Practices

### Before Running Verification

1. ✅ **Update environment variables** with latest addresses
2. ✅ **Test RPC connectivity** manually
3. ✅ **Verify contracts on block explorer** first
4. ✅ **Check you're on the correct network** (mainnet vs testnet)

### During Verification

1. ✅ **Review color-coded output** for warnings
2. ✅ **Check assertion failures** immediately
3. ✅ **Save reports** for documentation
4. ✅ **Verify explorer links** work correctly

### After Verification

1. ✅ **Archive JSON reports** for auditing
2. ✅ **Share HTML reports** with team
3. ✅ **Update documentation** if addresses change
4. ✅ **Run regularly** to catch configuration drift

## CI/CD Integration

### Pre-Deployment Checks
```bash
# In your deployment script
./scripts/verification/verify-all.sh testnet
if [ $? -eq 0 ]; then
    echo "Testnet verification passed, proceeding to mainnet"
else
    echo "Testnet verification failed, aborting"
    exit 1
fi
```

### Post-Deployment Verification
```bash
# After deployment
export NEW_CONTRACT_ADDRESS="0x..."
./scripts/verification/universal/verify-erc20.sh \
    $NEW_CONTRACT_ADDRESS \
    $RPC_URL \
    "Expected Name" \
    "SYMBOL"
```

### Continuous Monitoring
```bash
# Add to cron or GitHub Actions schedule
0 */6 * * * /path/to/verify-all.sh all >> /var/log/verification.log 2>&1
```

## Expected Values Reference

### Pi Network Mainnet
- **Chain ID:** 314159
- **Native Symbol:** PI
- **RPC:** https://rpc.mainnet.pi.network
- **Explorer:** https://pi-blockchain.net

### Pi Network Testnet
- **Chain ID:** 2025
- **Native Symbol:** PI
- **RPC:** https://api.testnet.minepi.com/rpc
- **Explorer:** https://testnet.minepi.com

### 0G Mainnet
- **Chain ID:** 16661
- **Native Symbol:** 0G
- **RPC:** https://evmrpc.0g.ai
- **Explorer:** https://chainscan.0g.ai

### 0G Testnet
- **Chain ID:** 16600
- **Native Symbol:** 0G
- **RPC:** https://evmrpc-testnet.0g.ai
- **Explorer:** https://chainscan-testnet.0g.ai

## Support

For issues or questions:
1. Check this documentation first
2. Review existing GitHub Issues
3. Check verification reports in `reports/`
4. Enable debug mode for more details
5. Open a new issue with full error output

## Contributing

To improve the verification system:
1. Add new validation functions to `lib/validators.sh`
2. Add new formatters to `lib/formatters.sh`
3. Add new assertions to `lib/assertions.sh`
4. Update this documentation
5. Add tests to verify your changes

## License

Part of Pi Forge Quantum Genesis project. See LICENSE file for details.
