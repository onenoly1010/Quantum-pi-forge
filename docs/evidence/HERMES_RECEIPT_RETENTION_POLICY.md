# Hermes Receipt Retention Policy

## Purpose

This policy defines which Hermes local inference artifacts may be committed as repository evidence and which artifacts must remain local/transient.

Hermes receipts prove that a local read-only Ollama inference produced a captured output bound to:

- receipt schema version
- model metadata
- input artifact SHA256
- output artifact SHA256
- timestamp
- authority boundary flags

Hermes receipts do not prove that an LLM will regenerate the same answer later. They prove that the captured local artifact existed and matched the receipt hash at verification time.

## Default Rule

Generated Hermes artifacts are local-only by default.

The following paths must not be committed automatically:

- evidence/hermes/inputs/
- evidence/hermes/outputs/
- evidence/hermes/receipts/

## Commit-Eligible Receipts

A Hermes receipt may be committed only when all of the following are true:

1. The receipt supports a named evidence claim, review packet, release, or audit trail.
2. The receipt verifies successfully with `npm run verify:receipt -- <receipt.json>`.
3. The input and output artifacts are safe to publish.
4. The receipt does not contain secrets, private keys, wallet material, tokens, credentials, private messages, or sensitive personal data.
5. The receipt is referenced from an evidence index or claim document.

## Non-Committable Receipts

A Hermes receipt must remain local/transient when it is:

- a smoke test
- a development/debug run
- an exploratory prompt
- duplicate evidence
- generated from private or sensitive input
- not attached to a named evidence claim

## Authority Boundary

Committed Hermes receipts must preserve the read-only authority boundary:

- readOnly: true
- noPosting: true
- noWalletSigning: true
- noDeployment: true
- noChainMutation: true

Any receipt that weakens or omits this boundary is invalid for repository evidence.

## Retention Levels

### Local transient

Used for smoke tests and local debugging. These artifacts may be deleted after verification.

### Local retained

Used for private operator review. These artifacts may stay on the local machine but are not committed.

### Repository evidence

Used for public audit, release, claim verification, or reviewer-facing proof. These artifacts must be indexed.

## Required Index Entry

Any committed Hermes receipt must be linked from an index entry containing:

- evidence id
- receipt path
- input SHA256
- output SHA256
- related claim or release
- verification command
- commit SHA

## Cleanup

Local transient artifacts may be removed with:

`rm -rf evidence/hermes/inputs evidence/hermes/outputs evidence/hermes/receipts`

## Current Status

As of this policy, Hermes receipt generation and verification are supported on main.

The repository does not automatically retain generated Hermes artifacts.
