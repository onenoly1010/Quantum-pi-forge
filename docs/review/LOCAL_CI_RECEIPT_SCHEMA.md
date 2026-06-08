# Local CI Receipt Schema v1

## Purpose

This document defines a deterministic local CI receipt for Quantum Pi Forge review checks.

Hosted CI can fail for reasons unrelated to the repository payload, including billing locks, restricted runners, missing secrets, fork restrictions, or unavailable hosted log artifacts.

A local CI receipt records what was run locally, what commit it ran against, what exit code returned, and which review files were hashed.

## Authority Boundary

A local CI receipt proves only local execution.

It does not prove:

- GitHub Actions passed
- branch protection was satisfied
- reviewer approval was granted
- deployment occurred
- wallet authority was granted
- chain mutation authority was granted
- governance or funding authority was granted

Core invariant:

Authenticity != Authority

## Receipt Fields

The receipt records:

- schema name
- UTC timestamp
- repository root
- branch
- commit
- git status
- command argv
- command exit code
- Node version
- npm version
- Git version
- platform
- selected file SHA256 hashes
- explicit authority boundary flags

## Output

The generated receipt is written to:

receipts/local-ci/latest.json

## Verification

Run:

npm run local-ci:receipt

or:

node scripts/local-ci-receipt.cjs -- npm run review:static-boundary
