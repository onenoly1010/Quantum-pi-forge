# Quantum Pi Forge Verification Protocol v1

## Status

**DRAFT — IMPLEMENTATION TARGET**

This document is the **normative design source** for the Quantum Pi Forge verification architecture.

- Implementation **MUST NOT** treat model output as authoritative.
- Implementation **MUST NOT** invent protocol semantics beyond this package.
- Layer **#11 (capability negotiation)** is **deferred** until layers 1–10 are implemented and tested.
- Freeze v1 scope before adding conceptual layers.

**Related package files:** `docs/protocol/qpf-v1/0N-*.md`, `IMPLEMENTATION_BRIEF.md`, `REPOSITORY_INSPECTION.md`

---

## Purpose

This document is the normative design source for the Quantum Pi Forge verification architecture.

The implementation MUST NOT treat model output as authoritative.

The protocol separates:

1. **Model / Agent** — probabilistic proposal  
2. **Deterministic Envelope** — authority and execution constraints  
3. **Artifact** — produced output  
4. **Receipt** — execution evidence  
5. **Attestation** — expanded provenance  
6. **Evidence Bundle** — portable evidence package  
7. **Verify Skill** — machine-facing verification interface  
8. **Trust Root / Keys** — cryptographic trust chain  
9. **Trust Policy** — contextual acceptance criteria  
10. **Verification Result** — actual verification outcome  
11. **Verification Receipt** — signed historical verification event  
12. **Governance** — final contextual decision  

---

## Fundamental Principle

```text
Intelligence may propose.

Deterministic infrastructure constrains.

Execution produces evidence.

Cryptography establishes provenance.

Verification evaluates evidence.

Trust Policy determines acceptance.

Governance makes the final decision.

No model, verifier, transport, receipt, attestation, or policy
may acquire authority outside its explicitly defined boundary.
```

---

## Layer map (v1 freeze)

| # | Layer | Spec file | Status |
| --- | --- | --- | --- |
| 1 | Receipt | [01-receipt.md](./01-receipt.md) | Normative draft |
| 2 | Attestation | [02-attestation.md](./02-attestation.md) | Normative draft |
| 3 | Evidence Bundle | [03-evidence-bundle.md](./03-evidence-bundle.md) | Normative draft |
| 4 | Verify Skill | [04-verify-skill.md](./04-verify-skill.md) | Normative draft |
| 5 | Key Lifecycle | [05-key-lifecycle.md](./05-key-lifecycle.md) | Normative draft |
| 6 | Trust Root | [06-trust-root.md](./06-trust-root.md) | Normative draft |
| 7 | Trust Policy | [07-trust-policy.md](./07-trust-policy.md) | Normative draft |
| 8 | Verification Receipt | [08-verification-receipt.md](./08-verification-receipt.md) | Normative draft |
| 9 | Verification Semantics | [09-verification-semantics.md](./09-verification-semantics.md) | Normative draft |
| 10 | Verifier Profile | [10-verifier-profile.md](./10-verifier-profile.md) | Normative draft |
| 11 | Capability Negotiation | [11-capability-negotiation.md](./11-capability-negotiation.md) | **DEFERRED** — do not invent |

Pipeline:

```text
artifact
  → receipt
  → attestation
  → evidence bundle
  → trust resolution
  → policy evaluation
  → verification semantics
  → verification result
  → signed verification receipt
  → (governance decision — outside pure crypto path)
```

---

## Architectural invariants

### MODEL / AGENT

- May propose artifacts, patches, plans, and candidate evidence.  
- **MUST NOT** be a trust root, signing authority, or governance decider.  
- **MUST NOT** override policy or verification results.  
- May appear in execution metadata only.

### DETERMINISTIC ENVELOPE

- Constrains authority and execution (read-only flags, no wallet signing, policy hashes).  
- Existing QPF patterns: Hermes authority blocks, governance gates, SCCB policy classes.

### ARTIFACT

- The produced object (file, build output, site deploy tree, model output path).  
- Content-addressed via canonical hash.

### RECEIPT

- Proves **execution conditions** for producing or observing an artifact.  
- Binds: timestamps, actor class, inputs hashes, environment claims, authority boundary.  
- Does not by itself equal trust acceptance.

### ATTESTATION

- Expands **provenance** (who/what claims, under which key, over which digests).  
- Distinct from receipt: receipt is conditions; attestation is signed claim graph.

### EVIDENCE BUNDLE

- Portable, content-addressed package of artifact digests + receipts + attestations + policy refs.  
- Offline-verifiable when trust material is local.

### VERIFY SKILL

- Machine-facing interface: request → structured verification result.  
- Fail-closed; distinguishes pass / fail / partial / unavailable.

### TRUST ROOT / KEY LIFECYCLE

- Bootstrap trust and key records (issue, rotate, revoke).  
- Models are never keys.

### TRUST POLICY

- Contextual acceptance criteria (what level is required, what roots allowed).  
- Policy evaluation ≠ governance execution.

### VERIFICATION RESULT

- Outcome of a single verification computation (ephemeral or stored).  

### VERIFICATION RECEIPT

- Persistent, preferably signed record of a verifier decision at a point in time.  

### GOVERNANCE

- Final contextual decision (merge, deploy, economic unlock).  
- **Outside** the pure verification crypto path; consumes verification results.

---

## Cryptographic requirements (v1 defaults)

| Role | Algorithm |
| --- | --- |
| Content hashing | **BLAKE3** (primary); SHA-256 may be accepted as transitional **only** if declared in profile |
| Signatures | **Ed25519** |
| Canonical encoding | **JCS** (RFC 8785) or an explicitly versioned deterministic encoder declared in the verifier profile |

Rules:

- **Never** hash ordinary non-canonical JSON when the protocol requires canonical serialization.  
- **Never** sign a mutable or ambiguously serialized representation.  
- Algorithm identifiers **MUST** appear in signed payloads and verifier profiles.

---

## Fail-closed verification outcomes

| Status | Meaning |
| --- | --- |
| `pass` | Required checks succeeded |
| `fail` | Known violation (hash mismatch, bad signature, revoked key, policy denial) |
| `partial` | Some required dimensions not evaluable or incomplete evidence |
| `unavailable` | Capability or material required for a check is not present |

Missing information **MUST NOT** automatically become cryptographic `fail` when the semantics define `partial` / `unavailable`.

Known violations **MUST** produce `fail`.

---

## Relationship to existing QPF systems

This protocol **composes** with existing machinery; it does not replace:

| Existing | Role vs protocol |
| --- | --- |
| `evidence/receipt.json`, generate/check scripts | Pre-protocol evidence receipts (SHA-256) — migration candidates |
| Hermes receipts | Execution metadata + authority boundary — map to Receipt layer |
| Governance post-merge receipts | Governance layer inputs |
| External attestation verifier | Independent human attestation — adjacent to Attestation |
| SCCB audit receipts | Operational capability audit — complementary, not trust roots |
| Capability registries (evidence vs SCCB) | Keep separate from cryptographic trust roots |

**Conflict note:** Current dominant hash is **SHA-256** via Node `crypto`. Protocol v1 prefers **BLAKE3**. Transitional dual-hash or profile-declared SHA-256 is allowed only until migration milestone completes.

---

## Non-goals (v1)

- Replacing GitHub/CF/Pi portals  
- Model-as-trust-root  
- Automatic economic unlock from a pass result  
- Inventing capability negotiation before layers 1–10 work  
- Centralized remote authority that forbids offline verification when material is local  

---

## Normative language

The key words **MUST**, **MUST NOT**, **SHOULD**, **MAY** are to be interpreted as in RFC 2119.

---

## Document control

| Field | Value |
| --- | --- |
| Version | 1.0.0-draft |
| Freeze | Layers 1–10 only for first implementation |
| Implementation entry | [IMPLEMENTATION_BRIEF.md](./IMPLEMENTATION_BRIEF.md) |
| Inspection baseline | [REPOSITORY_INSPECTION.md](./REPOSITORY_INSPECTION.md) |
