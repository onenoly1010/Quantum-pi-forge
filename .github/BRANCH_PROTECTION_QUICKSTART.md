# Branch Protection Quick Start Guide

This guide provides quick instructions for applying branch protection rules to the `main` branch.

## 🚀 Quick Start Options

Choose one of the following methods based on your preference and available tools:

### Option 1: Automated Script (Recommended) ⭐

#### For Linux/macOS:
```bash
cd /path/to/pi-forge-quantum-genesis
./.github/scripts/setup-branch-protection.sh
```

#### For Windows:
```powershell
cd C:\path\to\pi-forge-quantum-genesis
.\.github\scripts\setup-branch-protection.ps1
```

### Option 2: GitHub Actions Workflow

1. Go to the **Actions** tab in GitHub: https://github.com/onenoly1010/pi-forge-quantum-genesis/actions
2. Select **"Apply Branch Protection Rules"** workflow
3. Click **"Run workflow"**
4. Select options:
   - **Dry run**: Choose `false` to apply changes
   - **Branch**: Enter `main`
5. Click **"Run workflow"**

### Option 3: GitHub CLI

```bash
# Authenticate with GitHub
gh auth login

# Apply protection rules
cd /path/to/pi-forge-quantum-genesis
cat > /tmp/protection.json << 'EOF'
{
  "required_status_checks": {
    "strict": true,
    "contexts": [
      "Lint and Test",
      "Build and Package",
      "API Health Check",
      "healthcheck"
    ]
  },
  "enforce_admins": true,
  "required_pull_request_reviews": {
    "dismissal_restrictions": {},
    "dismiss_stale_reviews": true,
    "require_code_owner_reviews": true,
    "required_approving_review_count": 1,
    "require_last_push_approval": false,
    "bypass_pull_request_allowances": {}
  },
  "restrictions": null,
  "required_linear_history": true,
  "allow_force_pushes": false,
  "allow_deletions": false,
  "block_creations": false,
  "required_conversation_resolution": true,
  "lock_branch": false,
  "allow_fork_syncing": true
}
EOF

gh api \
  --method PUT \
  -H "Accept: application/vnd.github+json" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  /repos/onenoly1010/pi-forge-quantum-genesis/branches/main/protection \
  --input /tmp/protection.json
```

### Option 4: Manual Configuration (No CLI Required)

1. **Navigate to settings**: https://github.com/onenoly1010/pi-forge-quantum-genesis/settings/branches
2. **Click** "Add branch protection rule" (or edit existing)
3. **Branch name pattern**: `main`
4. **Configure**:
   - ☑️ Require a pull request before merging
     - Required approvals: `1`
     - ☑️ Dismiss stale pull request approvals
     - ☑️ Require review from Code Owners
   - ☑️ Require status checks to pass before merging
     - ☑️ Require branches to be up to date
     - Add: `Lint and Test`, `Build and Package`, `API Health Check`, `healthcheck`
   - ☑️ Require conversation resolution
   - ☑️ Require linear history
   - ☑️ Include administrators
   - ☐ Allow force pushes (keep **unchecked**)
   - ☐ Allow deletions (keep **unchecked**)
5. **Click** "Create" or "Save changes"

## ✅ Verify Configuration

After applying the rules, verify they're active:

### Via GitHub UI
Visit: https://github.com/onenoly1010/pi-forge-quantum-genesis/settings/branch_protection_rules

### Via GitHub CLI
```bash
gh api \
  -H "Accept: application/vnd.github+json" \
  /repos/onenoly1010/pi-forge-quantum-genesis/branches/main/protection \
  | jq .
```

### Test Protection
```bash
# This should fail
git checkout main
git commit --allow-empty -m "Test"
git push origin main
# Expected: Remote rejected (protected branch)
```

## 📋 What's Protected

Once applied, the `main` branch will have:

- ✅ **PR Reviews Required**: Minimum 1 approval
- ✅ **Status Checks Required**: All CI tests must pass
- ✅ **Code Owner Review**: CODEOWNERS must approve
- ✅ **Conversation Resolution**: All comments must be resolved
- ✅ **Linear History**: No merge commits allowed
- ✅ **Admin Enforcement**: Rules apply to everyone
- ✅ **Force Push Blocked**: Cannot force push
- ✅ **Delete Blocked**: Cannot delete branch

## 🔍 Status Checks

These CI/CD checks must pass before merging:

1. **Lint and Test** - Python linting and unit tests
2. **Build and Package** - Application build verification
3. **API Health Check** - Health endpoint validation
4. **healthcheck** - CI healthcheck workflow

## 📚 Additional Resources

- **Full Documentation**: [BRANCH_PROTECTION.md](.github/BRANCH_PROTECTION.md)
- **Configuration File**: [branch-protection-config.json](.github/branch-protection-config.json)
- **Code Owners**: [CODEOWNERS](.github/CODEOWNERS)
- **GitHub Docs**: [Branch Protection Rules](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)

## 🆘 Troubleshooting

### "gh: command not found"
Install GitHub CLI: https://cli.github.com/

### "403 Forbidden" or "Not Authorized"
Ensure you have admin access to the repository or use a Personal Access Token with `repo` scope.

### "Status check not found"
Open a test PR to trigger the workflows at least once, then add them as required checks.

### Need Help?
See the full documentation in [BRANCH_PROTECTION.md](.github/BRANCH_PROTECTION.md) for detailed troubleshooting steps.
