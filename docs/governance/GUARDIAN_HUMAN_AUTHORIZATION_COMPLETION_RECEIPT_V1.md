# Guardian Human Authorization Completion Receipt v1

## Status

HUMAN_AUTHORIZATION_COMPLETION_RECEIPT_PREPARED.

This document is a template for the completed receipt that the human operator must seal after filling out the authorization template. It is not the filled receipt itself.

## When this receipt is sealed

This receipt is sealed only after:
1. The human has completed the authorization receipt template with real values.
2. The human has confirmed all required fields are accurate.
3. The human has explicitly chosen AUTHORIZED, REJECTED, or NEEDS_CORRECTION.
4. The human has restated Safe, chain, target, value, payload hash, and governance intent alignment.
5. The human has confirmed recovery-only and no hidden financial actions.

## Required fields in completed receipt

1. authorizationDecision: AUTHORIZED | REJECTED | NEEDS_CORRECTION
2. guardianSafeAddress: 0x-address
3. chainName: string
4. chainId: positive integer
5. payloadTarget: 0x-address
6. payloadValue: string (hex or decimal)
7. payloadHash: 0x-hephex string
8. payloadSummary: string
9. governanceIntentAlignment: string
10. recoveryOnlyAssertion: true
11. noHiddenFinancialActionAssertion: true
12. humanOperator: name/handle or governance role
13. timestamp: ISO 8601

## Explicit non-authorization

This completed receipt does not by itself authorize signing, broadcast, deployment, minting, staking, liquidity, bridge activity, token transfer, approvals, allowances, private key access, seed phrase handling, or downstream gate advancement.

Even with AUTHORIZED decision, a separate signature recovery completion receipt is still required.
