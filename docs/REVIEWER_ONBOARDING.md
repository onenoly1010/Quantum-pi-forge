# Quantum Pi Forge Reviewer Onboarding

## Purpose

This document gives reviewers a direct path to inspect Quantum Pi Forge Core without relying on personal explanation.

The Forge Core is a local-first, evidence-bound verification layer. Its primary product is verified execution truth.

## Authority Boundary

The reviewer flow is read-only.

It does not perform:

- Wallet signing
- Deployment
- Funds movement
- Minting
- Staking
- Governance execution
- Billing activation
- Chain mutation

## Core Files

- `skills/quantum-pi-forge/SKILL.md` — machine-readable capability and refusal boundary
- `docs/economics/SELF_SUSTAINING_FORGE_MODEL.md` — self-sustaining evidence model
- `scripts/forge-evidence-packet.sh` — single-claim evidence packet generator
- `scripts/forge-repo-scan.sh` — multi-claim local scan and bundle generator
- `scripts/forge-serve.sh` — local read-only HTTP verify endpoint
- `examples/bundles/viewer.html` — static bundle viewer
- `.github/workflows/forge-audit.yml` — CI evidence audit gate

## Local Verification

From the repository root:

```bash
chmod +x scripts/*.sh tests/*.sh 2>/dev/null || true
./scripts/forge-repo-scan.sh initial-audit-baseline
```

Expected output:

- `examples/bundles/initial-audit-baseline.json`
- `examples/bundles/initial-audit-baseline.json.sha256`
- `examples/verification-packet-*.json`
- `examples/verification-packet-*.md`

Verify the bundle digest:

```bash
cd examples/bundles
sha256sum -c initial-audit-baseline.json.sha256
```

## View the Bundle

Open:

```text
examples/bundles/viewer.html
```

Then select the generated bundle JSON file.

## Local HTTP Verify Endpoint

Start the read-only local endpoint:

```bash
./scripts/forge-serve.sh 3000
```

In another terminal:

```bash
curl -sS http://127.0.0.1:3000/health | python3 -m json.tool

curl -sS -X POST http://127.0.0.1:3000/api/forge/verify \
  -H "Content-Type: application/json" \
  -d '{"claim_id":"reviewer-wallet-boundary","file":"ceremonial_interface.html","pattern":"(personal_sign|eth_sendTransaction|sendTransaction|wallet_requestPermissions)","description":"No direct wallet signing or transaction-send calls"}' \
  | python3 -m json.tool
```

The server binds to `127.0.0.1` and does not expose wallet, deployment, billing, governance, or chain mutation authority.

## Interpretation Rules

- `pass` means the specific static claim did not find the prohibited pattern.
- `fail` means the claim found the prohibited pattern and should be reviewed before merge.
- `refused` means the Forge correctly refused an unsafe or unauthorized request.
- Static grep claims do not prove runtime safety by themselves.
- Generated evidence should be treated as an audit aid, not as a replacement for expert review.

## Release Boundary

Forge Core v0.1.0 is complete when reviewers can:

1. Clone the repository.
2. Run the local scan.
3. Verify the SHA-256 bundle digest.
4. Inspect the bundle in the HTML viewer.
5. Call the local verify endpoint.
6. Confirm no signing, deployment, billing, governance, or chain mutation occurred.
