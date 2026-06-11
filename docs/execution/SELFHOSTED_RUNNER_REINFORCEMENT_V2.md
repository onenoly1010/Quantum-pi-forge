# Self-Hosted Runner Reinforcement v2

## Status

Prepared execution reinforcement lane.

## Purpose

This lane defines the next bounded move away from GitHub-hosted runner dependency and toward a self-hosted execution surface for Quantum Pi Forge verification.

## Context

GitHub-hosted checks have repeatedly failed before repository logic executes.

Observed hosted-runner failure pattern:

- runner_name == ""
- steps_count == 0
- hosted job conclusion == failure
- repository steps do not execute
- local verifiers remain green

This lane does not claim a new self-hosted PASS yet.

This lane prepares the reinforcement target and defines what must be observed before a future PASS receipt may be sealed.

## Reinforcement target

The self-hosted runner replacement path should prove:

1. The runner accepts a queued job.
2. The runner executes repository checkout.
3. The runner executes Node 22.
4. The runner executes local verification scripts.
5. The runner produces visible logs.
6. The runner result can be independently recorded.
7. Hosted GitHub billing/platform failure is no longer the authority boundary for execution truth.

## Required proof before PASS

A future PASS receipt must include:

- runner provider
- runner label
- run identifier
- commit SHA
- workflow name
- job name
- visible step execution
- verifier output
- final conclusion
- timestamp
- link or copied log excerpt, if available

## Boundary

This receipt is not a live runner PASS.

This receipt is not a merge override.

This receipt is not a claim that GitHub-hosted checks are repaired.

This receipt only prepares the next self-hosted runner reinforcement path.

## Current invariant

github_hosted_failure_authoritative == false  
selfhosted_reinforcement_prepared == true  
future_pass_requires_visible_steps == true  
future_pass_requires_verifier_output == true  

## Result

Prepared.
