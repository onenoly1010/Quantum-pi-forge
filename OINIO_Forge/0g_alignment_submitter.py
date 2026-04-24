#!/usr/bin/env python3
"""
0G AI Alignment Node Proof Submitter for OINIO Soul System
Aristotle Mainnet - April 2026
Chain ID: 16661
Alignment Manager Contract: 0x7BDc2aECC3CDaF0ce5a975adeA1C8d84Fd9Be3D9
"""

import os
import json
import logging
from web3 import Web3
from typing import Optional, Dict, Any

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("0g-alignment")

# 0G Mainnet Configuration
CHAIN_ID = 16661
RPC_ENDPOINT = "https://evmrpc.0g.ai"
ALIGNMENT_MANAGER_ADDRESS = "0x7BDc2aECC3CDaF0ce5a975adeA1C8d84Fd9Be3D9"

# Minimal ABI for Alignment Manager contract
ALIGNMENT_MANAGER_ABI = [
    {
        "inputs": [
            {"name": "tokenId", "type": "uint256"},
            {"name": "proofHash", "type": "bytes32"},
            {"name": "alignmentScore", "type": "uint256"},
            {"name": "metadata", "type": "string"}
        ],
        "name": "submitProof",
        "outputs": [{"name": "", "type": "bool"}],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{"name": "tokenId", "type": "uint256"}],
        "name": "getNodeRewards",
        "outputs": [{"name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    }
]


class AlignmentProofSubmitter:
    def __init__(self, node_token_id: int, private_key: str):
        self.w3 = Web3(Web3.HTTPProvider(RPC_ENDPOINT))
        self.node_token_id = node_token_id
        self.private_key = private_key
        self.account = self.w3.eth.account.from_key(private_key)
        self.contract = self.w3.eth.contract(
            address=Web3.to_checksum_address(ALIGNMENT_MANAGER_ADDRESS),
            abi=ALIGNMENT_MANAGER_ABI
        )
        logger.info(f"✅ 0G Alignment Submitter initialized for Node #{node_token_id}")
        logger.info(f"✅ Wallet: {self.account.address}")

    def submit_alignment_proof(self, proof_hash: bytes, alignment_score: float, task_type: str = "financial_oracle", drift_resolved: bool = False) -> Optional[str]:
        """
        Submit verifiable alignment proof to 0G Alignment Manager contract
        
        Args:
            proof_hash: 32-byte keccak256 hash of the proof output
            alignment_score: Contribution score between 0.0 - 1.0 (boosts rewards)
            task_type: Type of work performed
            drift_resolved: Whether drift was detected and repaired
            
        Returns: Transaction hash if successful, None otherwise
        """
        try:
            metadata = json.dumps({
                "task_type": task_type,
                "drift_resolved": drift_resolved,
                "system": "OINIO_SOUL_SYSTEM",
                "cycle": os.environ.get('OINIO_CYCLE', '0')
            })

            # Scale score to uint256 (0-10000)
            scaled_score = int(alignment_score * 10000)

            tx = self.contract.functions.submitProof(
                self.node_token_id,
                proof_hash,
                scaled_score,
                metadata
            ).build_transaction({
                'from': self.account.address,
                'nonce': self.w3.eth.get_transaction_count(self.account.address),
                'gas': 200000,
                'gasPrice': self.w3.eth.gas_price,
                'chainId': CHAIN_ID
            })

            signed_tx = self.w3.eth.account.sign_transaction(tx, self.private_key)
            tx_hash = self.w3.eth.send_raw_transaction(signed_tx.rawTransaction)
            
            logger.info(f"✅ ALIGNMENT PROOF SUBMITTED: {tx_hash.hex()[:16]}... | Score: +{alignment_score:.2f}")
            return tx_hash.hex()

        except Exception as e:
            logger.error(f"❌ Proof submission failed: {str(e)}")
            return None

    def get_earned_rewards(self) -> float:
        """Get total earned $0G rewards for this node"""
        try:
            raw_rewards = self.contract.functions.getNodeRewards(self.node_token_id).call()
            return float(self.w3.from_wei(raw_rewards, 'ether'))
        except Exception as e:
            logger.error(f"❌ Failed to fetch rewards: {str(e)}")
            return 0.0


# Integration hook for OINIO workflow
def claim_onchain_reward(proof_hash: bytes, alignment_score: float) -> bool:
    """
    Integration point to call from existing OINIO cycle workflow
    Add this to your main loop after generate_proof() / validate_financial_oracle()
    """
    try:
        # Load configuration from environment
        node_id = int(os.environ.get('0G_NODE_TOKEN_ID', '0'))
        private_key = os.environ.get('0G_WALLET_PRIVATE_KEY', '')
        
        if node_id == 0 or not private_key:
            logger.warning("⚠️ 0G Node credentials not configured - skipping proof submission")
            return False

        submitter = AlignmentProofSubmitter(node_id, private_key)
        tx_hash = submitter.submit_alignment_proof(
            proof_hash=proof_hash,
            alignment_score=alignment_score,
            drift_resolved=True
        )
        
        return tx_hash is not None
        
    except Exception as e:
        logger.error(f"❌ On-chain reward claim failed: {str(e)}")
        return False


if __name__ == "__main__":
    print("0G AI Alignment Node Submitter - OINIO Soul System")
    print("=" * 60)
    print("Add your node credentials to environment variables:")
    print("  export 0G_NODE_TOKEN_ID=YOUR_NODE_NFT_ID")
    print("  export 0G_WALLET_PRIVATE_KEY=YOUR_WALLET_KEY")
    print("\nCall claim_onchain_reward(proof_hash, score) from your main loop")
    print("\n⟨OO⟩ READY TO ALIGN ON ARISTOTLE")