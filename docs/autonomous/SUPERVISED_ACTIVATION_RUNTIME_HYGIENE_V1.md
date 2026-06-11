# Supervised Activation Runtime Hygiene v1

## Status

Sealed runtime hygiene correction for supervised autonomous activation v1.

## Reason

After PR #209 merged, supervised activation dry-runs executed successfully on main but emitted runtime receipts into a tracked receipt path.

That behavior produced untracked files on main.

The receipts are valid evidence, but future runtime output should not dirty the repository by default.

## Baseline

- main == origin/main == 007448b at lane creation.
- PR #209 supervised autonomous activation command v1 is on main.
- Runner implementation remains frozen.

## Correction

This lane updates the supervised activation command so future default runtime receipts are written to an ignored runtime path:

```text
runtime/autonomous/runs/
```

The command still emits a receipt path, status, and SHA256.

## Preserved Evidence

The post-merge dry-run receipts generated immediately after PR #209 remain valid local evidence.

This lane does not claim live activation.

## Final Invariant

supervised_activation_runtime_hygiene_defined == true
default_runtime_receipts_ignored == true
post_merge_dry_run_receipts_preserved == true
irreversible_network_actions_refused == true
private_key_access_refused == true
full_autonomy_claimed == false
runner_implementation_frozen == true
