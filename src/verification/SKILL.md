---
name: quantum-pi-forge-verify
description: >
  Machine-facing QPF Level 0 verification skill (quantum-pi-forge-verify/v1).
  Locates artifact + execution receipt, checks structure and content hash binding.
  Does NOT grant governance, mainnet, deploy, or financial authorization.
---

# quantum-pi-forge-verify / v1

## Capability

| Field | Value |
| --- | --- |
| Spec | `quantum-pi-forge-verify/v1` |
| Result | `quantum-pi-forge-verify-result/v1` |
| Level | **0 only** (this milestone) |
| Identity | `qpf-verify-level0` |

## What it does (Level 0)

1. Locate target artifact  
2. Locate execution receipt  
3. Verify artifact hash against receipt claim  
4. Verify receipt structural fields  
5. Signature check only if claimed **and** a verify primitive exists (otherwise `unavailable` / `not_applicable`)  
6. Verify receipt↔artifact binding  
7. Emit deterministic `VerificationResult` (timestamp may differ)

## What it does **not** do

- Level 1 attestation  
- Level 2 evidence retrieval  
- Level 3 reproduction  
- Trust-root discovery / trust-policy composition  
- Key rotation  
- Network discovery  
- Deploy, broadcast, wallet, mainnet governance authorization  

## Semantics

| Status | Meaning |
| --- | --- |
| `pass` | All mandatory Level 0 checks succeeded |
| `fail` | A mandatory requirement was positively violated |
| `partial` | Level 0 ok but a higher requested level is unavailable |
| `unavailable` | Minimum Level 0 cannot be performed (missing data/capability) |

Missing information is **not** automatic cryptographic `fail`.

**PASS ≠ safety, production approval, or governance authorization.**

## Invocation

```js
import { verifyLevel0 } from './index.js';

const result = verifyLevel0({
  spec: 'quantum-pi-forge-verify/v1',
  level_requested: 0,
  target: { type: 'artifact', path: 'path/to/artifact' },
  receipt: { path: 'path/to/receipt.json' },
  cwd: process.cwd(),
});
```

CLI:

```bash
npm run verify:qpf:level0 -- --artifact <path> --receipt <path>
```

## Related

- Schemas: `schemas/qpf/v1/verify-request.schema.json`, `verify-result.schema.json`  
- Governance (separate): `scripts/verify-mainnet-operator-approval-v1.cjs` — **do not conflate**  
