# Autonomous Handover Capability Documentation

## Overview

The Autonomous Handover Capability enables the Pi Forge Quantum Genesis system to operate autonomously with AI-driven decision-making, self-healing mechanisms, and comprehensive safety monitoring. This system allows for seamless integration and operation with minimal human intervention while maintaining strict safety guardrails.

## Architecture

### Core Components

1. **Autonomous Decision System** (`server/autonomous_decision.py`)
   - AI-powered decision matrix
   - Configurable decision rules and thresholds
   - Confidence-based approval mechanisms
   - Guardian escalation for high-priority decisions

2. **Self-Healing System** (`server/self_healing.py`)
   - Automated diagnostics (CPU, memory, disk, process health)
   - Automated healing actions
   - Real-time incident reporting
   - Auto-healing metrics tracking

3. **Guardian Monitor** (`server/guardian_monitor.py`)
   - Multi-level safety validation
   - Decision override capabilities
   - Configurable monitoring levels
   - Safety metrics with auto-adjustment

4. **Monitoring Agents** (`server/monitoring_agents.py`)
   - Performance monitoring agent
   - Security monitoring agent
   - Health monitoring agent
   - Decision monitoring agent

5. **Vercel Metrics Service** (`api/autonomous-metrics.ts`)
   - Serverless metrics recording
   - AI-level critical reasoning metrics
   - RESTful API for metrics storage/retrieval

## API Endpoints

### Autonomous Decision Endpoints

#### `POST /api/autonomous/decision`
Make an autonomous decision based on provided context and parameters.

**Request Body:**
```json
{
  "decision_type": "deployment|scaling|rollback|healing|monitoring|guardian_override",
  "priority": "low|medium|high|critical",
  "parameters": [
    {
      "name": "parameter_name",
      "value": "parameter_value",
      "threshold": 0.8,
      "weight": 0.5
    }
  ],
  "source": "source_identifier"
}
```

**Response:**
```json
{
  "decision_id": "deployment_1234567890",
  "decision_type": "deployment",
  "approved": true,
  "confidence": 0.95,
  "reasoning": "Decision reasoning text",
  "actions": ["action1", "action2"],
  "requires_guardian": false,
  "timestamp": 1234567890.123,
  "metadata": {}
}
```

#### `GET /api/autonomous/decision-history?decision_type={type}&limit={limit}`
Retrieve decision history with optional filtering.

#### `GET /api/autonomous/metrics`
Get metrics about autonomous decision making.

**Response:**
```json
{
  "metrics": {
    "total_decisions": 100,
    "approval_rate": 0.85,
    "average_confidence": 0.89,
    "guardian_required_rate": 0.15,
    "by_type": {
      "deployment": {
        "count": 25,
        "approval_rate": 0.88,
        "avg_confidence": 0.91
      }
    }
  },
  "timestamp": 1234567890.123
}
```

### Health & Diagnostics Endpoints

#### `GET /api/health/diagnostics`
Run automated system diagnostics and return health status.

**Response:**
```json
{
  "overall_status": "healthy|degraded|unhealthy|critical",
  "diagnostics": [
    {
      "check": "cpu_usage",
      "status": "healthy",
      "value": 45.2,
      "message": "CPU usage normal: 45.2%"
    }
  ],
  "recent_incidents": [],
  "total_incidents": 5,
  "auto_healed_count": 3,
  "timestamp": 1234567890.123
}
```

#### `GET /api/health/incidents?severity={severity}&component={component}&limit={limit}`
Get incident reports with optional filtering.

### Guardian Monitoring Endpoints

#### `GET /api/guardian/monitoring-status`
Get comprehensive guardian monitoring status.

**Response:**
```json
{
  "monitoring_level": "normal|elevated|high|critical",
  "safety_metrics": {
    "transaction_safety": {
      "value": 0.99,
      "threshold": 0.95,
      "status": "healthy",
      "timestamp": 1234567890.123
    }
  },
  "recent_validations": [],
  "recent_overrides": [],
  "total_validations": 50,
  "total_overrides": 2,
  "timestamp": 1234567890.123
}
```

#### `POST /api/guardian/validate-decision`
Validate an autonomous decision for safety and compliance.

**Request:**
```json
{
  "decision_id": "test_decision_123",
  "decision_data": {
    "decision_type": "deployment",
    "confidence": 0.9,
    "approved": true,
    "requires_guardian": false,
    "metadata": {
      "priority": "medium"
    }
  }
}
```

**Response:**
```json
{
  "validation_id": "val_test_decision_123_1234567890",
  "target": "test_decision_123",
  "status": "approved|rejected|pending|override",
  "checks_passed": 4,
  "checks_failed": 0,
  "details": [
    {
      "check": "safety_threshold",
      "passed": true,
      "value": 0.9,
      "threshold": 0.8,
      "message": "Confidence 90.00% meets threshold 80.00%"
    }
  ],
  "timestamp": 1234567890.123
}
```

#### `POST /api/guardian/override-decision`
Guardian override of an autonomous decision.

**Request Parameters:**
- `original_decision_id`: ID of decision to override
- `action`: "approve", "reject", or "modify"
- `reasoning`: Reasoning for override
- `guardian_id`: Guardian identifier

#### `POST /api/guardian/update-monitoring-level`
Update system monitoring level.

**Request Parameters:**
- `level`: "normal", "elevated", "high", or "critical"
- `reason`: Reason for level change

#### `GET /api/guardian/validation-history?status={status}&limit={limit}`
Get validation history with optional filtering.

### Monitoring Agents Endpoints

#### `GET /api/monitoring/status`
Get status of all monitoring agents.

**Response:**
```json
{
  "agents": {
    "performance": {
      "status": "active|inactive|error|degraded",
      "last_check": 1234567890.123,
      "data_points": 100,
      "interval": 30.0
    }
  },
  "total_agents": 4,
  "active_agents": 4,
  "timestamp": 1234567890.123
}
```

#### `GET /api/monitoring/latest-data?limit={limit}`
Get latest data from all monitoring agents.

#### `POST /api/monitoring/report-to-vercel`
Report metrics to Vercel serverless function.

**Request Body:**
```json
{
  "metric_name": "value",
  "another_metric": "another_value"
}
```

#### `POST /api/monitoring/configure-vercel`
Configure Vercel endpoint for metrics reporting.

**Request Parameters:**
- `endpoint`: Vercel endpoint URL

## Decision Types

### 1. Deployment
- **Confidence Threshold:** 0.8
- **Required Checks:** health, tests, security
- **Max Auto-Approve Priority:** Medium

### 2. Scaling
- **Confidence Threshold:** 0.7
- **CPU Threshold:** 0.75
- **Memory Threshold:** 0.80
- **Max Auto-Approve Priority:** High

### 3. Rollback
- **Confidence Threshold:** 0.9
- **Error Rate Threshold:** 0.05
- **Max Auto-Approve Priority:** Critical

### 4. Healing
- **Confidence Threshold:** 0.85
- **Retry Attempts:** 3
- **Max Auto-Approve Priority:** High

### 5. Monitoring
- **Confidence Threshold:** 0.6
- **Alert Threshold:** 0.8
- **Max Auto-Approve Priority:** Low

### 6. Guardian Override
- **Confidence Threshold:** 0.95
- **Max Auto-Approve Priority:** None (always requires guardian)
- **Required Checks:** security, compliance, validation

## Monitoring Levels

### Normal
- Standard operation
- Auto-approvals allowed within priority limits
- Regular monitoring frequency

### Elevated
- Increased monitoring
- Some auto-approvals restricted
- More frequent health checks

### High
- Strict monitoring
- Most auto-approvals require guardian review
- Frequent diagnostics

### Critical
- Maximum oversight
- All critical decisions require guardian approval
- Continuous monitoring
- Automatic healing prioritized

## Safety Metrics

### Transaction Safety
- **Threshold:** 0.95
- Tracks transaction processing safety and reliability

### Ethical Compliance
- **Threshold:** 0.90
- Monitors ethical alignment of decisions

### Security Score
- **Threshold:** 0.90
- Overall system security assessment

### System Stability
- **Threshold:** 0.85
- System operational stability metric

## Usage Examples

### Example 1: Making a Deployment Decision

```python
import requests

response = requests.post("http://localhost:8000/api/autonomous/decision", json={
    "decision_type": "deployment",
    "priority": "medium",
    "parameters": [
        {
            "name": "health_check",
            "value": True,
            "weight": 0.4
        },
        {
            "name": "test_coverage",
            "value": 0.85,
            "threshold": 0.8,
            "weight": 0.3
        },
        {
            "name": "security_scan",
            "value": True,
            "weight": 0.3
        }
    ],
    "source": "ci_pipeline"
})

decision = response.json()
if decision["approved"]:
    print(f"✅ Deployment approved with {decision['confidence']:.2%} confidence")
else:
    print(f"❌ Deployment requires guardian approval")
```

### Example 2: Running System Diagnostics

```python
import requests

response = requests.get("http://localhost:8000/api/health/diagnostics")
health = response.json()

print(f"System Status: {health['overall_status']}")
for diagnostic in health['diagnostics']:
    print(f"  {diagnostic['check']}: {diagnostic['status']}")
```

### Example 3: Validating a Decision

```python
import requests

response = requests.post("http://localhost:8000/api/guardian/validate-decision", 
    params={"decision_id": "deploy_123"},
    json={
        "decision_type": "deployment",
        "confidence": 0.9,
        "approved": True,
        "requires_guardian": False,
        "metadata": {"priority": "medium"}
    }
)

validation = response.json()
print(f"Validation: {validation['status']}")
print(f"Checks passed: {validation['checks_passed']}/{validation['checks_passed'] + validation['checks_failed']}")
```

## Integration with Existing Systems

### FastAPI Integration
All endpoints integrate seamlessly with the existing FastAPI server (port 8000). The autonomous systems use the same async patterns and error handling as the rest of the application.

### Supabase Authentication
Guardian override endpoints can be protected using existing Supabase JWT authentication. Add authentication dependencies as needed:

```python
from main import get_current_user

@app.post("/api/guardian/override-decision")
async def override_decision(
    ...,
    current_user: dict = Depends(get_current_user)
):
    # Endpoint now requires authentication
    pass
```

### Tracing System
All autonomous operations integrate with the existing OpenTelemetry tracing system, providing full observability across the Sacred Trinity architecture.

## Testing

### Unit Tests
- 24 unit tests covering all modules
- Located in `tests/test_autonomous_handover.py`
- Run with: `pytest tests/test_autonomous_handover.py -v`

### Integration Tests
- 9 integration tests covering all API endpoints
- Located in `tests/test_api_integration.py`
- Run with: `python tests/test_api_integration.py`

### Security
- CodeQL security scanning: 0 vulnerabilities
- All inputs validated
- Rate limiting compatible
- CORS enabled

## Deployment

### Local Development
```bash
cd server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Production Deployment
The autonomous systems are automatically deployed with the main FastAPI application. No additional configuration required.

### Vercel Integration
Deploy the metrics service:
```bash
vercel deploy
```

Configure the endpoint in your application:
```python
response = requests.post("http://localhost:8000/api/monitoring/configure-vercel", 
    params={"endpoint": "https://your-project.vercel.app/api/autonomous-metrics"}
)
```

## Monitoring and Observability

### Logs
All autonomous operations are logged with appropriate severity levels:
- `INFO`: Normal operations
- `WARNING`: Incidents and escalations
- `ERROR`: Failed operations

### Metrics
Access decision metrics via `/api/autonomous/metrics` endpoint.

### Tracing
View distributed traces in VSCode using:
```
Command: ai-mlstudio.tracing.open
```

## Security Considerations

1. **Guardian Authentication**: Protect sensitive endpoints with JWT authentication
2. **Rate Limiting**: Use existing rate limiter for public endpoints
3. **Input Validation**: All inputs are validated using Pydantic models
4. **Monitoring Level**: Critical operations require elevated monitoring levels
5. **Decision History**: All decisions are logged for audit purposes

## Troubleshooting

### Issue: Decisions Always Require Guardian Approval
**Solution:** Check monitoring level and priority settings. Lower priority decisions may auto-approve at Normal monitoring level.

### Issue: Health Diagnostics Show Degraded Status
**Solution:** Check individual diagnostic messages. The system may be operating normally but approaching thresholds.

### Issue: Monitoring Agents Not Active
**Solution:** Agents need to be started via the monitoring system. Check agent status with `/api/monitoring/status`.

### Issue: Vercel Metrics Not Recording
**Solution:** Ensure Vercel endpoint is configured via `/api/monitoring/configure-vercel`.

## Future Enhancements

- [ ] Add machine learning models for decision confidence
- [ ] Implement decision replay and simulation
- [ ] Add more specialized monitoring agents
- [ ] Integrate with external alerting systems (PagerDuty, Slack)
- [ ] Implement decision rollback mechanisms
- [ ] Add A/B testing for decision strategies

## Related Documentation

For more context on collaborative practices and handoff protocols:
- [Space Rituals](./SPACE_RITUALS.md) - Engagement ceremonies and handoff protocols
- [Guardian Playbook](./GUARDIAN_PLAYBOOK.md) - Guardian operational procedures
- [Succession Ceremony](./SUCCESSION_CEREMONY.md) - Leadership transition example

## Support

For issues or questions about the autonomous handover capability, please:
1. Check this documentation
2. Review test cases for usage examples
3. Check application logs for error details
4. Open an issue on GitHub with relevant details
