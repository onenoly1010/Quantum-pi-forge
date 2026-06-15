# 0G DEX Pair Initialization Readiness v1

Status: READINESS_ONLY_NO_BROADCAST
Network: 0G Aristotle Mainnet
Chain ID: 16661
Base deployment doc: docs/deployments/full-0g-dex-live-status-v1.md

## Live Base Contracts

W0G: 0xD1De4F87C8b195f21254b7163dDA9370D8Df593d
UniswapV2Factory: 0x215E28f94F68c70ea5B79D9Fc062deF4F7B7D3F8
UniswapV2Router02: 0x2c70129E50BF88eCD59b89d63af2e8920aCF3951

## Boundary

This lane does not create pairs, add liquidity, transfer tokens, approve spenders, set feeTo, or broadcast transactions.

## Required Before Pair Creation

1. Choose explicit token pair list.
2. Confirm token contract addresses.
3. Confirm token decimals and symbols.
4. Confirm desired first liquidity amounts.
5. Confirm recipient/LP holder address.
6. Confirm slippage/deadline policy.
7. Seal a separate execution receipt after live action.

## Initial Recommendation

Start with one canonical pair only. Prefer W0G paired with the most strategically important ecosystem token or stable quote asset available on 0G Aristotle. Do not initialize multiple speculative pairs in the first lane.

## Verification Command

npm run governance:v2-pair-init-readiness:v1:check
