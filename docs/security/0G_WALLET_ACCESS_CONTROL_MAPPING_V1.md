# 0G Wallet Access Control Mapping v1

Created: 2026-06-17T17:30:21Z

## Status

PASS — 0G wallet and audit-wallet requirements were extracted and mapped into Quantum Pi Forge access-control requirements.

## Source artifacts

- `/tmp/0gskills-checks/wallets.SKILL.md`
- SHA256: `14065bb61a36157855b8a3edb671d0363f561eb1b669602386e330149647e1c0`
- `/tmp/0gskills-checks/audit-wallets.SKILL.md`
- SHA256: `379f50132204dd4bad24f33981116cef7c71af5d717517733ba0f50228e2e44c`

## 0G network parameters

| Network | Chain ID | RPC |
|---|---:|---|
| Galileo testnet | 16602 | `https://evmrpc-testnet.0g.ai` |
| Aristotle mainnet | 16661 | `https://evmrpc.0g.ai` |

## Access-control requirements

1. Use the correct 0G chain ID and RPC before wallet operations.
2. Never embed production private keys in frontend bundles or agent logs.
3. Use environment variables and secret managers for CI deploy keys.
4. Prefer hardware wallets or multisig for production admin roles.
5. Separate deployer, treasury, agent, and validator keys.
6. Use unique capped-fund keys per agent.
7. Keep validator `priv_validator_key.json` separate from deployment keys.
8. Verify EIP-712 domain separators bind the correct 0G chain ID and verifying contract.
9. Prevent replay across Galileo and Aristotle.
10. Validate transaction `to`, `value`, and `data` before signing.
11. Handle gas estimation failures without recursive signing loops.
12. Rate-limit wallet handlers to prevent rapid agent-driven wallet drain.
13. Avoid leaking sensitive transaction/private state through debug logs or CI traces.

## Governance posture

- Non-executing requirements mapping only.
- Protocol Interface Freeze preserved.
- No wallet connection attempted.
- No private key used.
- No transaction signed.
- No transaction broadcast.
- No funding attempted.
- No approvals attempted.
- No liquidity attempted.

## Receipt

`receipts/security/0g-wallet-access-control-mapping-v1.json`
