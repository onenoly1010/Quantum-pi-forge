"""
Pi Network Integration Module
Modular, secure, and ethical Pi Network integration for Pi Forge Quantum Genesis

This module provides a comprehensive, production-ready integration with Pi Network,
following principles of modularity, security, and ethical AI.
"""

from .client import PiNetworkClient
from .auth import PiAuthManager
from .payments import PiPaymentManager
from .config import PiNetworkConfig
from .exceptions import (
    PiNetworkError,
    PiAuthenticationError,
    PiPaymentError,
    PiConfigurationError
)

__version__ = "1.0.0"
__all__ = [
    "PiNetworkClient",
    "PiAuthManager", 
    "PiPaymentManager",
    "PiNetworkConfig",
    "PiNetworkError",
    "PiAuthenticationError",
    "PiPaymentError",
    "PiConfigurationError"
]
