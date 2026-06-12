# Reviewer Evidence Index v1

## Purpose

This index converts the sealed v1 governance proof and v2 visibility artifacts into a reviewer-facing map.

For any claim a reviewer or funder wants to validate:

Claim → Evidence file(s) → Verifier command → Hash (for integrity) → Public surface (for quick access)

This makes the entire system legible without requiring the original authors to be present.

## Canonical Main at Generation

```txt
main_commit = 1fce65fe6e719717c7008059dd9d515c982f4b9e
main_subject = Add v2 read-only status dashboard v1 (#279)
```

## Evidence Map

### Claim: v1 lifecycle is closed

**Evidence:**
- `receipts/governance/mainnet-final-state-seal-v1.json`
- `docs/governance/MAINNET_FINAL_STATE_SEAL_V1.md`

**Verifier:**
```bash
npm run governance:ultimate-baseline:v1:check
```

**Public surface:**
- `docs/public/READ_ONLY_STATUS_DASHBOARD_V1.md`
- `/status-dashboard-v1.json`
- `/status/`

### Claim: Open Verification replaced outside reviewer bottleneck

**Evidence:**
- `receipts/governance/open-verification-gate-v1.json`
- `docs/governance/OPEN_VERIFICATION_GATE_V1.md`

**Verifier:**
```bash
npm run governance:open-verification-gate:v1:check
```

**Public surface:**
- `docs/public/READ_ONLY_STATUS_DASHBOARD_V1.md`
- `/status-dashboard-v1.json`

### Claim: Current governance state is sealed

**Evidence:**
- `receipts/governance/v2-scope-definition.json`
- `docs/governance/V2_SCOPE_DEFINITION.md`

**Verifier:**
```bash
npm run governance:v2-scope-definition:check
```

**Public surface:**
- `docs/public/READ_ONLY_STATUS_DASHBOARD_V1.md`
- `/status-dashboard-v1.json`

### Claim: Execution window was single-use

**Evidence:**
- `receipts/governance/mainnet-execution-window-v1.json`
- `docs/governance/MAINNET_EXECUTION_WINDOW_V1.md`

**Verifier:**
```bash
npm run governance:mainnet-execution-window:v1:check
```

**Public surface:**
- `docs/public/READ_ONLY_STATUS_DASHBOARD_V1.md`

### Claim: Execution result was recorded

**Evidence:**
- `receipts/governance/mainnet-execution-result-v1.json`
- `docs/governance/MAINNET_EXECUTION_RESULT_V1.md`

**Verifier:**
```bash
npm run governance:mainnet-execution-result:v1:check
```

**Public surface:**
- `docs/public/READ_ONLY_STATUS_DASHBOARD_V1.md`

### Claim: v2 visibility layer is read-only

**Evidence:**
- `receipts/governance/v2-read-only-status-dashboard-v1.json`
- `docs/public/READ_ONLY_STATUS_DASHBOARD_V1.md`

**Verifier:**
```bash
npm run governance:v2-read-only-status-dashboard:v1:check
```

**Public surface:**
- `docs/public/READ_ONLY_STATUS_DASHBOARD_V1.md`
- `/status-dashboard-v1.json`
- `/status/`

### Claim: No live mutation is authorized by v2 artifacts

**Evidence:**
- `receipts/governance/v2-scope-definition.json`
- `receipts/governance/v2-read-only-status-dashboard-v1.json`
- `receipts/governance/v2-public-status-endpoint-v1.json`

**Verifier:**
```bash
npm run governance:v2-scope-definition:check && npm run governance:v2-read-only-status-dashboard:v1:check && npm run governance:v2-public-status-endpoint:v1:check
```

**Public surface:**
- `docs/public/READ_ONLY_STATUS_DASHBOARD_V1.md`
- `docs/public/PUBLIC_STATUS_ENDPOINT_V1.md`
- `/status-dashboard-v1.json`
- `/status/`


## Full Verification Command (v1 closure + v2 visibility)

```bash
npm run governance:ultimate-baseline:v1:check && npm run governance:v2-scope-definition:check && npm run governance:v2-read-only-status-dashboard:v1:check && npm run governance:v2-public-status-endpoint:v1:check && npm run governance:v2-reviewer-evidence-index:v1:check
```

## Public Interpretation

- The v1 lifecycle is closed and sealed with a single-use execution window.
- Open Verification removed the social bottleneck while preserving proof requirements.
- The v2 visibility layer provides read-only public surfaces (dashboard + status endpoint) without authorizing any mutation or execution.
- All v2 artifacts explicitly assert `live_mainnet_mutation_authorized = false` and `execution_authorized = false`.

## How to Use This Index

1. Pick a claim from the map above.
2. Inspect the listed evidence file(s) in the repo.
3. Run the verifier command.
4. Cross-check the hash of the evidence against the receipt or the index JSON.
5. View the public surface for a human or machine-readable summary.

This index, together with the status dashboard and public endpoint, allows external reviewers to understand and verify the QPF / OINIO v1 closure and v2 posture in minutes.

## Limits (Explicit)

This index does not authorize any on-chain action.
It does not claim future mainnet operations.
It is a snapshot of the sealed history as of the main commit above.
