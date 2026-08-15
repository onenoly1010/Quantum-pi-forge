# Verification tests and vectors

## Status

**Scaffold only** — vectors will be added with implementation milestones.

## Target layout

```text
tests/verification/
├── vectors/
│   ├── valid-receipt/
│   ├── invalid-signature/
│   ├── artifact-hash-mismatch/
│   ├── policy-hash-mismatch/
│   ├── rotated-key-valid/
│   ├── revoked-key/
│   ├── missing-evidence/
│   ├── evidence-digest-mismatch/
│   ├── policy-conflict/
│   ├── reproduction-success/
│   ├── reproduction-failure/
│   └── reproduction-unavailable/
├── receipt.test.*
├── attestation.test.*
├── trust.test.*
├── policy.test.*
├── semantics.test.*
├── verifier-profile.test.*
└── end-to-end.test.*
```

Each vector should declare:

```text
INPUT: artifact, receipt, attestation?, trust root, policy
EXPECTED: dimension results + top-level status + codes
```

Independent implementations MUST agree on expected outcomes for these vectors.
