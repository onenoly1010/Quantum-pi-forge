# 🛡️ Guardian Quick Reference

**Fast decision-making guide for Pi Forge Quantum Genesis Guardians**

---

## ⚡ Quick Actions

### Check System Status
```bash
curl https://pi-forge-quantum-genesis.railway.app/api/guardian/dashboard | jq .
```

### Review Pending Decisions
```bash
curl https://pi-forge-quantum-genesis.railway.app/api/autonomous/decision-history?requires_guardian=true&status=pending | jq .
```

### Approve Decision
```bash
curl -X POST https://pi-forge-quantum-genesis.railway.app/api/guardian/approve/{decision_id} \
  -H "Authorization: Bearer <token>" \
  -d '{"approved": true, "comments": "Approved: [reason]"}'
```

### Reject Decision
```bash
curl -X POST https://pi-forge-quantum-genesis.railway.app/api/guardian/approve/{decision_id} \
  -H "Authorization: Bearer <token>" \
  -d '{"approved": false, "comments": "Rejected: [reason]"}'
```

### Emergency Stop
```bash
curl -X POST https://pi-forge-quantum-genesis.railway.app/api/guardian/emergency-stop \
  -H "Authorization: Bearer <token>"
```

### Emergency Rollback
```bash
# Trigger via GitHub Actions
gh workflow run rollback.yml --ref main
```

---

## 📊 Decision Matrix

| Confidence | Priority | Action | Timeline |
|-----------|----------|--------|----------|
| **0.9-1.0** | Any | Auto-approved | Immediate |
| **0.8-0.9** | Low/Med | Auto-approved | Immediate |
| **0.7-0.8** | Low | Quick review | < 5 min |
| **0.6-0.8** | Med/High | Standard review | < 1 hour |
| **0.5-0.6** | High | Deep analysis | < 4 hours |
| **< 0.5** | Any | Reject or escalate | Varies |

---

## 🚨 Response Times

| Priority | Response | Examples |
|----------|----------|----------|
| **Critical** | < 1 hour | Outages, security, payments |
| **High** | < 4 hours | Performance, deployments |
| **Medium** | < 24 hours | Optimizations, warnings |
| **Low** | < 72 hours | Info, trends |

---

## ✅ Quick Approval Checklist

### Deployment
- [ ] Tests passed?
- [ ] Confidence >= 0.8?
- [ ] Rollback ready?
- [ ] No security issues?

### Scaling
- [ ] Metrics justify it?
- [ ] Cost acceptable?
- [ ] No incidents active?

### Rollback
- [ ] Root cause known?
- [ ] Data preserved?
- [ ] Impact assessed?

### Healing
- [ ] Issue diagnosed?
- [ ] Action appropriate?
- [ ] No data risk?

---

## 🎯 Decision Types

| Type | Threshold | Auto-Approve? |
|------|-----------|---------------|
| **Deployment** | 0.80 | If >= 0.9 |
| **Scaling** | 0.85 | Scale-down always |
| **Rollback** | 0.70 | Emergency only |
| **Healing** | 0.75 | Routine actions |
| **Monitoring** | 0.85 | If low impact |
| **Override** | N/A | Never |

---

## 🔴 Emergency Levels

### Level 1: Minor
- **Action**: Monitor
- **Response**: Self-healing handles

### Level 2: Moderate
- **Action**: Review and approve
- **Response**: < 30 minutes
- **Examples**: Service degradation, failed deploy

### Level 3: Critical
- **Action**: Immediate
- **Response**: < 5 minutes
- **Examples**: Outage, breach, data issues

**Critical Response Steps**:
1. Emergency stop (if needed)
2. Assess (< 15 min)
3. Execute fix (< 30 min)
4. Verify (< 10 min)
5. Resume ops (< 5 min)
6. Document (< 2 hours)

---

## 📈 Health Metrics

| Metric | Good | Warning | Critical |
|--------|------|---------|----------|
| **Availability** | > 99.5% | 99-99.5% | < 99% |
| **Response Time** | < 200ms | 200-500ms | > 500ms |
| **Error Rate** | < 0.1% | 0.1-1% | > 1% |
| **CPU Usage** | < 70% | 70-85% | > 85% |
| **Memory** | < 80% | 80-90% | > 90% |
| **Disk** | < 85% | 85-95% | > 95% |
| **Safety Score** | > 0.8 | 0.7-0.8 | < 0.7 |

---

## 🔑 Key Endpoints

```bash
# Dashboard
/api/guardian/dashboard

# Decision history
/api/autonomous/decision-history

# Metrics
/api/autonomous/metrics

# Health
/api/health

# Approve decision
POST /api/guardian/approve/{id}

# Emergency stop
POST /api/guardian/emergency-stop

# Resume
POST /api/guardian/resume
```

---

## 📝 Common Decision Patterns

### Pattern: Routine Deployment
- **Confidence**: Usually 0.85-0.95
- **Action**: Quick review, approve
- **Watch for**: New patterns, unusual changes

### Pattern: Scale Up Request
- **Confidence**: Usually 0.80-0.90
- **Action**: Check metrics, approve if justified
- **Watch for**: Cost impact, sustained load

### Pattern: Self-Healing Action
- **Confidence**: Usually 0.75-0.85
- **Action**: Verify diagnosis, approve
- **Watch for**: Recurring issues (may need deeper fix)

### Pattern: Low Confidence Decision
- **Confidence**: < 0.6
- **Action**: Deep analysis or reject
- **Watch for**: Missing context, incomplete data

---

## 🚀 Daily Routine

### Morning (5-10 min)
1. Check dashboard
2. Review health report (Issue #76)
3. Process pending decisions
4. Note overnight activity

### Throughout Day
- Check alerts every 1-2 hours
- Review dashboard every 4 hours
- Respond to critical < 1 hour
- Respond to high < 4 hours

### Evening (5 min)
1. Final dashboard check
2. Review day's metrics
3. Document notable events

---

## 💬 Quick Communication

### AI Assistant
```
@app/copilot-swe-agent [your question]
```

### Escalate to Lead
```markdown
@onenoly1010 Need approval for [decision-type]
Decision ID: [id]
Reason: [brief explanation]
```

### Team Notification
```markdown
🚨 [Priority]: [Brief description]
Status: [Current status]
Action: [What's being done]
ETA: [When resolved]
```

---

## 🛠️ Troubleshooting

### Dashboard Not Loading
```bash
# Check health
curl https://pi-forge-quantum-genesis.railway.app/api/health

# Check logs
curl https://pi-forge-quantum-genesis.railway.app/api/logs/recent?limit=50
```

### High Error Rate
1. Check recent deployments
2. Review monitoring alerts
3. Check external dependencies
4. Consider rollback

### Autonomous System Stuck
1. Review pending decisions
2. Check decision queue
3. Look for blocking issues
4. Manual override if needed

### Can't Approve Decision
1. Verify authentication
2. Check decision status
3. Ensure decision is pending
4. Check for conflicts

---

## 📚 Resources

- **Full Playbook**: [GUARDIAN_PLAYBOOK.md](./GUARDIAN_PLAYBOOK.md)
- **Architecture**: [ARCHITECTURE.md](./ARCHITECTURE.md)
- **Quick Start**: [QUICK_START.md](./QUICK_START.md)
- **Guardian HQ**: [Issue #100](https://github.com/onenoly1010/pi-forge-quantum-genesis/issues/100)
- **AI Assistant**: [Issue #102](https://github.com/onenoly1010/pi-forge-quantum-genesis/issues/102)
- **Health Monitor**: [Issue #76](https://github.com/onenoly1010/pi-forge-quantum-genesis/issues/76)

---

## 🎓 Remember

1. **Trust the system** - It's designed for autonomy
2. **Verify critical actions** - Spot-check important decisions
3. **Document everything** - Your reasoning matters
4. **Be responsive** - Timely decisions keep system healthy
5. **Communicate clearly** - Share context with team
6. **Learn and adapt** - Improve based on patterns

---

## 🆘 Emergency Contacts

- **Lead Guardian**: @onenoly1010
- **AI Assistant**: @app/copilot-swe-agent
- **Team Channel**: [channel-link]
- **Emergency**: [emergency-contact]

---

## 📞 Common Commands

```bash
# Morning check
curl https://pi-forge-quantum-genesis.railway.app/api/guardian/dashboard | jq '."system_status", ."pending_decisions", ."safety_metrics"'

# Quick approve (if decision looks good)
curl -X POST https://pi-forge-quantum-genesis.railway.app/api/guardian/approve/deployment_12345 \
  -H "Authorization: Bearer <token>" \
  -d '{"approved": true, "comments": "Routine deployment, tests passed"}'

# Get last 10 decisions
curl https://pi-forge-quantum-genesis.railway.app/api/autonomous/decision-history?limit=10 | jq .

# Check specific decision
curl https://pi-forge-quantum-genesis.railway.app/api/autonomous/decision/{decision_id} | jq .

# Today's metrics
curl https://pi-forge-quantum-genesis.railway.app/api/autonomous/metrics?period=today | jq .
```

---

**Last Updated**: December 2025  
**Version**: 2.0

**⚡ Fast decisions, safe operations.**
