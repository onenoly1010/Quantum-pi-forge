# Self-Hosted Forgejo Runner Target v1

## Status

Prepared runner-target lane.

This document records the transition from Codeberg hosted runner targeting to the locally controlled self-hosted Forgejo runner.

## Proven Before This Lane

- forgejo-runner.service was active under the user systemd session.
- Runner name: quantum-pi-selfhosted-01.
- Runner version: v12.10.2.
- Runner labels declared by daemon: quantum-pi-selfhosted, node-22.
- Poller launched against Codeberg.
- Runner configuration used direct server.connections UUID/token configuration.
- YAML server.connections shape corrected from list to map.
- Label/cache boundary cleaned.

## Boundary

This lane does not claim that an external workflow passed.

It only changes the Forgejo workflow target so the next Codeberg run can be executed by the self-hosted runner.

## Invariants

```text
self_hosted_runner_target_configured == true
self_hosted_runner_online_precondition_observed == true
external_runner_pass_claimed == false
hosted_timeout_root_cause_claimed == false
verifier_weakened == false
```

## Next Required Evidence

A future receipt may claim external execution only if a Codeberg/Forgejo job log proves that the self-hosted runner picked up the job and completed the required workflow successfully.
