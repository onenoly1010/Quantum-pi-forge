"""
Pi Network Client for Autonomous Banking
Handles Pi payment verification and reward calculation
"""

import os
import httpx
from typing import Optional, Dict, Any
from decimal import Decimal

class PiNetworkClient:
    """Pi Network SDK client for payment verification"""
    
    def __init__(self, api_key: str, app_id: str):
        self.api_key = api_key
        self.app_id = app_id
        self.base_url = "https://api.pi.network/v2"
        self.client = httpx.AsyncClient(
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json"
            },
            timeout=30.0
        )
    
    async def verify_payment(self, payment_id: str, amount: float, user_wallet: str) -> bool:
        """Verify a Pi payment transaction"""
        try:
            # In production, this would call Pi API
            # For now, simulate verification
            print(f"🔍 Verifying payment {payment_id}: {amount} $PI to {user_wallet}")
            
            # Mock verification - in real implementation:
            # response = await self.client.get(f"{self.base_url}/payments/{payment_id}")
            # return response.json().get("status") == "completed"
            
            return True  # Mock success
            
        except Exception as e:
            print(f"❌ Payment verification failed: {e}")
            return False
    
    async def calculate_oinio_reward(self, pi_amount: float) -> Decimal:
        """Calculate OINIO reward for Pi payment (10:1 ratio)"""
        return Decimal(pi_amount * 10)
    
    async def process_payment_webhook(self, webhook_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Process incoming Pi payment webhook"""
        try:
            payment_id = webhook_data.get("payment_id")
            amount = webhook_data.get("amount")
            user_wallet = webhook_data.get("user_wallet")
            
            if not all([payment_id, amount, user_wallet]):
                return None
            
            # Verify payment
            verified = await self.verify_payment(payment_id, amount, user_wallet)
            if not verified:
                return None
            
            # Calculate reward
            oinio_reward = await self.calculate_oinio_reward(amount)
            
            return {
                "payment_id": payment_id,
                "pi_amount": amount,
                "oinio_reward": float(oinio_reward),
                "user_wallet": user_wallet,
                "verified": True
            }
            
        except Exception as e:
            print(f"❌ Webhook processing failed: {e}")
            return None
    
    async def close(self):
        """Close the HTTP client"""
        await self.client.aclose()

# Global client instance
_pi_client: Optional[PiNetworkClient] = None

def get_pi_client() -> PiNetworkClient:
    """Get or create Pi Network client instance"""
    global _pi_client
    
    if _pi_client is None:
        api_key = os.environ.get("PI_API_KEY")
        app_id = os.environ.get("PI_APP_ID")
        
        if not api_key or not app_id:
            raise ValueError("PI_API_KEY and PI_APP_ID environment variables required")
        
        _pi_client = PiNetworkClient(api_key, app_id)
    
    return _pi_client

async def verify_pi_payment_for_reward(payment_id: str, amount: float, user_wallet: str) -> Optional[Dict[str, Any]]:
    """Verify Pi payment and return reward data"""
    client = get_pi_client()
    verified = await client.verify_payment(payment_id, amount, user_wallet)
    
    if verified:
        reward = await client.calculate_oinio_reward(amount)
        return {
            "payment_id": payment_id,
            "pi_amount": amount,
            "oinio_reward": float(reward),
            "user_wallet": user_wallet
        }
    
    return None