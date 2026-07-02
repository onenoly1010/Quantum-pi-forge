# Guardian Specimen Rejection Rules v1

## Status

SPECIMEN_REJECTION_RULES_PREPARED. These rules define criteria for rejecting a payload specimen BEFORE any human opens Safe.

This document does not authorize signing, broadcast, deployment, minting, staking, liquidity, bridge activity, token transfer, approval, allowance change, private key handling, or seed phrase requests.

## Rejection criteria

A payload specimen MUST be rejected if ANY of the following are true:

1. chainName is empty or does not match a recognized governance network.
2. chainId is missing, non-numeric, or does not match the chainName.
3. guardianSafeAddress is missing, not 0x-prefixed, or not a valid address length.
4. targetAddress is missing, not 0x-prefixed, or not a valid address length.
5. payloadSummary is empty or describes financial action (transfer, mint, stake, liquidity, bridge).
6. payloadHash is missing, not 0x-prefixed, or not hex.
7. value is non-zero and not separately authorized by governance receipt.
8. recoveryOnlyAssertion is not exactly "true".
9. noHiddenFinancialActionAssertion is not exactly "true".
10. operatorConfirmedNoKeysExposed is not exactly "true".
11. Any field contains what appears to be a private key, seed phrase, recovery phrase, or wallet secret.

## Post-rejection requirement

Rejected specimens must not be submitted to Safe. Operator must correct the specimen and re-validate against completion rules before any signing decision.

## Safety assertion

These rules define rejection criteria only. They do not authorize any wallet or chain action.
