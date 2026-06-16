# 0G DEX First Pair Final Live Pre-Broadcast Probe v1

Status: FINAL_LIVE_PREFLIGHT_READY_NO_BROADCAST

## Intent

Perform the final live read-only chain check immediately before any possible broadcast path.

## Required Live Conditions

- Chain ID is 16661
- Factory code exists
- W0G code exists
- USDC.e code exists
- factory.getPair(W0G, USDC.e) is zero address
- Pair does not exist yet

## Boundary

This lane does not use a private key, does not broadcast, does not call createPair, does not approve tokens, does not transfer tokens, does not add liquidity, and does not mutate feeTo.

## Decision After Merge

After this lane is merged, the operator may either stop with complete sealed evidence or explicitly authorize the single live createPair transaction.
