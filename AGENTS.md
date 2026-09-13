# QPF Agent Operating Contract

## Canonical sources

Read these before changing the repository:

1. `docs/governance/github-ecosystem-registry-v1.json` - machine-readable
   ecosystem ownership, lifecycle, and repository roles.
2. `docs/review/VERIFICATION_STATUS_TABLE_V1.md` - feature and claim posture.
3. `evidence/INDEX.md` - evidence lanes and verification entry points.
4. `docs/ai/AI_POLICY.md` and `docs/ai/AUTHORIZATION_WORKFLOW.md` - authority
   and approval boundaries.
5. The nearest applicable governance or security policy for sensitive paths.

Do not create a parallel source of truth. Update the canonical source and
regenerate or link derived views.

## Required commands

```bash
npm run verify:all
npm run verify:publication-scope -- --contract <task-contract.json> --base <base-ref>
```

`verify:all` runs tests, lint, build, policy, evidence, and determinism in that
order. It fails closed and names the failed layer.

## Task contract

Every non-Dependabot publication branch must have a task contract under
`.qpf/task-contracts/`. The contract defines:

```text
Outcome
Scope
Canonical sources
Allowed paths
Forbidden paths/actions
Verification
Definition of done
Authorization required
```

A publication branch contains only the artifact explicitly under review.

## Permitted AI actions

- Inspect and triage issues, pull requests, repository state, and evidence.
- Run deterministic tests, lint, builds, policy checks, and read-only probes.
- Draft documentation, patches, issues, and pull requests.
- Monitor and collect evidence without changing external state.
- Perform explicitly allowlisted low-risk maintenance after all required checks
  pass.

## Prohibited AI authority

AI does not independently control production, deployments, credentials,
secrets, billing, wallets, keys, signing, funds, governance, legal succession,
repository ownership, or unilateral irreversible actions.

## Mandatory stop conditions

Stop and report `UNKNOWN`, `BLOCKED`, or `REVIEW_REQUIRED` when:

- canonical sources are missing, contradictory, or stale;
- task scope does not match the branch diff;
- required evidence or a required check is unavailable;
- a requested action crosses an authorization boundary;
- rollback is absent for a state-changing action;
- the worktree contains unrelated changes.

```text
UNKNOWN != HEALTHY
prepared != verified != approved != executed
implemented != verified != reviewed != approved != merged != deployed
```
