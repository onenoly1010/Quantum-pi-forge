# Web3.js Treasury Metrics Configuration Guide

## Overview

The production dashboard now includes **live, on-chain treasury metrics** powered by Web3.js. This provides fully decentralized access to Total Value Locked (TVL) and Available Balance directly from smart contracts—no centralized backend API required.

## Features

✅ **Fully Decentralized** - Data fetched directly from blockchain  
✅ **Wallet Integration** - Auto-detects MetaMask/Web3 wallets  
✅ **Graceful Fallback** - Static values displayed if blockchain unavailable  
✅ **Auto-Refresh** - Metrics update every 5 minutes  
✅ **Zero Gas Fees** - Uses view-only contract calls  
✅ **Multi-Chain Support** - Works with Pi Network, Ethereum, and other EVM chains  

## Configuration Steps

### 1. Obtain RPC Endpoint

Choose an RPC provider based on your network:

#### Pi Network Mainnet (Default)
```javascript
const RPC_URL = 'https://rpc.mainnet.pi.network';
```

#### Alternative Providers
- **Infura**: `https://mainnet.infura.io/v3/YOUR_PROJECT_ID`
- **Alchemy**: `https://eth-mainnet.g.alchemy.com/v2/YOUR_API_KEY`
- **QuickNode**: `https://YOUR_ENDPOINT.quiknode.pro/YOUR_TOKEN/`
- **Public RPCs**: Various free options available

### 2. Deploy or Locate Treasury Contract

Your treasury smart contract must have these **view functions**:

```solidity
// Example Solidity contract interface
interface ITreasury {
    function totalValueLocked() external view returns (uint256);
    function availableBalance() external view returns (uint256);
}
```

**Alternative method names** your contract might use:
- `getTotalAssets()` instead of `totalValueLocked()`
- `getAvailableBalance()` instead of `availableBalance()`
- `tvl()` as a shorthand

### 3. Update Configuration in Code

Edit `frontend/production_dashboard.html` and locate the `refreshForgeMetrics()` function:

```javascript
// === CONFIGURATION - Customize these values ===
const RPC_URL = 'https://rpc.mainnet.pi.network'; // Your RPC endpoint
const TREASURY_CONTRACT_ADDRESS = '0xYourContractAddress'; // Replace with actual address
const TREASURY_ABI = [
    {
        "inputs": [],
        "name": "totalValueLocked", // Update if your method has different name
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "availableBalance", // Update if your method has different name
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    }
];
// ===============================================
```

### 4. Adjust Token Decimals (If Needed)

By default, the code assumes 18 decimals (standard for ETH/PI). If your token uses different decimals:

**For 6 decimals (USDC, USDT):**
```javascript
const tvl = web3.utils.fromWei(tvlRaw, 'mwei'); // 'mwei' = 6 decimals
const available = web3.utils.fromWei(availableRaw, 'mwei');
```

**For custom decimals:**
```javascript
const decimals = 8; // Your token's decimals
const tvl = tvlRaw / (10 ** decimals);
const available = availableRaw / (10 ** decimals);
```

### 5. Update Fallback Values

Edit fallback values to match expected treasury size:

```javascript
const fallback = {
    tvl: 12456789,      // Approximate TVL when blockchain is unavailable
    available: 4567890  // Approximate available balance
};
```

## Testing

### Local Testing

1. Open `frontend/production_dashboard.html` in a browser
2. Open Developer Console (F12)
3. Look for console messages:
   - `✅ Treasury metrics updated from blockchain` - Success
   - `⚠️ Using fallback treasury metrics` - Using fallback values

### With MetaMask

1. Install MetaMask browser extension
2. Connect to the correct network (Pi Network, Ethereum, etc.)
3. Refresh the dashboard
4. Metrics will use MetaMask's provider automatically

### Without Wallet

The dashboard will use the configured public RPC endpoint automatically.

## Troubleshooting

### "Loading..." Displayed Indefinitely

**Cause**: RPC endpoint unreachable or contract address invalid  
**Solution**: 
- Verify RPC URL is correct and accessible
- Check contract address is valid and deployed
- Check browser console for specific errors

### Fallback Values Always Shown

**Cause**: Contract method names don't match ABI  
**Solution**:
- Verify your contract's actual method names using a block explorer
- Update the ABI method names to match

### Values Are Wrong By Factor of 10^X

**Cause**: Token decimals mismatch  
**Solution**: 
- Check your token's decimals in the contract
- Update conversion from `'ether'` to appropriate unit

## Security Considerations

✅ **No Private Keys** - Only read-only view calls  
✅ **No Gas Required** - View functions are free  
✅ **HTTPS Required** - Always use HTTPS RPC endpoints  
✅ **No User Authentication** - Public blockchain data  

⚠️ **Important**: Never hardcode private keys or sensitive data in frontend code

## Advanced: Using The Graph Subgraph

If your treasury data spans multiple contracts or requires complex calculations:

1. Deploy a subgraph indexing your treasury contracts
2. Replace the Web3.js calls with GraphQL queries
3. Update the `updateMetrics()` function to fetch from your subgraph endpoint

```javascript
const response = await fetch('https://api.thegraph.com/subgraphs/name/your-subgraph', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        query: `{
            treasury(id: "your-treasury-id") {
                totalValueLocked
                availableBalance
            }
        }`
    })
});
const data = await response.json();
```

## Support

For issues or questions:
- Check the browser console for error messages
- Verify contract ABI matches deployed contract
- Test RPC endpoint with tools like Postman
- Review blockchain explorer for contract verification

---

**Last Updated**: 2025-12-20  
**Version**: 1.0.0  
**Compatibility**: Web3.js v1.10.0+
