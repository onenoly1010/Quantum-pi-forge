# Local Hermes / Ollama Pipeline Specification

Status: draft
Mode: local-first, read-only by default, evidence-bound
Authority: human-gated

## Purpose

The Local Hermes / Ollama pipeline provides a sovereign local inference layer for Quantum Pi Forge.

Its role is to inspect repository state, summarize evidence, draft review artifacts, classify operational logs, and emit verifiable inference records that can be included in the Repo Evidence Index.

## Non-Execution Boundary

Hermes is not authorized to perform:

- wallet signing
- chain mutation
- deployment execution
- governance voting
- fund movement
- autonomous posting to Discord, Twitter, Telegram, or any external channel
- token approval or transfer
- token minting
- staking
- bridge execution
- smart contract deployment or upgrade
- protected branch mutation
- secret extraction
- credential use

## Allowed Operations

Hermes may:

- analyze local repository files
- summarize evidence or claim status
- suggest review comments for manual approval
- draft operational runbooks or boundary clarifications
- classify local log entries
- generate inference records stored under evidence/hermes/
- hash outputs into the Repo Evidence Index
- recommend next human-reviewed actions

## Output Artifacts

All Hermes-generated artifacts intended for repository use must be placed under evidence/hermes/.

Recommended paths:

- evidence/hermes/receipts/
- evidence/hermes/drafts/

Naming convention:

- evidence/hermes/receipts/hermes-YYYYMMDD-HHMMSS-shortsha.json
- evidence/hermes/drafts/hermes-YYYYMMDD-HHMMSS-shortsha.md

Each artifact must include:

- inference_timestamp
- model_used
- input_references
- output_summary
- prompt_sha256
- output_sha256
- boundary_statement
- human_review status
- evidence_index_entry when applicable

## Minimum Receipt Schema

```json
{
  "schema": "qpf.hermes.receipt.v1",
  "inference_timestamp": "YYYY-MM-DDTHH:MM:SSZ",
  "model_used": "local-ollama-model-name",
  "mode": "read-only",
  "input_references": [],
  "prompt_sha256": "",
  "output_sha256": "",
  "output_file": "",
  "boundary_statement": "no wallet signing, no deployment, no chain mutation, no autonomous posting",
  "human_review": "pending",
  "evidence_index_entry": ""
}
```

## Local Execution Workflow

1. Ensure Ollama is installed and a suitable local model is available.

2. Run a local read-only prompt against selected repository files.

3. Store the output under evidence/hermes/.

4. Create a matching receipt with prompt and output hashes.

5. Refresh and verify the repository evidence index.

```bash
bash scripts/evidence-index-refresh.sh
bash scripts/evidence-index-verify.sh
```

## Script Integration

A convenience script named scripts/hermes-run.sh may be created later to automate local inference capture.

That script must never auto-execute mutations, deployments, wallet operations, chain operations, or external posts.

## Future CLI Target

The pipeline may eventually expose:

```bash
qpf hermes run
```

CLI integration must preserve the same non-execution boundary.

## Acceptance Criteria

The lane is acceptable when:

1. Hermes can generate a local inference artifact.
2. The artifact has a receipt.
3. The receipt includes prompt and output hashes.
4. The artifact and receipt are included in the Repo Evidence Index.
5. No external posting, wallet action, deployment, governance execution, or chain mutation occurs.

## Verification

The existence and boundary of this specification are captured by evidence/claims/QPF-HERMES-PIPELINE-v1.md.

Last updated: 2026-06-05
