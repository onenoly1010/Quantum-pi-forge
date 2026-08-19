# QPF Verifiable AI Identity Artifact v1

## Status

Step A/B specification. This document defines the `qpf.identity.verifiable-ai.v1` artifact type and its deterministic identity identifier. It does not create an OINIO Genesis artifact and does not change Level 0 verification behavior.

## 1. Scope

A verifiable AI identity is an artifact type that sits above the existing QPF verification stack. QPF supplies existing artifact canonicalization, receipts, verification results, evidence binding, and package machinery; identity does not introduce a parallel verifier, receipt grammar, or canonicalizer.

The identity scope is `knowledge_body`. It is not a legal person, biological person, or assertion of human equivalence. A Level 0 verification pass does not establish that an identity is Kris, human-authored, or authorized to perform economic or wallet actions.

## 2. Normative identity fields

The schema requires `spec`, `protocol_version`, `identity_id`, `name`, `purpose`, `identity_scope`, `authority`, `epistemic`, `lineage`, and `canonical_artifact.digest`.

## 3. Content-addressed identity ID — Step B

`identity_id` is derived exactly as:

`qpfid0:` + SHA-256(UTF-8 bytes of `canonicalize(stable_identity_projection)`).

The stable identity projection is the complete identity object with exactly two fields removed:

- `identity_id` — the derived identifier itself;
- `created_at` — wall-clock metadata and therefore non-deterministic.

No other identity field is excluded. Existing QPF `canonicalize()` / `canonicalizeToBytes()` is the canonicalization authority (`jcs-rfc8785`). Existing QPF SHA-256 hashing is used. The derivation implementation is `src/verification/identity-id.js`.

The resulting identifier MUST match `^qpfid0:[0-9a-f]{64}$`.

This makes identity IDs reproducible across implementations that reproduce the stated canonicalization and hashing rules. Golden vectors in `tests/verification/identity-id.test.js` pin the result independently of the implementation under test.

## 4. Epistemic semantics

Identity epistemic state is separate from Level 0 pass/fail:

| State | Meaning |
| --- | --- |
| `DECLARED` | Object or claim is declared without sufficient receipt-bound evidence. |
| `UNVERIFIED` | Evidence is insufficient or unavailable. |
| `VERIFIED` | The relevant artifact/evidence binding has a Level 0 pass. |
| `ATTRIBUTED` | Attribution is supported by separate attribution evidence. |
| `DERIVED` | The claim is supported by a derivative artifact and lineage link. |
| `UNKNOWN` | The state cannot presently be established. |

`VERIFIED` never means human-authored. Human authorship is represented separately by `epistemic.human_authorship` and must not be inferred from a digest match.

## 5. Authority and agency boundaries

The identity constitution explicitly denies authority over legal personhood, human equivalence, QPF chain designation, economic activation, and self-granted permissions. Agency permissions, when present, are descriptive references to existing authorization classes, not a new permission engine.

## 6. Lineage and immutability

Identity evolution is append-only at the artifact level: each new version is a new artifact with a new digest; sealed history is immutable; parent/genesis links are digest references; and lineage conflicts are a review condition, not a silent overwrite.

Step B does not validate lineage. That remains a later gate.

## 7. OINIO Genesis boundary

No Genesis artifact is created by Steps A/B. The future OINIO Genesis artifact remains intentionally absent until separately authorized.

## 8. Explicit non-scope

Steps A/B do not authorize or implement evidence/identity binding, identity verification integration, Genesis, `/api/verify` publication, deployment, chatbot or memory-store integration, minting, liquidity, staking, bridge, wallet, or economic actions.
