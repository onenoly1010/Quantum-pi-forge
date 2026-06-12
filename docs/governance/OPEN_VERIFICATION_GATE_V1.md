# Open Verification Gate v1

## Status

This document demotes the outside reviewer from a blocking gate to an optional witness.

The Quantum Pi Forge / OINIO Soul System does not require external permission to exist. It requires deterministic proof, public verifiability, explicit operator authority, and bounded execution controls.

## Governance Shift

Previous posture:

- Outside reviewer approval was treated as a blocking dependency.
- The system could become stalled by social delay, unavailable reviewers, reputation hesitation, or consensus-seeking behavior outside the system.

New posture:

- Outside review remains welcome.
- Outside review is no longer required.
- Open Verification becomes the required truth layer.
- Mainnet execution remains parked until separately authorized by an explicit operator approval receipt.

## Proof vs Permission

The system does not wait for belief.

The system waits for verifiable conditions:

1. deterministic verification artifacts exist;
2. local verification passes;
3. public proof artifacts are available;
4. command hashes are sealed before execution;
5. execution flags remain false until explicit approval;
6. no state-changing transaction occurs without a separate affirmative mainnet cutover receipt.

## Required Gate State

The required posture for this gate is:

```txt
outside_reviewer_required = false
outside_review_welcome = true
open_verification_required = true
mainnet_cutover_approval_granted = false
mainnet_cutover_executed = false
deployment_executed = false
broadcast_executed = false
state_changing_transaction_executed = false
```

## Execution Boundary

This gate does not authorize deployment.

This gate does not authorize broadcast.

This gate does not authorize a state-changing transaction.

This gate only replaces the social reviewer bottleneck with an open verification requirement.

## Authority Model

External reviewer:

```txt
optional witness
```

Open verification:

```txt
required truth layer
```

Operator approval:

```txt
final execution authority
```

## Final Statement

The outside reviewer gate is no longer a centralized blocker.

The system remains parked, non-executing, and proof-bound.

Autonomy is not granted by a reviewer.

Autonomy is constrained by verification.
