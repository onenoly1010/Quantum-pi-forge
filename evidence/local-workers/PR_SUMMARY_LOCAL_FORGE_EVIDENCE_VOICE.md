# PR Summary — Local Forge Evidence Voice

Branch: evidence/execution-truth-journal

## Scope

This branch adds a local-only, read-only evidence voice for Quantum Pi Forge.

It does not authorize live posting, wallet signing, token minting, staking, deployment, governance execution, or chain mutation.

## Proven Layers

- Redis/BullMQ mock worker path proven.
- Local Forge voice check added.
- Forge governance boundary committed.
- Local evidence ask bridge added.
- Unsafe request refusal behavior proven.
- Authority question proof captured.
- Evidence search priority tuned toward freshest proof path.

## Safety Boundary

The Forge may answer from committed evidence, docs, local git state, local mock checks, and public read-only reachability.

The Forge may not post, sign, mint, stake, deploy, merge, expose secrets, or mutate chain/infrastructure state.

## Current Authority Conclusion

The Resonance Worker is mainnet-aware, not mainnet-authorized.

It is authorized only for dry-run execution, evidence generation, local observation, hash/report creation, and mainnet-shadow analysis.

## Review Ask

Please review whether the local evidence voice, refusal behavior, and authority boundary are clear, safe, and correctly scoped.
