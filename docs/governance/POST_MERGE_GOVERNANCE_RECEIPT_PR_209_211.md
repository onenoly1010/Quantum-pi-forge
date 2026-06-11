# Post-Merge Governance Receipt - PRs #209-#211

## Status

Sealed combined post-merge governance receipt.

This receipt records the supervised autonomous activation safety sequence.

## Mainline Baseline

main == origin/main == a1c57db

## Covered PRs

- PR #209: Define supervised autonomous activation command v1
- PR #210: Fix supervised activation runtime receipt hygiene v1
- PR #211: Prove supervised activation refusal tests v1

## Merge Facts

- PR #209 merge commit: 007448b
- PR #210 merge commit: 293d70c
- PR #211 merge commit: a1c57db
- Merge method: squash merge
- Bypass used: false

## Verified Safety Properties

- supervised activation command exists
- default mode remains dry-run
- runtime receipts default to ignored runtime path
- main remains clean after dry-run
- live mode is refused
- private-key context is refused
- no irreversible network action is executed
- no full autonomy claim is made
- self-hosted runner implementation remains frozen

## Checks Passed on Main

- npm run autonomous:supervised-activation-refusal-tests:v1:check
- npm run autonomous:supervised-activation-runtime-hygiene:v1:check
- npm run autonomous:supervised-activation:v1:check
- npm run autonomous:network-activation-readiness:v2:check
- npm run governance:pr-207-post-merge:v1:check
- npm run governance:pr-205-post-merge:v1:check
- npm run build

## Governance Boundary

This receipt does not authorize live deployment.

This receipt does not authorize wallet use.

This receipt does not authorize private-key access.

This receipt does not modify self-hosted runner implementation.

## Final Invariant

pr_209_merged_cleanly == true
pr_210_merged_cleanly == true
pr_211_merged_cleanly == true
github_hosted_bypass_used == false
supervised_activation_command_on_main == true
runtime_hygiene_on_main == true
refusal_tests_on_main == true
dry_run_default == true
live_mode_refused == true
private_key_context_refused == true
irreversible_network_action_executed == false
full_autonomy_claimed == false
runner_implementation_frozen == true
verification_green_on_main == true
