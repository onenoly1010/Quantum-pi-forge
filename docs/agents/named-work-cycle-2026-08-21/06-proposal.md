# Proposal — from this cycle’s verified evidence

```text
AGENT: Proposal
ROLE: declared operating role
TASK: one bounded proposal; do not auto-execute
RESULT: EXECUTED (proposal only)
```

## Problem

Public commercial pages still sell a **$500 CAD founder certificate**, while:

- economic gates are LOCKED;
- pair reserves are **0/0**;
- locked strategy (not on `main`) and economic sovereignty gate say verification is not a paid protocol service / `LIVE_REVENUE_CLAIM=false`.

This is a **public-claim vs evidence** defect. It is not an on-chain mint defect.

## Evidence

- Live `/verification-certificate` and `/work-with-us` contain `$500` (fetched 2026-08-21).
- `deploy/verification-status-v1.json` economic: `NOT_AUTHORIZED`.
- Pair `0x2067319D…AaeE` `getReserves` = 0/0.
- PR #775 already exists but is **not** to be merged as written (strategy later refined).

## Proposed action

A **new** landing-copy GO against `e43cd55`, using the locked constellation strategy (or merge #776 first), **not** a wholesale merge of #775:

- Remove paid-certificate / invoice copy.
- State verification is not a paid protocol service.
- Keep mint/LP locked language (already accurate).
- Correct contact email if that GO includes it.

## Expected benefit

Public surface matches verified economic state; stops implying a toll booth.

## Dependencies

- Human GO for landing HTML (`deploy/**`).
- Optionally #776 strategy artifact on `main` first so copy has an internal SoR.

## Authorization required

Named landing GO. **Pages deploy** is a further GO (Cloudflare publishes `deploy/**` from `main`).

## Risks

- Merging #775 as-is would publish a cruder “INFT-agent share” sentence than the locked strategy.
- Touching `deploy/` triggers production Pages.

## Verification method

After a future GO: grep live HTML for `$500` / `invoice` = absent; “not a paid service” present; pair still 0/0.

**NOT EXECUTED:** landing edit, #775 merge, deploy.
