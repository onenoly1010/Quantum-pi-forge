# What QPF Is Today

**Status:** Canonical public orientation page  
**Updated:** 2026-09-03  
**Authority:** This page summarizes the current posture in
[`VERIFICATION_STATUS_TABLE_V1.md`](./VERIFICATION_STATUS_TABLE_V1.md). That
table and its proof paths remain authoritative for individual claims.

## In one sentence

Quantum Pi Forge is evidence-first infrastructure for verifiable autonomous
systems: it combines deterministic verification, cryptographic receipts,
governance boundaries, local AI execution, and experimental decentralized
integrations.

## What belongs to QPF?

QPF has a hierarchy rather than a single undifferentiated identity:

1. **Core protocol:** verification, evidence, governance, and auditable
   artifact workflows.
2. **Research and experiments:** Guardian-style local agents, resonance lanes,
   and adversarial or external-verification work.
3. **Integrations:** 0G compute and documented, staged paths toward future
   network interoperability.
4. **Tools:** Offline Dev Guardian, a related local AI developer-tool product;
   it is not evidence that the QPF network is live.

## What is operational?

- Local verification scripts, schemas, receipts, and deterministic tests.
- A bounded, non-executing public verification demo.
- Local AI/Guardian-style execution paths.
- The documented direct 0G Compute provider path, subject to provider
  availability and credentials.
- Read-only evidence and governance review workflows.

Operational here means reproducible within the stated scope. It does not mean
that QPF has autonomous authority, production deployment, or live economic
activity.

## What is verified?

The current verified posture includes:

- Evidence-first reviewer documentation and local verification paths.
- Public development history and governance/evidence artifacts.
- Sealed repository receipts as records of what QPF recorded.
- A bounded public verification demo.
- Documented economic safety boundaries.
- In-repository contract source and tests.

Use the verification status table for the exact proof path and permitted public
language. Repository receipts are not a substitute for independent
re-verification of every deployment or address.

## What is disabled or unresolved?

- QPF is **parked, locally auditable, and non-executing**.
- Staking, liquidity, yield, public minting, relayer flows, and bridge activity
  are not publicly active.
- Pi Network deployment rows remain pending.
- Multiple recorded 0G Aristotle deployment address sets exist.
- Bytecode matching is incomplete outside the broadcast `OINIOToken`.
- The checked Ownable contracts retain a historically untrusted owner
  residual.

### Deployment verification boundary

QPF currently has multiple recorded deployment identities. Because bytecode
and ownership discrepancies remain unresolved, QPF does **not** claim a single
canonical fully verified production deployment.

See [`contracts/DEPLOYED_ADDRESSES.md`](../../contracts/DEPLOYED_ADDRESSES.md)
for the dated RPC evidence and the remaining verification boundary.

## What can an outsider reproduce?

From a fresh clone, an outsider can run the read-only audit path:

```bash
npm ci
npm run audit:full-local
npm run verify:evidence
npm run build
```

The public verification demo is:

```bash
npm run public:verification-demo:v1
```

These paths do not require a private key or funded wallet and do not authorize
deployment, signing, broadcasting, minting, staking, liquidity, custody
transfer, or governance execution.

## Current conclusion

QPF is a credible, evidence-first sovereign-AI and governance prototype with
real local tooling and experimental network integrations. It is not yet
publicly established as a fully autonomous, economically active production
network.

Review the evidence first; treat stronger claims as pending until their
specified proof exists.
