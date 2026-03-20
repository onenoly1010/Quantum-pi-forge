# OINIO Smart Contracts

Production-ready Solidity smart contracts for the **OINIO** (Ontological Intelligence Network Incentive Organism) ecosystem on Pi Network.

## Overview

The OINIO ecosystem consists of two main smart contracts:

1. **OINIOToken.sol** - ERC-20 token for the AI model economy
2. **OINIOModelRegistry.sol** - ERC-721 NFT-based registry for AI models with metadata

## Contract Details

### OINIOToken (ERC-20)

An ERC-20 token with the following features:

- **Token Name**: OINIO Token
- **Symbol**: OINIO
- **Decimals**: 18
- **Initial Supply**: 1,000,000,000 OINIO (1 billion tokens)
- **Burnable**: Users can burn their own tokens for deflationary mechanics
- **Ownable**: Prepared for future governance migration
- **Fixed Supply**: No minting after deployment

**Key Functions:**
- `transfer(address to, uint256 amount)` - Standard ERC-20 transfer
- `approve(address spender, uint256 amount)` - Approve spending
- `transferFrom(address from, address to, uint256 amount)` - Transfer on behalf
- `burn(uint256 amount)` - Burn own tokens
- `burnFrom(address account, uint256 amount)` - Burn approved tokens

### OINIOModelRegistry (ERC-721)

An NFT-based registry for AI models with the following features:

- **ERC-721 Standard**: Each model is a unique NFT
- **On-chain Metadata**: IPFS hash and key attributes stored on-chain
- **Token Staking**: Requires OINIO tokens to register models
- **Access Control**: Only model owners can update metadata
- **Searchable**: Query models by creator address

**AI Model Structure:**
```solidity
struct AIModel {
    uint256 modelId;
    address creator;
    string name;
    string metadataURI;  // IPFS hash
    uint256 stakeAmount; // OINIO tokens staked
    uint256 createdAt;
    bool isActive;
}
```

**Key Functions:**
- `registerModel(string name, string metadataURI, uint256 stakeAmount)` - Register new AI model
- `updateModelMetadata(uint256 modelId, string metadataURI)` - Update model metadata
- `deactivateModel(uint256 modelId)` - Mark model as inactive
- `getModel(uint256 modelId)` - Retrieve model data
- `getModelsByCreator(address creator)` - List all models by creator
- `transferModel(address to, uint256 modelId)` - Transfer model ownership
- `totalModels()` - Get total number of registered models

## Installation

### Prerequisites

- [Foundry](https://book.getfoundry.sh/getting-started/installation) installed
- Git

### Setup

1. Clone the repository:
```bash
git clone https://github.com/onenoly1010/pi-forge-quantum-genesis.git
cd pi-forge-quantum-genesis/contracts
```

2. Install dependencies:
```bash
forge install
```

Dependencies are automatically installed:
- OpenZeppelin Contracts v5.0.0
- Foundry Standard Library

## Development

### Compile Contracts

```bash
forge build
```

### Run Tests

Run all tests:
```bash
forge test
```

Run tests with verbosity:
```bash
forge test -vv
```

Run tests with gas reporting:
```bash
forge test --gas-report
```

Run specific test file:
```bash
forge test --match-path test/OINIOToken.t.sol
```

### Test Coverage

The test suite includes comprehensive coverage:

**OINIOToken Tests (15 tests):**
- Deployment verification
- Transfer functionality
- Approve and transferFrom
- Burn mechanics
- Ownership management
- Edge cases and failure scenarios

**OINIOModelRegistry Tests (21 tests):**
- Model registration
- Token staking verification
- Metadata updates
- Model deactivation
- Model transfers
- Creator queries
- Access control
- Edge cases and failure scenarios

All tests pass with 100% success rate.

## Deployment

### Environment Configuration

Create a `.env` file in the `contracts/` directory:

```bash
PRIVATE_KEY=0x...                                    # Deployer's private key (DO NOT COMMIT)
RPC_URL_TESTNET=https://api.testnet.minepi.com/rpc  # Pi Testnet RPC
RPC_URL_MAINNET=https://rpc.mainnet.pi.network      # Pi Mainnet RPC
ETHERSCAN_API_KEY=...                                # For contract verification (optional)
```

**⚠️ SECURITY WARNING**: Never commit your `.env` file or private keys to version control!

### Deploy to Pi Testnet (Chain ID: 2025)

```bash
forge script script/Deploy.s.sol \
  --rpc-url $RPC_URL_TESTNET \
  --private-key $PRIVATE_KEY \
  --broadcast \
  --verify
```

### Deploy to Pi Mainnet (Chain ID: 314159)

```bash
forge script script/Deploy.s.sol \
  --rpc-url $RPC_URL_MAINNET \
  --private-key $PRIVATE_KEY \
  --broadcast \
  --verify
```

### Deployment Output

After successful deployment, you'll see:

```
=== Deployment Summary ===
Network Chain ID: 2025 (or 314159)
Deployer: 0x...
OINIOToken: 0x...
OINIOModelRegistry: 0x...
```

**Save these contract addresses for frontend integration!**

## Contract Addresses

### Pi Testnet (Chain ID: 2025)
- **OINIOToken**: `[To be deployed]`
- **OINIOModelRegistry**: `[To be deployed]`

### Pi Mainnet (Chain ID: 314159)
- **OINIOToken**: `[To be deployed]`
- **OINIOModelRegistry**: `[To be deployed]`

## Frontend Integration

### Using Web3.js

```javascript
const Web3 = require('web3');
const web3 = new Web3('https://api.testnet.minepi.com/rpc');

// Import ABIs (generated in out/ directory after compilation)
const OINIOTokenABI = require('./out/OINIOToken.sol/OINIOToken.json').abi;
const OINIOModelRegistryABI = require('./out/OINIOModelRegistry.sol/OINIOModelRegistry.json').abi;

const tokenAddress = '0x...'; // From deployment
const registryAddress = '0x...'; // From deployment

const token = new web3.eth.Contract(OINIOTokenABI, tokenAddress);
const registry = new web3.eth.Contract(OINIOModelRegistryABI, registryAddress);

// Example: Check token balance
const balance = await token.methods.balanceOf(userAddress).call();

// Example: Register a model
await token.methods.approve(registryAddress, stakeAmount).send({ from: userAddress });
await registry.methods.registerModel(name, metadataURI, stakeAmount).send({ from: userAddress });
```

### Using Ethers.js

```javascript
const { ethers } = require('ethers');

const provider = new ethers.JsonRpcProvider('https://api.testnet.minepi.com/rpc');
const signer = provider.getSigner();

// Import ABIs
const OINIOTokenABI = require('./out/OINIOToken.sol/OINIOToken.json').abi;
const OINIOModelRegistryABI = require('./out/OINIOModelRegistry.sol/OINIOModelRegistry.json').abi;

const token = new ethers.Contract(tokenAddress, OINIOTokenABI, signer);
const registry = new ethers.Contract(registryAddress, OINIOModelRegistryABI, signer);

// Example: Register a model
const tx1 = await token.approve(registryAddress, stakeAmount);
await tx1.wait();

const tx2 = await registry.registerModel(name, metadataURI, stakeAmount);
await tx2.wait();
```

## Contract ABIs

After compilation with `forge build`, ABIs are available in:
- `out/OINIOToken.sol/OINIOToken.json`
- `out/OINIOModelRegistry.sol/OINIOModelRegistry.json`

## Security Features

- **OpenZeppelin Contracts**: Using audited v5.0.0 implementations
- **ReentrancyGuard**: Protects against reentrancy attacks
- **Access Control**: Only owners can modify their models
- **SafeERC20**: Token transfers use OpenZeppelin's safe patterns
- **Checks-Effects-Interactions**: Following best practices
- **Events**: All state changes emit events for transparency

## Gas Optimization

- **uint256 for counters**: More gas-efficient than smaller types
- **Immutable variables**: `oinioToken` saved as immutable
- **Efficient struct packing**: Optimized storage layout
- **Minimal storage operations**: Reduced SSTORE operations

## Verification on Block Explorer

### Manual Verification

If automatic verification fails, verify manually:

1. Go to the Pi Network block explorer
2. Navigate to your contract address
3. Click "Verify & Publish"
4. Select:
   - Compiler: v0.8.20
   - Optimization: Yes (200 runs)
   - License: MIT
5. Paste flattened source code:

```bash
forge flatten src/OINIOToken.sol > OINIOToken_flattened.sol
forge flatten src/OINIOModelRegistry.sol > OINIOModelRegistry_flattened.sol
```

## Troubleshooting

### Build Issues

If you encounter compilation errors:
```bash
forge clean
forge build
```

### Test Failures

Run tests with more verbosity:
```bash
forge test -vvvv
```

### Deployment Issues

Check your environment variables:
```bash
source .env
echo $PRIVATE_KEY  # Should show your key
echo $RPC_URL_TESTNET  # Should show RPC URL
```

## Development Workflow

1. **Write contracts** in `src/`
2. **Write tests** in `test/`
3. **Compile**: `forge build`
4. **Test**: `forge test`
5. **Deploy to testnet**: `forge script script/Deploy.s.sol --rpc-url $RPC_URL_TESTNET --broadcast`
6. **Verify on testnet**: Test all functions
7. **Deploy to mainnet**: `forge script script/Deploy.s.sol --rpc-url $RPC_URL_MAINNET --broadcast`

## Contributing

This is a production-ready implementation. Any changes should:
1. Maintain backward compatibility
2. Include comprehensive tests
3. Pass all existing tests
4. Follow Solidity style guide
5. Include proper documentation

## License

MIT License - See LICENSE file for details

## Support

For issues or questions:
- GitHub Issues: https://github.com/onenoly1010/pi-forge-quantum-genesis/issues
- Documentation: https://github.com/onenoly1010/pi-forge-quantum-genesis/tree/main/docs

## Acknowledgments

- Built with [Foundry](https://book.getfoundry.sh/)
- Uses [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/)
- Deployed on [Pi Network](https://minepi.com/)
