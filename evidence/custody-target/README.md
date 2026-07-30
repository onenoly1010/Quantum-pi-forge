# OINIO Custody Target Evidence

## Purpose

This directory holds read-only simulation evidence for OINIO custody transfer candidates.

No files in this directory authorize any on-chain transaction.

## Current Status

No custody target has been selected or verified.

The active posture is temporary freeze per `evidence/contract-authority/OINIO_CUSTODY_POLICY_FRAMEWORK.md`.

## When to Add Files Here

Add a file to this directory after completing all of the following:

1. A custody target address has been defined (hardware-wallet-backed EOA).
2. The target address has been verified as accessible and controlled.
3. The target address has been confirmed to work on 0G chainId `16661`.
4. A read-only `transferOwnership(target)` simulation has been run and its output captured.

## Naming Convention

Files added here should follow the pattern:

```
CUSTODY_TARGET_SIMULATION_<ISO8601Z>.txt
```

or

```
CUSTODY_TARGET_VERIFICATION_<ISO8601Z>.md
```

## Authority Boundary

Files in this directory are read-only evidence only.

They do not authorize:

- wallet signing
- token minting
- ownership transfer
- renounceOwnership
- any contract mutation
- seed or private key deletion or exposure
