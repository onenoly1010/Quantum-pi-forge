#!/usr/bin/env python3
"""
Hermes local LLM client using Ollama.

Default model: qwen2.5-coder:latest
No cloud API keys required.
No secrets read.
"""

from __future__ import annotations

import json
import urllib.request
from typing import Any


OLLAMA_URL = "http://127.0.0.1:11434/api/generate"
DEFAULT_MODEL = "qwen2.5-coder:latest"


def generate(
    prompt: str,
    model: str = DEFAULT_MODEL,
    max_tokens: int = 1024,
    temperature: float = 0.0,
    timeout: int = 120,
) -> str:
    payload: dict[str, Any] = {
        "model": model,
        "prompt": prompt,
        "stream": False,
        "options": {
            "num_predict": max_tokens,
            "temperature": temperature,
        },
    }

    req = urllib.request.Request(
        OLLAMA_URL,
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST",
    )

    with urllib.request.urlopen(req, timeout=timeout) as resp:
        data = json.loads(resp.read().decode("utf-8"))

    return str(data.get("response", "")).strip()


def available() -> bool:
    try:
        out = generate("Reply with exactly: HERMES_OK", max_tokens=16, timeout=30)
        return "HERMES_OK" in out
    except Exception:
        return False
