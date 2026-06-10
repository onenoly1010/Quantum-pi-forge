# External Runner Proof v1

## Status

Prepared proof boundary.

## Purpose

Prepare evidence container for proving QPF verification can execute outside GitHub-hosted CI.

## Invariants

```text
runner_log_missing != runner_pass
github_ci_blocked != execution_blocked
external_runner_receipt_required == true
external_runner_pass == autonomous_execution_evidence
local_replay_pass == deterministic_fallback_evidence
```

## Boundary

This lane does not claim a live external runner passed.

A live pass may only be claimed after attaching a real Codeberg, Forgejo, self-hosted, or local isolated runner log.

## Required Proof Fields

- runner_target
- repository_remote
- branch
- commit_sha
- workflow_or_command
- utc_timestamp
- result
- log_path_or_url
- local_replay_command
- github_hosted_ci_required
