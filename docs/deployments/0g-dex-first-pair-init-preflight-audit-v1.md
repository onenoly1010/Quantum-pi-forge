# 0G DEX First Pair Init Preflight Audit v1

Status: PREFLIGHT_AUDIT_ONLY_NO_BROADCAST
Base head: becb32b

## Candidate Pair

- Token A: W0G / 0xD1De4F87C8b195f21254b7163dDA9370D8Df593d
- Token B: USDC.e / 0x1f3aa82227281ca364bfb3d253b0f1af1da6473e
- Factory: 0x215E28f94F68c70ea5B79D9Fc062deF4F7B7D3F8
- Router: 0x2c70129E50BF88eCD59b89d63af2e8920aCF3951

## Required Existing Evidence

- v2-first-pair-metadata-probe-v1 receipt exists
- receipt status is READ_ONLY_PROBE_COMPLETE_NO_BROADCAST
- pairExists is false
- factoryGetPair is zero address
- all receipt boundaries are false

## Boundary

This lane does not use a private key, does not broadcast, does not call createPair, does not approve tokens, does not transfer tokens, and does not add liquidity. It only audits whether the existing read-only receipt is safe to promote into a later explicit execution-prep lane.

## Next Lane After Merge

If this audit passes and is merged, the next lane may seal a pair-init command hash. That later lane must still remain non-broadcast until the final explicit operator execution command is selected.
