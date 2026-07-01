#!/usr/bin/env python3
"""
0G Social Recovery CLI — Guardian Tool

Interact with the 0GSocialRecovery module on 0G Aristotle Mainnet.
Allows guardians to:
  - Query guardian status from ForgeRegistry
  - Initiate wallet recovery requests
  - Approve pending recoveries (on-chain or via EIP-712 signature)
  - Execute recoveries once threshold is met
  - Rotate wallet keys (owner-initiated)
  - Monitor recovery request status

Network:    0G Aristotle L1 (Chain ID: 16661)
RPC:        https://evmrpc.0g.ai
ForgeRegistry: 0x6011c341a01c80f489a5c3Ab751987A55142F04e

Usage:
  python 0g_social_recovery.py guardian-status <address>
  python 0g_social_recovery.py init-wallet <wallet-addr> <owner-addr>
  python 0g_social_recovery.py request-recovery <wallet> <new-owner>
  python 0g_social_recovery.py approve-recovery <wallet> <nonce>
  python 0g_social_recovery.py execute-recovery <wallet> <nonce>
  python 0g_social_recovery.py recovery-status <wallet> [nonce]
  python 0g_social_recovery.py rotate-key <wallet> <new-owner>
"""

import sys
import json
import time
import argparse
from typing import Optional, Tuple
from web3 import Web3
from web3.exceptions import ContractLogicError, TransactionNotFound
from eth_account import Account
from eth_account.messages import encode_typed_data

# =============================================================================
# Constants — 0G Aristotle Mainnet
# =============================================================================
RPC_URL = "https://evmrpc.0g.ai"
CHAIN_ID = 16661
FORGE_REGISTRY_ADDR = Web3.to_checksum_address("0x6011c341a01c80f489a5c3Ab751987A55142F04e")
SOCIAL_RECOVERY_ADDR = None  # Set after deployment

# ForgeRegistry ABI (minimal — functions we use)
FORGE_REGISTRY_ABI = json.loads('''[
    {"inputs":[{"name":"account","type":"address"}],"name":"isGuardian","outputs":[{"name":"","type":"bool"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"totalGuardians","outputs":[{"name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"register","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[{"name":"","type":"address"}],"name":"isGuardian","outputs":[{"name":"","type":"bool"}],"stateMutability":"view","type":"function"}
]''')

# 0GSocialRecovery ABI (full)
SOCIAL_RECOVERY_ABI = json.loads('''[
    {"inputs":[{"internalType":"address","name":"_forgeRegistry","type":"address"},{"internalType":"uint256","name":"_defaultThreshold","type":"uint256"},{"internalType":"uint256","name":"_recoveryTimeout","type":"uint256"}],"stateMutability":"nonpayable","type":"constructor"},
    {"inputs":[],"name":"AlreadyVoted","type":"error"},
    {"inputs":[],"name":"CallerNotWalletOwner","type":"error"},
    {"inputs":[],"name":"InsufficientApprovals","type":"error"},
    {"inputs":[],"name":"InvalidThreshold","type":"error"},
    {"inputs":[],"name":"NoActiveRecovery","type":"error"},
    {"inputs":[],"name":"NotGuardian","type":"error"},
    {"inputs":[],"name":"RecoveryExists","type":"error"},
    {"inputs":[],"name":"RecoveryExpired","type":"error"},
    {"inputs":[],"name":"ZeroAddress","type":"error"},
    {"inputs":[{"internalType":"address","name":"wallet","type":"address"},{"internalType":"address","name":"guardian","type":"address"},{"internalType":"uint256","name":"recoveryNonce","type":"uint256"}],"name":"GuardianApproved","outputs":[],"stateMutability":"view","type":"event"},
    {"inputs":[{"internalType":"address","name":"wallet","type":"address"},{"internalType":"uint256","name":"recoveryNonce","type":"uint256"},{"internalType":"string","name":"reason","type":"string"}],"name":"RecoveryCancelled","outputs":[],"stateMutability":"view","type":"event"},
    {"inputs":[{"internalType":"address","name":"wallet","type":"address"},{"internalType":"address","name":"previousOwner","type":"address"},{"internalType":"address","name":"newOwner","type":"address"},{"internalType":"uint256","name":"recoveryNonce","type":"uint256"}],"name":"RecoveryFinalized","outputs":[],"stateMutability":"view","type":"event"},
    {"inputs":[{"internalType":"address","name":"wallet","type":"address"},{"internalType":"address","name":"newOwner","type":"address"},{"internalType":"uint256","name":"recoveryNonce","type":"uint256"},{"internalType":"uint256","name":"threshold","type":"uint256"},{"internalType":"uint256","name":"expiry","type":"uint256"},{"internalType":"address","name":"requestor","type":"address"}],"name":"RecoveryRequested","outputs":[],"stateMutability":"view","type":"event"},
    {"inputs":[{"internalType":"address","name":"wallet","type":"address"},{"internalType":"uint256","name":"oldThreshold","type":"uint256"},{"internalType":"uint256","name":"newThreshold","type":"uint256"}],"name":"ThresholdChanged","outputs":[],"stateMutability":"view","type":"event"},
    {"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"address","name":"","type":"address"}],"name":"approvals","outputs":[{"internalType":"bool","name":"approved","type":"bool"},{"internalType":"uint256","name":"timestamp","type":"uint256"}],"stateMutability":"view","type":"function"},
    {"inputs":[{"internalType":"address","name":"wallet","type":"address"},{"internalType":"uint256","name":"recoveryNonce","type":"uint256"}],"name":"approveRecovery","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[{"internalType":"address","name":"wallet","type":"address"},{"internalType":"address","name":"newOwner","type":"address"},{"internalType":"uint256","name":"recoveryNonce","type":"uint256"},{"internalType":"uint256","name":"expiry","type":"uint256"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"approveRecoveryWithSig","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[{"internalType":"address","name":"wallet","type":"address"},{"internalType":"uint256","name":"recoveryNonce","type":"uint256"}],"name":"cancelRecovery","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[{"internalType":"address","name":"wallet","type":"address"},{"internalType":"uint256","name":"recoveryNonce","type":"uint256"}],"name":"cancelExpiredRecovery","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[{"internalType":"address","name":"wallet","type":"address"},{"internalType":"uint256","name":"recoveryNonce","type":"uint256"}],"name":"executeRecovery","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[{"internalType":"address","name":"wallet","type":"address"}],"name":"flagCompromised","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[],"name":"forgeRegistry","outputs":[{"internalType":"contract IForgeRegistry","name":"","type":"address"}],"stateMutability":"view","type":"function"},
    {"inputs":[{"internalType":"address","name":"wallet","type":"address"}],"name":"getOwner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
    {"inputs":[{"internalType":"address","name":"wallet","type":"address"},{"internalType":"uint256","name":"recoveryNonce","type":"uint256"},{"internalType":"address","name":"guardian","type":"address"}],"name":"getApprovalStatus","outputs":[{"internalType":"bool","name":"","type":"bool"},{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
    {"inputs":[{"internalType":"address","name":"wallet","type":"address"},{"internalType":"uint256","name":"recoveryNonce","type":"uint256"}],"name":"getRecoveryDetails","outputs":[{"internalType":"address","name":"newOwner","type":"address"},{"internalType":"uint256","name":"threshold","type":"uint256"},{"internalType":"uint256","name":"expiry","type":"uint256"},{"internalType":"uint256","name":"guardianCount","type":"uint256"},{"internalType":"bool","name":"executed","type":"bool"},{"internalType":"bool","name":"exists","type":"bool"}],"stateMutability":"view","type":"function"},
    {"inputs":[{"internalType":"address","name":"wallet","type":"address"}],"name":"getThreshold","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
    {"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"getWalletForOwner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
    {"inputs":[{"internalType":"address","name":"wallet","type":"address"},{"internalType":"address","name":"owner","type":"address"}],"name":"initWallet","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[{"internalType":"address","name":"wallet","type":"address"},{"internalType":"uint256","name":"recoveryNonce","type":"uint256"}],"name":"isRecoveryReady","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},
    {"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"nonces","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
    {"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"ownerToWallet","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
    {"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"recoveries","outputs":[{"internalType":"address","name":"newOwner","type":"address"},{"internalType":"uint256","name":"threshold","type":"uint256"},{"internalType":"uint256","name":"expiry","type":"uint256"},{"internalType":"uint256","name":"guardianCount","type":"uint256"},{"internalType":"bool","name":"executed","type":"bool"},{"internalType":"bool","name":"exists","type":"bool"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"recoveryTimeout","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
    {"inputs":[{"internalType":"address","name":"wallet","type":"address"},{"internalType":"address","name":"newOwner","type":"address"}],"name":"rotateKey","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[{"internalType":"address","name":"wallet","type":"address"},{"internalType":"address","name":"newOwner","type":"address"}],"name":"requestRecovery","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[{"internalType":"address","name":"wallet","type":"address"},{"internalType":"uint256","name":"newThreshold","type":"uint256"}],"name":"setThreshold","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[],"name":"defaultThreshold","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
    {"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"walletOwners","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
    {"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"walletThreshold","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}
]''')


# =============================================================================
# Web3 Connection
# =============================================================================
def get_w3() -> Web3:
    w3 = Web3(Web3.HTTPProvider(RPC_URL))
    if not w3.is_connected():
        print("❌ Could not connect to 0G RPC:", RPC_URL)
        sys.exit(1)
    return w3


def get_forge_registry(w3: Web3):
    return w3.eth.contract(address=FORGE_REGISTRY_ADDR, abi=FORGE_REGISTRY_ABI)


def get_social_recovery(w3: Web3, address: str):
    addr = Web3.to_checksum_address(address)
    return w3.eth.contract(address=addr, abi=SOCIAL_RECOVERY_ABI)


# =============================================================================
# Commands
# =============================================================================
def cmd_guardian_status(args):
    """Check if an address is a registered guardian in ForgeRegistry"""
    w3 = get_w3()
    registry = get_forge_registry(w3)

    addr = Web3.to_checksum_address(args.address)
    is_guardian = registry.functions.isGuardian(addr).call()
    total = registry.functions.totalGuardians().call()

    print(f"\n── 0G Guardian Status ──")
    print(f"  Address:     {addr}")
    print(f"  Is Guardian: {'✅ YES' if is_guardian else '❌ NO'}")
    print(f"  Total Registered: {total}")
    print()

    if not is_guardian:
        print("  To register as a guardian, call:")
        print(f"    forge script RegisterGuardian --private-key $KEY")


def cmd_init_wallet(args):
    """Initialize a wallet's ownership in the social recovery module"""
    w3 = get_w3()
    if not args.private_key:
        print("❌ --private-key required for this operation")
        return

    recovery = get_social_recovery(w3, args.contract)
    account = Account.from_key(args.private_key)

    wallet = Web3.to_checksum_address(args.wallet)
    owner = Web3.to_checksum_address(args.owner) if args.owner else account.address

    tx = recovery.functions.initWallet(wallet, owner).build_transaction({
        'from': account.address,
        'nonce': w3.eth.get_transaction_count(account.address),
        'gas': 150000,
        'gasPrice': w3.eth.gas_price,
        'chainId': CHAIN_ID,
    })
    signed = Account.sign_transaction(tx, args.private_key)
    tx_hash = w3.eth.send_raw_transaction(signed.raw_transaction)

    print(f"⏳ Initializing wallet... TX: {tx_hash.hex()}")
    receipt = w3.eth.wait_for_transaction_receipt(tx_hash, timeout=120)
    if receipt['status'] == 1:
        print(f"✅ Wallet initialized: {wallet} → Owner: {owner}")
    else:
        print(f"❌ Transaction failed")


def cmd_request_recovery(args):
    """Request a social recovery for a wallet"""
    w3 = get_w3()
    if not args.private_key:
        print("❌ --private-key required")
        return

    recovery = get_social_recovery(w3, args.contract)
    account = Account.from_key(args.private_key)

    wallet = Web3.to_checksum_address(args.wallet)
    new_owner = Web3.to_checksum_address(args.new_owner)

    tx = recovery.functions.requestRecovery(wallet, new_owner).build_transaction({
        'from': account.address,
        'nonce': w3.eth.get_transaction_count(account.address),
        'gas': 200000,
        'gasPrice': w3.eth.gas_price,
        'chainId': CHAIN_ID,
    })
    signed = Account.sign_transaction(tx, args.private_key)
    tx_hash = w3.eth.send_raw_transaction(signed.raw_transaction)

    print(f"⏳ Requesting recovery... TX: {tx_hash.hex()}")
    receipt = w3.eth.wait_for_transaction_receipt(tx_hash, timeout=120)
    if receipt['status'] == 1:
        nonce = recovery.functions.nonces(wallet).call() - 1
        print(f"✅ Recovery requested for {wallet}")
        print(f"   New Owner: {new_owner}")
        print(f"   Nonce:     {nonce}")
        print(f"   Guardians must approve using nonce {nonce}")
    else:
        print(f"❌ Transaction failed")


def cmd_approve_recovery(args):
    """Approve a pending recovery as a guardian"""
    w3 = get_w3()
    if not args.private_key:
        print("❌ --private-key required")
        return

    recovery = get_social_recovery(w3, args.contract)
    account = Account.from_key(args.private_key)

    wallet = Web3.to_checksum_address(args.wallet)
    nonce = int(args.nonce)

    # Verify caller is a guardian
    registry = get_forge_registry(w3)
    if not registry.functions.isGuardian(account.address).call():
        print(f"❌ {account.address} is NOT a registered guardian in ForgeRegistry")
        return

    tx = recovery.functions.approveRecovery(wallet, nonce).build_transaction({
        'from': account.address,
        'nonce': w3.eth.get_transaction_count(account.address),
        'gas': 100000,
        'gasPrice': w3.eth.gas_price,
        'chainId': CHAIN_ID,
    })
    signed = Account.sign_transaction(tx, args.private_key)
    tx_hash = w3.eth.send_raw_transaction(signed.raw_transaction)

    print(f"⏳ Guardian approving recovery... TX: {tx_hash.hex()}")
    receipt = w3.eth.wait_for_transaction_receipt(tx_hash, timeout=120)
    if receipt['status'] == 1:
        print(f"✅ Guardian {account.address} approved recovery for {wallet} (nonce: {nonce})")
    else:
        print(f"❌ Transaction failed")


def cmd_execute_recovery(args):
    """Execute recovery once threshold is met"""
    w3 = get_w3()
    if not args.private_key:
        print("❌ --private-key required")
        return

    recovery = get_social_recovery(w3, args.contract)
    account = Account.from_key(args.private_key)

    wallet = Web3.to_checksum_address(args.wallet)
    nonce = int(args.nonce)

    # Pre-flight check
    ready = recovery.functions.isRecoveryReady(wallet, nonce).call()
    if not ready:
        details = recovery.functions.getRecoveryDetails(wallet, nonce).call()
        print(f"⚠️ Recovery NOT ready yet:")
        print(f"   Guardian approvals: {details[3]}/{details[1]}")
        print(f"   Executed: {details[4]} | Exists: {details[5]}")
        return

    tx = recovery.functions.executeRecovery(wallet, nonce).build_transaction({
        'from': account.address,
        'nonce': w3.eth.get_transaction_count(account.address),
        'gas': 150000,
        'gasPrice': w3.eth.gas_price,
        'chainId': CHAIN_ID,
    })
    signed = Account.sign_transaction(tx, args.private_key)
    tx_hash = w3.eth.send_raw_transaction(signed.raw_transaction)

    print(f"⏳ Executing recovery... TX: {tx_hash.hex()}")
    receipt = w3.eth.wait_for_transaction_receipt(tx_hash, timeout=120)
    if receipt['status'] == 1:
        new_owner = recovery.functions.getOwner(wallet).call()
        print(f"✅ Recovery EXECUTED!")
        print(f"   Wallet: {wallet}")
        print(f"   New Owner: {new_owner}")
    else:
        print(f"❌ Transaction failed")


def cmd_recovery_status(args):
    """Check the status of a recovery request"""
    w3 = get_w3()
    recovery = get_social_recovery(w3, args.contract)

    wallet = Web3.to_checksum_address(args.wallet)
    nonce = int(args.nonce) if args.nonce else recovery.functions.nonces(wallet).call() - 1

    details = recovery.functions.getRecoveryDetails(wallet, nonce).call()
    owner = recovery.functions.getOwner(wallet).call()

    print(f"\n── Recovery Status for {wallet} ──")
    print(f"  Current Owner:     {owner}")
    print(f"  Recovery Nonce:    {nonce}")
    print()

    if details[5]:  # exists
        new_owner, threshold, expiry, count, executed, _ = details
        now = time.time()
        print(f"  Proposed New Owner: {new_owner}")
        print(f"  Threshold:          {count}/{threshold} guardians")
        print(f"  Expiry:             {expiry} ({'⏰ EXPIRED' if now >= expiry else '✅ Active'})")
        print(f"  Executed:           {'✅ YES' if executed else '⏳ NO'}")
        print()
        if not executed and count >= threshold:
            print(f"  🟢 Recovery is READY for execution!")
        elif not executed:
            remaining = threshold - count
            print(f"  Need {remaining} more guardian approval(s)")
    else:
        print(f"  No active recovery request at nonce {nonce}")
        current_nonce = recovery.functions.nonces(wallet).call()
        print(f"  Current nonce: {current_nonce}")


def cmd_rotate_key(args):
    """Owner-initiated key rotation (direct transfer, no guardian approval needed)"""
    w3 = get_w3()
    if not args.private_key:
        print("❌ --private-key required")
        return

    recovery = get_social_recovery(w3, args.contract)
    account = Account.from_key(args.private_key)

    wallet = Web3.to_checksum_address(args.wallet)
    new_owner = Web3.to_checksum_address(args.new_owner)

    tx = recovery.functions.rotateKey(wallet, new_owner).build_transaction({
        'from': account.address,
        'nonce': w3.eth.get_transaction_count(account.address),
        'gas': 100000,
        'gasPrice': w3.eth.gas_price,
        'chainId': CHAIN_ID,
    })
    signed = Account.sign_transaction(tx, args.private_key)
    tx_hash = w3.eth.send_raw_transaction(signed.raw_transaction)

    print(f"⏳ Rotating key... TX: {tx_hash.hex()}")
    receipt = w3.eth.wait_for_transaction_receipt(tx_hash, timeout=120)
    if receipt['status'] == 1:
        print(f"✅ Key rotated for {wallet}")
        print(f"   New Owner: {new_owner}")
    else:
        print(f"❌ Transaction failed")


def cmd_sign_recovery_approval(args):
    """
    Generate an EIP-712 typed signature for off-chain recovery approval.
    Guardians can sign this offline and submit via approveRecoveryWithSig.
    """
    w3 = get_w3()
    account = Account.from_key(args.private_key)

    wallet = Web3.to_checksum_address(args.wallet)
    new_owner = Web3.to_checksum_address(args.new_owner)
    nonce = int(args.nonce)
    expiry = int(time.time()) + 3600  # 1 hour

    # EIP-712 typed data
    domain = {
        "name": "0G_SOCIAL_RECOVERY",
        "version": "1",
        "chainId": CHAIN_ID,
        "verifyingContract": Web3.to_checksum_address(args.contract),
    }

    message_types = {
        "RecoveryApproval": [
            {"name": "wallet", "type": "address"},
            {"name": "newOwner", "type": "address"},
            {"name": "nonce", "type": "uint256"},
            {"name": "expiry", "type": "uint256"},
        ]
    }

    message = {
        "wallet": wallet,
        "newOwner": new_owner,
        "nonce": nonce,
        "expiry": expiry,
    }

    typed_data = {
        "types": {
            "EIP712Domain": [
                {"name": "name", "type": "string"},
                {"name": "version", "type": "string"},
                {"name": "chainId", "type": "uint256"},
                {"name": "verifyingContract", "type": "address"},
            ],
            **message_types,
        },
        "domain": domain,
        "primaryType": "RecoveryApproval",
        "message": message,
    }

    signed = Account.sign_typed_data(account._private_key, typed_data)

    print(f"\n── EIP-712 Recovery Approval Signature ──")
    print(f"  Wallet:       {wallet}")
    print(f"  New Owner:    {new_owner}")
    print(f"  Nonce:        {nonce}")
    print(f"  Expiry:       {expiry}")
    print(f"  Guardian:     {account.address}")
    print()
    print(f"  v:            {signed.v}")
    print(f"  r:            ​{signed.r.hex()}")
    print(f"  s:            ​{signed.s.hex()}")
    print()
    print("Submit with:")
    print(f"  python 0g_social_recovery.py submit-sig \\")
    print(f"    --contract {args.contract} \\")
    print(f"    --wallet {wallet} \\")
    print(f"    --new-owner {new_owner} \\")
    print(f"    --nonce {nonce} \\")
    print(f"    --expiry {expiry} \\")
    print(f"    --v {signed.v} \\")
    print(f"    --r {signed.r.hex()} \\")
    print(f"    --s {signed.s.hex()}")


def cmd_submit_signature(args):
    """Submit an EIP-712 signed recovery approval"""
    w3 = get_w3()
    if not args.private_key:
        print("❌ --private-key required")
        return

    recovery = get_social_recovery(w3, args.contract)
    account = Account.from_key(args.private_key)

    wallet = Web3.to_checksum_address(args.wallet)
    new_owner = Web3.to_checksum_address(args.new_owner)
    nonce = int(args.nonce)
    expiry = int(args.expiry)
    v = int(args.v)
    r = bytes.fromhex(args.r[2:] if args.r.startswith('0x') else args.r)
    s = bytes.fromhex(args.s[2:] if args.s.startswith('0x') else args.s)

    tx = recovery.functions.approveRecoveryWithSig(
        wallet, new_owner, nonce, expiry, v, r, s
    ).build_transaction({
        'from': account.address,
        'nonce': w3.eth.get_transaction_count(account.address),
        'gas': 200000,
        'gasPrice': w3.eth.gas_price,
        'chainId': CHAIN_ID,
    })
    signed_tx = Account.sign_transaction(tx, args.private_key)
    tx_hash = w3.eth.send_raw_transaction(signed_tx.raw_transaction)

    print(f"⏳ Submitting signed approval... TX: {tx_hash.hex()}")
    receipt = w3.eth.wait_for_transaction_receipt(tx_hash, timeout=120)
    if receipt['status'] == 1:
        print(f"✅ Signed approval submitted for {wallet} (nonce: {nonce})")
    else:
        print(f"❌ Transaction failed")


# =============================================================================
# CLI Entry Point
# =============================================================================
def main():
    parser = argparse.ArgumentParser(
        description="0G Social Recovery CLI — Guardian Tool",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Check guardian status
  python 0g_social_recovery.py guardian-status 0xYourAddress

  # Initialize a wallet
  python 0g_social_recovery.py init-wallet 0xWallet 0xOwner --private-key 0xKey

  # Request recovery (triggered by wallet owner or anyone)
  python 0g_social_recovery.py request-recovery 0xLostWallet 0xNewOwner --private-key 0xKey

  # Approve recovery (guardian on-chain vote)
  python 0g_social_recovery.py approve-recovery 0xLostWallet 0 --private-key 0xGuardianKey

  # Check recovery status
  python 0g_social_recovery.py recovery-status 0xLostWallet 0

  # Execute recovery (after threshold met)
  python 0g_social_recovery.py execute-recovery 0xLostWallet 0 --private-key 0xKey

  # Generate offline EIP-712 signature (sign once, submit separately)
  python 0g_social_recovery.py sign-recovery-approval 0xLostWallet 0xNewOwner 0 --private-key 0xGuardianKey
        """
    )

    parser.add_argument('--contract', default=SOCIAL_RECOVERY_ADDR,
                        help='0GSocialRecovery contract address')
    parser.add_argument('--private-key', help='Private key for transactions')
    parser.add_argument('--rpc', default=RPC_URL, help='0G RPC URL')

    subparsers = parser.add_subparsers(dest='command', help='Command to execute')

    # guardian-status
    p = subparsers.add_parser('guardian-status', help='Check guardian registration status')
    p.add_argument('address', help='Ethereum address to check')
    p.set_defaults(func=cmd_guardian_status)

    # init-wallet
    p = subparsers.add_parser('init-wallet', help='Initialize a wallet in the recovery module')
    p.add_argument('wallet', help='Wallet contract address')
    p.add_argument('--owner', help='Owner address (defaults to sender)')
    p.set_defaults(func=cmd_init_wallet)

    # request-recovery
    p = subparsers.add_parser('request-recovery', help='Request social recovery for a wallet')
    p.add_argument('wallet', help='Wallet address to recover')
    p.add_argument('new_owner', help='New owner address')
    p.set_defaults(func=cmd_request_recovery)

    # approve-recovery
    p = subparsers.add_parser('approve-recovery', help='Approve a recovery request (on-chain)')
    p.add_argument('wallet', help='Wallet address')
    p.add_argument('nonce', help='Recovery nonce')
    p.set_defaults(func=cmd_approve_recovery)

    # execute-recovery
    p = subparsers.add_parser('execute-recovery', help='Execute recovery once threshold is met')
    p.add_argument('wallet', help='Wallet address')
    p.add_argument('nonce', help='Recovery nonce')
    p.set_defaults(func=cmd_execute_recovery)

    # recovery-status
    p = subparsers.add_parser('recovery-status', help='Check recovery request status')
    p.add_argument('wallet', help='Wallet address')
    p.add_argument('nonce', nargs='?', help='Recovery nonce (defaults to latest)')
    p.set_defaults(func=cmd_recovery_status)

    # rotate-key
    p = subparsers.add_parser('rotate-key', help='Direct key rotation (owner only)')
    p.add_argument('wallet', help='Wallet address')
    p.add_argument('new_owner', help='New owner address')
    p.set_defaults(func=cmd_rotate_key)

    # sign-recovery-approval (offline EIP-712)
    p = subparsers.add_parser('sign-recovery-approval',
                              help='Generate EIP-712 typed signature for offline approval')
    p.add_argument('wallet', help='Wallet address')
    p.add_argument('new_owner', help='New owner address')
    p.add_argument('nonce', help='Recovery nonce')
    p.set_defaults(func=cmd_sign_recovery_approval)

    # submit-sig
    p = subparsers.add_parser('submit-sig', help='Submit an EIP-712 signed approval')
    p.add_argument('--wallet', required=True)
    p.add_argument('--new-owner', required=True)
    p.add_argument('--nonce', required=True)
    p.add_argument('--expiry', required=True)
    p.add_argument('--v', required=True)
    p.add_argument('--r', required=True)
    p.add_argument('--s', required=True)
    p.set_defaults(func=cmd_submit_signature)

    args = parser.parse_args()
    if not args.command:
        parser.print_help()
        return

    # Set the RPC URL
    global RPC_URL
    RPC_URL = args.rpc

    args.func(args)


if __name__ == '__main__':
    main()