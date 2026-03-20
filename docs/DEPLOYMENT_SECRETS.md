# Deployment Secrets Configuration

This document lists all GitHub Secrets required for deployment workflows.

## Required Secrets

### Pi Network Contracts (Mainnet)
Configure these in: **Settings → Secrets and variables → Actions**

- `CATALYST_POOL_ADDRESS` - Pi Network mainnet Catalyst Pool contract address
- `MODEL_ROYALTY_NFT_ADDRESS` - Pi Network mainnet Model Royalty NFT contract address

### Pi Network Contracts (Testnet)
- `CATALYST_POOL_ADDRESS_TESTNET` - Pi Network testnet Catalyst Pool contract address
- `MODEL_ROYALTY_NFT_ADDRESS_TESTNET` - Pi Network testnet Model Royalty NFT contract address

### 0G Network Contracts (Mainnet)
- `ZERO_G_W0G` - 0G mainnet W0G token contract address
- `ZERO_G_FACTORY` - 0G mainnet Factory contract address
- `ZERO_G_ROUTER` - 0G mainnet Router contract address
- `ZERO_G_UNIVERSAL_ROUTER` - 0G mainnet Universal Router contract address

### 0G Network Contracts (Testnet)
- `ZERO_G_W0G_TESTNET` - 0G testnet W0G token contract address
- `ZERO_G_FACTORY_TESTNET` - 0G testnet Factory contract address
- `ZERO_G_ROUTER_TESTNET` - 0G testnet Router contract address
- `ZERO_G_UNIVERSAL_ROUTER_TESTNET` - 0G testnet Universal Router contract address

## Workflows Using These Secrets

### verify-deployments.yml
**Trigger:** `workflow_dispatch` with network selection
**Secrets Used:** All of the above (based on selected network)

**Networks:**
- `all` - Verifies all networks
- `pi-network-mainnet` - Pi Network mainnet only
- `pi-network-testnet` - Pi Network testnet only
- `zero-g-mainnet` - 0G mainnet only
- `zero-g-testnet` - 0G testnet only

## Setting Secrets

1. Go to your repository on GitHub
2. Navigate to: **Settings → Secrets and variables → Actions**
3. Click: **New repository secret**
4. Enter name and value
5. Click: **Add secret**

## Verification

After configuring secrets, test with:
```bash
# Trigger verification workflow manually
gh workflow run verify-deployments.yml -f network=all
```

Or use the GitHub UI:
- Actions → Verify All Deployments → Run workflow

## Security Notes
- Never commit secret values to the repository
- Rotate secrets periodically
- Use testnet values for testing workflows
- Mainnet secrets should only be added when ready for production deployment
