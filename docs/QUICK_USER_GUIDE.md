# 🗺️ Quick User Guide

> **Daily mapping — how to use the Canon of Closure in practice**

---

## 👋 Welcome

This guide helps you navigate the **Circle of Closure** in your daily work. Whether you're developing new features, fixing bugs, or maintaining production systems, these patterns will guide you.

---

## 🎯 Choose Your Path

### 🔧 I'm Developing a New Feature

Follow this sequence:

1. **Lint** your code as you write it
   ```bash
   black .
   flake8 .
   ```

2. **Host** in a clean environment
   ```bash
   python -m venv .venv
   source .venv/bin/activate
   pip install -r server/requirements.txt
   ```

3. **Test** your changes
   ```bash
   pytest tests/test_your_feature.py -v
   ```

4. **Pre-aggregate** — run with telemetry
   ```bash
   ENABLE_TELEMETRY=true python server/main.py
   ```

5. **Release** when ready
   ```bash
   git tag v1.1.0
   git push origin v1.1.0
   ```

---

### 🐛 I Need to Fix a Bug

Quick response pattern:

1. **Monitor** — identify the issue
   - Check Grafana: `http://localhost:3000`
   - Review logs: `docker-compose logs -f`

2. **Visualize** — understand the impact
   - Look at error rates
   - Check affected endpoints

3. **Lint** and **Test** your fix
   ```bash
   black .
   pytest tests/test_bugfix.py -v
   ```

4. **Deploy** the hotfix
   ```bash
   ./deploy.sh production
   ```

5. **Monitor** again to verify the fix
   - Watch for error rate drop
   - Confirm normal behavior

---

### 🚨 Production is Down!

Emergency response:

1. **Alert** has notified you — acknowledge it

2. **Monitor** to assess severity
   - Check health endpoints
   - Review recent deployments

3. **Rollback** immediately if recent deploy caused it
   ```bash
   # Get previous stable tag (before current)
   git checkout $(git describe --tags --abbrev=0 HEAD^)
   ./deploy.sh production --rollback
   ```

4. **Visualize** to diagnose root cause
   - Compare metrics before/after incident
   - Identify the trigger

5. **Lint** and **Test** the proper fix
   - Don't skip steps in an emergency
   - Rushed fixes create more problems

---

### 📊 I'm Setting Up Monitoring

Observability setup:

1. **Pre-aggregate** — start the telemetry stack
   ```bash
   docker-compose up -d
   ```

2. **Monitor** — verify services are running
   ```bash
   docker-compose ps
   ```

3. **Visualize** — import dashboards
   - Go to Grafana → Dashboards → Import
   - Upload `pi-forge-dashboard.json`

4. **Alert** — configure notifications
   - Set up Slack webhook
   - Configure email alerts
   - Test notification delivery

5. **Host** your app with telemetry enabled
   ```bash
   ENABLE_TELEMETRY=true python server/main.py
   ```

---

### 🔄 I'm Doing a Regular Deployment

Standard release cycle:

1. **Lint** → **Test** → **Pre-aggregate**
   ```bash
   black . && flake8 .
   pytest --maxfail=1 -q
   docker-compose up -d
   ```

2. **Release** with a version tag
   ```bash
   git tag -a v1.2.0 -m "New features and fixes"
   git push origin v1.2.0
   ```

3. **Deploy** to staging first
   ```bash
   ./deploy.sh staging
   ```

4. **Monitor** staging for issues
   - Watch for 15-30 minutes
   - Check key metrics

5. **Deploy** to production
   ```bash
   ./deploy.sh production
   ```

6. **Monitor** and be ready to **Rollback**
   - Stay alert for the first hour
   - Have rollback command ready

---

## 🧭 Navigation Reference

### Quick Links

| Need | Go To |
|------|-------|
| Understand the philosophy | [Canon of Closure](./CANON_OF_CLOSURE.md) |
| Find a specific command | [Developer Reference](./DEV_REFERENCE.md) |
| Execute operational steps | [Runbook Manifest](../runbooks/RUNBOOK_MANIFEST.md) |
| View the visual cycle | [Runbook Wheel](../assets/runbook-wheel.svg) |
| Get inspired | [ASCII Banner](../assets/ascii-banner.txt) |

---

## ⚡ Common Commands

### Development
```bash
# Setup
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r server/requirements.txt

# Lint
black .
flake8 .

# Test
pytest -v
pytest tests/test_health.py -q
```

### Observability
```bash
# Start stack
docker-compose up -d

# View logs
docker-compose logs -f otel-collector

# Stop stack
docker-compose down
```

### Deployment
```bash
# Tag release
git tag v1.0.0
git push origin v1.0.0

# Deploy
./deploy.sh production

# Rollback
git checkout $(git describe --tags --abbrev=0)
./deploy.sh production --rollback
```

---

## 🎓 Learning Path

### Day 1: Setup
- Read the [Canon of Closure](./CANON_OF_CLOSURE.md)
- Set up your development environment
- Run the tests
- Start the observability stack

### Week 1: Practice
- Make a small change
- Follow the full cycle: Lint → Test → Deploy
- Watch the metrics in Grafana
- Practice a rollback (on staging)

### Month 1: Mastery
- Set up custom alerts
- Create your own dashboards
- Teach the cycle to a teammate
- Contribute improvements to the Canon

---

## 💡 Tips and Tricks

### Speed Up Your Workflow
- Keep the observability stack running during development
- Use `pytest --maxfail=1` to fail fast
- Create aliases for common commands
- Run linting on save in your IDE

### Avoid Common Mistakes
- Don't skip **Test** even for "tiny" changes
- Always check **Monitor** after **Deploy**
- Practice **Rollback** before you need it
- Keep your environment clean (recreate venv monthly)

### When Things Go Wrong
- Trust the **Monitor** data, not assumptions
- **Rollback** first, diagnose second
- Document incidents for later learning
- Don't blame—improve the system

---

## 🔄 The Daily Rhythm

A typical productive day:

**Morning:**
- Check overnight **Monitor** data
- Review any **Alerts**
- Plan the day's work

**Development:**
- **Lint** → **Test** repeatedly
- Keep **Host** environment fresh
- Watch **Pre-aggregate** telemetry

**Deployment:**
- **Release** → **Deploy** in the afternoon (avoid Fridays!)
- **Monitor** closely for 1 hour
- Be ready to **Rollback**

**Evening:**
- **Visualize** the day's impact
- Set up **Alerts** for overnight
- Document what you learned

---

## 🆘 Getting Help

### For Technical Questions
- Check the [Developer Reference](./DEV_REFERENCE.md) for commands
- Review the [Runbook Manifest](../runbooks/RUNBOOK_MANIFEST.md) for procedures

### For Conceptual Questions
- Read the [Canon of Closure](./CANON_OF_CLOSURE.md) for philosophy
- Study the [Runbook Wheel](../assets/runbook-wheel.svg) for visual understanding

### For Everything Else
- Consult the [Handoff Index](./HANDOFF_INDEX.md) for navigation
- Display the [ASCII Banner](../assets/ascii-banner.txt) for inspiration

---

**Remember: Every step in the circle leads to closure.**  
🌀 *From lint to closure, every step is a return.*
