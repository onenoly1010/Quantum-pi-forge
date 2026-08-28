# EXT-001 — Public Reproduction of a QPF Verification Identity

**Status:** frozen. Contents must not change; any change invalidates the published
identities below. This is an outreach/product evidence package. It is **not**
VEC-001 and does not claim anything about VEC-001/E2.

## 1. What is being verified

That the raw bytes of OpenZeppelin `contracts/access/Ownable.sol` at commit
`932fddf69a699a9a80fd2396fd1a2ab91cdda123` (tag `v5.0.0`) have
SHA-256 `38578bd71c0a909840e67202db527cc6b4e6b437e0f39f0c909da32c1e30cb81`
(3102 bytes), **and** that QPF's own Level-0 verification identity for that
claim can be recomputed from the published files alone.

Scope: content identity only. This is not a statement about OpenZeppelin
security, correctness, or audit status.

## 2. The claim, as a frozen triple

| File | Role | SHA-256 |
|---|---|---|
| `artifact.bin` | exact artifact bytes | `38578bd7...0cb81` |
| `receipt.json` | raw QPF Level-0 receipt | `33ad64e3...77e67` |
| `expected-result.json` | frozen verification result | `bd7c3626...fef687` |
| `manifest.json` | pin + expected ids + derivation rules | — |

Expected identities:

```text
qpfv0:    qpfv0:9c9963aa4611ab5d916d53986af4c9907fbd99f135e09ab3919f691eb38f6321
qpfpkg0:  qpfpkg0:feb668f7b95f9b201d6c8a2e68c5cd052a1bfe8d80105590f17fe53f1bd8a883
```

Both were independently reproduced by the canonical Node implementation
(`scripts/qpf-verify-level0.mjs` + `src/verification/package.js`) and by the
standalone Python reproducer in this folder. Same hex, same prefix, byte-identical.

## 3. How a stranger reproduces `qpfv0`

```bash
python3 verify.py
```

`qpfv0 = sha256(JCS(stable_result_fields))` where the stable fields are
`{spec, target, level_requested, level_achieved, status, checks, verifier,
evidence_binding}` — the `timestamp` is excluded. **`qpfv0` therefore survives
re-verification**: re-running QPF Level 0 on the same artifact + receipt yields
the same `qpfv0` even though the new result carries a fresh timestamp.
Cross-checks (independent fetch of the artifact from GitHub, receipt digest
bindings) are included in the same run.

## 4. How a stranger reproduces `qpfpkg0` — from the frozen result bytes

```text
qpfpkg0 = sha256(JCS({ result_id,
                       artifact_digest: {alg, hex},
                       receipt_digest: {alg, hex},
                       verification_result_digest: {alg, hex} }))
```

where `verification_result_digest` is the SHA-256 of the **published
`expected-result.json`, byte-for-byte**.

> **Important:** re-running verification generates a new `timestamp`, changing
> the result bytes and therefore the recomputed `verification_result_digest`.
> A re-run will produce a *different* `qpfpkg0`. That is by construction:
> `qpfpkg0` identifies the **complete frozen package**, not a verification
> outcome. Only `qpfv0` is timestamp-stable. To reproduce the published
> `qpfpkg0`, hash the published result file — do not regenerate it.
> The Python reproducer does exactly this; the canonical Node CLI does the
> same when given the frozen result file (its `--sink` mode regenerates the
> result with a fresh timestamp and legitimately derives a different package id).

## 5. Reproduce

```bash
python3 verify.py
```

Requirements: Python 3.8+, network access for the GitHub cross-check (the
derivation itself is fully offline). No clone of the QPF monorepo required —
the derivation rules are stated in `manifest.json` and implemented in `verify.py`.
