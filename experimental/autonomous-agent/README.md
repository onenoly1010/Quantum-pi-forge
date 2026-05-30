# OINIO Autonomous Agent Bundle

Experimental autonomous-agent bundle staged for review before activation.

## Status

Quarantined / not enabled.

## Safety Rules

- Do not install the systemd service yet.
- Do not run infinite loops until runtime blockers are patched.
- Do not commit API keys or wallet keys.
- Keep all first-pass files under this experimental directory.

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
