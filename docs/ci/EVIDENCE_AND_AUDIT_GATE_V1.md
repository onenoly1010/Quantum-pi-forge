# Evidence and Dependency Audit CI Gate v1

This workflow protects the public verification surface by running:

- `npm ci`
- `npm run verify:evidence`
- `npm audit --audit-level=high`

It runs on pull requests and pushes to `main`.

Purpose:

- prevent evidence verification regressions
- prevent high-severity dependency regressions
- preserve the post-remediation clean local audit posture

Current expected markers:

```text
OK evidence verification bundle passed.
steps=5
found 0 vulnerabilities
```
