"""
Pi Network wallet signature verification stub.
TODO: Implement actual Pi Network signature verification.

This is a placeholder for future Pi Network integration.
Currently returns a stubbed response for testnet-only operation.
"""

import os
import logging
from typing import Dict, Any, Optional

logger = logging.getLogger(__name__)

# Enforce testnet-only operation
NFT_MINT_VALUE = int(os.environ.get("NFT_MINT_VALUE", "0"))
APP_ENVIRONMENT = os.environ.get("APP_ENVIRONMENT", "testnet")

# Safety check
if NFT_MINT_VALUE != 0:
    raise RuntimeError(
        "❌ SAFETY VIOLATION: NFT_MINT_VALUE must be 0 for testnet-only operation. "
        f"Current value: {NFT_MINT_VALUE}"
    )

if APP_ENVIRONMENT not in ["testnet", "development"]:
    logger.warning(
        f"⚠️  APP_ENVIRONMENT is '{APP_ENVIRONMENT}'. "
        "Pi wallet verification is not implemented for production."
    )


def verify_pi_signature(
    wallet_address: str,
    signature: str,
    message: str,
    transaction_hash: Optional[str] = None
) -> Dict[str, Any]:
    """
    Verify Pi Network wallet signature.
    
    TODO: Implement actual signature verification using Pi Network SDK.
    This is a stub that always returns success for testnet development.
    
    Args:
        wallet_address: Pi wallet address
        signature: Signature to verify
        message: Original message that was signed
        transaction_hash: Optional blockchain transaction hash
    
    Returns:
        Dict with verification result
    
    Raises:
        NotImplementedError: In production environment
    """
    # Safety check
    if APP_ENVIRONMENT == "production":
        raise NotImplementedError(
            "❌ Pi wallet signature verification is not implemented for production. "
            "This feature requires Pi Network SDK integration."
        )
    
    logger.warning(
        f"⚠️  STUB: Pi signature verification called for wallet {wallet_address}. "
        "Returning stubbed success response (testnet-only)."
    )
    
    # Stub response for testnet
    return {
        "valid": True,
        "wallet_address": wallet_address,
        "transaction_hash": transaction_hash,
        "verified_at": "STUB_TESTNET_ONLY",
        "note": "This is a stubbed response. Actual Pi Network verification not implemented."
    }


def get_pi_wallet_balance(wallet_address: str) -> Dict[str, Any]:
    """
    Get Pi wallet balance from blockchain.
    
    TODO: Implement actual Pi Network API call.
    This is a stub for testnet development.
    
    Args:
        wallet_address: Pi wallet address
    
    Returns:
        Dict with balance information
    
    Raises:
        NotImplementedError: In production environment
    """
    if APP_ENVIRONMENT == "production":
        raise NotImplementedError(
            "❌ Pi wallet balance check is not implemented for production. "
            "This feature requires Pi Network API integration."
        )
    
    logger.warning(
        f"⚠️  STUB: Pi wallet balance check called for {wallet_address}. "
        "Returning stubbed response (testnet-only)."
    )
    
    # Stub response for testnet
    return {
        "wallet_address": wallet_address,
        "balance": "0.0",
        "note": "This is a stubbed response. Actual Pi Network API not implemented."
    }


def initiate_pi_payment(
    recipient_address: str,
    amount: float,
    memo: Optional[str] = None
) -> Dict[str, Any]:
    """
    Initiate a Pi payment (on-chain action).
    
    TODO: Implement actual Pi Network payment initiation.
    This is a stub that logs the request but performs no on-chain action.
    
    Args:
        recipient_address: Pi wallet address to send to
        amount: Amount to send
        memo: Optional payment memo
    
    Returns:
        Dict with stubbed payment information
    
    Raises:
        RuntimeError: If NFT_MINT_VALUE is not 0
    """
    # Safety check
    if NFT_MINT_VALUE != 0:
        raise RuntimeError(
            f"❌ SAFETY VIOLATION: Cannot initiate payment. NFT_MINT_VALUE must be 0. "
            f"Current value: {NFT_MINT_VALUE}"
        )
    
    logger.warning(
        f"⚠️  STUB: Pi payment initiation called: {amount} Pi to {recipient_address}. "
        "No on-chain action performed (testnet-only)."
    )
    
    # Stub response - no actual payment made
    return {
        "success": False,
        "transaction_hash": None,
        "recipient_address": recipient_address,
        "amount": amount,
        "memo": memo,
        "note": "STUB: No on-chain action performed. Testnet-only mode (NFT_MINT_VALUE=0)."
    }
