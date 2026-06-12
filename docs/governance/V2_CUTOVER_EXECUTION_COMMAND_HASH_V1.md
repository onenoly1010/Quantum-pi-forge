# V2 Cutover Execution Command Hash v1

## Status

Execution command hash sealed. Not executed.

## Canonical Base

- Base commit: `85e33a9`
- Full base commit: `85e33a980816a40d72851ccedba845f236fed569`
- Sealed at: `2026-06-12T06:24:46Z`

## Bound Command

```bash
npm run autonomous:v2-mainnet-cutover:execute -- --require-command-hash --receipt receipts/execution/v2-mainnet-cutover-execution-v1.json
```

## Command SHA-256

`37f8940d93130365e0bf395912b4eef134fa558db92c82c254b1f0af838a20a8`

## Approval State

- final_operator_unpark_approval_created = true
- final_operator_unpark_approval_granted = true
- mainnet_cutover_approval_granted = true
- execution_command_hash_bound = true

## Execution State

- execution_command_executed = false
- mainnet_cutover_executed = false
- deployment_executed = false
- broadcast_executed = false
- state_changing_transaction_executed = false
- wallet_signing_executed = false
- liquidity_action_executed = false
- staking_action_executed = false
- relayer_action_executed = false

## Boundary

This lane binds the command hash only. It does not execute cutover.

## Conclusion

The system is unpark-approved and command-hash-bound, but not executed.
