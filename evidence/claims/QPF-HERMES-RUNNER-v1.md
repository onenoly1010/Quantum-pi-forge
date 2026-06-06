# CLAIM-ID: QPF-HERMES-RUNNER-v1

Status: pending
Class: claim
Created: 2026-06-05
Updated: 2026-06-05

## Claim

Quantum Pi Forge contains a local Hermes/Ollama runner script that creates read-only, evidence-bound inference receipts under `evidence/hermes/receipts/`.

## Proof References

- `scripts/hermes-run.sh`
- `docs/hermes/LOCAL_HERMES_OLLAMA_PIPELINE.md`
- `evidence/claims/QPF-HERMES-PIPELINE-v1.md`
- `scripts/evidence-index-refresh.sh`
- `scripts/evidence-index-verify.sh`

## Verification Command

```bash
test -x scripts/hermes-run.sh
grep -q "wallet signing" scripts/hermes-run.sh
grep -q "chain mutation" scripts/hermes-run.sh
grep -q "evidence/hermes/receipts" scripts/hermes-run.sh
bash scripts/evidence-index-refresh.sh
bash scripts/evidence-index-verify.sh
```

## Boundary

This claim verifies the existence and boundary of the local runner script.

It remains pending until a sample local inference receipt is generated and indexed.

The runner does not authorize wallet signing, deployment, governance execution, fund movement, external posting, or chain mutation.
