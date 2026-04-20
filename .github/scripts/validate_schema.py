#!/usr/bin/env python3
"""
Gate 2: Canon Artifact Schema Validation Engine
Rule-based audit ready validation system with traceable identifiers,
severity levels, and structured machine parseable output.

This is no longer a simple validator script - this is CI infrastructure.
"""

import sys
import os
import re
import yaml
import json
from dataclasses import dataclass
from typing import List, Literal, Optional
from datetime import datetime

# -----------------------------------------------------------------------------
# CORE ENGINE TYPES
# -----------------------------------------------------------------------------
Severity = Literal["INFO", "WARN", "ERROR", "FATAL"]

@dataclass
class RuleViolation:
    rule_id: str
    severity: Severity
    file: str
    message: str


# -----------------------------------------------------------------------------
# CONFIGURATION
# -----------------------------------------------------------------------------
CANON_DIR = "canon"

# FAIL_FAST: Exit immediately on first ERROR/FATAL when enabled
FAIL_FAST = os.environ.get("FAIL_FAST", "1").lower() in ("1", "true", "yes")

# JSON_OUTPUT: Emit structured JSON instead of human readable output
JSON_OUTPUT = os.environ.get("JSON_OUTPUT", "0").lower() in ("1", "true", "yes")

# Precompiled regex patterns
EXCLUDE_PATTERN = re.compile(r'^(INDEX|README|README-TODO|DRAFT|EXAMPLE|TEMPLATE)', re.IGNORECASE)
ID_PATTERN = re.compile(r'^[A-Z]+-\d{3,}$')
VERSION_PATTERN = re.compile(r'^\d+\.\d+\.\d+$')

DATE_FORMAT = "%Y-%m-%d"

REQUIRED_FIELDS = [
    "id",
    "title",
    "version",
    "status",
    "author",
    "created"
]

VALID_STATUS = {"draft", "final", "deprecated"}


# -----------------------------------------------------------------------------
# RULE DEFINITIONS
# All rules are pure functions that return list of violations
# Rules are stateless, idempotent, and can be reordered independently
# -----------------------------------------------------------------------------

def rule_title_colon_policy(path: str, data: dict, raw: str) -> List[RuleViolation]:
    """CANON-001: Title containing colon must be explicitly quoted"""
    title = data.get("title")
    if isinstance(title, str) and ":" in title and not (title.startswith('"') and title.endswith('"')):
        return [
            RuleViolation(
                rule_id="CANON-001",
                severity="ERROR",
                file=path,
                message="Title contains colon ':' and must be explicitly quoted in YAML frontmatter"
            )
        ]
    return []


def rule_required_fields(path: str, data: dict, raw: str) -> List[RuleViolation]:
    """CANON-002: All required frontmatter fields present"""
    missing = [f for f in REQUIRED_FIELDS if f not in data]
    if missing:
        return [
            RuleViolation(
                rule_id="CANON-002",
                severity="ERROR",
                file=path,
                message=f"Missing required fields: {', '.join(missing)}"
            )
        ]
    return []


def rule_id_format(path: str, data: dict, raw: str) -> List[RuleViolation]:
    """CANON-003: Artifact ID matches required format"""
    artifact_id = data.get("id", "")
    if not ID_PATTERN.match(artifact_id):
        return [
            RuleViolation(
                rule_id="CANON-003",
                severity="ERROR",
                file=path,
                message=f"Invalid ID format '{artifact_id}' (expected PREFIX-###)"
            )
        ]
    return []


def rule_filename_id_binding(path: str, data: dict, raw: str) -> List[RuleViolation]:
    """CANON-004: Frontmatter ID exactly matches filename"""
    name_id = os.path.splitext(os.path.basename(path))[0]
    artifact_id = data.get("id", "")
    if artifact_id != name_id:
        return [
            RuleViolation(
                rule_id="CANON-004",
                severity="ERROR",
                file=path,
                message=f"ID mismatch: frontmatter='{artifact_id}', filename='{name_id}'"
            )
        ]
    return []


def rule_version_format(path: str, data: dict, raw: str) -> List[RuleViolation]:
    """CANON-005: Version is quoted string in semver format"""
    version = data.get("version")
    if not isinstance(version, str):
        return [
            RuleViolation(
                rule_id="CANON-005",
                severity="ERROR",
                file=path,
                message=f"Version must be quoted string (found {type(version).__name__})"
            )
        ]
    if not VERSION_PATTERN.match(version):
        return [
            RuleViolation(
                rule_id="CANON-005",
                severity="ERROR",
                file=path,
                message=f"Invalid version format '{version}' (expected x.y.z)"
            )
        ]
    return []


def rule_status_enum(path: str, data: dict, raw: str) -> List[RuleViolation]:
    """CANON-006: Status is in allowed values"""
    status = data.get("status")
    if status not in VALID_STATUS:
        return [
            RuleViolation(
                rule_id="CANON-006",
                severity="ERROR",
                file=path,
                message=f"Invalid status '{status}' | allowed: {', '.join(sorted(VALID_STATUS))}"
            )
        ]
    return []


def rule_created_date_format(path: str, data: dict, raw: str) -> List[RuleViolation]:
    """CANON-007: Created date is valid ISO format"""
    created = data.get("created", "")
    try:
        datetime.strptime(created, DATE_FORMAT)
    except Exception:
        return [
            RuleViolation(
                rule_id="CANON-007",
                severity="ERROR",
                file=path,
                message=f"Invalid created date '{created}' (expected YYYY-MM-DD)"
            )
        ]
    return []


# -----------------------------------------------------------------------------
# RULE REGISTRY
# Rules execute in the order listed here. Add new rules at the end.
# -----------------------------------------------------------------------------
RULES = [
    rule_title_colon_policy,
    rule_required_fields,
    rule_id_format,
    rule_filename_id_binding,
    rule_version_format,
    rule_status_enum,
    rule_created_date_format
]


# -----------------------------------------------------------------------------
# ENGINE CORE
# -----------------------------------------------------------------------------

def extract_frontmatter(content: str) -> Optional[str]:
    if not content.startswith("---"):
        return None
    parts = content.split("---", 2)
    if len(parts) < 3:
        return None
    return parts[1]


def get_artifact_files() -> List[str]:
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


def run_rules(path: str, raw: str, data: dict) -> List[RuleViolation]:
    violations = []
    for rule in RULES:
        violations.extend(rule(path, data, raw))
        if FAIL_FAST and any(v.severity in ("ERROR", "FATAL") for v in violations):
            break
    return violations


# -----------------------------------------------------------------------------
# OUTPUT FORMATTING
# -----------------------------------------------------------------------------

def print_violation(v: RuleViolation) -> None:
    icon = {
        "INFO": "ℹ️",
        "WARN": "⚠️",
        "ERROR": "❌",
        "FATAL": "⛔"
    }[v.severity]
    print(f"{icon} [{v.rule_id}] {v.file}: {v.message}")


def emit_json_output(violations: List[RuleViolation]) -> None:
    print(json.dumps([
        {
            "rule_id": v.rule_id,
            "severity": v.severity,
            "file": v.file,
            "message": v.message
        } for v in violations
    ], indent=2))


# -----------------------------------------------------------------------------
# MAIN ENTRYPOINT
# -----------------------------------------------------------------------------

def main() -> None:
    if not os.path.isdir(CANON_DIR):
        print(f"❌ {CANON_DIR}/ directory not found")
        sys.exit(1)

    files = get_artifact_files()
    if not files:
        print("⚠️  No canon artifacts found")
        sys.exit(0)

    all_violations = []
    exit_code = 0

    for path in files:
        with open(path, "r") as f:
            content = f.read()

        fm = extract_frontmatter(content)
        if not fm:
            all_violations.append(
                RuleViolation(
                    rule_id="CANON-008",
                    severity="ERROR",
                    file=path,
                    message="Missing or invalid YAML frontmatter boundary"
                )
            )
            if FAIL_FAST:
                break
            continue

        try:
            data = yaml.safe_load(fm)
        except Exception as e:
            all_violations.append(
                RuleViolation(
                    rule_id="CANON-009",
                    severity="ERROR",
                    file=path,
                    message=f"YAML parse failure: {str(e)}"
                )
            )
            if FAIL_FAST:
                break
            continue

        if data is None or not isinstance(data, dict):
            all_violations.append(
                RuleViolation(
                    rule_id="CANON-010",
                    severity="ERROR",
                    file=path,
                    message="Frontmatter is not a valid mapping/object"
                )
            )
            if FAIL_FAST:
                break
            continue

        # Run all validation rules
        violations = run_rules(path, content, data)
        all_violations.extend(violations)

        if FAIL_FAST and any(v.severity in ("ERROR", "FATAL") for v in violations):
            break

    # Determine final exit code
    has_errors = any(v.severity in ("ERROR", "FATAL") for v in all_violations)
    exit_code = 1 if has_errors else 0

    # Output results
    if JSON_OUTPUT:
        emit_json_output(all_violations)
    else:
        for v in all_violations:
            print_violation(v)

        if exit_code != 0:
            print(f"\n❌ Validation failed with {len(all_violations)} violations")
            if FAIL_FAST:
                print(f"⏹️  FAIL_FAST enabled - stopped on first error")
            sys.exit(exit_code)

        print("\n🎉 All schema checks passed")

    sys.exit(exit_code)


if __name__ == "__main__":
    main()