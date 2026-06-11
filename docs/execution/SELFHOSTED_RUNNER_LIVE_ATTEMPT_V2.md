# Self-Hosted Runner Live Attempt v2

## Status

Live attempt prepared and dispatched target defined.

## Target

- Provider: Codeberg / Forgejo Actions
- Runner: quantum-pi-selfhosted-01
- Required labels:
  - quantum-pi-selfhosted
  - node-22
- Branch: ops/selfhosted-runner-live-attempt-v2
- Workflow: .forgejo/workflows/selfhosted-runner-live-attempt-v2.yml

## Purpose

Attempt actual self-hosted execution without relying on GitHub-hosted runners.

## Boundary

live_runner_pass_claimed == false  
github_hosted_authoritative == false  
full_autonomous_execution == false  
visible_runner_evidence_required == true  

## PASS requirements

A future PASS receipt may only be sealed if the operator observes and records:

1. Runner identity.
2. Run ID or task ID.
3. Commit SHA.
4. Visible workflow steps.
5. Node version output.
6. Verifier output.
7. Final workflow conclusion.
8. Timestamp.
9. Log excerpt or durable link.

## Current result

Attempt lane prepared.

No live PASS is claimed by this document.
