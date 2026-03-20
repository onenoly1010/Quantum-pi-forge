# 🏗️ Pi Forge Quantum Genesis - System Architecture

## Foundation

This architecture is built upon the principles established in **[GENESIS.md](../GENESIS.md)** — the Eternal Archive containing the OINIO Seal Declaration minted on Winter Solstice 2025.

For ecosystem-level overview, see **[ECOSYSTEM_OVERVIEW.md](../ECOSYSTEM_OVERVIEW.md)**.

---

## Overview

Pi Forge Quantum Genesis is a production-ready autonomous AI platform built on Pi Network. The system combines autonomous decision-making, human guardian oversight, self-healing infrastructure, and ethical AI governance to create a truly self-sustaining ecosystem.

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                    👥 HUMAN LAYER (Guardian Team)                    │
│  Lead Guardian: @onenoly1010  |  AI Assistant: @app/copilot         │
│                                                                       │
│  • Critical Decision Approval    • Emergency Protocols               │
│  • Ethical Oversight            • Policy Updates                     │
│  • Incident Response            • System Audits                      │
└───────────────────────────┬─────────────────────────────────────────┘
                            │ Escalations & Approvals
                            ▼
┌─────────────────────────────────────────────────────────────────────┐
│              🤖 AUTONOMOUS AI LAYER (Decision Matrix)                │
│                                                                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │
│  │ Deployment   │  │  Scaling     │  │  Rollback    │             │
│  │ Decisions    │  │  Decisions   │  │  Decisions   │             │
│  └──────────────┘  └──────────────┘  └──────────────┘             │
│                                                                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │
│  │ Self-Healing │  │  Monitoring  │  │  Guardian    │             │
│  │ Actions      │  │  Alerts      │  │  Override    │             │
│  └──────────────┘  └──────────────┘  └──────────────┘             │
│                                                                       │
│  Confidence-Based Approval: 0.0 → 1.0                               │
│  Auto-Approve: >= 0.8  |  Guardian Required: < 0.8                  │
└───────────────────────────┬─────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────────┐
│               🔧 APPLICATION LAYER (Quantum Triad)                   │
│                                                                       │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐    │
│  │   FastAPI       │  │    Flask        │  │    Gradio       │    │
│  │ Quantum Conduit │  │  Glyph Weaver   │  │  Truth Mirror   │    │
│  │                 │  │                 │  │                 │    │
│  │ • REST APIs     │  │ • Dashboards    │  │ • Ethical AI    │    │
│  │ • WebSocket     │  │ • Visualizations│  │ • Audit Tools   │    │
│  │ • Pi Auth       │  │ • SVG Render    │  │ • Evaluation    │    │
│  │ • Payments      │  │ • Templates     │  │ • Interface     │    │
│  │                 │  │                 │  │                 │    │
│  │ Port: 8000      │  │ Port: 5000      │  │ Port: 7860      │    │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘    │
└───────────────────────────┬─────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        ▼                   ▼                   ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  Monitoring  │    │ Self-Healing │    │   Guardian   │
│   Agents     │    │    System    │    │   Monitor    │
│              │    │              │    │              │
│ • Performance│    │ • Diagnostics│    │ • Safety     │
│ • Security   │    │ • Recovery   │    │ • Override   │
│ • Health     │    │ • Metrics    │    │ • Escalation │
│ • Decision   │    │ • Incidents  │    │ • Audit      │
└──────────────┘    └──────────────┘    └──────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────────┐
│                  💾 DATA & BLOCKCHAIN LAYER                          │
│                                                                       │
│  ┌─────────────────┐           ┌─────────────────┐                 │
│  │   Supabase      │           │  Pi Network     │                 │
│  │   Database      │           │   Blockchain    │                 │
│  │                 │           │                 │                 │
│  │ • User Data     │◄─────────►│ • Smart Contract│                 │
│  │ • Payments      │           │ • OINIO Token   │                 │
│  │ • Sessions      │           │ • Model Registry│                 │
│  │ • Audits        │           │ • Transactions  │                 │
│  └─────────────────┘           └─────────────────┘                 │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Core Components

### 1. Guardian System (Human Oversight)

**Purpose**: Provide human oversight and approval for critical decisions.

**Components**:
- **Lead Guardian**: @onenoly1010 - Primary decision maker
- **AI Assistant**: @app/copilot-swe-agent - 24/7 triage and support
- **Decision Templates**: Structured workflows for consistent decision-making
- **Emergency Protocols**: Rapid response procedures for critical incidents

**Key Features**:
- Real-time dashboard at `/api/guardian/dashboard`
- Escalation system for high-risk decisions
- Audit trail for all guardian actions
- One-command emergency stop and rollback

**Reference**: [Issue #100](https://github.com/onenoly1010/pi-forge-quantum-genesis/issues/100), [Issue #102](https://github.com/onenoly1010/pi-forge-quantum-genesis/issues/102)

---

### 2. Autonomous Decision Matrix

**Purpose**: Enable AI-driven decision-making with confidence-based approval.

**Decision Types**:
1. **Deployment** - Code deployment and release decisions
2. **Scaling** - Resource scaling and optimization
3. **Rollback** - Automated rollback on failures
4. **Healing** - Self-healing system actions
5. **Monitoring** - Alert management and response
6. **Guardian Override** - Emergency override capabilities

**Decision Process**:
```
1. Request → 2. Analyze Parameters → 3. Calculate Confidence
                                           ↓
                      ┌────────────────────┴────────────────────┐
                      ▼                                         ▼
              Confidence >= 0.8                         Confidence < 0.8
                      │                                         │
                      ▼                                         ▼
              Auto-Approve                              Guardian Escalation
                      │                                         │
                      └─────────────────┬───────────────────────┘
                                        ▼
                                   Execute Action
                                        ▼
                                   Log & Audit
```

**Configuration**:
```python
{
    "deployment": {
        "approval_threshold": 0.8,
        "requires_guardian": "< 0.8 confidence",
        "max_auto_approvals_per_hour": 10
    },
    "scaling": {
        "approval_threshold": 0.85,
        "auto_approve_scale_down": True
    },
    "rollback": {
        "approval_threshold": 0.7,
        "emergency_auto_approve": True
    }
}
```

**Implementation**: `server/autonomous_decision.py`

---

### 3. Self-Healing System

**Purpose**: Automatically detect and resolve system issues without human intervention.

**Capabilities**:
- **Diagnostics**: CPU, memory, disk, process health monitoring
- **Recovery Actions**:
  - Service restart
  - Resource cleanup
  - Cache clearing
  - Connection pool reset
- **Incident Reporting**: Automatic incident logging and notification
- **Metrics Tracking**: Real-time healing metrics and success rates

**Healing Process**:
```
1. Detect Issue → 2. Run Diagnostics → 3. Determine Root Cause
                                              ↓
                          ┌───────────────────┴───────────────────┐
                          ▼                                       ▼
                   Known Issue Pattern                     Unknown Issue
                          │                                       │
                          ▼                                       ▼
                   Auto-Healing Action                    Guardian Alert
                          │                                       │
                          └───────────────┬───────────────────────┘
                                          ▼
                                  Log Incident & Outcome
                                          ▼
                                  Update Metrics & Learn
```

**Monitoring**:
- CPU usage > 90% → Identify and optimize processes
- Memory usage > 90% → Garbage collection and cleanup
- Disk usage > 90% → Log rotation and temp file cleanup
- Process crashes → Automatic restart with backoff

**Implementation**: `server/self_healing.py`

---

### 4. Monitoring Agents

**Purpose**: Continuous system monitoring with specialized agents.

**Agent Types**:

1. **Performance Agent**
   - Response time tracking
   - Throughput monitoring
   - Resource utilization
   - Performance regression detection

2. **Security Agent**
   - Authentication monitoring
   - Access pattern analysis
   - Threat detection
   - Security score calculation

3. **Health Agent**
   - Service availability
   - Database connectivity
   - API endpoint health
   - Dependency status

4. **Decision Agent**
   - Decision pattern analysis
   - Confidence trend tracking
   - Guardian escalation rates
   - Decision quality metrics

**Operation**:
- All agents run asynchronously
- 5-minute monitoring intervals
- Automatic alert generation
- Guardian notification on critical issues

**Implementation**: `server/monitoring_agents.py`

---

### 5. Guardian Monitor

**Purpose**: Safety validation and guardian override capabilities.

**Features**:
- **Multi-Level Safety Validation**: Transaction, ethical, security
- **Decision Override**: Guardian can override autonomous decisions
- **Configurable Monitoring**: Adjust sensitivity and thresholds
- **Safety Metrics**: Auto-adjusting safety scores

**Safety Checks**:
```python
{
    "transaction_safety": {
        "max_single_transaction": 1000.0,
        "daily_transaction_limit": 10000.0,
        "requires_approval": "> $1000"
    },
    "ethical_compliance": {
        "bias_threshold": 0.15,
        "fairness_score_minimum": 0.8,
        "transparency_required": True
    },
    "security_score": {
        "minimum_required": 0.7,
        "auto_block_below": 0.5
    }
}
```

**Implementation**: `server/guardian_monitor.py`

---

## Application Layer: The Quantum Triad

### FastAPI - Quantum Conduit (Port 8000)

**Role**: Primary production API and real-time communication.

**Responsibilities**:
- User authentication via Supabase
- Pi Network payment processing
- WebSocket connections for real-time updates
- RESTful API endpoints
- Autonomous decision API
- Guardian dashboard API

**Key Endpoints**:
```
POST   /api/login
POST   /api/register
POST   /api/payments/approve
POST   /api/payments/complete
GET    /api/guardian/dashboard
POST   /api/autonomous/decision
GET    /api/autonomous/metrics
WS     /ws/collective-insight
```

**Tech Stack**: FastAPI, Uvicorn, Supabase, Pi Network SDK

---

### Flask - Glyph Weaver (Port 5000)

**Role**: Visualization and dashboard rendering.

**Responsibilities**:
- Quantum resonance visualization
- SVG procedural generation
- Dashboard templates
- 4-phase cascade animations
- Legacy template serving

**Features**:
- Real-time resonance visualization
- HSL color cycling (Red → Green → Blue → Purple)
- SVG-based fractal animations
- Template-based dashboards

**Tech Stack**: Flask, Jinja2, SVG rendering

---

### Gradio - Truth Mirror (Port 7860)

**Role**: Ethical AI audit and evaluation interface.

**Responsibilities**:
- Standalone ethical audits
- AI model evaluation
- Interactive testing interfaces
- Ethical compliance verification

**Features**:
- Web-based UI for audits
- Model evaluation tools
- Bias detection interfaces
- Transparency scoring

**Tech Stack**: Gradio, Hugging Face

---

## Data & Blockchain Layer

### Supabase Database

**Tables**:
- `users` - User accounts (Supabase Auth)
- `payments` - Payment transactions
- `sessions` - User sessions
- `audits` - Audit logs
- `decisions` - Autonomous decisions log

**Features**:
- Row-level security (RLS)
- Real-time subscriptions
- PostgreSQL backend
- Automatic backups

---

### Pi Network Blockchain

**Smart Contracts**:

1. **OINIOToken (ERC-20)**
   - Token name: OINIO Token
   - Symbol: OINIO
   - Initial supply: 1,000,000,000 OINIO
   - Features: Burnable, fixed supply

2. **OINIOModelRegistry (ERC-721)**
   - NFT-based AI model registry
   - On-chain metadata storage
   - Token staking requirements
   - Creator royalty system (10-30%)

**Network Details**:
- Testnet Chain ID: 2025
- Mainnet Chain ID: 314159
- RPC URL: `https://api.testnet.minepi.com/rpc`

**Deployment**: See [contracts/README.md](../contracts/README.md)

---

## OINIO Economy

### Catalyst Pool Economics

**Initial Allocation**: 12,000,000 PI

**Distribution**:
- 40% → Catalyst pool for model incentives
- 30% → System maintenance and operations
- 20% → Developer rewards and community
- 10% → OINIO DAO treasury

**Taper Schedule**:
- Multiplier starts at 8×
- Reduces to 1× over deployment cycles
- Rewards early adopters
- Ensures long-term sustainability

**Governance**:
- OINIO DAO multi-sig control
- On-chain voting for major decisions
- Transparent treasury management

---

## Security Architecture

### Authentication Flow

```
1. User Login Request
        ↓
2. Supabase Auth Validation
        ↓
3. JWT Token Generation
        ↓
4. Token Validation Middleware
        ↓
5. Authorized Request Processing
```

### Payment Security

```
1. Pi Network Payment Initiation
        ↓
2. Backend Payment Approval
        ↓
3. Transaction Verification
        ↓
4. Blockchain Confirmation
        ↓
5. Database Record + Resonance Trigger
```

### Smart Contract Security

- OpenZeppelin v5.0.0 audited contracts
- ReentrancyGuard on all external calls
- SafeERC20 for token transfers
- Checks-Effects-Interactions pattern
- Comprehensive test coverage (100%)

---

## Deployment Architecture

### Railway Production

**Services**:
- FastAPI (Port 8000)
- Environment variables via Railway dashboard
- Automatic HTTPS
- Health check monitoring

**Configuration**: `railway.toml`

### Vercel Edge Functions

**Serverless Functions**:
- Autonomous metrics API (`api/autonomous-metrics.ts`)
- Pi Network callbacks
- Static asset hosting

**Configuration**: `vercel.json`

---

## Monitoring & Observability

### Health Checks

**Automated**: Every 6 hours via GitHub Actions
- Backend health verification
- Database connectivity
- Pi Network integration status
- Smart contract verification

**Report**: [Issue #76](https://github.com/onenoly1010/pi-forge-quantum-genesis/issues/76)

### Metrics Collection

**Sources**:
- Autonomous decision logs
- Self-healing incidents
- Guardian actions
- Performance metrics
- Security events

**Storage**:
- GitHub Issues (audit trail)
- Vercel Metrics API
- Supabase analytics

---

## Integration Patterns

### Pi Network Integration

**Modular Design**:
```
server/pi_network/
├── __init__.py          # Package initialization
├── auth.py              # Authentication module
├── payments.py          # Payment processing
├── client.py            # Pi Network client
├── config.py            # Configuration
├── exceptions.py        # Custom exceptions
└── ethical_guardian.py  # Ethical validation
```

**Safety Features**:
- Testnet mode enforcement
- NFT_MINT_VALUE validation
- Transaction limits
- Webhook signature verification

---

## Autonomous Operations Workflow

### Daily Operations

```
┌─────────────────────────────────────────────┐
│  1. Monitoring Agents (Every 5 minutes)     │
│     • Collect metrics                       │
│     • Detect anomalies                      │
│     • Generate alerts                       │
└────────────────┬────────────────────────────┘
                 ▼
┌─────────────────────────────────────────────┐
│  2. Self-Healing (On Issue Detection)       │
│     • Run diagnostics                       │
│     • Execute healing actions               │
│     • Verify resolution                     │
└────────────────┬────────────────────────────┘
                 ▼
┌─────────────────────────────────────────────┐
│  3. Decision Matrix (On Request)            │
│     • Analyze parameters                    │
│     • Calculate confidence                  │
│     • Auto-approve or escalate              │
└────────────────┬────────────────────────────┘
                 ▼
┌─────────────────────────────────────────────┐
│  4. Guardian Review (If Required)           │
│     • Review escalated decisions            │
│     • Approve or reject                     │
│     • Provide feedback                      │
└────────────────┬────────────────────────────┘
                 ▼
┌─────────────────────────────────────────────┐
│  5. Execution & Audit (All Actions)         │
│     • Execute approved actions              │
│     • Log to GitHub + Vercel                │
│     • Update metrics                        │
└─────────────────────────────────────────────┘
```

---

## Scalability & Performance

### Current Capacity

- **Request Rate**: 1000 req/sec (FastAPI)
- **WebSocket Connections**: 500 concurrent
- **Database Queries**: 5000 qps (Supabase)
- **Smart Contract Gas**: Optimized < 100k gas per tx

### Scaling Strategy

**Horizontal Scaling**:
- Multiple FastAPI instances
- Load balancer (Railway/Railway)
- Database read replicas

**Vertical Scaling**:
- Increased instance size
- Enhanced database tier
- Caching layer (Redis)

---

## Future Enhancements

### Roadmap

1. **Enhanced AI Agents**
   - GPT-4 integration for decision reasoning
   - Multi-agent collaboration
   - Learning from historical decisions

2. **Advanced Guardian Tools**
   - Real-time dashboard improvements
   - Predictive alerting
   - Automated reporting

3. **OINIO Ecosystem Growth**
   - Additional smart contracts
   - DeFi integrations
   - Cross-chain bridges

4. **Developer Experience**
   - SDK for third-party integrations
   - Plugin system
   - Enhanced documentation

---

## Conclusion

Pi Forge Quantum Genesis represents a sophisticated, production-ready autonomous AI platform built on Pi Network. The architecture balances autonomous operation with human oversight, ensuring both efficiency and safety. With self-healing capabilities, comprehensive monitoring, and ethical AI governance, the system is designed for long-term sustainability and growth.

---

## References

- [Main README](../README.md)
- [Quick Start Guide](./QUICK_START.md)
- [Guardian Playbook](./GUARDIAN_PLAYBOOK.md)
- [Smart Contracts](../contracts/README.md)
- [Autonomous Handover Documentation](./AUTONOMOUS_HANDOVER.md)
- [Pi Network Integration](./PI_NETWORK_INTEGRATION.md)

---

**Last Updated**: December 2025  
**Version**: 2.0  
**Status**: Production Ready
