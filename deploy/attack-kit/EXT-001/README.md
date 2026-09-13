# EXT-001 — Public Reproduction of a QPF Verification Identity

**Status:** frozen. Contents must not change; any change invalidates the published
identities below. This is an outreach/product evidence package. It is **not**
VEC-001 and does not claim anything about VEC-001/E2.

> **Read this before re-running verification:** `qpfv0` is timestamp-stable and
> survives re-running QPF Level 0. `qpfpkg0` is NOT: it hashes the published
> `expected-result.json` byte-for-byte, so a re-run (new timestamp → new result
> bytes → new digest) will legitimately produce a *different* package id. That
> is not a failed check. To confirm `qpfpkg0`, hash the published result file;
> the reproducer below does exactly this.

Expected identities:

```text
qpfv0:    qpfv0:44a9b8cfbcd6eb3dfc83e93b1312f4511a4d42de77cd24afcea198bb424f9db8
qpfpkg0:  qpfpkg0:54f7af2c1ab97709f0813815036bcde62bfb3165107426a0f6a952d9c97cb1c2
```

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
| `receipt.json` | raw QPF Level-0 receipt | `37085cb2...92d5b` |
| `expected-result.json` | frozen verification result | `797c976d...4a1b` |
| `manifest.json` | pin + expected ids + derivation rules | — |

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
