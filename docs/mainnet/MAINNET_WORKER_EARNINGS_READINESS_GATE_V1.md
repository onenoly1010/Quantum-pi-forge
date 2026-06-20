# Mainnet Worker Earnings Readiness Gate v1

Status: OPEN
Mode: Human-approved mainnet earning readiness
Live earning authorization: FALSE
Wallet actions: FALSE
Private key access: FALSE
Automatic spending: FALSE
Automatic staking: FALSE
Automatic transfers: FALSE

## Purpose

Ensure all available workers are identified, checked, and prepared for live mainnet earning only when safe, funded, authorized, and bounded.

The intention is to progress toward real earning, not simulated readiness.

## Rule

No worker is allowed to earn live on mainnet until it has:

- named worker identity
- defined earning role
- confirmed network target
- confirmed wallet boundary
- confirmed funding requirement
- confirmed risk level
- confirmed operator approval
- no private key exposure
- no automatic spending without explicit approval

## Worker Inventory Categories

| Worker Lane | Purpose | Live Ready | Blocker | Next Action |
|---|---|---|---|---|
| Verification worker | Run proofs, receipts, evidence checks | no | eligibility not indexed | inventory available scripts |
| Public demo worker | Drive reviewer-safe demos | no | earning path not defined | identify monetizable surface |
| Compute worker | 0G compute / inference evidence lane | no | live earning requirements unknown | identify provider requirements |
| Storage worker | 0G storage evidence lane | no | live upload/funding gate required | map earning vs cost |
| Outreach worker | Public visibility and lead generation | no | monetization path not attached | define offer and call-to-action |
| Local AI worker | Assist planning, docs, verification | no | local-only, no direct mainnet earning | bind to operator-approved tasks |
| Funding worker | Track secured sources and gaps | no | human-entered source amounts required | update secured-source ledger |
| Vehicle readiness worker | Track vehicle purchase readiness | no | funding not secured | update vehicle budget/source ledger |

## Activation Boundary

MAINNET_WORKER_EARNINGS_LANE_ACTIVE=true
MAINNET_LIVE_EARNING_AUTHORIZED=false
MAINNET_WALLET_ACTIONS=false
MAINNET_PRIVATE_KEY_ACCESS=false
MAINNET_AUTOMATIC_SPENDING=false

## Next Required Action

Create a worker inventory report from the repository showing:

- available worker scripts
- runnable npm aliases
- existing mainnet-related gates
- blocked live actions
- candidate earning lanes
- required approval before live earning

