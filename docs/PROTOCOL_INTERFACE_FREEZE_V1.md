# Protocol Interface Freeze v1

This document defines the frozen protocol surface for Quantum Pi Forge.

The purpose of this freeze is to let reviewers evaluate the system through
verifiable interfaces rather than interpretation, philosophy, or intent.

A valid Quantum Pi Forge state is one that preserves the frozen interfaces,
passes local verification, and does not perform forbidden mutations.

## 1. Frozen Interfaces

The following interfaces are treated as protocol surfaces for v1. Changes to
these surfaces require an explicit version bump.

### Evidence Index

The evidence index is the canonical map from claims to local evidence.

A valid evidence index must remain locally verifiable and must not depend on
remote services, wallet state, funding availability, or live chain access in
order to prove its local contents.

### Claim Map

The claim map is the canonical list of reviewable claims.

A valid claim must remain bounded by its evidence. Claims that are not backed
by evidence must be marked as partial, pending, informational, or non-normative.

### Receipt Format

Receipts are local proof artifacts.

A valid receipt must be generated from local evidence and must not require
remote mutation, wallet signing, or live chain execution.

### Verification Command

The reviewer verification path must remain local-first.

A valid verification command must return success only when the frozen evidence,
claim, receipt, and authority boundaries remain coherent.

### Authority Boundaries

No external process, agent, chain endpoint, wallet provider, AI model, hosted
service, or automation runner has authority to mutate protocol state without
human-controlled local verification and explicit approval.

## 2. Mutable Interfaces

The following surfaces may change without breaking the protocol freeze, provided
they do not alter frozen outputs or authority boundaries.

- Non-normative documentation
- README wording
- Experimental branches
- Local-only Hermes prompt tuning
- Non-authoritative logs
- Draft reviewer notes
- Future implementation prototypes

Artifacts not referenced by the evidence index are informational only.

## 3. Forbidden Mutations

The following actions are outside the v1 protocol boundary.

- Autonomous wallet signing
- Autonomous token minting
- Autonomous governance execution
- Autonomous live chain mutation
- Autonomous posting to public channels
- Remote write access to the claim map
- Treating hosted CI, RPC availability, or funding state as required for local proof

Any implementation that performs these actions without explicit human approval
is outside the frozen protocol surface.

## 4. Failover State

Quantum Pi Forge is local-first.

If 0G, RPC endpoints, hosted CI, external APIs, wallet providers, or funding
systems are unavailable, the system remains reviewable in local-only mode.

Disconnected mode may produce pending-sync evidence, but disconnected operation
does not invalidate local proof.

Upon reconnection, remote state may be compared against local evidence. For the
local node, local evidence remains the source of truth unless a human-approved
protocol update says otherwise.

## 5. Reviewer Test

A reviewer should be able to evaluate protocol coherence without accepting the
project worldview.

The reviewer question is:

> Does the frozen interface pass local verification without forbidden mutation?

If yes, the protocol surface is coherent for v1.
