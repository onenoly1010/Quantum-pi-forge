# 🤖 AI Agent Handoff & Autonomous Runbook

## Overview

The **AI Agent Handoff & Autonomous Runbook** is a comprehensive GitHub Actions workflow designed to enable AI agents to autonomously deploy, monitor, update, and maintain the Quantum Pi Forge system without human intervention. This workflow implements industry best practices for CI/CD, monitoring, rollback, and communication.

## Table of Contents

1. [Key Features](#key-features)
2. [Workflow Architecture](#workflow-architecture)
3. [Usage Guide for AI Agents](#usage-guide-for-ai-agents)
4. [Workflow Jobs Explained](#workflow-jobs-explained)
5. [Safety Gates & Guardrails](#safety-gates--guardrails)
6. [Monitoring & Health Checks](#monitoring--health-checks)
7. [Rollback Procedures](#rollback-procedures)
8. [Communication Templates](#communication-templates)
9. [Troubleshooting](#troubleshooting)
10. [Advanced Configuration](#advanced-configuration)

---

## Key Features

### ✅ Comprehensive CI/CD Pipeline
- **Automated Testing**: Lint checks, unit tests with coverage
- **Build Verification**: Module imports, dependency validation
- **Packaging**: Deployment package creation with metadata

### 🛡️ Safety Gates
- **Pre-flight Checks**: Critical file validation, breaking change detection
- **Environment Health**: Production status verification
- **Deployment Approval**: Automatic blocking on critical issues

### 📊 Post-Deployment Monitoring
- **Health Checks**: Comprehensive system validation
- **Performance Metrics**: Resource usage, file counts
- **Status Tracking**: Real-time monitoring with alerts

### 🔄 Automatic Rollback
- **Failure Detection**: Monitors deployment and health status
- **Smart Recovery**: Automatic rollback to last known good state
- **Manual Override**: Support for manual rollback with version specification

### 📢 Communication & Reporting
- **GitHub Issues**: Auto-updating status issue for tracking
- **Webhook Notifications**: Slack/Discord alerts on failures
- **Comprehensive Reports**: Detailed artifacts for every run

---

## Workflow Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                   AI AGENT AUTONOMOUS RUNBOOK                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────┐                                          │
│  │  1. SAFETY GATE  │  ← Pre-flight checks, approval logic     │
│  └────────┬─────────┘                                          │
│           │                                                     │
│           ▼                                                     │
│  ┌──────────────────┐                                          │
│  │  2. CI PIPELINE  │  ← Build, Lint, Test, Package            │
│  └────────┬─────────┘                                          │
│           │                                                     │
│           ▼                                                     │
│  ┌──────────────────┐                                          │
│  │  3. DEPLOYMENT   │  ← Deploy to production (Railway)        │
│  └────────┬─────────┘                                          │
│           │                                                     │
│           ▼                                                     │
│  ┌──────────────────┐                                          │
│  │  4. MONITORING   │  ← Health checks, metrics collection     │
│  └────────┬─────────┘                                          │
│           │                                                     │
│           ▼                                                     │
│  ┌──────────────────┐                                          │
│  │  5. ROLLBACK     │  ← Automatic recovery (if needed)        │
│  └────────┬─────────┘                                          │
│           │                                                     │
│           ▼                                                     │
│  ┌──────────────────┐                                          │
│  │  6. COMMUNICATION│  ← Status updates, notifications         │
│  └──────────────────┘                                          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Usage Guide for AI Agents

### Triggering the Workflow

The workflow can be triggered in multiple ways:

#### 1. Automatic Triggers

**On Push to Main/Release Branches**:
```bash
git push origin main
# Workflow automatically runs full deployment
```

**On Pull Request**:
```bash
# PR to main triggers CI pipeline only (no deployment)
```

**Scheduled Health Checks**:
```
# Runs every 6 hours automatically
# Performs health checks only, no deployment
```

#### 2. Manual Triggers

**Full Deployment**:
```bash
gh workflow run "ai-agent-handoff-runbook.yml" \
  --field action=full-deployment
```

**Health Check Only**:
```bash
gh workflow run "ai-agent-handoff-runbook.yml" \
  --field action=health-check
```

**Rollback to Previous Version**:
```bash
gh workflow run "ai-agent-handoff-runbook.yml" \
  --field action=rollback \
  --field rollback_version="deploy-20241210-120000-abc1234"
```

**Update Specific Component**:
```bash
gh workflow run "ai-agent-handoff-runbook.yml" \
  --field action=update-component \
  --field target_component=fastapi
```

**Emergency Stop**:
```bash
gh workflow run "ai-agent-handoff-runbook.yml" \
  --field action=emergency-stop
```

### Monitoring Workflow Execution

**View Active Runs**:
```bash
gh run list --workflow=ai-agent-handoff-runbook.yml
```

**Watch Live Run**:
```bash
gh run watch <run-id>
```

**View Run Details**:
```bash
gh run view <run-id>
```

**Download Artifacts**:
```bash
# Download all artifacts
gh run download <run-id>

# Download specific artifact
gh run download <run-id> --name monitoring-report
```

---

## Workflow Jobs Explained

### Job 1: Safety Gate & Pre-flight Checks

**Purpose**: Validate that deployment is safe to proceed

**Checks Performed**:
- ✅ Critical files exist (main.py, app.py, Dockerfile, etc.)
- ✅ No breaking changes in recent commits
- ✅ Environment health status
- ✅ Scheduled vs. deployment run detection

**Outputs**:
- `deployment_approved`: Boolean indicating if deployment should proceed
- `environment_healthy`: Boolean indicating environment status
- `skip_deployment`: Boolean for health-check-only runs

**Success Criteria**:
- All critical files present
- No breaking changes detected
- Environment healthy

### Job 2: CI Pipeline - Build, Lint, Test

**Purpose**: Ensure code quality and functionality

**Steps**:
1. **Lint Check**: Flake8 critical errors (must pass)
2. **Code Quality**: Flake8 style checks (warnings only)
3. **Unit Tests**: pytest with coverage reporting
4. **Build Verification**: Module import tests
5. **Packaging**: Create deployment package with metadata

**Outputs**:
- `build_success`: Boolean indicating build status
- `test_coverage`: Coverage level (full/partial)

**Artifacts**:
- `deployment-package`: Ready-to-deploy application bundle

**Success Criteria**:
- No critical lint errors
- Tests pass (allows partial failures)
- All modules import successfully
- Deployment package created

### Job 3: Deployment

**Purpose**: Deploy application to production environment

**Conditions**:
- Safety gate approved
- CI pipeline successful
- Not a health-check-only run

**Steps**:
1. Download deployment package
2. Create deployment tag (format: `deploy-YYYYMMDD-HHMMSS-SHA`)
3. Deploy to Railway (or configured platform)
4. Wait for stabilization period (30 seconds)
5. Record deployment details

**Outputs**:
- `deployment_url`: Production URL
- `deployment_id`: Unique deployment identifier

**Artifacts**:
- `deployment-record`: JSON with deployment metadata

**Success Criteria**:
- Deployment initiated successfully
- Stabilization period completed

### Job 4: Post-Deployment Monitoring

**Purpose**: Verify system health after deployment

**Runs On**:
- After successful deployment
- Manual health check trigger
- Scheduled runs (every 6 hours)

**Checks Performed**:
1. **Module Imports**: FastAPI, Flask app imports
2. **Critical Files**: Presence of essential files
3. **File Sizes**: Validate no oversized files
4. **Performance Metrics**: Disk usage, file counts

**Health Status Levels**:
- `healthy`: All checks passed
- `warning`: Non-critical issues detected
- `degraded`: Critical issues found

**Outputs**:
- `health_status`: Current system health
- `metrics_status`: Metrics collection status

**Artifacts**:
- `monitoring-report`: Detailed health report (Markdown)

### Job 5: Automatic Rollback

**Purpose**: Recover from failed deployments automatically

**Trigger Conditions**:
- Deployment job failed
- Health status is "degraded"
- Manual rollback requested

**Steps**:
1. Find rollback target (last successful deployment or manual version)
2. Execute rollback deployment
3. Send emergency alerts
4. Generate rollback report

**Rollback Target Selection**:
- **Manual**: Use specified `rollback_version` input
- **Automatic**: Find last successful deployment tag

**Artifacts**:
- `rollback-report`: Details of rollback execution

**Success Criteria**:
- Rollback target identified
- Deployment reverted successfully
- Alerts sent

### Job 6: Communication & Reporting

**Purpose**: Update status and notify stakeholders

**Runs**: Always (even if previous jobs fail)

**Actions**:
1. **Collect Statuses**: Aggregate all job results
2. **Update GitHub Issue**: Create/update tracking issue
3. **Send Webhooks**: Notify Slack/Discord on failures
4. **Generate Summary**: Comprehensive workflow report

**Communication Channels**:
- **GitHub Issue**: Persistent status tracking (label: `ai-agent`)
- **Slack**: Real-time alerts (requires `SLACK_WEBHOOK_URL` secret)
- **Discord**: Real-time alerts (requires `DISCORD_WEBHOOK_URL` secret)
- **GitHub Summary**: Per-run summary page

**Artifacts**:
- `workflow-summary`: Final execution summary

---

## Safety Gates & Guardrails

### Pre-Deployment Safety Checks

The workflow implements multiple safety layers to prevent dangerous deployments:

#### Critical File Validation
```yaml
Critical Files Checked:
- server/main.py           # FastAPI application
- server/app.py            # Flask application
- server/requirements.txt  # Python dependencies
- Dockerfile              # Container configuration
- railway.toml            # Deployment configuration
```

**Failure Impact**: Deployment blocked if any critical file missing

#### Breaking Change Detection
```bash
# Scans last 5 commit messages for keywords:
- "breaking change"
- "major change"
- "unsafe"
```

**Failure Impact**: Deployment blocked, requires manual approval

#### Environment Health Check
```
Validates:
- Production environment accessible
- Previous deployment healthy
- No ongoing incidents
```

**Failure Impact**: Warning issued, deployment may proceed with caution

### Runtime Safety Features

#### Deployment Approval Gates
- **Automatic Approval**: Normal code changes
- **Manual Approval**: Breaking changes detected
- **Emergency Stop**: Immediate halt via workflow input

#### Stabilization Period
```
Post-Deployment Wait: 30 seconds
Purpose: Allow services to start and stabilize
Monitored: Process startup, health endpoints
```

#### Health Degradation Detection
```
Monitored Metrics:
- Module import success
- File integrity
- System resources
```

**Action on Degradation**: Automatic rollback triggered

---

## Monitoring & Health Checks

### Comprehensive Health Checks

#### 1. Module Import Tests
```python
# FastAPI Module
python -c "import sys; sys.path.insert(0, 'server'); from main import app"

# Flask Module
python -c "import sys; sys.path.insert(0, 'server'); from app import app"
```

**Purpose**: Verify core applications can load
**Frequency**: Every deployment, every 6 hours
**Failure Action**: Health status set to "degraded", rollback triggered

#### 2. Critical File Validation
```
Checked Files:
- server/main.py
- server/app.py
- index.html
- server/requirements.txt
```

**Purpose**: Ensure essential files present
**Frequency**: Every run
**Failure Action**: Health status degraded

#### 3. File Size Monitoring
```
Threshold: 1 MB per file
Scope: All Python source files
Action: Warning if oversized files found
```

**Purpose**: Maintain Pi Studio package compliance
**Frequency**: Every CI run

#### 4. Performance Metrics Collection
```json
Metrics Collected:
{
  "timestamp": "ISO-8601",
  "disk_usage_mb": "integer",
  "file_count": "integer",
  "python_files": "integer",
  "test_files": "integer"
}
```

**Purpose**: Track system resource usage
**Frequency**: Every monitoring run
**Storage**: Uploaded as artifact

### Health Status Levels

| Status | Meaning | Actions |
|--------|---------|---------|
| **healthy** | All checks passed | Continue normal operation |
| **warning** | Non-critical issues | Continue with monitoring |
| **degraded** | Critical failures | Trigger automatic rollback |

### Monitoring Schedule

```
Automatic Runs:
- Every 6 hours (cron: '0 */6 * * *')
- After each deployment
- On manual trigger

On-Demand:
- gh workflow run (action=health-check)
```

---

## Rollback Procedures

### Automatic Rollback

The workflow automatically rolls back when:
1. **Deployment Fails**: Job returns failure status
2. **Health Degraded**: Post-deployment health check fails
3. **Manual Trigger**: Explicit rollback action

### Rollback Process

```
1. Identify Rollback Target
   ├─ Manual: Use specified version tag
   └─ Automatic: Find last successful deployment
   
2. Checkout Rollback Version
   ├─ Git checkout to target tag
   └─ Verify code integrity
   
3. Execute Deployment
   ├─ Deploy to production environment
   └─ Wait for stabilization
   
4. Verify Health
   ├─ Run health checks
   └─ Confirm recovery
   
5. Generate Alerts
   ├─ Update GitHub issue
   ├─ Send webhook notifications
   └─ Create rollback report
```

### Rollback Target Selection

**Automatic Mode**:
```bash
# Finds last successful deployment tag
git tag -l "deploy-*" --sort=-version:refname | head -2 | tail -1
```

**Manual Mode**:
```bash
# Use specified version
gh workflow run "ai-agent-handoff-runbook.yml" \
  --field action=rollback \
  --field rollback_version="deploy-20241210-120000-abc1234"
```

### Deployment Tag Format

```
deploy-YYYYMMDD-HHMMSS-SHA

Example:
deploy-20241210-143022-abc1234
│      │        │      └─ Git SHA (short)
│      │        └─ Time (HHMMSS)
│      └─ Date (YYYYMMDD)
└─ Prefix
```

### Rollback Report

Generated for every rollback execution:

```markdown
# 🔄 Rollback Report

**Run ID**: 123456789
**Timestamp**: 2024-12-10 14:30:22 UTC
**Rollback Target**: deploy-20241210-120000-abc1234

## Reason
- Deployment Status: failure
- Health Status: degraded
- Manual Trigger: false

## Actions Taken
1. ✅ Identified rollback target
2. ✅ Executed rollback deployment
3. ✅ Generated alert

## Next Steps
1. Investigate deployment failure
2. Fix issues in development
3. Retest before next deployment
```

---

## Communication Templates

### GitHub Issue Template

The workflow maintains a persistent GitHub issue for status tracking:

```markdown
# 🤖 AI AGENT AUTONOMOUS RUNBOOK STATUS

**Last Updated**: 2024-12-10T14:30:22Z
**Run**: #123456789
**Trigger**: push
**Branch**: main

## Job Status Summary

| Job | Status | Result |
|-----|--------|--------|
| 🛡️ Safety Gate | success | ✅ Approved |
| 🔧 CI Pipeline | success | ✅ Success |
| 🚀 Deployment | success | ✅ Deployed |
| 📊 Monitoring | success | healthy |
| 🔄 Rollback | skipped | ⏭️ Not Needed |

## System Health

- **FastAPI Quantum Conduit** (Port 8000): ✅ healthy
- **Flask Glyph Weaver** (Port 5000): ✅ healthy
- **Gradio Truth Mirror** (Port 7860): ✅ healthy

## AI Agent Instructions

### For Monitoring
[Commands for checking status]

### For Rollback
[Commands for rollback]

### For Updates
[Commands for updates]
```

**Issue Labels**: `ai-agent`, `automated`, `runbook`

### Slack Notification Template

```json
{
  "text": "🤖 AI Agent Autonomous Runbook Alert",
  "blocks": [
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": "*Status:* failed\n*Repository:* org/repo\n<https://github.com/org/repo/actions/runs/123|View Details>"
      }
    }
  ]
}
```

**Trigger Conditions**:
- Health status: degraded
- Deployment: failure
- Rollback: executed

### Discord Notification Template

```json
{
  "content": "🤖 **AI Agent Autonomous Runbook Alert**",
  "embeds": [{
    "title": "Status: failed",
    "url": "https://github.com/org/repo/actions/runs/123",
    "color": 5814783,
    "fields": [
      {"name": "Repository", "value": "org/repo", "inline": true},
      {"name": "Status", "value": "failed", "inline": true}
    ]
  }]
}
```

**Trigger Conditions**: Same as Slack

### Workflow Summary Template

Generated at end of every run:

```markdown
# 🤖 AI Agent Autonomous Runbook - Final Summary

**Run ID**: 123456789
**Timestamp**: 2024-12-10 14:30:22 UTC
**Overall Status**: success

## Execution Flow

1. ✅ Safety Gate & Pre-flight Checks
2. ✅ CI Pipeline (Build, Lint, Test)
3. ✅ Deployment
4. ✅ Post-Deployment Monitoring
5. ⏭️ Rollback (if needed)
6. ✅ Communication & Reporting

## Key Metrics

- **Safety Gate**: true
- **Build Success**: true
- **Health Status**: healthy
- **Deployment URL**: https://example.railway.app

## Artifacts Generated

- Safety Gate Report
- Deployment Package
- Deployment Record
- Monitoring Report
- Workflow Summary

## AI Agent Handoff Complete

The system is now in a stable state and ready for autonomous operation.
Next scheduled health check: In 6 hours
```

---

## Troubleshooting

### Common Issues and Solutions

#### Issue: Deployment Blocked by Safety Gate

**Symptom**:
```
❌ Safety gate FAILED - deployment blocked
```

**Possible Causes**:
1. Critical files missing
2. Breaking changes detected in commits
3. Emergency stop triggered

**Solution**:
```bash
# 1. Check which files are missing
git ls-files server/main.py server/app.py Dockerfile railway.toml

# 2. Review recent commits
git log -5 --oneline

# 3. If false positive, push fix commit
git commit --allow-empty -m "Fix: Resolve safety gate issue"
git push origin main
```

#### Issue: CI Pipeline Fails

**Symptom**:
```
❌ CI Pipeline: build_success=false
```

**Possible Causes**:
1. Lint errors (critical)
2. Module import failures
3. Missing dependencies

**Solution**:
```bash
# 1. Run lint locally
pip install flake8
flake8 server/ --select=E9,F63,F7,F82

# 2. Test imports
python -c "import sys; sys.path.insert(0, 'server'); from main import app"

# 3. Update dependencies
pip install -r server/requirements.txt
```

#### Issue: Health Check Degraded

**Symptom**:
```
⚠️ Health Status: degraded
```

**Possible Causes**:
1. Module import failures
2. Critical files missing post-deployment
3. Service startup issues

**Solution**:
```bash
# 1. Check monitoring report
gh run download <run-id> --name monitoring-report

# 2. Manually trigger health check
gh workflow run "ai-agent-handoff-runbook.yml" --field action=health-check

# 3. If persistent, rollback
gh workflow run "ai-agent-handoff-runbook.yml" --field action=rollback
```

#### Issue: Rollback Fails

**Symptom**:
```
❌ Rollback job failed
```

**Possible Causes**:
1. Invalid rollback tag
2. Deployment target unavailable
3. Git checkout issues

**Solution**:
```bash
# 1. List available deployment tags
git tag -l "deploy-*"

# 2. Manually specify valid tag
gh workflow run "ai-agent-handoff-runbook.yml" \
  --field action=rollback \
  --field rollback_version="<valid-tag>"

# 3. If critical, contact maintainer
```

#### Issue: Webhook Notifications Not Sent

**Symptom**:
```
⚠️ Slack/Discord notification failed
```

**Possible Causes**:
1. Webhook URL not configured
2. Invalid webhook URL
3. Network issues

**Solution**:
```bash
# 1. Verify secrets are set
gh secret list

# 2. Test webhook manually
curl -X POST $SLACK_WEBHOOK_URL \
  -H 'Content-Type: application/json' \
  -d '{"text": "Test message"}'

# 3. Update secret if needed
gh secret set SLACK_WEBHOOK_URL
```

---

## Advanced Configuration

### Environment Variables

Configure in workflow file or repository settings:

| Variable | Description | Default |
|----------|-------------|---------|
| `PYTHON_VERSION` | Python version for CI | `3.11` |
| `NODE_VERSION` | Node.js version | `18` |
| `MONITORING_ISSUE_TITLE` | Title for status issue | `🤖 AI Agent...` |
| `DEPLOYMENT_ENVIRONMENT` | Target environment | `production` |
| `SAFETY_GATE_ENABLED` | Enable safety checks | `true` |

### Secrets Configuration

Required secrets (set in repository settings):

| Secret | Purpose | Required |
|--------|---------|----------|
| `GITHUB_TOKEN` | Workflow automation | ✅ Yes (auto) |
| `SLACK_WEBHOOK_URL` | Slack notifications | ❌ Optional |
| `DISCORD_WEBHOOK_URL` | Discord notifications | ❌ Optional |
| `RAILWAY_TOKEN` | Railway deployment | ⚠️ For production |
| `SUPABASE_URL` | Database connection | ⚠️ For production |
| `SUPABASE_KEY` | Database auth | ⚠️ For production |

### Customizing Workflow Behavior

#### Adjust Safety Gate Criteria

Edit `.github/workflows/ai-agent-handoff-runbook.yml`:

```yaml
# Add custom critical files
CRITICAL_FILES=(
  "server/main.py"
  "server/app.py"
  "server/your_custom_file.py"  # Add here
)

# Modify breaking change keywords
if echo "$RECENT_COMMITS" | grep -i "breaking\|your_keyword"; then
```

#### Modify Monitoring Schedule

```yaml
on:
  schedule:
    # Change from every 6 hours to every 2 hours
    - cron: '0 */2 * * *'
```

#### Customize Stabilization Period

```yaml
- name: ⏳ Wait for Deployment Stabilization
  run: |
    sleep 60  # Increase from 30 to 60 seconds
```

#### Add Custom Health Checks

```yaml
- name: 🏥 Health Check - Comprehensive
  run: |
    # Add your custom checks here
    curl -f http://your-endpoint/custom-health || STATUS="degraded"
```

### Extending for Multi-Environment

To support staging + production:

```yaml
on:
  workflow_dispatch:
    inputs:
      environment:
        type: choice
        options:
          - staging
          - production
        default: staging

jobs:
  deployment:
    environment:
      name: ${{ github.event.inputs.environment || 'production' }}
```

---

## Best Practices for AI Agents

### 1. Always Check Status Before Deployment

```bash
# View recent workflow runs
gh run list --workflow=ai-agent-handoff-runbook.yml --limit 5

# Check current health status
gh issue view <issue-number>
```

### 2. Use Health Checks Before Updates

```bash
# Run health check first
gh workflow run "ai-agent-handoff-runbook.yml" --field action=health-check

# Wait for completion
gh run watch <run-id>

# Proceed with update if healthy
```

### 3. Monitor Deployment Progress

```bash
# Trigger deployment
RUN_ID=$(gh workflow run "ai-agent-handoff-runbook.yml" --json | jq -r '.id')

# Watch progress
gh run watch $RUN_ID

# Download artifacts on completion
gh run download $RUN_ID
```

### 4. Prepare for Rollback

```bash
# Before risky deployment, note current version
CURRENT_VERSION=$(git tag -l "deploy-*" --sort=-version:refname | head -1)
echo "Current stable: $CURRENT_VERSION"

# Keep rollback command ready
# gh workflow run ... --field rollback_version="$CURRENT_VERSION"
```

### 5. Review Artifacts Regularly

```bash
# Download and review monitoring reports
gh run download <run-id> --name monitoring-report
cat monitoring-report.md

# Check for trends
gh run list --workflow=ai-agent-handoff-runbook.yml --json status,conclusion
```

---

## Appendix

### Workflow File Location

```
.github/workflows/ai-agent-handoff-runbook.yml
```

### Related Documentation

- [Automation Guide](./automation.md)
- [Production Deployment](./PRODUCTION_DEPLOYMENT.md)
- [AI Social Network Workflow](./AI_SOCIAL_NETWORK_WORKFLOW.md)

### Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2024-12-10 | Initial release |

---

*Built with ❤️ for autonomous AI operations*
*Quantum Pi Forge - AI Agent Handoff & Autonomous Runbook*
