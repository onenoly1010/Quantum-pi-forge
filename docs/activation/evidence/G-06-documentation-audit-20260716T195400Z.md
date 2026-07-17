# G-06 Documentation Audit — Evidence

**Timestamp (UTC):** 2026-07-16T19:54:00Z  
**HEAD:** `ce275b81f54d4f166a17f7fac8ffa67f0c937435` (+ uncommitted G-05 matrix/evidence after)

## Classification standard in force

| Source | Role |
| --- | --- |
| `docs/review/VERIFICATION_STATUS_TABLE_V1.md` | Feature SSOT (Verified / Implemented but gated / Experimental / Planned) |
| `docs/review/CLAIM_TO_PROOF_MATRIX.md` | Reviewer vocabulary |
| `docs/review/PUBLIC_SURFACE_CLAIM_AUDIT_V1.md` | Public surface audit |
| `docs/valuation/QPF_GRANT_PARTNER_OUTREACH_KIT_V1.md` | Outreach language lock |

## Forbidden-phrase scan (targeted)

Paths: `deploy/what-it-does.html`, `README.md`, `STATUS.md`, outreach kit.

Hits were **only** in the outreach kit **as forbidden examples / checklists** (mentions of 47M, immutable forever, strongest) — not as positive claims.

No “now live on 0G” in those paths after claim-hygiene commit.

## Residual documentation risk

| Item | Status |
| --- | --- |
| Dual contract address sets (docs vs broadcast) | **Material** — G-05 evidence; public docs may still cite docs set |
| `DEPLOYED_ADDRESSES.md` | Updated with RPC truth (this session; may be uncommitted) |
| Historical receipts citing docs set | Archive/context; not auto-rewritten |

## Gate decision

**PASS (scoped)** — classification system present; locked outreach; no active forbidden superlatives on scanned primary surfaces.

**Residual:** reconcile dual address references across historical docs without rewriting history; point new public copy at G-05 matrix.
