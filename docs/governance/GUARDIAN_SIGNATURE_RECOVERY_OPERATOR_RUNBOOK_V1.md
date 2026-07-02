# Guardian Signature Recovery Operator Runbook v1

## Status

SIGNATURE_RECOVERY_REQUIRED remains the active blocker.

This runbook does not authorize wallet signing, token transfer, deployment, minting, staking, liquidity, or bridge activity. It defines the human-only checklist required before any Guardian Safe signing or execution flow can be considered.

## Human-only requirements

1. Confirm the correct Guardian Safe address from sealed governance receipts.
2. Confirm the correct chain and network in the Safe interface.
3. Confirm the transaction payload is recovery-only and matches the sealed governance intent.
4. Confirm there is no token transfer, liquidity action, staking action, bridge action, public mint opening, or deployment hidden in the payload.
5. Confirm the operator understands that ChatGPT/local AI must not sign, broadcast, hold keys, request seed phrases, or execute wallet actions.
6. Confirm the final signing decision is made only by the human operator inside the official Safe/wallet interface.

## Blocked downstream gates

Public mint authorization, public mint open, liquidity, staking, and bridge remain blocked until Guardian signature recovery is completed and separately sealed by receipt.

## Safety assertion

No private key, seed phrase, wallet secret, signing request, token transfer, liquidity action, staking action, bridge action, mint action, or deployment is authorized by this runbook.
