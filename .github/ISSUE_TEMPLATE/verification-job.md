---
name: "Verification job"
about: Submit a file to be independently verified ($2 standard / $5 expedited — you pay only if the verdict is ESTABLISHED)
title: "[verification] <one-line description of what you want proven>"
labels: verification
assignees: ''
---

<!-- QPF econ-cell v0 intake. FAILED verdicts cost $0 and still produce an
     honest evidence package. Payment buys execution of verification, never a PASS. -->

## 1 · Tier

<!-- keep exactly one -->

- [ ] **Standard** — $2.00 (up to 5 checks, single artifact)
- [ ] **Expedited** — $5.00 (up to 10 checks, priority)

## 2 · Artifact

Paste the full contents of the file to be verified inside the fenced block below
(or attach the file to this issue). The filename must match the `path` used in
the checks specification in section 3.

```
<PASTE ARTIFACT CONTENTS HERE>
```

## 3 · Checks specification (JSON)

```json
{
  "done_when": [
    {"check": "file_exists",   "params": {"path": "artifact.txt"}},
    {"check": "file_contains", "params": {"path": "artifact.txt", "content": "CHECKSUM OK"}},
    {"check": "file_sha256",    "params": {"path": "artifact.txt", "sha256": "<paste sha256sum output>"}}
  ]
}
```

Available checks: `file_exists` · `file_contains` · `file_sha256` · `file_absent` · `dir_exists`

## 4 · Acknowledgement (required)

- [ ] I understand the verdict is determined **before** payment is recorded.
- [ ] I understand a **FAILED** verdict produces no invoice and costs $0.
- [ ] I understand payment is made **after** an ESTABLISHED verdict, in the exact
      invoiced amount, to the address published in
      [`docs/econ-cell/PAYMENT.md`](../docs/econ-cell/PAYMENT.md).
- [ ] I will reply on this issue with the **transaction hash** so the payment can
      be recorded against an auditable external reference.

## 5 · Notes (optional)

< anything else we should know >
