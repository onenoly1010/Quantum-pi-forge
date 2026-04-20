#!/usr/bin/env python3
"""
Gate 3: Semantic Lint & Canon Graph Validation
Checks for internal consistency, valid IDs, cross-references, and graph integrity.
All validation failures include traceable Rule IDs aligned with Gate 2 standard.
"""

import sys
import os
import re
import yaml

CANON_DIR = "canon"

# FAIL_FAST: Exit immediately on first failure when set (CI environment default ON by default)
FAIL_FAST = os.environ.get("FAIL_FAST", "1").lower() in ("1", "true", "yes")

# Precompiled regex patterns (exactly aligned with Gate 2 for consistency)
EXCLUDE_PATTERN = re.compile(r'^(INDEX|README|README-TODO|DRAFT|EXAMPLE|TEMPLATE)', re.IGNORECASE)
ID_PATTERN = re.compile(r'^[A-Z]+-\d{3,}$')
REF_PATTERN = re.compile(r'\[\[?([A-Z]+-\d{3,})\]?\]')

# -----------------------------------------------------------------------------
# CANON RULE REGISTRY
# Continuing sequence from Gate 2. Rule IDs are permanent and immutable.
# -----------------------------------------------------------------------------
RULES = {
    "CANON-011": "Duplicate artifact ID detected across canon files",
    "CANON-012": "Broken cross-reference to non-existent artifact ID",
    "CANON-013": "Orphan artifact detected (never referenced by any other artifact)",
    "CANON-014": "Invalid cross-reference format"
}


def extract_frontmatter(content: str) -> str | None:
    if not content.startswith("---"):
        return None
    parts = content.split("---", 2)
    if len(parts) < 3:
        return None
    return parts[1]


def strip_code_blocks(text: str) -> str:
    return re.sub(r"```.*?```", "", text, flags=re.DOTALL)


def error(path: str, rule_id: str, details: str = "") -> bool:
    """Standardized error output format matching Gate 2 exactly"""
    if details:
        print(f"❌ {path}: [{rule_id}] {RULES[rule_id]}: {details}")
    else:
        print(f"❌ {path}: [{rule_id}] {RULES[rule_id]}")
    return False


def get_artifact_files() -> list[str]:
    """Shared file filtering logic - exactly identical to Gate 2"""
    files = []
    for f in os.listdir(CANON_DIR):
        full_path = os.path.join(CANON_DIR, f)
        if not os.path.isfile(full_path):
            continue
        if not f.endswith(".md"):
            continue
        if EXCLUDE_PATTERN.match(f):
            continue
        if ID_PATTERN.match(os.path.splitext(f)[0]):
            files.append(full_path)
    return files


def main() -> None:
    if not os.path.isdir(CANON_DIR):
        print(f"❌ {CANON_DIR}/ directory not found")
        sys.exit(1)

    files = get_artifact_files()
    if not files:
        print("⚠️  No canon artifacts found")
        sys.exit(0)

    id_to_file = {}
    all_valid = True

    # -------------------------------------------------------------------------
    # Pass 1: Collect all valid artifact IDs & check for duplicates
    # -------------------------------------------------------------------------
    print("🔍 Pass 1: Collecting artifact IDs")
    for filepath in files:
        with open(filepath, "r") as f:
            content = f.read()

        fm = extract_frontmatter(content)
        if not fm:
            continue

        try:
            data = yaml.safe_load(fm)
        except Exception:
            continue

        if not data or 'id' not in data:
            continue

        artifact_id = data['id']

        # CANON-011: Duplicate ID check
        if artifact_id in id_to_file:
            if not error(filepath, "CANON-011", f"{artifact_id} already exists at {id_to_file[artifact_id]}"):
                all_valid = False
            if FAIL_FAST:
                print(f"\n⏹️  FAIL_FAST enabled - exiting on first failure")
                sys.exit(1)

        id_to_file[artifact_id] = filepath

    # -------------------------------------------------------------------------
    # Pass 2: Validate all cross references
    # -------------------------------------------------------------------------
    print("\n🔍 Pass 2: Validating cross references")
    referenced_ids = set()

    for filepath in files:
        with open(filepath, "r") as f:
            content = f.read()

        # Ignore references inside code blocks
        content = strip_code_blocks(content)
        matches = REF_PATTERN.findall(content)

        for ref_id in matches:
            referenced_ids.add(ref_id)

            # CANON-012: Broken reference check
            if ref_id not in id_to_file:
                if not error(filepath, "CANON-012", ref_id):
                    all_valid = False
                if FAIL_FAST:
                    print(f"\n⏹️  FAIL_FAST enabled - exiting on first failure")
                    sys.exit(1)

    # -------------------------------------------------------------------------
    # Pass 3: Check for orphaned artifacts
    # -------------------------------------------------------------------------
    print("\n🔍 Pass 3: Orphan detection")
    for artifact_id in sorted(id_to_file.keys()):
        if artifact_id not in referenced_ids:
            print(f"⚠️  [{artifact_id}] Orphan artifact (not referenced): {id_to_file[artifact_id]}")

    if not all_valid:
        print(f"\n❌ Semantic validation failed. Fix errors above and retry.")
        sys.exit(1)

    print("\n✅ All semantic checks passed")
    sys.exit(0)


if __name__ == "__main__":
    main()