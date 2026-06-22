# V2 Public Reviewer Start Here v1

This page is the plain-language entrypoint for reviewers, funders, and ecosystem partners inspecting Quantum Pi Forge v2 public evidence.

## What to verify first

1. Read the public status dashboard.
2. Confirm the public status endpoint receipt.
3. Review the funder packet index.
4. Review the reviewer evidence index.
5. Confirm the pre-unpark readiness gate.
6. Run the local verification commands before trusting any claim.

## Current posture

- Public/read-only verification surface is active.
- Evidence is receipt-backed and locally verifiable.
- This document does not authorize execution.
- No wallet, private key, signing, broadcast, deploy, staking, minting, or live execution is required.

## Verification commands

```bash
npm run verify:evidence
npm run governance:v2-read-only-status-dashboard:v1:check
npm run governance:v2-public-status-endpoint:v1:check
npm run governance:v2-public-funder-packet-index:v1:check
npm run governance:v2-funder-review-packet:v1:check
npm run governance:v2-reviewer-evidence-index:v1:check
npm run governance:v2-pre-unpark-readiness-gate:v1:check
node scripts/check-mainnet-finalization-gate-v1.cjs
```

## Referenced evidence
- `reports/governance/v2-public-packet-human-readability-audit-v1.md`
- `receipts/governance/v2-public-packet-human-readability-audit-v1.json`
- `docs/public/READ_ONLY_STATUS_DASHBOARD_V1.md`
- `docs/public/status-dashboard-v1.json`
- `receipts/governance/v2-public-status-endpoint-v1.json`
- `receipts/governance/v2-public-funder-packet-index-v1.json`
- `receipts/governance/v2-funder-review-packet-v1.json`
- `receipts/governance/v2-reviewer-evidence-index-v1.json`
- `receipts/governance/v2-pre-unpark-readiness-gate-v1.json`

## Safety boundary

All irreversible actions remain outside this document.

- LIVE_EXECUTION=false
- PRIVATE_KEY_ACCESS=false
- WALLET_ACTIONS=false
- SIGNING_ATTEMPTED=false
- TRANSACTION_BROADCAST=false
- DEPLOY=false
- STAKING=false
- MINTING=false
