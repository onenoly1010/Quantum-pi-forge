# Security Remediation Status — 2026-05-31

## Repository

`onenoly1010/Quantum-pi-forge`

## Final Main Commit

`a477a97 Override root dev advisory dependencies`

## Status

All open Dependabot dependency alerts were remediated on `main`.

## Remediations Completed

- Soroban SDK upgraded to `22.0.11`.
- `audit-listener` `ws` dependency resolved to `8.21.0`.
- Root `tmp` dependency resolved to `0.2.7`.
- Root `uuid` dependency resolved to `11.1.1`.

## Verification

- Open Dependabot alerts: none returned.
- Production npm audit: `0 vulnerabilities`.
- Branch review protection restored:
  - stale review dismissal enabled
  - CODEOWNER review required
  - one approving review required

## Notes

GitHub Actions runner failures remain separate from dependency security remediation. Jobs fail before runner assignment with empty runner metadata and no executed steps.
