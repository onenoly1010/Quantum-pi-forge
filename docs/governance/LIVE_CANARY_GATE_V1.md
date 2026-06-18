# Live Canary Gate v1

## Purpose

Authorize exactly one bounded live read-only canary on 0G Aristotle mainnet. No wallet signing, no funding, no private keys, no storage upload, no inference execution.

## Current sealed baseline

```text
CURRENT_STATE=sealed reviewer-safe infrastructure
COMPUTE_GATE=merged
SECRET_ENV_EXCLUSION=merged
DETERMINISM=pass
LIVE_EXECUTION=false
PRIVATE_KEY_ACTIONS=false
WALLET_ACTIONS=false
FUNDING_ACTIONS=false
```

## Live scope

```json
{
  "live_scope": "read_only_chain_canary",
  "chain_id_expected": 16661,
  "rpc_checked": true,
  "wallet_required": false,
  "private_key_required": false,
  "funding_required": false,
  "transaction_broadcast_allowed": false,
  "storage_upload_allowed": false,
  "compute_inference_allowed": false,
  "operator_approval_required_for_next_gate": true
}
```

## Allowed checks

- 0G RPC responds
- chain ID is 16661
- deployed QPF contract addresses have code
- no transaction sent
- no private key loaded
- no wallet action attempted

## Next live lanes (future, not authorized yet)

```text
1. LIVE_READ_ONLY_CANARY_V1
2. COMPUTE_ROUTER_HEALTH_CANARY_V1
3. WALLET_FUNDING_BOUNDARY_V1
4. STORAGE_TINY_UPLOAD_CANARY_V1
5. COMPUTE_ROUTER_INFERENCE_CANARY_V1
6. PUBLIC_OPERATIONAL_STATUS_V1
7. SCALE_PLAN_V1
```

## References

- 0G Documentation: https://docs.0g.ai/ai-context
- 0G Inference: https://docs.0g.ai/developer-hub/building-on-0g/compute-network/inference
- 0G Storage SDK: https://docs.0g.ai/developer-hub/building-on-0g/storage/sdk