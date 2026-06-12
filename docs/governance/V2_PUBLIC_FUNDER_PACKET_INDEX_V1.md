# V2 Public Funder Packet Index v1

## Purpose

This index is the stable public entry point for the Quantum Pi Forge v2 funder review packet, outreach manifest, receipts, public endpoints, and local verifier commands.

It is a navigation artifact only. It does not create new execution authority, funding authority, investment terms, token sale terms, or deployment approval.

## Canonical anchor

- Repository: https://github.com/onenoly1010/Quantum-pi-forge
- Canonical branch: main
- Canonical commit: c88b903f72512621e1774f26cdfbf4c655cf53b2
- Canonical short commit: c88b903
- Commit subject: Seal PR 285 post-merge governance receipt v1 (#286)
- Commit date: 2026-06-11T22:41:25-06:00
- Index generated at: 2026-06-12T04:47:00.382Z

## Start here

A reviewer or funder should start with these files in order:

1. Funder review packet: https://github.com/onenoly1010/Quantum-pi-forge/blob/main/docs/governance/V2_FUNDER_REVIEW_PACKET_V1.md
2. Funder outreach manifest: https://github.com/onenoly1010/Quantum-pi-forge/blob/main/docs/governance/V2_FUNDER_OUTREACH_MANIFEST_V1.md
3. Funder packet receipt: https://github.com/onenoly1010/Quantum-pi-forge/blob/main/receipts/governance/v2-funder-review-packet-v1.json
4. Outreach manifest receipt: https://github.com/onenoly1010/Quantum-pi-forge/blob/main/receipts/governance/v2-funder-outreach-manifest-v1.json
5. PR 283 post-merge receipt: https://github.com/onenoly1010/Quantum-pi-forge/blob/main/docs/governance/PR_283_POST_MERGE_GOVERNANCE_RECEIPT_V1.md
6. PR 285 post-merge receipt: https://github.com/onenoly1010/Quantum-pi-forge/blob/main/docs/governance/PR_285_POST_MERGE_GOVERNANCE_RECEIPT_V1.md

## Raw review links

 - Raw funder review packet: https://raw.githubusercontent.com/onenoly1010/Quantum-pi-forge/main/docs/governance/V2_FUNDER_REVIEW_PACKET_V1.md
 - Raw outreach manifest: https://raw.githubusercontent.com/onenoly1010/Quantum-pi-forge/main/docs/governance/V2_FUNDER_OUTREACH_MANIFEST_V1.md
 - Raw funder packet receipt: https://raw.githubusercontent.com/onenoly1010/Quantum-pi-forge/main/receipts/governance/v2-funder-review-packet-v1.json
 - Raw outreach manifest receipt: https://raw.githubusercontent.com/onenoly1010/Quantum-pi-forge/main/receipts/governance/v2-funder-outreach-manifest-v1.json
 - Raw PR 283 receipt: https://raw.githubusercontent.com/onenoly1010/Quantum-pi-forge/main/receipts/governance/pr-283-post-merge-governance-receipt-v1.json
 - Raw PR 285 receipt: https://raw.githubusercontent.com/onenoly1010/Quantum-pi-forge/main/receipts/governance/pr-285-post-merge-governance-receipt-v1.json

## Public endpoints

These are public review surfaces, not as execution claims:

- https://quantumpiforge.com
- https://quantumpiforge.com/reviewer
- https://quantumpiforge.com/governance
- https://quantumpiforge.com/api/health
- https://quantumpiforge.com/api/skill
- https://quantumpiforge.com/api/search

If an endpoint is unavailable, reviewers should treat repository evidence and local deterministic verifiers remain canonical.

## Local verification commands

Run these from the repository root:

```bash
npm run governance:v2-funder-review-packet:v1:check
npm run governance:v2-funder-outreach-manifest:v1:check
npm run governance:pr-283-post-merge:v1:check
npm run governance:pr-285-post-merge:v1:check
npm run build
```

## Review posture

The public funder packet remains in a bounded, non-executing governance posture.

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

- funder_review_packet_created == true
- funder_review_packet_merged == true
- outreach_manifest_created == true
- outreach_manifest_merged == true
- public_funder_packet_index_created == true
- local_verifier_path_available == true

## Approved framing

Use these terms:

- public funder packet index
- technical review packet
- grant review packet
- governance evidence packet
- non-executing review posture
- audit and infrastructure support scope

Do not use these terms:

- token sale
- investment offer
- guaranteed return
- mainnet launch approval
- deployment approval
- funder-controlled execution

## Reviewer ask

Reviewers are asked to evaluate clarity, evidence quality, governance boundary strength, verifier reproducibility, and whether the funding-support scope is separated clearly from execution authority.

Technical feedback is preferred over endorsement.

## Status

v2-public-funder-packet-index-v1 is ready for review once merged through the normal PR path.
