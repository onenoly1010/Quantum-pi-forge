# OINIO Autonomous Agent Bundle

Experimental autonomous-agent bundle staged for review before activation.

## Status

Quarantined / not enabled.

## Safety Rules

- Do not install the systemd service yet.
- Do not run infinite loops until runtime blockers are patched.
- Do not commit API keys or wallet keys.
- Keep all first-pass files under this experimental directory.
- Do not perform wallet transactions from this bundle.
- Do not mutate protected branches from this bundle.
- Do not claim full autonomous network operation from this bundle.

## Known Blockers

- `run_alive.py` needs `aliveness_report` initialized before pre-execution reject paths.
- `run_alive.py` needs context passed into `simulate_economic_failure()`.
- `continuous_workflow.py` contains a placeholder token and missing runtime functions.
- `revenue_endpoint.py` must move API keys to environment variables before production use.
- `memory_synthesis.py` should backup/export raw memory before pruning.

## Merge Strategy

Start with non-running foundations first:

1. `context_assembly.py`
2. `falsifiable.py`
3. `ingest_memory.py`

Then add patched runtime files only after review.

## Current Governance Boundary

This directory is documentation-only unless a future receipt explicitly authorizes a bounded runtime test.

No service installation, daemonization, credential use, wallet action, protected-branch mutation, or unsupervised autonomous execution is authorized here.
