# Guardian Payload Specimen Intake v1

## Status

PAYLOAD_SPECIMEN_REQUIRED before any Guardian Safe signing decision.

This intake is text-only. It does not open Safe, request a signature, broadcast a transaction, deploy contracts, mint, stake, add liquidity, bridge, transfer tokens, approve allowances, access private keys, or request seed phrases.

## Required specimen fields

Before any human signing decision, the operator must record:

1. Chain/network name.
2. Chain ID.
3. Guardian Safe address.
4. Proposed transaction target address.
5. Proposed transaction calldata or payload summary.
6. Proposed payload hash.
7. Value field, if any.
8. Confirmation that value is zero unless separately authorized by governance.
9. Confirmation that the payload is recovery-only.
10. Confirmation that there is no token transfer, mint, staking, liquidity, bridge, deployment, approval, or allowance action hidden in the payload.

## Downstream gates remain blocked

Public mint authorization, public mint open, liquidity, staking, and bridge remain blocked until Guardian signature recovery is completed and sealed by a separate completion receipt.

## Safety assertion

This document is an intake checklist only. It is not an authorization to sign or broadcast.
