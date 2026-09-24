# QPF Artifact Verification Service

## What You Get

For **$2.00**, QPF independently verifies a digital artifact against criteria
you specify, and produces a hash-chained evidence package that any third party
can audit.

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
| **Standard** | $2.00 | Up to 5 checks, single artifact |
| **Expedited** | $5.00 | Up to 10 checks, priority processing |

## The Process

1. **You submit** an artifact file + a checks specification
2. **QPF verifies** — independent verifier, executor has no write path to the verdict
3. **You receive** the evidence package + receipt
4. **You pay** — if verdict is ESTABLISHED (no charge for FAILED)
5. **Transaction recorded** in the hash-chained ledger

## Important

> **Payment buys execution of verification, never a PASS.**

The verdict is determined entirely by the checks against your artifact. Payment
only records that the transaction occurred — it cannot influence the result.

A FAILED verdict still produces an honest evidence package, but no invoice.
QPF does not charge for a verdict the customer didn't get.

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
  "price": 2.00,
  "invoiceable": true
}
```

This package is independently auditable: re-hash the artifact, re-run the
checks, confirm the verdict. The hash chain proves when verification occurred.
