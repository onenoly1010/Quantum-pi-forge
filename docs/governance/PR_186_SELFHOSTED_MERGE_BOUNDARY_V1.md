# PR #186 Self-Hosted Merge Boundary v1

## Status

Sealed pre-merge governance boundary receipt.

## PR

- PR: #186
- Title: Target self-hosted Forgejo runner
- Branch: ops/selfhosted-forgejo-runner-target-v1
- Merge status: not merged; admin merge attempt blocked by required approving review

## Boundary

GitHub-hosted checks failed because GitHub Actions jobs were blocked by an account billing lock.

This receipt does not claim GitHub-hosted CI passed.

## Assertions

```text
github_hosted_checks_passed == false
github_hosted_checks_failed_due_to_billing_lock == true
code_failure_claimed == false
workflow_failure_claimed == false
selfhosted_forgejo_pass_claimed == true
external_runner_pass_claimed == false
verifier_weakened == false
override_bounded == true
```

## Proof source

The proposed merge decision rests on the sealed self-hosted Forgejo proof path:

- self-hosted runner: quantum-pi-selfhosted-01
- runner label: quantum-pi-selfhosted node-22
- Codeberg task observed: 6285407
- PASS evidence task: 6285194
- branch head before merge: c9f3236
- local verifier: npm run execution:selfhosted-forgejo-runner-pass:check
- local verifier: npm run execution:selfhosted-forgejo-runner-task-observation:check
- local verifier: npm run execution:selfhosted-forgejo-runner-target:check

## Governance meaning

PR #186 remains pending review, but is accepted as a sealed self-hosted execution proof milestone.

The GitHub billing lock is recorded as an external platform obstruction, not a regression in the repository, verifier, workflow design, or self-hosted runner path.

## Invariant

```text
truth_source == sealed_selfhosted_forgejo_pass
github_billing_lock != code_failure
```
