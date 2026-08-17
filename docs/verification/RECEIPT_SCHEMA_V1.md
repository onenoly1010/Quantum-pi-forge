# QPF Verification Result — Schema Reference v1

**Spec identifier:** `quantum-pi-forge-verify-result/v1`

This document describes the **verification result** object returned by the QPF Level 0 verification pipeline.

**Terminology note:** This document uses two distinct objects:

- **Originating receipt** (`quantum-pi-forge-receipt/v1`): the receipt produced *at artifact creation time* that records the artifact's identity (path, digest, provenance metadata). This is the input to verification.
- **Verification result** (`quantum-pi-forge-verify-result/v1`): the structured JSON object described in this document, produced *by the verifier* to report whether the artifact's current bytes match what the originating receipt claims.

A verification result is evidence about an artifact. It does **not** establish or change canonical identity.

Counterparties use the verification result to confirm that an execution artifact has not been silently altered. Releasing funds or approving state transitions based solely on this result is **not** authorized.

---

## How to use this receipt

1. **Submit your artifact + its originating receipt** to the QPF verification pipeline (CLI or HTTP endpoint).
2. **Receive the verification result** — the structured JSON object described below.
3. **Check `status`** — only act on `"pass"` or `"partial"`.
4. **Record the `target.hash`** — this is the canonical SHA-256 of your artifact at the moment of verification.
5. **Store the full receipt** as your tamper-evident audit trail.

> **Important:** A `status: "pass"` receipt attests that the artifact's content matches the digest claimed in the originating receipt. It does **not** authorize any governance decision, fund release, deployment, or financial transaction. See the `does_not_authorize` field.

---

## CLI

```bash
# Install (once):
npm install -g .   # from repo root, after: npm install

# Run:
qpf-verify --artifact path/to/artifact.json --receipt path/to/receipt.json

# With file output:
qpf-verify --artifact path/to/artifact.json --receipt path/to/receipt.json \
           --output verification-result.json

# Exit codes:
#   0  pass or partial
#   1  fail (deterministic violation detected)
#   2  usage error
#   3  unavailable (missing input or unsupported level)
```

---

## HTTP Endpoint

```
POST /api/verify
Content-Type: application/json
```

**Request body:**

```json
{
  "artifact_base64": "<base64-encoded artifact bytes>",
  "artifact_name":   "milestone.json",
  "receipt":         { "<originating receipt object>" }
}
```

**Response HTTP status:**

| Status | Meaning |
|--------|---------|
| `200`  | `pass` or `partial` |
| `409`  | `fail` — deterministic violation detected |
| `422`  | malformed request body |
| `503`  | `unavailable` — missing input or unsupported level |

---

## Verification Result Schema

```jsonc
{
  // Always "quantum-pi-forge-verify-result/v1"
  "spec": "quantum-pi-forge-verify-result/v1",

  // Opaque request identifier (HTTP endpoint only)
  "request_id": "018f3a2b4c5d-a1b2c3d4",

  // Aggregate status of all mandatory checks
  // "pass"        All mandatory checks succeeded
  // "partial"     Level 0 passed; requested higher level unavailable
  // "fail"        At least one mandatory check positively violated
  // "unavailable" Essential input missing or capability not configured
  "status": "pass",

  // Human-readable summary of the aggregate result
  "summary": "All mandatory Level 0 checks succeeded",

  // Canonical information about the verified artifact
  "target": {
    "hash": "<sha256-hex>",   // SHA-256 of the artifact at verification time
    "type": "artifact",
    "path": "milestone.json"  // as supplied in the request
  },

  // Level requested in the call (0 = Level 0 only, currently the max)
  "level_requested": 0,
  // Highest level fully achieved
  "level_achieved": 0,

  // Per-check results (array, ordered)
  "checks": [
    {
      "name":   "request_spec",           // check identifier
      "status": "pass",                   // pass | fail | unavailable | not_applicable
      "detail": "quantum-pi-forge-verify/v1",
      "code":   "OK"                      // REASON code (see Reason Codes below)
    }
    // ... additional checks (see Check Names below)
  ],

  // ISO 8601 timestamp of this verification run (from verifier clock)
  "timestamp": "2026-08-16T00:12:53.917Z",

  // Identity of the verification engine
  "verifier": {
    "identity": "qpf-verify-level0",
    "version":  "0.1.0"
  },

  // Explicit list of things this receipt does NOT authorize
  // Counterparties must not treat a "pass" as authorization for any of these
  "does_not_authorize": [
    "governance_decision",
    "mainnet_operator_approval",
    "deployment",
    "financial_transaction",
    "production_safety"
  ],

  // HMAC-SHA256 over "status|target.hash|timestamp" — present only when
  // QPF_VERIFY_HMAC_KEY is set on the worker (HTTP endpoint only)
  "result_hmac_sha256": "<optional hex>"
}
```

---

## Check Names

These are the mandatory checks run for every Level 0 verification:

| Check name | What it verifies |
|---|---|
| `request_spec` | The request uses a supported spec identifier |
| `level_capability` | The requested level is supported |
| `artifact_located` | The artifact file exists and is readable |
| `receipt_located` | The originating receipt file exists and is readable |
| `receipt_structure` | The receipt has required structural fields |
| `artifact_hash` | SHA-256 of artifact matches the digest claimed in the receipt |
| `receipt_artifact_binding` | The receipt's path/digest claim binds to the supplied artifact |
| `signature` | Cryptographic signature check (N/A if receipt makes no signature claim) |

---

## Reason Codes

| Code | Meaning |
|---|---|
| `OK` | Check passed or not applicable |
| `ARTIFACT_MISSING` | Artifact file not found or unreadable |
| `RECEIPT_MISSING` | Receipt file not found or unreadable |
| `RECEIPT_MALFORMED` | Receipt is not valid JSON or has wrong root type |
| `STRUCTURE_INVALID` | Receipt is missing required structural fields |
| `ARTIFACT_HASH_MISMATCH` | Computed digest does not match the receipt's claimed digest |
| `BINDING_MISMATCH` | Receipt path or digest claim does not bind to the supplied artifact |
| `SIGNATURE_UNAVAILABLE` | Receipt claims a signature but no verify primitive is configured |
| `SIGNATURE_INVALID` | Signature verification failed |
| `LEVEL_UNSUPPORTED` | Requested verification level is not implemented |

---

## Originating Receipt Schema

The receipt you supply alongside the artifact must be a JSON object with at least these fields:

```jsonc
{
  "spec":       "quantum-pi-forge-receipt/v1",
  "receipt_id": "<unique identifier for this receipt>",
  "artifact": {
    "path":   "milestone.json",    // filename (relative, no directory)
    "type":   "artifact",
    "digest": {
      "alg": "sha256",
      "hex": "<sha256-hex of artifact bytes>"
    }
  },
  "produced_at": "<ISO 8601 timestamp>",
  "envelope": {}                   // optional metadata
}
```

**How to generate the digest for your artifact:**

```bash
# Node.js
node -e "
const {createHash}=require('crypto'),{readFileSync}=require('fs');
const h=createHash('sha256').update(readFileSync('milestone.json')).digest('hex');
console.log(h);
"

# OpenSSL
openssl dgst -sha256 milestone.json
```

---

## Quick start — sample files

Working sample files are in `examples/verification/`:

```bash
# From repo root (after npm install):
qpf-verify \
  --artifact examples/verification/sample-artifact.json \
  --receipt  examples/verification/sample-receipt.json
# Expected: status "pass", exit 0
```

---

## Governance note

A verification receipt attests **execution integrity** — that the artifact you submitted matches the digest the originating agent claimed. It does not:

- Prove the agent had authorization to perform the task
- Authorize release of funds or protocol state
- Replace human review for governance-designated decisions
- Constitute a legal or compliance certification

The `does_not_authorize` field in every receipt makes this explicit and machine-readable.
