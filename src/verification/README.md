# `src/verification`

QPF verification infrastructure.

**AUTHORIZATION ≠ VERIFICATION**  
**VERIFICATION ≠ GOVERNANCE DECISION**

Governance boundary (unchanged): `scripts/verify-mainnet-operator-approval-v1.cjs`

## Milestone status

| Piece | Status |
| --- | --- |
| Canonical serialization (`jcs-rfc8785`) | Done |
| **Level 0 verify** (`quantum-pi-forge-verify/v1`) | **Done** |
| Level 1+ attestation / trust / policy | Not started |

## Level 0

```bash
npm run test:verification:level0
npm run verify:qpf:level0 -- --artifact <path> --receipt <path>
```

```js
import { verifyLevel0 } from './index.js';
```

Skill declaration: `src/verification/SKILL.md`  
Schemas: `schemas/qpf/v1/verify-request.schema.json`, `verify-result.schema.json`

## Hash

SHA-256 via Node `crypto` (transitional; algorithm always labeled on digests). No BLAKE3 dependency yet.
