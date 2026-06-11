# Quantum Pi Forge Public Status

## Current Status

Parked. Locally auditable. Non-executing.

## Canonical Main Anchor

Latest verified public review surface anchor:

- eb73032 — Add README audit reviewer entrypoint v1 (#255)
- a997856 — Seal PR 253 post-merge governance receipt v1 (#254)
- 0c0d060 — Add root audit reviewer runbook v1 (#253)

## Reviewer Entry Points

- [AUDIT.md](./AUDIT.md) — canonical reviewer onboarding runbook
- [README.md](./README.md) — public front door with audit entrypoint
- [docs/governance/AUDIT_HARDENING_READINESS_V1.md](./docs/governance/AUDIT_HARDENING_READINESS_V1.md)
- [docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_253.md](./docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_PR_253.md)

## One-Command Local Audit

```bash
npm run audit:full-local
```

## Required Local Checks

```bash
npm run governance:readme-audit-entrypoint:v1:check
npm run governance:root-audit-runbook:v1:check
npm run governance:pr-253-post-merge:v1:check
npm run audit:full-local
```

## Execution Flags

- mainnet_cutover_approval_granted = false
- mainnet_cutover_executed = false
- deployment_executed = false
- broadcast_executed = false
- state_changing_transaction_executed = false

## Hosted CI Posture

Hosted GitHub Actions may fail due to platform, billing, runner, or environment drift. Hosted CI success is not claimed as canonical proof.

Local deterministic verification, committed receipts, and verifier scripts remain the canonical reviewer surface.

## Reviewer Conclusion

The expected conclusion is not production readiness. The expected conclusion is that Quantum Pi Forge is parked, non-executing, locally verifiable, and ready for deeper external review.
