"""
Control Plane Configuration Module
Provides centralized configuration management for the Quantum Pi Forge
"""

import os
from typing import Any, Optional


def get_ollama_url() -> str:
    """
    Get the Ollama URL from environment variables or default configuration.

    Returns:
        str: The Ollama service URL
    """
    return os.getenv("OLLAMA_URL", "http://localhost:11434")


def get_value(key: str, default: Any = None) -> Any:
    """
    Get a configuration value from environment variables.

    Args:
        key: The environment variable key
        default: Default value if key is not found

    Returns:
        The configuration value or default
    """
    return os.getenv(key, default)


def get_default_model() -> str:
    """
    Get the default Ollama model name.

    Returns:
        str: The default model name
    """
    return get_value("OLLAMA_DEFAULT_MODEL", "llama2")


def get_routing_mode() -> str:
    """
    Get the routing mode configuration.

    Returns:
        str: The routing mode
    """
    return get_value("ROUTING_MODE", "round_robin")


def get_supabase_url() -> Optional[str]:
    """
    Get the Supabase URL.

    Returns:
        Optional[str]: The Supabase URL if configured
    """
    return get_value("SUPABASE_URL")


def get_supabase_key() -> Optional[str]:
    """
    Get the Supabase anonymous key.

    Returns:
        Optional[str]: The Supabase key if configured
    """
    return get_value("SUPABASE_ANON_KEY")