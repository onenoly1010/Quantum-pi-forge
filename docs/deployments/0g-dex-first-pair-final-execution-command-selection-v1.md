# 0G DEX First Pair Final Execution Command Selection v1

Status: FINAL_EXECUTION_COMMAND_SELECTED_NO_BROADCAST

## Intent

Bind the sealed first-pair command hash to the exact future execution path without broadcasting anything.

## Selected Pair

- Token A: W0G / 0xD1De4F87C8b195f21254b7163dDA9370D8Df593d
- Token B: USDC.e / 0x1f3aa82227281ca364bfb3d253b0f1af1da6473e
- Factory: 0x215E28f94F68c70ea5B79D9Fc062deF4F7B7D3F8
- Function: createPair(address,address)
- Value: 0 wei

## Required Immediate Pre-Broadcast Checks

- Chain ID must be 16661
- factory.getPair(W0G, USDC.e) must still be zero address
- Operator private key must be supplied only at execution time
- Human operator must explicitly confirm live broadcast
- No approval, transfer, liquidity, or feeTo mutation may be bundled

## Boundary

This lane does not use a private key, does not broadcast, and does not call createPair. It only selects and verifies the future execution command template.
