# QPF-IVB-1 Generation Contract v1

Status: **harness contract**. This file governs fixture generation for `QPF-IVB-1`. It is not a protocol section, not a verifier, and not an amendment to `docs/protocol/qpf-v1/`.

Frozen protocol remains:

```text
docs/protocol/qpf-v1/01-receipt.md
docs/protocol/qpf-v1/02-attestation.md
docs/protocol/qpf-v1/03-evidence-bundle.md
docs/protocol/qpf-v1/04-verify-skill.md
docs/protocol/qpf-v1/05-key-lifecycle.md
docs/protocol/qpf-v1/06-trust-root.md
docs/protocol/qpf-v1/07-trust-policy.md
docs/protocol/qpf-v1/08-verification-receipt.md
docs/protocol/qpf-v1/09-verification-semantics.md
```

This contract MUST NOT change those files.

## 1. Purpose

Produce a **reproducible fixture battery** so independent implementations can later agree on the same inputs and, after audit, the same expected outcomes.

The next phase needs artifacts that can be regenerated. Conversation text and prose decisions are not those artifacts.

## 2. Authority boundary

| This contract | Is not |
| --- | --- |
| Generation / scaffolding rules for `QPF-IVB-1` | A trust root |
| Separate from any verifier | A verify skill |
| Local harness layout | A normative protocol object |
| Deferred-population gate | Authorization to mint, deploy, or unseal |

Section 05 already forbids storing private keys in Git or evidence bundles. This harness obeys that rule.

## 3. Generator vs verifier

```text
scripts/generate-ivb-fixtures.*     generator / scaffolder
(not present in this commit)        reference verifier
```

The generator MUST remain a different program from any verifier.

The generator MUST NOT:

- verify vectors and write the result into `expected/`
- invent expected traces or verdicts
- act as a substitute for an independent implementation

A reference verifier is out of scope until the VEC-001 construction plan has been audited.

## 4. What this commit may contain

Scaffolding only:

- this contract
- `fixtures/README.md`
- reserved registry file `fixtures/registry/root_keys.json` with **no key material**
- reserved vector slots `VEC-001` … `VEC-025` with empty `input/`, `meta/`, `expected/`
- reserved `fixtures/package/` with **no package hash**
- `scripts/generate-ivb-fixtures.*` as a scaffolder

Vector `meta/` MAY record harness identity (`id`, `status: scaffold`). That is not an expected verdict.

## 5. What this commit MUST NOT contain

Do not generate or commit:

- final signatures
- final private-key material
- final package hash
- fabricated expected traces or verdicts
- a reference verifier
- any modification to Sections 01–09

Those come only after the **VEC-001 construction plan** has been audited.

## 6. Directory layout is not protocol

The tree under `fixtures/` is harness structure. It does not create protocol objects and MUST NOT be read as a new normative rule.

In particular:

- Section 08 defines a **Verification Receipt** (`schema`: `qpf.verification_receipt.v1`). It does **not** define a fixture-directory file named `input/manifest.json`, and it does not say that such a file “includes the anchor.”
- Section 03 defines an Evidence Bundle field `manifest`: an ordered list of content-addressed objects `{ role, alg, digest, media_type? }`, plus `bundle_digest`. That is a field of the bundle object, not a required filename under `vectors/*/input/`.

If a later audited construction plan places protocol objects on disk, their names and fields follow Sections 01–09 (and later unfrozen sections if any), not this directory tree.

Do not add `input/manifest.json` as a required harness file unless the protocol actually specifies that filename.

## 7. Reserved vector slots

`VEC-001` through `VEC-025` are reserved.

`VEC-001` is the first construction target. Do not populate its cryptographic contents before the construction plan is audited.

Empty `expected/` directories exist so later audited oracles have a place to live. They are not a license to fabricate Section 09 statuses (`pass` / `fail` / `partial` / `unavailable`) or codes.

## 8. Registry and package

`fixtures/registry/root_keys.json` is a reserved registry slot. In this commit it MUST be unpopulated (`keys` empty). It is not a Section 06 trust root.

`fixtures/package/` is reserved for a later battery package. In this commit it MUST NOT contain a package hash or signed package.

## 9. Allowed generator behavior (v1)

The generator MAY:

- create missing directories and placeholder files listed in §4
- report which slots are still unpopulated
- refuse forbidden flags

The generator MUST NOT:

- generate Ed25519 key pairs for commit
- sign receipts, attestations, or verification receipts
- compute a final package hash
- write `expected/` verdicts, traces, or Section 09 codes
- import or wrap `src/verification` as if it were this battery’s reference verifier

## 10. Freeze

Work under this contract is **scaffold-only** until an audited VEC-001 construction plan exists.

No change whatsoever to frozen Sections 01–09.
