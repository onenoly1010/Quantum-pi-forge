# QPF Verification & Auditability Evidence Scorecard — V1

**Scorecard Version:** V1  
**Assessment Date:** <!-- Fill: YYYY-MM-DD -->  
**Assessed By:** <!-- Fill: name or agent ID -->  
**Repository Commit Hash (pinned at assessment):** `b306e652c103750216f3c3803ac199e28417f9b9`  
**Repository:** [onenoly1010/Quantum-pi-forge](https://github.com/onenoly1010/Quantum-pi-forge)

---

## Purpose

This scorecard is the minimum defensible bar before assigning any score, percentile, or
"mature / production-ready" label on the **verification & auditability** axis.
Every item must be independently reproducible by a third party with no special access.

**Overall Gate:** Sections 1–5 must all show ✅ Pass before any maturity score or
percentile is assigned on the verification/auditability axis.

**Scoring policy:** No score is assigned while any item in Sections 1–5 remains
☐ Pending or ✗ Fail.

**Correct public posture until the gate is cleared:**
> Not rankable by conventional market metrics; assessed through its own evidence-first
> lens rather than through unsubstantiated operational claims.

---

## Section 1 — Canonical Identity Resolution

> Must be settled before any other section can be evaluated.

| # | Item | Required Evidence | Status | Evidence Link / Notes |
|---|------|-------------------|--------|-----------------------|
| 1.1 | Single authoritative repository identified by permanent commit hash / tag | Permanent tag or pinned commit hash present in this scorecard | ✅ Pass | Commit `b306e652c103750216f3c3803ac199e28417f9b9` pinned above. Tag, if any: <!-- fill --> |
| 1.2 | Explicit mapping of all historical or parallel identities, addresses, and claim surfaces to the canonical source (or marked non-authoritative / superseded) | Public document listing every known address, claim surface, or identity variant, with disposition | ☐ Pending | <!-- Fill: link to mapping document or on-chain record --> |
| 1.3 | Public statement or governance record resolving conflicting addresses, network claims, and "live vs parked" language | Statement committed to repo or published on-chain with verifiable timestamp | ☐ Pending | <!-- Fill: link to governance record --> |

**Section 1 Gate:** ☐ Pending — items 1.2 and 1.3 must be completed.

---

## Section 2 — On-chain Evidence Package

| # | Item | Required Evidence | Status | Evidence Link / Notes |
|---|------|-------------------|--------|-----------------------|
| 2.1 | Deployed bytecode matches claimed source | Explorer verification URL **or** independent compilation output showing bytecode match | ☐ Pending | <!-- Fill: explorer URL or local compilation log --> |
| 2.2 | Transaction receipts / block numbers for every claimed activation, mint, pair creation, or governance action | Block explorer links indexed by action type (one row per action) | ☐ Pending | <!-- Fill: link to receipts table or tx list --> |
| 2.3 | Network confirmed (chain ID + explorer or archive node) | Chain ID explicitly stated; independent archive node or public explorer queryable without project front-end | ☐ Pending | <!-- Fill: chain ID, explorer URL --> |
| 2.4 | Liquidity / reserves / balances shown as claimed, or gating documented | On-chain proof of balance **or** reproducible gating code with the gating mechanism itself verifiable on-chain | ☐ Pending | <!-- Fill: explorer link or gating code reference --> |

**Section 2 Gate:** ☐ Pending.

---

## Section 3 — Reproducible Verification

| # | Item | Required Evidence | Status | Evidence Link / Notes |
|---|------|-------------------|--------|-----------------------|
| 3.1 | One-command or clearly documented local verification procedure | Command is present in `package.json` and documented in README; any reviewer can run it | ✅ Pass | Available commands (from `package.json`):<br>`npm run verify:qpf:level0`<br>`npm run verify:production-funnel`<br>`npm run verify:receipt`<br>`npm run verify:evidence-index`<br>`npm run verify:capability-manifest`<br>`npm run verify:capability-registry`<br>`npm run verify:evidence-completeness`<br>`npm run verify:deployment-provenance`<br>`npm run verify:live-rpc-correspondence`<br>`npm run verify:source-identity-correspondence`<br>`npm run verify:build-artifact-manifest`<br>`npm run verify:independent`<br>`npm run verify:artifact-deployment-comparison`<br>`npm run verify:claim-map`<br>`npm run verify:evidence`<br>`npm run verify:snapshot`<br>`npm run test:verification` |
| 3.2 | Deterministic outputs (same inputs → same hashes / receipts) | Reproducibility demonstrated in CI log or local re-run with matching output | ☐ Pending | <!-- Fill: CI run URL or local log excerpt showing identical hashes across runs --> |
| 3.3 | No reliance on private keys, funded wallets, or privileged endpoints for the verification steps themselves | Verification scripts reviewed; no secret inputs, private keys, or privileged RPCs required for the verify:* commands | ☐ Pending | <!-- Fill: reviewer attestation or script audit note --> |

**Section 3 Gate:** ☐ Pending — items 3.2 and 3.3 must be completed.

---

## Section 4 — Governance & Authority Records

| # | Item | Required Evidence | Status | Evidence Link / Notes |
|---|------|-------------------|--------|-----------------------|
| 4.1 | Human-controlled merge / approval records demonstrating agent output is not treated as final authority | PR merge history, signed tags, multi-sig confirmations, or equivalent human approval records | ☐ Pending | <!-- Fill: link to PR merge receipts, signed tag list, or multi-sig records. See docs/governance/POST_MERGE_GOVERNANCE_RECEIPT_*.md for existing receipts --> |
| 4.2 | Explicit list of what remains gated (liquidity, staking, minting, upgrades, etc.) and the exact conditions required to lift each gate | Governance document listing each gate, its current state, and exact lift conditions | ☐ Pending | <!-- Fill: link to gate inventory doc (see docs/governance/ for candidate gate docs) --> |
| 4.3 | Timestamped governance artifacts that can be cross-checked against repository history | Dated records verifiable against `git log --follow` | ☐ Pending | <!-- Fill: list of governance artifacts with commit SHAs, or link to index --> |

**Section 4 Gate:** ☐ Pending.

---

## Section 5 — Negative Evidence Handling

| # | Item | Required Evidence | Status | Evidence Link / Notes |
|---|------|-------------------|--------|-----------------------|
| 5.1 | Clear documentation of what has NOT been verified or is still planned / simulated / parked | Explicit "Not Yet Verified" or equivalent section in public docs, listing each unverified claim | ☐ Pending | <!-- Fill: link to unverified-claims section. Note: AUDIT-008 is simulation only and must never appear as a real Evidence Ledger entry --> |
| 5.2 | No silent conversion of UI indicators, narrative claims, or "system status" banners into operational assertions | Audit of README, front-end status banners, and docs showing each claim is scoped accurately; no unsubstantiated operational language | ☐ Pending | <!-- Fill: audit record or reviewer attestation --> |
| 5.3 | Public inventory of known historical mismatches (addresses, networks, claim language) with resolution status | Changelog, mismatch register, or correction ledger listing each known mismatch and its current disposition | ☐ Pending | <!-- Fill: link to CORRECTION_LEDGER.md or equivalent; see docs/governance/CORRECTION_LEDGER.md --> |

**Section 5 Gate:** ☐ Pending.

---

## Section 6 — External Observability

> Section 6 is informational. It is not a blocking gate for the overall score but must be
> populated honestly.

| # | Item | Required Evidence | Status | Evidence Link / Notes |
|---|------|-------------------|--------|-----------------------|
| 6.1 | Absence or presence on major aggregators, explorers, and indexers recorded as data (not narrative) | Neutral observation of presence / absence on aggregators and explorers at time of assessment | ☐ Pending | <!-- Fill: list aggregators/explorers checked, their result (listed / not listed), and date checked --> |
| 6.2 | Independent ability to query current on-chain state without depending on the project's own front-end or APIs | Query command documented and tested (e.g., `cast call <address> <sig> --rpc-url <archive-rpc>`) | ☐ Pending | <!-- Fill: working query command and sample output, or "not yet deployable" if 2.1–2.3 are not yet cleared --> |

**Section 6 Status:** ☐ Pending (informational; does not block gate).

---

## Overall Assessment

| Section | Title | Gate Status |
|---------|-------|-------------|
| 1 | Canonical Identity Resolution | ☐ Pending |
| 2 | On-chain Evidence Package | ☐ Pending |
| 3 | Reproducible Verification | ☐ Pending |
| 4 | Governance & Authority Records | ☐ Pending |
| 5 | Negative Evidence Handling | ☐ Pending |
| 6 | External Observability (informational) | ☐ Pending |

**Overall Gate (Sections 1–5):** ☐ **NOT CLEARED** — maturity scoring or percentile
assignment on the verification/auditability axis is not yet permissible.

---

## How to Fill This Scorecard

1. Work through each item in order, starting with Section 1.
2. For each item:
   - Replace `☐ Pending` with `✅ Pass` or `✗ Fail`.
   - Fill the **Evidence Link / Notes** cell with a verifiable link, command output, or
     attestation. All evidence must be independently reproducible.
   - If an item is inapplicable, replace with `N/A` and state the reason.
3. Update the **Section Gate** line after completing all items in that section.
4. Update the **Overall Assessment** table last.
5. Commit this file and record the commit SHA in the **Assessment Commit Hash** line below.

**Assessment Commit Hash:** <!-- Fill: git SHA of the commit that records this completed scorecard -->

---

## Related Documents

- [`EVIDENCE_LEDGER.md`](../protocol/qpf-administrative-power-verification-v5-2/EVIDENCE_LEDGER.md)
- [`PROTOCOL_V5_2.md`](../protocol/qpf-administrative-power-verification-v5-2/PROTOCOL_V5_2.md)
- [`CORRECTION_LEDGER.md`](CORRECTION_LEDGER.md)
- [`CURRENT_GOVERNANCE_STATE_V1.md`](CURRENT_GOVERNANCE_STATE_V1.md)
- [`OPEN_VERIFICATION_GATE_V1.md`](OPEN_VERIFICATION_GATE_V1.md)
