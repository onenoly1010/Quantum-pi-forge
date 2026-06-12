# Mainnet Execution Result v1

## Status

This document records the result of the first single-use mainnet execution window.

This is a result receipt.

It records what happened after the sealed final command was run.

## Canonical Baseline

```txt
main_commit = ee7f5167dd00ff5159cc1db4b631ebd4fbc8c0ab
main_subject = Open mainnet execution window v1 (#274)
```

## Execution Attempt

```txt
execution_attempted = true
result_status = EXECUTION_COMMAND_FAILED
exit_code = 1
started_at_utc = 2026-06-12T03:01:24Z
ended_at_utc = 2026-06-12T03:01:25Z
```

## Captured Runtime Evidence

```txt
stdout_log = runtime/mainnet-execution-v1/stdout.log
stderr_log = runtime/mainnet-execution-v1/stderr.log
exit_code_file = runtime/mainnet-execution-v1/exit-code.txt
```

## Important Boundary

This receipt records command execution result.

It does not invent a transaction hash.

It does not claim deployment success unless the captured logs prove it.

If no transaction hash appears in the runtime logs, the execution result must be treated as command-level only, not confirmed on-chain deployment.

## Final Statement

The execution window has been consumed by a recorded attempt.

The result is sealed for review.
