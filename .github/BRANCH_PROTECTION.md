# Branch Protection Configuration

This document describes the branch protection rules configured for the `main` branch of the Pi Forge Quantum Genesis repository.

## Overview

Branch protection rules ensure code quality and prevent accidental changes to the `main` branch. All changes must go through pull requests with proper reviews and status checks.

## Protection Rules Summary

### 1. Pull Request Requirements ✅

- **Require pull request reviews before merging**: Enabled
- **Minimum number of required approvals**: 1
- **Dismiss stale pull request approvals**: Yes
  - When new commits are pushed, old approvals are dismissed
- **Require review from code owners**: Yes
  - Code owners defined in `.github/CODEOWNERS` are automatically requested for review

### 2. Status Checks ✅

- **Require status checks to pass before merging**: Enabled
- **Require branches to be up to date before merging**: Yes
- **Required status checks**:
  - `Lint and Test` - Python linting and unit tests
  - `Build and Package` - Application build and packaging verification
  - `API Health Check` - FastAPI and Flask health endpoint tests
  - `healthcheck` - CI healthcheck workflow

### 3. Protection Rules ✅

- **Require conversation resolution before merging**: Enabled
  - All PR comments and review conversations must be resolved
- **Require linear history**: Enabled
  - Prevents merge commits, enforces rebase or squash merge
- **Include administrators**: Enabled
  - Repository administrators must also follow these rules

### 4. Security Settings ✅

- **Restrict who can push to matching branches**: Enabled
  - No direct pushes to `main` branch allowed
- **Do not allow bypassing the above settings**: Enabled
  - No bypass mechanisms for protection rules
- **Restrict force pushes**: Enabled
  - `git push --force` is blocked on `main` branch
- **Restrict deletions**: Enabled
  - The `main` branch cannot be deleted

### 5. Additional Recommendations

#### Signed Commits (Optional)
- **Status**: Recommended but not required
- **Purpose**: Enhanced security through GPG/SSH commit signing
- **Implementation**: Can be enabled in repository settings separately
- **Documentation**: https://docs.github.com/en/authentication/managing-commit-signature-verification

#### Code Owners
- **Status**: Implemented
- **File**: `.github/CODEOWNERS`
- **Purpose**: Automatic reviewer assignment based on file paths
- **Coverage**: All major code areas have assigned owners

## Implementation Methods

### Method 1: Automated Script (Recommended)

#### Using Bash (Linux/macOS)

```bash
# Make script executable
chmod +x .github/scripts/setup-branch-protection.sh

# Run the script
./.github/scripts/setup-branch-protection.sh
```

#### Using PowerShell (Windows)

```powershell
# Run the script
.\.github\scripts\setup-branch-protection.ps1
```

**Prerequisites**:
- GitHub CLI (`gh`) installed and authenticated, OR
- `GITHUB_TOKEN` environment variable with `repo` scope

### Method 2: GitHub CLI

```bash
# Authenticate with GitHub
gh auth login

# Apply protection rules
gh api \
  --method PUT \
  -H "Accept: application/vnd.github+json" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  /repos/onenoly1010/pi-forge-quantum-genesis/branches/main/protection \
  --input .github/branch-protection-config.json
```

### Method 3: GitHub API (curl)

```bash
# Set your GitHub token
export GITHUB_TOKEN="your_token_here"

# Apply protection rules
curl -X PUT \
  -H "Accept: application/vnd.github+json" \
  -H "Authorization: Bearer $GITHUB_TOKEN" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  https://api.github.com/repos/onenoly1010/pi-forge-quantum-genesis/branches/main/protection \
  -d @.github/branch-protection-config.json
```

### Method 4: Manual Configuration (GitHub UI)

1. Navigate to repository settings: https://github.com/onenoly1010/pi-forge-quantum-genesis/settings/branches
2. Click "Add branch protection rule" (or edit existing rule)
3. Enter branch name pattern: `main`
4. Configure settings:
   - ☑️ Require a pull request before merging
     - Required approvals: `1`
     - ☑️ Dismiss stale pull request approvals when new commits are pushed
     - ☑️ Require review from Code Owners
   - ☑️ Require status checks to pass before merging
     - ☑️ Require branches to be up to date before merging
     - Search and add status checks:
       - `Lint and Test`
       - `Build and Package`
       - `API Health Check`
       - `healthcheck`
   - ☑️ Require conversation resolution before merging
   - ☑️ Require linear history
   - ☑️ Include administrators
   - ☐ Allow force pushes (keep unchecked)
   - ☐ Allow deletions (keep unchecked)
5. Click "Create" or "Save changes"

## Verification

After applying the branch protection rules, verify the configuration:

### Via GitHub UI
Visit: https://github.com/onenoly1010/pi-forge-quantum-genesis/settings/branch_protection_rules

### Via GitHub CLI
```bash
gh api \
  -H "Accept: application/vnd.github+json" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  /repos/onenoly1010/pi-forge-quantum-genesis/branches/main/protection
```

### Via GitHub API
```bash
curl -H "Accept: application/vnd.github+json" \
  -H "Authorization: Bearer $GITHUB_TOKEN" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  https://api.github.com/repos/onenoly1010/pi-forge-quantum-genesis/branches/main/protection
```

## Testing Protection Rules

To verify the protection rules are working:

1. **Test Direct Push Prevention**:
   ```bash
   # This should fail
   git checkout main
   git commit --allow-empty -m "Test commit"
   git push origin main
   # Expected: Remote rejected (protected branch)
   ```

2. **Test Force Push Prevention**:
   ```bash
   # This should fail
   git push --force origin main
   # Expected: Remote rejected (protected branch)
   ```

3. **Test Pull Request Flow**:
   ```bash
   # Create a feature branch
   git checkout -b test-branch-protection
   echo "test" > test.txt
   git add test.txt
   git commit -m "Test branch protection"
   git push origin test-branch-protection
   
   # Open a PR via GitHub UI or CLI
   gh pr create --base main --head test-branch-protection
   
   # Verify that:
   # - PR requires approval
   # - Status checks must pass
   # - Conversations must be resolved
   ```

## CI/CD Integration

The following GitHub Actions workflows are configured as required status checks:

### test-and-build.yml
- **Jobs**: `lint-and-test`, `build-and-package`, `health-check`
- **Purpose**: Ensures code quality, successful builds, and health check functionality
- **Trigger**: Pull requests to `main` branch

### ci-healthcheck.yml
- **Jobs**: `healthcheck`
- **Purpose**: Validates health endpoints functionality
- **Trigger**: Pull requests to `main` branch

All status checks must pass before a pull request can be merged.

## CODEOWNERS Configuration

The `.github/CODEOWNERS` file defines code ownership for automatic reviewer assignment:

- **Repository Owner**: @onenoly1010
- **Workflows & CI/CD**: @onenoly1010
- **Infrastructure**: @onenoly1010
- **Server Code**: @onenoly1010
- **Frontend Code**: @onenoly1010
- **Documentation**: @onenoly1010
- **Security Files**: @onenoly1010
- **Canon Configuration**: @onenoly1010

To modify code ownership, edit `.github/CODEOWNERS` and commit the changes.

## Troubleshooting

### Issue: Status checks not appearing
**Solution**: Ensure the GitHub Actions workflows have run at least once. Open a test PR to trigger the workflows.

### Issue: Cannot apply protection rules via script
**Solution**: 
- Verify GitHub CLI is authenticated: `gh auth status`
- Verify token has `repo` scope
- Try manual configuration via GitHub UI

### Issue: PR cannot be merged despite passing checks
**Possible causes**:
- Stale approvals (push new commits after approval)
- Unresolved conversations
- Branch not up to date with base branch
- Administrator restrictions enabled

### Issue: Need to bypass protection temporarily
**Solution**: Branch protection can be temporarily disabled by administrators in repository settings. This should only be done in emergency situations.

## References

- [GitHub Branch Protection Documentation](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)
- [GitHub API - Branch Protection](https://docs.github.com/en/rest/branches/branch-protection)
- [CODEOWNERS Documentation](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners)
- [Required Status Checks](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/collaborating-on-repositories-with-code-quality-features/about-status-checks)

## Maintenance

- **Review Period**: Quarterly
- **Next Review**: TBD
- **Responsible Party**: Repository maintainers
- **Update Process**: 
  1. Review effectiveness of current rules
  2. Update configuration files as needed
  3. Re-apply rules using automated scripts
  4. Document changes in this file

## Changelog

### 2025-12-13
- Initial branch protection configuration
- Created automated setup scripts (Bash and PowerShell)
- Created CODEOWNERS file
- Configured required status checks
- Documented all protection rules and implementation methods
