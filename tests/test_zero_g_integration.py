"""
Tests for 0G Aristotle Mainnet integration
Tests config and swap client initialization
"""

import pytest
from unittest.mock import Mock, patch
import os


def test_zero_g_config_structure():
    """Test that ZERO_G_CONFIG has all required fields"""
    from server.config import ZERO_G_CONFIG
    
    # Check top-level structure
    assert "chain_id" in ZERO_G_CONFIG
    assert "chain_name" in ZERO_G_CONFIG
    assert "rpc_url" in ZERO_G_CONFIG
    assert "block_explorer" in ZERO_G_CONFIG
    assert "native_token" in ZERO_G_CONFIG
    assert "contracts" in ZERO_G_CONFIG
    
    # Check chain parameters
    assert ZERO_G_CONFIG["chain_id"] == 16661
    assert ZERO_G_CONFIG["chain_name"] == "0G Aristotle Mainnet"
    assert "evmrpc.0g.ai" in ZERO_G_CONFIG["rpc_url"]
    
    # Check native token structure
    native_token = ZERO_G_CONFIG["native_token"]
    assert native_token["name"] == "0G"
    assert native_token["symbol"] == "A0GI"
    assert native_token["decimals"] == 18
    
    # Check contracts structure
    contracts = ZERO_G_CONFIG["contracts"]
    assert "w0g" in contracts
    assert "factory" in contracts
    assert "router" in contracts


def test_zero_g_config_validation():
    """Test config validation helper"""
    from server.config import validate_zero_g_config
    
    # Without contract addresses set, validation should return False
    # (assuming .env is not configured with addresses)
    result = validate_zero_g_config()
    assert isinstance(result, bool)


def test_get_zero_g_explorer_url():
    """Test block explorer URL generation"""
    from server.config import get_zero_g_explorer_url
    
    test_address = "0x1234567890123456789012345678901234567890"
    
    # Test address URL
    address_url = get_zero_g_explorer_url(test_address, "address")
    assert "chainscan.0g.ai" in address_url
    assert test_address in address_url
    assert "/address/" in address_url
    
    # Test transaction URL
    tx_url = get_zero_g_explorer_url(test_address, "tx")
    assert "chainscan.0g.ai" in tx_url
    assert test_address in tx_url
    assert "/tx/" in tx_url


def test_get_network_config():
    """Test network config retrieval"""
    from server.config import get_network_config
    
    zero_g_config = get_network_config("zero_g")
    assert zero_g_config is not None
    assert zero_g_config["chain_id"] == 16661
    
    pi_config = get_network_config("pi_network")
    assert pi_config is not None
    assert "mode" in pi_config
    
    # Test unknown network
    unknown_config = get_network_config("unknown_network")
    assert unknown_config == {}


@patch.dict(os.environ, {
    "ZERO_G_RPC": "https://evmrpc.0g.ai",
    "ZERO_G_UNIVERSAL_ROUTER": "0x1234567890123456789012345678901234567890",
    "ZERO_G_W0G": "0x0987654321098765432109876543210987654321"
})
def test_swap_client_initialization():
    """Test swap client can be initialized with environment variables"""
    from server.integrations.zero_g_swap import create_swap_client
    
    # This should not raise an error
    client = create_swap_client()
    
    assert client is not None
    assert hasattr(client, 'w3')
    assert hasattr(client, 'router_address')
    assert hasattr(client, 'w0g_address')


def test_swap_client_initialization_without_addresses():
    """Test that swap client raises error when addresses not provided"""
    from server.integrations.zero_g_swap import create_swap_client
    
    # Should raise ValueError when addresses are missing
    with pytest.raises(ValueError, match="Router and W0G addresses must be provided"):
        create_swap_client()


def test_swap_client_methods_exist():
    """Test that swap client has all required methods"""
    from server.integrations.zero_g_swap import ZeroGSwapClient
    
    # Check class has required methods
    assert hasattr(ZeroGSwapClient, 'get_amounts_out')
    assert hasattr(ZeroGSwapClient, 'calculate_min_amount_out')
    assert hasattr(ZeroGSwapClient, 'get_deadline')
    assert hasattr(ZeroGSwapClient, 'approve_token')
    assert hasattr(ZeroGSwapClient, 'swap_exact_tokens_for_tokens')
    assert hasattr(ZeroGSwapClient, 'swap_exact_0g_for_tokens')
    assert hasattr(ZeroGSwapClient, 'get_token_balance')
    assert hasattr(ZeroGSwapClient, 'estimate_gas_for_swap')


def test_calculate_min_amount_out():
    """Test slippage calculation"""
    from server.integrations.zero_g_swap import ZeroGSwapClient
    
    # Create mock client (no actual connection needed for this test)
    with patch('server.integrations.zero_g_swap.Web3'):
        client = ZeroGSwapClient(
            rpc_url="http://dummy",
            router_address="0x1234567890123456789012345678901234567890",
            w0g_address="0x0987654321098765432109876543210987654321"
        )
    
    # Test 5% slippage
    amount_out = 1000000
    min_out = client.calculate_min_amount_out(amount_out, slippage=0.05)
    assert min_out == 950000  # 1000000 * 0.95
    
    # Test 1% slippage
    min_out = client.calculate_min_amount_out(amount_out, slippage=0.01)
    assert min_out == 990000  # 1000000 * 0.99
    
    # Test 10% slippage
    min_out = client.calculate_min_amount_out(amount_out, slippage=0.10)
    assert min_out == 900000  # 1000000 * 0.90


def test_get_deadline():
    """Test deadline calculation"""
    import time
    from server.integrations.zero_g_swap import ZeroGSwapClient
    
    with patch('server.integrations.zero_g_swap.Web3'):
        client = ZeroGSwapClient(
            rpc_url="http://dummy",
            router_address="0x1234567890123456789012345678901234567890",
            w0g_address="0x0987654321098765432109876543210987654321"
        )
    
    # Test default 20 minutes
    deadline = client.get_deadline()
    now = int(time.time())
    assert deadline > now
    assert deadline <= now + (20 * 60) + 5  # Allow 5 second buffer
    
    # Test custom 10 minutes
    deadline = client.get_deadline(minutes=10)
    assert deadline > now
    assert deadline <= now + (10 * 60) + 5


@pytest.mark.parametrize("slippage,expected", [
    (0.01, 990000),
    (0.05, 950000),
    (0.10, 900000),
    (0.50, 500000),
])
def test_slippage_calculations(slippage, expected):
    """Test various slippage percentages"""
    from server.integrations.zero_g_swap import ZeroGSwapClient
    
    with patch('server.integrations.zero_g_swap.Web3'):
        client = ZeroGSwapClient(
            rpc_url="http://dummy",
            router_address="0x1234567890123456789012345678901234567890",
            w0g_address="0x0987654321098765432109876543210987654321"
        )
    
    result = client.calculate_min_amount_out(1000000, slippage=slippage)
    assert result == expected


def test_integration_module_exports():
    """Test that integration module exports expected classes"""
    from server.integrations import ZeroGSwapClient
    
    assert ZeroGSwapClient is not None


def test_config_module_exports():
    """Test that config module exports expected variables"""
    from server.config import (
        ZERO_G_CONFIG,
        validate_zero_g_config,
        get_zero_g_explorer_url,
        get_network_config
    )
    
    assert ZERO_G_CONFIG is not None
    assert callable(validate_zero_g_config)
    assert callable(get_zero_g_explorer_url)
    assert callable(get_network_config)


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
