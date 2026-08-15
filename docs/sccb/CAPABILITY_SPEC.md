# SCCB v1 Capability Specification

A **capability** is a named, least-privilege operation class. It is **not** unrestricted secret access.

## Required fields

| Field | Description |
| --- | --- |
| `id` | Stable identifier (e.g. `cloudflare.deploy`) |
| `scope` | Human-readable boundary |
| `permitted_operations` | Allowed operation verbs |
| `credential_dependency` | Credential id or `null` |
| `policy_class` | PREAUTHORIZED \| CONDITIONAL \| HUMAN_APPROVAL \| FORBIDDEN |
| `policy` | Constraints (allowlists, limits, reasons) |
| `approval_required` | Default human gate flag |
| `audit` | Receipt behavior (`never_include_secrets: true`) |
| `status` | active \| revoked \| paused |

## v1 catalog (defaults)

| Capability | Policy | Credential | Notes |
| --- | --- | --- | --- |
| `qpf.site.funnel.verify` | PREAUTHORIZED | none | Public funnel smoke |
| `cloudflare.pages.read` | PREAUTHORIZED | cloudflare-api-token | Read-only CF |
| `cloudflare.deploy` | CONDITIONAL | cloudflare-api-token | allowlist projects + `main` |
| `github.pr.create` | CONDITIONAL | github-token | allowlisted repos |
| `github.merge` | HUMAN_APPROVAL | github-token | Always escalate |
| `delivery.x.public_post` | HUMAN_APPROVAL | delivery-x | External publish |
| `pi.read` | FORBIDDEN | pi-api | Pi dormant |
| `wallet.prepare_transaction` | CONDITIONAL | none | Prepare only |
| `wallet.sign_transaction` | FORBIDDEN | wallet-signer | Signing disabled |
| `0g.submit_transaction` | FORBIDDEN | none | Broadcast disabled |
| `economics.mint` | FORBIDDEN | none | Mint LOCKED |
| `economics.liquidity` | FORBIDDEN | none | LP LOCKED |

## Separation from evidence registry

| Registry | Purpose |
| --- | --- |
| `deploy/capability-registry-v1.json` | What the project can **prove** (Hermes, CI evidence) |
| SCCB capability registry | What the project may **invoke** (provider ops) |

Do not collapse without an explicit migration plan.

## Source of truth

- Runtime defaults: `sccb/src/capabilities/registry.js` → `defaultCapabilities()`
- Sample JSON: `sccb/config/capabilities.v1.json`
