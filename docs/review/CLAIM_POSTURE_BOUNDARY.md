# Claim Posture Boundary

This document clarifies how reviewers should interpret older deployment, activation, DEX, staking, oracle, governance, and mainnet-facing language during the sealed public review phase.

## Current Review Status

Quantum Pi Forge is in a sealed public review phase.

During this phase, documentation does not authorize:

- runtime activation
- wallet signing
- deployment expansion
- contract deployment
- contract mutation
- token transfer
- staking activation
- governance execution
- oracle activation
- autonomous agent operation

## Legacy or Forward-Looking Language

Some older documents, examples, deployment guides, site copy, or archived operational notes may contain terms such as:

- deploy
- active
- live
- sign
- transaction
- staking
- yield
- oracle
- broadcast
- mainnet
- activation

Unless a claim is tied to current evidence, commits, hashes, test output, or explorer references, it should be treated as one of:

1. historical context,
2. draft planning,
3. illustrative example,
4. archived operational material, or
5. a review target requiring proof.

## Reviewer Rule

The controlling review boundary is:

- docs/STATIC_REVIEW_SAFETY_NOTE.md
- README.md
- evidence/INDEX.md
- evidence/receipt.json
- evidence/claim-map.json
- evidence/snapshot.json

The canonical local proof command is:

```bash
npm run verify:evidence
```

If older language conflicts with the current evidence bundle, claim map, receipt, snapshot, or static-review boundary, the current evidence bundle controls.

## Required Future Cleanup

Public-facing or reviewer-facing files should avoid unqualified operational claims unless they include:

Claim:
Evidence file:
Commit SHA:
Artifact hash:
Test command:
Test result:
Explorer URL, if applicable:
Review status:
