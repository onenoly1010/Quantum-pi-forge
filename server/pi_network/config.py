"""
Pi Network Configuration Management
Handles configuration for Pi Network integration with environment-based settings
"""

import os
from typing import Optional, Literal
from dataclasses import dataclass, field
from .exceptions import PiConfigurationError


@dataclass
class PiNetworkConfig:
    """
    Configuration for Pi Network integration
    
    Attributes:
        network: Network mode ('mainnet' or 'testnet')
        api_key: Pi Network API key
        app_id: Pi Network application ID
        api_endpoint: Base URL for Pi Network API
        sandbox_mode: Enable sandbox mode for testing
        timeout: Request timeout in seconds
        max_retries: Maximum number of retry attempts
        verify_ssl: Verify SSL certificates
    """
    
    network: Literal["mainnet", "testnet"] = "mainnet"
    api_key: str = ""
    app_id: str = ""
    api_endpoint: str = "https://api.minepi.com"
    sandbox_mode: bool = False
    timeout: int = 30
    max_retries: int = 3
    verify_ssl: bool = True
    
    # Safety configurations
    nft_mint_value: int = 0  # Must be 0 for testnet
    app_environment: str = "testnet"
    
    def __post_init__(self):
        """Validate configuration after initialization"""
        self._validate()
    
    @classmethod
    def from_env(cls) -> "PiNetworkConfig":
        """
        Create configuration from environment variables
        
        Returns:
            PiNetworkConfig instance populated from environment
        """
        return cls(
            network=os.environ.get("PI_NETWORK_MODE", "mainnet"),
            api_key=os.environ.get("PI_NETWORK_API_KEY", ""),
            app_id=os.environ.get("PI_NETWORK_APP_ID", ""),
            api_endpoint=os.environ.get(
                "PI_NETWORK_API_ENDPOINT", 
                "https://api.minepi.com"
            ),
            sandbox_mode=os.environ.get("PI_SANDBOX_MODE", "false").lower() == "true",
            timeout=int(os.environ.get("PI_NETWORK_TIMEOUT", "30")),
            max_retries=int(os.environ.get("PI_NETWORK_MAX_RETRIES", "3")),
            verify_ssl=os.environ.get("PI_VERIFY_SSL", "true").lower() != "false",
            nft_mint_value=int(os.environ.get("NFT_MINT_VALUE", "0")),
            app_environment=os.environ.get("APP_ENVIRONMENT", "testnet")
        )
    
    def _validate(self):
        """Validate configuration settings"""
        # Network validation
        if self.network not in ["mainnet", "testnet"]:
            raise PiConfigurationError(
                f"Invalid network mode: {self.network}. Must be 'mainnet' or 'testnet'"
            )
        
        # Safety check for testnet
        if self.app_environment in ["testnet", "development"]:
            if self.nft_mint_value != 0:
                raise PiConfigurationError(
                    f"Safety violation: NFT_MINT_VALUE must be 0 for testnet/development. "
                    f"Current value: {self.nft_mint_value}"
                )
        
        # Timeout validation
        if self.timeout <= 0:
            raise PiConfigurationError(
                f"Invalid timeout: {self.timeout}. Must be positive"
            )
        
        # Retry validation
        if self.max_retries < 0:
            raise PiConfigurationError(
                f"Invalid max_retries: {self.max_retries}. Must be non-negative"
            )
    
    def is_production(self) -> bool:
        """Check if running in production mode"""
        return (
            self.network == "mainnet" and 
            self.app_environment == "production" and 
            not self.sandbox_mode
        )
    
    def is_testnet(self) -> bool:
        """Check if running in testnet mode"""
        return (
            self.network == "testnet" or 
            self.sandbox_mode or
            self.app_environment in ["testnet", "development"]
        )
    
    def get_api_url(self, endpoint: str) -> str:
        """
        Construct full API URL for an endpoint
        
        Args:
            endpoint: API endpoint path
            
        Returns:
            Full URL to the endpoint
        """
        base = self.api_endpoint.rstrip('/')
        path = endpoint.lstrip('/')
        return f"{base}/{path}"
    
    def to_dict(self) -> dict:
        """Convert configuration to dictionary (safe for logging)"""
        return {
            "network": self.network,
            "api_endpoint": self.api_endpoint,
            "sandbox_mode": self.sandbox_mode,
            "timeout": self.timeout,
            "max_retries": self.max_retries,
            "verify_ssl": self.verify_ssl,
            "app_environment": self.app_environment,
            "is_production": self.is_production(),
            "is_testnet": self.is_testnet(),
            # Redact sensitive information
            "api_key_configured": bool(self.api_key),
            "app_id_configured": bool(self.app_id)
        }
