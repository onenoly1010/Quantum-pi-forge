# Independently verify your file — $2, auditable proof

You send a file plus what you want proven about it. You get back a **hash-chained
evidence package** any third party can re-check without trusting us: artifact
SHA-256, byte size, every check result, the verdict, and a UTC timestamp.

> **Payment buys execution of verification — never a PASS.**
> The verdict is fixed by the checks before payment is ever recorded.
> A FAILED verdict still produces an honest evidence package, and costs you **nothing**.

## Pricing

| Tier | Price | Includes |
|---|---|---|
| Standard | **$2.00** | up to 5 checks, single artifact |
| Expedited | **$5.00** | up to 10 checks, priority |

## What can be proven today

| Check | Proves |
|---|---|
| `file_exists` | the artifact is present and non-empty |
| `file_contains` | the file contains specific text (e.g. `SPDX-License-Identifier: MIT`) |
| `file_sha256` | the file matches a known SHA-256 (download integrity) |
| `file_absent` | a file does **not** exist (e.g. no `.env` in a release) |
| `dir_exists` | a directory exists |

## How to submit — one GitHub issue

Open an issue using the **Verification job** template:

**→ https://github.com/onenoly1010/Quantum-pi-forge/issues/new?template=verification-job.md**

Put in the issue:

1. **Your artifact** — paste its full contents in a fenced code block, or attach the file.
2. **Your checks specification** — JSON, like this:

```json
{
  "done_when": [
    {"check": "file_exists",     "params": {"path": "artifact.txt"}},
    {"check": "file_contains",   "params": {"path": "artifact.txt", "content": "CHECKSUM OK"}},
    {"check": "file_sha256",     "params": {"path": "artifact.txt", "sha256": "<paste sha256sum output>"}}
  ]
}
```

3. **Tier** — standard or expedited.

The artifact filename used in `path` must match the filename you submitted.

## What you get back

1. **Evidence package** (JSON) — the result, hash-anchored, independently re-checkable.
2. **Invoice** — **only if the verdict is ESTABLISHED.** It contains the job reference, the exact amount, and the payment address below.
3. **Receipt** — a ledger confirmation after payment.

## How to pay

Pay **after** you receive an ESTABLISHED verdict, the **exact invoiced amount**:

```
RECEIVING_ADDRESS = 0x1fF3dbddc1c18C9eC53806BA16Fb6A3E1bE327d3
CHAIN             = 0G Aristotle Mainnet (EVM, chain id 16661)
ASSET             = USDC / USDT preferred ($2.00 / $5.00 exact)
                    native 0G accepted at the quoted USD equivalent
```

Ethereum L1 is accepted if you prefer it. Then reply on your issue with the
**transaction hash** — that hash is the external reference the ledger records.
The ledger cannot mint revenue: it refuses to record a payment without a real,
auditable external reference (≥8 characters).

## Verify our result yourself (no trust needed)

```sh
sha256sum your_file
# compare with artifact.sha256 in the evidence package,
# re-run the checks, and confirm the verdict yourself
```

The ledger is an append-only, hash-chained record
(`JOB_RECEIVED → VERIFICATION_RESULT → INVOICE → PAYMENT → ALLOCATION`); every
event commits to the previous event's hash, so any edit or omission breaks the
chain and is detectable. Revenue allocation is fixed: **50% reserve (untouchable),
30% compute, 20% operations** — the system cannot consume more than its economic
activity replenishes.

## Honest status (do not over-read this page)

- Machinery: **implemented and smoke-tested** (26/26 checks; ledger audit PASS).
- **Real revenue to date: $0.00.** No customer has yet been served. This page is
  the offer; it is not evidence of adoption.
- A prior $2.00 demo entry in the ledger was recorded with the reference
  `DEMO-TX-2026-09-09` and has been **reversed by an explicit CREDIT event** — it
  was a demonstration, not revenue.

---

*QPF econ-cell v0 · verification-as-infrastructure · FAILED = free ·
finance docs: [`PAYMENT.md`](./PAYMENT.md) · submission spec: repo `qpf-econ-cell/SUBMISSION.md`*
