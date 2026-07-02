# Guardian Specimen Completion Rules v1

## Status

SPECIMEN_COMPLETION_RULES_PREPARED. These rules define validation criteria for a completed payload specimen before any human opens Safe.

This document does not authorize signing, broadcast, deployment, minting, staking, liquidity, bridge activity, token transfer, approval, allowance change, private key handling, or seed phrase requests.

## Validation rules

A payload specimen is complete only when ALL of the following are true:

1. chainName is non-empty and matches a recognized governance network.
2. chainId is a positive integer matching the chainName.
3. guardianSafeAddress is a valid 0x-prefixed address.
4. targetAddress is a valid 0x-prefixed address.
5. payloadSummary is non-empty and describes what the transaction does.
6. payloadHash is a non-empty 0x-prefixed hex string.
7. value is "0" or "0x0" unless separately authorized by governance.
8. recoveryOnlyAssertion is exactly "true".
9. noHiddenFinancialActionAssertion is exactly "true".
10. operatorConfirmedNoKeysExposed is exactly "true".

## Post-validation requirement

Even with a complete specimen, no Safe signing, broadcast, deployment, mint, staking, liquidity, bridge, token transfer, approval, or allowance action is authorized until Guardian signature recovery is completed and sealed by a separate completion receipt.

## Safety assertion

These rules define validation criteria only. They do not authorize any wallet or chain action.
