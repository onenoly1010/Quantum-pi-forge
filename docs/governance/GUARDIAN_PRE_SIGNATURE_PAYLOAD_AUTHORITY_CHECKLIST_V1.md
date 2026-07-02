# Guardian Pre-Signature Payload Authority Checklist v1

## Status

PRE_SIGNATURE_CHECKLIST_REQUIRED before any human operator opens Safe for Guardian signature recovery.

This checklist does not authorize signing, broadcast, deployment, minting, staking, liquidity, bridge activity, token transfer, private key handling, or seed phrase handling.

## Required confirmations before Safe is opened

1. Confirm the operator is using the official Safe interface only.
2. Confirm the chain/network is the intended governance chain.
3. Confirm the Guardian Safe address matches the sealed governance receipt.
4. Confirm the proposed payload is recovery-only.
5. Confirm the proposed payload has a recorded hash before signature.
6. Confirm the payload hash matches the governance intent and receipt text.
7. Confirm there is no hidden token transfer, mint, staking, liquidity, bridge, deployment, approval, or allowance change.
8. Confirm the operator, not AI automation, makes the final signing decision.
9. Confirm no private key, seed phrase, recovery phrase, or wallet secret is requested, pasted, stored, or exposed.
10. Confirm completion will require a separate post-signature recovery receipt before any downstream gate can open.

## Downstream gates remain blocked

Public mint authorization, public mint open, liquidity, staking, and bridge remain blocked until Guardian signature recovery is completed and separately sealed.

## Safety assertion

This document is inspection-only. It is not a transaction request and not an authorization to sign or broadcast.
