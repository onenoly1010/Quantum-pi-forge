#!/usr/bin/env python3
from __future__ import annotations

import json
import hashlib
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


ROOT = Path.cwd()
MISSION_PATH = ROOT / "hermes" / "missions" / "code_llm_jan_jun_2026.json"


SEED_SOURCES = [
    {
        "id": "openai-swe-bench-verified-no-longer-measures-frontier",
        "url": "https://openai.com/index/why-we-no-longer-evaluate-swe-bench-verified/",
        "title": "Why SWE-bench Verified no longer measures frontier coding capabilities",
        "date": "2026-02-23",
        "publisher": "OpenAI",
        "cluster_id": "evals-contamination",
        "tags": ["SWE-bench Verified", "SWE-Bench Pro", "evaluation", "contamination"],
        "summary": "OpenAI argues SWE-bench Verified is increasingly contaminated and recommends SWE-Bench Pro for frontier coding evaluation."
    },
    {
        "id": "openai-gpt-5-5",
        "url": "https://openai.com/index/introducing-gpt-5-5/",
        "title": "Introducing GPT-5.5",
        "date": "2026-04-23",
        "publisher": "OpenAI",
        "cluster_id": "frontier-code-models",
        "tags": ["GPT-5.5", "SWE-Bench Pro", "Terminal-Bench 2.0", "agentic coding"],
        "summary": "OpenAI describes GPT-5.5 as its strongest agentic coding model to date, with reported SWE-Bench Pro and Terminal-Bench 2.0 results."
    },
    {
        "id": "anthropic-claude-opus-4-7",
        "url": "https://www.anthropic.com/news/claude-opus-4-7",
        "title": "Introducing Claude Opus 4.7",
        "date": "2026-04-16",
        "publisher": "Anthropic",
        "cluster_id": "frontier-code-models",
        "tags": ["Claude Opus 4.7", "coding", "agentic workflows"],
        "summary": "Anthropic reports coding improvements for Claude Opus 4.7, including better resolution on internal coding tasks."
    },
    {
        "id": "anthropic-claude-opus-4-8",
        "url": "https://www.anthropic.com/news/claude-opus-4-8",
        "title": "Introducing Claude Opus 4.8",
        "date": "2026-05-27",
        "publisher": "Anthropic",
        "cluster_id": "frontier-code-models",
        "tags": ["Claude Opus 4.8", "coding", "agentic tasks", "alignment"],
        "summary": "Anthropic presents Claude Opus 4.8 as an upgrade with stronger coding and agentic-task performance plus alignment evaluation."
    },
    {
        "id": "swe-bench-leaderboards",
        "url": "https://www.swebench.com/",
        "title": "SWE-bench Leaderboards",
        "date": "2026-06-04",
        "publisher": "SWE-bench",
        "cluster_id": "benchmarks",
        "tags": ["SWE-bench", "CodeClash", "mini-SWE-agent", "software engineering evals"],
        "summary": "SWE-bench tracks software engineering agent benchmarks and highlights newer evaluations and agent scaffolds."
    }
]


def now() -> str:
    return datetime.now(timezone.utc).isoformat()


def sha256(data: str) -> str:
    return hashlib.sha256(data.encode("utf-8")).hexdigest()


def load_mission() -> dict[str, Any]:
    return json.loads(MISSION_PATH.read_text())


def write_sources(path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    payload = {
        "schema": "hermes.sources.v0",
        "generated_at": now(),
        "source_count": len(SEED_SOURCES),
        "sources": SEED_SOURCES
    }
    path.write_text(json.dumps(payload, indent=2), encoding="utf-8")


def write_digest(path: Path, mission: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)

    digest = f"""# Hermes Research Digest v0

## Mission

**{mission["title"]}**

Window requested: `{mission["time_window"]["start"]}` to `{mission["time_window"]["end_requested"]}`  
Window available at launch: `{mission["time_window"]["start"]}` to `{mission["time_window"]["end_available_at_launch"]}`

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
"""

    path.write_text(digest, encoding="utf-8")


def write_reflection(path: Path, mission: dict[str, Any]) -> None:
    named_entities = [
        "GPT-5.5",
        "Claude Opus 4.7",
        "Claude Opus 4.8",
        "SWE-bench Verified",
        "SWE-Bench Pro",
        "Terminal-Bench 2.0",
        "CodeClash",
        "mini-SWE-agent"
    ]

    source_text = json.dumps(SEED_SOURCES)
    verified = {
        entity: entity.lower() in source_text.lower()
        for entity in named_entities
    }

    reflection = {
        "schema": "hermes.reflection.v0",
        "generated_at": now(),
        "mission_id": mission["mission_id"],
        "time_window_check": {
            "requested_end": mission["time_window"]["end_requested"],
            "available_at_launch": mission["time_window"]["end_available_at_launch"],
            "status": "partial_window_only"
        },
        "hallucination_check": {
            "named_entities_checked": verified,
            "status": "pass" if all(verified.values()) else "warn"
        },
        "coverage_check": {
            "new_base_models_for_code": True,
            "new_agent_frameworks": "partial",
            "new_eval_benchmarks": True,
            "safety_and_robustness": "partial",
            "real_world_software_engineering": "partial"
        },
        "next_iteration": [
            "implement live search_web and fetch_page",
            "add primary sources from arXiv and official repos",
            "add benchmark table",
            "add local-first implications for Quantum Pi Forge"
        ]
    }

    path.write_text(json.dumps(reflection, indent=2), encoding="utf-8")


def main() -> None:
    mission = load_mission()

    digest_path = ROOT / mission["outputs"]["digest"]
    sources_path = ROOT / mission["outputs"]["sources"]
    reflection_path = ROOT / mission["outputs"]["reflection"]

    write_sources(sources_path)
    write_digest(digest_path, mission)
    write_reflection(reflection_path, mission)

    manifest = {
        "schema": "hermes.run_manifest.v0",
        "generated_at": now(),
        "mission": mission,
        "artifacts": {
            "digest": str(digest_path),
            "sources": str(sources_path),
            "reflection": str(reflection_path)
        },
        "hashes": {
            "digest_sha256": sha256(digest_path.read_text()),
            "sources_sha256": sha256(sources_path.read_text()),
            "reflection_sha256": sha256(reflection_path.read_text())
        }
    }

    manifest_path = ROOT / "hermes" / "artifacts" / "run_manifest.json"
    manifest_path.write_text(json.dumps(manifest, indent=2), encoding="utf-8")

    print("Hermes mission deployed.")
    print(json.dumps(manifest["artifacts"], indent=2))
    print(json.dumps(manifest["hashes"], indent=2))


if __name__ == "__main__":
    main()
