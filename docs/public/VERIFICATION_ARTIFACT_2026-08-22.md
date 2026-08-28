# Verification Artifact — 2026-08-22

One complete public demonstration of QPF Level 0.

```text
Artifact → Evidence → Verification → Persistent Result → Evidence Package
```

This is not a pitch. It is an inspectable object.

It does **not** authorize mint, liquidity, yield, payment, deployment, or governance.

Canonical `main` at production: `d3a7fa3b23f12c4a56024d805df895845b09573c`

---

## The four files

| Role | Path |
| --- | --- |
| **Artifact** | `docs/public/PUBLIC_VERIFICATION_DEMO_GATE_V1.md` |
| **Evidence (receipt)** | `receipts/public/prove-product-2026-08-22/receipt.json` |
| **Verification result** | `receipts/public/prove-product-2026-08-22/qpfv0-bedcd4e2abc96a0433fee195ffe5237d452c690f9c7b76285ee2a3b8a008988d.json` |
| **Evidence package** | `receipts/public/prove-product-2026-08-22/qpfpkg0-6b9d2bc9b4755641514d8efe3ca4fae5aee360e5eab08eeb7374dd04d7f82ab1.json` |

## What was verified

The existing reviewer-safe public demo gate document, already on `main`.

| Field | Value |
| --- | --- |
| Artifact SHA-256 | `3fbe8813bcd3cce2d805869d13d43d098166b5fc6de173c961bbffbb9efd7481` |
| Receipt SHA-256 | `c3d7d013651943d2a9cb9e3f4dc131b7df10b7bd1364ca254b8f77e84b8186c2` |
| Result file SHA-256 | `0a38922db0264d02272538b47f3d808b74736eea0284801e22648f850fbfb36c` |
| `result_id` | `qpfv0:bedcd4e2abc96a0433fee195ffe5237d452c690f9c7b76285ee2a3b8a008988d` |
| `package_id` | `qpfpkg0:6b9d2bc9b4755641514d8efe3ca4fae5aee360e5eab08eeb7374dd04d7f82ab1` |
| Status | **pass** (Level 0) |
| Signature | `not_applicable` (receipt does not claim one) |

`result_id` is content-addressed and excludes timestamp. `package_id` binds the three file digests. Re-running verify writes a new timestamp into a new result file, so a **new** `package_id` is expected. These committed files are the object.

## How to inspect (no wallet)

From a clone of this repository:

```bash
# 1. Artifact digest must match the receipt and the result binding
sha256sum docs/public/PUBLIC_VERIFICATION_DEMO_GATE_V1.md
# expected: 3fbe8813bcd3cce2d805869d13d43d098166b5fc6de173c961bbffbb9efd7481

# 2. Re-run Level 0 against the same two inputs (status should be pass)
npm run verify:qpf:level0 -- \
  --artifact docs/public/PUBLIC_VERIFICATION_DEMO_GATE_V1.md \
  --receipt receipts/public/prove-product-2026-08-22/receipt.json
```

Independent re-derivation of the committed IDs (this session): artifact digest match **true**, receipt digest match **true**, `result_id` re-derived **true**, `package_id` re-derived **true**.

## EXT-001 — reproduce without cloning (recommended starting point)

A frozen, self-contained evidence package lives at
`docs/outreach/EXT-001/` (branch `ext-001-publication`, merged to main).
It contains the exact artifact bytes, the receipt, the frozen result, the
derivation rules, and a standalone reproducer. No clone, no npm, no wallet:

```bash
curl -fsSLO https://raw.githubusercontent.com/onenoly1010/Quantum-pi-forge/main/docs/outreach/EXT-001/verify.py
python3 verify.py
```

Expected (also published in that folder's `manifest.json`):

```text
qpfv0:    qpfv0:44a9b8cfbcd6eb3dfc83e93b1312f4511a4d42de77cd24afcea198bb424f9db8
qpfpkg0:  qpfpkg0:54f7af2c1ab97709f0813815036bcde62bfb3165107426a0f6a952d9c97cb1c2
```

Note: `qpfv0` is timestamp-stable; `qpfpkg0` identifies the frozen package and
requires the published result file byte-for-byte (re-running Level 0 yields a
new timestamp and therefore a different, expected package id).

PASS ≠ authorization. The result lists `does_not_authorize`: governance, mainnet operator approval, deployment, financial transaction, production safety, mint, liquidity, yield, pi_payment.

## Public post copy (one thing)

```text
We said we'd build, test, document, and verify in public.

Today we're showing one concrete verification artifact.

Artifact → evidence → verification result → evidence package.

result_id:  qpfv0:bedcd4e2abc96a0433fee195ffe5237d452c690f9c7b76285ee2a3b8a008988d
package_id: qpfpkg0:6b9d2bc9b4755641514d8efe3ca4fae5aee360e5eab08eeb7374dd04d7f82ab1

The point isn't to ask you to trust QPF.
The point is to give you something you can inspect.

https://github.com/onenoly1010/Quantum-pi-forge/blob/main/docs/public/VERIFICATION_ARTIFACT_2026-08-22.md
```

Do not add mint, liquidity, payment, or “AI trust solved.”
