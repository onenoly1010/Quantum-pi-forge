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

`identity_id` is a content-addressed identifier.

### 3.1 Derivation (Step B)

Independent implementations MUST produce the same `identity_id` for the same identity object as follows:

1. Start from a JSON-safe clone of the identity object (`JSON.parse(JSON.stringify(identity))`).
2. Remove these excluded fields if present:
   - `identity_id` — derived; must not feed itself
   - `created_at` — the only wall-clock field in the Step A schema
3. Canonicalize the remaining body with existing QPF JCS (`canonicalize` / `canonicalizeToBytes` in `src/verification/canonical.js`, encoding `jcs-rfc8785`).
4. SHA-256 the canonical UTF-8 bytes with existing `digestSha256` in `src/verification/hash.js`.
5. Prefix the lowercase hex digest:

```text
identity_id = "qpfid0:" + sha256_hex(canonicalize(stable_body))
```

Implementation: `src/verification/identity-id.js` (`deriveIdentityId`).  
Golden vector: `tests/verification/identity-id.test.js`.

This does not change Level 0 verification, `canonical.js`, or `hash.js` semantics. Derivation does not create a Genesis artifact and does not validate epistemic claims.

`canonical_artifact.digest` uses the existing SHA-256 digest shape. The schema validates its representation; it does not calculate or verify the digest.

### 3.2 Evidence binding (Step C)

An identity object is verified as a normal **artifact file**. Bind it with existing machinery only:

```text
identity JSON file
  ├── identity_id = qpfid0:…          (stable body; Step B)
  └── file SHA-256                     (stored bytes; Level 0 target)
        │
        ├── originating receipt        quantum-pi-forge-receipt/v1
        ├── verifyLevel0               evidence_binding + result_id
        └── buildPackageManifest       qpfpkg0:
```

`identity_id` and the Level 0 artifact digest are **not** the same string. The bind layer records both. Implementation: `src/verification/identity-bind.js`.

A bind `pass` means: the file matches the receipt **and** the declared `identity_id` matches `deriveIdentityId`. It does **not** authorize Genesis, merge, deploy, wallet, or economic action. No `qpf.lineage.v1` graph is introduced.

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
