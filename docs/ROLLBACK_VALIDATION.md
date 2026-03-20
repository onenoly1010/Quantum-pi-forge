# Rollback Validation CI Check

## Overview

The Rollback Validation CI Check is a GitHub Actions workflow that automatically validates the rollback system on every pull request. This ensures that the rollback functionality is ready and operational before merging changes.

## Purpose

The rollback validation system serves several critical purposes:

1. **Prevent Breakage**: Catch issues in rollback logic before they reach production
2. **Ensure Readiness**: Validate that all rollback dependencies and scripts are functional
3. **Maintain Confidence**: Provide assurance that the system can recover from failed deployments
4. **Documentation**: Serve as living documentation of rollback requirements

## Validation Checks

### 1. Workflow Syntax Validation

- **What**: Validates the YAML syntax of the AI Agent Handoff Runbook workflow
- **How**: Uses `yamllint` to check for syntax errors
- **Checks**:
  - Valid YAML structure
  - Rollback job exists
  - Required inputs present (`rollback_version`)
  - Rollback action option exists

### 2. Dependency Validation

- **What**: Ensures all required tools and operations are available
- **How**: Tests git operations and history access
- **Checks**:
  - Git is installed and accessible
  - Git history is available
  - Tag operations work correctly
  - Branch operations work correctly

### 3. Rollback Logic Tests

- **What**: Validates the rollback target selection logic
- **How**: Runs Python unit tests using pytest
- **Checks**:
  - Tag format validation (e.g., `deploy-YYYYMMDD-HHMMSS-hash`)
  - Tag sorting (newest first)
  - Rollback target selection with multiple tags
  - Fallback to 'main' when no tags exist
  - Manual rollback version override

### 4. Rollback Scenario Simulation

- **What**: Simulates actual rollback scenarios
- **How**: Creates mock deployment tags and tests rollback operations
- **Checks**:
  - Mock tag creation
  - Rollback target selection from tags
  - Git checkout operations
  - Cleanup of test data

### 5. Rollback Report Validation

- **What**: Ensures rollback reporting works correctly
- **How**: Tests report generation and formatting
- **Checks**:
  - Report template structure
  - Required sections present
  - Report formatting works with real values

## Workflow Triggers

The validation workflow runs:

- **On Pull Requests**: To `main` or `release/**` branches
- **On Push**: To `main` branch
- **Manual**: Via workflow_dispatch
- **Path-Based**: Only when relevant files change:
  - `.github/workflows/ai-agent-handoff-runbook.yml`
  - `.github/workflows/validate-rollback.yml`
  - `tests/test_rollback_validation.py`
  - `scripts/**`

## Test Structure

### Python Tests (`tests/test_rollback_validation.py`)

The test suite is organized into several test classes:

#### `TestRollbackTargetSelection`
Tests the logic for selecting which deployment to rollback to:
- Tag format validation
- Tag sorting (chronological)
- Target selection with multiple tags
- Fallback behavior when no tags exist
- Manual version override

#### `TestRollbackWorkflowValidation`
Validates the workflow file itself:
- Workflow file exists
- Contains rollback functionality
- Has required inputs and job definitions

#### `TestRollbackReportGeneration`
Tests the rollback report generation:
- Report template structure
- Required sections
- Formatting with actual values

#### `TestRollbackDependencies`
Tests system dependencies:
- Git availability
- Tag operations
- Component extraction from tags

## Running Tests Locally

### Prerequisites

```bash
pip install pytest pytest-asyncio pyyaml yamllint
```

### Run Rollback Validation Tests

```bash
# Run all rollback validation tests
cd tests
python -m pytest test_rollback_validation.py -v

# Run specific test class
python -m pytest test_rollback_validation.py::TestRollbackTargetSelection -v

# Run specific test
python -m pytest test_rollback_validation.py::TestRollbackTargetSelection::test_tag_format_validation -v
```

### Validate Workflow YAML

```bash
yamllint -d "{extends: default, rules: {line-length: {max: 200}, document-start: disable}}" \
  .github/workflows/ai-agent-handoff-runbook.yml
```

## CI Results

When the validation workflow runs, it provides:

1. **Job-by-Job Status**: Each validation check runs as a separate job
2. **Summary Report**: Aggregated results of all checks
3. **PR Comment**: Automated comment on the PR with validation results

### Sample PR Comment

```markdown
## ✅ Rollback Validation Results

| Check | Status |
|-------|--------|
| Workflow Syntax | ✅ success |
| Dependencies | ✅ success |
| Rollback Logic | ✅ success |
| Rollback Scenarios | ✅ success |
| Report Generation | ✅ success |

✅ **All rollback validation checks passed!** The rollback system is ready and functional.
```

## Rollback Tag Format

Deployment tags follow this format:
```
deploy-YYYYMMDD-HHMMSS-<commit-hash>
```

**Examples**:
- `deploy-20241210-120000-abc1234`
- `deploy-20241225-235959-xyz9876`

**Pattern**: `^deploy-\d{8}-\d{6}-[a-z0-9]+$`

## Rollback Target Selection Logic

The workflow uses this logic to select a rollback target (this is GitHub Actions syntax from the workflow file):

```yaml
# In .github/workflows/ai-agent-handoff-runbook.yml
- name: Find Last Successful Deployment
  run: |
    # If manual rollback with version specified
    if [ -n "${{ github.event.inputs.rollback_version }}" ]; then
      ROLLBACK_TAG="${{ github.event.inputs.rollback_version }}"
    else
      # Find last successful deployment tag (second newest)
      ROLLBACK_TAG=$(git tag -l "deploy-*" --sort=-version:refname | head -2 | tail -1)
      if [ -z "$ROLLBACK_TAG" ]; then
        ROLLBACK_TAG="main"  # Fallback to main branch
      fi
    fi
```

**Standalone Shell Script Equivalent:**

```bash
#!/bin/bash
# For use outside GitHub Actions

# Manual rollback version (can be set as environment variable)
MANUAL_ROLLBACK_VERSION="${ROLLBACK_VERSION:-}"

if [ -n "$MANUAL_ROLLBACK_VERSION" ]; then
  ROLLBACK_TAG="$MANUAL_ROLLBACK_VERSION"
else
  # Find last successful deployment tag (second newest)
  ROLLBACK_TAG=$(git tag -l "deploy-*" --sort=-version:refname | head -2 | tail -1)
  if [ -z "$ROLLBACK_TAG" ]; then
    ROLLBACK_TAG="main"
  fi
fi

echo "Rollback target: $ROLLBACK_TAG"
```

## Troubleshooting

### Workflow Syntax Validation Fails

**Problem**: YAML syntax errors in workflow file

**Solution**:
1. Run yamllint locally to identify specific errors
2. Fix syntax issues (often trailing spaces or indentation)
3. Validate again before committing

### Dependency Validation Fails

**Problem**: Git operations not working

**Solution**:
1. Ensure `fetch-depth: 0` is set in checkout action
2. Verify git is available in the runner
3. Check repository permissions

### Rollback Logic Tests Fail

**Problem**: Python tests failing

**Solution**:
1. Run tests locally with `-v` flag for details
2. Check test assertions match actual workflow logic
3. Update tests if workflow logic has changed

### Scenario Simulation Fails

**Problem**: Mock tag operations failing

**Solution**:
1. Check git history is accessible
2. Verify tag creation/deletion permissions
3. Ensure cleanup runs even on failure (use `if: always()`)

## Best Practices

1. **Keep Tests Synchronized**: Update tests whenever rollback logic changes
2. **Test Locally First**: Run tests locally before pushing changes
3. **Review Validation Results**: Check CI results before merging
4. **Document Changes**: Update this documentation when adding new validation checks
5. **Maintain Coverage**: Add tests for new rollback features

## Integration with AI Agent Handoff Runbook

The validation workflow works in conjunction with the AI Agent Handoff Runbook:

- **Validation**: Runs on PRs to verify rollback system
- **Execution**: AI Agent Handoff Runbook performs actual rollbacks in production
- **Feedback Loop**: Validation failures prevent merging broken rollback logic

## Future Enhancements

Potential improvements to the rollback validation system:

1. **Integration Tests**: Test actual Railway deployment rollback
2. **Health Check Validation**: Verify rollback health checks work
3. **Performance Testing**: Measure rollback speed
4. **Alert Testing**: Validate rollback alerts are sent correctly
5. **Multi-Environment**: Test rollback in staging before production

## Related Documentation

- [AI Agent Handoff Runbook](AI_AGENT_HANDOFF_RUNBOOK.md)
- [AI Agent Quick Reference](AI_AGENT_QUICK_REFERENCE.md)
- [GitHub Actions Workflows](../.github/workflows/)

## Maintainers

This validation system is maintained as part of the Quantum Pi Forge project and should be reviewed whenever:

- Rollback logic is modified
- Deployment tag format changes
- New rollback scenarios are identified
- CI/CD infrastructure is updated
