#!/usr/bin/env python3
from __future__ import annotations

import re
from collections import Counter
from pathlib import Path

ENV_PATH = Path("/home/kris/forge/Quantum-pi-forge/.env")
KEY_RE = re.compile(r"^[A-Za-z_][A-Za-z0-9_]*$")


def main() -> int:
    if not ENV_PATH.exists():
        print(f"[env_doctor] missing: {ENV_PATH}")
        return 1

    keys: list[str] = []
    invalid: list[tuple[int, str]] = []

    for i, line in enumerate(ENV_PATH.read_text(encoding="utf-8").splitlines(), 1):
        s = line.strip()
        if not s or s.startswith("#"):
            continue
        if "=" not in s:
            invalid.append((i, "missing '='"))
            continue
        key = s.split("=", 1)[0].strip()
        if not KEY_RE.match(key):
            invalid.append((i, f"invalid key '{key}'"))
            continue
        keys.append(key)

    duplicates = {k: v for k, v in Counter(keys).items() if v > 1}

    print(f"[env_doctor] file: {ENV_PATH}")
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

    return 0 if not invalid else 2


if __name__ == "__main__":
    raise SystemExit(main())
