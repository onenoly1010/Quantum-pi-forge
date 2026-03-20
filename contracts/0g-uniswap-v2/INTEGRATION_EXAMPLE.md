# Pi Forge Integration Examples

## Backend Integration (Python)

### 1. Initialize Swap Client

```python
from server.integrations.zero_g_swap import create_swap_client
from server.config import ZERO_G_CONFIG

# Create client with environment variables
client = create_swap_client()

# Or create with explicit parameters
client = create_swap_client(
    rpc_url="https://evmrpc.0g.ai",
    router_address="0x...",  # Your router address
    w0g_address="0x...",     # Your W0G address
    private_key="0x..."      # Optional, for transactions
)
```

### 2. Get Swap Quote

```python
from web3 import Web3

# Define swap parameters
token_a = "0x..."  # Input token address
token_b = "0x..."  # Output token address
amount_in = Web3.to_wei(1, 'ether')  # 1 token

# Get expected output
path = [token_a, token_b]
amounts = client.get_amounts_out(amount_in, path)

print(f"Input: {Web3.from_wei(amounts[0], 'ether')} Token A")
print(f"Output: {Web3.from_wei(amounts[1], 'ether')} Token B")

# Calculate minimum output with 5% slippage
min_amount_out = client.calculate_min_amount_out(amounts[1], slippage=0.05)
print(f"Min Output (5% slippage): {Web3.from_wei(min_amount_out, 'ether')} Token B")
```

### 3. Execute Token Swap

```python
# Approve router to spend tokens
approval_result = client.approve_token(
    token_address=token_a,
    amount=Web3.to_wei(2**256 - 1, 'wei')  # Max approval
)
print(f"Approval TX: {approval_result['tx_hash']}")

# Execute swap
swap_result = client.swap_exact_tokens_for_tokens(
    amount_in=amount_in,
    amount_out_min=min_amount_out,
    path=[token_a, token_b],
    recipient="0x...",  # Recipient address
    deadline=None  # Auto-generated (20 minutes from now)
)

print(f"Swap TX: {swap_result['tx_hash']}")
print(f"Gas Used: {swap_result['gas_used']}")
print(f"Block: {swap_result['block_number']}")
```

### 4. Swap 0G for Tokens

```python
from web3 import Web3

# Swap 0.1 0G for tokens
amount_0g = Web3.to_wei(0.1, 'ether')
token_out = "0x..."  # Output token

# Get quote
amounts = client.get_amounts_out(amount_0g, [client.w0g_address, token_out])
min_out = client.calculate_min_amount_out(amounts[1])

# Execute swap
result = client.swap_exact_0g_for_tokens(
    amount_0g=amount_0g,
    amount_out_min=min_out,
    token_out=token_out,
    recipient="0x...",
    deadline=None
)

print(f"TX Hash: {result['tx_hash']}")
```

### 5. Check Token Balance

```python
token_address = "0x..."
user_address = "0x..."

balance = client.get_token_balance(token_address, user_address)
print(f"Balance: {Web3.from_wei(balance, 'ether')} tokens")
```

### 6. Estimate Gas Cost

```python
# Estimate gas for a swap
estimated_gas = client.estimate_gas_for_swap(
    amount_in=Web3.to_wei(1, 'ether'),
    path=[token_a, token_b],
    recipient="0x..."
)

gas_price = client.w3.eth.gas_price
estimated_cost = estimated_gas * gas_price

print(f"Estimated Gas: {estimated_gas} units")
print(f"Estimated Cost: {Web3.from_wei(estimated_cost, 'ether')} 0G")
```

## FastAPI Endpoint Examples

### Add to `server/main.py`:

```python
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from server.integrations.zero_g_swap import create_swap_client
from web3 import Web3

router = APIRouter(prefix="/api/v1/swap", tags=["0G Swap"])

class SwapQuoteRequest(BaseModel):
    token_in: str
    token_out: str
    amount_in: str  # In wei or use Decimal

class SwapQuoteResponse(BaseModel):
    amount_in: str
    amount_out: str
    min_amount_out: str
    price_impact: float
    path: list[str]

@router.post("/quote", response_model=SwapQuoteResponse)
async def get_swap_quote(request: SwapQuoteRequest):
    """Get swap quote without executing transaction"""
    try:
        client = create_swap_client()
        
        amount_in = int(request.amount_in)
        path = [request.token_in, request.token_out]
        
        amounts = client.get_amounts_out(amount_in, path)
        min_out = client.calculate_min_amount_out(amounts[1])
        
        # Calculate price impact (simplified)
        price_impact = 0.01  # Would need pool reserves for accurate calculation
        
        return SwapQuoteResponse(
            amount_in=str(amounts[0]),
            amount_out=str(amounts[1]),
            min_amount_out=str(min_out),
            price_impact=price_impact,
            path=path
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

class SwapExecuteRequest(BaseModel):
    token_in: str
    token_out: str
    amount_in: str
    min_amount_out: str
    recipient: str

class SwapExecuteResponse(BaseModel):
    tx_hash: str
    status: int
    gas_used: int
    block_number: int

@router.post("/execute", response_model=SwapExecuteResponse)
async def execute_swap(request: SwapExecuteRequest):
    """Execute swap transaction (requires private key in env)"""
    try:
        client = create_swap_client(private_key=os.getenv("SWAP_PRIVATE_KEY"))
        
        # Approve tokens first (one-time)
        # client.approve_token(request.token_in, 2**256-1)
        
        result = client.swap_exact_tokens_for_tokens(
            amount_in=int(request.amount_in),
            amount_out_min=int(request.min_amount_out),
            path=[request.token_in, request.token_out],
            recipient=request.recipient,
            deadline=None
        )
        
        return SwapExecuteResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# Add router to main app
app.include_router(router)
```

## Frontend Integration (JavaScript)

### Using Web3.js

```javascript
const Web3 = require('web3');
const web3 = new Web3('https://evmrpc.0g.ai');

// Router ABI (minimal)
const routerABI = [
  {
    "inputs": [
      {"type": "uint256", "name": "amountIn"},
      {"type": "uint256", "name": "amountOutMin"},
      {"type": "address[]", "name": "path"},
      {"type": "address", "name": "to"},
      {"type": "uint256", "name": "deadline"}
    ],
    "name": "swapExactTokensForTokens",
    "outputs": [{"type": "uint256[]", "name": "amounts"}],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

const routerAddress = process.env.ZERO_G_UNIVERSAL_ROUTER;
const router = new web3.eth.Contract(routerABI, routerAddress);

// Execute swap
async function executeSwap(tokenIn, tokenOut, amountIn, userAddress) {
  const path = [tokenIn, tokenOut];
  const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes
  
  // Get quote first
  const amounts = await router.methods.getAmountsOut(amountIn, path).call();
  const minOut = Math.floor(amounts[1] * 0.95); // 5% slippage
  
  // Execute swap
  const tx = await router.methods.swapExactTokensForTokens(
    amountIn,
    minOut,
    path,
    userAddress,
    deadline
  ).send({
    from: userAddress,
    gas: 250000
  });
  
  return tx;
}
```

### Using Ethers.js

```javascript
const { ethers } = require('ethers');

const provider = new ethers.JsonRpcProvider('https://evmrpc.0g.ai');
const signer = provider.getSigner();

const routerAddress = process.env.ZERO_G_UNIVERSAL_ROUTER;
const router = new ethers.Contract(routerAddress, routerABI, signer);

// Approve token
async function approveToken(tokenAddress, amount) {
  const token = new ethers.Contract(tokenAddress, [
    "function approve(address spender, uint256 amount) returns (bool)"
  ], signer);
  
  const tx = await token.approve(routerAddress, amount);
  await tx.wait();
  return tx.hash;
}

// Execute swap
async function swap(tokenIn, tokenOut, amountIn, recipient) {
  const path = [tokenIn, tokenOut];
  const deadline = Math.floor(Date.now() / 1000) + 60 * 20;
  
  // Get quote
  const amounts = await router.getAmountsOut(amountIn, path);
  const minOut = amounts[1].mul(95).div(100); // 5% slippage
  
  // Execute
  const tx = await router.swapExactTokensForTokens(
    amountIn,
    minOut,
    path,
    recipient,
    deadline,
    { gasLimit: 250000 }
  );
  
  const receipt = await tx.wait();
  return receipt;
}
```

## React Component Example

```jsx
import { useState } from 'react';
import { ethers } from 'ethers';

function SwapWidget() {
  const [amountIn, setAmountIn] = useState('');
  const [amountOut, setAmountOut] = useState('');
  const [loading, setLoading] = useState(false);

  const getQuote = async () => {
    const provider = new ethers.JsonRpcProvider('https://evmrpc.0g.ai');
    const router = new ethers.Contract(
      process.env.REACT_APP_ROUTER_ADDRESS,
      routerABI,
      provider
    );

    const path = [tokenInAddress, tokenOutAddress];
    const amounts = await router.getAmountsOut(
      ethers.parseEther(amountIn),
      path
    );
    
    setAmountOut(ethers.formatEther(amounts[1]));
  };

  const executeSwap = async () => {
    setLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const router = new ethers.Contract(
        process.env.REACT_APP_ROUTER_ADDRESS,
        routerABI,
        signer
      );

      const deadline = Math.floor(Date.now() / 1000) + 60 * 20;
      const minOut = ethers.parseEther(amountOut) * 95n / 100n;

      const tx = await router.swapExactTokensForTokens(
        ethers.parseEther(amountIn),
        minOut,
        [tokenInAddress, tokenOutAddress],
        await signer.getAddress(),
        deadline
      );

      await tx.wait();
      alert('Swap successful!');
    } catch (error) {
      alert('Swap failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="swap-widget">
      <input
        type="text"
        value={amountIn}
        onChange={(e) => setAmountIn(e.target.value)}
        onBlur={getQuote}
        placeholder="Amount In"
      />
      <div>↓</div>
      <input
        type="text"
        value={amountOut}
        readOnly
        placeholder="Amount Out"
      />
      <button onClick={executeSwap} disabled={loading}>
        {loading ? 'Swapping...' : 'Swap'}
      </button>
    </div>
  );
}
```

## Testing Examples

### pytest (Backend)

```python
import pytest
from server.integrations.zero_g_swap import create_swap_client
from web3 import Web3

@pytest.fixture
def swap_client():
    return create_swap_client(
        rpc_url="https://evmrpc.0g.ai",
        router_address="0x...",
        w0g_address="0x..."
    )

def test_get_quote(swap_client):
    token_a = "0x..."
    token_b = "0x..."
    amount_in = Web3.to_wei(1, 'ether')
    
    amounts = swap_client.get_amounts_out(amount_in, [token_a, token_b])
    
    assert len(amounts) == 2
    assert amounts[0] == amount_in
    assert amounts[1] > 0

def test_calculate_min_out(swap_client):
    amount = 1000000
    min_out = swap_client.calculate_min_amount_out(amount, slippage=0.05)
    
    assert min_out == 950000  # 5% slippage
```

## Environment Variables Checklist

Make sure these are set in your `.env`:

```bash
# Required for Pi Forge integration
ZERO_G_W0G=0x...
ZERO_G_FACTORY=0x...
ZERO_G_UNIVERSAL_ROUTER=0x...
ZERO_G_RPC=https://evmrpc.0g.ai
ZERO_G_CHAIN_ID=16661

# Optional: For backend swap execution
SWAP_PRIVATE_KEY=0x...  # Only if backend executes swaps
```

## Security Best Practices

1. **Never expose private keys in frontend code**
2. **Use backend for transaction signing when possible**
3. **Validate all user inputs**
4. **Set reasonable slippage limits (1-5%)**
5. **Implement rate limiting on swap endpoints**
6. **Monitor for unusual transaction patterns**
7. **Use deadline parameter to prevent stale transactions**
8. **Always approve exact amounts or use EIP-2612 permits**

## Common Issues & Solutions

### Issue: Transaction Reverts
**Solution**: Increase slippage tolerance or check token approvals

### Issue: Gas Estimation Fails
**Solution**: Verify token addresses and ensure sufficient balance

### Issue: RPC Connection Timeout
**Solution**: Implement retry logic and use multiple RPC endpoints

### Issue: Incorrect Amount Out
**Solution**: Ensure amounts are in wei, not ether units

---

For more examples, see:
- [Uniswap V2 Docs](https://docs.uniswap.org/contracts/v2)
- [Web3.py Docs](https://web3py.readthedocs.io/)
- [Ethers.js Docs](https://docs.ethers.org/)
