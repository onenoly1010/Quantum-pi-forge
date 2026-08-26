# QPF-IVB-1 fixtures

Harness for the QPF-IVB-1 fixture battery. **Scaffolding only.**

Normative protocol remains `docs/protocol/qpf-v1/` Sections 01–09. This tree does not amend those documents.

Contract: [GENERATION_CONTRACT_V1.md](./GENERATION_CONTRACT_V1.md)

## Layout

```text
fixtures/
├── README.md
├── GENERATION_CONTRACT_V1.md
├── registry/
│   └── root_keys.json          # reserved; no key material
├── vectors/
│   ├── VEC-001/
│   │   ├── input/              # empty (no protocol objects yet)
│   │   ├── meta/               # harness identity only
│   │   └── expected/           # empty (no traces / verdicts)
│   ├── VEC-002/ … VEC-025/
└── package/                    # reserved; no package hash
```

This layout is **harness structure**, not a protocol rule.

Section 08 is a Verification Receipt. It does not define `input/manifest.json`. Section 03’s `manifest` is a field of an evidence bundle, not a required filename in `input/`. Do not treat a path in this tree as a new normative object.

## Generator

```text
scripts/generate-ivb-fixtures.sh
```

That script scaffolds and reports status. It is not a verifier. It will refuse to emit signatures, private keys, package hashes, or expected verdicts.

## Current population

| Slot | Input | Expected | Notes |
| --- | --- | --- | --- |
| `registry/root_keys.json` | — | — | `keys: []` |
| `VEC-001` … `VEC-025` | empty | empty | reserved |
| `package/` | empty | — | no hash |

Cryptographic contents wait on an audited VEC-001 construction plan.
