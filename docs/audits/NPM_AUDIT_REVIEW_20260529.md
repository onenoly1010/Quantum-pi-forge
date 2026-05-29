# npm Audit Review

**Project:** OINIO / Quantum Pi Forge  
**Date:** 2026-05-29  
**Status:** Reviewed; unsafe automatic force fixes intentionally deferred.

## Summary

A safe `npm audit fix` was tested under Node 22 / npm 10. It did not reduce the vulnerability count. The only observed lockfile change was metadata-only and did not remediate any advisory.

The remaining audit findings require `npm audit fix --force`, which would introduce breaking dependency changes. For repository stability, grant review integrity, and 0G diagnostic reproducibility, forced remediation is intentionally deferred until the affected dependency chains can be upgraded deliberately.

## Current Audit Result

The audit reports:

- 11 total vulnerabilities
- 4 low
- 2 moderate
- 5 high

## Primary Vulnerability Chains

### 1. Storacha / OpenTelemetry Chain

Affected packages include:

- `@storacha/cli`
- `@opentelemetry/auto-instrumentations-node`
- `@opentelemetry/sdk-node`
- `@opentelemetry/exporter-prometheus`
- `@inquirer/prompts`
- `@inquirer/editor`
- `external-editor`
- `tmp`

The audit recommends `npm audit fix --force`, but that would install `@storacha/cli@2.0.2`, which is a breaking change relative to the current dependency line.

Decision:

> Do not force downgrade or force-rewrite the Storacha CLI dependency chain without a dedicated compatibility test.

### 2. solc / tmp Chain

Affected packages include:

- `solc`
- `tmp`

The audit recommends `npm audit fix --force`, but that would install `solc@0.5.0`, which is a breaking change and is not appropriate for the current smart contract toolchain without targeted verification.

Decision:

> Do not force downgrade `solc` without contract compilation and deployment compatibility testing.

### 3. gaxios / uuid Chain

Affected packages include:

- `gaxios`
- `uuid`

The audit marks this chain as fixable without force, but the safe audit fix did not remediate it in the current dependency graph.

Decision:

> Investigate the parent dependency that pins `gaxios` before applying a manual override or direct dependency update.

## Security Posture

The project does not ignore these findings. They are documented as dependency-chain risks requiring targeted remediation.

Current mitigation posture:

- no `npm audit fix --force`
- no breaking downgrade of `@storacha/cli`
- no breaking downgrade of `solc`
- preserve reproducible 0G diagnostic environment
- handle dependency upgrades in a dedicated branch or commit after compatibility tests

## Recommended Next Steps

1. Identify the top-level package that pulls `gaxios`.
2. Determine whether `gaxios` can be safely upgraded through a parent package update.
3. Determine whether `@storacha/cli` has a non-breaking version that remediates the OpenTelemetry chain.
4. Determine whether the project still requires the current direct `solc` dependency.
5. Add targeted compatibility checks before changing Storacha or Solidity compiler dependencies.

## Conclusion

The audit findings are real, but the available automatic force fixes are not safe for this repository at this time. The correct action is targeted dependency remediation, not blind force-upgrade/downgrade.
