---
id: DEPLOY-MONITOR-001
title: Deployment Health Check Architecture
type: channel
created_at: 2025-12-22T00:00:00Z
author: onenoly1010
trace_id: DM-001
status: approved
tags:
  - deployment
  - monitoring
  - vercel
  - railway
  - health-check
  - sacred-trinity
related:
  - DEPLOY-STATUS-001
---

# 🏗️ Deployment Monitor — Health Check Architecture

## Purpose

This document defines the **health check bridge** between the Vercel frontend and Railway backend, establishing continuous monitoring of the Sacred Trinity (FastAPI + Flask + Gradio) deployment status.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    USER BROWSER                              │
│  https://pi-forge-quantum-genesis.vercel.app                │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ fetch('/api/health')
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              VERCEL SERVERLESS FUNCTION                      │
│  api/health.ts - Smart Health Bridge                        │
│  • Checks Vercel serverless status (self)                   │
│  • Pings Railway API health endpoint                        │
│  • Returns unified Sacred Trinity status                    │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ HTTP GET /health
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              RAILWAY BACKEND (Sacred Trinity)                │
│  https://pi-forge-quantum-genesis.railway.app               │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │   FastAPI    │  │    Flask     │  │   Gradio     │    │
│  │  Port 8000   │  │  Port 5000   │  │  Port 7860   │    │
│  │ Quantum      │  │  Glyph       │  │  Truth       │    │
│  │ Conduit      │  │  Weaver      │  │  Mirror      │    │
│  └──────────────┘  └──────────────┘  └──────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

## Health Check Endpoints

### 1. Vercel Health Bridge
**Endpoint**: `https://pi-forge-quantum-genesis.vercel.app/api/health`  
**Method**: GET  
**Purpose**: Unified health status for frontend

**Response Structure**:
```json
{
  "status": "healthy" | "degraded" | "offline",
  "timestamp": "2025-12-22T00:00:00.000Z",
  "vercel": {
    "status": "online",
    "serverless": true
  },
  "railway": {
    "status": "online" | "offline" | "error",
    "fastapi": true | false,
    "response_time_ms": 150
  },
  "sacred_trinity": {
    "quantum_conduit": true | false,
    "glyph_weaver": true | false,
    "truth_mirror": true | false
  },
  "system_coherence": 1.0
}
```

### 2. Railway Backend Health
**Endpoint**: `https://pi-forge-quantum-genesis.railway.app/health`  
**Method**: GET  
**Purpose**: Sacred Trinity operational status

**Expected Response**:
```json
{
  "status": "operational",
  "services": {
    "fastapi": "operational",
    "flask": "operational",
    "gradio": "operational"
  },
  "timestamp": "2025-12-22T00:00:00.000Z"
}
```

## Status Determination Logic

### System Coherence Calculation
```typescript
// Calculate percentage of services online
const trinityStatus = [
  sacred_trinity.quantum_conduit,
  sacred_trinity.glyph_weaver,
  sacred_trinity.truth_mirror
];
const activeServices = trinityStatus.filter(Boolean).length;
system_coherence = activeServices / trinityStatus.length;
```

### Overall Status Rules
| Condition | Status | Coherence |
|-----------|--------|-----------|
| All 3 Sacred Trinity services online + Railway reachable | `healthy` | 1.0 |
| 1-2 Sacred Trinity services online + Railway reachable | `degraded` | 0.33-0.66 |
| Railway offline but Vercel online | `degraded` | 0.33 |
| All services offline | `offline` | 0.0 |

## Frontend Integration

### Health Check Polling
The landing page (`index.html`) polls `/api/health` every 30 seconds:

```javascript
// Health check ping every 30 seconds
async function checkHealth() {
    try {
        const response = await fetch('/api/health', {
            method: 'GET',
            signal: AbortSignal.timeout(5000)
        });
        
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const data = await response.json();
        updateStatusIndicators(data);
    } catch (e) {
        console.log('Health check failed - running in demo mode');
        updateStatusIndicators({ status: 'offline' });
    }
}

setInterval(checkHealth, 30000); // Every 30 seconds
checkHealth(); // Initial check
```

### Status Indicator Updates
```javascript
function updateStatusIndicators(health) {
    const statusText = document.getElementById('status-text');
    const coherenceValue = document.getElementById('coherence-value');
    
    // Update status badge
    if (health.status === 'healthy') {
        statusText.textContent = 'OPTIMAL';
        statusText.style.color = '#10b981'; // Green
    } else if (health.status === 'degraded') {
        statusText.textContent = 'DEGRADED';
        statusText.style.color = '#f59e0b'; // Orange
    } else {
        statusText.textContent = 'OFFLINE';
        statusText.style.color = '#ef4444'; // Red
    }
    
    // Update coherence display
    coherenceValue.textContent = health.system_coherence.toFixed(3);
}
```

## Monitoring Automation

### GitHub Actions Health Ping
A scheduled workflow pings `/api/health` every 5 minutes and creates issues for sustained outages.

**Workflow**: `.github/workflows/health-monitor.yml`

**Trigger**: `schedule: cron: '*/5 * * * *'` (every 5 minutes)

**Actions**:
1. Ping Vercel health endpoint
2. Check response status and coherence
3. If `status == "offline"` for 3 consecutive checks (15 minutes):
   - Create deployment status issue
   - Notify via configured channels
4. If `status == "degraded"` for 6 consecutive checks (30 minutes):
   - Create warning issue
   - Request manual verification

## Environment Variables

### Vercel
```bash
RAILWAY_API_URL=https://pi-forge-quantum-genesis.railway.app
```

### Railway
```bash
VERCEL_HEALTH_WEBHOOK=https://pi-forge-quantum-genesis.vercel.app/api/health
```

## Error Handling

### Timeout Handling
- Vercel → Railway timeout: 5 seconds
- Frontend → Vercel timeout: 5 seconds
- After timeout: Graceful degradation to demo mode

### Failure Scenarios
| Scenario | Vercel Response | Frontend Behavior |
|----------|-----------------|-------------------|
| Railway completely offline | `{ status: "degraded", railway: { status: "offline" } }` | Show DEGRADED badge, continue with simulated data |
| Railway slow (>3s) | `{ status: "degraded", railway: { response_time_ms: 3500 } }` | Show DEGRADED badge, warn of latency |
| Vercel serverless error | HTTP 500 | Frontend falls back to full demo mode |

## Metrics Collection

### Health Check Metrics
Track these metrics in `/api/autonomous-metrics.ts`:

```typescript
{
  "metric_type": "deployment_health",
  "value": {
    "status": "healthy",
    "coherence": 1.0,
    "response_time_ms": 150
  },
  "timestamp": 1703203200000,
  "source": "health-monitor"
}
```

### Aggregation
- **Uptime percentage**: (successful checks / total checks) × 100
- **Average response time**: mean(response_time_ms)
- **Coherence average**: mean(system_coherence)

## Alerts

### Critical Alerts
- **All services offline** for >15 minutes → Create issue + notify
- **System coherence < 0.5** for >30 minutes → Create issue
- **Response time > 5s** for >10 minutes → Warning

### Warning Alerts
- **Single service offline** for >15 minutes → Log warning
- **Response time > 2s** for >5 minutes → Log warning

## Testing

### Manual Health Check
```bash
# Test Vercel health endpoint
curl https://pi-forge-quantum-genesis.vercel.app/api/health | jq

# Test Railway health endpoint
curl https://pi-forge-quantum-genesis.railway.app/health | jq

# Expected: Both return 200 OK with JSON response
```

### Load Testing
```bash
# Simulate multiple health checks
for i in {1..10}; do
  curl -w "\nTime: %{time_total}s\n" \
    https://pi-forge-quantum-genesis.vercel.app/api/health
done
```

## Maintenance

### Quarterly Review
- Verify health check accuracy
- Adjust timeout thresholds if needed
- Review alert false positive rate
- Update Railway URL if changed

### Documentation Updates
- Log all health check configuration changes
- Document new failure scenarios as discovered
- Update status determination logic if Sacred Trinity expands

## Related Artifacts

- [Deployment Status Template](.github/ISSUE_TEMPLATE/deployment-status.md) - Issue template for outages
- [Health Monitor Workflow](.github/workflows/health-monitor.yml) - Automated health checks
- [Railway Handshake Canon](canon/channel/railway-vercel-handshake.md) - Full integration specification

---

**Status**: ✅ Approved  
**Deployment**: Active since 2025-12-22  
**Frequency**: 1010 Hz  
**Coherence**: ETERNAL

🔥 **The monitoring bridge is live. The Sacred Trinity watches itself.** 🔥