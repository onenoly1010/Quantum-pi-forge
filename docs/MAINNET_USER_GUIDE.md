# 🌌 Pi Forge Quantum Genesis - Mainnet User Guide

## Welcome to the Production Dashboard

This guide helps Pi community members, developers, and non-technical users navigate and fully utilize the Pi Forge Quantum Genesis mainnet dashboard.

---

## 📋 Table of Contents

1. [Getting Started](#getting-started)
2. [Dashboard Overview](#dashboard-overview)
3. [Pi Network Integration](#pi-network-integration)
4. [Cyber Samurai Guardian](#cyber-samurai-guardian)
5. [Governance Participation](#governance-participation)
6. [Smart Contract Auditing](#smart-contract-auditing)
7. [Visualization Features](#visualization-features)
8. [API Reference](#api-reference)
9. [Troubleshooting](#troubleshooting)

---

## 🚀 Getting Started

### For Pi Community Members

1. **Access the Dashboard**: Navigate to the deployed dashboard URL
2. **Connect Your Pi Wallet**: Use the Pi Browser to authenticate
3. **Explore Features**: Browse governance proposals, check your staking rewards, and participate in community decisions

### For Developers

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/onenoly1010/pi-forge-quantum-genesis.git
   cd pi-forge-quantum-genesis
   ```

2. **Install Dependencies**:
   ```bash
   pip install -r server/requirements.txt
   ```

3. **Configure Environment**:
   ```bash
   cp .env.example .env
   # Edit .env with your Supabase and Pi Network credentials
   ```

4. **Run the Dashboard**:
   ```bash
   python -m uvicorn server.main:app --host 0.0.0.0 --port 8000
   ```

---

## 🎛️ Dashboard Overview

### Sacred Trinity Architecture

The dashboard operates on three interconnected services:

| Service | Port | Function |
|---------|------|----------|
| **FastAPI Quantum Conduit** | 8000 | Core API, Authentication, WebSockets |
| **Flask Glyph Weaver** | 5000 | Visualization, SVG Generation |
| **Gradio Truth Mirror** | 7860 | Ethical Audits, Governance Tools |

### Key Endpoints

- **Health Check**: `GET /` - System status and mainnet readiness
- **API Documentation**: `GET /docs` - Interactive Swagger UI
- **WebSocket**: `WS /ws/collective-insight` - Real-time updates

---

## 💰 Pi Network Integration

### Mainnet Transactions

The dashboard supports full mainnet Pi Network transactions:

```javascript
// Example: Payment verification
const payment = await Pi.createPayment({
    amount: 0.15,
    memo: "PiForge Boost: 25% Ethical Resonance Activated",
    metadata: { type: 'mining_boost' }
}, {
    onPaymentSuccess: (payment) => {
        PiForge.renderResonanceViz(payment.metadata);
    }
});
```

### Verify Payment Status

```bash
curl -X POST https://your-dashboard.com/api/verify-payment \
  -H "Content-Type: application/json" \
  -d '{
    "payment_id": "your_payment_id",
    "amount": 0.15
  }'
```

### Response:
```json
{
  "status": "verified",
  "payment_id": "your_payment_id",
  "amount": 0.15,
  "tx_hash": "abc123def456",
  "resonance_state": "transcendence",
  "network": "mainnet"
}
```

---

## ⚔️ Cyber Samurai Guardian

The Guardian monitors system health with quantum-inspired benchmarks targeting sub-5-nanosecond latency.

### Check Guardian Status

```bash
curl https://your-dashboard.com/api/guardian/status
```

### Response:
```json
{
  "guardian_active": true,
  "latency": {
    "latency_ns": 4.2,
    "threshold_ns": 5,
    "within_threshold": true,
    "harmonic_stability": 0.985
  },
  "quantum_coherence": "stable"
}
```

### Alert Thresholds

| Metric | Target | Alert Level |
|--------|--------|-------------|
| Latency | < 5ns | Critical if > 5ns |
| Harmonic Stability | > 0.95 | Warning if < 0.90 |
| Quantum Coherence | stable | Alert if rebalancing |

---

## 🏛️ Governance Participation

### Create a Proposal

```bash
curl -X POST https://your-dashboard.com/api/governance/propose \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Increase Staking Rewards",
    "description": "Proposal to increase APY from 5.5% to 6% for long-term stakers",
    "proposal_type": "parameter_change",
    "required_stake": 100.0,
    "voting_period_days": 7
  }'
```

### Proposal Types

| Type | Description |
|------|-------------|
| `parameter_change` | Modify protocol parameters |
| `fund_allocation` | Community fund distribution |
| `protocol_upgrade` | Technical upgrades |
| `community_initiative` | General community proposals |

### View Active Proposals

```bash
curl https://your-dashboard.com/api/governance/proposals
```

---

## 📜 Smart Contract Auditing

### Request an Audit

```bash
curl -X POST https://your-dashboard.com/api/contracts/audit \
  -H "Content-Type: application/json" \
  -d '{
    "contract_code": "pragma solidity ^0.8.0; contract MyToken { ... }",
    "contract_name": "MyToken",
    "audit_depth": "comprehensive"
  }'
```

### Audit Response:
```json
{
  "contract_name": "MyToken",
  "audit_depth": "comprehensive",
  "complexity_score": 0.45,
  "vulnerabilities": [],
  "vulnerability_count": 0,
  "gas_optimization": {
    "score": 0.87,
    "suggestions": ["Consider using uint256 for gas efficiency"]
  },
  "ethical_compliance": {
    "passed": true,
    "fairness_score": 0.92,
    "transparency_score": 0.88
  },
  "overall_score": 1.0,
  "auditor": "Quantum Pi Forge AI Auditor"
}
```

### Audit Depth Levels

| Level | Description | Time |
|-------|-------------|------|
| `basic` | Quick vulnerability scan | ~1s |
| `standard` | Standard audit with gas analysis | ~3s |
| `comprehensive` | Full audit with ethical compliance | ~10s |

---

## 🎨 Visualization Features

### Quantum Resonance Dashboard

Access real-time quantum telemetry:

```bash
curl https://your-dashboard.com/api/quantum-telemetry
```

### SVG Cascade Visualization

Generate transaction visualizations:

```bash
# Get SVG visualization
curl https://flask-dashboard.com:5000/api/svg/cascade/your_tx_hash

# Get visualization data
curl https://flask-dashboard.com:5000/api/visualization/resonance/your_tx_hash
```

### Archetype Distribution

View community archetype distribution:

```bash
curl https://flask-dashboard.com:5000/api/archetype-distribution
```

---

## 📚 API Reference

### FastAPI Endpoints (Port 8000)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Health check with mainnet status |
| `/health` | GET | Detailed health information |
| `/docs` | GET | Swagger UI documentation |
| `/api/pi-network/status` | GET | Pi Network integration status |
| `/api/verify-payment` | POST | Verify Pi payment |
| `/api/quantum-telemetry` | GET | Quantum telemetry data |
| `/api/ethical-audit` | POST | Run ethical audit |
| `/api/guardian/status` | GET | Guardian monitoring status |
| `/api/guardian/latency` | GET | Current latency metrics |
| `/api/guardian/alerts` | GET | Recent alerts |
| `/api/governance/propose` | POST | Create governance proposal |
| `/api/governance/proposals` | GET | List active proposals |
| `/api/contracts/audit` | POST | Audit smart contract |

### Flask Endpoints (Port 5000)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Flask service health |
| `/resonance-dashboard` | GET | Dashboard data |
| `/api/visualization/resonance/<tx>` | GET | Resonance visualization |
| `/api/archetype-distribution` | GET | Archetype stats |
| `/api/collective-wisdom` | GET | Collective wisdom data |
| `/api/svg/cascade/<tx>` | GET | SVG visualization |

### Gradio Interface (Port 7860)

Access the Gradio interface at `http://localhost:7860` for:
- Ethical fingerprint submission
- Veto Triad synthesis
- Canticle certification
- Luminous ledger management

---

## 🔧 Troubleshooting

### Common Issues

**Issue**: Supabase connection fails
```
Solution: Verify SUPABASE_URL and SUPABASE_KEY in environment variables
```

**Issue**: Pi Network API not responding
```
Solution: Check PI_NETWORK_API_KEY configuration and network status
```

**Issue**: WebSocket disconnects
```
Solution: Ensure valid JWT token is provided in query parameter
```

**Issue**: Guardian shows "rebalancing"
```
This is normal during load spikes. The system auto-recovers within seconds.
```

### Health Check Commands

```bash
# Check all services
curl http://localhost:8000/health
curl http://localhost:5000/health
curl http://localhost:7860/

# Check Pi Network status
curl http://localhost:8000/api/pi-network/status

# Check Guardian status
curl http://localhost:8000/api/guardian/status
```

### Logs

View application logs for debugging:
```bash
# FastAPI logs
uvicorn server.main:app --log-level debug

# Flask logs
FLASK_DEBUG=1 python server/app.py
```

---

## 📞 Support

- **GitHub Issues**: [Report bugs or request features](https://github.com/onenoly1010/pi-forge-quantum-genesis/issues)
- **Documentation**: Check `/docs` folder for detailed guides
- **Community**: Join the Pi Network community discussions

---

## 🎯 Quick Reference Card

### Essential Commands

```bash
# Start all services
python -m uvicorn server.main:app --port 8000 &
python server/app.py &
python server/canticle_interface.py &

# Health checks
curl localhost:8000/health
curl localhost:5000/health

# Verify payment
curl -X POST localhost:8000/api/verify-payment -H "Content-Type: application/json" -d '{"payment_id":"test","amount":0.1}'

# Guardian status
curl localhost:8000/api/guardian/status
```

### Environment Variables

```bash
# Required
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key

# Pi Network (for mainnet)
PI_NETWORK_MODE=mainnet
PI_NETWORK_API_KEY=your-api-key
PI_NETWORK_APP_ID=your-app-id
```

---

*Built with Quantum Spirit by the Pi Forge Collective*  
*Version 3.3.0 - Mainnet Ready* 🚀
