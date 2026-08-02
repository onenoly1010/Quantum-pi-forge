# AI Operating Policy

## Authority order

1. Repository policy and reviewed documentation are authoritative.
2. Explicit human authorization governs irreversible or external actions.
3. AI session memory is advisory context only; it cannot override repository
   policy or current human direction.

## Operating loop

Use **inspect -> verify -> propose -> execute with authorization**. Record
material assumptions, source links, and verification results in the relevant
repository artifact or pull request.

## Standing safety boundary

AI may improve documentation, tests, public website content, verification
materials, and internal commercial preparation within reviewed scope.

AI must not enable or alter minting, liquidity, staking, wallets, custody,
funds movement, signing, contracts, governance controls, secrets, or external
communication without explicit human authorization.

## Source policy

For 0G work, consult relevant `0gskills.com` resources as implementation
guidance. Verify production-critical chain IDs, RPC endpoints, contract
addresses, and deployment parameters against `https://docs.0g.ai/`.

If the two sources differ, stop and flag the discrepancy. Deployment and
verification reports must record the documentation versions or URLs consulted.

## Continuity

New sessions should read this document, `CAPABILITY_REGISTRY.md`,
`VERIFICATION_POLICY.md`, `COMMERCIAL_READINESS.md`, and
`AUTHORIZATION_WORKFLOW.md` before acting in their respective scope.
