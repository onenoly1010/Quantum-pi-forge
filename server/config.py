"""
Configuration module for Pi Forge Quantum Genesis
Includes network configurations for various blockchain integrations
"""

import os
from typing import Dict, Any

# =============================================================================
# SUPABASE CONFIGURATION
# =============================================================================
SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "")
JWT_SECRET = os.getenv("JWT_SECRET", "")

# =============================================================================
# SERVER CONFIGURATION
# =============================================================================
DEBUG = os.getenv("DEBUG", "false").lower() == "true"
LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")
ENVIRONMENT = os.getenv("ENVIRONMENT", "development")

# =============================================================================
# PI NETWORK CONFIGURATION
# =============================================================================
PI_NETWORK_CONFIG = {
    "mode": os.getenv("PI_NETWORK_MODE", "mainnet"),
    "app_id": os.getenv("PI_NETWORK_APP_ID", ""),
    "api_key": os.getenv("PI_NETWORK_API_KEY", ""),
    "api_endpoint": os.getenv("PI_NETWORK_API_ENDPOINT", "https://api.minepi.com"),
    "sandbox_mode": os.getenv("PI_SANDBOX_MODE", "false").lower() == "true",
    "webhook_secret": os.getenv("PI_NETWORK_WEBHOOK_SECRET", ""),
}

# =============================================================================
# 0G ARISTOTLE MAINNET CONFIGURATION
# =============================================================================
ZERO_G_CONFIG: Dict[str, Any] = {
    "chain_id": 16661,
    "chain_name": "0G Aristotle Mainnet",
    "rpc_url": os.getenv("ZERO_G_RPC", "https://evmrpc.0g.ai"),
    "block_explorer": "https://chainscan.0g.ai",
    "native_token": {
        "name": "0G",
        "symbol": "A0GI",
        "decimals": 18
    },
    
    # Uniswap V2 Fork Contract Addresses
    "contracts": {
        "w0g": os.getenv("ZERO_G_W0G", ""),  # Wrapped 0G
        "factory": os.getenv("ZERO_G_FACTORY", ""),  # UniswapV2Factory
        "router": os.getenv("ZERO_G_UNIVERSAL_ROUTER", ""),  # UniswapV2Router02
    },
    
    # Network Parameters
    "gas_limit": 8000000,
    "max_gas_price_gwei": 100,
    "confirmation_blocks": 3,
    
    # Safety Thresholds
    "min_liquidity": 0.001,  # Minimum liquidity in 0G
    "max_slippage": 0.05,    # 5% maximum slippage
    "deadline_minutes": 20,   # Transaction deadline
}

# =============================================================================
# VALIDATION HELPERS
# =============================================================================

def validate_zero_g_config() -> bool:
    """
    Validate that all required 0G configuration is present
    
    Returns:
        bool: True if configuration is valid, False otherwise
    """
    required_contracts = ["w0g", "factory", "router"]
    
    for contract in required_contracts:
        address = ZERO_G_CONFIG["contracts"].get(contract)
        if not address or address == "":
            return False
    
    return True


def get_zero_g_explorer_url(address: str, type: str = "address") -> str:
    """
    Generate block explorer URL for an address or transaction
    
    Args:
        address: Ethereum address or transaction hash
        type: Either 'address' or 'tx'
    
    Returns:
        str: Full URL to block explorer
    """
    base_url = ZERO_G_CONFIG["block_explorer"]
    return f"{base_url}/{type}/{address}"


def get_network_config(network: str) -> Dict[str, Any]:
    """
    Get configuration for a specific network
    
    Args:
        network: Network name ('zero_g', 'pi_network')
    
    Returns:
        Dict containing network configuration
    """
    configs = {
        "zero_g": ZERO_G_CONFIG,
        "pi_network": PI_NETWORK_CONFIG,
    }
    
    return configs.get(network, {})


# =============================================================================
# EXPORT ALL CONFIGS
# =============================================================================

__all__ = [
    "SUPABASE_URL",
    "SUPABASE_KEY",
    "JWT_SECRET",
    "DEBUG",
    "LOG_LEVEL",
    "ENVIRONMENT",
    "PI_NETWORK_CONFIG",
    "ZERO_G_CONFIG",
    "validate_zero_g_config",
    "get_zero_g_explorer_url",
    "get_network_config",
]
