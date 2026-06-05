#!/usr/bin/env python3
import json
from datetime import datetime
from typing import List, Dict
from hermes.llm import generate
from hermes.tools import fetch_page

class HermesAgent:
    def __init__(self, mission: str):
        self.mission = mission
        self.log = []
        self.knowledge = {}
        self.iteration = 0

    def log_event(self, event: str):
        entry = {"ts": datetime.utcnow().isoformat(), "iter": self.iteration, "event": event}
        self.log.append(entry)
        print(f"[HERMES] {event}")

    def plan(self) -> List[str]:
        prompt = f"""Mission: {self.mission}
You are Hermes, a truthful research agent. Break the mission into 3–5 concrete, executable steps.
Output only as a JSON list of strings, nothing else."""
        resp = generate(prompt, max_tokens=300)
        try:
            steps = json.loads(resp)
            return steps if isinstance(steps, list) else ["1. Clarify goal", "2. Fetch data", "3. Synthesize"]
        except:
            return ["1. Clarify success criteria", "2. Break into subtasks", "3. Execute first action"]

    def execute(self, task: str):
        self.log_event(f"Executing: {task}")
        if "fetch" in task.lower() or "page" in task.lower():
            # crude URL extraction; real version would parse better
            import re
            urls = re.findall(r'https?://[^\s]+', task)
            if urls:
                result = fetch_page(urls[0])
                self.knowledge[task] = result['text'][:500]
                return result['text'][:500]
        self.knowledge[task] = f"Simulated result for: {task}"
        return self.knowledge[task]

    def reflect(self):
        self.iteration += 1
        prompt = f"""Mission: {self.mission}
Iteration {self.iteration}. Knowledge keys: {list(self.knowledge.keys())}
Reflect: What worked? What gaps remain? Suggest one improvement for the next cycle.
Keep response under 200 words."""
        reflection = generate(prompt, max_tokens=300)
        self.log_event(f"Reflection: {reflection[:200]}")
        return reflection

    def run_cycle(self):
        print(f"\n=== CYCLE {self.iteration} ===")
        steps = self.plan()
        for step in steps[:2]:  # limit for safety
            result = self.execute(step)
            print(f"  → {step[:60]}: {str(result)[:80]}...")
        self.reflect()

if __name__ == "__main__":
    agent = HermesAgent(mission="Research recent code-generating LLM advances (Jan–Jun 2026)")
    agent.run_cycle()
