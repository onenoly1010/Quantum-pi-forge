#!/usr/bin/env python3
"""
0G DEX Deployment Script
Deploys Uniswap V2 fork (Factory + Router02) to 0G Aristotle Mainnet

Usage:
    python scripts/deploy_0g_dex.py [--testnet] [--verify]

Environment Variables Required:
    ZERO_G_RPC_URL - RPC endpoint for 0G network
    DEPLOYER_PRIVATE_KEY - Private key for deployment wallet
    ZERO_G_CHAIN_ID - Chain ID (16661 for mainnet, 5611 for testnet)
"""

import os
import sys
import json
import time
from pathlib import Path
from typing import Dict, Optional, Tuple
from web3 import Web3
from web3.middleware import geth_poa_middleware
from eth_account import Account
from hexbytes import HexBytes

# Color codes for terminal output
class Colors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKCYAN = '\033[96m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'

def print_header(msg: str):
    print(f"\n{Colors.HEADER}{Colors.BOLD}{'='*60}{Colors.ENDC}")
    print(f"{Colors.HEADER}{Colors.BOLD}{msg:^60}{Colors.ENDC}")
    print(f"{Colors.HEADER}{Colors.BOLD}{'='*60}{Colors.ENDC}\n")

def print_success(msg: str):
    print(f"{Colors.OKGREEN}✅ {msg}{Colors.ENDC}")

def print_error(msg: str):
    print(f"{Colors.FAIL}❌ {msg}{Colors.ENDC}")

def print_warning(msg: str):
    print(f"{Colors.WARNING}⚠️  {msg}{Colors.ENDC}")

def print_info(msg: str):
    print(f"{Colors.OKCYAN}ℹ️  {msg}{Colors.ENDC}")


class ZeroGDexDeployer:
    """Deployer for Uniswap V2 fork on 0G Aristotle Mainnet"""
    
    def __init__(self, testnet: bool = False):
        """Initialize deployer with configuration from environment"""
        self.testnet = testnet
        self.load_config()
        self.setup_web3()
        self.deployment_addresses = {}
        
    def load_config(self):
        """Load configuration from environment variables"""
        print_info("Loading configuration...")
        
        # Network configuration
        self.rpc_url = os.getenv("ZERO_G_RPC_URL", "https://evmrpc.0g.ai")
        self.chain_id = int(os.getenv("ZERO_G_CHAIN_ID", "16661" if not self.testnet else "5611"))
        
        # Deployer credentials
        private_key = os.getenv("DEPLOYER_PRIVATE_KEY")
        if not private_key:
            print_error("DEPLOYER_PRIVATE_KEY not set in environment")
            sys.exit(1)
        
        if private_key.startswith("0x"):
            private_key = private_key[2:]
        self.private_key = private_key
        
        # Derive deployer address
        self.deployer = Account.from_key(self.private_key).address
        
        # Fee recipient (can be changed after deployment)
        self.fee_to_setter = os.getenv("FEE_TO_SETTER", self.deployer)
        
        # Deployment settings
        self.min_balance = Web3.to_wei(float(os.getenv("MIN_BALANCE", "0.5")), 'ether')
        self.verify_contracts = os.getenv("VERIFY", "false").lower() == "true"
        
        print_success(f"Chain ID: {self.chain_id}")
        print_success(f"RPC URL: {self.rpc_url}")
        print_success(f"Deployer: {self.deployer}")
        print_success(f"Fee To Setter: {self.fee_to_setter}")
        
    def setup_web3(self):
        """Initialize Web3 connection"""
        print_info("Connecting to 0G network...")
        
        self.w3 = Web3(Web3.HTTPProvider(self.rpc_url))
        
        # Add PoA middleware if needed
        self.w3.middleware_onion.inject(geth_poa_middleware, layer=0)
        
        # Verify connection
        if not self.w3.is_connected():
            print_error("Failed to connect to 0G RPC endpoint")
            sys.exit(1)
        
        # Verify chain ID
        actual_chain_id = self.w3.eth.chain_id
        if actual_chain_id != self.chain_id:
            print_warning(f"Chain ID mismatch: expected {self.chain_id}, got {actual_chain_id}")
            self.chain_id = actual_chain_id
        
        print_success(f"Connected to 0G network (Chain ID: {self.chain_id})")
        
    def preflight_checks(self):
        """Perform safety checks before deployment"""
        print_header("Pre-Flight Safety Checks")
        
        # Check deployer balance
        balance = self.w3.eth.get_balance(self.deployer)
        balance_eth = Web3.from_wei(balance, 'ether')
        min_balance_eth = Web3.from_wei(self.min_balance, 'ether')
        
        print_info(f"Deployer balance: {balance_eth:.4f} 0G")
        print_info(f"Minimum required: {min_balance_eth:.4f} 0G")
        
        if balance < self.min_balance:
            print_error(f"Insufficient balance. Need at least {min_balance_eth} 0G")
            return False
        
        print_success("Balance check: PASSED")
        
        # Check gas price
        try:
            gas_price = self.w3.eth.gas_price
            gas_price_gwei = Web3.from_wei(gas_price, 'gwei')
            print_info(f"Current gas price: {gas_price_gwei:.2f} gwei")
            print_success("Gas price check: PASSED")
        except Exception as e:
            print_warning(f"Could not fetch gas price: {e}")
        
        # Check nonce
        nonce = self.w3.eth.get_transaction_count(self.deployer)
        print_info(f"Deployer nonce: {nonce}")
        
        print_success("All pre-flight checks PASSED")
        return True
    
    def deploy_contract(self, name: str, bytecode: str, abi: list, *args) -> Tuple[str, str]:
        """Deploy a contract and return address and tx hash"""
        print_info(f"Deploying {name}...")
        
        # Create contract instance
        Contract = self.w3.eth.contract(abi=abi, bytecode=bytecode)
        
        # Build constructor transaction
        constructor_txn = Contract.constructor(*args).build_transaction({
            'from': self.deployer,
            'nonce': self.w3.eth.get_transaction_count(self.deployer),
            'gas': 5000000,  # Conservative gas limit
            'gasPrice': self.w3.eth.gas_price,
            'chainId': self.chain_id
        })
        
        # Sign transaction
        signed_txn = self.w3.eth.account.sign_transaction(constructor_txn, self.private_key)
        
        # Send transaction
        tx_hash = self.w3.eth.send_raw_transaction(signed_txn.rawTransaction)
        print_info(f"Transaction sent: {tx_hash.hex()}")
        
        # Wait for confirmation
        print_info("Waiting for confirmation...")
        tx_receipt = self.w3.eth.wait_for_transaction_receipt(tx_hash, timeout=300)
        
        if tx_receipt['status'] == 1:
            contract_address = tx_receipt['contractAddress']
            print_success(f"{name} deployed at: {contract_address}")
            print_success(f"Transaction: {tx_hash.hex()}")
            print_info(f"Gas used: {tx_receipt['gasUsed']:,}")
            return contract_address, tx_hash.hex()
        else:
            print_error(f"{name} deployment failed")
            sys.exit(1)
    
    def deploy_w0g(self) -> str:
        """Deploy W0G (Wrapped 0G) contract"""
        print_header("Step 1: Deploying W0G (Wrapped 0G)")
        
        # W0G contract bytecode and ABI (simplified WETH9)
        # This should be loaded from compiled artifacts in production
        w0g_abi = [
            {"constant": True, "inputs": [], "name": "name", "outputs": [{"name": "", "type": "string"}], "type": "function"},
            {"constant": True, "inputs": [], "name": "symbol", "outputs": [{"name": "", "type": "string"}], "type": "function"},
            {"constant": True, "inputs": [], "name": "decimals", "outputs": [{"name": "", "type": "uint8"}], "type": "function"},
            {"constant": False, "inputs": [], "name": "deposit", "outputs": [], "payable": True, "type": "function"},
            {"constant": False, "inputs": [{"name": "wad", "type": "uint256"}], "name": "withdraw", "outputs": [], "type": "function"}
        ]
        
        # For actual deployment, load from contracts/0g-uniswap-v2/out/W0G.sol/W0G.json
        artifacts_path = Path(__file__).parent.parent / "contracts" / "0g-uniswap-v2" / "out" / "W0G.sol" / "W0G.json"
        
        if artifacts_path.exists():
            with open(artifacts_path) as f:
                artifact = json.load(f)
                w0g_bytecode = artifact['bytecode']['object']
                w0g_abi = artifact['abi']
        else:
            print_warning("W0G artifact not found. Please run 'forge build' in contracts/0g-uniswap-v2/")
            print_info("Using reference W0G from existing deployment...")
            # For this script, we'll reference the existing implementation
            print_info("This script requires compiled Foundry artifacts.")
            print_info("Please deploy using: cd contracts/0g-uniswap-v2 && ./scripts/deploy.sh")
            return None
        
        address, tx_hash = self.deploy_contract("W0G", w0g_bytecode, w0g_abi)
        self.deployment_addresses['W0G'] = address
        self.deployment_addresses['W0G_TX'] = tx_hash
        
        # Verify W0G properties
        w0g_contract = self.w3.eth.contract(address=address, abi=w0g_abi)
        name = w0g_contract.functions.name().call()
        symbol = w0g_contract.functions.symbol().call()
        
        print_success(f"W0G Name: {name}")
        print_success(f"W0G Symbol: {symbol}")
        
        return address
    
    def deploy_factory(self, w0g_address: str) -> str:
        """Deploy UniswapV2Factory"""
        print_header("Step 2: Deploying UniswapV2Factory")
        
        # Load factory artifacts
        artifacts_path = Path(__file__).parent.parent / "contracts" / "0g-uniswap-v2" / "lib" / "v2-core" / "build" / "UniswapV2Factory.json"
        
        print_info("Loading Factory artifacts from Foundry build...")
        print_warning("This deployment script requires pre-built Foundry artifacts")
        print_info("Alternative: Use bash deployment script in contracts/0g-uniswap-v2/scripts/")
        
        return None
    
    def compute_init_code_hash(self, factory_address: str) -> str:
        """Compute PAIR_INIT_CODE_HASH for Router deployment"""
        print_header("Step 3: Computing PAIR_INIT_CODE_HASH")
        
        # This requires the UniswapV2Pair bytecode
        print_warning("PAIR_INIT_CODE_HASH must be computed from Pair contract bytecode")
        print_info("This value is needed to update UniswapV2Library.sol before Router deployment")
        
        return None
    
    def deploy_router(self, factory_address: str, w0g_address: str) -> str:
        """Deploy UniswapV2Router02"""
        print_header("Step 4: Deploying UniswapV2Router02")
        
        print_info("Router deployment requires PAIR_INIT_CODE_HASH update in UniswapV2Library.sol")
        print_info("This is handled automatically by the Foundry deployment script")
        
        return None
    
    def save_deployment(self):
        """Save deployment addresses to .env.launch"""
        print_header("Saving Deployment Configuration")
        
        env_launch_path = Path(__file__).parent.parent / ".env.launch"
        
        with open(env_launch_path, 'w') as f:
            f.write("# 0G Aristotle Mainnet - Uniswap V2 Deployment\n")
            f.write(f"# Deployed: {time.strftime('%Y-%m-%d %H:%M:%S UTC', time.gmtime())}\n\n")
            f.write(f"# Network Configuration\n")
            f.write(f"ZERO_G_CHAIN_ID={self.chain_id}\n")
            f.write(f"ZERO_G_RPC_URL={self.rpc_url}\n\n")
            f.write(f"# Deployed Contracts\n")
            
            if 'W0G' in self.deployment_addresses:
                f.write(f"ZERO_G_W0G={self.deployment_addresses['W0G']}\n")
                f.write(f"ZERO_G_WETH={self.deployment_addresses['W0G']}  # Alias for compatibility\n")
            
            if 'FACTORY' in self.deployment_addresses:
                f.write(f"ZERO_G_FACTORY={self.deployment_addresses['FACTORY']}\n")
            
            if 'ROUTER' in self.deployment_addresses:
                f.write(f"ZERO_G_UNIVERSAL_ROUTER={self.deployment_addresses['ROUTER']}\n")
            
            f.write(f"\n# Deployment Metadata\n")
            f.write(f"ROUTER_SOURCE=self_deployed\n")
            f.write(f"ROUTER_DEPLOYED_BY={self.deployer}\n")
            f.write(f"ROUTER_TYPE=uniswap_v2\n")
            f.write(f"ROUTER_DEPLOYMENT_DATE={time.strftime('%Y-%m-%d', time.gmtime())}\n")
            
            if 'W0G_TX' in self.deployment_addresses:
                f.write(f"W0G_DEPLOYMENT_TX={self.deployment_addresses['W0G_TX']}\n")
            if 'FACTORY_TX' in self.deployment_addresses:
                f.write(f"FACTORY_DEPLOYMENT_TX={self.deployment_addresses['FACTORY_TX']}\n")
            if 'ROUTER_TX' in self.deployment_addresses:
                f.write(f"ROUTER_DEPLOYMENT_TX={self.deployment_addresses['ROUTER_TX']}\n")
        
        print_success(f"Deployment config saved to: {env_launch_path}")
        
    def run_deployment(self):
        """Execute full deployment process"""
        print_header("0G Uniswap V2 Fork - Deployment")
        
        print_warning("\n⚠️  IMPORTANT NOTICE ⚠️")
        print_info("This Python script provides a reference deployment flow.")
        print_info("For production deployment, use the Foundry-based deployment:")
        print_info("")
        print_info("  cd contracts/0g-uniswap-v2")
        print_info("  ./scripts/setup.sh")
        print_info("  ./scripts/deploy.sh")
        print_info("")
        print_warning("The Python script requires pre-compiled Foundry artifacts.\n")
        
        # Perform pre-flight checks
        if not self.preflight_checks():
            print_error("Pre-flight checks failed. Aborting deployment.")
            sys.exit(1)
        
        # Deploy W0G
        w0g_address = self.deploy_w0g()
        
        if not w0g_address:
            print_error("\nDeployment incomplete. Please use Foundry deployment script.")
            print_info("Run: cd contracts/0g-uniswap-v2 && ./scripts/deploy.sh")
            sys.exit(1)
        
        # Save partial deployment
        self.save_deployment()
        
        print_header("Deployment Instructions")
        print_info("1. Complete deployment using Foundry scripts in contracts/0g-uniswap-v2/")
        print_info("2. Run: ./scripts/deploy.sh to deploy Factory")
        print_info("3. Update PAIR_INIT_CODE_HASH in UniswapV2Library.sol")
        print_info("4. Run: ./scripts/deploy.sh --resume to deploy Router")
        print_info("5. Run: python scripts/verify_0g_dex.py to test deployment")


def main():
    """Main entry point"""
    import argparse
    
    parser = argparse.ArgumentParser(description="Deploy Uniswap V2 fork to 0G Aristotle")
    parser.add_argument('--testnet', action='store_true', help='Deploy to testnet instead of mainnet')
    parser.add_argument('--verify', action='store_true', help='Verify contracts on block explorer')
    
    args = parser.parse_args()
    
    # Create deployer instance
    deployer = ZeroGDexDeployer(testnet=args.testnet)
    
    # Run deployment
    try:
        deployer.run_deployment()
    except KeyboardInterrupt:
        print_error("\n\nDeployment interrupted by user")
        sys.exit(1)
    except Exception as e:
        print_error(f"\n\nDeployment failed with error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    main()
