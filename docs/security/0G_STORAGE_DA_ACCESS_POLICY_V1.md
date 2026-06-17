# 0G Storage / Data Availability Access Policy v1

This policy defines the initial non-executing access boundary for future 0G Storage and Data Availability interactions.

## Status
- Policy posture: `non_executing_storage_da_mapping`
- Chain: 0G Aristotle Mainnet
- Chain ID: `16661`
- RPC: `https://evmrpc.0g.ai`
- Required gate: `scripts/security/wallet-preflight-gate-v1.sh`

## Allowed future storage intent
- Store deterministic audit artifacts.
- Store public verification metadata.
- Store content-addressed payloads only after local hash calculation.
- Store receipts that can be replayed or independently checked.

## Forbidden behavior
- No private keys in environment variables.
- No mnemonic or seed phrase usage.
- No unsigned policy bypass.
- No direct storage upload without wallet preflight gate.
- No transaction signing in this policy lane.
- No transaction broadcast in this policy lane.
- No funding, approvals, swaps, staking, bridging, or liquidity actions.
- No confidential user data, secrets, credentials, or wallet material.

## Required future DA receipt fields
- `id`
- `policy`
- `chain_id`
- `rpc`
- `payload_kind`
- `payload_sha256`
- `content_address_expected`
- `wallet_preflight_gate_required`
- `private_key_used`
- `transaction_signed`
- `transaction_broadcast`
- `storage_write_attempted`
- `chain_state_mutated`

## Current conclusion
This policy is a mapping artifact only. It does not upload data, sign transactions, broadcast transactions, fund wallets, approve allowances, or mutate chain state.
