# Static Site Public Verification v1

## Status

This document records v2 static-site public verification for Quantum Pi Forge / OINIO Soul System.

This is a visibility verification artifact.

It does not authorize deployment.

It does not authorize broadcast.

It does not authorize signing.

It does not authorize fund movement.

It does not authorize mainnet cutover.

It does not authorize state-changing transactions.

## Canonical Main

```txt
main_commit = bb79baae0a436d6c54e87bdded03e12afdde4326
main_subject = Add v2 public status endpoint v1 (#280)
```

## Verification Scope

This lane verifies:

```txt
local_static_artifacts_present = true
status_dashboard_json_present = true
status_index_json_present = true
status_html_present = true
status_json_matches_index_json = true
live_mainnet_mutation_authorized = false
execution_authorized_by_this_dashboard = false
```

## Runtime Evidence

```txt
runtime/static-site-verification-v1/config-inspection.json
runtime/static-site-verification-v1/local-static-verification.json
runtime/static-site-verification-v1/live-endpoint-verification.json
```

## Live Endpoint Verification

Live endpoint verification is conditional.

If `PUBLIC_SITE_ORIGIN` is set, the verifier attempts to fetch:

```txt
/status-dashboard-v1.json
/status/index.json
/status/
```

If `PUBLIC_SITE_ORIGIN` is not set, the live check is explicitly skipped and recorded as skipped.

No hosting platform is assumed by this lane.

## Public Interpretation

The repository exposes static read-only status artifacts suitable for public publication.

The endpoint layer remains non-mutating.

The dashboard and endpoint do not grant execution authority.

## Explicit Non-Claims

This lane does not prove that every external CDN or host has deployed the latest commit unless live endpoint verification is run with `PUBLIC_SITE_ORIGIN`.

This lane does not claim new on-chain activity.

This lane does not reopen v1.

This lane does not authorize v3 mutation.

## Final Statement

The static status surface is prepared and locally verified.

Live public verification is recorded when an origin is supplied.

The v2 visibility layer remains read-only.
