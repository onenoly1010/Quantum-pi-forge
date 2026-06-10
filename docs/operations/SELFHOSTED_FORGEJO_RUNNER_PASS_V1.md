# Self-Hosted Forgejo Runner PASS v1

## Status

Sealed external self-hosted Codeberg/Forgejo runner PASS.

## Proven Facts

- Runner: `quantum-pi-selfhosted-01`.
- Runner version observed in job log: `v12.10.2`.
- Codeberg task id: `6285194`.
- Job: `proof`.
- Event: `push`.
- Branch: `ops/selfhosted-forgejo-runner-target-v1`.
- Commit: `d792c6895b2284a10b27bfb88dd7f3109318af44`.
- Runtime image: `node:22-bookworm`.
- Node version: `v22.22.3`.
- npm version: `10.9.8`.
- Dependency install completed.
- Dependency audit reported `found 0 vulnerabilities`.
- Static build completed.
- Reviewer canon grep checks passed.
- Forgejo proof receipt emitted with `"status": "completed"`.
- Job ended with `Job succeeded`.

## Boundary

This receipt proves a real external self-hosted Codeberg/Forgejo workflow PASS for the Forgejo local proof workflow.

This does not claim that GitHub-hosted checks passed.

GitHub-hosted check failures remain separate platform/environment noise and are not the source of this PASS claim.

## Invariants

```text
external_selfhosted_runner_execution == true
external_selfhosted_runner_pass == true
codeberg_task_id == 6285194
runner_name == quantum-pi-selfhosted-01
commit == d792c6895b2284a10b27bfb88dd7f3109318af44
github_hosted_checks_pass_claimed == false
hosted_runner_root_cause_claimed == false
verifier_weakened == false
```
