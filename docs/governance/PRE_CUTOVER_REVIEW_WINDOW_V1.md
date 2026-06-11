# Pre-Cutover Review Window v1

## Status

Active defensive review window. Non-executing.

## Anchor

- Public review tag: `public-review-status-sealed-v1`
- Main anchor: `9de40c3`
- Window closes: `2026-06-25T23:59:59Z`

## Canonical Boundary

Quantum Pi Forge has a live public interface and public-review anchor, but the governed mainnet cutover remains parked under the sealed repository receipts. The current phase is post-merge governance, audit hardening, and external review. Hosted CI failures are outside the canonical local verification boundary.

## Execution Flags

- mainnet_cutover_approval_granted = false
- mainnet_cutover_executed = false
- deployment_executed = false
- broadcast_executed = false
- state_changing_transaction_executed = false

## Exit Criteria

1. `receipts/rcpt-cross-platform-determinism-v1.json`
2. `receipts/rcpt-external-review-attestation-v1.json`
3. `receipts/rcpt-contract-audit-prep-v1.json`
4. `receipts/rcpt-operator-approval-final-v1.json`
5. No unresolved public status or audit regressions

## Extension Path

If the review window expires before exit criteria are complete, an extension must be recorded at `receipts/rcpt-pre-cutover-review-window-extension-v1.json`. The extension must preserve `mainnet_cutover_approval_granted = false`.

## Receipt Checksum

- rcpt-pre-cutover-review-window-v1 sha256: `6d4c24f9c3e61cc9142c49a945c5e39ccb5b40f0833ba2d6c2b35a2f37145347`

## Conclusion

This receipt creates cold friction before any governed cutover. It does not authorize execution.
