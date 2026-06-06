# QPF-HERMES-RECEIPT-REPLAY-v1

## Claim

Hermes local inference receipts can be structurally verified against a committed receipt schema before any replay or trust claim is accepted.

## Scope

This claim covers schema-level validation only.

It does not authorize:
- live posting
- wallet signing
- token minting
- staking
- deployment
- governance execution
- chain mutation

## Verification target

- `evidence/hermes/schemas/receipt-v1.schema.json`

## Required invariant

A valid Hermes receipt must declare:
- schema version
- receipt ID
- bound evidence ID
- local model provider/name
- input SHA-256
- output SHA-256
- timestamp
- explicit read-only authority boundary

## Status

Drafted for Hermes Receipt Replay Verification lane.
