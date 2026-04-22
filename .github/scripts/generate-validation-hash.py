#!/usr/bin/env python3
import hashlib
import json
import sys
from pathlib import Path


def hash_file(path):
    """Generate SHA-256 hash of file contents"""
    with open(path, "rb") as f:
        return hashlib.sha256(f.read()).hexdigest()


def main():
    if len(sys.argv) != 4:
        print("Usage: generate-validation-hash.py <artifact_path> <pr_number> <commit_sha>")
        sys.exit(1)

    artifact_path = sys.argv[1]
    pr_number = sys.argv[2]
    commit_sha = sys.argv[3]

    if not Path(artifact_path).exists():
        print(f"Error: Artifact file not found at {artifact_path}")
        sys.exit(1)

    artifact_hash = hash_file(artifact_path)

    payload = {
        "artifact_hash": artifact_hash,
        "artifact_path": artifact_path,
        "pr_number": pr_number,
        "commit_sha": commit_sha
    }

    # Deterministic serialization with sorted keys
    payload_str = json.dumps(payload, sort_keys=True, separators=(',', ':'))
    validation_hash = hashlib.sha256(payload_str.encode()).hexdigest()

    print(validation_hash)


if __name__ == "__main__":
    main()