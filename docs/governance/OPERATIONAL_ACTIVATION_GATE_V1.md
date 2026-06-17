# OPERATIONAL_ACTIVATION_GATE_V1

**Status:** Sealed Baseline
**Canonical Commit:** `1d3b478`
**Date:** 2026-06-17
**Phase:** REVIEW-READY (Execution Blocked)

## Purpose
This document establishes the explicit governance gate for transitioning from the sealed security scaffold into external review and eventual controlled activation.

It serves as the single source of truth for reviewers and operators:
- The repository is frozen at the security scaffold baseline.
- No operational execution, funding, liquidity provisioning, or wallet actions are authorized.
- All future work must begin from this documented state.

## What Activation Means (Defined Scope)
Activation under this gate refers strictly to public reviewer handoff and validation.

It does not include:
- Wallet migration or funding
- 0G deployment continuation
- DEX liquidity actions
- Any on-chain broadcasts or token movements

Future activation steps, including funding preparation or liquidity readiness, require a separate explicit follow-on gate with full evidence verification.

## What Remains Explicitly Blocked
- Unsafe or old compromised wallet usage
- Any funding from untrusted sources
- Liquidity provisioning or approvals without verified balances
- Any transaction broadcast without explicit operator approval
- All execution paths outside the sealed scaffold

## Evidence Required Before Any Future Activation
1. `npm run verify:evidence` passes cleanly.
2. Repository state is clean.
3. Canonical head remains `1d3b478`, or any successor is explicitly approved through a new gate.
4. Wallet and security receipts remain valid and uncompromised.
5. Reviewer and security rollup package remains intact and auditable.

## Review Entrypoint
Reviewers should start here:
- `docs/governance/OPERATIONAL_ACTIVATION_GATE_V1.md`
- Security rollup and audit artifacts linked from the sealed scaffold
- Full repository state at commit `1d3b478`

## Next Steps After Merge
1. Merge this gate document.
2. Freeze the repository again.
3. Conduct external or public review.
4. Only after successful review and explicit approval, open a subsequent gate for operational steps.

**No execution is authorized from this gate.**

## Approval Block
- Operator: ________________________ Date: ________
- Reviewer Sign-off: ________________ Date: ________
