#!/usr/bin/env python3
import csv
import hashlib
import json
import re
import sys
from datetime import datetime, timezone
from pathlib import Path

VALID_MODES = {"must-not-contain", "must-contain", "advisory"}

def safe_id(value: str) -> str:
    return re.sub(r"[^A-Za-z0-9._-]+", "-", value).strip("-") or "claim"

def sha256_file(path: Path) -> str | None:
    if not path.exists() or not path.is_file():
        return None
    return hashlib.sha256(path.read_bytes()).hexdigest()

def evaluate_claim(row: dict) -> dict:
    claim_id = row["claim_id"].strip()
    mode = row["mode"].strip()
    target = row["target"].strip()
    pattern = row["pattern"]
    description = row["description"].strip()

    if mode not in VALID_MODES:
        return {
            "request_id": claim_id,
            "mode": mode,
            "status": "fail",
            "summary": f"Invalid claim mode: {mode}",
            "description": description,
            "target": target,
            "pattern": pattern,
            "risk": "high",
        }

    path = Path(target)
    exists = path.exists() and path.is_file()
    content = path.read_text(errors="replace") if exists else ""

    try:
        matched = bool(re.search(pattern, content, flags=re.MULTILINE))
        regex_error = None
    except re.error as exc:
        matched = False
        regex_error = str(exc)

    if regex_error:
        status = "fail"
        summary = f"Invalid regex: {regex_error}"
        risk = "high"
    elif mode == "must-not-contain":
        status = "fail" if matched else "pass"
        summary = (
            f"Claim failed: forbidden pattern found in {target}"
            if matched
            else f"Claim passed: forbidden pattern absent from {target}"
        )
        risk = "medium" if matched else "low"
    elif mode == "must-contain":
        status = "pass" if matched else "fail"
        summary = (
            f"Claim passed: required pattern found in {target}"
            if matched
            else f"Claim failed: required pattern missing from {target}"
        )
        risk = "low" if matched else "medium"
    else:
        status = "warn" if matched else "pass"
        summary = (
            f"Advisory matched in {target}"
            if matched
            else f"Advisory pattern not found in {target}"
        )
        risk = "info"

    return {
        "request_id": claim_id,
        "mode": mode,
        "status": status,
        "summary": summary,
        "description": description,
        "target": target,
        "target_exists": exists,
        "target_sha256": sha256_file(path),
        "pattern": pattern,
        "matched": matched,
        "risk": risk,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "authority_boundary": {
            "wallet_signing": False,
            "chain_mutation": False,
            "deployment": False,
            "funds_movement": False,
            "governance_execution": False,
            "billing_activation": False,
            "requires_human_authorization": True,
        },
    }

def main() -> int:
    bundle_id = sys.argv[1] if len(sys.argv) > 1 else "claim-mode-scan"
    claims_path = Path(sys.argv[2]) if len(sys.argv) > 2 else Path("claims/forge-core.claims.tsv")

    if not claims_path.exists():
        print(f"ERROR: claims file not found: {claims_path}", file=sys.stderr)
        return 2

    examples_dir = Path("examples")
    bundles_dir = examples_dir / "bundles"
    examples_dir.mkdir(exist_ok=True)
    bundles_dir.mkdir(parents=True, exist_ok=True)

    packets = []

    with claims_path.open(newline="") as f:
        reader = csv.DictReader(f, delimiter="\t")
        required = {"claim_id", "mode", "target", "pattern", "description"}
        missing = required - set(reader.fieldnames or [])
        if missing:
            print(f"ERROR: claims file missing columns: {sorted(missing)}", file=sys.stderr)
            return 2

        for row in reader:
            if not row.get("claim_id", "").strip():
                continue

            packet = evaluate_claim(row)
            packets.append(packet)

            sid = safe_id(packet["request_id"])
            json_path = examples_dir / f"verification-packet-{sid}.json"
            md_path = examples_dir / f"verification-packet-{sid}.md"

            json_path.write_text(json.dumps(packet, indent=2, sort_keys=True) + "\n")

            md_path.write_text(
                "\n".join([
                    f"# Verification Packet: {packet['request_id']}",
                    "",
                    f"- Mode: `{packet['mode']}`",
                    f"- Status: `{packet['status']}`",
                    f"- Target: `{packet['target']}`",
                    f"- Description: {packet['description']}",
                    f"- Summary: {packet['summary']}",
                    f"- Matched: `{packet['matched']}`",
                    f"- Risk: `{packet['risk']}`",
                    "",
                    "## Authority Boundary",
                    "",
                    "This packet does not authorize wallet signing, deployment, funds movement, governance execution, billing activation, or chain mutation.",
                    "",
                ]) + "\n"
            )

            print(f"{packet['request_id']} {packet['mode']} {packet['status']}")

    bundle_path = bundles_dir / f"{safe_id(bundle_id)}.json"
    bundle_path.write_text(json.dumps(packets, indent=2, sort_keys=True) + "\n")

    digest = hashlib.sha256(bundle_path.read_bytes()).hexdigest()
    digest_path = bundle_path.with_suffix(bundle_path.suffix + ".sha256")
    digest_path.write_text(f"{digest}  {bundle_path.name}\n")

    failures = [p for p in packets if p["status"] == "fail"]
    warnings = [p for p in packets if p["status"] == "warn"]

    print(f"Generated bundle: {bundle_path}")
    print(f"Generated digest: {digest_path}")
    print(f"Claims bundled: {len(packets)}")
    print(f"Warnings: {len(warnings)}")
    print(f"Failures: {len(failures)}")

    return 1 if failures else 0

if __name__ == "__main__":
    raise SystemExit(main())
