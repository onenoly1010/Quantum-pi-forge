# Self-Hosted Runner Live PASS v2

## Status

Sealed live execution PASS.

## Subject

Self-hosted runner live attempt v2.

## Result

PASS.

## Runner evidence

- Provider: Codeberg / Forgejo Actions
- Runner: quantum-pi-selfhosted-01
- Runner version: v12.10.2
- Task ID: 6293717
- Workflow: Selfhosted Runner Live Attempt v2
- Job: selfhosted-runner-live-attempt-v2
- Event: push
- Run ID: 4657637
- Run number: 19
- Commit SHA: c902c8b4942991969f74fd05f4829006abe8f3ee
- Ref: refs/heads/ops/selfhosted-runner-live-attempt-v2
- Image: node:22-bookworm
- Node: v22.22.3
- npm: 10.9.8
- Final conclusion: Job succeeded

## Executed verification surface

The self-hosted runner executed visible workflow steps and produced logs for:

- repository checkout
- Node/npm version check
- dependency installation
- npm run build
- npm run autonomous:dry-run-output-hygiene:v1:check
- npm run autonomous:supervised-dry-run:v1:check

## Verifier output

- PASS dry-run-output-hygiene-v1
- PASS supervised-autonomous-dry-run-v1
- PASS selfhosted-runner-live-attempt-v2 workflow steps executed

## Boundary

This receipt claims only self-hosted runner execution PASS for the bounded workflow.

This receipt does not claim GitHub-hosted runner repair.

This receipt does not claim full autonomous network operation.

This receipt does not claim Telegram/X publishing.

This receipt does not claim unsupervised autonomous posting.

## Sovereign execution invariant

github_hosted_authoritative == false  
selfhosted_runner_authoritative == true  
visible_steps_executed == true  
verifier_output_recorded == true  
final_conclusion_succeeded == true  

## Conclusion

The Quantum Pi Forge self-hosted runner path has produced a live execution PASS with visible task, runner, commit, verifier, and conclusion evidence.
