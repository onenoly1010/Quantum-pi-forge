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
