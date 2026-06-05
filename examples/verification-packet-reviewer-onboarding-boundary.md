# Forge Verification Packet: reviewer-onboarding-boundary
**Claim:** Reviewer onboarding does not instruct wallet signing, transaction sending, or secret exposure

**File:** docs/REVIEWER_ONBOARDING.md

**Status:** fail

## Evidence
Pattern `(personal_sign|eth_sign|eth_sendTransaction|sendTransaction|wallet_requestPermissions|private key|seed phrase)` searched in `docs/REVIEWER_ONBOARDING.md`.

Result: Matches found.

## What was NOT checked
- Runtime execution
- External or dynamically loaded scripts
- Minified bundles
- Semantic review beyond the supplied grep pattern

**Risk Level:** medium

**Authority Boundary:** Read-only inspection. No signing, deployment, funds movement, governance execution, or chain mutation.

## Reproduce
```bash
grep -E -i -n "(personal_sign|eth_sign|eth_sendTransaction|sendTransaction|wallet_requestPermissions|private key|seed phrase)" "docs/REVIEWER_ONBOARDING.md"
```
