# OINIO Frontend Integration Example

This guide provides practical examples for integrating OINIO smart contracts into your frontend application.

## Prerequisites

1. Contract addresses from deployment
2. ABI files from `out/OINIOToken.sol/OINIOToken.json` and `out/OINIOModelRegistry.sol/OINIOModelRegistry.json`
3. Web3 library (ethers.js or web3.js)
4. User's Pi Network wallet connection

## Setup

### Install Dependencies

```bash
npm install ethers
# or
npm install web3
```

### Contract Configuration

```javascript
// config/contracts.js
export const CONTRACTS = {
  testnet: {
    chainId: 2025,
    rpcUrl: 'https://api.testnet.minepi.com/rpc',
    oinioToken: '0x...', // From deployment
    oinioModelRegistry: '0x...', // From deployment
  },
  mainnet: {
    chainId: 314159,
    rpcUrl: 'https://rpc.mainnet.pi.network',
    oinioToken: '0x...', // From deployment
    oinioModelRegistry: '0x...', // From deployment
  }
};
```

## Using Ethers.js (Recommended)

### Initialize Contracts

```javascript
import { ethers } from 'ethers';
import OINIOTokenABI from './abis/OINIOToken.json';
import OINIOModelRegistryABI from './abis/OINIOModelRegistry.json';
import { CONTRACTS } from './config/contracts';

// Connect to Pi Network
const provider = new ethers.JsonRpcProvider(CONTRACTS.testnet.rpcUrl);

// Get signer from user's wallet
const signer = await provider.getSigner();

// Initialize contracts
const oinioToken = new ethers.Contract(
  CONTRACTS.testnet.oinioToken,
  OINIOTokenABI.abi,
  signer
);

const modelRegistry = new ethers.Contract(
  CONTRACTS.testnet.oinioModelRegistry,
  OINIOModelRegistryABI.abi,
  signer
);
```

### Check Token Balance

```javascript
async function getTokenBalance(address) {
  try {
    const balance = await oinioToken.balanceOf(address);
    // Convert from wei to OINIO (18 decimals)
    const balanceFormatted = ethers.formatUnits(balance, 18);
    return balanceFormatted;
  } catch (error) {
    console.error('Error fetching balance:', error);
    throw error;
  }
}

// Usage
const userAddress = '0x...';
const balance = await getTokenBalance(userAddress);
console.log(`Balance: ${balance} OINIO`);
```

### Transfer Tokens

```javascript
async function transferTokens(toAddress, amount) {
  try {
    // Convert amount to wei (18 decimals)
    const amountWei = ethers.parseUnits(amount.toString(), 18);
    
    // Send transaction
    const tx = await oinioToken.transfer(toAddress, amountWei);
    console.log('Transaction sent:', tx.hash);
    
    // Wait for confirmation
    const receipt = await tx.wait();
    console.log('Transaction confirmed:', receipt.transactionHash);
    
    return receipt;
  } catch (error) {
    console.error('Transfer failed:', error);
    throw error;
  }
}

// Usage
await transferTokens('0xRecipientAddress', 100); // Transfer 100 OINIO
```

### Register an AI Model

```javascript
async function registerModel(name, metadataURI, stakeAmount) {
  try {
    // Convert stake amount to wei
    const stakeWei = ethers.parseUnits(stakeAmount.toString(), 18);
    
    // Step 1: Approve registry to spend tokens
    console.log('Approving token spending...');
    const approveTx = await oinioToken.approve(
      CONTRACTS.testnet.oinioModelRegistry,
      stakeWei
    );
    await approveTx.wait();
    console.log('Approval confirmed');
    
    // Step 2: Register the model
    console.log('Registering model...');
    const registerTx = await modelRegistry.registerModel(
      name,
      metadataURI,
      stakeWei
    );
    const receipt = await registerTx.wait();
    
    // Extract modelId from events
    const event = receipt.logs.find(
      log => log.fragment && log.fragment.name === 'ModelRegistered'
    );
    const modelId = event.args.modelId;
    
    console.log('Model registered with ID:', modelId.toString());
    return modelId;
  } catch (error) {
    console.error('Model registration failed:', error);
    throw error;
  }
}

// Usage
const modelId = await registerModel(
  'GPT Ethics Validator v1.0',
  'ipfs://QmXxYy...',
  1000 // Stake 1000 OINIO tokens
);
```

### Get Model Details

```javascript
async function getModelDetails(modelId) {
  try {
    const model = await modelRegistry.getModel(modelId);
    
    return {
      modelId: model.modelId.toString(),
      creator: model.creator,
      name: model.name,
      metadataURI: model.metadataURI,
      stakeAmount: ethers.formatUnits(model.stakeAmount, 18),
      createdAt: new Date(Number(model.createdAt) * 1000),
      isActive: model.isActive
    };
  } catch (error) {
    console.error('Error fetching model:', error);
    throw error;
  }
}

// Usage
const model = await getModelDetails(1);
console.log('Model:', model);
```

### Get User's Models

```javascript
async function getUserModels(address) {
  try {
    const modelIds = await modelRegistry.getModelsByCreator(address);
    
    // Fetch details for each model
    const models = await Promise.all(
      modelIds.map(id => getModelDetails(id))
    );
    
    return models;
  } catch (error) {
    console.error('Error fetching user models:', error);
    throw error;
  }
}

// Usage
const userModels = await getUserModels('0xUserAddress');
console.log(`User has ${userModels.length} models`);
```

### Update Model Metadata

```javascript
async function updateModelMetadata(modelId, newMetadataURI) {
  try {
    const tx = await modelRegistry.updateModelMetadata(modelId, newMetadataURI);
    const receipt = await tx.wait();
    
    console.log('Metadata updated:', receipt.transactionHash);
    return receipt;
  } catch (error) {
    console.error('Metadata update failed:', error);
    throw error;
  }
}

// Usage
await updateModelMetadata(1, 'ipfs://QmNewHash...');
```

### Transfer Model Ownership

```javascript
async function transferModel(modelId, toAddress) {
  try {
    const tx = await modelRegistry.transferModel(toAddress, modelId);
    const receipt = await tx.wait();
    
    console.log('Model transferred:', receipt.transactionHash);
    return receipt;
  } catch (error) {
    console.error('Transfer failed:', error);
    throw error;
  }
}

// Usage
await transferModel(1, '0xNewOwnerAddress');
```

### Listen to Events

```javascript
// Listen for new model registrations
modelRegistry.on('ModelRegistered', (modelId, creator, name, metadataURI, stakeAmount) => {
  console.log('New model registered:', {
    modelId: modelId.toString(),
    creator,
    name,
    stakeAmount: ethers.formatUnits(stakeAmount, 18)
  });
});

// Listen for token transfers
oinioToken.on('Transfer', (from, to, amount) => {
  console.log('Token transfer:', {
    from,
    to,
    amount: ethers.formatUnits(amount, 18)
  });
});

// Remove listeners when component unmounts
function cleanup() {
  modelRegistry.removeAllListeners('ModelRegistered');
  oinioToken.removeAllListeners('Transfer');
}
```

## React Component Example

```javascript
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

function ModelRegistry() {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userAddress, setUserAddress] = useState('');

  useEffect(() => {
    loadUserModels();
  }, []);

  async function loadUserModels() {
    try {
      setLoading(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      setUserAddress(address);

      const registry = new ethers.Contract(
        CONTRACTS.testnet.oinioModelRegistry,
        OINIOModelRegistryABI.abi,
        signer
      );

      const modelIds = await registry.getModelsByCreator(address);
      const modelDetails = await Promise.all(
        modelIds.map(id => registry.getModel(id))
      );

      setModels(modelDetails);
    } catch (error) {
      console.error('Error loading models:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleRegisterModel(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    try {
      setLoading(true);
      await registerModel(
        formData.get('name'),
        formData.get('metadataURI'),
        formData.get('stakeAmount')
      );
      await loadUserModels(); // Refresh list
    } catch (error) {
      alert('Registration failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1>My AI Models</h1>
      
      <form onSubmit={handleRegisterModel}>
        <input name="name" placeholder="Model Name" required />
        <input name="metadataURI" placeholder="IPFS URI" required />
        <input name="stakeAmount" type="number" placeholder="Stake Amount" required />
        <button type="submit" disabled={loading}>Register Model</button>
      </form>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {models.map(model => (
            <li key={model.modelId.toString()}>
              <h3>{model.name}</h3>
              <p>Staked: {ethers.formatUnits(model.stakeAmount, 18)} OINIO</p>
              <p>Status: {model.isActive ? 'Active' : 'Inactive'}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ModelRegistry;
```

## Error Handling

```javascript
async function safeContractCall(contractMethod, ...args) {
  try {
    const tx = await contractMethod(...args);
    const receipt = await tx.wait();
    return { success: true, receipt };
  } catch (error) {
    // Parse common errors
    if (error.code === 'INSUFFICIENT_FUNDS') {
      return { success: false, error: 'Insufficient funds for transaction' };
    } else if (error.message.includes('Not the model owner')) {
      return { success: false, error: 'You are not the owner of this model' };
    } else if (error.message.includes('Token transfer failed')) {
      return { success: false, error: 'Please approve token spending first' };
    } else {
      return { success: false, error: error.message };
    }
  }
}

// Usage
const result = await safeContractCall(
  modelRegistry.registerModel,
  'Model Name',
  'ipfs://...',
  ethers.parseUnits('1000', 18)
);

if (result.success) {
  console.log('Success!', result.receipt);
} else {
  console.error('Failed:', result.error);
}
```

## Best Practices

1. **Always validate user input** before sending to contract
2. **Show transaction status** to users (pending, confirmed, failed)
3. **Handle errors gracefully** with user-friendly messages
4. **Cache contract instances** to avoid recreating them
5. **Use event listeners** for real-time updates
6. **Test on testnet first** before mainnet deployment
7. **Implement proper loading states** for async operations
8. **Verify transaction receipts** before updating UI

## Testing Integration

```javascript
// Test token balance
console.log('Testing token balance...');
const balance = await getTokenBalance(userAddress);
console.assert(balance >= 0, 'Balance should be non-negative');

// Test model registration
console.log('Testing model registration...');
const modelId = await registerModel('Test Model', 'ipfs://test', 100);
console.assert(modelId > 0, 'Model ID should be positive');

// Test fetching model
console.log('Testing model fetch...');
const model = await getModelDetails(modelId);
console.assert(model.name === 'Test Model', 'Model name should match');
console.assert(model.isActive === true, 'Model should be active');

console.log('All integration tests passed!');
```

## Additional Resources

- [Ethers.js Documentation](https://docs.ethers.org/)
- [Pi Network Developer Portal](https://developers.minepi.com/)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/)
- [IPFS Documentation](https://docs.ipfs.io/)

## Support

For integration issues:
1. Check contract addresses are correct
2. Verify ABI files are up to date
3. Ensure wallet is connected to correct network
4. Check browser console for detailed errors
5. Test with small amounts first
