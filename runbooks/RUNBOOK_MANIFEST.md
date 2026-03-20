# 📋 Runbook Manifest

> **Operational script — executable steps for each phase of the Circle of Closure**

---

## 🌀 Overview

This runbook provides **step-by-step executable procedures** for each phase of the Circle of Closure. Each section corresponds to one step in the circle and includes:

- **Purpose**: What this phase achieves
- **Prerequisites**: What must be ready before starting
- **Procedure**: Detailed steps to execute
- **Validation**: How to verify success
- **Troubleshooting**: Common issues and solutions
- **Next Step**: Where to go in the circle

---

## 1. 🧹 Lint — Syntax Closure

### Purpose
Ensure code is clean, consistent, and free of syntax errors before validation.

### Prerequisites
- Python virtual environment activated
- Code changes committed locally

### Procedure
```bash
# 1. Format code with Black
black .

# 2. Check code style with Flake8
flake8 .

# 3. Run pre-commit hooks (if configured)
pre-commit run --all-files

# 4. Review and fix any reported issues
# 5. Re-run until no errors remain
```

### Validation
```bash
# Should show: "All done! ✨ 🍰 ✨"
black --check .

# Should show: no output (no errors)
flake8 .
```

### Troubleshooting
| Issue | Solution |
|-------|----------|
| Black reformats too aggressively | Check `pyproject.toml` for Black config |
| Flake8 reports too many warnings | Update `.flake8` to ignore specific rules |
| Pre-commit fails | Run `pre-commit install` first |

### Next Step
→ **Host** (Step 2) — Set up your environment

---

## 2. 🏠 Host — Environment Closure

### Purpose
Establish an isolated, reproducible development environment.

### Prerequisites
- Python 3.11+ installed
- Git repository cloned

### Procedure
```bash
# 1. Create virtual environment
python -m venv .venv

# 2. Activate virtual environment
# Linux/Mac:
source .venv/bin/activate
# Windows:
.venv\Scripts\activate

# 3. Upgrade pip
pip install --upgrade pip

# 4. Install dependencies
pip install -r server/requirements.txt

# 5. Copy environment template
cp .env.example .env

# 6. Configure environment variables
# Edit .env with your values:
# - SUPABASE_URL
# - SUPABASE_KEY
# - JWT_SECRET

# 7. Start Docker services (optional)
docker-compose up -d
```

### Validation
```bash
# Check Python version
python --version  # Should be 3.11+

# Verify packages installed
pip list | grep fastapi

# Check environment variables
python -c "import os; print('✅' if os.getenv('SUPABASE_URL') else '❌')"

# Verify Docker services
docker-compose ps  # All services should be "Up"
```

### Troubleshooting
| Issue | Solution |
|-------|----------|
| Python version wrong | Use `python3.11` explicitly or update PATH |
| Pip install fails | Check system dependencies: `apt install python3-dev` |
| Docker not starting | Check Docker daemon: `systemctl status docker` |
| Missing .env file | Copy from `.env.example` and configure |

### Next Step
→ **Test** (Step 3) — Verify your code works

---

## 3. 🧪 Test — Validation Closure

### Purpose
Verify that code behaves correctly under all conditions.

### Prerequisites
- Virtual environment activated
- Dependencies installed
- Code linted and formatted

### Procedure
```bash
# 1. Run all tests
pytest -v

# 2. Check for failing tests
# If any fail, investigate and fix

# 3. Run specific test suites
pytest tests/test_main.py -v
pytest tests/test_app.py -v

# 4. Run with coverage
pytest --cov=server --cov-report=html

# 5. Review coverage report
open htmlcov/index.html  # or view in browser

# 6. Ensure critical paths have >80% coverage
```

### Validation
```bash
# All tests should pass
pytest --maxfail=1 -q

# No output = all passed
echo $?  # Should be 0 (success)

# Check coverage
pytest --cov=server --cov-report=term-missing
```

### Troubleshooting
| Issue | Solution |
|-------|----------|
| Tests fail due to missing deps | Run `pip install -r server/requirements.txt` |
| Connection errors in tests | Set `ENABLE_TELEMETRY=false` before testing |
| Fixtures not found | Check test file imports and pytest configuration |
| Slow tests | Use `pytest -n auto` for parallel execution |

### Next Step
→ **Pre-aggregate** (Step 4) — Enable telemetry

---

## 4. 📊 Pre-aggregate — Telemetry Closure

### Purpose
Collect and prepare observability data for monitoring.

### Prerequisites
- Docker and Docker Compose installed
- Tests passing
- Application ready to run

### Procedure
```bash
# 1. Start OpenTelemetry Collector
docker-compose up -d otel-collector

# 2. Start Prometheus
docker-compose up -d prometheus

# 3. Start Grafana
docker-compose up -d grafana

# 4. Verify all services are running
docker-compose ps

# 5. Check collector logs
docker-compose logs -f otel-collector

# 6. Run application with telemetry enabled
ENABLE_TELEMETRY=true uvicorn server.main:app --reload

# 7. Generate some traffic
curl http://localhost:8000/
curl http://localhost:8000/api/health

# 8. Verify metrics are flowing
open http://localhost:9090  # Prometheus
# Query: up{job="pi-forge"}
```

### Validation
```bash
# All services should be "Up"
docker-compose ps | grep "Up"

# Metrics endpoint should return data
curl http://localhost:9090/api/v1/query?query=up

# Grafana should be accessible
curl -s http://localhost:3000/api/health | grep ok
```

### Troubleshooting
| Issue | Solution |
|-------|----------|
| OTEL collector fails to start | Check `otel-collector-config.yaml` syntax |
| No metrics in Prometheus | Verify scrape config in `prometheus.yml` |
| Grafana won't start | Check port 3000 is not in use |
| Application can't connect | Use `ENABLE_TELEMETRY=false` to disable |

### Next Step
→ **Release** (Step 5) — Package your version

---

## 5. 📦 Release — Version Closure

### Purpose
Package and tag a stable version for deployment.

### Prerequisites
- All tests passing
- Code reviewed and approved
- Changelog updated

### Procedure
```bash
# 1. Ensure you're on the main branch
git checkout main
git pull origin main

# 2. Update version number (if using versioning file)
# Edit version.py or package.json

# 3. Update CHANGELOG.md
# Add release notes for this version

# 4. Commit version changes
git add .
git commit -m "Bump version to v1.0.0"

# 5. Create annotated tag with multi-line message
git tag -a v1.0.0 -m "Release version 1.0.0" \
  -m "" \
  -m "Features:" \
  -m "- Feature A" \
  -m "- Feature B" \
  -m "" \
  -m "Fixes:" \
  -m "- Bug fix C" \
  -m "- Bug fix D"

# 6. Push commit and tag
git push origin main
git push origin v1.0.0

# 7. Create GitHub release (optional)
gh release create v1.0.0 --title "v1.0.0" --notes "Release notes here"
```

### Validation
```bash
# Verify tag exists locally
git tag -l | grep v1.0.0

# Verify tag exists remotely
git ls-remote --tags origin | grep v1.0.0

# Show tag details
git show v1.0.0
```

### Troubleshooting
| Issue | Solution |
|-------|----------|
| Tag already exists | Delete with `git tag -d v1.0.0` and recreate |
| Push rejected | Check branch protection rules |
| Version conflict | Ensure version is unique and follows semver |

### Next Step
→ **Deploy** (Step 6) — Push to production

---

## 6. 🚀 Deploy — Production Closure

### Purpose
Move the release to production safely and reliably.

### Prerequisites
- Release tagged and pushed
- Staging environment tested
- Deployment credentials configured

### Procedure
```bash
# 1. Deploy to staging first
./deploy.sh staging

# 2. Wait for deployment to complete
# Check deployment logs

# 3. Run smoke tests on staging
curl https://staging.your-domain.com/api/health
curl https://staging.your-domain.com/

# 4. Monitor staging for 15-30 minutes
# Watch error rates, latency, etc.

# 5. If staging is stable, deploy to production
./deploy.sh production

# 6. Monitor deployment progress
# Watch logs for errors

# 7. Verify production is healthy
curl https://your-domain.com/api/health

# 8. Check key metrics
# - Response times
# - Error rates
# - Active connections

# 9. Notify team of successful deployment
# Post to Slack/Teams channel
```

### Validation
```bash
# Health check should return 200
curl -f https://your-domain.com/api/health

# Version should match release
curl https://your-domain.com/api/version | jq .version

# Key features should work
# Test critical user paths
```

### Troubleshooting
| Issue | Solution |
|-------|----------|
| Deployment fails | Check deployment logs for errors |
| Health check fails | Verify environment variables are set |
| High error rate | Immediately proceed to Rollback (Step 7) |
| Slow response times | Check resource utilization and scaling |

### Next Step
→ **Monitor** (Step 8) — Watch system health

Or if issues occur:
→ **Rollback** (Step 7) — Restore stability

---

## 7. 🔄 Rollback — Safety Closure

### Purpose
Revert to the last stable state if deployment fails.

### Prerequisites
- Deployment issues detected
- Last known good version identified
- Rollback procedure approved

### Procedure
```bash
# 1. Identify last stable tag
git describe --tags --abbrev=0 HEAD^

# 2. Note current version for incident report
CURRENT_VERSION=$(git describe --tags --exact-match 2>/dev/null || echo "unknown")
echo "Rolling back from: $CURRENT_VERSION"

# 3. Checkout last stable tag
LAST_STABLE=$(git describe --tags --abbrev=0 HEAD^)
git checkout $LAST_STABLE

# 4. Execute rollback deployment
./deploy.sh production --rollback

# 5. Verify rollback succeeded
curl https://your-domain.com/api/health
curl https://your-domain.com/api/version

# 6. Monitor for 15 minutes
# Ensure error rates return to normal

# 7. Notify team
# Post rollback notification

# 8. Create incident report
# Document what went wrong and why we rolled back

# 9. Return to main branch
git checkout main
```

### Validation
```bash
# Version should be previous release
curl https://your-domain.com/api/version | jq .version

# Error rates should be back to normal
# Check Prometheus/Grafana

# Health check should be green
curl -f https://your-domain.com/api/health
```

### Troubleshooting
| Issue | Solution |
|-------|----------|
| Rollback deployment fails | Manually deploy previous Docker image |
| Database migrations incompatible | Restore database backup if available |
| Can't determine last stable version | Check release history in GitHub |
| Issues persist after rollback | May indicate infrastructure issue, not code |

### Next Step
→ **Monitor** (Step 8) — Verify stability restored
Then return to **Lint** (Step 1) to fix the issue

---

## 8. 📡 Monitor — Awareness Closure

### Purpose
Continuously observe system health and performance.

### Prerequisites
- Application deployed and running
- Observability stack operational
- Dashboards configured

### Procedure
```bash
# 1. Open monitoring dashboards
open http://localhost:9090  # Prometheus
open http://localhost:3000  # Grafana

# 2. Check key metrics
# - Request rate
# - Error rate (should be <1%)
# - Response time (p50, p95, p99)
# - Resource utilization (CPU, memory)

# 3. Review recent logs
docker-compose logs -f --tail=100

# 4. Check health endpoints
curl http://localhost:8000/api/health
curl http://localhost:8000/api/metrics

# 5. Set up active monitoring
# Configure alerts for abnormal patterns

# 6. Review daily
# Morning: Check overnight activity
# Evening: Review day's patterns

# 7. Document anomalies
# Note unusual patterns for investigation
```

### Validation
```bash
# Metrics endpoint should respond
curl -s http://localhost:8000/api/metrics | jq .

# Prometheus should be scraping
curl -s 'http://localhost:9090/api/v1/query?query=up{job="pi-forge"}' | jq .

# No critical errors in logs
docker-compose logs --tail=100 | grep -i error | wc -l
```

### Troubleshooting
| Issue | Solution |
|-------|----------|
| Metrics not appearing | Check OTEL collector is running and configured |
| Grafana dashboards empty | Verify Prometheus data source configured |
| High error rate | Investigate logs and consider rollback |
| Missing data points | Check scrape interval and retention |

### Next Step
→ **Visualize** (Step 9) — Create insights from data

---

## 9. 📈 Visualize — Insight Closure

### Purpose
Transform raw metrics into actionable insights.

### Prerequisites
- Monitoring data flowing
- Grafana accessible
- Dashboard templates available

### Procedure
```bash
# 1. Access Grafana
open http://localhost:3000
# Login: admin / admin (change on first login)

# 2. Add Prometheus data source (if not already done)
# Configuration → Data Sources → Add Prometheus
# URL: http://prometheus:9090

# 3. Import pre-built dashboard
# Dashboards → Import → Upload JSON file
# Use: pi-forge-dashboard.json

# 4. Create custom visualizations
# + → Dashboard → Add panel
# Configure:
# - Query: Select metric
# - Visualization: Choose graph type
# - Time range: Set appropriate window

# 5. Organize dashboards by role
# - Developer dashboard: Build times, test results
# - SRE dashboard: Uptime, errors, latency
# - Business dashboard: Usage, conversions

# 6. Set up dashboard refresh
# Settings → Auto-refresh → 30s or 1m

# 7. Share dashboards
# Share → Link → Copy URL
# Post in team documentation
```

### Validation
```bash
# Dashboard should load without errors
curl -u admin:admin http://localhost:3000/api/dashboards/home

# Panels should display data
# Check each panel for data points

# No "No Data" messages
# Verify time range includes recent data
```

### Troubleshooting
| Issue | Solution |
|-------|----------|
| No data in panels | Check Prometheus data source connection |
| Query errors | Verify PromQL syntax in panel queries |
| Slow dashboard loading | Reduce time range or simplify queries |
| Panels showing old data | Check auto-refresh settings |

### Next Step
→ **Alert** (Step 10) — Set up notifications

---

## 10. 🚨 Alert — Response Closure

### Purpose
Notify the team when intervention is needed.

### Prerequisites
- Monitoring and visualization active
- Alert thresholds defined
- Notification channels configured

### Procedure
```bash
# 1. Configure notification channels in Grafana
# Alerting → Notification channels → New channel
# Types: Slack, Email, PagerDuty, Webhook

# 2. Set up Slack webhook (example)
export SLACK_WEBHOOK_URL="https://hooks.slack.com/services/YOUR/WEBHOOK/URL"

# Test webhook
curl -X POST $SLACK_WEBHOOK_URL \
  -H 'Content-Type: application/json' \
  -d '{"text":"Test alert from Pi Forge"}'

# 3. Create alert rules in Grafana
# Dashboard → Panel → Alert tab
# Conditions:
# - High error rate: error_rate > 0.01 for 5m
# - High latency: p95_latency > 1000ms for 5m
# - Service down: up == 0 for 1m

# 4. Test alerts
# Trigger condition manually to verify notification

# 5. Configure alert routing
# Set severity levels:
# - Critical: Page on-call immediately
# - Warning: Notify channel
# - Info: Log only

# 6. Set up on-call schedule
# Use PagerDuty or OpsGenie for rotation

# 7. Document runbooks for each alert
# When alert X fires, do Y

# 8. Review alerts weekly
# Reduce false positives
# Adjust thresholds as needed
```

### Validation
```bash
# Send test alert
curl -X POST $SLACK_WEBHOOK_URL \
  -H 'Content-Type: application/json' \
  -d '{"text":"🧪 Test Alert - Please Acknowledge"}'

# Check alert history in Grafana
# Alerting → Alert Rules → History

# Verify alert fired when expected
# Trigger condition and wait for notification
```

### Troubleshooting
| Issue | Solution |
|-------|----------|
| Alerts not firing | Check alert rule conditions and evaluation interval |
| Too many false positives | Adjust thresholds or add "for" duration |
| Notifications not received | Verify webhook URL and network connectivity |
| Alert fatigue | Consolidate similar alerts and reduce noise |

### Next Step
→ **Lint** (Step 1) — Begin the cycle again
The circle is complete. Return to improvement.

---

## 🔁 The Complete Cycle

```
1. Lint → 2. Host → 3. Test → 4. Pre-aggregate → 5. Release
                                                      ↓
10. Alert ← 9. Visualize ← 8. Monitor ← 7. Rollback ← 6. Deploy
   ↓
Back to 1. Lint (Continuous Improvement)
```

---

## 📊 Runbook Success Metrics

Track these metrics to measure operational excellence:

| Metric | Target | Tracking |
|--------|--------|----------|
| Mean Time to Deploy | < 30 minutes | From tag to production |
| Mean Time to Rollback | < 5 minutes | From decision to stable |
| Test Coverage | > 80% | Critical paths covered |
| Deployment Success Rate | > 95% | No rollback needed |
| Alert Response Time | < 15 minutes | From alert to acknowledgment |
| False Positive Rate | < 10% | Alerts that require action |

---

## 🆘 Emergency Contacts

Maintain a current list of contacts for incidents:

| Role | Contact | Availability |
|------|---------|--------------|
| On-Call Engineer | [Slack/Phone] | 24/7 |
| Team Lead | [Slack/Email] | Business hours |
| Database Admin | [Slack/Phone] | On-call rotation |
| Security Team | [Email] | 24/7 for incidents |

---

## 📚 Related Documentation

- [Canon of Closure](../docs/CANON_OF_CLOSURE.md) - Philosophy and methodology
- [Quick User Guide](../docs/QUICK_USER_GUIDE.md) - Daily usage patterns
- [Developer Reference](../docs/DEV_REFERENCE.md) - Command cheat sheet
- [Handoff Index](../docs/HANDOFF_INDEX.md) - Navigation hub

---

**This runbook is your operational guide. Follow it faithfully.**  
🌀 *From lint to closure, every step is a return.*
