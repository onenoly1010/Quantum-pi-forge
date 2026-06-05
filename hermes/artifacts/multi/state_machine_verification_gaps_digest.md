# Hermes Multi-Agent Digest

Mission: **Critical gaps in code-generating LLMs for state-machine verification**

## Status

This is a grounded multi-agent scaffold. It is not yet a complete live-source research run.

## Planner Output

- Step 1: `define_scope`
- Step 2: `collect_sources`
- Step 3: `cluster_findings`
- Step 4: `write_digest`
- Step 5: `critic_review`
- Step 6: `verifier_manifest`

## Researcher Seed Findings

- **needs_live_source** — Natural-language prompts are often too ambiguous to directly produce formal state-machine specifications without human clarification.
- **needs_live_source** — LLM-generated code can pass tests while still failing formal proof obligations or missing invariants.
- **needs_live_source** — Tool feedback loops with provers, SMT solvers, model checkers, or static analyzers are promising but still require careful orchestration.

## Critic Review

Result: `warn`
Unsupported claims: `3`

Required next step:

> Wire live search_web/fetch_page and promote only source-backed facts to verified.

## Launch Interpretation

Hermes can now coordinate roles. The next hardening step is live tool grounding, not more prose.
