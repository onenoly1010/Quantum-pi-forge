# Router State Friction

This document records the current known behavior of the upstream router path used by Quantum Pi Forge integrations.

## Summary

Quantum Pi Forge treats router-side payment, balance, proxy, or provisioning failures as upstream infrastructure state unless local diagnostics prove otherwise.

A router failure does not automatically indicate a local code failure, contract failure, deployment failure, or wallet failure.

## Observed Pattern

The known failure mode is:

- Router or proxy request fails with an account, balance, payment, or provisioning error.
- Local authentication, environment loading, and direct execution paths may still verify independently.
- Local build and verification routines remain the source of truth for repository health.

## Non-Intervention Policy

Quantum Pi Forge does not attempt to bypass, mutate, spoof, or force upstream router state.

The safe operating posture is:

1. Observe the failure.
2. Record reproducible evidence.
3. Verify local configuration and deterministic build state.
4. Prefer direct, documented, non-mutating verification paths where available.
5. Stop before any wallet-signing, payment mutation, or production state change.

## Operator Guidance

Do not treat router failure as permission to:

- rotate production keys unnecessarily,
- bypass billing or account controls,
- alter contract state,
- trigger autonomous remediation,
- deploy unreviewed changes,
- or introduce hidden fallback behavior.

Router instability should be documented, isolated, and escalated through the upstream provider or platform support channel when needed.

## Current Status

The project remains in safe observer posture. Router state friction is tracked as an external integration condition, not as a protocol failure.
