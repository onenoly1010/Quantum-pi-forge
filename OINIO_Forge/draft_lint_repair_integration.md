# draft_lint_repair.py Integration Snippet

Add this at the top of draft_lint_repair.py:

```python
from context_assembly import build_context_prompt, get_current_state_hash
```

Then modify the repair prompt assembly:

```python
# Before generating repair suggestions:
governance_context = build_context_prompt(f"repair guidelines for changes in {filepath}, allowed patterns, forbidden changes")

prompt = f"""{governance_context}

You are the OINIO canonical repair agent.
All modifications must be strictly aligned with the memory context provided above.

File path: {filepath}
Current content:
{file_content}

Lint errors:
{lint_errors}

Generate minimal, compliant repair. Do not change anything not required to fix errors.
All decisions are bound to state hash: {get_current_state_hash()}
"""
```

## Usage in CI / Merge Gate:
```python
# Immediately before merge:
chunks, state_hash = retrieve_context("merge approval criteria, invariants, allowed changes")

if not any(c['confidence'] > 0.8 for c in chunks):
    print(f"❌ MERGE REJECTED: No governance context found for this change")
    print(f"   State hash: {state_hash}")
    exit(1)
```

All layers now share the exact same memory interface:
- ✅ run_alive.py
- ✅ draft_lint_repair.py
- ✅ local lint
- ✅ CI pipeline
- ✅ merge verification gate