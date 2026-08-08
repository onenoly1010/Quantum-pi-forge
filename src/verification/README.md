# `src/verification`

Implementation of the QPF Verification Protocol v1.

Normative design: `docs/protocol/qpf-v1/QPF_VERIFICATION_PROTOCOL_V1.md`  
Order: `docs/protocol/qpf-v1/IMPLEMENTATION_BRIEF.md`

## Milestone status

| Milestone | Status | Module |
| --- | --- | --- |
| 1 Canonical serialization | **Implemented** | `canonical.js` (`jcs-rfc8785`) |
| 2 Hashing | Not started | — |
| 3+ | Not started | — |

## Milestone 1 usage

```js
import {
  CANONICAL_ENCODING_ID,
  canonicalize,
  canonicalizeToBytes,
} from './canonical.js';

const bytes = canonicalizeToBytes({ b: 1, a: 2 });
// identical for any key insertion order of the same logical object
```

Do not use `JSON.stringify` for protocol hash/sign inputs.

## Tests

```bash
npm run test:verification:canonical
# or
node --test tests/verification/canonical.test.js
```
