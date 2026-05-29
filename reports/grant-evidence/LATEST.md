# OINIO Grant Evidence Report

**Generated:** 2026-05-29T21:38:49.893Z  
**Project:** OINIO / Quantum Pi Forge  
**Git branch:** main  
**Git commit:** 40715d073ce28cf077d5a61538c77dc21380af2d  
**Node:** v18.19.1  
**npm:** 9.2.0  

## Purpose

This report captures repository state, environment metadata, diagnostic documents, and available 0G Compute health-check output for grant review. It is intended to provide a reproducible evidence artifact that can be hashed, archived, and attached to OINIO technical updates.

## Current Technical Standing

- 0G Compute direct-provider path has been documented as the known-good execution lane.
- 0G router path has been documented as returning HTTP 402 at `/v1/proxy`.
- The router failure is treated as an upstream billing/account-state limitation, not as proof of local execution failure.
- Evidence documents are preserved in-repo for review and reproduction.

## Repository Metadata

```json
{
  "project": "OINIO / Quantum Pi Forge",
  "generated_at": "2026-05-29T21:38:49.893Z",
  "cwd": "/home/kris/forge/Quantum-pi-forge",
  "git_branch": "main",
  "git_commit": "40715d073ce28cf077d5a61538c77dc21380af2d",
  "git_commit_short": "40715d0",
  "git_status_short": "",
  "node_version": "v18.19.1",
  "npm_version": "9.2.0"
}
```

## Captured Checks

### Git status

**Command:** `git status --short`  
**Exit code:** `0`  
**Signal:** `none`  
**Started:** `2026-05-29T21:38:52.367Z`


**stdout**

```text
(empty)
```

**stderr**

```text
(empty)
```

### Latest commit

**Command:** `git log -1 --oneline`  
**Exit code:** `0`  
**Signal:** `none`  
**Started:** `2026-05-29T21:38:52.552Z`


**stdout**

```text
40715d0 Refresh grant evidence report
```

**stderr**

```text
(empty)
```

### Node version

**Command:** `node --version`  
**Exit code:** `0`  
**Signal:** `none`  
**Started:** `2026-05-29T21:38:52.570Z`


**stdout**

```text
v18.19.1
```

**stderr**

```text
(empty)
```

### npm version

**Command:** `npm --version`  
**Exit code:** `0`  
**Signal:** `none`  
**Started:** `2026-05-29T21:38:52.682Z`


**stdout**

```text
9.2.0
```

**stderr**

```text
(empty)
```

### 0G compute path diagnosis document

**Command:** `sed -n 1,220p OINIO_0G_COMPUTE_PATH_DIAGNOSIS_20260529.md`  
**Exit code:** `0`  
**Signal:** `none`  
**Started:** `2026-05-29T21:38:55.479Z`


**stdout**

```text
# 0G Compute Path Diagnosis

0G Compute exposes two documented inference paths:

- **Router:** OpenAI-compatible API endpoint with unified balance, API key access, and provider failover.
- **Direct:** Provider-specific execution using per-provider sub-accounts and wallet-signed request headers.

Our diagnostics show:

- **Discovery:** Router/provider discovery succeeds, proving CLI login, network access, and provider visibility are functional.
- **Router Path (`/v1/proxy`):** The request path returns HTTP 402, indicating a billing/account-state failure at the proxy or router abstraction layer.
- **Direct Path:** Direct provider execution returns HTTP 200 with a valid completion ID, proving the wallet-authenticated provider lane is functional.

## Conclusion

The 402 is not evidence of broken local execution or invalid provider access. It is isolated to the proxy/router billing path.

The direct provider lane is the correct sovereign execution path for OINIO because it uses documented provider metadata, provider-specific funding, and signed request headers instead of relying on the centralized router abstraction.

## Strategic Interpretation

This is not a workaround around 0G Compute. It is an intentional use of the direct provider execution model exposed by the protocol.

OINIO bypasses the Router abstraction while remaining strictly inside the intended 0G Compute payment and provider-auth model.
```

**stderr**

```text
(empty)
```

### Technical summary

**Command:** `sed -n 1,240p docs/TECHNICAL_SUMMARY.md`  
**Exit code:** `0`  
**Signal:** `none`  
**Started:** `2026-05-29T21:38:55.488Z`


**stdout**

```text
# OINIO Resonance Worker: Technical Summary

**Last Updated:** May 29, 2026  
**Status:** Core proof validated; upstream blocker documented  
**Grant Stage:** M1/M2 complete; review pending

---

## Executive Summary

OINIO is a sovereign, non-root, self-verifying AI agent operating on 0G Aristotle Mainnet. This document proves that core 0G Compute integration works and identifies where the external blocker exists.

**Bottom line:** Direct provider inference is proven working (HTTP 200). Router inference is blocked by external billing sync (HTTP 402), not by local code failure.

---

## What Is Proven

### Direct Provider Path: ✅ PASS

- **Endpoint:** `https://compute-network-20.integratenetwork.work/v1/proxy/chat/completions`
- **Status:** HTTP 200 (confirmed operational)
- **Evidence:** Reproducible via `node scripts/query-0g-direct-provider.js`
- **Proof:** Completion ID returned; inference loop operational
- **Security:** Token loaded from local file, never logged

### Router Model Discovery: ✅ PASS

- **Endpoint:** `https://router-api.0g.ai/v1/models`
- **Status:** HTTP 200
- **Models Available:** 13 (including 0GM-1.0-35B-A3B)
- **Evidence:** `node scripts/check-0g-compute-router.js`
- **Proof:** Router is reachable and responsive

### Diagnostics Infrastructure: ✅ PASS

- All diagnostic scripts execute without credential leakage
- Reports are timestamped and include request_ids for support correlation
- Health check runs in dual-mode: human-readable and JSON-only
- No API keys or bearer tokens appear in any output

---

## What Is Blocked (Upstream)

### Router Billable Inference: ⚠️ WARN

- **Endpoint:** `https://router-api.0g.ai/v1/chat/completions`
- **Status:** HTTP 402 (Payment Required)
- **Error Type:** `payment_error`
- **Error Code:** `insufficient_balance`
- **Error Message:** "Insufficient balance"
- **Latest Request ID:** `949fa68f-3b56-4e1b-a9b6-6617cf7f905a`
- **Root Cause:** Not a local code failure. The router is reachable but returns a billing/account-state error.
- **Evidence:** `node scripts/check-0g-router-chat.cjs`

**Interpretation:**
The 0G router API key is accepted for model discovery but rejected for billable inference. This suggests the account or API key is not linked to a billing balance, or the balance is insufficient. This is **not** a code defect — it is an upstream router/account configuration issue.

---

## 0G Storage & Compute Integration Status

| Component | Status | Evidence |
|-----------|--------|----------|
| 0G Storage (immutable logs) | Designed, not yet active | Project architecture supports it; awaiting milestone 3 |
| 0G Compute direct provider | **✅ Live** | HTTP 200, completion ID verified |
| 0G Router model discovery | **✅ Live** | 13 models listed via HTTP 200 |
| 0G Router billable inference | **⚠️ Blocked** | HTTP 402, external account sync issue |
| Policy/attestation layer | **✅ Designed** | Diagnostic scripts enforce secret-safe output |

---

## How to Reproduce This Evidence

### Test 1: Direct Provider (Should Pass)

```bash
node scripts/query-0g-direct-provider.js
```

Expected output: HTTP 200, completion with inference result.

### Test 2: Router Models (Should Pass)

```bash
node scripts/check-0g-compute-router.js
```

Expected output: HTTP 200, list of available models.

### Test 3: Router Billing Inference (Will Warn)

```bash
node scripts/check-0g-router-chat.cjs
```

Expected output: HTTP 402, `payment_error / insufficient_balance`, request_id.

### Test 4: Full Health Check (Text)

```bash
node scripts/health-0g-compute.cjs
```

Output:
```
ROUTER_MODELS=PASS
ROUTER_CHAT=WARN
DIRECT_PROVIDER=PASS
```

### Test 5: Full Health Check (JSON)

```bash
node scripts/health-0g-compute.cjs --json | python3 -m json.tool
```

Returns valid JSON only to stdout; diagnostics to stderr.

### Test 6: Generate Timestamped Report

```bash
node scripts/write-0g-router-billing-report.cjs
```

Writes markdown report to `~/archive/0g-operational-notes/0G_ROUTER_BILLING_YYYY-MM-DDTHH-mm-ss.md`

---

## Architectural Layers

```
OINIO Sovereign Agent
        ↓
Policy / Attestation / Audit
        ↓
0G Compute Access (Two Paths)
   ├── Router Abstraction
   │   ├── /v1/models → HTTP 200 ✓
   │   └── /v1/chat/completions → HTTP 402 ⚠️ (external blocker)
   │
   └── Direct Provider
       └── /v1/proxy/chat/completions → HTTP 200 ✓
```

**Key Point:** Router failure is isolated and does not invalidate direct provider proof.

---

## Milestone Status

| Milestone | Status | Proof |
|-----------|--------|-------|
| M1: Direct provider integration | **✅ Complete** | `query-0g-direct-provider.js` returns HTTP 200 |
| M2: Router model discovery | **✅ Complete** | `check-0g-compute-router.js` lists 13 models |
| M2: Diagnostic infrastructure | **✅ Complete** | 4 diagnostic scripts, secret-safe, timestamped reports |
| M3: Storage integration | In progress | Architecture ready; awaiting funding approval |
| M3: CI/deploy polish | In progress | Workflows exist; refinement pending |

---

## Known Limitations

1. **Router Billing Sync (External)**
   - The HTTP 402 is not a code defect.
   - Resolution requires 0G team to verify account/billing linkage.
   - Workaround: Direct provider path remains fully operational.

2. **CI/Deployment Noise**
   - GitHub Actions and Cloudflare Pages have had intermittent failures (May 27–28).
   - Core agent logic is unaffected; infrastructure polish is pending.
   - Does not block grant approval or technical validation.

3. **Storage Integration**
   - Not yet active pending M3 funding.
   - Architecture is designed; implementation is ready.

---

## How to Get Support / Unblock Router

If you are a 0G team member reviewing this:

1. **Latest diagnostic data:** Request ID `949fa68f-3b56-4e1b-a9b6-6617cf7f905a`
2. **Reproducible test:** `node scripts/check-0g-router-chat.cjs`
3. **Question:** Is the OINIO API key linked to a billing account and balance on 0G router?
4. **Next steps:** Confirm account state or provide remediation instructions.

---

## Next Steps (In Priority Order)

1. **Grant Review Response** — Awaiting 0G Guild/Ecosystem team confirmation on M1/M2 and funding decision.
2. **Router Billing Sync** — Awaiting 0G Compute team verification of account linkage.
3. **CI/Deploy Polish** — GitHub Actions and Pages refinement (does not block core features).
4. **Storage Integration** — Pending M3 funding approval.
5. **Evidence Generator** — Automated report with git/Node/npm context (see `scripts/generate-grant-evidence.cjs`).

---

## Files Referenced

- `scripts/query-0g-direct-provider.js` — Direct provider integration test
- `scripts/check-0g-compute-router.js` — Router model discovery test
- `scripts/check-0g-router-chat.cjs` — Router billing inference test (HTTP 402)
- `scripts/health-0g-compute.cjs` — Comprehensive 3-path health check
- `scripts/write-0g-router-billing-report.cjs` — Timestamped report generator
- `scripts/generate-grant-evidence.cjs` — Grant evidence attestation (coming)
- `docs/ARCHITECTURE.md` — System design and layer explanation

---

## Security & Secrets Policy

- ✅ No API keys appear in any script output
- ✅ No bearer tokens logged or printed
- ✅ Reports explicitly state "No secrets recorded"
- ✅ Credentials loaded from local files or `.env`, never exposed
- ✅ Request IDs included for support escalation (these are safe to share)

---

**For questions or verification:** Run the reproduction steps above and share the output + request_id with the 0G team.
```

**stderr**

```text
(empty)
```

### Architecture document

**Command:** `sed -n 1,260p docs/ARCHITECTURE.md`  
**Exit code:** `0`  
**Signal:** `none`  
**Started:** `2026-05-29T21:38:55.500Z`


**stdout**

```text
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
```

**stderr**

```text
(empty)
```

### Direct provider script presence

**Command:** `ls -la scripts/query-0g-direct-provider.js`  
**Exit code:** `0`  
**Signal:** `none`  
**Started:** `2026-05-29T21:38:55.513Z`


**stdout**

```text
-rwxrwxr-x 1 kris kris 1721 May 29 07:44 scripts/query-0g-direct-provider.js
```

**stderr**

```text
(empty)
```

### 0G compute health check

**Command:** `node health-0g-compute.cjs`  
**Exit code:** `null`  
**Signal:** `none`  
**Started:** `2026-05-29T21:38:49.893Z`

**Error:** `missing_script`

**stdout**

```text
(empty)
```

**stderr**

```text
health-0g-compute.cjs not found
```

## Report Integrity

**SHA-256:** `a88d546194891138cf3f35ed05f1cdd715aba891d4d47a4b2ee769387a611c08`

This hash was calculated from the report body before this integrity section was appended.
