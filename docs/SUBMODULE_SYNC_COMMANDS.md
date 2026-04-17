# Git Submodule Sync Commands
# For Quantum Pi Forge 3 Submodules

## ✅ SAFE ONE-TIME SUBMODULE RESET
# Run this if submodules are out of sync, broken, or showing dirty status
# This will completely reset all submodules to their correct committed state

```bash
# 1. First clean any local changes in submodules
git submodule foreach --recursive git reset --hard HEAD
git submodule foreach --recursive git clean -fdx

# 2. Sync all submodule URLs
git submodule sync --recursive

# 3. Force update to exact commit recorded in parent repo
git submodule update --init --recursive --force

# 4. Verify status
git submodule status
```

---

## 🚀 UPDATE ALL SUBMODULES TO LATEST MAIN BRANCH
# Run this when you want to pull the latest changes from all submodules

```bash
# Pull latest main for every submodule
git submodule foreach --recursive 'git checkout main && git pull origin main'

# After this, you will see changes in git status
# Review and commit the new submodule revisions:
git status
git add path/to/submodule1 path/to/submodule2 path/to/submodule3
git commit -m "sync: update all submodules to latest main"
```

---

## 🔍 TROUBLESHOOTING SUBMODULE ISSUES

### If submodules show as modified but you didn't touch them:
```bash
git submodule update --recursive
```

### If you get 'permission denied' when pulling submodules:
```bash
# Re-init with correct URLs
git submodule deinit --all -f
git submodule init
git submodule update --recursive
```

### To completely remove and re-add all submodules (last resort):
```bash
git submodule deinit --all -f
rm -rf .git/modules
git submodule update --init --recursive
```

---

## ✅ CI/CD WORKFLOW SUBMODULE HANDLING
The production deployment workflow already includes automatic submodule sync:
- Uses `actions/checkout@v4` with `submodules: recursive`
- Runs full sync and verification before every deployment
- Always pulls correct commit version recorded in main branch

---

## 📋 SUBMODULE BEST PRACTICES
1.  **Never commit directly inside a submodule** - always work in the submodule's own repository
2.  Always run `git submodule status` after pulling to verify submodule state
3.  When updating submodules, test the combination before pushing parent repo
4.  Always commit submodule updates separately from code changes