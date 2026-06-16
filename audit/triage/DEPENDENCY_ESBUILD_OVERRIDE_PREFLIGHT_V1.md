# esbuild Override Preflight v1

Context: targeted remediation test for remaining wrangler -> esbuild audit findings.

Mode: isolated preflight branch.

Override tested:

```json
"overrides": {
  "esbuild": "0.28.1"
}
```

Rationale: npm audit reported esbuild 0.17.0 - 0.28.0 as vulnerable, so ^0.25.0 is not sufficient. This preflight tests exact esbuild 0.28.1 without forcing a wrangler downgrade.

## Commands Run

```bash
npm install
npm audit --audit-level=high
npm ls esbuild wrangler --depth=3
npm run verify:evidence
```

## Evidence Verification

```text
OK evidence verification bundle passed.
steps=5
```

## Files Captured

- audit/triage/DEPENDENCY_AUDIT_ESBUILD_OVERRIDE_POST_2026-06-16.txt
- audit/triage/DEPENDENCY_AUDIT_ESBUILD_OVERRIDE_RAW_2026-06-16.json
- audit/triage/DEPENDENCY_ESBUILD_WRANGLER_TREE_POST_2026-06-16.txt
- audit/triage/DEPENDENCY_ESBUILD_OVERRIDE_DIFF_2026-06-16.diff

## Interpretation

This branch tests whether a targeted esbuild override clears the remaining high-severity audit findings without using npm audit fix --force and without downgrading wrangler.
