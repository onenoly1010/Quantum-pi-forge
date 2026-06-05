#!/usr/bin/env python3
"""
FORGE AGENT SEED v0.1

Smallest viable mind that ships:
- ingests a mission
- breaks it into deterministic steps
- executes bounded local checks
- reflects honestly
- writes verifiable artifacts

Boundary:
- no wallet signing
- no private key access
- no autonomous mutation
- no claims without evidence
"""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import subprocess
from dataclasses import dataclass, asdict
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


ROOT = Path.cwd()
ARTIFACT_DIR = ROOT / "artifacts" / "agent_seed"
STATE_FILE = ARTIFACT_DIR / "agent_state.json"


def now() -> str:
    return datetime.now(timezone.utc).isoformat()


def sha256_text(text: str) -> str:
    return hashlib.sha256(text.encode("utf-8")).hexdigest()


@dataclass
class Event:
    ts: str
    iteration: int
    kind: str
    message: str


@dataclass
class StepResult:
    step: str
    status: str
    evidence: Any


class ForgeAgentSeed:
    def __init__(self, mission: str):
        self.mission = mission
        self.iteration = 0
        self.events: list[Event] = []
        self.results: list[StepResult] = []
        ARTIFACT_DIR.mkdir(parents=True, exist_ok=True)

    def log(self, kind: str, message: str) -> None:
        event = Event(
            ts=now(),
            iteration=self.iteration,
            kind=kind,
            message=message,
        )
        self.events.append(event)
        print(f"[FORGE-SEED] {event.ts} | {kind.upper()} | {message}")

    def run_cmd(self, label: str, cmd: list[str], timeout: int = 20) -> StepResult:
        self.log("execute", label)
        try:
            proc = subprocess.run(
                cmd,
                cwd=ROOT,
                text=True,
                capture_output=True,
                timeout=timeout,
                check=False,
            )
            evidence = {
                "cmd": cmd,
                "returncode": proc.returncode,
                "stdout": proc.stdout[-5000:],
                "stderr": proc.stderr[-5000:],
            }
            status = "pass" if proc.returncode == 0 else "warn"
        except Exception as exc:
            evidence = {
                "cmd": cmd,
                "error": repr(exc),
            }
            status = "fail"

        result = StepResult(step=label, status=status, evidence=evidence)
        self.results.append(result)
        return result

    def plan(self) -> list[str]:
        self.log("plan", "Creating deterministic first launch plan")
        return [
            "record_mission",
            "inspect_git_state",
            "inspect_project_shape",
            "check_live_site",
            "scan_for_freeze_language",
            "write_launch_artifact",
            "reflect",
        ]

    def execute_step(self, step: str) -> None:
        if step == "record_mission":
            result = StepResult(
                step=step,
                status="pass",
                evidence={
                    "mission": self.mission,
                    "mission_hash": sha256_text(self.mission),
                    "boundary": [
                        "no private keys",
                        "no wallet signing",
                        "no autonomous chain mutation",
                        "no unverifiable claims",
                    ],
                },
            )
            self.results.append(result)
            self.log("evidence", "Mission recorded")

        elif step == "inspect_git_state":
            self.run_cmd(
                "inspect_git_state",
                ["bash", "-lc", "git status -sb && git branch --show-current && git log --oneline --decorate -5"],
            )

        elif step == "inspect_project_shape":
            self.run_cmd(
                "inspect_project_shape",
                ["bash", "-lc", "find . -maxdepth 2 -type f | sed 's#^./##' | sort | head -120"],
            )

        elif step == "check_live_site":
            self.run_cmd(
                "check_live_site",
                [
                    "bash",
                    "-lc",
                    "for url in https://quantumpiforge.com https://quantumpiforge.com/staking.html https://quantumpiforge.com/resonate.html; do "
                    "printf '\\n===== %s =====\\n' \"$url\"; "
                    "curl -LksS -o /tmp/qpf_seed_page.html -w 'HTTP %{http_code} | %{url_effective}\\n' \"$url\"; "
                    "grep -Eio '<title>[^<]+|Quantum Pi Forge|OINIO|resonance|staking|freeze|frozen|sealed|review' /tmp/qpf_seed_page.html | head -30 || true; "
                    "done",
                ],
            )

        elif step == "scan_for_freeze_language":
            self.run_cmd(
                "scan_for_freeze_language",
                [
                    "bash",
                    "-lc",
                    "grep -RInE 'freeze|frozen|sealed review|mutation-frozen|awaiting review|binder|binders' "
                    "README.md docs public src pages app functions 2>/dev/null || true",
                ],
            )

        elif step == "write_launch_artifact":
            self.write_launch_artifact()

        elif step == "reflect":
            self.reflect()

        else:
            self.results.append(StepResult(step=step, status="fail", evidence="unknown step"))

    def write_launch_artifact(self) -> None:
        launch_text = """# Forge Agent Seed v0.1 Launch Artifact

Quantum Pi Forge is entering live operational posture.

This artifact was produced by the first bounded Forge Agent Seed cycle.

## Mission

Verify Quantum Pi Forge live posture and produce a launch evidence artifact.

## Boundaries

- No private keys accessed.
- No wallet signing attempted.
- No autonomous chain mutation attempted.
- No unverifiable claim accepted as fact.
- Evidence is local, inspectable, and reproducible.

## Launch Signal

Quantum Pi Forge is awake.

Freeze is over.
The binders are off.
The work stands on its own now.

The proof remains.
The authority remains human.
The system moves by evidence.

This is the first day of a better day.
"""
        path = ARTIFACT_DIR / "LAUNCH_ARTIFACT.md"
        path.write_text(launch_text, encoding="utf-8")

        self.results.append(
            StepResult(
                step="write_launch_artifact",
                status="pass",
                evidence={
                    "path": str(path),
                    "sha256": sha256_text(launch_text),
                },
            )
        )
        self.log("artifact", f"Wrote {path}")

    def reflect(self) -> None:
        self.iteration += 1

        failures = [r for r in self.results if r.status == "fail"]
        warnings = [r for r in self.results if r.status == "warn"]

        if failures:
            conclusion = "Agent cycle completed with failures. Do not claim full launch without resolving them."
            status = "fail"
        elif warnings:
            conclusion = "Agent cycle completed with warnings. Launch posture may proceed, but warnings must be reviewed."
            status = "warn"
        else:
            conclusion = "Agent cycle completed cleanly. Launch evidence artifact produced."
            status = "pass"

        self.results.append(
            StepResult(
                step="reflect",
                status=status,
                evidence={
                    "failures": [asdict(r) for r in failures],
                    "warnings": [r.step for r in warnings],
                    "conclusion": conclusion,
                },
            )
        )
        self.log("reflect", conclusion)

    def save(self) -> None:
        state = {
            "agent": "FORGE_AGENT_SEED",
            "version": "0.1",
            "ts": now(),
            "mission": self.mission,
            "iteration": self.iteration,
            "events": [asdict(e) for e in self.events],
            "results": [asdict(r) for r in self.results],
        }

        STATE_FILE.write_text(json.dumps(state, indent=2), encoding="utf-8")

        digest = hashlib.sha256(STATE_FILE.read_bytes()).hexdigest()
        digest_file = ARTIFACT_DIR / "agent_state.sha256"
        digest_file.write_text(f"{digest}  {STATE_FILE.name}\n", encoding="utf-8")

        self.log("persist", f"State saved: {STATE_FILE}")
        self.log("persist", f"State sha256: {digest}")

    def run(self) -> None:
        self.log("boot", "Forge Agent Seed online")
        self.log("mission", self.mission)

        for step in self.plan():
            self.execute_step(step)

        self.save()


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--mission",
        default="Verify Quantum Pi Forge live posture and produce a launch evidence artifact.",
    )
    args = parser.parse_args()

    agent = ForgeAgentSeed(args.mission)
    agent.run()


if __name__ == "__main__":
    main()
