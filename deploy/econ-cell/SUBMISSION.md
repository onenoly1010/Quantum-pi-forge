# How to Submit a Verification Job

## What You Need

1. **An artifact** — the file you want verified (any format: .txt, .sol, .json, .pdf, etc.)
2. **A checks specification** — what you want verified about it

## Creating Your Checks Specification

Create a JSON file with a `done_when` array. Each entry is a check:

```json
{
  "done_when": [
    {"check": "file_contains", "params": {"path": "artifact.txt", "content": "SPDX-License-Identifier: MIT"}},
    {"check": "file_sha256", "params": {"path": "artifact.txt", "sha256": "abc123..."}}
  ]
}
```

### Available Checks

| Check | Params | What It Does |
|-------|--------|-------------|
| `file_exists` | `path` | Verifies the file is present |
| `file_contains` | `path`, `content` | Verifies file contains the specified text |
| `file_sha256` | `path`, `sha256` | Verifies file SHA-256 matches exactly |
| `file_absent` | `path` | Verifies the file does NOT exist |
| `dir_exists` | `path` | Verifies a directory exists |

### Check Semantics

- ALL checks must pass for an **ESTABLISHED** verdict
- Any single check failing = **FAILED**
- The file check is free for every verdict and is not invoiced
- The artifact filename in `path` must match your submitted filename

## Submission Methods

### Public file check

State the claim in plain words at `https://qpf-verify.pages.dev/`. You do not hand-write `checks.json`. Every verdict is free.

### Local cell

```bash
python3 economic_cell.py serve <artifact_file> <checks_json>
```

The cell returns an evidence package with price 0. It does not issue an invoice.

### Registered review

Request one claim at `https://quantumpiforge.com/verification-request.html`. The fee is CAD $250 flat for every verdict, invoiced manually after acceptance. There is no checkout on the file check.

## What Happens After a File Check

1. **JOB_RECEIVED** — the job is recorded in the hash-chained ledger at price 0
2. **VERIFICATION_RESULT** — the independent verifier evaluates the artifact
3. No invoice is written for the file check

## Verifying Your Result

You can independently confirm the verdict:

1. Compute SHA-256 of your artifact: `sha256sum your_file`
2. Compare against the `artifact.sha256` in the evidence package
3. Re-run the checks against your artifact
4. Confirm the verdict matches

The evidence package is designed to be independently auditable — you don't
need to trust QPF's word.
