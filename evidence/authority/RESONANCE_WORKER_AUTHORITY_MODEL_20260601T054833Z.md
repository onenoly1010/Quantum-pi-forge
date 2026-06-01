# Resonance Worker Authority Model

**Timestamp UTC:** 20260601T054833Z  
**Repository:** Quantum-pi-forge  
**Branch:** evidence/direct-compute-shadow-node22  
**HEAD:** 472559a9612c9e6d7613ed5069844c01f2968ac6

## Authority Principle

The Resonance Worker is not authorized by personal trust.

It is authorized only by evidence, public review, explicit policy, and cryptographic/runtime controls.

## Current Authorized State

The Resonance Worker is authorized only for:

- dry-run execution
- evidence generation
- local observation
- hash/report creation
- mainnet-shadow analysis

The Resonance Worker is not authorized for:

- autonomous execution
- wallet signing
- transaction submission
- mainnet writes
- fund movement
- contract mutation
- bypassing pull-request review
- bypassing branch protection

## Who Can Authorize What

### Evidence-only local operation

A local operator may run the worker as an evidence witness only.

This does not grant write, signing, deployment, or transaction authority.

### Repository policy recognition

Repository-level recognition requires:

- pull request
- public review
- required approving reviewer with write access
- code-owner review where required
- merge through protected main

### Mainnet-capable operation

Mainnet-capable operation requires a separate future authorization process:

- merged governance policy
- explicit activation PR
- successful dry-run evidence
- reviewed runtime flags
- signer or multisig approval
- no pending safety objections
- clear rollback path

## Current Decision

No one has authorized autonomous Resonance Worker execution.

The only currently valid role is:

**Local AI evidence witness.**

## Conclusion

The Resonance Worker remains mainnet-aware, not mainnet-authorized.
