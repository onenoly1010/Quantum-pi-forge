# Post-Merge Governance Receipt: PR #298

## Status

Sealed post-merge governance receipt.

## Subject

PR #298 merged the v2 mainnet cutover execution evidence. This receipt seals the post-merge state only.

## Canonical Merge

- PR: #298
- Title: `Record v2 mainnet cutover execution v1`
- Commit: `061de3c`
- Full commit: `061de3cf004a66abdaf0afb83ff484cf7e35e379`
- Merged at: `2026-06-12T06:38:12Z`

## Execution Evidence Anchor

- Execution wrapper receipt: `receipts/governance/v2-mainnet-cutover-execution-governance-wrapper-v1.json`
- Execution wrapper sha256: `5137cc3b2345b681852069b3f48151c539c2515fce0797c9a6dcf699cf550b2f`
- Execution wrapper status: `execution_command_failed_or_missing_receipt`
- Execution command sha256: `37f8940d93130365e0bf395912b4eef134fa558db92c82c254b1f0af838a20a8`
- Execution command exit code: `1`
- Execution receipt exists: `false`
- Execution log: `logs/v2-mainnet-cutover-execution-20260612T063428Z.log`

## Approval State

- final_operator_unpark_approval_created = true
- final_operator_unpark_approval_granted = true
- mainnet_cutover_approval_granted = true

## Boundary

This receipt performs no additional execution. It only seals the post-merge state for PR #298.

## Conclusion

The execution evidence is sealed on main. No additional command was run by this receipt.
