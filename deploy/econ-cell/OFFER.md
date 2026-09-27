# QPF Artifact Verification Service

## What You Get

The file check is **free for every verdict** — QPF independently verifies a
digital artifact against criteria you specify, and produces a hash-chained
evidence package that any third party can audit. A registered review is
CAD $250 flat, invoiced manually after intake.

The evidence package proves:
- **What** was verified (artifact name, SHA-256 hash, byte size)
- **Which checks** were performed (existence, content, hash match)
- **The verdict** (ESTABLISHED or FAILED)
- **When** it was verified (UTC timestamp in the hash chain)

## What Can Be Verified

| Check | What It Proves | Example |
|-------|---------------|---------|
| `file_contains` | File contains specific text | "Contract contains SPDX-License-Identifier" |
| `file_sha256` | File matches a known hash | "Downloaded file matches published hash" |
| `file_exists` | Artifact is present and non-empty | "Document exists in submission" |
| `file_absent` | A file does NOT exist | "No .env file in released archive" |

## Pricing

| Tier | Price | What's Included |
|------|-------|-----------------|
| **File check** | Free (price 0, currency "none") — not an invoice | Hash-chained evidence package for every verdict |
| **Registered review** | CAD $250 flat | Manual review after intake — same fee for ESTABLISHED, FAILED, and UNKNOWN |

## The Process

1. **File check** — state the claim in plain words at the public checker. Every verdict is free and is not an invoice.
2. **QPF verifies** — the independent verifier decides the verdict. The executor has no write path to it.
3. **You receive** the evidence package. Re-hash the file and re-run the statements.
4. **Registered review, if you want one** — CAD $250 flat, the same fee for ESTABLISHED, FAILED, and UNKNOWN. It is invoiced manually after the claim is accepted. There is no checkout on the file check.

## Important

> **Payment buys the work of a registered review, never a verdict.**

The $2 / $5 USD offer (pay only after ESTABLISHED) is withdrawn. A file check is free for every verdict. A registered review costs the same fee whichever way the verdict goes. The cell cannot mint revenue, and it does not invoice the file check.

## What You Receive (Evidence Package)

```json
{
  "service": "qpf-verification/v0",
  "tier": "standard",
  "artifact": {
    "name": "your-file.txt",
    "sha256": "abc123...",
    "bytes": 1024
  },
  "checks": [
    {"check": "file_sha256", "params": {...}, "pass": true}
  ],
  "verdict": "ESTABLISHED",
  "reason": "all done_when checks pass",
  "price": 0.00,
  "currency": "none"
}
```

This package is independently auditable: re-hash the artifact, re-run the
checks, confirm the verdict. The hash chain proves when verification occurred.
