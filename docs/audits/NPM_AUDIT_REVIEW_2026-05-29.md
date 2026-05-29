# NPM Audit Review — 2026-05-29

## Summary

Local dependency audit was performed using Node 22.

Production/runtime dependency audit passed:

```text
npm audit --omit=dev
found 0 vulnerabilities
```

Full dependency audit reported development/tooling vulnerabilities.

## Findings

The remaining reported issues are associated with development/build/tooling dependency chains, including:

- `@storacha/cli`
- `@opentelemetry/auto-instrumentations-node`
- `@opentelemetry/exporter-prometheus`
- `solc`
- `tmp`
- `uuid`

## Decision

Do not run `npm audit fix --force` at this time.

Reason: npm reports that force-fixing would introduce breaking changes, including major/dangerous dependency shifts such as:

- `@storacha/cli@2.0.2`
- `solc@0.5.0`

## Current Risk Position

- Production dependencies: clean
- Local build workflow: passing
- Cloudflare static build: passing
- Press agent structural verification: passing
- Remaining vulnerabilities: development/tooling dependency tree only

## Follow-up

Review dependency updates manually in a separate branch before applying breaking upgrades.
