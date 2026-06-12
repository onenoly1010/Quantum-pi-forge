# PR 285 Post-Merge Governance Receipt v1

## Purpose

This receipt seals the normal post-merge state for PR 285, which added the v2 funder outreach manifest v1.

The receipt exists to prove that the outreach manifest landed on canonical main through the normal merge path and that the local governance verifier stack plus build remained green after merge.

## Canonical merge anchor

- PR: #285
- Merged artifact: v2-funder-outreach-manifest-v1
- Canonical branch: main
- Post-merge commit: 72aa780d0ce5547c6e8c5c5126319a60e75ecce0
- Post-merge short commit: 72aa780
- Post-merge subject: Add v2 funder outreach manifest v1 (#285)
- Post-merge commit date: 2026-06-11T22:37:34-06:00
- Receipt generated at: 2026-06-12T04:38:17.191Z

## Verified post-merge posture

The system remains parked in a bounded, non-executing governance state after PR 285.

Required false flags:

- mainnet_cutover_approval_granted == false
- mainnet_cutover_executed == false
- deployment_executed == false
- broadcast_executed == false
- state_changing_transaction_executed == false
- investment_offer_created == false
- token_sale_created == false
- guaranteed_return_promised == false
- funder_execution_authority_granted == false

Required true flags:

- outreach_manifest_created == true
- outreach_manifest_merged == true
- post_merge_receipt_created == true
- local_governance_verifiers_green == true
- local_build_green == true

## Boundary statement

PR 285 does not create an investment offer, token sale, guaranteed return, mainnet cutover approval, deployment execution, broadcast transaction, or funder-controlled execution path.

The outreach manifest is a reusable submission and review-copy artifact only. It keeps funder review, technical review, and infrastructure-support discussion separate from execution authority.

## Status

PR 285 post-merge receipt v1 is ready for review once this receipt lane is merged through the normal PR path.
