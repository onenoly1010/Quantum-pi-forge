#!/usr/bin/env bash
set -Eeuo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

echo "== Agent API contract verification =="
echo "Root: $ROOT"

python3 - <<'PY'
import json
import hashlib
from pathlib import Path

root = Path(".").resolve()

fixtures = {
    "test/fixtures/skill_ship_depth1.json": {
        "required": ["topic", "requested_depth", "resolved_depth", "content", "linked_topics"],
        "kind": "skill"
    },
    "test/fixtures/skill_ship_depth2.json": {
        "required": ["topic", "requested_depth", "resolved_depth", "content", "linked_topics"],
        "kind": "skill"
    },
    "test/fixtures/search_wallet_markdown.json": {
        "required": ["query", "format", "results"],
        "kind": "search"
    },
    "test/fixtures/refusal_unknown.json": {
        "required": ["error", "code", "deterministic_refusal"],
        "kind": "refusal"
    },
}

errors = []

for rel, spec in fixtures.items():
    path = root / rel
    if not path.exists():
        errors.append(f"missing fixture: {rel}")
        continue

    try:
        raw = path.read_text(encoding="utf-8")
        data = json.loads(raw)
    except Exception as exc:
        errors.append(f"{rel}: invalid JSON: {exc}")
        continue

    for key in spec["required"]:
        if key not in data:
            errors.append(f"{rel}: missing required key: {key}")

    if spec["kind"] == "skill":
        if not isinstance(data.get("topic"), str) or not data["topic"]:
            errors.append(f"{rel}: topic must be non-empty string")
        if not isinstance(data.get("requested_depth"), int) or data["requested_depth"] < 1:
            errors.append(f"{rel}: requested_depth must be integer >= 1")
        if not isinstance(data.get("resolved_depth"), int) or data["resolved_depth"] < 1:
            errors.append(f"{rel}: resolved_depth must be integer >= 1")
        if not isinstance(data.get("content"), str):
            errors.append(f"{rel}: content must be string")
        if not isinstance(data.get("linked_topics"), list):
            errors.append(f"{rel}: linked_topics must be array")
        elif not all(isinstance(item, str) and item for item in data["linked_topics"]):
            errors.append(f"{rel}: linked_topics entries must be non-empty strings")

    if spec["kind"] == "search":
        if data.get("format") not in ["json", "markdown"]:
            errors.append(f"{rel}: format must be json or markdown")
        if not isinstance(data.get("results"), list):
            errors.append(f"{rel}: results must be array")
        else:
            for i, result in enumerate(data["results"]):
                if not isinstance(result, dict):
                    errors.append(f"{rel}: result {i} must be object")
                    continue
                if "topic" not in result:
                    errors.append(f"{rel}: result {i} missing topic")
                if "score" not in result:
                    errors.append(f"{rel}: result {i} missing score")
                elif not isinstance(result["score"], (int, float)) or not (0 <= result["score"] <= 1):
                    errors.append(f"{rel}: result {i} score must be number between 0 and 1")

    if spec["kind"] == "refusal":
        if data.get("deterministic_refusal") is not True:
            errors.append(f"{rel}: deterministic_refusal must be true")
        if not isinstance(data.get("code"), str) or not data["code"]:
            errors.append(f"{rel}: code must be non-empty string")

    digest = hashlib.sha256(raw.encode("utf-8")).hexdigest()
    print(f"{rel}  sha256={digest}")

if errors:
    print("\nFAIL:")
    for error in errors:
        print(f"- {error}")
    raise SystemExit(1)

print("\nOK: static agent API contract fixtures verified.")
PY
