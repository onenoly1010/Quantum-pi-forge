# 🤖 AI Agent Quick Reference Card

## Quantum Pi Forge - Autonomous Runbook Commands

### 🚀 Deploy to Production
```bash
gh workflow run "ai-agent-handoff-runbook.yml" \
  --field action=full-deployment
```

### 🏥 Health Check Only
```bash
gh workflow run "ai-agent-handoff-runbook.yml" \
  --field action=health-check
```

### 🔄 Rollback to Previous
```bash
# Automatic rollback to last known good
gh workflow run "ai-agent-handoff-runbook.yml" \
  --field action=rollback

# Rollback to specific version
gh workflow run "ai-agent-handoff-runbook.yml" \
  --field action=rollback \
  --field rollback_version="deploy-20241210-120000-abc1234"
```

### 🔧 Update Component
```bash
# Update FastAPI
gh workflow run "ai-agent-handoff-runbook.yml" \
  --field action=update-component \
  --field target_component=fastapi

# Update all components
gh workflow run "ai-agent-handoff-runbook.yml" \
  --field action=update-component \
  --field target_component=all
```

### 🚨 Emergency Stop
```bash
gh workflow run "ai-agent-handoff-runbook.yml" \
  --field action=emergency-stop
```

---

## 📊 Monitor & Track

### View Recent Runs
```bash
gh run list --workflow=ai-agent-handoff-runbook.yml --limit 10
```

### Watch Live Run
```bash
gh run watch <run-id>
```

### Check Status Issue
```bash
# Find the tracking issue
gh issue list --label ai-agent,automated,runbook

# View specific issue
gh issue view <issue-number>
```

### Download Reports
```bash
# Download all artifacts from a run
gh run download <run-id>

# Download specific artifact
gh run download <run-id> --name monitoring-report
gh run download <run-id> --name deployment-record
gh run download <run-id> --name rollback-report
```

---

## 🎯 Quick Status Check

### One-Liner Status
```bash
gh run list --workflow=ai-agent-handoff-runbook.yml --limit 1 --json status,conclusion,headBranch
```

### Health Status from Issue
```bash
gh issue view $(gh issue list --label ai-agent --json number --jq '.[0].number')
```

### Latest Deployment Info
```bash
gh run view $(gh run list --workflow=ai-agent-handoff-runbook.yml --limit 1 --json databaseId --jq '.[0].databaseId')
```

---

## 🔍 Troubleshooting

### Check Workflow Logs
```bash
gh run view <run-id> --log
```

### View Failed Jobs
```bash
gh run view <run-id> --log-failed
```

### Re-run Failed Jobs
```bash
gh run rerun <run-id> --failed
```

### Re-run Entire Workflow
```bash
gh run rerun <run-id>
```

---

## 📋 Workflow Job Sequence

```
1. 🛡️  Safety Gate        → Validates deployment safety
2. 🔧 CI Pipeline         → Build, lint, test, package
3. 🚀 Deployment          → Deploy to production
4. 📊 Monitoring          → Health checks & metrics
5. 🔄 Rollback (if fail)  → Automatic recovery
6. 📢 Communication       → Updates & alerts
```

---

## 🎨 Status Indicators

| Emoji | Status | Meaning |
|-------|--------|---------|
| 🟢 | success | All systems operational |
| 🔴 | failed | Critical failure detected |
| 🟡 | blocked | Safety gate prevented deployment |
| 🔄 | rolled_back | System recovered via rollback |
| ⏭️ | skipped | Job not needed for this run |
| ⚠️ | warning | Non-critical issues detected |

---

## 🔐 Required Secrets

### Essential (for production)
- `GITHUB_TOKEN` - Auto-provided by GitHub
- `RAILWAY_TOKEN` - For Railway deployments (if used)
- `SUPABASE_URL` - Database connection
- `SUPABASE_KEY` - Database authentication

### Optional (for notifications)
- `SLACK_WEBHOOK_URL` - Slack alerts
- `DISCORD_WEBHOOK_URL` - Discord alerts

---

## ⚡ Auto-Triggers

### Scheduled
- **Every 6 hours**: Health check only (no deployment)
- **Cron**: `0 */6 * * *`

### On Push
- **Branch**: `main` or `release/**`
- **Action**: Full deployment pipeline

### On Pull Request
- **Target**: `main`
- **Action**: CI pipeline only (no deployment)

---

## 📦 Artifacts Generated

### Always Created
- `workflow-summary` - Final execution report
- `safety-gate-report` - Pre-flight check results

### On Successful Deployment
- `deployment-package` - Ready-to-deploy bundle
- `deployment-record` - Deployment metadata (JSON)
- `monitoring-report` - Health check results

### On Rollback
- `rollback-report` - Rollback execution details

---

## 🎓 Best Practices

1. **Before Risky Changes**: Note current deployment tag
   ```bash
   git tag -l "deploy-*" --sort=-version:refname | head -1
   ```

2. **After Deployment**: Wait for monitoring to complete
   ```bash
   sleep 120 && gh run view <run-id>
   ```

3. **Before Updates**: Run health check first
   ```bash
   gh workflow run ... --field action=health-check
   ```

4. **On Failures**: Check artifacts before retrying
   ```bash
   gh run download <run-id>
   ```

5. **Regular Reviews**: Check status issue weekly
   ```bash
   gh issue view <tracking-issue-number>
   ```

---

## 📚 Documentation

- **Full Guide**: `docs/AI_AGENT_HANDOFF_RUNBOOK.md`
- **Rollback Validation**: `docs/ROLLBACK_VALIDATION.md`
- **Automation**: `docs/automation.md`
- **Production**: `docs/PRODUCTION_DEPLOYMENT.md`
- **Workflow File**: `.github/workflows/ai-agent-handoff-runbook.yml`

---

## 🆘 Emergency Contacts

If autonomous operations fail critically:
1. Check GitHub issue for status
2. Review latest workflow run
3. Contact repository maintainer if unrecoverable

---

*Keep this card handy for quick autonomous operations!*
*Version: 1.0.0 | Updated: 2024-12-10*
