#!/usr/bin/env python3
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from hermes.llm import generate, available

print("=== Ollama availability ===")
print("available:", available())

print()
print("=== Hermes local planning smoke ===")
prompt = """You are Hermes Planner.
Create exactly 3 deterministic steps for this mission:
Verify Quantum Pi Forge site posture.
Return plain text only."""
print(generate(prompt, max_tokens=200, temperature=0.0))
