# Post-Merge Governance Receipt: PR #296

## Status

Sealed post-merge governance receipt.

## Subject

PR #296 sealed the v2 cutover execution command hash. This receipt seals the post-merge state.

## Canonical Merge

- PR: #296
- Title: `Seal v2 cutover execution command hash v1`
- Commit: `af391d8`
- Full commit: `af391d8e3f9a84ae3d1e30ac0a3b2adc31507c54`
- Merged at: `2026-06-12T06:28:21Z`
- Cutover command SHA-256: `37f8940d93130365e0bf395912b4eef134fa558db92c82c254b1f0af838a20a8`

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

This receipt does not authorize or execute cutover. Any execution must occur in a separate explicit execution lane.

## Conclusion

The system is unpark-approved and command-hash-bound, not executed.
