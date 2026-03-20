"""
OINIO AI Signer for Autonomous Banking
Safe{Core} SDK integration with safety logic
"""

import os
from typing import Optional, Dict, Any, List
from decimal import Decimal
from datetime import datetime, timedelta

class OINIOAgentSigner:
    """AI agent for autonomous OINIO burn transactions via Safe multisig"""
    
    def __init__(self, safe_address: str, ai_private_key: str, rpc_url: str, oinio_contract: str):
        self.safe_address = safe_address
        self.ai_private_key = ai_private_key
        self.rpc_url = rpc_url
        self.oinio_contract = oinio_contract
        
        # Safety limits
        self.daily_burn_limit = Decimal("1000000")  # 1M OINIO per day
        self.max_burn_per_tx = Decimal("10000")     # 10K OINIO per transaction
        
        # Track daily burns
        self.daily_burns: Dict[str, Decimal] = {}
        
        # Lazy load Safe SDK
        self._safe_client = None
        self._web3 = None
    
    def _get_safe_client(self):
        """Lazy load Safe Protocol Kit"""
        if self._safe_client is None:
            try:
                from safe_eth.safe import Safe
                from safe_eth.eth import EthereumClient
                from web3 import Web3
                
                self._web3 = Web3(Web3.HTTPProvider(self.rpc_url))
                eth_client = EthereumClient(self._web3)
                self._safe_client = Safe(self.safe_address, eth_client)
                
            except ImportError:
                raise ImportError("Safe Protocol Kit not installed. Run: pip install safe-eth-py")
        
        return self._safe_client
    
    def _check_daily_limit(self, amount: Decimal) -> bool:
        """Check if daily burn limit would be exceeded"""
        today = datetime.now().strftime("%Y-%m-%d")
        current_burns = self.daily_burns.get(today, Decimal("0"))
        
        return (current_burns + amount) <= self.daily_burn_limit
    
    def _check_transaction_limit(self, amount: Decimal) -> bool:
        """Check if transaction amount is within limits"""
        return amount <= self.max_burn_per_tx
    
    def evaluate_burn_proposal(self, payment_data: Dict[str, Any]) -> Dict[str, Any]:
        """Evaluate if a burn proposal should be approved"""
        try:
            oinio_amount = Decimal(str(payment_data.get("oinio_reward", 0)))
            
            # Safety checks
            if not self._check_transaction_limit(oinio_amount):
                return {
                    "approved": False,
                    "reason": f"Burn amount {oinio_amount} exceeds transaction limit {self.max_burn_per_tx}"
                }
            
            if not self._check_daily_limit(oinio_amount):
                return {
                    "approved": False,
                    "reason": f"Daily burn limit would be exceeded"
                }
            
            # Additional validation
            if oinio_amount <= 0:
                return {
                    "approved": False,
                    "reason": "Invalid burn amount"
                }
            
            return {
                "approved": True,
                "amount": oinio_amount,
                "payment_id": payment_data.get("payment_id"),
                "user_wallet": payment_data.get("user_wallet")
            }
            
        except Exception as e:
            return {
                "approved": False,
                "reason": f"Evaluation error: {str(e)}"
            }
    
    async def propose_burn_transaction(self, evaluation: Dict[str, Any]) -> Optional[str]:
        """Propose a burn transaction to the Safe multisig"""
        if not evaluation.get("approved"):
            return None
        
        try:
            amount = evaluation["amount"]
            
            # In production, this would create and propose the actual transaction
            # For now, simulate the proposal
            
            print(f"🔥 Proposing OINIO burn: {amount} tokens")
            print(f"📄 Payment ID: {evaluation.get('payment_id')}")
            print(f"👤 User: {evaluation.get('user_wallet')}")
            
            # Update daily burns
            today = datetime.now().strftime("%Y-%m-%d")
            self.daily_burns[today] = self.daily_burns.get(today, Decimal("0")) + amount
            
            # Mock transaction hash
            return f"0x{os.urandom(32).hex()}"
            
        except Exception as e:
            print(f"❌ Burn proposal failed: {e}")
            return None
    
    async def sign_transaction(self, tx_hash: str) -> bool:
        """Sign a pending transaction (would be called by Safe)"""
        try:
            # In production, this would sign with AI private key
            print(f"✍️ AI signing transaction: {tx_hash}")
            return True
            
        except Exception as e:
            print(f"❌ Transaction signing failed: {e}")
            return False

# Global signer instance
_ai_signer: Optional[OINIOAgentSigner] = None

def get_ai_signer() -> OINIOAgentSigner:
    """Get or create AI signer instance"""
    global _ai_signer
    
    if _ai_signer is None:
        safe_address = os.environ.get("SAFE_MULTISIG_ADDRESS")
        ai_key = os.environ.get("AI_PRIVATE_KEY")
        rpc_url = os.environ.get("POLYGON_RPC_URL")
        oinio_contract = os.environ.get("OINIO_CONTRACT_ADDRESS")
        
        if not all([safe_address, ai_key, rpc_url, oinio_contract]):
            raise ValueError("Missing required environment variables for AI signer")
        
        _ai_signer = OINIOAgentSigner(safe_address, ai_key, rpc_url, oinio_contract)
    
    return _ai_signer