# Ledger API Python Audit Hardening v1

Created: 2026-06-17T16:58:33Z

## Status

PASS — ledger-api Python dependency vulnerabilities were remediated in a non-executing security hardening lane.

## Scope

- `ledger-api/requirements.txt`

## Changes

- `fastapi==0.104.1` -> `fastapi>=0.115.0`
- `pydantic==2.5.0` -> `pydantic>=2.5.0`
- `python-dotenv==1.0.0` -> `python-dotenv>=1.2.2`
- `email-validator==2.1.0` -> `email-validator>=2.1.1`
- Removed `python-jose[cryptography]==3.3.0`
- Retained `pyjwt==2.13.0`

## Verification

- `python -m pip install -r ledger-api/requirements.txt`
- `pip-audit -r ledger-api/requirements.txt -f json`
- Result: 0 vulnerabilities

## Governance posture

- Protocol Interface Freeze preserved.
- No deployment attempted.
- No transaction broadcast.
- No funding attempted.
- No approvals attempted.
- No liquidity attempted.

## Receipt

`receipts/security/ledger-api-python-audit-hardening-v1.json`
