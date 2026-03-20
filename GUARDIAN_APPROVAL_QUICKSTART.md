# Guardian Approval System - Quick Start Guide

## 🚀 Quick Start (30 seconds)

### Check if a deployment is approved
```bash
python scripts/record_guardian_approval.py check deployment_1734134400000
```

### Approve a new deployment
```bash
python scripts/record_guardian_approval.py record deployment_NEW_ID \
  --guardian YOUR_USERNAME \
  --reasoning "Your approval reason"
```

### View approval statistics
```bash
python scripts/record_guardian_approval.py stats
```

---

## 📖 Common Use Cases

### 1. Approve a HIGH Priority Deployment

```bash
python scripts/record_guardian_approval.py record deployment_1234567890000 \
  --guardian onenoly1010 \
  --reasoning "All tests pass, security verified, ready for deployment" \
  --priority high \
  --confidence 0.85
```

**Result:**
```
✅ Guardian approval recorded:
   Approval ID: approval_1765738999767
   Decision ID: deployment_1234567890000
   Action: approve
   Guardian: onenoly1010
   Reasoning: All tests pass, security verified, ready for deployment
   Timestamp: 2025-12-14T19:03:19.767088
```

### 2. Reject a Deployment

```bash
python scripts/record_guardian_approval.py record deployment_1234567890000 \
  --guardian onenoly1010 \
  --action reject \
  --reasoning "Security vulnerabilities found, needs review"
```

### 3. Check Approval Status

```bash
python scripts/record_guardian_approval.py check deployment_1234567890000
```

**Result if approved:**
```
✅ Decision deployment_1234567890000 is approved:
   Approval ID: approval_1765738999767
   Action: approve
   Guardian: onenoly1010
   Reasoning: Perfect, Approved
   Timestamp: 2025-12-14T19:03:19.767088
```

**Result if not approved:**
```
❌ Decision deployment_1234567890000 has not been approved
```

### 4. List Recent Approvals

```bash
python scripts/record_guardian_approval.py list --limit 5
```

**Result:**
```
Recent approvals (showing 5):
  • approval_1765738999767
    Decision: deployment_1734134400000
    Action: approve
    Guardian: onenoly1010
    Type: deployment
    Priority: high
    Time: 2025-12-14T19:03:19.767088
```

---

## 🌐 Using the REST API

### Start the Server

```bash
cd server
uvicorn main:app --reload --port 8000
```

### Record an Approval (POST)

```bash
curl -X POST http://localhost:8000/api/guardian/record-approval \
  -H "Content-Type: application/json" \
  -d '{
    "decision_id": "deployment_1234567890000",
    "decision_type": "deployment",
    "guardian_id": "onenoly1010",
    "action": "approve",
    "reasoning": "All tests pass",
    "priority": "high",
    "confidence": 0.85
  }'
```

**Response:**
```json
{
  "approval_id": "approval_1765738999767",
  "decision_id": "deployment_1234567890000",
  "action": "approve",
  "guardian_id": "onenoly1010",
  "timestamp": 1765738999.767088,
  "status": "recorded"
}
```

### Check Approval Status (GET)

```bash
curl http://localhost:8000/api/guardian/check-approval/deployment_1234567890000
```

**Response:**
```json
{
  "decision_id": "deployment_1234567890000",
  "is_approved": true,
  "approval": {
    "approval_id": "approval_1765738999767",
    "action": "approve",
    "guardian_id": "onenoly1010",
    "reasoning": "All tests pass",
    "timestamp": 1765738999.767088
  }
}
```

### Get All Approvals (GET)

```bash
curl http://localhost:8000/api/guardian/approvals?decision_type=deployment&action=approve&limit=10
```

### Get Statistics (GET)

```bash
curl http://localhost:8000/api/guardian/approval-stats
```

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

---

## 🔧 Advanced Options

### CLI Options

```bash
python scripts/record_guardian_approval.py record --help
```

**Available options:**
- `--type`: Decision type (default: deployment)
- `--guardian`: Guardian ID (default: guardian)
- `--action`: Action to take - approve, reject, or modify (default: approve)
- `--reasoning`: Reasoning for the action (default: "Manual guardian approval")
- `--priority`: Priority level - critical, high, medium, or low (default: high)
- `--confidence`: Confidence score 0.0-1.0 (default: 0.76)

### Example with All Options

```bash
python scripts/record_guardian_approval.py record deployment_1234567890000 \
  --type deployment \
  --guardian onenoly1010 \
  --action approve \
  --reasoning "Security audit passed, all tests green, ready for production" \
  --priority critical \
  --confidence 0.92
```

---

## 📂 Storage Location

Approvals are stored in: `.guardian_approvals/approvals.json`

**⚠️ Important:** This directory is excluded from git. Make sure to back up approvals in production!

---

## ✅ Validation Rules

### Action Values
- ✅ `approve` - Approve the decision
- ✅ `reject` - Reject the decision
- ✅ `modify` - Approve with modifications
- ❌ Any other value will fail validation

### Priority Values
- ✅ `critical` - Critical priority
- ✅ `high` - High priority
- ✅ `medium` - Medium priority
- ✅ `low` - Low priority
- ❌ Any other value will fail validation

### Confidence Range
- ✅ `0.0` to `1.0` - Valid confidence scores
- ❌ Outside this range will fail validation

---

## 🔍 Troubleshooting

### Permission Denied Error
```bash
❌ Permission denied: [Errno 13] Permission denied: '.guardian_approvals'
   Try running with appropriate permissions or check directory access
```

**Solution:** Ensure you have write permissions in the current directory.

### Module Not Found Error
```bash
ModuleNotFoundError: No module named 'pydantic'
```

**Solution:** Install required dependencies:
```bash
pip install pydantic
```

### Decision Not Found
```bash
❌ Decision deployment_XXXXX has not been approved
```

**This is normal** - it means no approval has been recorded for that decision yet.

---

## 📚 Additional Documentation

- **Complete API Documentation**: `docs/GUARDIAN_APPROVAL_SYSTEM.md`
- **Implementation Summary**: `GUARDIAN_APPROVAL_SUMMARY.md`
- **Completion Report**: `COMPLETION_REPORT.md`

---

## 🎓 Learn More

### Run the Tests
```bash
python -m pytest tests/test_guardian_approvals.py -v
python -m pytest tests/test_guardian_approval_api.py -v
```

### View the Source Code
- Core system: `server/guardian_approvals.py`
- API endpoints: `server/main.py` (search for `/api/guardian/`)
- CLI tool: `scripts/record_guardian_approval.py`

---

## 💡 Pro Tips

1. **Use descriptive reasoning**: Future you will thank you for detailed approval reasons
2. **Set appropriate priority**: Match the urgency of the deployment
3. **Check before deploying**: Always verify approval status before executing
4. **Keep backups**: The `.guardian_approvals/` directory should be backed up
5. **Use the API in CI/CD**: Integrate approval checks into your deployment pipeline

---

## 🎉 That's It!

You now have a production-ready guardian approval system. The deployment decision `deployment_1734134400000` has been approved and is ready to proceed.

**Happy deploying!** 🚀
