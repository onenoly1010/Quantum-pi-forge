# SCCB v1 Approval Policy Specification

## Execution classes

### A. PREAUTHORIZED

Operations covered by standing policy execute automatically when:

- capability is active (not revoked/paused)
- operation is permitted
- global emergency stop / pause is off
- credential (if any) is not revoked/disabled/expired

Examples: `qpf.site.funnel.verify`, `cloudflare.pages.read`.

### B. CONDITIONAL

Automatic only when **all** policy conditions match:

- `allowed_targets` / `allowed_branches` / `allowed_repos` / `allowed_networks` / `allowed_destinations`
- `max_amount_wei` when set
- `signing_enabled` constraints

**Mismatch → ESCALATE** (human approval), never silent allow.

Example: `cloudflare.deploy` with `target=quantumpiforge` and `branch=main`.

### C. HUMAN_APPROVAL

Must stop and request explicit approval. Approval is bound to:

- `capability_id`
- `operation`
- `params_hash` (canonical JSON hash of params)

Approvals are **one-time** (consumed on successful invoke) and may expire (TTL).

### D. FORBIDDEN

Always deny. Used for economic locks, Pi dormant, wallet sign/broadcast until separate GO.

## Always-approve agent mode

**Never** interprets “always approve” as authorization to bypass SCCB policy.

- Cannot elevate FORBIDDEN → ALLOW
- Cannot skip HUMAN_APPROVAL
- Cannot widen CONDITIONAL allowlists
- May only auto-run sealed PREAUTHORIZED (and matching CONDITIONAL) policies

## Approval CLI

```bash
# Invoke → may return APPROVAL_REQUIRED + approval_id
npm run sccb -- invoke --capability github.merge --operation merge_pr \
  --params '{"pr":1,"repo":"KrisCrispy-spec/Quantum-pi-forge"}'

# Human decides
npm run sccb -- approve --id <approval_id> --decision APPROVED --by kris

# Re-invoke with same params (and optional --approval-id)
npm run sccb -- invoke --capability github.merge --operation merge_pr \
  --params '{"pr":1,"repo":"KrisCrispy-spec/Quantum-pi-forge"}' \
  --approval-id <approval_id>
```

## Mapping from AUTHORIZATION_WORKFLOW

| Workflow default | SCCB class |
| --- | --- |
| Inspect/verify | PREAUTHORIZED where possible |
| Production merge/deploy | HUMAN or CONDITIONAL |
| Financial / wallet / mint / LP | FORBIDDEN or HUMAN with separate economic GO |
| Secret create/rotate | HUMAN bootstrap path only |
