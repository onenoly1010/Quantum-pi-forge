# 0G DEX First Pair Selection Manifest v1

Status: PAIR_SELECTION_PENDING_NO_BROADCAST
Network: 0G Aristotle Mainnet
Chain ID: 16661
Execution scaffold: docs/deployments/0g-dex-pair-init-execution-v1.md
Readiness gate: docs/deployments/0g-dex-pair-init-readiness-v1.md
Live deployment: docs/deployments/full-0g-dex-live-status-v1.md

## Boundary

This manifest does not create pairs, add liquidity, approve spenders, transfer tokens, set feeTo, or broadcast transactions.

## Canonical Pair Candidate

Pair status: NOT_SELECTED
Token A symbol: W0G
Token A address: 0xD1De4F87C8b195f21254b7163dDA9370D8Df593d
Token A decimals: TBD_ON_CHAIN_VERIFY
Token B symbol: TBD
Token B address: TBD
Token B decimals: TBD_ON_CHAIN_VERIFY

## Selection Rule

Only one first canonical pair may be selected in this lane. Multi-pair launch is explicitly out of scope.

## Required Before Execution Doc Update

1. Verify Token A symbol and decimals by chain read.
2. Verify Token B symbol and decimals by chain read.
3. Confirm pair does not already exist in Factory.
4. Confirm conservative initial liquidity amounts.
5. Confirm LP recipient address.
6. Confirm slippage and deadline policy.
7. Update execution doc and receipt only after all fields are known.

## Recommended Default

W0G plus one verified strategic ecosystem token or stable quote asset.

## Verification Command

npm run governance:v2-first-pair-selection:v1:check
