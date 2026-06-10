# External Runner Fixed-Run Observation v1

## Status

Sealed fixed-run observation receipt.

## Scope

This receipt records the first Codeberg / Forgejo observation after the snapshot ancestry repair was merged.

## Fixed Commit

GitHub main and Codeberg main were aligned to:

```text
fd8164fa2864e53b00a60a5823b837d9e928ef90
```

Short commit:

```text
fd8164f
```

## Repair Already Applied

The Forgejo workflow now uses:

```yaml
with:
  fetch-depth: 0
```

This directly addresses the prior deterministic failure:

```text
canonicalCommit is not an ancestor of HEAD
```

## Observation

A Codeberg run was visible for the fixed commit, but no final PASS or FAILURE log was available at observation time.

Classification:

```text
INACCESSIBLE
```

Observation note:

```text
run exists for fd8164f but is waiting; no final result or log available yet
```

## Boundary

external_runner_executed == unknown_for_fixed_run

external_runner_pass == false

external_pass_claimed == false

No PASS is claimed by this receipt.

This receipt does not supersede the prior FAILURE receipt until a final accessible fixed-run PASS or FAILURE log is available.

## Next Required Action

Observe the same Codeberg fixed-run again and seal one of:

- PASS
- FAILURE
- INACCESSIBLE_FINAL
- ABSENT_FINAL

No assumption is permitted.
