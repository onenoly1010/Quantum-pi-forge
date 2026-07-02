# Guardian Human Authorization Receipt Template v1

## Status

HUMAN_AUTHORIZATION_RECEIPT_TEMPLATE_PREPARED.

This template does not authorize signing or broadcast. It defines the exact fields a human operator must complete before Guardian recovery execution can even be considered.

## Required human-completed fields

1. Authorization decision: AUTHORIZED, REJECTED, or NEEDS_CORRECTION.
2. Guardian Safe address.
3. Chain name.
4. Chain ID.
5. Payload target address.
6. Payload value.
7. Payload hash.
8. Payload summary.
9. Governance intent alignment statement.
10. Confirmation that the payload is recovery-only.
11. Confirmation that there is no hidden token transfer, mint, staking, liquidity, bridge, deployment, approval, or allowance action.
12. Human operator name/handle or governance role.
13. Timestamp.

## Explicit non-authorization

This template is blank by default. Until completed and separately sealed by the human operator, it authorizes nothing.

No wallet signing, Safe confirmation, broadcast, deployment, minting, staking, liquidity, bridge activity, token transfer, approvals, allowances, private key access, seed phrase handling, or downstream gate advancement is authorized by this template.
