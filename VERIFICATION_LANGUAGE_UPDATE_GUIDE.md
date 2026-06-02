# VERIFICATION.md Language Update Guide

This document shows **proposed revisions** to soften unverifiable claims and add evidence status callouts.

Do **not** change runtime logic, configuration values, or commit references — only language precision and proof transparency.

---

## Section 1: Verified Compute Layer

### Original Language

```markdown
Direct network inference has been successfully executed and validated on public mainnet infrastructure.

- **Canonical Path:** 0G Compute Direct Provider lane is live and authoritative.
- **Mainnet Proof:** Verified on-chain authorization transaction recorded for 0G Aristotle Mainnet direct-provider inference.
- **Inference Validation:** Successful `200 OK` response from target model `deepseek-v4-flash`, including extended provider-side reasoning metadata alongside the final response payload.
- **Router Posture:** The 0G Router path is classified as non-authoritative and disabled within core configuration pending ledger/accounting sync resolution.
```

### Proposed Revision

```markdown
## 1. Verified Compute Layer

Direct network inference testing has been conducted on 0G Aristotle Mainnet infrastructure.

⚠️ **Evidence Status:** See [PROOF-INDEX.md](../PROOF-INDEX.md) § "0G Compute Direct Inference" for detailed proof tracking.

- **Canonical Path:** 0G Compute Direct Provider lane is configured as the primary execution route.
  - **Config reference:** [Code path pending — to be documented]
  - **Evidence:** 🟡 Requires code inspection of runtime configuration

- **Mainnet Inference Testing:** Testing was conducted against 0G Aristotle Mainnet endpoints.
  - **Transaction proof:** 🔴 Pending (on-chain transaction hash, block number, or explorer link required)
  - **Timestamp:** [To be documented]

- **Model Endpoint Response:** Requests were sent to model endpoint `deepseek-v4-flash`.
  - **Response evidence:** 🔴 Pending (logged response payload or sample output required)
  - **Inference metadata:** 🔴 Pending proof of extended reasoning metadata

- **Router Path Status:** The 0G Router path is disabled in configuration pending state resolution.
  - **Config reference:** [Code path pending]
  - **Reason:** Ledger and accounting state synchronization required
  - **Evidence:** 🟡 Requires code inspection to verify disablement
```

**Rationale:**
- Removed "verified" and "successfully executed" (assertions without proof)
- Softened to "testing has been conducted" (factual, verifiable)
- Added evidence status indicators (🔴 pending, 🟡 partial)
- Referenced PROOF-INDEX.md for detailed tracking
- Made proof gaps explicit to reviewers

---

## Section 3: Repository Governance Discipline

### Original Language

```markdown
## 3. Repository Governance Discipline

Branch protections are active to safeguard repository integrity.

- **Protected Branch:** `main`
- **Required Approvals:** Minimum 1 formal review per pull request.
- **Code Owners:** CODEOWNERS review enforcement is active.
- **State Controls:** Stale review dismissal and administrator enforcement are active.
```

### Proposed Revision

```markdown
## 3. Repository Governance Discipline

Branch protections are configured to safeguard repository integrity.

⚠️ **Evidence Status:** See [PROOF-INDEX.md](../PROOF-INDEX.md) § "Governance & Branch Protection" for API proof tracking.

- **Protected Branch:** `main`
  - **Evidence:** 🔴 Pending GitHub API response showing branch protection configuration

- **Required Approvals:** Minimum 1 formal review per pull request (configured).
  - **Evidence:** 🔴 Requires API response: `required_pull_request_reviews.required_approving_review_count`

- **Code Owners:** CODEOWNERS review enforcement is configured.
  - **Evidence:** 🔴 Requires API response: `require_code_owner_reviews: true`

- **Admin Enforcement:** Administrator enforcement is configured.
  - **Evidence:** 🔴 Requires API response: `enforce_admins: true`

- **Stale Review Dismissal:** Stale review dismissal is configured.
  - **Evidence:** 🔴 Requires API response showing stale review rules

**How to Verify:**
```bash
# Requires GitHub CLI or API access
gh repo view onenoly1010/Quantum-pi-forge --json branchProtectionRules
```
```

**Rationale:**
- Changed "are active" to "are configured" (more precise about what we know)
- Added explicit evidence requirements (API response format)
- Added verification command so reviewers know how to check
- Linked to PROOF-INDEX.md for centralized tracking

---

## Section 5: Local Verification Baseline

### Original Language

```markdown
## 5. Local Verification Baseline

Sovereign operations remain independently maintainable through local-first verification.

- **Toolchain:** Verified under Node `22.22.3` and npm `10.9.8`.
- **Build Integrity:** Static assets compile locally.
- **Local Surrogate CI:** Local verification remains the canonical fallback while hosted CI is unreliable.
```

### Proposed Revision

```markdown
## 5. Local Verification Baseline

Sovereign operations remain independently maintainable through local-first verification.

- **Toolchain:** Tested under Node `22.22.3` and npm `10.9.8`.
  - **Diagnostic script:** `scripts/ci-preflight-diagnose.sh`
  - **Usage:** See [OPERATIONS-INDEX.md](../docs/OPERATIONS-INDEX.md) § "Local Verification" for instructions
  - **Evidence:** 🟡 Requires script verification and documentation link

- **Build Integrity:** Static assets compile locally.
  - **How to verify:** Run `npm run build`
  - **Evidence:** 🟡 Requires build documentation in README

- **Local Diagnostic Fallback:** Local verification via `scripts/ci-preflight-diagnose.sh` is the canonical baseline while GitHub Actions hosted runners are unavailable.
  - **Status:** 🟡 Script reference requires validation and usage documentation
  - **Timeline:** Until GitHub Actions account/billing issue is resolved
```

**Rationale:**
- Changed "Verified under" to "Tested under" (more accurate about scope)
- Linked to actual diagnostic script location
- Made build verification actionable
- Added reference to OPERATIONS-INDEX.md for context

---

## Document Header Addition

**Add this section at the top of VERIFICATION.md, before § 1:**

```markdown
# Quantum Pi Forge Verification Packet

**Status:** Sealed Review Baseline  
**Current Architecture Rating:** 7.2 / 10  
**Sealed Baseline Commit:** `da1c8a3` (2026-06-02)  
**Last Verified State Commit:** `62c0a22` (historical reference)  
**As of:** 2026-06-02

---

## ⚠️ Important: Proof Status Reference

This document provides operational status and governance metrics as of commit `da1c8a3`.

**Not all claims in this document have full external proof linked yet.** See [PROOF-INDEX.md](PROOF-INDEX.md) for a detailed breakdown of proof status for all 27 claims.

**Legend:**
- ✅ **Verified** — Proof provided or clear non-claim
- 🟡 **Partially Documented** — Verifiable by code inspection or governance reference
- 🔴 **Pending** — Assertion requires external proof (logs, tx hashes, API responses, explorer links)

**For reviewers:** Use [PROOF-INDEX.md](PROOF-INDEX.md) as your checklist. Red (🔴) items are where evidence is pending.

---
```

---

## Summary of Changes

| Section | Type | Reason |
|---------|------|--------|
| Header addition | New | Transparency about proof status from the start |
| § 1 Compute Layer | Language softening | Remove "verified/successfully" → use "testing conducted" |
| § 1 claims | Callouts added | Add 🔴/🟡 evidence status indicators |
| § 3 Governance | Language softening | "are active" → "are configured"; add API requirements |
| § 5 Local Verification | Clarification | Link to scripts and documentation; make actionable |
| Throughout | Cross-references | Link to PROOF-INDEX.md for centralized tracking |

---

## Implementation Notes

### Do NOT Change

- ✋ Runtime configuration values
- ✋ Commit SHAs
- ✋ Architecture ratings (7.2 / 10, subscores)
- ✋ Non-claims section
- ✋ External limitations list

### Do Change

- ✅ Assertion language to be more precise
- ✅ Add evidence status indicators (🔴🟡✅)
- ✅ Add links to PROOF-INDEX.md
- ✅ Add verification methods (bash commands, code inspection paths)
- ✅ Soften "verified" claims pending proof

---

## Applies To

This guidance applies to **VERIFICATION.md** at the repository root.

Note: There are two other VERIFICATION.md files:
- `contracts/VERIFICATION.md` — Smart contract audit (external, keep as-is)
- `docs/VERIFICATION.md` — Deployment verification guide (external, keep as-is)

Only update the **root-level VERIFICATION.md**.

---

*This is a style guide for the cleanup PR. Use this to inform your language updates.*
