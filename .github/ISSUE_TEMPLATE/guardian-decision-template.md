---
name: Guardian Decision
about: Template for requesting Guardian approval on autonomous system decisions
title: '[GUARDIAN] '
labels: 'guardian-decision, needs-approval'
assignees: 'onenoly1010'
---

## 🛡️ Guardian Decision Request

### Decision Information

**Decision ID:** [Auto-generated or reference ID]  
**Decision Type:** [Select: Deployment | Scaling | Rollback | Healing | Monitoring | Override]  
**Priority:** [Select: Critical | High | Medium | Low]  
**Confidence Score:** [0.0 - 1.0]  
**Requested By:** [System/User]  
**Timestamp:** [ISO 8601 format]

---

### Decision Summary

**What action is being requested?**

[Provide a clear, concise description of the proposed action]

**Why is Guardian approval needed?**

[Explain why this decision requires human oversight - e.g., confidence below threshold, high impact, critical system change]

---

### Context & Analysis

**Current State:**

[Describe the current system state, metrics, or conditions that led to this decision request]

**Proposed Change:**

[Detail what will change if this decision is approved]

**Risk Assessment:**

- **Safety Impact:** [Low | Medium | High]
- **Blast Radius:** [Describe potential scope of impact if something goes wrong]
- **Reversibility:** [Can this be easily rolled back? Yes/No]
- **Data Risk:** [Is there any risk to data integrity? Yes/No]

**Supporting Data:**

- Relevant metrics: [List key performance indicators]
- Recent history: [Any related events or patterns]
- Dependencies: [What other systems/services are affected]

---

### Decision Criteria Review

**Safety Checklist:**

- [ ] No security risks identified
- [ ] No stability concerns
- [ ] Data integrity preserved
- [ ] Rollback plan exists (if applicable)

**Impact Assessment:**

- [ ] Impact scope documented
- [ ] User impact assessed
- [ ] Financial impact calculated
- [ ] Recovery plan defined

**Approval Criteria:**

- [ ] Tests passed (if deployment)
- [ ] Metrics justify action (if scaling)
- [ ] Root cause known (if rollback/healing)
- [ ] Cost acceptable
- [ ] No active incidents

---

### Guardian Response

**Decision:** [Approve | Reject | Escalate | Need More Info]

**Guardian Comments:**

[Guardian's reasoning, additional context, or concerns]

**Conditions (if conditional approval):**

[Any specific conditions or requirements for execution]

**Follow-up Actions:**

[What should happen next, monitoring requirements, etc.]

---

### Reference Links

- [Guardian Playbook](../../docs/GUARDIAN_PLAYBOOK.md)
- [Guardian Quick Reference](../../docs/GUARDIAN_QUICK_REFERENCE.md)
- [Guardian HQ - Issue #100](https://github.com/onenoly1010/pi-forge-quantum-genesis/issues/100)

---

### Decision Timeline

**Requested:** [Timestamp]  
**Responded:** [Timestamp]  
**Executed:** [Timestamp]  
**Verified:** [Timestamp]

---

### Notes

[Any additional context, lessons learned, or notes for future reference]
