#!/usr/bin/env python3
"""
QPF Frozen Triple — Standalone Verifier
=======================================
One command that recomputes QPF IDs from frozen artifacts WITHOUT cloning
the QPF monorepo. Implements the actual QPF derivation algorithm (JCS-RFC8785
canonicalization + SHA-256) in pure Python 3 stdlib.

Algorithms are taken verbatim from:
  - src/verification/result-id.js  -> deriveResultId (qpfv0)
  - src/verification/package.js    -> buildPackageManifest (qpfpkg0)
  - src/verification/canonical.js  -> JCS-RFC8785 canonicalizeToBytes

Usage:
    python3 verify.py
    # or
    ./verify.py

Requires only Python 3.8+ (standard library). No Node.js, no git, no clone.
"""

from __future__ import annotations

import hashlib
import json
import pathlib
import sys
import urllib.request

BASE = pathlib.Path(__file__).resolve().parent


# -- Primitives -------------------------------------------------------------

def sha256_hex(data: bytes) -> str:
    """Lowercase hex SHA-256 of raw bytes."""
    return hashlib.sha256(data).hexdigest()


def jcs_canonicalize(obj: object) -> bytes:
    """
    JCS-RFC8785 canonical JSON serialization.

    Matches QPF's canonicalizeToBytes (src/verification/canonical.js):
      - object keys sorted by Unicode code point (Python sort_keys=True)
      - no insignificant whitespace (separators=(',', ':'))
      - ECMAScript JSON string/number forms
      - raw UTF-8 (ensure_ascii=False so non-ASCII chars like ellipsis are not escaped)
    """
    canonical_str = json.dumps(
        obj, sort_keys=True, separators=(",", ":"), ensure_ascii=False
    )
    return canonical_str.encode("utf-8")


def digest_sha256(data: bytes) -> dict:
    """QPF-style digest object: { alg, hex }."""
    return {"alg": "sha256", "hex": sha256_hex(data)}


# -- QPF derivation algorithms (verbatim from src/verification/) ------------

def derive_result_id(result: dict) -> str:
    """
    qpfv0 = "qpfv0:" + sha256(JCS(stable_result_fields))

    Stable included: spec, target, level_requested, level_achieved, status,
    checks, verifier, evidence_binding (when present).

    Excluded: timestamp (wall-clock), summary (narrative),
    does_not_authorize (static policy).
    """
    stable = {
        "spec": result["spec"],
        "target": result["target"],
        "level_requested": result["level_requested"],
        "level_achieved": result["level_achieved"],
        "status": result["status"],
        "checks": result["checks"],
        "verifier": result["verifier"],
    }
    if result.get("evidence_binding") is not None:
        stable["evidence_binding"] = result["evidence_binding"]
    return f"qpfv0:{sha256_hex(jcs_canonicalize(stable))}"


def derive_package_id(
    result_id: str,
    artifact_digest: dict,
    receipt_digest: dict,
    result_digest: dict,
) -> str:
    """
    qpfpkg0 = "qpfpkg0:" + sha256(JCS({
      result_id,
      artifact_digest:        { alg, hex },
      receipt_digest:         { alg, hex },
      verification_result_digest: { alg, hex },
    }))
    """
    id_input = {
        "result_id": result_id,
        "artifact_digest": artifact_digest,
        "receipt_digest": receipt_digest,
        "verification_result_digest": result_digest,
    }
    return f"qpfpkg0:{sha256_hex(jcs_canonicalize(id_input))}"


# -- Verifier ---------------------------------------------------------------

def main() -> None:
    errors: list[str] = []

    # --- Load frozen files ---
    pin = json.loads((BASE / "pin.json").read_text())
    manifest = json.loads((BASE / "manifest.json").read_text())
    result = json.loads((BASE / "expected-result.json").read_text())

    artifact_bytes = (BASE / "artifact.bin").read_bytes()
    receipt_bytes = (BASE / "receipt.json").read_bytes()
    result_bytes = (BASE / "expected-result.json").read_bytes()

    print("=== QPF Frozen Triple -- Standalone Verification ===")
    print()

    # --- Step 1: Verify artifact (against pin + independent fetch) ---
    print("[1] Artifact: OpenZeppelin Ownable.sol @ 932fddf (v5.0.0)")
    artifact_hash = sha256_hex(artifact_bytes)
    print(f"    Local artifact SHA-256: {artifact_hash}")
    print(f"    Pinned SHA-256:          {pin['sha256']}")
    if artifact_hash == pin["sha256"]:
        print("    OK: matches pin")
    else:
        errors.append("artifact hash does not match pin")
        print("    FAIL")

    # Independent fetch cross-check (no QPF involved)
    print("    Independent fetch from GitHub raw content...")
    url = pin["source_url"]
    try:
        with urllib.request.urlopen(url, timeout=15) as resp:
            fetched = resp.read()
        fetched_hash = sha256_hex(fetched)
        print(f"    Fetched SHA-256:         {fetched_hash}")
        print(f"    Fetched bytes:           {len(fetched)}")
        if fetched_hash == pin["sha256"] and fetched == artifact_bytes:
            print("    OK: independent fetch matches pin AND packaged artifact")
        else:
            errors.append("independent fetch mismatch")
            print("    FAIL: fetched artifact differs from package")
    except Exception as e:
        print(f"    (network unavailable: {e})")
        print("    Using locally packaged artifact only")
    print()

    # --- Step 2: Verify frozen file integrity ---
    print("[2] Frozen file integrity (hashes against manifest.json)")
    receipt_hash = sha256_hex(receipt_bytes)
    result_hash = sha256_hex(result_bytes)
    exp_receipt_hash = manifest["files"]["receipt.json"]["sha256"]
    exp_result_hash = manifest["files"]["expected-result.json"]["sha256"]

    print(f"    receipt.json SHA-256:         {receipt_hash}")
    print(f"    expected:                     {exp_receipt_hash}")
    if receipt_hash == exp_receipt_hash:
        print("    OK: receipt hash matches manifest")
    else:
        errors.append("receipt hash does not match manifest")
        print("    FAIL")

    print(f"    expected-result.json SHA-256: {result_hash}")
    print(f"    expected:                     {exp_result_hash}")
    if result_hash == exp_result_hash:
        print("    OK: result hash matches manifest")
    else:
        errors.append("result hash does not match manifest")
        print("    FAIL")
    print()

    # --- Step 3: Verify evidence_binding consistency ---
    print("[3] Evidence binding (result references actual file digests)")
    eb = result.get("evidence_binding", {})
    eb_art = eb.get("artifact_digest", {}).get("hex", "")
    eb_rec = eb.get("receipt_digest", {}).get("hex", "")

    print(f"    evidence_binding.artifact_digest: {eb_art}")
    print(f"    actual artifact SHA-256:           {artifact_hash}")
    if eb_art == artifact_hash:
        print("    OK: artifact binding verified")
    else:
        errors.append("evidence_binding artifact_digest mismatch")
        print("    FAIL")

    print(f"    evidence_binding.receipt_digest: {eb_rec}")
    print(f"    actual receipt SHA-256:           {receipt_hash}")
    if eb_rec == receipt_hash:
        print("    OK: receipt binding verified")
    else:
        errors.append("evidence_binding receipt_digest mismatch")
        print("    FAIL")
    print()

    # --- Step 4: Derive qpfv0 (result_id) ---
    print("[4] Derive qpfv0 = sha256(JCS(stable_result_fields))")
    derived_qpfv0 = derive_result_id(result)
    expected_qpfv0 = manifest["expected_ids"]["qpfv0"]
    print(f"    derived qpfv0:  {derived_qpfv0}")
    print(f"    expected:        {expected_qpfv0}")
    if derived_qpfv0 == expected_qpfv0:
        print("    OK: qpfv0 reproduces the published QPF identity")
    else:
        errors.append("qpfv0 mismatch")
        print("    FAIL")
    print()

    # --- Step 5: Derive qpfpkg0 (package_id) ---
    print("[5] Derive qpfpkg0 = sha256(JCS({result_id, 3 digests}))")
    pkg_id = derive_package_id(
        derived_qpfv0,
        digest_sha256(artifact_bytes),
        digest_sha256(receipt_bytes),
        digest_sha256(result_bytes),
    )
    expected_pkg = manifest["expected_ids"]["qpfpkg0"]
    print(f"    derived qpfpkg0: {pkg_id}")
    print(f"    expected:         {expected_pkg}")
    if pkg_id == expected_pkg:
        print("    OK: qpfpkg0 reproduces the published QPF package identity")
    else:
        errors.append("qpfpkg0 mismatch")
        print("    FAIL")
    print()

    # --- Summary ---
    print("=== SUMMARY ===")
    if errors:
        print(f"FAIL -- {len(errors)} check(s) failed:")
        for e in errors:
            print(f"  - {e}")
        sys.exit(1)
    else:
        print("ALL CHECKS PASSED")
        print()
        print(f"  qpfv0    {derived_qpfv0}")
        print(f"  qpfpkg0  {pkg_id}")
        print()
        print("  A stranger reproduced QPF's own verification identity")
        print("  from the published artifact + receipt + result -- no monorepo clone required.")


if __name__ == "__main__":
    main()
