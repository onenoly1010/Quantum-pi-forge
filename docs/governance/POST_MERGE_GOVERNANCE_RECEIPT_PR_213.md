# Post-Merge Governance Receipt - PR #213

## Status

Sealed post-merge governance receipt.

## Mainline Baseline

main == origin/main == d6a3c28

## Covered PR

- PR #213: Add supervised activation readiness index v1

## Merge Facts

- Merge commit: d6a3c28
- Merge method: squash merge
- Bypass used: false
- Branch deleted: true

## Verified Mainline Checks

- npm run autonomous:supervised-activation-readiness-index:v1:check
- npm run governance:pr-209-211-post-merge:v1:check
- npm run autonomous:supervised-activation-refusal-tests:v1:check
- npm run autonomous:supervised-activation-runtime-hygiene:v1:check
- npm run autonomous:supervised-activation:v1:check
- npm run autonomous:network-activation-readiness:v2:check
- npm run governance:pr-207-post-merge:v1:check
- npm run governance:pr-205-post-merge:v1:check
- npm run build

## Governance Boundary

This receipt records that the supervised activation readiness index landed on main.

This receipt does not authorize live deployment.

This receipt does not authorize wallet use.

This receipt does not authorize private-key access.

This receipt does not claim full autonomous network operation.

This receipt does not modify self-hosted runner implementation.

## Final Invariant

pr_213_merged_cleanly == true
github_hosted_bypass_used == false
supervised_activation_readiness_index_on_main == true
operator_reviewer_activation_map_on_main == true
dry_run_default == true
live_mode_refused == true
private_key_context_refused == true
irreversible_network_action_executed == false
full_autonomy_claimed == false
runner_implementation_frozen == true
verification_green_on_main == true
