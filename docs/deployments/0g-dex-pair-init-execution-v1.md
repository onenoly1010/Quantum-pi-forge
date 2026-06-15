# 0G DEX Pair Initialization Execution v1

Status: SUPERVISED_EXECUTION_PENDING
Network: 0G Aristotle Mainnet
Chain ID: 16661
Base deployment doc: docs/deployments/full-0g-dex-live-status-v1.md
Readiness doc: docs/deployments/0g-dex-pair-init-readiness-v1.md

## Live Base Contracts

W0G: 0xD1De4F87C8b195f21254b7163dDA9370D8Df593d
UniswapV2Factory: 0x215E28f94F68c70ea5B79D9Fc062deF4F7B7D3F8
UniswapV2Router02: 0x2c70129E50BF88eCD59b89d63af2e8920aCF3951

## Execution Boundary

This scaffold does not create pairs, add liquidity, approve spenders, transfer tokens, set feeTo, or broadcast transactions.

Execution may proceed only after the first canonical pair is explicitly selected and all token/liquidity fields are completed.

## First Pair Selection

Pair status: NOT_SELECTED
Token A symbol: TBD
Token A address: TBD
Token A decimals: TBD
Token B symbol: TBD
Token B address: TBD
Token B decimals: TBD

Recommended first path: W0G paired with one strategic ecosystem token or stable quote asset only.

## Liquidity Policy

Initial amount token A: TBD
Initial amount token B: TBD
LP recipient: TBD
Slippage policy: TBD
Deadline policy: TBD

## Required Confirmations Before Broadcast

1. Pair does not already exist in Factory.
2. Token addresses are verified contracts on 0G Aristotle.
3. Decimals and symbols are verified from chain reads.
4. Initial liquidity amounts are intentionally small and operator-approved.
5. LP recipient is confirmed.
6. Slippage and deadline policy are confirmed.
7. Receipt path is prepared before live transaction.
8. Post-execution tx hash, pair address, block number, and reserves are sealed.

## Receipt Template

receipts/execution/v2-pair-init-execution-v1.json

## Verification Command

npm run governance:v2-pair-init-execution:v1:check
