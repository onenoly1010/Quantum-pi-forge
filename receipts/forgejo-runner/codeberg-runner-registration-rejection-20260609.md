# Codeberg Runner Registration Rejection Receipt

Date: 2026-06-09
Branch: ops/forgejo-actions-proof-v1

## Attempted

- Codeberg repo Actions unit enabled
- Branch pushed to Codeberg
- Repo-scope runner token tested
- User-scope runner token tested
- One-shot runner registration used to avoid restart loops

## Observed

Runner successfully pinged Codeberg:

```text
Successfully pinged the Forgejo instance server
```

Registration failed:

```text
invalid_argument: runner registration token not found
Error: Failed to register runner: invalid_argument: runner registration token not found
```

## Conclusion

Self-hosted runner registration is externally blocked at Codeberg token acceptance.

This receipt preserves the boundary without falsely claiming hosted or self-hosted Codeberg Actions execution.
