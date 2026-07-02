# Guardian Specimen Review Decision States v1

## Status

SPECIMEN_REVIEW_DECISION_STATES_PREPARED. These are the only allowed review outcomes for a payload specimen before any human opens Safe.

This document does not authorize signing, broadcast, deployment, minting, staking, liquidity, bridge activity, token transfer, approval, allowance change, private key handling, or seed phrase requests.

## Allowed decision states

1. SPECIMEN_ACCEPTED_FOR_HUMAN_SAFE_REVIEW — specimen passed completion rules and rejection rules; human operator may open Safe for inspection, but still requires separate signing decision.
2. SPECIMEN_REJECTED — specimen failed rejection rules; must not be submitted to Safe.
3. SPECIMEN_NEEDS_CORRECTION — specimen is incomplete or ambiguous; operator must correct and resubmit for review.

## State transitions

- SPECIMEN_REJECTED and SPECIMEN_NEEDS_CORRECTION both return the specimen to the operator for correction.
- Only SPECIMEN_ACCEPTED_FOR_HUMAN_SAFE_REVIEW permits Safe inspection, but does not authorize signing or broadcast.
- No state authorizes wallet signing, broadcast, deployment, mint, staking, liquidity, bridge, token transfer, or allowance changes.

## Safety assertion

These are review states only. They do not authorize any wallet or chain action.
