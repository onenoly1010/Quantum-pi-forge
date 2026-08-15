# QPF Verification Protocol v1 — Repository Inspection

**Mode:** Inspection only — **no protocol implementation** performed in this session.  
**Repository:** `/home/kris/Quantum-pi-forge` (GitHub `onenoly1010/Quantum-pi-forge`)  
**Branch (inspection packaging):** `docs/qpf-verification-protocol-v1`  
**Note:** `~/forge/Quantum-pi-forge` is a separate Codeberg clone (older `main`); packaging is on the GitHub-tracking tree used for recent QPF work.  
**Date:** 2026-08-08  

Protocol package created under `docs/protocol/qpf-v1/` (specs + brief). Runtime code under `src/verification/` remains empty by design.

---

## 1. Existing relevant components

| Component | Location | Relevance |
| --- | --- | --- |
| Evidence index + receipt | `evidence/INDEX.md`, `evidence/receipt.json` | Proto evidence binding |
| Evidence receipt generate/check | `scripts/generate-evidence-receipt.cjs`, `check-evidence-receipt.cjs` | Digest binding (SHA-256) |
| Hermes receipts | `scripts/hermes-write-receipt.cjs`, `verify-hermes-receipt.cjs` | Execution receipt + authority envelope |
| Independent verification | `docs/evidence/INDEPENDENT_VERIFICATION_V1.md`, `verify:independent` | Read-only verification culture |
| External attestation verifier | `docs/governance/EXTERNAL_ATTESTATION_VERIFIER_V1.md` + scripts | Independent human attestation gate |
| Post-merge governance receipts | `docs/governance/POST_MERGE_*`, many `verify-pr-*-post-merge-*.cjs` | Governance decision records |
| Deployment / contract verification | `docs/VERIFICATION.md`, `scripts/verification/*` | On-chain deploy assertions (different plane) |
| Capability registries | `deploy/capability-registry-v1.json`, `docs/ai/CAPABILITY_REGISTRY.md`, SCCB caps | **Not** crypto trust roots — keep separate |
| Evidence completeness / claim maps | `scripts/generate-evidence-*.cjs`, claim-map verifiers | Project evidence inventory |
| SCCB audit receipts | `sccb/src/audit/` (on `feat/sccb-v1` if merged) | Operational capability audit |
| Light client “canonical head” | `src/light-client/canonical-head-do.ts` | Chain state canonicality — not JCS |

---

## 2. Existing hashing / signature infrastructure

| Capability | Status |
| --- | --- |
| SHA-256 | **Widespread** via Node `crypto.createHash('sha256')` in receipt/evidence scripts |
| BLAKE3 | **Not** present as a first-class dependency in root `package.json` inspection |
| Ed25519 | **Not** unified as protocol signing (no standard key store / verify module for QPF receipts) |
| JCS / deterministic JSON | **Not** established for receipt signing |
| cosign / supply-chain | Scripts such as `cosign-sign.sh` exist for other purposes — not protocol receipt path |

**Implication:** Milestone 1–2 must introduce canonical encoding + BLAKE3 (+ Ed25519) **without** breaking existing SHA-256 evidence scripts; dual-support via verifier profile is the migration path.

---

## 3. Existing receipt / evidence infrastructure

### Strengths

- Strong culture of **committed receipts** and **local-first verification** (`AUDIT.md`, independent verification).  
- Hermes receipts include **authorityBoundary** (read-only, no wallet signing, etc.) — maps cleanly to Deterministic Envelope.  
- Evidence receipt binds **indexSha256** to files on disk (drift detection).  
- Many gate-specific verifiers produce PASS/FAIL text suitable for evolution into semantic codes.

### Gaps vs protocol

| Gap | Detail |
| --- | --- |
| No unified Receipt schema | Multiple ad hoc JSON shapes (`qpf-evidence-receipt-v1`, `hermes-receipt-v1`, governance JSON) |
| No Attestation object | External attestation is GitHub-issue-bound, not portable signed attestation |
| No Evidence Bundle manifest | Index + files approximate a bundle without content-addressed role manifest |
| No Verify Skill API | Hundreds of `npm run verify:*` entrypoints |
| No Verification Receipt | Governance receipts are process records, not signed verifier decisions |
| Hash algorithm | SHA-256 only in main path |
| Signing | Generally unsigned JSON |

---

## 4. Existing governance infrastructure

| Element | Role |
| --- | --- |
| `docs/governance/*` gates and receipts | Human/process control of activation, mint, PR merge boundaries |
| Guardian approval concepts | Human yes/no for high-risk decisions |
| Economic LOCKED gates | Separate from crypto verification — **must stay** outside verify skill |
| AI `AUTHORIZATION_WORKFLOW.md` | Process policy for agents |

**Invariant:** A cryptographic `pass` **MUST NOT** auto-execute governance (mint, deploy, Pi, economics).

---

## 5. Conflicts with this protocol

| Conflict | Severity | Resolution approach |
| --- | --- | --- |
| SHA-256 vs BLAKE3 default | Medium | Profile dual-hash transitional; new objects BLAKE3 |
| Unsigned receipts as “proof” | Medium | Treat existing as weak receipts; new schema optional signature |
| “Verification” means deploy checks | Low | Namespace: protocol verify vs chain deploy verify |
| Capability registry name collision | Low | Keep evidence / SCCB / AI registries separate from trust keys |
| Model metadata in Hermes | Low | Allowed as metadata; never as trust root |
| Parallel frameworks risk | High if ignored | Reuse scripts; implement new code only under `src/verification` |

---

## 6. Missing components (protocol-shaped)

1. Canonical serialization module  
2. BLAKE3 + Ed25519 utilities  
3. JSON Schemas under `schemas/qpf/v1/`  
4. Receipt / attestation / bundle validators  
5. Trust root + key lifecycle store  
6. Trust policy parser/evaluator  
7. Unified verify interface + semantics codes  
8. Verifier profile  
9. Signed verification receipts  
10. Golden **test vectors** under `tests/verification/vectors/`  
11. Capability negotiation — **explicitly deferred**  

---

## 7. Proposed file-level implementation plan

```text
src/verification/
  canonical.js          # M1 — JCS or declared encoder
  hash.js               # M2 — blake3 (+ sha256 transitional)
  sign.js               # M2/M7 — ed25519 sign/verify
  receipt.js            # M3 — parse/validate/hash/sign receipt
  policy_binding.js     # M4
  attestation.js        # M5
  bundle.js             # M6
  keys.js               # M7–M8
  trust_root.js         # M7
  trust_policy.js       # M9
  semantics.js          # M10
  verify.js             # M11
  profile.js            # M12
  verification_receipt.js # M14
  pipeline.js           # M15
  cli.js                # M18

schemas/qpf/v1/*.schema.json   # with each milestone

tests/verification/
  canonical.test.js
  hash.test.js
  receipt.test.js
  ...
  vectors/**            # M16 ongoing
```

**Do not** invent `11-capability-negotiation` implementation until M1–M12 pass.

**Do not** modify economic gates, Pi, mint, or production deploy paths as part of verification milestones.

---

## 8. Test strategy

1. **Unit tests** per milestone (node:test or existing runner).  
2. **Golden vectors** with fixed keys (test-only Ed25519 fixtures — never production keys).  
3. Negative vectors: one-byte artifact change → `ARTIFACT_HASH_MISMATCH`.  
4. Cross-check: two independent implementations later MUST match vectors.  
5. Regression: existing `npm run verify:evidence-index` / receipt check **remain green** (no forced rewrite).  
6. Fail-closed: missing evidence → `partial`/`unavailable` not false `pass`.

---

## 9. First implementation milestone

### Milestone 1 — Canonical serialization **only**

**Goal:** Deterministic bytes for a JSON object suitable for hashing/signing.

**In scope:**

- `src/verification/canonical.js` (or `.mjs` matching repo module style)  
- Tests proving key order / whitespace independence  
- Document encoding id (`jcs-rfc8785` or interim declared encoder if JCS lib unavailable — must be explicit)

**Out of scope:**

- BLAKE3, Ed25519, receipts, schemas beyond minimal if needed for tests  
- Capability negotiation  
- Governance / SCCB / deploy changes  

**Exit criteria:**

- Tests pass  
- Same logical object → identical canonical bytes  
- Report files changed + test results  
- **Stop** — wait for human go for Milestone 2  

---

## Explicit non-actions of this packaging session

- No verification pipeline code implemented  
- No real keys generated for production  
- No schemas claimed complete  
- No capability negotiation invented  
- No economic / Pi / deploy changes  

---

## Recommended next human instruction to coding agent

```text
Read docs/protocol/qpf-v1/QPF_VERIFICATION_PROTOCOL_V1.md
and docs/protocol/qpf-v1/IMPLEMENTATION_BRIEF.md
and docs/protocol/qpf-v1/REPOSITORY_INSPECTION.md.

Implement Milestone 1 only (canonical serialization).
Smallest coherent change + tests.
Do not proceed to Milestone 2.
```
