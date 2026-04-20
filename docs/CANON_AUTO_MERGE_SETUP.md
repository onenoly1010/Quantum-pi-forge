# CANON Auto-Merge System (6-Gate Pipeline)

A deterministic, auditable pipeline that governs how artifacts move from proposal → validated canon.

---

## 🧭 Overview

The **Canon Auto-Merge System** enforces a strict 6-gate validation pipeline before any artifact can be merged into the canonical repository.

This ensures:
- Structural integrity
- Deterministic validation
- Cryptographic traceability
- Human + machine alignment

---

## 🔐 The 6-Gate Pipeline

```mermaid
flowchart LR
    A[PR Opened] --> B[Gate 1: Structure Check]
    B --> C[Gate 2: Schema Validation]
    C --> D[Gate 3: Semantic Lint]
    D --> E[Gate 4: Determinism Check]
    E --> F[Gate 5: Signature / Hash]
    F --> G[Gate 6: Steward Approval]
    G --> H[Auto-Merge]
```

---

## 🚪 Gate Definitions

### Gate 1 — Structure Check

* Ensures file is placed in correct directory (`canon/`)
* Verifies naming conventions (`CLOSURE-XXX.md`)
* Rejects unknown file paths

---

### Gate 2 — Schema Validation

* Validates YAML frontmatter
* Required fields:

  * `id`
  * `title`
  * `version`
  * `status`
  * `author`
  * `created`

---

### Gate 3 — Semantic Lint

* Enforces formatting rules
* Checks:

  * Heading structure
  * No empty sections
  * Consistent terminology

---

### Gate 4 — Determinism Check

* Ensures output is reproducible
* No:

  * timestamps generated at runtime
  * nondeterministic values
* File must hash consistently across runs

---

### Gate 5 — Signature / Hash

* Generates SHA256 hash of artifact
* Optionally verifies signed commit
* Stores hash in audit log

---

### Gate 6 — Steward Approval

* Human-in-the-loop validation
* Required for:

  * First-time contributors
  * Critical canon changes
* Enables final merge

---

## ⚙️ Repository Structure

```
.
├── canon/
│   └── CLOSURE-001.md
├── docs/
│   └── CANON_AUTO_MERGE_SETUP.md
├── .github/
│   ├── workflows/
│   │   └── canon-auto-merge.yml
│   └── scripts/
│       ├── validate_structure.sh
│       ├── validate_schema.py
│       ├── semantic_lint.sh
│       ├── determinism_check.sh
│       └── hash_check.sh
├── Makefile
```

---

## 🧪 Quick Start (Local Validation)

Run the full pipeline locally:

```bash
make test-canon
```

### Example `Makefile`

```makefile
test-canon:
	bash .github/scripts/validate_structure.sh
	python3 .github/scripts/validate_schema.py
	bash .github/scripts/semantic_lint.sh
	bash .github/scripts/determinism_check.sh
	bash .github/scripts/hash_check.sh
```

---

## 📄 Minimal Example Artifact

### `canon/CLOSURE-001.md`

```markdown
---
id: CLOSURE-001
title: "Initial Canon Closure"
version: 1.0.0
status: draft
author: "system"
created: "2026-04-19"
---

# CLOSURE-001

## Purpose
Defines the initial closure artifact for the canon system.

## Specification
This artifact establishes the baseline structure and validation expectations.

## Determinism
This document contains no runtime-generated values.

## Notes
- Must pass all 6 gates before merge.
```

---

## 🔧 GitHub Actions (Conceptual)

Workflow file: `.github/workflows/canon-auto-merge.yml`

Key steps:

1. Checkout repo
2. Run validation scripts (Gates 1–5)
3. Block merge on failure
4. Require approval (Gate 6)
5. Auto-merge on success

---

## 🧯 Troubleshooting

| Issue                   | Likely Cause              | Resolution                             |
| ----------------------- | ------------------------- | -------------------------------------- |
| Structure check fails   | File in wrong directory   | Move file to `canon/`                  |
| Schema validation error | Missing YAML fields       | Add required frontmatter keys          |
| Semantic lint failure   | Formatting inconsistency  | Fix headings / empty sections          |
| Determinism failure     | Dynamic values present    | Remove timestamps or random values     |
| Hash mismatch           | File changed between runs | Ensure no mutation during pipeline     |
| Merge blocked           | Missing steward approval  | Request review from authorized steward |

---

## 🛡️ Design Principles

* **Determinism First** — same input → same output
* **Fail Fast** — reject invalid artifacts early
* **Auditability** — every merge is traceable
* **Minimal Trust Surface** — automation enforces rules, humans approve intent

---

## 🚀 Deployment Steps

1. Add this document to:

   ```
   docs/CANON_AUTO_MERGE_SETUP.md
   ```

2. Add validation scripts to:

   ```
   .github/scripts/
   ```

3. Add workflow:

   ```
   .github/workflows/canon-auto-merge.yml
   ```

4. Commit sample artifact:

   ```
   canon/CLOSURE-001.md
   ```

5. Run local test:

   ```bash
   make test-canon
   ```

6. Open a test PR → verify all 6 gates

---

## 🧭 Final State

When fully operational:

* All canon artifacts pass deterministic validation
* Every merge is cryptographically traceable
* Human oversight is preserved without sacrificing automation

---

**Status:** Ready for audit
**Next Step:** Execute end-to-end PR test