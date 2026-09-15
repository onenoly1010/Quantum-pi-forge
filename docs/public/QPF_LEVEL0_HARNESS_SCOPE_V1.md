# QPF Level 0 Verification Harness — Scope Statement v1

**Spec:** `quantum-pi-forge-verify/v1` (Level 0)
**Status:** Published harness scope. Documentation and canon only.
**Authority:** This document defines the claim surface for the Level 0 harness. It does
not authorize mint, liquidity, staking, yield, wallet signing, deployment, broadcast, or
any governance decision.

Canonical posture row: `V-08` in
[`VERIFICATION_STATUS_TABLE_V1.md`](../review/VERIFICATION_STATUS_TABLE_V1.md).

---

## 1. Why this document exists

The harness is being published so that other builders can run it themselves rather than
take the project's word for anything. That only works if the boundary of the claim is
stated as precisely as the claim. The limitation below is the point of the artifact, not
a disclaimer attached to it.

QPF today can prove *"this receipt does not bind this artifact."*
QPF today cannot prove *"the dashboard is wrong."*

Those are different claims at different levels, and this harness makes only the first.

---

## 2. What Level 0 proves

Level 0 answers a single, closed question: **does a receipt actually bind the bytes it
claims to describe, and can an independent party re-derive the same identity for that
answer?**

| Property | What is established |
| --- | --- |
| Artifact digest binding | The SHA-256 of the supplied artifact bytes matches the digest recorded in the receipt |
| Receipt structure | The receipt carries the structural fields the spec requires |
| Receipt→artifact binding | The receipt's declared artifact path resolves to the artifact under verification |
| Canonical form | The result is serialized under JCS (RFC 8785), so key order cannot change the identity |
| Result identity | `result_id` (`qpfv0:…`) is derived from the stable result fields, excluding `timestamp`, so re-verification of the same inputs yields the same identity |
| Package identity | `package_id` (`qpfpkg0:…`) binds `result_id` to the artifact, receipt, and result-file digests |
| Non-authorization | Every result carries an explicit `does_not_authorize` list |

Level 0 is **network-neutral by construction**: it reads bytes and a receipt. It has no
RPC client, no chain awareness, and no notion of which ecosystem an artifact came from.

## 3. What Level 0 does **not** prove

Level 0 is silent on all of the following. Absence of a finding here is not evidence of
correctness.

| Not proven | Why |
| --- | --- |
| Attestation validity | TEE quote and attestation-chain validation is Level 1; it is **not implemented** |
| Signature validity | A receipt that claims no signature is reported `not_applicable`, not `verified` |
| Chain state | No RPC, no block, no transaction, no finality is consulted |
| Consensus or execution correctness | Nothing is re-executed; only digests are compared |
| Dashboard or metric truthfulness | A divergence between a self-reported metric and raw execution proof is a Level 1 claim |
| Provenance | That the artifact is what its author says it is, or came from where they say |
| Semantic correctness | The artifact's contents are never interpreted, only hashed |
| Trust or policy decisions | Trust roots and policy evaluation are Level 1+; **not started** |
| Authorization | A `pass` is evidence about an artifact, never permission to act on it |

Milestone status is tracked in [`src/verification/README.md`](../../src/verification/README.md).
Level 1+ attestation, trust, and policy are recorded there as **not started**. Any claim
requiring those layers is out of scope until that row changes.

---

## 4. Reproduce the published identifiers

Fixed golden inputs, offline, no wallet, no RPC:

```bash
npm run verify:external:v1
```

The `T2-B` test re-derives these identifiers from
`external-verification/v1/fixtures/t2b-golden/`:

```text
result_id   qpfv0:1a22882678a3b5b4a1dbf70f5adf28f34e2fff41a95e81acc639774bfa15930a
package_id  qpfpkg0:a507b07f2baeb7a88fdf2e539c0b76015a3638b58ec3433a0dd297d2e725be00
```

If you get different values from the same fixture set, the harness is wrong and that is a
reportable finding.

`T0` and `T1` require network access and report `BLOCKED` — not `FAIL` — when a public
endpoint or RPC is unreachable. An unreachable dependency is an absence of evidence, and
the suite is required to say so rather than infer a verdict.

Suite semantics: [`external-verification/v1/README.md`](../../external-verification/v1/README.md).

---

## 5. Bring your own artifact (local, no permission required)

Nothing needs to be sent anywhere. Point the CLI at any file and a receipt describing it.

Write a receipt for your artifact:

```json
{
  "spec": "quantum-pi-forge-receipt/v1",
  "receipt_id": "my-receipt-001",
  "artifact": {
    "path": "my-artifact.bin",
    "type": "artifact",
    "digest": { "alg": "sha256", "hex": "<sha256 of my-artifact.bin>" }
  },
  "produced_at": "2026-01-01T00:00:00.000Z"
}
```

Verify it:

```bash
npm run verify:qpf:level0 -- \
  --artifact my-artifact.bin \
  --receipt my-receipt.json \
  --cwd /path/to/your/files
```

Behaviour:

| Case | `status` | Exit code |
| --- | --- | --- |
| Digest matches the receipt | `pass` | `0` |
| Artifact bytes altered after the receipt was written | `fail` with `ARTIFACT_HASH_MISMATCH` | `1` |

Run it twice on the same inputs: `result_id` is identical, because `timestamp` is excluded
from the identity. That reproducibility is the entire proof point.

Request and result shapes are schema-pinned:
`schemas/qpf/v1/verify-request.schema.json`, `schemas/qpf/v1/verify-result.schema.json`.

---

## 6. Reading a result honestly

- `pass` means the receipt binds the artifact. It does not mean the artifact is safe,
  correct, authentic, or approved.
- `fail` means the binding is broken. It does not identify who broke it or why.
- `BLOCKED` means the harness could not obtain what it needed to conclude. It is not a
  negative finding, and must not be reported as one.
- `verified ≠ authorized`. Verification establishes evidence about a defined artifact;
  governance decides whether that evidence authorizes an action.

---

## 7. Out of scope for this publication

The following are explicitly **not** part of this harness drop and require separate
artifact scope, evidence, review, and authorization:

- A hosted endpoint that accepts artifacts submitted by others.
- Any published finding characterising a third party's live network, testnet, dashboard,
  or self-reported metric.
- Any statement about Pi Network interoperability beyond the `Planned` rows already in the
  status table.

**Version:** v1
**Next review trigger:** Level 1 attestation, trust, or policy implementation; any change
to `result_id` or `package_id` derivation; any change to the golden fixture set.
