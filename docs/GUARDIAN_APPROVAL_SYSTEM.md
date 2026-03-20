# Guardian Approval System

## Overview

The Guardian Approval System provides a mechanism for recording and managing guardian approvals for autonomous deployment decisions. When an AI agent makes a high-priority decision that requires human oversight, this system enables guardians to approve, reject, or modify those decisions.

## Architecture

The system consists of three main components:

1. **Guardian Approval Module** (`server/guardian_approvals.py`) - Core logic for recording and managing approvals
2. **API Endpoints** (`server/main.py`) - REST API for recording and querying approvals
3. **CLI Tool** (`scripts/record_guardian_approval.py`) - Command-line interface for approval management

## Features

- **Persistent Storage**: Approvals are stored in JSON format for persistence across restarts
- **Approval History**: Complete audit trail of all guardian decisions
- **Statistics**: Approval rates and metrics by decision type
- **Filtering**: Query approvals by decision type, action, or other criteria
- **Multiple Guardians**: Support for multiple guardians with override capability

## Usage

### CLI Tool

#### Record an Approval

```bash
python scripts/record_guardian_approval.py record deployment_1734134400000 \
  --guardian onenoly1010 \
  --reasoning "Perfect, Approved" \
  --priority high \
  --confidence 0.76
```

#### Check Approval Status

```bash
python scripts/record_guardian_approval.py check deployment_1734134400000
```

#### List Recent Approvals

```bash
python scripts/record_guardian_approval.py list --limit 10
```

#### Show Statistics

```bash
python scripts/record_guardian_approval.py stats
```

### API Endpoints

#### POST `/api/guardian/record-approval`

Record a guardian approval for a deployment decision.

**Request Body:**
```json
{
  "decision_id": "deployment_1734134400000",
  "decision_type": "deployment",
  "guardian_id": "onenoly1010",
  "action": "approve",
  "reasoning": "Perfect, Approved",
  "priority": "high",
  "confidence": 0.76,
  "metadata": {
    "issue_number": 123,
    "commit_hash": "a1b2c3d"
  }
}
```

**Response:**
```json
{
  "approval_id": "approval_1765738999767",
  "decision_id": "deployment_1734134400000",
  "action": "approve",
  "guardian_id": "onenoly1010",
  "timestamp": 1765738999.767088,
  "status": "recorded"
}
```

#### GET `/api/guardian/check-approval/{decision_id}`

Check if a specific decision has been approved.

**Response:**
```json
{
  "decision_id": "deployment_1734134400000",
  "is_approved": true,
  "approval": {
    "approval_id": "approval_1765738999767",
    "action": "approve",
    "guardian_id": "onenoly1010",
    "reasoning": "Perfect, Approved",
    "timestamp": 1765738999.767088
  }
}
```

#### GET `/api/guardian/approvals`

Get all guardian approvals with optional filtering.

**Query Parameters:**
- `decision_type` (optional): Filter by decision type (deployment, scaling, rollback, etc.)
- `action` (optional): Filter by action (approve, reject, modify)
- `limit` (optional): Maximum number of results (default: 100)

**Response:**
```json
{
  "approvals": [
    {
      "approval_id": "approval_1765738999767",
      "decision_id": "deployment_1734134400000",
      "decision_type": "deployment",
      "guardian_id": "onenoly1010",
      "action": "approve",
      "reasoning": "Perfect, Approved",
      "priority": "high",
      "confidence": 0.76,
      "timestamp": 1765738999.767088,
      "metadata": {}
    }
  ],
  "count": 1
}
```

#### GET `/api/guardian/approval-stats`

Get statistics about guardian approvals.

**Response:**
```json
{
  "total": 1,
  "approved": 1,
  "rejected": 0,
  "modified": 0,
  "approval_rate": 1.0,
  "by_type": {
    "deployment": {
      "total": 1,
      "approved": 1,
      "rejected": 0,
      "modified": 0
    }
  }
}
```

### Python API

```python
from server.guardian_approvals import get_approval_system

# Get the approval system
approval_system = get_approval_system()

# Record an approval
approval = approval_system.record_approval(
    decision_id="deployment_1734134400000",
    decision_type="deployment",
    guardian_id="onenoly1010",
    action="approve",
    reasoning="Perfect, Approved",
    priority="high",
    confidence=0.76
)

# Check if approved
is_approved = approval_system.is_approved("deployment_1734134400000")

# Get approval details
approval = approval_system.get_approval("deployment_1734134400000")

# Get all approvals
approvals = approval_system.get_all_approvals(
    decision_type="deployment",
    action="approve",
    limit=100
)

# Get statistics
stats = approval_system.get_approval_stats()
```

## Decision Types

The system supports the following decision types:

- `deployment` - Deployment to production
- `scaling` - Scaling resources up/down
- `rollback` - Rolling back a deployment
- `healing` - Self-healing actions
- `monitoring` - Monitoring configuration changes
- `guardian_override` - Guardian override decisions

## Actions

Guardians can take three types of actions:

- `approve` - Approve the decision for execution
- `reject` - Reject the decision
- `modify` - Approve with modifications

## Priority Levels

- `critical` - Immediate action required
- `high` - High priority
- `medium` - Medium priority
- `low` - Low priority

## Storage

Approvals are stored in `.guardian_approvals/approvals.json` by default. This directory is excluded from version control via `.gitignore`.

The storage format is JSON:

```json
[
  {
    "approval_id": "approval_1765738999767",
    "decision_id": "deployment_1734134400000",
    "decision_type": "deployment",
    "guardian_id": "onenoly1010",
    "action": "approve",
    "reasoning": "Perfect, Approved",
    "priority": "high",
    "confidence": 0.76,
    "timestamp": 1765738999.767088,
    "metadata": {
      "recorded_via": "cli_script",
      "timestamp_human": "2025-12-14T19:03:19.767061"
    }
  }
]
```

## Integration with Autonomous Decision System

The Guardian Approval System integrates with the existing autonomous decision system:

1. AI agent makes a decision using `AIDecisionMatrix`
2. Decision is validated by `GuardianMonitor`
3. If `requires_guardian` is true, decision is escalated
4. Guardian approves/rejects using this system
5. Approval status is checked before execution

## Security Considerations

- **Authentication**: In production, guardian endpoints should require JWT authentication
- **Authorization**: Only authorized guardians should be able to approve decisions
- **Audit Trail**: All approvals are logged with timestamp and guardian ID
- **Persistence**: Approval data should be backed up regularly

## Testing

Run the test suite:

```bash
python -m pytest tests/test_guardian_approvals.py -v
```

## Future Enhancements

- Database backend (PostgreSQL/Supabase) for scalability
- Multi-signature approvals (require multiple guardians)
- Time-based expiration of approvals
- Integration with notification systems (Slack, email)
- Web UI for guardian approval workflow
- Approval templates for common scenarios
