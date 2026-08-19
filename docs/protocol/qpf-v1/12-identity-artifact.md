# QPF Verifiable AI Identity Artifact v1

## Status

Step A specification only. This document defines the `qpf.identity.verifiable-ai.v1` artifact type and its schema. It does not create an OINIO Genesis artifact and does not change Level 0 verification behavior.

## 1. Scope

A verifiable AI identity is an artifact type that sits above the existing QPF verification stack. QPF supplies existing artifact canonicalization, receipts, verification results, evidence binding, and package machinery; identity does not introduce a parallel verifier, receipt grammar, or canonicalizer.

The identity scope is `knowledge_body`. It is not a legal person, biological person, or assertion of human equivalence. In particular, a Level 0 verification pass does not establish that an identity is Kris, human-authored, or authorized to perform economic or wallet actions.

## 2. Normative identity fields

The smallest viable Step A schema requires:

- `spec`: `qpf.identity.verifiable-ai.v1`
- `protocol_version`: `1`
- `identity_id`: `qpfid0:<64 lowercase hexadecimal characters>`
- `name`
- `purpose`
- `identity_scope`: `knowledge_body`
- `authority.does_not`
- `epistemic`
- `lineage`
- `canonical_artifact.digest`

The schema also defines optional machine-readable fields for knowledge boundaries, controller references, agency permissions, governance references, evolution rules, creation time, canonical path, and claim-level epistemic state.

## 3. Content addressing

`identity_id` is a content-addressed identifier. Its intended derivation is:

`qpfid0:` + SHA-256(canonicalize(stable identity body excluding `identity_id` and wall-clock-only fields).

Step A specifies this relationship but does not implement identity-ID derivation. Existing QPF canonicalization semantics remain unchanged. Derivation and golden-vector testing belong to Step B.

`canonical_artifact.digest` uses the existing SHA-256 digest shape. The schema validates its representation; it does not calculate or verify the digest.

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

Claims may carry their own epistemic state and an evidence-package reference. A claim marked `VERIFIED` means the bound evidence package supports that claim under the existing QPF verification model; it does not establish human identity or authorship.

## 5. Authority and agency boundaries

The identity constitution explicitly denies authority over:

- legal personhood;
- human equivalence;
- QPF chain designation;
- economic activation; and
- self-granted permissions.

Agency permissions, when present, are descriptive references to existing authorization classes. They are not a new permission engine. The design baseline permits `observe` and `report` as autonomous examples while keeping merge, deploy, wallet, and external representation human-gated.

## 6. Lineage and immutability

Identity evolution is append-only at the artifact level:

- each new version is a new artifact with a new digest;
- sealed history is immutable;
- `parent_digest` and `genesis_digest` are digest links, not display names;
- `ancestors` and `derivatives` contain digest references;
- a genesis artifact does not maintain a mutable children list;
- lineage conflicts are a review condition, not a silent overwrite.

Step A defines the structural fields only. Parent/genesis digest validation belongs to Step E.

## 7. OINIO Genesis boundary

No Genesis artifact is created by Step A.

The previously proposed future location `identities/oinio/genesis.json` remains intentionally absent until later authorization. No twin receipt under `receipts/identity/` is created by Step A.

## 8. Explicit non-scope

Step A does not authorize or implement:

- changes to `verifyLevel0` or any Level 0 verifier;
- identity-ID derivation code;
- fixture identity artifacts or originating receipts;
- epistemic verification tests;
- lineage verification;
- OINIO Genesis;
- `/api/verify` publication;
- chatbot or memory-store integration;
- minting, liquidity, staking, bridge, wallet, or economic actions;
- deployment or merge authorization.

Those are separate gates in the A–F sequence and require their own authorization.
