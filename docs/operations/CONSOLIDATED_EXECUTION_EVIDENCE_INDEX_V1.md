# Consolidated Execution Evidence Index v1

## Status

Sealed evidence index.

## Purpose

Single reviewer-facing map for the current QPF execution and governance receipt chain.

## Receipt Chain

| PR | Receipt | Status | Commitment |
|---:|---|---|---|
| #175 | Post-merge governance receipt | sealed | temporary override bounded and review protection restored |
| #176 | Autonomous execution receipt | sealed | GitHub-hosted CI is not the protocol; local deterministic fallback preserved |
| #177 | External runner proof boundary | sealed | external runner pass may not be claimed without a real runner log |
| #178 | External runner live-log absence | sealed | no live external runner pass log found; no false pass claimed |

## Active Invariants

```text
temporary_override != governance_removal
github_ci_blocked != execution_blocked
runner_log_missing != runner_pass
prepared_receipt != live_runner_pass
live_log_absent != live_runner_pass
local_workflow_log != external_runner_pass
```

## Current Execution Truth

The current system proves local deterministic execution and receipt verification.

The current system does not claim a live Codeberg, Forgejo, self-hosted, or local-isolated external runner pass.

## Next Valid Step

A future live external-runner receipt must attach a real external runner log before claiming external runner success.

## Final Rule

Reviewers may evaluate the receipt chain without accepting any false hosted-CI or external-runner claim.
