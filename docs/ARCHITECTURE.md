# OINIO Architecture

**Version:** 1.0  
**Last Updated:** May 29, 2026

---

## System Overview

OINIO is a sovereign, non-root AI agent deployed on 0G Aristotle Mainnet. It operates through a layered stack that separates concerns and provides redundancy.

```
┌─────────────────────────────────────────────────────┐
│           OINIO Sovereign Agent Layer                │
│   (Policy execution, local orchestration, no root)   │
└─────────────────────────┬───────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────┐
│  Diagnostics / Policy / Attestation / Audit Layer   │
│  (Self-verifying, secret-safe, timestamped)         │
└─────────────────────────┬───────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────┐
│        0G Compute Access Layer (Dual Path)          │
│                                                      │
│  Path A: Router Abstraction                         │
│  ├─ /v1/models         → HTTP 200 ✓                │
│  └─ /v1/chat/completions → HTTP 402 ⚠️ (external)  │
│                                                      │
│  Path B: Direct Provider                            │
│  └─ /v1/proxy/chat/completions → HTTP 200 ✓        │
└──────────────────────────────────────────────────────┘
```

---

## Layer 1: Sovereign Agent Orchestration

**Responsibility:** Local policy execution, decision-making, state management

**Characteristics:**
- No central control point or root authority
- Autonomous execution loop
- Local-first (runs on your infrastructure)
- Wallet/provider auth managed locally
- No API keys stored in cloud

**Proof:**
- `scripts/query-0g-direct-provider.js` demonstrates end-to-end local execution
- Token loaded from filesystem; completions requested and verified locally
- No third-party orchestration layer required

---

## Layer 2: Diagnostics, Policy & Attestation

**Responsibility:** 
- Monitor system health across all 0G paths
- Enforce secret-safety (no credentials in logs)
- Generate timestamped, request_id-correlated audit trails
- Provide machine-readable and human-readable output

**Characteristics:**
- Dual-mode output: human-readable text + JSON-only
- All diagnostics routed to stderr in JSON mode (stdout = valid JSON only)
- Timestamped reports with request_ids for support correlation
- Explicit statement: "No secrets recorded"

**Scripts:**
- `health-0g-compute.cjs` — 3-path health check (router models, router billing, direct provider)
- `check-0g-router-chat.cjs` — Router inference detail (captures HTTP 402 with request_id)
- `write-0g-router-billing-report.cjs` — Timestamped markdown reports for escalation
- `generate-grant-evidence.cjs` — Attestation with git/Node/npm context (coming)

**Policy Enforced:**
- ✅ Never print API keys or bearer tokens
- ✅ Never print full authorization headers
- ✅ Capture request_id for all transactions
- ✅ Timestamp all reports

---

## Layer 3: 0G Compute Access (Dual Path)

### Path A: Router Abstraction

**Endpoint:** `https://router-api.0g.ai/v1`

**Status:**
- Model discovery: **✅ PASS** (HTTP 200)
  - 13 models available (including 0GM-1.0-35B-A3B)
  - Accessed via `GET /v1/models`
  - API key accepted; authentication works

- Billable inference: **⚠️ WARN** (HTTP 402)
  - `POST /v1/chat/completions` returns payment_error
  - Error code: `insufficient_balance`
  - Not a code defect; upstream account/billing sync issue
  - Router is reachable and responding correctly to the error condition

**Interpretation:**
The router is **working as designed** — it is correctly rejecting inference requests for an account without sufficient balance. This is not a failure of OINIO or the local code; it is expected behavior when billing constraints are triggered.

---

### Path B: Direct Provider

**Endpoint:** `https://compute-network-20.integratenetwork.work/v1/proxy/chat/completions`

**Status:** **✅ PASS** (HTTP 200)

- Model inference: Complete and verified
- Completion ID returned: Usable for tracking
- Token auth: Loaded from local file, never exposed in logs
- Integration: Fully functional end-to-end

**Interpretation:**
Direct provider is the **proven, operational path** for OINIO inference. This proves:
- 0G Compute network is reachable
- Authentication works (token-based)
- Model inference loop is functional
- Response parsing and validation work
- Local orchestration succeeds

---

## Redundancy & Failover

The dual-path architecture provides **intentional redundancy**:

| Scenario | Router Path | Direct Path | Agent Status |
|----------|-------------|-------------|--------------|
| Both paths up | Primary (if billing OK) | Backup | Fully operational |
| Router 402 (billing) | Unavailable | **Primary** | Fully operational |
| Router network down | Unavailable | **Primary** | Fully operational |
| Direct provider down | **Primary** | Unavailable | Degraded but recoverable |
| Both down | Unavailable | Unavailable | Wait for recovery |

**Current state:** Router billing blocked → Direct provider is primary → Agent is operational.

---

## Data Flow

### Direct Provider Inference

```
1. Agent generates inference request
   ├─ Model: 0GM-1.0-35B-A3B
   ├─ Messages: [system role, user role]
   └─ Max tokens: configurable

2. Load auth token from ~/.0g-compute-cli/oinio-0gm-token1.txt
   └─ Token format: "Bearer app-sk-..."

3. POST to https://compute-network-20.integratenetwork.work/v1/proxy/chat/completions
   └─ Headers: Content-Type: application/json, Authorization: Bearer <token>

4. Receive HTTP 200 response
   ├─ Parse JSON: { choices: [{ message: { content: "..." } }], ... }
   └─ Extract completion

5. Log request_id (if present) for audit trail
   ├─ Never log token
   ├─ Never log full response
   └─ Timestamp the transaction

6. Agent processes completion result
```

### Router Model Discovery

```
1. Agent requests model list
   └─ GET /v1/models

2. Send auth header
   └─ Authorization: Bearer <OG_COMPUTE_API_KEY>

3. Receive HTTP 200
   ├─ Parse: { data: [ { id: "0GM-1.0-35B-A3B", ... }, ... ] }
   └─ Count: 13 models available

4. Cache model list locally
```

### Diagnostics Flow

```
1. Run: node scripts/health-0g-compute.cjs --json
   
2. Internal subprocess calls:
   ├─ Test router /v1/models
   ├─ Test router /v1/chat/completions
   └─ Spawn child process: query-0g-direct-provider.js

3. Collect results:
   ├─ ROUTER_MODELS: PASS/FAIL + HTTP status
   ├─ ROUTER_CHAT: PASS/WARN/FAIL + HTTP status + error details + request_id
   └─ DIRECT_PROVIDER: PASS/FAIL + exit code

4. Output to stdout: { "ROUTER_MODELS": {...}, ... } (valid JSON only)
   Output to stderr: diagnostics, timestamps, any warnings
```

---

## Security Model

### Secret Safety

All scripts enforce:
- ✅ API keys never logged
- ✅ Bearer tokens never printed
- ✅ Credentials loaded from local files only
- ✅ No secrets in reports or diagnostics
- ✅ Request IDs (safe to share) are recorded for support

### Token Storage

- Direct provider token: `~/.0g-compute-cli/oinio-0gm-token1.txt`
- Router API key: `$OG_COMPUTE_API_KEY` environment variable (from `.env`)
- Both protected by filesystem permissions and not committed to git

### Audit Trail

- All transactions timestamped
- Request IDs captured from responses
- Reports written to `~/archive/0g-operational-notes/`
- Archive is **outside** the repo (not committed to git)

---

## Integration Points

### 0G Storage (Planned)

- Immutable build logs (milestone 3)
- Permanent audit trail
- Cryptographic proof of execution history
- Integration: Write report hashes to 0G Storage after generation

### 0G Attestation (Planned)

- State commitments anchored on-chain
- Self-verifying proof of execution
- Integration: Hash diagnostics and submit to Attestation contract

### Mainnet Settlement (Planned)

- On-chain escrow for M3 funding
- Automated milestone disbursement
- Integration: Milestone completion proof → on-chain execution

---

## Deployment Checklist

| Item | Status | Reference |
|------|--------|-----------|
| Direct provider integration | ✅ Complete | `scripts/query-0g-direct-provider.js` |
| Router model discovery | ✅ Complete | `scripts/check-0g-compute-router.js` |
| Router billing diagnostics | ✅ Complete | `scripts/check-0g-router-chat.cjs` |
| Health check (3-path) | ✅ Complete | `scripts/health-0g-compute.cjs` |
| Report generation | ✅ Complete | `scripts/write-0g-router-billing-report.cjs` |
| Grant evidence generator | 🔄 In Progress | `scripts/generate-grant-evidence.cjs` |
| 0G Storage integration | 📋 Designed | Awaiting M3 funding |
| CI/deploy polish | 🔄 In Progress | GitHub Actions refinement |

---

## Operational States

### Green (Fully Operational)
- Direct provider: HTTP 200 ✓
- Router models: HTTP 200 ✓
- Agent can infer via direct provider

### Yellow (Degraded but Operational)
- Direct provider: HTTP 200 ✓
- Router models: HTTP 200 ✓
- Router inference: HTTP 402 (current state)
- Agent can infer; router not available for billing inference

### Red (Blocked)
- Direct provider: Down
- Router: Down or unreachable
- Agent cannot infer
- Requires external intervention

**Current operational state: Yellow (Degraded but Operational)**

---

## Files & Scripts

### Core Scripts

| Script | Purpose | Status |
|--------|---------|--------|
| `scripts/query-0g-direct-provider.js` | Direct provider test | ✅ Active |
| `scripts/check-0g-compute-router.js` | Router model discovery | ✅ Active |
| `scripts/check-0g-router-chat.cjs` | Router billing test | ✅ Active |
| `scripts/health-0g-compute.cjs` | 3-path health check | ✅ Active |
| `scripts/write-0g-router-billing-report.cjs` | Report generator | ✅ Active |
| `scripts/generate-grant-evidence.cjs` | Evidence attestation | 🔄 Coming |

### Documentation

| File | Purpose |
|------|---------|
| `docs/TECHNICAL_SUMMARY.md` | Single-page proof for reviewers |
| `docs/ARCHITECTURE.md` | System design (this file) |
| `docs/DEPLOYMENT_CHECKLIST.md` | Verification steps |

---

## Next Steps

1. **Grant Review:** Awaiting 0G Guild/Ecosystem response
2. **Router Billing Sync:** Awaiting 0G Compute team account verification
3. **Evidence Generator:** Deploy `generate-grant-evidence.cjs` with git/Node/npm context
4. **CI Polish:** Refine GitHub Actions and Cloudflare Pages workflows
5. **Storage Integration:** Implement M3 (pending funding)

---

**For questions:** See `docs/TECHNICAL_SUMMARY.md` for reproduction steps and support escalation procedures.
