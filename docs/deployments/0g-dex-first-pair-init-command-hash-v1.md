# 0G DEX First Pair Init Command Hash v1

Status: COMMAND_HASH_SEALED_NO_BROADCAST

## Intent

Seal the exact non-broadcast command intent for Factory.createPair(W0G, USDC.e).

## Pair

- Token A: W0G / 0xD1De4F87C8b195f21254b7163dDA9370D8Df593d
- Token B: USDC.e / 0x1f3aa82227281ca364bfb3d253b0f1af1da6473e
- Factory: 0x215E28f94F68c70ea5B79D9Fc062deF4F7B7D3F8
- Function: createPair(address,address)

## Boundary

This lane seals calldata and command hash only. It does not use a private key, does not broadcast, does not call createPair, does not approve tokens, does not transfer tokens, and does not add liquidity.

## Next Lane

After this is merged, the next lane may define the final explicit operator execution command.
