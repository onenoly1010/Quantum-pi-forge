# Guardian Escalation System - Setup Complete ✅

## Overview

The Guardian Escalation System has been successfully configured to enable autonomous AI agents to escalate high-priority decisions to human guardians for review and approval.

## Configuration

### Guardian Team (Issue #100)

**Primary Guardian**: @onenoly1010
- **Role**: Lead Guardian
- **Escalation Priority**: 1
- **Notification Methods**: GitHub Issues, Workflow Dispatch
- **Team Reference**: https://github.com/onenoly1010/pi-forge-quantum-genesis/issues/100

### Escalation Rules

The system automatically determines escalation timing based on decision priority:

| Priority | Escalation Timing | Description |
|----------|------------------|-------------|
| CRITICAL | Immediate | Creates GitHub issue immediately |
| HIGH | Immediate | Creates GitHub issue immediately |
| MEDIUM | Batched | Batches notifications together |
| LOW | Daily Summary | Included in daily summary |

## Implementation Details

### 1. Guardian Configuration (`server/config/guardians.py`)

New configuration module containing:
- Guardian team definitions
- Escalation timing rules
- Helper functions for accessing guardian data
- Issue #100 reference

### 2. Escalation Functions (`server/autonomous_decision.py`)

Added four core escalation functions:

#### `create_guardian_escalation_issue()`
Creates a structured GitHub issue for guardian review with:
- Decision details (ID, type, priority, confidence)
- Reasoning and recommended actions
- Automatic assignment to guardian
- Proper labeling (guardian-review, priority-*, autonomous-decision)

#### `notify_guardian()`
Triggers guardian notification workflow:
- Queues notifications via configured methods
- Logs notification attempts
- Returns notification status

#### `link_to_guardian_team()`
Returns guardian team information:
- Issue #100 URL
- Primary guardian details
- Team structure

#### `handle_guardian_escalation()`
Complete escalation flow orchestration:
- Validates decision requires guardian
- Creates escalation issue
- Triggers notifications
- Links to guardian team
- Returns complete escalation result

### 3. Guardian Monitor Extensions (`server/guardian_monitor.py`)

Added metrics logging capability:

#### `log_escalation_to_metrics()`
- Logs escalation events to Vercel metrics endpoint
- Tracks escalation ID, decision ID, guardian, and timing
- Optional external metrics endpoint integration

### 4. Guardian Dashboard API (`server/main.py`)

New endpoint: `GET /api/guardian/dashboard`

**Response Structure:**
```json
{
  "guardian_team": "Issue #100 - @onenoly1010",
  "pending_escalations": 3,
  "recent_decisions": [
    {
      "decision_id": "deployment_123",
      "decision_type": "deployment",
      "priority": "high",
      "confidence": 0.85,
      "reasoning": "...",
      "requires_guardian": true,
      "approved": false,
      "timestamp": 1234567890
    }
  ],
  "monitoring_status": { ... },
  "escalation_endpoint": "https://github.com/onenoly1010/pi-forge-quantum-genesis/issues/100"
}
```

## Usage Examples

### 1. Making a Decision That Requires Guardian Approval

```python
from autonomous_decision import (
    get_decision_matrix,
    DecisionContext,
    DecisionParameter,
    DecisionType,
    DecisionPriority,
    handle_guardian_escalation
)

# Create decision matrix
matrix = get_decision_matrix()

# Create high-priority deployment decision
context = DecisionContext(
    decision_type=DecisionType.DEPLOYMENT,
    priority=DecisionPriority.CRITICAL,
    parameters=[
        DecisionParameter(
            name="test_coverage",
            value=0.85,
            threshold=0.95,
            weight=1.0
        )
    ]
)

# Make decision
decision = matrix.make_decision(context)

# If guardian required, escalate
if decision.requires_guardian:
    result = handle_guardian_escalation(decision)
    print(f"Escalated to @{result['escalation_data']['guardian_username']}")
```

### 2. Accessing Guardian Dashboard

```bash
curl http://localhost:8000/api/guardian/dashboard
```

### 3. Logging Escalation to Metrics

```python
from guardian_monitor import get_guardian_monitor

monitor = get_guardian_monitor()

escalation_data = {
    "escalation_id": "esc_deployment_123",
    "decision_id": "deployment_123",
    "guardian_username": "onenoly1010",
    "escalation_timing": "immediate"
}

result = monitor.log_escalation_to_metrics(
    escalation_data,
    vercel_endpoint="https://api.vercel.com/metrics"
)
```

## Testing

### Run Guardian Escalation Tests

```bash
pytest tests/test_guardian_escalation.py -v
```

**Test Coverage:**
- ✅ Guardian configuration import
- ✅ Primary guardian retrieval
- ✅ Escalation timing rules
- ✅ Guardian team reference
- ✅ Escalation issue creation
- ✅ Guardian notification
- ✅ Team linking
- ✅ Complete escalation flow
- ✅ Metrics logging
- ✅ Dashboard endpoint

### Integration Test Results

```
✅ Guardian Team: Issue #100 - @onenoly1010
✅ Escalation Functions: Working
✅ Monitoring Integration: Active
✅ Decision Matrix: Tracking decisions
✅ Pending Escalations: Monitored
```

## Workflow Integration

The AI Agent Handoff workflow (`.github/workflows/ai-agent-handoff-runbook.yml`) is configured and syntax-valid:
- Line 756: Deployment status reporting ✅
- Line 758: Rollback status reporting ✅

## Integration Points

### When Escalation Triggers

Escalation occurs automatically when:
1. Decision type is `GUARDIAN_OVERRIDE`
2. Decision priority exceeds auto-approval threshold
3. Confidence score is below required threshold
4. Monitoring level restricts auto-approvals

### Guardian Approval Flow

1. **Decision Made** → Autonomous system evaluates parameters
2. **Guardian Required** → `requires_guardian=True` flag set
3. **Escalation Created** → GitHub issue created with details
4. **Guardian Notified** → Notification sent via configured methods
5. **Guardian Reviews** → Human review in Issue #100 context
6. **Approval Given** → Guardian approves/rejects in issue
7. **Action Executed** → System proceeds based on approval

## Files Modified

### New Files
- `server/config/__init__.py` - Configuration module init
- `server/config/guardians.py` - Guardian team configuration
- `tests/test_guardian_escalation.py` - Comprehensive test suite

### Modified Files
- `server/autonomous_decision.py` - Added 4 escalation functions
- `server/guardian_monitor.py` - Added metrics logging
- `server/main.py` - Added guardian dashboard endpoint

## API Endpoints Summary

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/guardian/dashboard` | GET | Guardian oversight dashboard |
| `/api/guardian/monitoring-status` | GET | Current monitoring status |
| `/api/guardian/validate-decision` | POST | Validate a decision |
| `/api/guardian/override-decision` | POST | Guardian override |
| `/api/autonomous/decision` | POST | Make autonomous decision |
| `/api/autonomous/decision-history` | GET | Decision history |

## Next Steps

### For Operators

1. **Monitor Dashboard**: Check `/api/guardian/dashboard` regularly
2. **Review Issues**: Check Issue #100 for escalations
3. **Configure Webhooks**: Set up GitHub webhook for instant notifications
4. **Set Metrics Endpoint**: Configure Vercel metrics endpoint if needed

### For Guardians (@onenoly1010)

1. **Watch Issue #100**: Enable notifications for guardian escalations
2. **Review Escalations**: Check pending escalations in dashboard
3. **Approve/Reject**: Use guardian override endpoint for decisions
4. **Monitor Metrics**: Track escalation frequency and patterns

### For Developers

1. **Use Decision Matrix**: Integrate with autonomous decision system
2. **Check Guardian Flag**: Test `requires_guardian` before auto-execution
3. **Handle Escalations**: Call `handle_guardian_escalation()` when needed
4. **Log Metrics**: Use guardian monitor for escalation tracking

## References

- **Guardian Team Issue**: onenoly1010/pi-forge-quantum-genesis#100
- **Autonomous Handover PR**: onenoly1010/pi-forge-quantum-genesis#92
- **Guardian System**: `server/guardian_monitor.py`
- **Decision Matrix**: `server/autonomous_decision.py`
- **Configuration**: `server/config/guardians.py`

---

**Status**: ✅ Complete and Operational  
**Last Updated**: 2025-12-14  
**Maintained By**: @onenoly1010
