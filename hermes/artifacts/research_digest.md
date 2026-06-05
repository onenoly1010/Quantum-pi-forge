# Hermes Research Digest v0

## Mission

**Recent advances in code-generating LLMs**

Window requested: `2026-01-01` to `2026-06-30`  
Window available at launch: `2026-01-01` to `2026-06-04`

Hermes v0 is seeded as a deterministic research agent. This first run does not pretend to have complete coverage. It establishes the contract, source schema, first clusters, and reflection loop.

## Executive Summary

The 2026 code-generation frontier is shifting from simple prompt-to-code generation toward **agentic software engineering**: repository-scale repair, terminal use, long-horizon workflows, benchmark contamination resistance, and human orchestration of AI-generated changes.

The most important theme is evaluation hardening. SWE-bench Verified helped define the category, but frontier claims are now moving toward harder and more contamination-resistant evaluations such as SWE-Bench Pro, Terminal-Bench 2.0, CodeClash, and long-horizon software evolution tests.

## Cluster 1 — Frontier Code Models

Seeded sources:
- OpenAI — GPT-5.5
- Anthropic — Claude Opus 4.7
- Anthropic — Claude Opus 4.8

What changed:
- Coding models are being framed less as autocomplete engines and more as agentic workers capable of multi-step coding workflows.
- Performance claims increasingly reference repository issue resolution, command-line competence, and long-running task execution.

Why it matters:
- Real-world software engineering depends on environment navigation, tests, patches, dependency handling, and iterative debugging.
- The model alone is no longer the whole product. The harness, tools, prompts, repo context, and verifier matter.

## Cluster 2 — Evaluation Hardening

Seeded sources:
- OpenAI — Why SWE-bench Verified no longer measures frontier coding capabilities
- SWE-bench Leaderboards

What changed:
- SWE-bench Verified is no longer sufficient as the primary frontier measure.
- Newer benchmarks emphasize contamination resistance, terminal workflows, goal-oriented development, and industrial relevance.

Why it matters:
- A high score on a saturated benchmark can mislead teams.
- Hermes should track not only scores, but which benchmark family produced them and what failure modes remain.

## Cluster 3 — Agentic Coding Systems

Seeded source:
- SWE-bench Leaderboards

What changed:
- Agent scaffolds can materially change results.
- Small agents such as mini-SWE-agent demonstrate that harness design and tool discipline can unlock strong performance even with compact implementations.

Why it matters:
- Quantum Pi Forge should treat Hermes itself as part of the coding-agent research surface.
- The agent loop must produce artifacts, cite sources, reflect on gaps, and avoid unverifiable claims.

## Open Questions

1. Which 2026 benchmark is most resistant to memorization and leaderboard gaming?
2. What is the best local-first coding-agent scaffold for a constrained Linux workstation?
3. How should Hermes compare base model ability versus agent harness ability?
4. What tasks should be used for Quantum Pi Forge’s own coding-agent benchmark?
5. Which models are strongest under low-budget, local, or hybrid execution constraints?

## Reflection

### Strengths

- Mission scope is clear.
- Source schema is machine-readable.
- Initial clusters match the core 2026 coding-agent shift: models, agents, evals, and real-world engineering.

### Gaps / suspected misses

- This v0 seed is not a complete literature review.
- It needs more primary sources from model providers, benchmark authors, GitHub repos, arXiv papers, and engineering case studies.
- It currently covers only sources available by June 4, 2026, not the full requested Jan–Jun 2026 window.

### Next-iteration instructions

1. Add real `search_web(query)` and `fetch_page(url)` tools.
2. Gather 20–40 sources.
3. Separate primary sources from commentary.
4. Add benchmark comparison table.
5. Add a “local deployment implications for Quantum Pi Forge” section.
6. Add hallucination check: every named model, benchmark, repo, or paper must appear in `sources.json`.
