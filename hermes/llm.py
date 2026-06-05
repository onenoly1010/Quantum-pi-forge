"""Hermes local LLM client via Ollama."""
import json
import requests
from typing import Dict, Any

OLLAMA_URL = "http://127.0.0.1:11434/api/generate"
DEFAULT_MODEL = "qwen2.5-coder:latest"

def generate(prompt: str, model: str = DEFAULT_MODEL, max_tokens: int = 1024) -> str:
    resp = requests.post(OLLAMA_URL, json={
        "model": model,
        "prompt": prompt,
        "stream": False,
        "options": {"num_predict": max_tokens}
    }, timeout=60)
    resp.raise_for_status()
    return resp.json()["response"].strip()
