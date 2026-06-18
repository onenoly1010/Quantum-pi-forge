# Active Development Reopen Gate v1

## Status

ACTIVE_DEVELOPMENT_REOPENED_FOR_NEW_BRANCH_ONLY=true
PRIOR_FREEZE_BASELINE_PRESERVED=true
UNRESTRICTED_ITERATION_ALLOWED=false

## Intent

This document opens a new bounded development lane after the prior frozen review posture.

The prior Protocol Interface Freeze v1 and Pre-Cutover Review Window v1 are not deleted, rewritten, or treated as if they never existed. They remain historical governance artifacts. This gate only authorizes new development work on an explicit branch after the frozen baseline.

## Allowed

- Create new branches.
- Add documentation.
- Add tests.
- Add dry-run scripts.
- Add local-only prototype code.
- Refactor non-executing scaffolds.
- Prepare future implementation layers behind explicit gates.

## Not Authorized

- Mainnet mutation.
- Wallet signing.
- Funding movement.
- Liquidity actions.
- Token approvals.
- Contract deployment.
- Operational activation.
- Removing or rewriting prior governance evidence.
- Claiming unrestricted live execution authority.

## Current Mode

MODE=ACTIVE_DEVELOPMENT
SCOPE=NEW_BRANCH_ONLY
LIVE_RELEASE=false
EXECUTION_AUTHORIZED=false
FUNDING_AUTHORIZED=false
WALLET_ACTIONS_AUTHORIZED=false
LIQUIDITY_AUTHORIZED=false

## Next Implementation Layer

The immediate next layer may be designed and implemented as a dry-run or local-only scaffold. Any transition from scaffold to live operation requires a separate explicit operational gate.
