# 0G DEX First Pair Metadata Probe v1

Status: SCRIPT_READY_RECEIPT_REQUIRES_TOKEN_B
Network: 0G Aristotle Mainnet
Chain ID: 16661
Factory: 0x215E28f94F68c70ea5B79D9Fc062deF4F7B7D3F8
Router: 0x2c70129E50BF88eCD59b89d63af2e8920aCF3951
W0G: 0xD1De4F87C8b195f21254b7163dDA9370D8Df593d

## Boundary

This lane is read-only. It does not use a private key, broadcast transactions, create pairs, approve spenders, transfer tokens, add liquidity, set feeTo, or mutate chain state.

## Probe Command

TOKEN_B=0x0000000000000000000000000000000000000000 npm run probe:v2-first-pair-metadata:v1

Replace TOKEN_B with the selected candidate token address before running the probe.

## Verification Command

npm run governance:v2-first-pair-metadata-probe:v1:check
