"""
0G Aristotle Mainnet - Uniswap V2 Router Integration
Provides swap functionality for Pi Forge Quantum Genesis
"""

import os
import time
from typing import Dict, List, Optional, Tuple
from decimal import Decimal
from web3 import Web3
from web3.contract import Contract
from eth_account import Account

# Router02 ABI (minimal interface for swaps)
ROUTER_ABI = [
    {
        "inputs": [
            {"internalType": "uint256", "name": "amountIn", "type": "uint256"},
            {"internalType": "uint256", "name": "amountOutMin", "type": "uint256"},
            {"internalType": "address[]", "name": "path", "type": "address[]"},
            {"internalType": "address", "name": "to", "type": "address"},
            {"internalType": "uint256", "name": "deadline", "type": "uint256"}
        ],
        "name": "swapExactTokensForTokens",
        "outputs": [{"internalType": "uint256[]", "name": "amounts", "type": "uint256[]"}],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {"internalType": "uint256", "name": "amountOutMin", "type": "uint256"},
            {"internalType": "address[]", "name": "path", "type": "address[]"},
            {"internalType": "address", "name": "to", "type": "address"},
            {"internalType": "uint256", "name": "deadline", "type": "uint256"}
        ],
        "name": "swapExactETHForTokens",
        "outputs": [{"internalType": "uint256[]", "name": "amounts", "type": "uint256[]"}],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {"internalType": "uint256", "name": "amountIn", "type": "uint256"},
            {"internalType": "uint256", "name": "amountOutMin", "type": "uint256"},
            {"internalType": "address[]", "name": "path", "type": "address[]"},
            {"internalType": "address", "name": "to", "type": "address"},
            {"internalType": "uint256", "name": "deadline", "type": "uint256"}
        ],
        "name": "swapExactTokensForETH",
        "outputs": [{"internalType": "uint256[]", "name": "amounts", "type": "uint256[]"}],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {"internalType": "uint256", "name": "amountIn", "type": "uint256"},
            {"internalType": "address[]", "name": "path", "type": "address[]"}
        ],
        "name": "getAmountsOut",
        "outputs": [{"internalType": "uint256[]", "name": "amounts", "type": "uint256[]"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "factory",
        "outputs": [{"internalType": "address", "name": "", "type": "address"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "WETH",
        "outputs": [{"internalType": "address", "name": "", "type": "address"}],
        "stateMutability": "view",
        "type": "function"
    }
]

# ERC20 ABI (minimal interface)
ERC20_ABI = [
    {
        "inputs": [{"internalType": "address", "name": "account", "type": "address"}],
        "name": "balanceOf",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {"internalType": "address", "name": "spender", "type": "address"},
            {"internalType": "uint256", "name": "amount", "type": "uint256"}
        ],
        "name": "approve",
        "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {"internalType": "address", "name": "owner", "type": "address"},
            {"internalType": "address", "name": "spender", "type": "address"}
        ],
        "name": "allowance",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    }
]


class ZeroGSwapClient:
    """
    Client for interacting with Uniswap V2 Router on 0G Aristotle Mainnet
    """
    
    def __init__(self, rpc_url: str, router_address: str, w0g_address: str, private_key: Optional[str] = None):
        """
        Initialize the swap client
        
        Args:
            rpc_url: 0G Aristotle RPC endpoint
            router_address: UniswapV2Router02 contract address
            w0g_address: W0G (Wrapped 0G) contract address
            private_key: Optional private key for signing transactions
        
        Raises:
            ValueError: If router_address or w0g_address are empty or invalid
        """
        if not router_address or not w0g_address:
            raise ValueError("router_address and w0g_address must be provided and non-empty")
        
        self.w3 = Web3(Web3.HTTPProvider(rpc_url))
        self.router_address = Web3.to_checksum_address(router_address)
        self.w0g_address = Web3.to_checksum_address(w0g_address)
        
        self.router = self.w3.eth.contract(
            address=self.router_address,
            abi=ROUTER_ABI
        )
        
        if private_key:
            self.account = Account.from_key(private_key)
        else:
            self.account = None
    
    def get_amounts_out(self, amount_in: int, path: List[str]) -> List[int]:
        """
        Get expected output amounts for a swap
        
        Args:
            amount_in: Input amount in wei
            path: List of token addresses in swap path
        
        Returns:
            List of amounts including input and expected outputs
        """
        checksum_path = [Web3.to_checksum_address(addr) for addr in path]
        amounts = self.router.functions.getAmountsOut(amount_in, checksum_path).call()
        return amounts
    
    def calculate_min_amount_out(self, amount_out: int, slippage: float = 0.05) -> int:
        """
        Calculate minimum amount out with slippage tolerance
        
        Args:
            amount_out: Expected output amount
            slippage: Slippage tolerance (default 5%)
        
        Returns:
            Minimum amount out accounting for slippage
        """
        return int(amount_out * (1 - slippage))
    
    def get_deadline(self, minutes: int = 20) -> int:
        """
        Generate transaction deadline timestamp
        
        Args:
            minutes: Minutes from now for deadline
        
        Returns:
            Unix timestamp for deadline
        """
        return int(time.time()) + (minutes * 60)
    
    def approve_token(self, token_address: str, amount: int) -> Dict:
        """
        Approve router to spend tokens
        
        Args:
            token_address: ERC20 token address to approve
            amount: Amount to approve (use max uint256 for unlimited)
        
        Returns:
            Transaction receipt
        """
        if not self.account:
            raise ValueError("Private key required for transactions")
        
        token = self.w3.eth.contract(
            address=Web3.to_checksum_address(token_address),
            abi=ERC20_ABI
        )
        
        # Build approval transaction
        tx = token.functions.approve(
            self.router_address,
            amount
        ).build_transaction({
            'from': self.account.address,
            'gas': 100000,
            'gasPrice': self.w3.eth.gas_price,
            'nonce': self.w3.eth.get_transaction_count(self.account.address),
        })
        
        # Sign and send
        signed_tx = self.w3.eth.account.sign_transaction(tx, self.account.key)
        tx_hash = self.w3.eth.send_raw_transaction(signed_tx.rawTransaction)
        
        # Wait for confirmation
        receipt = self.w3.eth.wait_for_transaction_receipt(tx_hash)
        
        return {
            'tx_hash': tx_hash.hex(),
            'status': receipt['status'],
            'gas_used': receipt['gasUsed']
        }
    
    def swap_exact_tokens_for_tokens(
        self,
        amount_in: int,
        amount_out_min: int,
        path: List[str],
        recipient: str,
        deadline: Optional[int] = None
    ) -> Dict:
        """
        Swap exact amount of tokens for tokens
        
        Args:
            amount_in: Exact input amount
            amount_out_min: Minimum output amount (with slippage)
            path: Token swap path
            recipient: Address to receive output tokens
            deadline: Transaction deadline (auto-generated if None)
        
        Returns:
            Transaction details and amounts
        """
        if not self.account:
            raise ValueError("Private key required for transactions")
        
        if deadline is None:
            deadline = self.get_deadline()
        
        checksum_path = [Web3.to_checksum_address(addr) for addr in path]
        checksum_recipient = Web3.to_checksum_address(recipient)
        
        # Build swap transaction
        tx = self.router.functions.swapExactTokensForTokens(
            amount_in,
            amount_out_min,
            checksum_path,
            checksum_recipient,
            deadline
        ).build_transaction({
            'from': self.account.address,
            'gas': 250000,
            'gasPrice': self.w3.eth.gas_price,
            'nonce': self.w3.eth.get_transaction_count(self.account.address),
        })
        
        # Sign and send
        signed_tx = self.w3.eth.account.sign_transaction(tx, self.account.key)
        tx_hash = self.w3.eth.send_raw_transaction(signed_tx.rawTransaction)
        
        # Wait for confirmation
        receipt = self.w3.eth.wait_for_transaction_receipt(tx_hash)
        
        return {
            'tx_hash': tx_hash.hex(),
            'status': receipt['status'],
            'gas_used': receipt['gasUsed'],
            'block_number': receipt['blockNumber']
        }
    
    def swap_exact_0g_for_tokens(
        self,
        amount_0g: int,
        amount_out_min: int,
        token_out: str,
        recipient: str,
        deadline: Optional[int] = None
    ) -> Dict:
        """
        Swap exact 0G for tokens
        
        Args:
            amount_0g: Exact 0G amount to swap (in wei)
            amount_out_min: Minimum token output
            token_out: Output token address
            recipient: Address to receive tokens
            deadline: Transaction deadline
        
        Returns:
            Transaction details
        """
        if not self.account:
            raise ValueError("Private key required for transactions")
        
        if deadline is None:
            deadline = self.get_deadline()
        
        path = [self.w0g_address, Web3.to_checksum_address(token_out)]
        checksum_recipient = Web3.to_checksum_address(recipient)
        
        # Build swap transaction
        tx = self.router.functions.swapExactETHForTokens(
            amount_out_min,
            path,
            checksum_recipient,
            deadline
        ).build_transaction({
            'from': self.account.address,
            'value': amount_0g,
            'gas': 250000,
            'gasPrice': self.w3.eth.gas_price,
            'nonce': self.w3.eth.get_transaction_count(self.account.address),
        })
        
        # Sign and send
        signed_tx = self.w3.eth.account.sign_transaction(tx, self.account.key)
        tx_hash = self.w3.eth.send_raw_transaction(signed_tx.rawTransaction)
        
        # Wait for confirmation
        receipt = self.w3.eth.wait_for_transaction_receipt(tx_hash)
        
        return {
            'tx_hash': tx_hash.hex(),
            'status': receipt['status'],
            'gas_used': receipt['gasUsed'],
            'block_number': receipt['blockNumber']
        }
    
    def get_token_balance(self, token_address: str, account: str) -> int:
        """
        Get token balance for an account
        
        Args:
            token_address: ERC20 token address
            account: Account address to check
        
        Returns:
            Token balance in wei
        """
        token = self.w3.eth.contract(
            address=Web3.to_checksum_address(token_address),
            abi=ERC20_ABI
        )
        return token.functions.balanceOf(Web3.to_checksum_address(account)).call()
    
    def estimate_gas_for_swap(
        self,
        amount_in: int,
        path: List[str],
        recipient: str
    ) -> int:
        """
        Estimate gas for a swap transaction
        
        Args:
            amount_in: Input amount
            path: Token swap path
            recipient: Recipient address
        
        Returns:
            Estimated gas units
        """
        checksum_path = [Web3.to_checksum_address(addr) for addr in path]
        checksum_recipient = Web3.to_checksum_address(recipient)
        
        deadline = self.get_deadline()
        
        estimate = self.router.functions.swapExactTokensForTokens(
            amount_in,
            0,  # Min amount for estimation
            checksum_path,
            checksum_recipient,
            deadline
        ).estimate_gas({
            'from': self.account.address if self.account else checksum_recipient
        })
        
        return estimate


# Convenience functions for Pi Forge integration

def create_swap_client(
    rpc_url: Optional[str] = None,
    router_address: Optional[str] = None,
    w0g_address: Optional[str] = None,
    private_key: Optional[str] = None
) -> ZeroGSwapClient:
    """
    Create swap client with environment variables as defaults
    
    Args:
        rpc_url: Override RPC URL
        router_address: Override router address
        w0g_address: Override W0G address
        private_key: Optional private key for transactions
    
    Returns:
        Configured ZeroGSwapClient instance
    
    Raises:
        ValueError: If required addresses are not provided via args or environment
    """
    final_router = router_address or os.getenv("ZERO_G_UNIVERSAL_ROUTER")
    final_w0g = w0g_address or os.getenv("ZERO_G_W0G")
    
    if not final_router or not final_w0g:
        raise ValueError(
            "Router and W0G addresses must be provided either as arguments or via "
            "ZERO_G_UNIVERSAL_ROUTER and ZERO_G_W0G environment variables"
        )
    
    return ZeroGSwapClient(
        rpc_url=rpc_url or os.getenv("ZERO_G_RPC", "https://evmrpc.0g.ai"),
        router_address=final_router,
        w0g_address=final_w0g,
        private_key=private_key
    )


__all__ = ["ZeroGSwapClient", "create_swap_client"]
