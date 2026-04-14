#!/usr/bin/env python3
from __future__ import annotations

import json
import re
from collections import Counter
from pathlib import Path
from typing import Iterable

ROOT = Path(__file__).resolve().parent.parent
CONFIG_PATH = ROOT / "config" / "autonomous-workspace.json"
KEY_RE = re.compile(r"^[A-Za-z_][A-Za-z0-9_]*$")
TEXT_EXTENSIONS = {
    ".example",
    ".js",
    ".json",
    ".md",
    ".mjs",
    ".py",
    ".sh",
    ".toml",
    ".ts",
    ".tsx",
    ".txt",
    ".yaml",
    ".yml",
}


def load_config() -> dict:
    if not CONFIG_PATH.exists():
        raise FileNotFoundError(f"missing config: {CONFIG_PATH}")
    return json.loads(CONFIG_PATH.read_text(encoding="utf-8"))


def resolve_env_file(config: dict) -> Path:
    for relative in config.get("envFiles", []):
        candidate = ROOT / relative
        if candidate.exists():
            return candidate
    return ROOT / ".env"


def parse_env_file(env_path: Path) -> tuple[list[str], list[tuple[int, str]], dict[str, str]]:
    keys: list[str] = []
    invalid: list[tuple[int, str]] = []
    values: dict[str, str] = {}

    for i, line in enumerate(env_path.read_text(encoding="utf-8").splitlines(), 1):
        s = line.strip()
        if not s or s.startswith("#"):
            continue
        if "=" not in s:
            invalid.append((i, "missing '='"))
            continue
        key, raw_value = s.split("=", 1)
        key = key.strip()
        if not KEY_RE.match(key):
            invalid.append((i, f"invalid key '{key}'"))
            continue
        value = raw_value.strip().strip("'").strip('"')
        keys.append(key)
        values[key] = value

    return keys, invalid, values


def has_placeholder(value: str, blocked_fragments: Iterable[str]) -> bool:
    normalized = value.strip().lower()
    if not normalized:
        return True
    return any(fragment.lower() in normalized for fragment in blocked_fragments)


def iter_audit_files(config: dict) -> list[Path]:
    paths: list[Path] = []
    for relative in config.get("auditPaths", []):
        candidate = ROOT / relative
        if candidate.is_file():
            paths.append(candidate)
            continue
        if candidate.is_dir():
            for path in candidate.rglob("*"):
                if path.is_file() and path.suffix.lower() in TEXT_EXTENSIONS:
                    paths.append(path)
    return sorted(set(paths))


def main() -> int:
    config = load_config()
    env_path = resolve_env_file(config)

    if not env_path.exists():
        print(f"[env_doctor] missing env file: {env_path}")
        return 1

    keys, invalid, values = parse_env_file(env_path)

    duplicates = {k: v for k, v in Counter(keys).items() if v > 1}
    required = config.get("requiredEnvKeys", [])
    recommended = config.get("recommendedEnvKeys", [])
    blocked_fragments = config.get("blockedValueFragments", [])
    blocked_hosts = config.get("blockedHostSubstrings", [])

    missing_required = [key for key in required if not values.get(key)]
    missing_recommended = [key for key in recommended if not values.get(key)]
    placeholder_values = [
        key for key in required + recommended
        if key in values and has_placeholder(values[key], blocked_fragments)
    ]

    legacy_hits: list[tuple[Path, str]] = []
    for path in iter_audit_files(config):
        try:
            content = path.read_text(encoding="utf-8")
        except UnicodeDecodeError:
            continue
        for blocked_host in blocked_hosts:
            if blocked_host in content:
                legacy_hits.append((path.relative_to(ROOT), blocked_host))

    print(f"[env_doctor] file: {env_path}")
    print(f"[env_doctor] keys: {len(keys)}")
    if invalid:
        print("[env_doctor] invalid entries:")
        for line_no, reason in invalid:
            print(f"  - line {line_no}: {reason}")
    else:
        print("[env_doctor] invalid entries: none")

    if duplicates:
        print("[env_doctor] duplicate keys:")
        for k, v in sorted(duplicates.items()):
            print(f"  - {k}: {v}")
    else:
        print("[env_doctor] duplicate keys: none")

    if missing_required:
        print("[env_doctor] missing required keys:")
        for key in missing_required:
            print(f"  - {key}")
    else:
        print("[env_doctor] missing required keys: none")

    if missing_recommended:
        print("[env_doctor] missing recommended keys:")
        for key in missing_recommended:
            print(f"  - {key}")
    else:
        print("[env_doctor] missing recommended keys: none")

    if placeholder_values:
        print("[env_doctor] placeholder values detected:")
        for key in sorted(set(placeholder_values)):
            print(f"  - {key}")
    else:
        print("[env_doctor] placeholder values detected: none")

    if legacy_hits:
        print("[env_doctor] blocked legacy hosts found:")
        for path, blocked_host in legacy_hits:
            print(f"  - {path}: {blocked_host}")
    else:
        print("[env_doctor] blocked legacy hosts found: none")

    has_failures = bool(invalid or missing_required or placeholder_values or legacy_hits)
    return 0 if not has_failures else 2


if __name__ == "__main__":
    raise SystemExit(main())
