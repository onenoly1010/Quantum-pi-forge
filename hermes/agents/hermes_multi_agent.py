#!/usr/bin/env python3
"""
Hermes Multi-Agent v0.2

Grounded orchestration:
- Planner: creates deterministic task plan
- Researcher: collects or accepts source facts
- Critic: checks gaps and unsupported claims
- Verifier: writes hashes and manifest

No private keys.
No wallet signing.
No autonomous chain mutation.
No unsupported factual claims.
"""

from __future__ import annotations

import json
import hashlib
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


ROOT = Path.cwd()
OUT = ROOT / "hermes" / "artifacts" / "multi"
OUT.mkdir(parents=True, exist_ok=True)


MISSION = {
    "mission_id": "hermes-state-machine-verification-gaps-v0",
    "title": "Critical gaps in code-generating LLMs for state-machine verification",
    "mode": "multi_agent_grounded",
    "date": datetime.now(timezone.utc).date().isoformat(),
    "boundary": [
        "external facts must be sourced",
        "unsupported claims must be marked as hypotheses",
        "no invented URLs",
        "no fake completeness",
        "no key access",
        "no signing"
    ]
}


SEED_FACTS = [
    {
        "claim": "Natural-language prompts are often too ambiguous to directly produce formal state-machine specifications without human clarification.",
        "support": "general_formal_methods_constraint",
        "status": "needs_live_source",
        "tags": ["specification", "natural-language", "FSM"]
    },
    {
        "claim": "LLM-generated code can pass tests while still failing formal proof obligations or missing invariants.",
        "support": "general_llm_verification_gap",
        "status": "needs_live_source",
        "tags": ["proof", "invariants", "verification"]
    },
    {
        "claim": "Tool feedback loops with provers, SMT solvers, model checkers, or static analyzers are promising but still require careful orchestration.",
        "support": "general_tool_loop_pattern",
        "status": "needs_live_source",
        "tags": ["Z3", "Lean", "model-checking", "static-analysis"]
    }
]


def now() -> str:
    return datetime.now(timezone.utc).isoformat()


def sha256_file(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def write_json(path: Path, payload: Any) -> None:
    path.write_text(json.dumps(payload, indent=2, ensure_ascii=False), encoding="utf-8")


def planner() -> dict[str, Any]:
    return {
        "agent": "Planner",
        "ts": now(),
        "plan": [
            {
                "step": 1,
                "action": "define_scope",
                "output": "State-machine verification gaps for code-generating LLMs"
            },
            {
                "step": 2,
                "action": "collect_sources",
                "queries": [
                    "2026 LLM code generation formal verification state machines",
                    "LLM generated code proof generation benchmark Lean verification 2026",
                    "state machine guided LLM code generation verification smart contracts",
                    "LLM formal methods FSM invariants code generation gaps",
                    "LLM software engineering benchmarks formal verification 2026"
                ]
            },
            {
                "step": 3,
                "action": "cluster_findings",
                "clusters": [
                    "specification gap",
                    "proof generation gap",
                    "transition and edge-case hallucination",
                    "tool feedback loop immaturity",
                    "scalability and generalization"
                ]
            },
            {
                "step": 4,
                "action": "write_digest"
            },
            {
                "step": 5,
                "action": "critic_review"
            },
            {
                "step": 6,
                "action": "verifier_manifest"
            }
        ]
    }


def researcher() -> dict[str, Any]:
    return {
        "agent": "Researcher",
        "ts": now(),
        "mode": "seeded_until_live_search_enabled",
        "facts": SEED_FACTS,
        "note": "Live search/fetch not wired in this v0.2 file. Facts are marked needs_live_source unless backed by sources.json in a later run."
    }


def critic(research: dict[str, Any]) -> dict[str, Any]:
    unsupported = [
        item for item in research["facts"]
        if item.get("status") != "verified"
    ]

    return {
        "agent": "Critic",
        "ts": now(),
        "result": "warn" if unsupported else "pass",
        "unsupported_claim_count": len(unsupported),
        "unsupported_claims": unsupported,
        "required_next_step": "Wire live search_web/fetch_page and promote only source-backed facts to verified.",
        "reflection": [
            "The topic is strong and relevant to Hermes.",
            "The current seeded artifact is useful as a mission scaffold.",
            "It must not be represented as fully verified until sources are captured."
        ]
    }


def write_digest(plan: dict[str, Any], research: dict[str, Any], critique: dict[str, Any]) -> Path:
    path = OUT / "state_machine_verification_gaps_digest.md"

    lines = [
        "# Hermes Multi-Agent Digest",
        "",
        f"Mission: **{MISSION['title']}**",
        "",
        "## Status",
        "",
        "This is a grounded multi-agent scaffold. It is not yet a complete live-source research run.",
        "",
        "## Planner Output",
        "",
    ]

    for item in plan["plan"]:
        lines.append(f"- Step {item['step']}: `{item['action']}`")

    lines += [
        "",
        "## Researcher Seed Findings",
        "",
    ]

    for fact in research["facts"]:
        lines.append(f"- **{fact['status']}** — {fact['claim']}")

    lines += [
        "",
        "## Critic Review",
        "",
        f"Result: `{critique['result']}`",
        f"Unsupported claims: `{critique['unsupported_claim_count']}`",
        "",
        "Required next step:",
        "",
        f"> {critique['required_next_step']}",
        "",
        "## Launch Interpretation",
        "",
        "Hermes can now coordinate roles. The next hardening step is live tool grounding, not more prose.",
        ""
    ]

    path.write_text("\n".join(lines), encoding="utf-8")
    return path


def verifier(paths: list[Path]) -> dict[str, Any]:
    return {
        "agent": "Verifier",
        "ts": now(),
        "mission": MISSION,
        "artifacts": {
            str(path): {
                "sha256": sha256_file(path),
                "bytes": path.stat().st_size
            }
            for path in paths
        }
    }


def main() -> None:
    plan = planner()
    research = researcher()
    critique = critic(research)

    write_json(OUT / "planner.json", plan)
    write_json(OUT / "researcher.json", research)
    write_json(OUT / "critic.json", critique)

    digest = write_digest(plan, research, critique)

    manifest = verifier([
        OUT / "planner.json",
        OUT / "researcher.json",
        OUT / "critic.json",
        digest,
    ])

    write_json(OUT / "manifest.json", manifest)

    print("Hermes multi-agent v0.2 complete.")
    print(json.dumps({
        "digest": str(digest),
        "manifest": str(OUT / "manifest.json"),
        "critic_result": critique["result"],
        "unsupported_claims": critique["unsupported_claim_count"]
    }, indent=2))


if __name__ == "__main__":
    main()
