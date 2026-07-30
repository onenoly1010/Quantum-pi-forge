# OINIO Custody Policy Framework

## Status

Active — Temporary Freeze

## Issue Reference

Closes #114

## Verified Contract

`0xbEbC1A40A18632CeE19D220647E7aD296A1A5F37`

Network: 0G Aristotle / chainId `16661`

## Verified Owner Wallet

`0x353663cd664bB3e034Dc0f308D8896C0a242e4cd`

## Verified Balance

`962,839,002.79598073 OINIO`

## Verified Owner Powers

Read-only `eth_call` simulation confirms the owner wallet can call:

- `mint(address,uint256)`
- `transferOwnership(address)`
- `renounceOwnership()`

Non-owner calls revert.

No transaction has been signed. No contract state has been changed.

## Current Decision

Temporary freeze.

The current owner wallet remains in place while hardened custody is designed.

The prior assumption that OINIO owner authority had been burned or renounced is not supported by current evidence. Owner authority is live.

## Active Constraints

Until a custody target is fully defined and verified:

- no `mint()`
- no `transferOwnership()`
- no `renounceOwnership()`
- no ownership mutation of any kind
- no seed phrase or private key deletion
- no seed phrase or private key exposure to AI tools, scripts, websites, browser extensions, or cloud services

## Custody Options Under Review

### Option A — Keep Temporary Freeze

Maintain the current owner wallet under strict manual custody controls.

**Status: Active posture.**

### Option B — Transfer to Hardened Custody

Transfer ownership to a hardened custody target after full verification.

Possible targets:

- hardware-wallet-backed address (preferred next design path)
- multisig wallet (deferred — 0G-compatible multisig tooling must be verified first)
- dedicated cold custody wallet

**Status: Preferred next design path.**

### Option C — Permanent Renounce

Call `renounceOwnership()` and destroy owner authority permanently.

This is irreversible. It permanently removes mint authority, recovery authority, migration authority, and continuity authority.

This option must only be considered after confirming that none of those authorities are still required.

**Status: Not authorized. Do not execute.**

## Target Custody Design — Hardware Wallet First

The next custody target should be a new hardware-wallet-backed address that:

1. is generated on hardware (never in software)
2. has its seed backed up offline only
3. is never pasted into software tools, websites, browser extensions, or AI systems
4. can connect to 0G chainId `16661`
5. can receive a small test transaction for verification
6. can be verified with read-only RPC checks
7. can be used as the target in a read-only `transferOwnership(target)` simulation

## Future Multisig Note

A multisig may become the preferred long-term custody architecture if 0G-compatible multisig tooling is verified. Until then, a hardware-wallet-backed owner is the safest next step.

## Required Before Any Transfer

Before any `transferOwnership()` transaction is signed:

1. Define the custody target address.
2. Verify the target address is accessible and controlled.
3. Verify the target address works on 0G chainId `16661`.
4. Run a read-only `transferOwnership(target)` simulation.
5. Record the simulation output under `evidence/custody-target/`.
6. Open a separate execution PR.
7. Reconfirm branch protections and governance state.
8. Perform final manual review before signing.

## Evidence Boundary

This document is planning and policy only.

It does not authorize:

- wallet signing
- token minting
- ownership transfer
- renounceOwnership
- any contract mutation
- seed or private key deletion or exposure

## Related Evidence

- `evidence/contract-authority/OINIO_CURRENT_AUTHORITY_POSTURE.md`
- `evidence/contract-authority/OINIO_AUTHORITY_CORRECTION_20260602T232922Z.md`
- `evidence/custody-target/README.md`
