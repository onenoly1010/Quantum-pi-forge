# CLAIM-ID: QPF-HERMES-PIPELINE-v1

Status: verified
Class: claim
Created: 2026-06-05
Updated: 2026-06-05

## Claim

Quantum Pi Forge contains a specification for a local Hermes / Ollama inference pipeline that is read-only, evidence-bound, and does not execute wallet, chain, deployment, governance, fund movement, or autonomous posting actions.

## Proof References

- docs/hermes/LOCAL_HERMES_OLLAMA_PIPELINE.md
- evidence/claims/SCHEMA.md
- evidence/INDEX.md
- scripts/evidence-index-refresh.sh
- scripts/evidence-index-verify.sh

## Verification Command

```bash
test -f docs/hermes/LOCAL_HERMES_OLLAMA_PIPELINE.md
grep -q "Non-Execution Boundary" docs/hermes/LOCAL_HERMES_OLLAMA_PIPELINE.md
grep -q "wallet signing" docs/hermes/LOCAL_HERMES_OLLAMA_PIPELINE.md
grep -q "chain mutation" docs/hermes/LOCAL_HERMES_OLLAMA_PIPELINE.md
grep -q "autonomous posting" docs/hermes/LOCAL_HERMES_OLLAMA_PIPELINE.md
bash scripts/evidence-index-refresh.sh
bash scripts/evidence-index-verify.sh
```

## Boundary

This claim verifies the existence and design boundary of the Hermes/Ollama pipeline specification.

It does not verify live model execution, wallet execution, funding approval, token liquidity, external posting, deployment, or chain mutation.
