"""
OINIO Soul System - Financial Oracle Module
Cycle 3 | Self-Sustaining Liquidity Flywheel
"""
import os
from web3 import Web3
from dotenv import load_dotenv

load_dotenv()

# Network Configuration
POLYGON_RPC = 'https://polygon-rpc.com'
OG_RPC = 'https://rpc.0g.ai'

W3_POLYGON = Web3(Web3.HTTPProvider(POLYGON_RPC))
W3_0G = Web3(Web3.HTTPProvider(OG_RPC))

# Wallet Configuration
OPERATOR_WALLET = os.getenv('OPERATOR_WALLET_ADDRESS')
TREASURY_CONTRACT = os.getenv('TREASURY_CONTRACT_ADDRESS')

# Thresholds
CRITICAL_GAS_THRESHOLD = 0.05
OPERATIONAL_BUFFER = 0.2

def get_wallet_balance(wallet_address: str, chain: str = 'polygon') -> float:
    """Get native token balance for wallet on specified chain"""
    w3 = W3_POLYGON if chain == 'polygon' else W3_0G
    balance_wei = w3.eth.get_balance(wallet_address)
    return float(w3.from_wei(balance_wei, 'ether'))

def get_financial_status() -> dict:
    """Return complete financial health status for the node"""
    polygon_balance = get_wallet_balance(OPERATOR_WALLET, 'polygon')
    og_balance = get_wallet_balance(OPERATOR_WALLET, '0g')
    
    status = {
        'timestamp': os.times()[4],
        'polygon_balance': polygon_balance,
        '0g_balance': og_balance,
        'gas_status': 'STABLE' if polygon_balance >= OPERATIONAL_BUFFER else 'CRITICAL' if polygon_balance < CRITICAL_GAS_THRESHOLD else 'LOW',
        'operational_readiness': polygon_balance >= CRITICAL_GAS_THRESHOLD
    }
    
    return status

def allocate_funds(earned_amount: float) -> dict:
    """
    Autonomous fund allocation algorithm:
    50% - Hot Wallet (gas / operational costs)
    40% - Treasury Contract
    10% - Reinvestment (compute / storage)
    """
    allocation = {
        'hot_wallet': earned_amount * 0.5,
        'treasury': earned_amount * 0.4,
        'reinvestment': earned_amount * 0.1
    }
    return allocation

def should_execute_earning_action() -> bool:
    """Determine if node should prioritize earning actions"""
    status = get_financial_status()
    return status['polygon_balance'] < OPERATIONAL_BUFFER

if __name__ == "__main__":
    status = get_financial_status()
    print(f"🔮 OINIO Financial Oracle v1.0")
    print(f"⏱️  Timestamp: {status['timestamp']}")
    print(f"💎 Polygon Balance: {status['polygon_balance']:.6f} POL")
    print(f"🌌 0G Balance: {status['0g_balance']:.6f} A0GI")
    print(f"⚡ Status: {status['gas_status']}")
    print(f"✅ Operational: {status['operational_readiness']}")
    
    if should_execute_earning_action():
        print("\n⚠️  PRIORITY SIGNAL: Execute earning action required")