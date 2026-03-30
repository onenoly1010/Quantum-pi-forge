"""
Control-plane configuration loader.

Priority order:
1. Environment variables (highest priority)
2. ~/.oinio/config.yaml
3. Built-in defaults
"""

from __future__ import annotations

import logging
import os
from pathlib import Path
from typing import Any, Dict, Optional

import yaml

logger = logging.getLogger(__name__)

DEFAULT_CONFIG_PATH = Path.home() / ".oinio" / "config.yaml"


def _as_bool(value: Any, default: bool = False) -> bool:
    if isinstance(value, bool):
        return value
    if value is None:
        return default
    if isinstance(value, (int, float)):
        return bool(value)
    if isinstance(value, str):
        return value.strip().lower() in {"1", "true", "yes", "on"}
    return default


def get_config_path() -> Path:
    custom_path = os.environ.get("OINIO_CONFIG_PATH", "").strip()
    if custom_path:
        return Path(custom_path).expanduser()
    return DEFAULT_CONFIG_PATH


def load_control_plane_config() -> Dict[str, Any]:
    path = get_config_path()
    if not path.exists():
        return {}

    try:
        with path.open("r", encoding="utf-8") as handle:
            loaded = yaml.safe_load(handle) or {}
            if not isinstance(loaded, dict):
                logger.warning(
                    "OINIO config at %s is not a YAML object; ignoring file.",
                    path,
                )
                return {}
            return loaded
    except Exception as exc:
        logger.warning("Failed to read OINIO config at %s: %s", path, exc)
        return {}


_CONFIG_CACHE: Optional[Dict[str, Any]] = None


def _config() -> Dict[str, Any]:
    global _CONFIG_CACHE
    if _CONFIG_CACHE is None:
        _CONFIG_CACHE = load_control_plane_config()
    return _CONFIG_CACHE


def _nested_get(data: Dict[str, Any], dotted_path: str, default: Any = None) -> Any:
    current: Any = data
    for key in dotted_path.split("."):
        if not isinstance(current, dict):
            return default
        if key not in current:
            return default
        current = current[key]
    return current


def get_value(
    env_key: str,
    config_path: str,
    default: Any = None,
    cast: Optional[str] = None,
) -> Any:
    env_value = os.environ.get(env_key)
    if env_value not in (None, ""):
        raw = env_value
    else:
        raw = _nested_get(_config(), config_path, default)

    if cast == "bool":
        return _as_bool(raw, default=bool(default))
    if cast == "int":
        try:
            return int(raw)
        except (TypeError, ValueError):
            return int(default) if default is not None else 0
    if cast == "float":
        try:
            return float(raw)
        except (TypeError, ValueError):
            return float(default) if default is not None else 0.0
    if raw is None:
        return default
    return raw


def get_ollama_url(default: str = "http://ollama:11434") -> str:
    env_value = os.environ.get("OLLAMA_HOST", "").strip()
    if env_value:
        return env_value

    # Backward compatibility for older env naming
    env_value = os.environ.get("OLLAMA_URL", "").strip()
    if env_value:
        return env_value

    cfg = _config()
    direct = _nested_get(cfg, "ollama.url", None)
    if isinstance(direct, str) and direct.strip():
        return direct.strip()

    nodes = cfg.get("nodes", [])
    if isinstance(nodes, list):
        for node in nodes:
            if not isinstance(node, dict):
                continue
            if node.get("name") == "local":
                ollama_url = node.get("ollama_url")
                if isinstance(ollama_url, str) and ollama_url.strip():
                    return ollama_url.strip()
        for node in nodes:
            if not isinstance(node, dict):
                continue
            ollama_url = node.get("ollama_url")
            if isinstance(ollama_url, str) and ollama_url.strip():
                return ollama_url.strip()

    return default
