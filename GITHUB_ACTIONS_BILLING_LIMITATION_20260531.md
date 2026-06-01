# GitHub Actions Billing Limitation

Date: 2026-05-31

## Summary

GitHub-hosted Actions runners are currently unavailable due to an account-level billing/payment limitation. This is not a repository code failure.

The account's available payment method is KOHO, which GitHub appears to classify or reject as a prepaid payment method. Because this limitation exists at the platform billing layer, GitHub-hosted CI cannot be treated as authoritative for repository health.

## Operational Decision

Quantum Pi Forge treats GitHub Actions as a non-authoritative convenience layer.

Authoritative verification remains:

- Local deterministic test execution
- Local CI surrogate scripts
- Mainnet deployment evidence
- Public deployment logs
- Manual/admin merge records when GitHub-hosted runners are unavailable

## Impact

This issue may cause GitHub PR checks to remain pending, skipped, or unavailable.

It does not imply:

- Broken application code
- Failed repository tests
- Invalid deployment state
- Invalid 0G Compute integration
- Invalid Railway deployment configuration

## Mitigation

Short term:

- Continue local verification before merges
- Capture Railway deployment logs
- Document successful deployments and runtime checks
- Use admin/manual merges only when local evidence is clean

Long term:

- Add a self-hosted GitHub Actions runner
- Keep GitHub-hosted runners optional
- Preserve local-first verification as the canonical source of truth

## Conclusion

The current GitHub Actions limitation is a platform billing constraint, not a software defect. Quantum Pi Forge remains verifiable through sovereign local execution and external deployment evidence.
