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
- Any single check failing = **FAILED** verdict (no invoice, no charge)
- The artifact filename in `path` must match your submitted filename

## Submission Methods

### Method 1: Direct (if you have access)

Place your artifact and checks file in the econ-cell directory and run:

```bash
python3 economic_cell.py serve <artifact_file> <checks_json>
```

### Method 2: Request (managed)

Send your artifact + checks specification to the operator. You will receive:
1. Evidence package (JSON) — the verification result
2. Invoice (if ESTABLISHED) — payment instructions
3. Receipt (after payment) — ledger confirmation

## What Happens After Submission

1. **JOB_RECEIVED** — your job is recorded in the hash-chained ledger
2. **VERIFICATION_RESULT** — independent verifier evaluates your artifact
3. **INVOICE** (if ESTABLISHED) — payment request issued
4. **PAYMENT** (when you pay) — recorded with your transaction reference
5. **ALLOCATION** — funds allocated: 50% reserve, 30% compute, 20% ops

## Verifying Your Result

You can independently confirm the verdict:

1. Compute SHA-256 of your artifact: `sha256sum your_file`
2. Compare against the `artifact.sha256` in the evidence package
3. Re-run the checks against your artifact
4. Confirm the verdict matches

The evidence package is designed to be independently auditable — you don't
need to trust QPF's word.
