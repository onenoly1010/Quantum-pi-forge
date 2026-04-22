# Canon Auto-Merge System - Setup Guide

## Overview

The Canon Auto-Merge system provides policy-governed automated PR merging for Canon of Closure artifacts through a multi-layered governance gate system. This document guides you through setup, configuration, testing, and troubleshooting.

> **Trust Boundary Statement**: This system guarantees automation of Canon merges only inside GitHub's trust boundary. It does not provide independent cryptographic proof of governance decisions unless external signing is added.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [System Architecture](#system-architecture)
3. [Setup Instructions](#setup-instructions)
4. [Configuration](#configuration)
5. [Testing](#testing)
6. [Monitoring](#monitoring)
7. [Troubleshooting](#troubleshooting)
8. [Rollback Procedures](#rollback-procedures)
9. [FAQ](#faq)

## Prerequisites

### Required

- [ ] GitHub repository with Actions enabled
- [ ] Canon directory structure (`canon/` in repository root)
- [ ] Python 3.11+ for local testing
- [ ] Repository admin access for secret configuration

### Recommended

- [ ] ClosureSentinel Probot app installed (for Gate 2)
- [ ] Canon FastAPI backend deployed (for validation & audit)
- [ ] Redis instance (for state caching)
- [ ] Slack webhook (for notifications)

### GitHub Permissions

The workflows require the following permissions (configured in workflow files):

```yaml
permissions:
  contents: write      # For merging PRs and committing index updates
  pull-requests: write # For commenting and labeling
  checks: write        # For creating check runs
  issues: write        # For creating incident issues
```

## System Architecture

### Trust Boundary

```text
Contributor
   ↓ [creates]
GitHub PR
   ↓ [reads/validates]
Workflow Gates ──── Stewards can override at any layer
   ↓ [executes]
Validation Engine
   ↓ [records]
Audit Labels
   ↓ [writes]
Main Branch
```

| Layer               | Can Mutate          | Can Observe         | Can Override        |
|---------------------|---------------------|---------------------|---------------------|
| Contributor         | ✅ PR content       | ✅ all gates        | ❌                  |
| GitHub Actions      | ✅ status checks    | ✅ all data         | ❌                  |
| Curator             | ✅ approve          | ✅ all gates        | ❌                  |
| Steward             | ✅ merge any PR     | ✅ all data         | ✅ any gate         |
| Repository Admin    | ✅ force push       | ✅ everything       | ✅ everything       |

### ClosureSentinel Contract

Gate 2 implements the following API contract:

```yaml
ClosureSentinel:
  input:
    pr_number: integer
    artifact_path: string
    trace_id: string
  output:
    status: pass | fail | pending
    reason: string
    validation_hash: sha256 string
  notes:
    - Generated deterministically from artifact content and validation results
    - Reserved for external verification anchoring
    - Not currently enforced or stored externally
  success_criteria:
    - Valid canonical frontmatter
    - No duplicate artifact ID
    - Valid trace reference
    - All required fields present
  fallback_behavior:
    - 5 minute timeout
    - Proceed with warning on timeout
    - Fail closed on explicit rejection
```

### The 6 Gates

```
┌─────────────────────────────────────────────────────────────┐
│                  Canon Auto-Merge Pipeline                  │
└─────────────────────────────────────────────────────────────┘

  PR Created/Updated
         │
         ▼
  ┌─────────────┐
  │   Gate 1:   │  Classify PR as Canon artifact
  │ Classification│  Determine artifact type
  └──────┬──────┘  Extract metadata
         │
         ▼
  ┌─────────────┐
  │   Gate 2:   │  Wait for ClosureSentinel validation
  │  Sentinel   │  Check status (timeout: 5 min)
  └──────┬──────┘  Proceed only if passed
         │
         ▼
  ┌─────────────┐
  │   Gate 3:   │  Check role-based approvals
  │  Approval   │  Verify required count met
  └──────┬──────┘  Validate reviewer permissions
         │
         ▼
  ┌─────────────┐
   │   Gate 4:   │  Detect duplicate IDs, structural conflicts
   │  Conflict   │  Check reference validity
   └──────┬──────┘  Optional content similarity checks
         │
         ▼
  ┌─────────────┐
  │   Gate 5:   │  Log merge decision locally
  │   Audit     │  Add audit-logged label
  └──────┬──────┘  Record gate results
         │
         ▼
   ┌─────────────┐
   │ Gate 5.5:   │  Generate validation hash
   │ Attestation │  Create signed attestation
   └──────┬──────┘  Commit audit record
         │
         ▼
  ┌─────────────┐
  │   Gate 6:   │  Execute squash merge
  │   Merge     │  Delete source branch
  └──────┬──────┘  Trigger post-merge workflow
         │
         ▼
  Post-Merge Actions:
  • Regenerate Canon index
  • Verify integrity
  • Update parent issue
  • Send notifications
```

### Workflow Files

- **`canon-auto-merge.yml`**: Main 6-gate orchestration workflow
- **`canon-validation.yml`**: Artifact validation checks
- **`canon-conflict-check.yml`**: Conflict detection workflow
- **`canon-post-merge.yml`**: Post-merge index regeneration and verification

### Python Scripts

- **`check-conflicts.py`**: ID uniqueness, structural validation, reference checking, and optional content similarity detection
- **`update-canon-index.py`**: INDEX.md and artifacts.json generation
- **`verify-canon-integrity.py`**: Reference validation and dependency checking
- **`validate-artifact.py`**: YAML frontmatter and schema validation

## Setup Instructions

### Step 1: Configure Secrets

Add the following secrets in **Settings → Secrets and variables → Actions**:

#### Required Secrets

```bash
# GitHub token with repo and read:org permissions
REPO_MERGE_TOKEN=ghp_xxxxxxxxxxxxx

# Canon API endpoint (if using Canon backend)
CANON_API_URL=https://your-canon-api.example.com

# Canon API authentication (if required)
CANON_API_KEY=your-api-key-here
```

#### Optional Secrets

```bash
# Redis for state caching
REDIS_URL=redis://your-redis-instance:6379

# Slack notifications
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL
```

### Step 2: Configure Repository Settings

Navigate to **Settings → Actions → General**:

1. **Workflow permissions**:
   - Select: ✅ "Read and write permissions"
   - Enable: ✅ "Allow GitHub Actions to create and approve pull requests"

2. **Branch protection** (recommended for main branch):
   - ✅ Require pull request reviews (1-2 reviewers based on artifact type)
   - ✅ Require status checks to pass: `Canon Artifact Validation`, `Canon Conflict Detection`
   - ⚠️ Do NOT enable "Require branches to be up to date" (can block auto-merge)

### Step 3: Configure Teams and CODEOWNERS

Create GitHub teams for role-based permissions:

```bash
# Create teams (via GitHub Settings → Teams)
@org/canon-stewards       # Full permissions
@org/canon-curators       # Curator permissions
@org/contributors         # Limited permissions
```

Create `.github/CODEOWNERS` file:

```
# Canon CODEOWNERS
canon/**  @org/canon-stewards @org/canon-curators
```

### Step 4: Configure Merge Rules

Edit `.github/config/canon-merge-rules.json` to customize:

```json
{
  "artifact_types": {
    "foundational": {
      "required_approvals": 2,
      "required_roles": ["steward"]
    },
    "closure": {
      "required_approvals": 1,
      "required_roles": ["steward", "curator", "contributor"]
    }
  }
}
```

### Step 5: Create Canon Directory Structure

```bash
# Create canon directory if it doesn't exist
mkdir -p canon

# Create initial README
cat > canon/README.md << 'EOF'
# Canon of Closure

This directory contains the Canon of Closure artifacts, documenting the evolution and resolution of issues in the Pi Forge Quantum Genesis project.

## Structure

Artifacts are organized by type:
- **Foundational**: Core framework documents
- **Channel**: Communication and integration channels
- **Closure**: Issue resolution documentation
- **Governance**: Policy and procedural documents

## Index

See [INDEX.md](./INDEX.md) for the complete artifact catalog (auto-generated).

## Contribution Guidelines

1. Create Canon artifact PRs from the Canon issue template
2. Ensure all required frontmatter fields are present
3. Link to parent artifact (if applicable)
4. Wait for validation checks and approvals
5. Auto-merge will trigger after all gates pass

EOF

# Generate initial index
python .github/scripts/update-canon-index.py --canon-dir canon
```

## Configuration

### Artifact Type Rules

Customize merge rules in `.github/config/canon-merge-rules.json`:

```json
{
  "artifact_types": {
    "foundational": {
      "required_approvals": 2,           // Number of required approvals
      "required_roles": ["steward"],     // Who can approve
      "conflict_sensitivity": "high",    // Conflict detection level
      "auto_merge_enabled": true         // Enable auto-merge
    }
  }
}
```

### Role Permissions

Define roles and their capabilities:

```json
{
  "roles": {
    "steward": {
      "github_teams": ["canon-stewards"],
      "can_override_gates": true,        // Can bypass gate failures
      "can_approve_all": true            // Can approve any type
    },
    "curator": {
      "github_teams": ["canon-curators"],
      "can_override_gates": false,
      "can_approve_types": ["channel", "closure"]
    }
  }
}
```

### Gate Configuration

#### Required Concurrency Setup

Add this block at the top of `canon-auto-merge.yml` to prevent race conditions:

```yaml
concurrency:
  group: canon-merge-${{ github.ref }}
  cancel-in-progress: false
```

#### Gate 5.5 - Verifiable Attestation Layer

Between audit and merge, an optional cryptographic audit trail is created:

```yaml
- name: Generate validation hash
  id: hash
  run: |
    HASH=$(python .github/scripts/generate-validation-hash.py \
      "${{ env.ARTIFACT_PATH }}" \
      "${{ github.event.pull_request.number }}" \
      "${{ github.sha }}")
    echo "validation_hash=$HASH" >> $GITHUB_OUTPUT

- name: Create attestation
  run: |
    chmod +x .github/scripts/sign-attestation.sh
    .github/scripts/sign-attestation.sh \
      "${{ steps.hash.outputs.validation_hash }}" \
      "${{ github.event.pull_request.number }}" \
      "${{ github.sha }}"

- name: Commit audit record
  run: |
    git config user.name "canon-bot"
    git config user.email "actions@github.com"
    git add canon/attestations/
    git commit -m "Audit: Attestation for PR #${{ github.event.pull_request.number }}"
    git push
```

Each successful merge generates:
- Deterministic SHA-256 validation hash
- Signed attestation stored in `canon/attestations/`
- Immutable audit record committed to git history

These attestations provide a verifiable audit trail beyond GitHub UI state.

### Gate Behavior

Customize gate behavior:

```json
{
  "validation_gates": {
    "gate4_conflict": {
      "enabled": true,
      "timeout_seconds": 180,
      "semantic_threshold": 0.85,        // Similarity threshold (0.0-1.0)
      "structural_checks": true
    }
  }
}
```

## Testing

### Test 1: Local Script Validation

Test Python scripts locally:

```bash
# Test artifact validation
python .github/scripts/validate-artifact.py canon/example-artifact.md

# Test conflict detection
python .github/scripts/check-conflicts.py \
  --canon-dir canon \
  --new-artifact canon/example-artifact.md

# Test integrity verification
python .github/scripts/verify-canon-integrity.py --canon-dir canon

# Test index generation
python .github/scripts/update-canon-index.py --canon-dir canon
```

### Test 2: Create Sample Canon Artifact

Create `canon/TEST-001-sample-closure.md`:

```markdown
---
id: TEST-001
title: Sample Closure Artifact
type: closure
created_at: 2024-01-01T00:00:00Z
author: test-user
trace_id: A22-001
status: draft
---

# Sample Closure Artifact

This is a test artifact to verify the Canon Auto-Merge system.

## Issue Summary

Test issue for system validation.

## Resolution

Successfully resolved for testing purposes.
```

### Test 3: Create Test PR

```bash
# Create test branch
git checkout -b test/canon-automerge

# Add sample artifact
git add canon/TEST-001-sample-closure.md
git commit -m "Canon: Add sample closure artifact"
git push origin test/canon-automerge

# Create PR via GitHub UI or CLI
gh pr create \
  --title "Canon: Sample Closure Artifact" \
  --body "Test PR for Canon Auto-Merge system" \
  --label "canon"
```

### Test 4: Monitor Gate Progression

Watch the workflow runs:

```bash
# List workflow runs
gh run list --workflow=canon-auto-merge.yml

# Watch specific run
gh run watch <RUN_ID>

# View logs
gh run view <RUN_ID> --log
```

### Expected Results

✅ All gates should pass:
- Gate 1: Classification detects Canon PR
- Gate 2: ClosureSentinel validates (or times out with warning)
- Gate 3: Approvals obtained (1 for closure type)
- Gate 4: No conflicts detected
- Gate 5: Audit logged
- Gate 6: PR merged and branch deleted

✅ Post-merge actions:
- Canon index regenerated
- Integrity verified
- Parent issue updated (if linked)

## Monitoring

### Commands

```bash
# Check recent auto-merge runs
gh run list --workflow=canon-auto-merge.yml --limit 10

# View post-merge runs
gh run list --workflow=canon-post-merge.yml --limit 5

# Check for failed integrity checks
gh issue list --label "integrity-failure"

# View audit labels
gh pr list --label "auto-merged,audit-logged" --state merged
```

### Monitoring Dashboard

Create a monitoring script (`scripts/monitor-canon.sh`):

```bash
#!/bin/bash
echo "Canon Auto-Merge System Status"
echo "==============================="
echo ""

# Count auto-merged PRs
AUTO_MERGED=$(gh pr list --label "auto-merged" --state merged --json number | jq length)
echo "Total Auto-Merged PRs: $AUTO_MERGED"

# Recent failures
FAILED_RUNS=$(gh run list --workflow=canon-auto-merge.yml --status failure --limit 5 --json conclusion | jq length)
echo "Recent Failed Runs: $FAILED_RUNS"

# Integrity issues
INTEGRITY_ISSUES=$(gh issue list --label "integrity-failure" --state open --json number | jq length)
echo "Open Integrity Issues: $INTEGRITY_ISSUES"

# Canon artifact count
ARTIFACT_COUNT=$(find canon -name "*.md" ! -name "INDEX.md" ! -name "README.md" | wc -l)
echo "Total Canon Artifacts: $ARTIFACT_COUNT"
```

### Alerts

Set up GitHub Action notifications:

1. **Email**: Settings → Notifications → Actions
2. **Slack**: Configure `SLACK_WEBHOOK_URL` secret
3. **Custom**: Modify `canon-post-merge.yml` notify step

## Troubleshooting

### Issue: Gate 2 (ClosureSentinel) Times Out

**Symptoms**: Auto-merge proceeds with warning, sentinel check never completes

**Causes**:
- ClosureSentinel Probot app not installed
- Check name mismatch (expecting "ClosureSentinel")

**Solutions**:
1. Install ClosureSentinel Probot app on repository
2. Verify check name in workflow logs
3. Adjust timeout in `.github/config/canon-merge-rules.json`
4. Disable gate temporarily: `"gate2_sentinel": { "enabled": false }`

### Issue: Gate 3 (Approval) Never Passes

**Symptoms**: Approvals obtained but