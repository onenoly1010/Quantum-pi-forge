#!/usr/bin/env python3
"""
Draft-Lint-Repair Loop for OINIO Soul
Recursive self-refactoring with linter feedback and epistemic humility.

Usage:
    python .github/scripts/draft_lint_repair.py --target-file path/to/file.py --task "Add X feature while preserving invariants"
"""

import argparse
import subprocess
import sys
import tempfile
import time
from pathlib import Path
from typing import Tuple

from context_assembly import assemble_context


def run_command(cmd: str, cwd: Path = None) -> Tuple[int, str, str]:
    """Run shell command and capture output."""
    try:
        result = subprocess.run(
            cmd, shell=True, cwd=cwd, capture_output=True, text=True, timeout=60
        )
        return result.returncode, result.stdout, result.stderr
    except subprocess.TimeoutExpired:
        return 1, "", "Command timed out"


def call_ollama(prompt: str, model: str = "llama3.2") -> str:
    """Call local Ollama with structured encouragement for humility."""
    try:
        import ollama
        response = ollama.chat(
            model=model,
            messages=[{"role": "user", "content": prompt}],
        )
        return response['message']['content'].strip()
    except Exception as e:
        return f"Ollama call failed: {str(e)}"


def autonomous_refactor(target_file: Path, task_description: str, max_attempts: int = 3):
    """Core Draft → Lint → Repair loop."""
    print(f"🚀 Starting Draft-Lint-Repair on {target_file} for task: {task_description}")
    print("Epistemic Rule: All proposals are claims only. No collapse into truth.")

    context = assemble_context(Path("canon"), Path("forge_identity_map.txt"), limit=5)

    current_code = target_file.read_text(encoding="utf-8") if target_file.exists() else ""

    autonomous_refactor.last_error = "None"

    for attempt in range(1, max_attempts + 1):
        print(f"\n=== Attempt {attempt}/{max_attempts} ===")

        # 1. Generate / Repair draft with full context + previous errors
        prompt = f"""{context}

Current file content:
```python
{current_code}
```

Task: {task_description}

Previous attempt feedback (if any): {autonomous_refactor.last_error}

Generate a complete, minimal, diff-friendly updated version of the file.
Respect Canon State Machine: Execution → Observation → Claim. No "success" or "completed" language.
Output ONLY the full new file content (no explanations outside code blocks).
End the file with a comment containing an explicit non-authoritative claim.

New file content:
"""

        new_code = call_ollama(prompt)

        # Extract code block if present
        if "```python" in new_code:
            new_code = new_code.split("```python")[1].split("```")[0].strip()
        elif "```" in new_code:
            new_code = new_code.split("```")[1].split("```")[0].strip()

        # 2. Write temp version and lint
        with tempfile.NamedTemporaryFile(mode="w", suffix=".py", delete=False) as tmp:
            tmp_path = Path(tmp.name)
            tmp.write(new_code)

        lint_code, lint_out, lint_err = run_command(f"python3 .github/scripts/semantic_lint.py {tmp_path}")

        if lint_code == 0:
            # Success — apply
            target_file.parent.mkdir(parents=True, exist_ok=True)
            target_file.write_text(new_code, encoding="utf-8")
            print("✅ Lint passed. Changes applied.")
            print("Claim: This is a second-order proposal based on observed Canon and Identity Map. External verification via auto-merge gates is required.")
            tmp_path.unlink()
            return True
        else:
            error_feedback = f"Lint failed:\n{lint_out}\n{lint_err}"
            print(f"❌ Lint failed on attempt {attempt}:\n{error_feedback[:500]}...")
            autonomous_refactor.last_error = error_feedback  # Store for next prompt
            tmp_path.unlink()

    # Max attempts reached — create safe PR instead of forcing change
    print("⚠️  Max repair attempts reached. Creating PR with partial proposal.")
    create_humility_pr(target_file, task_description, new_code)
    return False


def create_humility_pr(target_file: Path, task: str, proposed_code: str):
    """Create a PR that goes through the full 6-gate auto-merge + state machine."""
    branch_name = f"oinio-refactor/{target_file.stem}-{int(time.time())}"

    # Git operations via run_command (safe, no direct push to main)
    run_command(f"git checkout -b {branch_name}")
    target_file.write_text(proposed_code, encoding="utf-8")
    run_command(f"git add {target_file}")
    run_command(f'git commit -m "OINIO Soul: Draft proposal for {task} (epistemic claim only)"')
    run_command(f"git push origin {branch_name}")

    # Create PR via gh CLI — it will be treated as any other PR by canon-auto-merge
    pr_body = f"""OINIO Soul Proposal (Attempted Refactor)

Task: {task}

This is a claim only, not truth. 
Generated via Draft-Lint-Repair loop with Canon context.
Failed final lint after 3 attempts → submitting for human/Canon gate review.

See semantic_lint output in workflow logs.

Epistemic status: partial_claim — verification required via Gate 6 + State Machine.
"""

    run_command(f'gh pr create --base main --head {branch_name} --title "OINIO: {task}" --body "{pr_body}" --label "canon,oinio-proposal"')

    print("✅ PR created. It will now pass through the full Canon Auto-Merge pipeline and State Machine.")


def main():
    parser = argparse.ArgumentParser(description="OINIO Draft-Lint-Repair Loop")
    parser.add_argument("--target-file", required=True, type=Path, help="File to refactor")
    parser.add_argument("--task", required=True, help="Description of the structural improvement")
    parser.add_argument("--max-attempts", type=int, default=3)
    args = parser.parse_args()

    success = autonomous_refactor(args.target_file, args.task, args.max_attempts)
    sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()