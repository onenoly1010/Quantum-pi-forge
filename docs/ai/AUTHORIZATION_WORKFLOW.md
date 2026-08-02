# Authorization Workflow

## Default

Inspect and verify without side effects. Prepare drafts, patches, reports, and
pull requests within the approved scope.

## Human approval required

- Merge to protected production branches.
- Production deployment.
- External messages, applications, agreements, quotes, or representations.
- Financial commitments or transactions.
- Any contract, wallet, protocol-economics, staking, liquidity, minting, or
  governance action.
- Secret creation, rotation, exposure, or repository-security changes.

## Before execution

State the intended action, affected scope, validation evidence, and rollback
path. Obtain explicit approval for the exact action when required.

## After execution

Record the commit or PR, validation result, deployment/public evidence where
applicable, and any remaining blocker. Do not treat a successful technical
check as permission for a separate external or financial action.
