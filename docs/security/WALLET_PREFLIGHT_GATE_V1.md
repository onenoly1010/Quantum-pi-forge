# Wallet Preflight Gate v1

This wrapper enforces the `wallet-preflight-verifier-v1` before any future deploy, send, approve, or chain-interaction command.

## Gate checks
- Runs `scripts/security/wallet-preflight-verifier-v1.cjs`.
- Requires `result: PASS`.
- Requires `posture: non_executing_wallet_preflight`.
- Requires `private_key_used: false`.
- Requires `transaction_signed: false`.
- Requires `transaction_broadcast: false`.
- Requires an empty `failures` array.
- Runs `npm run verify:evidence-index` to detect evidence-index drift.
- Restores the generated verifier receipt after the check so the repository remains clean.

## Usage
`bash scripts/security/wallet-preflight-gate-v1.sh`

For future gated commands:

`bash scripts/security/wallet-preflight-gate-v1.sh <command> <args...>`

This gate is non-executing by itself. It does not use private keys, sign transactions, broadcast transactions, fund wallets, approve allowances, or mutate chain state.
