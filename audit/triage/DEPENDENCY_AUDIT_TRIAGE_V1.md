# Dependency Audit Triage v1 (2026-06-16)

Context: post-public verification surfacing on canonical main.
Mode: read-only audit capture. No package changes, no npm audit fix, no dependency mutations.

## Summary

- Total vulnerabilities reported by npm metadata: 8
- Counts: {"info":0,"low":0,"moderate":1,"high":3,"critical":0,"total":4}
- Evidence verification impact: non-blocking
- Remediation posture: document first, fix later

## Commands Captured

~~~bash
npm audit --audit-level=high
npm audit --audit-level=info --json
npm ls --depth=0
npm run verify:evidence
~~~

## Vulnerability Inventory

| Severity | Package | Range | Direct | Fix Available | Advisory / Via |
|---|---|---|---|---|---|
| high | esbuild | 0.17.0 - 0.28.0 | false | {"name":"wrangler","version":"3.6.0","isSemVerMajor":true} | esbuild: Missing binary integrity verification in Deno module enables remote code execution via NPM_CONFIG_REGISTRY |
| moderate | protobufjs | <=7.6.2 | false | true | protobufjs : Schema-derived names can shadow runtime-significant properties |
| high | tsx | 3.13.0 - 4.21.1 | false | true | esbuild |
| high | wrangler | <=0.0.0-kickoff-demo || >=3.7.0 | true | {"name":"wrangler","version":"3.6.0","isSemVerMajor":true} | esbuild |

## Interpretation

This receipt records the current dependency audit state without changing dependencies. The audit warnings are tracked separately from the evidence verification bundle and do not invalidate npm run verify:evidence.

## Files

- audit/triage/DEPENDENCY_AUDIT_TRIAGE_2026-06-16.txt
- audit/triage/DEPENDENCY_AUDIT_RAW_2026-06-16.json
- audit/triage/DEPENDENCY_TOP_LEVEL_2026-06-16.txt

## Next Step

Review whether reported vulnerabilities affect production/runtime paths, dev-only tooling, or transitive dependencies. Apply fixes only in a separate remediation PR after triage.
