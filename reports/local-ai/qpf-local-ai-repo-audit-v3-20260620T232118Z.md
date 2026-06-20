# QPF Local AI Repo Audit v3

Generated: 2026-06-20T23:21:18Z
Model: qwen2.5-coder:3b

## CURRENT_POSTURE

The Quantum Pi Forge repo is currently in a state of readiness for the preparation of unsigned transactions. The repository contains several key artifacts and scripts that are essential for this process.

## VERIFIED_PASSES

- **Receipts/runtime/local-ai-readiness-v1/**: Verified.
- **Receipts/runtime/local-ai-repo-audit-v1/**: Verified.
- **Receipts/runtime/local-ai-repo-audit-v2/**: Verified.
- **Reports/local-ai/**: Verified.

## OPEN_PR_STATE

The PR #447 is currently open and has the following details:
- Base Ref Name: `main`
- Head Ref Name: `readiness/unsigned-transaction-preparation-v1`
- Number: 447
- State: Open
- Title: "Seal unsigned transaction preparation readiness artifacts v1"
- URL: [https://github.com/onenoly1010/Quantum-pi-forge/pull/447](https://github.com/onenoly1010/Quantum-pi-forge/pull/447)

## DIRTY_ITEMS

There are no dirty items in the repository.

## SCRIPT_NAME_MISMATCHES

There are no script name mismatches in the repository.

## SAFETY_BOUNDARY

The safety boundary for this process is that all scripts and artifacts must be thoroughly reviewed and verified before being used. This includes ensuring that all dependencies are up-to-date, that there are no security vulnerabilities, and that all logic is correct.

## NEXT_THREE_SAFE_COMMANDS

1. **Verify Evidence Index**: `node scripts/verify-evidence-index.cjs`
2. **Verify Evidence**: `node scripts/verify-evidence.cjs`
3. **Audit Full Local**: `node scripts/audit-full-local.cjs && npm run governance:cross-platform-determinism:v1:check`
