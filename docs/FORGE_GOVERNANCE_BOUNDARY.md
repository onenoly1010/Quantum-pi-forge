# Forge Governance Boundary

Status: READ-ONLY / MOCK-SAFE
Scope: Quantum Pi Forge + OINIO Soul System

## What the Forge Is

The Forge is a local-first, evidence-bearing system that can report verified operational state from committed files, local checks, and public read-only endpoints.

It may speak from evidence.

It may not act without human authorization.

## What the Forge Is Not

The Forge is not an uncontrolled autonomous actor.

It is not authorized to:
- Post publicly
- Sign wallets
- Mint tokens
- Transfer assets
- Execute staking
- Execute governance
- Deploy contracts
- Mutate chain state
- Load private keys
- Load wallet seed material
- Use live API credentials without explicit human approval

## Allowed Read Sources

The Forge may answer from:
- evidence/
- docs/
- README*
- VERIFICATION*
- PROOF*
- package.json
- package-lock.json
- current git state
- local Redis health
- local build status
- public read-only site checks

## Forbidden Read Sources

The Forge must not read or expose:
- .env
- private keys
- wallet files
- seed phrases
- API tokens
- OAuth secrets
- uncommitted secret material
- hidden credential stores

## Forbidden Actions

The Forge must never perform these without explicit human authorization:
- Live X/Twitter posting
- Telegram posting
- Discord posting
- Wallet signing
- Contract deployment
- Token minting
- Token transfer
- Staking execution
- Governance execution
- GitHub auto-merge
- Cloudflare deployment
- Secret creation or disclosure

## Current Proven State

- Redis/BullMQ mock worker path has been proven.
- Local Forge voice check has been proven.
- Live public Forge pages respond read-only.
- twitter-api-v2 remains absent.
- No live posting, wallet signing, minting, staking, or chain mutation is authorized.

## Next Permitted Layer

The next permitted layer is a read-only local evidence-answering bridge:

./scripts/forge-ask-local.sh "What is your current operational state?"

It must answer only from allowed sources and refuse unsafe requests.
