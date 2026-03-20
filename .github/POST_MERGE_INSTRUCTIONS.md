# Post-Merge Instructions: Branch Protection Setup

## 🎉 PR Merged - Next Steps

This PR has added all the necessary configuration files and scripts for branch protection. However, **the branch protection rules are not yet active** on the `main` branch.

### Why Manual Application is Required

Branch protection rules must be applied through GitHub's API or UI. This cannot be done automatically through a PR merge because:
1. It requires special permissions (repository admin)
2. It cannot be included in repository files (unlike workflow files)
3. It's a repository-level setting, not a code change

## 🚀 Quick Setup (Choose One Method)

### Method 1: Automated Script (Recommended) ⭐

**For Linux/macOS:**
```bash
cd /path/to/pi-forge-quantum-genesis
./.github/scripts/setup-branch-protection.sh
```

**For Windows:**
```powershell
cd C:\path\to\pi-forge-quantum-genesis
.\.github\scripts\setup-branch-protection.ps1
```

**Requirements:**
- GitHub CLI (`gh`) installed and authenticated, OR
- `GITHUB_TOKEN` environment variable with `repo` scope

### Method 2: GitHub Actions Workflow

1. Go to: https://github.com/onenoly1010/pi-forge-quantum-genesis/actions
2. Select **"Apply Branch Protection Rules"** workflow
3. Click **"Run workflow"**
4. Ensure **dry_run** is set to `false`
5. Click **"Run workflow"** button

**Requirements:**
- Either default `GITHUB_TOKEN` with sufficient permissions, OR
- `ADMIN_TOKEN` repository secret configured with `repo` scope

### Method 3: Manual GitHub UI

1. Navigate to: https://github.com/onenoly1010/pi-forge-quantum-genesis/settings/branches
2. Click **"Add branch protection rule"** (or edit existing)
3. Branch name pattern: `main`
4. Enable all the settings listed in `.github/BRANCH_PROTECTION_QUICKSTART.md`
5. Click **"Create"** or **"Save changes"**

See detailed steps in `.github/BRANCH_PROTECTION_QUICKSTART.md`

## ✅ Verification

After applying the rules, verify they are active:

### Via GitHub UI
Visit: https://github.com/onenoly1010/pi-forge-quantum-genesis/settings/branch_protection_rules

You should see a rule for `main` with all protections enabled.

### Via Command Line
```bash
gh api /repos/onenoly1010/pi-forge-quantum-genesis/branches/main/protection \
  | jq .required_pull_request_reviews.required_approving_review_count
```

Should return: `1`

### Test Protection
Try to push directly to main (this should fail):
```bash
git checkout main
git commit --allow-empty -m "Test protection"
git push origin main
```

Expected error:
```
! [remote rejected] main -> main (protected branch hook declined)
```

## 📋 What Protection Rules Will Be Active

Once applied, the following rules will be enforced on the `main` branch:

- ✅ **Pull Request Reviews**: Minimum 1 approval required
- ✅ **Code Owner Review**: CODEOWNERS must approve changes
- ✅ **Dismiss Stale Reviews**: New commits dismiss previous approvals
- ✅ **Status Checks**: All CI/CD checks must pass
  - Lint and Test
  - Build and Package
  - API Health Check
  - healthcheck
- ✅ **Branches Up to Date**: Must be current with main before merging
- ✅ **Conversation Resolution**: All PR comments must be resolved
- ✅ **Linear History**: No merge commits allowed (rebase or squash)
- ✅ **Administrator Enforcement**: Rules apply to everyone
- ✅ **Force Push Blocked**: Cannot use `git push --force`
- ✅ **Branch Deletion Blocked**: Cannot delete main branch

## 🔧 Troubleshooting

### "403 Forbidden" or "Not Authorized"
**Solution**: Ensure you have admin access to the repository. If using a token, verify it has the `repo` scope.

### "gh: command not found"
**Solution**: Install GitHub CLI from https://cli.github.com/

### Status checks not appearing in dropdown
**Solution**: Status checks must run at least once before they can be added as required. Open a test PR to trigger the workflows.

### Need to make emergency changes to main
**Solution**: Repository administrators can temporarily disable branch protection in the settings. Re-enable after emergency is resolved.

## 📚 Additional Resources

- **Quick Start Guide**: `.github/BRANCH_PROTECTION_QUICKSTART.md`
- **Full Documentation**: `.github/BRANCH_PROTECTION.md`
- **Configuration Details**: `.github/branch-protection-config.json`
- **Code Ownership**: `.github/CODEOWNERS`

## 🆘 Need Help?

If you encounter issues:
1. Check the troubleshooting section in `.github/BRANCH_PROTECTION.md`
2. Review the workflow run logs (if using GitHub Actions method)
3. Verify your token permissions
4. Open an issue in the repository

## 📝 Important Notes

- **This is a one-time setup**: Once applied, the rules persist until manually changed
- **Rules can be updated**: Re-run any setup method to update protection rules
- **Administrators can bypass**: But this should only be done in emergencies
- **Status checks are automatic**: They will run on every PR to main
- **CODEOWNERS are automatically tagged**: No manual reviewer assignment needed

## ✨ Benefits You'll Get

Once branch protection is active:

1. **Higher Code Quality**: All changes reviewed before merging
2. **Better Security**: No unauthorized direct pushes
3. **Cleaner History**: Linear history makes tracking changes easier
4. **Automated Workflows**: CI/CD checks run automatically
5. **Team Collaboration**: Enforces best practices for everyone
6. **Audit Trail**: All changes tracked through PRs

---

**Remember**: These settings protect the `main` branch and ensure all changes go through proper review and testing. This is a best practice for any production repository!

🎯 **Action Required**: Choose one of the methods above and apply the branch protection rules now.
