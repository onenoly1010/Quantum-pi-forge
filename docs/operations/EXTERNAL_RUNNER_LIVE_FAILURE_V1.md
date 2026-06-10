# External Runner Live Failure v1

## Status

Sealed external runner live FAILURE.

## Purpose

This receipt corrects the prior temporary `ABSENT` result by recording observed Codeberg / Forgejo hosted runner execution.

## Observed Run

- Runner target: Codeberg Forgejo Actions
- Workflow: `local-proof.yml`
- Job ID: `6249479`
- Result: `FAILURE`
- Runner host: `actions-tiny.aburayama.m.codeberg.org`
- Runner version: `v12.10.1`
- Container image: `ghcr.io/catthehacker/ubuntu:act-latest`
- Node: `v22.22.3`
- npm: `10.9.8`
- Evidence log: `logs/external-runner/codeberg-live-failure-6249479-20260610.txt`

## Deterministic Failure

The external runner executed far enough to prove the lane is live: task received, workflow prepared, checkout completed, Node setup completed, dependency install completed, static build completed, and evidence verification reached snapshot verification.

Failure: `canonicalCommit is not an ancestor of HEAD`.

## Truth Boundary

external_runner_executed == true

external_runner_pass == false

local_verifier_pass != external_runner_pass

## Supersession

This receipt supersedes the prior `ABSENT` classification in `EXTERNAL_RUNNER_LIVE_RESULT_V1`.

The correct live result is: FAILURE.

## Next Technical Boundary

The next repair lane should address Forgejo / Codeberg PR checkout ancestry behavior, especially detached-head or pull-request refs where `canonicalCommit` may not be an ancestor of `HEAD`.
