# Deployed Addresses

**Status:** Pending / Canonical Placeholder  
**Date:** June 2026  
**Purpose:** Provide a single public location for deployed contract addresses, chain IDs, bytecode verification status, and proof links.

## Review Boundary

This file does **not** claim deployment where proof is absent.

A contract is only considered publicly deployed and reviewer-verifiable when this file includes:

- Chain name
- Chain ID
- Contract name
- Contract address
- Deployment transaction hash
- Deployment block
- Explorer link or RPC proof path
- Compiler version
- Optimization settings
- Constructor arguments, if any
- ABI hash
- Bytecode match status
- Verification report path

## Deployment Matrix

| Chain | Chain ID | Contract | Address | Tx Hash | Block | Verification Status |
| --- | ---: | --- | --- | --- | ---: | --- |
| 0G Aristotle Mainnet | 16661 | OINIOToken | Pending | Pending | Pending | Pending |
| 0G Aristotle Mainnet | 16661 | OINIOModelRegistry | Pending | Pending | Pending | Pending |
| Pi Testnet | Pending | OINIOToken | Pending | Pending | Pending | Pending |
| Pi Testnet | Pending | OINIOModelRegistry | Pending | Pending | Pending | Pending |
| Pi Mainnet | Pending | OINIOToken | Pending | Pending | Pending | Pending |
| Pi Mainnet | Pending | OINIOModelRegistry | Pending | Pending | Pending | Pending |

## Current Canonical Position

OINIO contract source, tests, and deployment scripts may exist in the repository.

However, public deployed-address status remains **Pending** until chain-specific proof is added here.

Economic flows such as staking, liquidity, wallet signing, and relayer execution must remain disabled or clearly marked pending until the relevant deployed contract proofs are complete.

## Required Verification Bundle

Each deployed contract entry should eventually link to:

1. Raw deployment receipt
2. Explorer verification page, if available
3. RPC `eth_getCode` output
4. ABI hash
5. Compiler metadata
6. Constructor arguments
7. Local verification command output
8. Matching entry in `docs/review/CLAIM_TO_PROOF_MATRIX.md`
