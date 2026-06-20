# QPF AI Treasury Policy v1

## Status
AI-assisted treasury is permitted only for proposal, analysis, receipts, and unsigned transaction preparation.

## Hard Rules
- AI must not hold seed phrases.
- AI must not hold private keys.
- AI must not sign transactions.
- AI must not move funds unilaterally.
- AI must not receive unlimited approvals.
- AI must not access cold treasury keys.
- Human operator approval is required before every spend, transfer, approval, bridge, swap, deployment, wallet action, or network broadcast.

## Wallet Roles
1. Cold Treasury: long-term custody; hardware/offline; no AI access.
2. Operations Wallet: capped working budget; human controlled.
3. AI Allowance Wallet: tiny sandbox budget; human controlled; unsigned transaction preparation only.

## Default Flags
- COLD_TREASURY_AI_ACCESS=false
- OPERATIONS_WALLET_AI_SIGNING=false
- AI_ALLOWANCE_WALLET_PRIVATE_KEY_ACCESS=false
- AI_SIGNING_AUTHORITY=false
- AI_UNILATERAL_FUND_MOVEMENT=false
- UNLIMITED_APPROVALS=false
- HUMAN_APPROVAL_REQUIRED=true

## Activation Boundary
This policy does not create a wallet, fund a wallet, sign a transaction, bridge assets, swap assets, approve contracts, deploy contracts, or broadcast network actions.
