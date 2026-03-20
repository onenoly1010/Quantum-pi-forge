# 🛡️ Guardian Playbook - Pi Forge Quantum Genesis

## Overview

This playbook provides comprehensive operational procedures for Guardians overseeing the Pi Forge Quantum Genesis autonomous AI platform. As a Guardian, you are responsible for critical decision approval, system oversight, and incident response.

**Current Lead Guardian**: @onenoly1010  
**AI Assistant**: @app/copilot-swe-agent  
**Guardian HQ**: [Issue #100](https://github.com/onenoly1010/pi-forge-quantum-genesis/issues/100)

> **Note**: This playbook is part of the [Prelaunch Operational Team](./OPERATIONAL_TEAM.md) framework. For team structure, roles, and coordination procedures, refer to the operational team documentation.

---

## Table of Contents

1. [Guardian Role & Responsibilities](#guardian-role--responsibilities)
2. [Decision-Making Framework](#decision-making-framework)
3. [Daily Operations](#daily-operations)
4. [Emergency Procedures](#emergency-procedures)
5. [Monitoring & Alerts](#monitoring--alerts)
6. [Communication Protocols](#communication-protocols)
7. [Decision Types & Procedures](#decision-types--procedures)
8. [Escalation Paths](#escalation-paths)
9. [Reporting & Documentation](#reporting--documentation)
10. [Tools & Resources](#tools--resources)

---

## Guardian Role & Responsibilities

### Primary Responsibilities

1. **Decision Oversight**
   - Review and approve/reject escalated autonomous decisions
   - Ensure decisions align with system goals and safety standards
   - Provide context and reasoning for all approvals/rejections

2. **System Monitoring**
   - Review daily health reports
   - Monitor autonomous operations
   - Verify safety metrics within acceptable ranges

3. **Incident Response**
   - Respond to critical alerts within 1 hour
   - Coordinate emergency procedures
   - Lead post-incident reviews

4. **Policy & Governance**
   - Update decision thresholds based on performance
   - Refine autonomous decision rules
   - Maintain guardian documentation

5. **Team Coordination**
   - Work with AI assistant for routine triage
   - Communicate with development team
   - Report to stakeholders

### Guardian Authority

**You have authority to**:
- Approve or reject any autonomous decision
- Override autonomous actions
- Trigger emergency stops
- Initiate rollbacks
- Adjust system parameters
- Grant temporary access for investigations

**You must coordinate for**:
- Major architectural changes
- Smart contract deployments
- Economic model adjustments
- Policy changes affecting users

---

## Decision-Making Framework

### Confidence-Based System

The autonomous decision matrix uses confidence scores (0.0 to 1.0) to determine if guardian approval is required:

```
┌─────────────────────────────────────────────────┐
│ Confidence Score      │ Action                  │
├──────────────────────┼─────────────────────────┤
│ 0.9 - 1.0            │ Auto-approve (log only)  │
│ 0.8 - 0.9            │ Auto-approve (notify)    │
│ 0.6 - 0.8            │ Guardian review required │
│ 0.4 - 0.6            │ Detailed analysis needed │
│ 0.0 - 0.4            │ Reject or escalate       │
└─────────────────────────────────────────────────┘
```

### Decision Criteria

When reviewing decisions, consider:

1. **Safety**: Does this pose any security or stability risks?
2. **Impact**: What's the blast radius if something goes wrong?
3. **Reversibility**: Can this be easily rolled back?
4. **Timing**: Is this the right time for this change?
5. **Context**: What else is happening in the system?
6. **History**: Have similar decisions succeeded/failed?

### Approval Guidelines

**Quick Approve** (< 5 minutes):
- Confidence >= 0.7
- Low/medium impact
- Easily reversible
- Routine operation type
- Good historical performance

**Standard Review** (< 1 hour):
- Confidence 0.5-0.7
- Medium/high impact
- Some complexity
- Non-routine operation
- Mixed historical performance

**Deep Analysis** (< 4 hours):
- Confidence < 0.5
- High/critical impact
- Complex operation
- Novel scenario
- Unknown risks

**Escalate** (consult team):
- Confidence < 0.4
- Unclear requirements
- Policy implications
- Financial impact > threshold
- Security concerns

---

## Daily Operations

### Morning Routine (5-10 minutes)

#### 1. Check Guardian Dashboard

```bash
# Local development
curl http://localhost:8000/api/guardian/dashboard | jq .

# Production
curl https://pi-forge-quantum-genesis.railway.app/api/guardian/dashboard | jq .
```

**Review**:
- System status (should be "healthy")
- Pending decisions count
- Recent autonomous actions
- Safety metrics (all should be > 0.7)
- Active alerts

#### 2. Review Health Report

- Navigate to [Issue #76](https://github.com/onenoly1010/pi-forge-quantum-genesis/issues/76)
- Check latest automated health report (runs every 6 hours)
- Verify all components green
- Note any warnings or degraded services

#### 3. Check Pending Decisions

```bash
# Get decisions requiring approval
curl https://pi-forge-quantum-genesis.railway.app/api/autonomous/decision-history?requires_guardian=true&status=pending | jq .
```

**For each pending decision**:
- Read decision details
- Check confidence score
- Review reasoning
- Assess risk
- Approve or schedule for detailed review

#### 4. Review Overnight Activity

```bash
# Get last 12 hours of decisions
curl https://pi-forge-quantum-genesis.railway.app/api/autonomous/decision-history?limit=50&hours=12 | jq .
```

**Look for**:
- Unusual patterns
- High rejection rates
- Confidence score trends
- Any failures or errors

### Throughout the Day

#### Active Monitoring

- **Check email/alerts** every 1-2 hours
- **Review dashboard** every 4 hours
- **Respond to critical alerts** within 1 hour
- **Respond to high-priority** within 4 hours

#### Decision Processing

**Batch processing** (every 2-4 hours):
1. Gather pending decisions
2. Group by type and priority
3. Review and decide
4. Document reasoning
5. Monitor execution

#### Collaboration

- **AI Assistant**: Delegate routine queries to @app/copilot-swe-agent
- **Development Team**: Coordinate on complex issues
- **Community**: Monitor discussions and issues

### End of Day (5 minutes)

#### 1. Final Dashboard Check

```bash
curl https://pi-forge-quantum-genesis.railway.app/api/guardian/dashboard | jq .
```

Ensure no pending critical items.

#### 2. Review Day's Metrics

```bash
curl https://pi-forge-quantum-genesis.railway.app/api/autonomous/metrics | jq .
```

**Check**:
- Total decisions made
- Approval rate (should be 70-90%)
- Average confidence (should be > 0.75)
- Guardian escalation rate (should be 10-30%)

#### 3. Document Notable Events

Update Guardian Log with:
- Significant decisions
- Issues encountered
- Lessons learned
- Action items for tomorrow

---

## Emergency Procedures

### Emergency Classification

#### Level 1: Minor (Self-Healing Handles)

**Indicators**:
- Single service degradation
- Performance issues < 20% impact
- Non-critical errors
- Recoverable failures

**Action**: Monitor only, let self-healing resolve

---

#### Level 2: Moderate (Guardian Approval)

**Indicators**:
- Multiple service issues
- Performance degradation 20-50%
- Failed deployments
- Database connection issues

**Procedure**:
1. **Assess situation** (< 5 minutes)
   - Check dashboard
   - Review error logs
   - Identify scope

2. **Decide action** (< 10 minutes)
   - Approve healing actions
   - Adjust resources
   - Disable problematic features

3. **Monitor resolution** (< 30 minutes)
   - Track healing progress
   - Verify restoration
   - Document incident

---

#### Level 3: Critical (Immediate Action)

**Indicators**:
- Complete service outage
- Security breach
- Data integrity issues
- Payment processing failures
- Smart contract issues

**Procedure**:

**STEP 1: Immediate Response (< 5 minutes)**

```bash
# 1. Trigger emergency stop
curl -X POST https://pi-forge-quantum-genesis.railway.app/api/guardian/emergency-stop \
  -H "Authorization: Bearer <guardian-token>" \
  -H "Content-Type: application/json" \
  -d '{"reason": "Critical incident: [description]", "guardian_id": "your-id"}'

# 2. Check status
curl https://pi-forge-quantum-genesis.railway.app/api/guardian/status | jq .

# 3. Notify team
# Send message to team channel with:
# - Incident description
# - Severity level
# - Actions taken
# - ETA for next update
```

**STEP 2: Assessment (< 15 minutes)**

1. **Identify root cause**
   - Check logs: `curl https://pi-forge-quantum-genesis.railway.app/api/logs/recent?limit=100`
   - Review metrics: `curl https://pi-forge-quantum-genesis.railway.app/api/autonomous/metrics`
   - Check external dependencies (Supabase, Pi Network)

2. **Determine impact**
   - Users affected
   - Services down
   - Data at risk
   - Financial implications

3. **Assess recovery options**
   - Self-healing possible?
   - Need rollback?
   - Require hotfix?
   - Manual intervention needed?

**STEP 3: Execute Recovery (< 30 minutes)**

**Option A: Quick Fix**
```bash
# Approve healing action
curl -X POST https://pi-forge-quantum-genesis.railway.app/api/guardian/approve-healing \
  -H "Authorization: Bearer <guardian-token>" \
  -d '{"action": "restart_services", "approved": true}'
```

**Option B: Rollback**
```bash
# Trigger rollback via workflow or manual process
# See docs/ROLLBACK_VALIDATION.md for procedures

# Quick rollback to last known good state
gh workflow run rollback.yml --ref main

# Or manual git-based rollback (coordinate with team)
git revert <bad-commit-hash>
```

**Option C: Manual Fix**
```bash
# Access production environment
# Apply hotfix
# Test thoroughly
# Monitor closely
```

**STEP 4: Verification (< 10 minutes)**

```bash
# 1. Check health
curl https://pi-forge-quantum-genesis.railway.app/api/health | jq .

# 2. Verify services
curl https://pi-forge-quantum-genesis.railway.app/api/guardian/dashboard | jq .

# 3. Test critical paths
# - User login
# - Payment processing
# - Smart contract interactions

# 4. Monitor for 15 minutes
# Watch for recurring issues
```

**STEP 5: Resume Operations (< 5 minutes)**

```bash
# Re-enable autonomous operations
curl -X POST https://pi-forge-quantum-genesis.railway.app/api/guardian/resume \
  -H "Authorization: Bearer <guardian-token>" \
  -d '{"confirmed": true, "guardian_id": "your-id"}'
```

**STEP 6: Post-Incident (< 2 hours)**

1. **Document incident**
   - Timeline of events
   - Root cause analysis
   - Actions taken
   - Resolution details

2. **Create incident report**
   - Use template: `.github/ISSUE_TEMPLATE/incident-report.md`
   - Post as GitHub issue
   - Label: `incident`, `priority:critical`

3. **Follow-up actions**
   - Identify preventive measures
   - Update monitoring rules
   - Adjust decision thresholds
   - Schedule team review

---

## Monitoring & Alerts

### Alert Channels

1. **Email** - Critical and high-priority alerts
2. **GitHub Issues** - Decision escalations and incidents
3. **Dashboard** - Real-time system status
4. **Slack/Discord** (if configured) - Team coordination

### Alert Priorities

| Priority | Response Time | Channels | Examples |
|----------|--------------|----------|----------|
| **Critical** | < 1 hour | Email, Phone, GitHub | Outages, security breaches, payment failures |
| **High** | < 4 hours | Email, GitHub | Performance degradation, failed deployments |
| **Medium** | < 24 hours | GitHub, Dashboard | Resource warnings, optimization opportunities |
| **Low** | < 72 hours | Dashboard | Informational, metrics, trends |

### Dashboard Metrics

**System Health**:
- Overall status: healthy/degraded/critical
- Service availability: % uptime
- Error rate: errors per minute
- Response time: average latency

**Autonomous Operations**:
- Decisions per hour
- Approval rate
- Average confidence
- Guardian escalation rate

**Safety Metrics**:
- Transaction safety score (> 0.8)
- Ethical compliance score (> 0.8)
- Security score (> 0.7)
- Overall safety rating

**Resource Utilization**:
- CPU usage (< 80%)
- Memory usage (< 85%)
- Disk usage (< 90%)
- Database connections (< 80% pool)

---

## Communication Protocols

### With AI Assistant

**@app/copilot-swe-agent** ([Issue #102](https://github.com/onenoly1010/pi-forge-quantum-genesis/issues/102))

**Use AI assistant for**:
- Routine questions
- Initial analysis of issues
- Code review requests
- Documentation questions
- Metric interpretation

**Example interactions**:
```
@app/copilot-swe-agent What's the average confidence score for deployment decisions this week?

@app/copilot-swe-agent Review the last 5 failed deployments and summarize common issues.

@app/copilot-swe-agent Is the current error rate within normal parameters?
```

### With Development Team

**Regular communication**:
- Daily standup (async or sync)
- Weekly guardian report
- Monthly system review

**Escalation triggers**:
- Multiple critical incidents in a week
- Recurring issues not resolved by self-healing
- Need for architectural changes
- Policy questions

### With Stakeholders

**Monthly reports include**:
- System availability metrics
- Autonomous operation statistics
- Incident summary
- Decision patterns
- Recommendations

---

## Decision Types & Procedures

### 1. Deployment Decisions

**Confidence threshold**: 0.8

**Review checklist**:
- [ ] All tests passed?
- [ ] Code review completed?
- [ ] No security vulnerabilities detected?
- [ ] Rollback plan documented?
- [ ] Impact assessment done?
- [ ] Monitoring alerts configured?

**Approve if**:
- Confidence >= 0.8
- Low-risk changes
- Good test coverage
- Clear rollback path

**Reject if**:
- Confidence < 0.6
- High-risk changes
- Insufficient testing
- No rollback plan

### 2. Scaling Decisions

**Confidence threshold**: 0.85

**Review checklist**:
- [ ] Resource metrics justify scaling?
- [ ] Cost impact acceptable?
- [ ] No ongoing incidents?
- [ ] Historical patterns support scaling?
- [ ] Scaling limits not exceeded?

**Auto-approve scale-down**: Always (unless critical period)

**Approve scale-up if**:
- Sustained high load (> 80% for 15+ minutes)
- Growth trend indicates need
- Cost within budget

### 3. Rollback Decisions

**Confidence threshold**: 0.7 (lower for emergencies)

**Review checklist**:
- [ ] Root cause identified?
- [ ] Data preservation confirmed?
- [ ] User impact assessed?
- [ ] Rollback tested?
- [ ] Communication plan ready?

**Fast-track approval** (emergency):
- Critical service failure
- Security vulnerability
- Data integrity risk

### 4. Healing Decisions

**Confidence threshold**: 0.75

**Review checklist**:
- [ ] Issue correctly diagnosed?
- [ ] Healing action appropriate?
- [ ] No data loss risk?
- [ ] Can verify success?

**Auto-approve**:
- Service restart
- Cache clearing
- Resource cleanup
- Connection pool reset

**Require approval**:
- Database operations
- File system changes
- Configuration modifications

### 5. Monitoring Decisions

**Confidence threshold**: 0.85

**Review checklist**:
- [ ] Alert threshold appropriate?
- [ ] Not too sensitive (false positives)?
- [ ] Not too lenient (miss issues)?
- [ ] Proper escalation path?

### 6. Guardian Override Decisions

**Confidence threshold**: N/A (manual review always)

**Review checklist**:
- [ ] Clear justification for override?
- [ ] Alternative approaches considered?
- [ ] Risk assessment documented?
- [ ] Stakeholders notified?

**Use sparingly**: Overrides should be rare and well-documented.

---

## Escalation Paths

### When to Escalate

**Escalate to lead guardian** (@onenoly1010):
- Unclear policy application
- Novel scenarios
- High financial impact
- Multiple failed recovery attempts

**Escalate to development team**:
- Suspected bugs
- Performance issues requiring code changes
- Feature requests
- Technical questions beyond guardian scope

**Escalate to stakeholders**:
- Policy changes needed
- Major incidents
- Budget implications
- Strategic decisions

### Escalation Templates

#### To Lead Guardian

```markdown
**Escalation Request**

**Type**: [Policy / Technical / Financial / Strategic]
**Priority**: [Critical / High / Medium / Low]
**Decision ID**: [decision-id]

**Context**:
[Describe the situation]

**Question**:
[What needs to be decided?]

**Options Considered**:
1. [Option A] - [pros/cons]
2. [Option B] - [pros/cons]

**Recommendation**:
[Your recommendation and reasoning]

**Timeline**:
[How urgent is this?]

cc: @onenoly1010
```

---

## Reporting & Documentation

### Decision Log

**For each decision, document**:
- Decision ID
- Type
- Confidence score
- Your decision (approve/reject)
- Reasoning
- Outcome (if known)

**Location**: GitHub issue or guardian log file

### Weekly Report

**Submit every Monday**:

```markdown
# Guardian Weekly Report - Week of [Date]

## Summary
- Total decisions reviewed: X
- Approved: X (X%)
- Rejected: X (X%)
- Average confidence: X.XX

## Highlights
- [Notable decision or incident]
- [Improvement implemented]
- [Issue identified]

## Metrics
- System availability: XX.XX%
- Average response time: XXms
- Autonomous approval rate: XX%

## Concerns
- [Any issues or patterns of concern]

## Recommendations
- [Suggestions for improvement]

## Next Week
- [Planned activities or focus areas]
```

### Incident Reports

**For all Level 2+ incidents**:

Use template: `.github/ISSUE_TEMPLATE/incident-report.md`

**Required sections**:
1. Incident summary
2. Timeline
3. Root cause
4. Impact assessment
5. Resolution
6. Preventive measures
7. Lessons learned

---

## Tools & Resources

### Essential Tools

1. **Guardian Dashboard**: `https://pi-forge-quantum-genesis.railway.app/api/guardian/dashboard`
2. **Decision History**: `https://pi-forge-quantum-genesis.railway.app/api/autonomous/decision-history`
3. **System Metrics**: `https://pi-forge-quantum-genesis.railway.app/api/autonomous/metrics`
4. **Health Endpoint**: `https://pi-forge-quantum-genesis.railway.app/api/health`

### Reference Documentation

- [Space Rituals](./SPACE_RITUALS.md) - Engagement ceremonies and handoff protocols
- [Quick Reference](./GUARDIAN_QUICK_REFERENCE.md) - Fast decision-making guide
- [Architecture](./ARCHITECTURE.md) - System design
- [Autonomous Handover](./AUTONOMOUS_HANDOVER.md) - AI decision system details
- [Rollback Procedures](./ROLLBACK_VALIDATION.md) - Emergency rollback guide

### GitHub Resources

- [Guardian HQ - Issue #100](https://github.com/onenoly1010/pi-forge-quantum-genesis/issues/100)
- [AI Assistant - Issue #102](https://github.com/onenoly1010/pi-forge-quantum-genesis/issues/102)
- [Health Monitoring - Issue #76](https://github.com/onenoly1010/pi-forge-quantum-genesis/issues/76)

### Command Cheat Sheet

```bash
# Check dashboard
curl https://pi-forge-quantum-genesis.railway.app/api/guardian/dashboard | jq .

# Get pending decisions
curl https://pi-forge-quantum-genesis.railway.app/api/autonomous/decision-history?requires_guardian=true | jq .

# Approve decision
curl -X POST https://pi-forge-quantum-genesis.railway.app/api/guardian/approve/{decision_id} \
  -H "Authorization: Bearer <token>" \
  -d '{"approved": true, "comments": "Approved"}'

# Emergency stop
curl -X POST https://pi-forge-quantum-genesis.railway.app/api/guardian/emergency-stop \
  -H "Authorization: Bearer <token>"

# Resume operations
curl -X POST https://pi-forge-quantum-genesis.railway.app/api/guardian/resume \
  -H "Authorization: Bearer <token>"

# Emergency rollback
cd rollback/scripts && ./emergency-rollback.sh --fast
```

---

## Best Practices

1. **Trust but Verify**
   - System is designed for autonomy
   - Spot-check autonomous decisions
   - Verify critical actions

2. **Document Everything**
   - All significant decisions
   - Reasoning and context
   - Outcomes and lessons

3. **Be Responsive**
   - Check dashboard daily
   - Respond to alerts promptly
   - Set up reliable notifications

4. **Communicate Clearly**
   - Provide clear reasoning
   - Share context with team
   - Update documentation

5. **Learn Continuously**
   - Analyze patterns
   - Adjust thresholds
   - Improve processes

6. **Maintain Balance**
   - Don't micromanage autonomous systems
   - Don't be too hands-off either
   - Find the right level of oversight

---

## Onboarding Checklist

**New Guardians should**:
- [ ] Read this entire playbook
- [ ] Review [Architecture](./ARCHITECTURE.md)
- [ ] Study [Quick Reference](./GUARDIAN_QUICK_REFERENCE.md)
- [ ] Access guardian dashboard
- [ ] Test emergency procedures (in staging)
- [ ] Review past incidents
- [ ] Shadow current guardian for 1 week
- [ ] Process first decision with oversight
- [ ] Complete certification (if applicable)

---

## Appendix

### Decision Confidence Formula

```python
confidence = (
    parameter_match_score * 0.3 +
    historical_success_rate * 0.3 +
    risk_assessment_score * 0.2 +
    timing_appropriateness * 0.1 +
    system_health_score * 0.1
)
```

### Safety Score Formula

```python
safety_score = (
    transaction_safety * 0.35 +
    ethical_compliance * 0.35 +
    security_score * 0.30
)
```

### Contact Information

- **Lead Guardian**: @onenoly1010
- **AI Assistant**: @app/copilot-swe-agent
- **Emergency**: [emergency-contact]
- **Support**: [support-email]

---

**Last Updated**: December 2025  
**Version**: 2.0  
**Status**: Active

**🛡️ Guardian duty is a privilege and responsibility. Serve well.**
