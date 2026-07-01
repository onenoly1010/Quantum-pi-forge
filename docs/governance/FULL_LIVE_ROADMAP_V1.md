# Quantum Pi Forge — Full Live Roadmap v1

## Current State

Public onboarding readiness is merged to main. PR #514 published the public onboarding pages. PR #515 sealed the post-merge closure receipt. Local build and evidence verification pass. Guardian Safe exists. No public staking, minting, liquidity provision, wallet signing, private-key access, contract deployment, or transaction broadcast is implied by this roadmap.

## Phase 1 — Activation Readiness Snapshot
- Create a sealed readiness snapshot from current main.
- Record current commit, merged PRs, build status, evidence status, and execution boundaries.
- Merge through protected PR path.

## Phase 2 — Public Deployment Observation
- Confirm homepage and public onboarding pages are live.
- Confirm builder, deployed-addresses, and onboarding-status pages load.
- Confirm public claims match verified state.
- Seal public observation receipt.

## Phase 3 — Explorer Verification
- Confirm token, registry, heartbeat, DEX factory, DEX pair, and Guardian Safe on explorer.
- Add explorer links to deployed-addresses page.
- Seal explorer verification receipt.

## Phase 4 — Guardian Governance Hardening
- Confirm Safe threshold and owner count without exposing owner addresses.
- Confirm social recovery remains not production-authorized.
- Document actions requiring Safe approval.

## Phase 5 — Contract Ownership / Admin Audit
- Map owner/admin authority for all deployed contracts.
- Identify any deployer-held authority.
- Decide whether any ownership should transfer to Guardian Safe.

## Phase 6 — Safe Ownership Transfer Preflight
- Generate unsigned transfer plan only.
- Review calldata.
- Seal receipt proving no broadcast occurred.

## Phase 7 — Human Approval Checkpoint
- Require explicit approval per lane: ownership transfer, verification, wallet connect, staking, minting, liquidity, treasury funding, and public announcement.

## Phase 8 — Optional Ownership Transfer Execution
- Execute only if approved.
- Confirm transaction hash and new owner/admin state.
- Seal execution receipt.

## Phase 9 — Public Read-only Status Dashboard
- Publish read-only status for chain, contracts, Guardian Safe, liquidity, minting, staking, and latest verified state.
- No wallet signing.

## Phase 10 — Wallet Connect Preflight
- Add chain detection and connected-address display.
- No automatic signatures, approvals, or transactions.
- Test MetaMask and Trezor-backed accounts.

## Phase 11 — Participant Intake
- Publish plain-language participation page.
- Add anti-scam warnings, official addresses, and seed phrase warnings.

## Phase 12 — Staking Preflight
- Confirm staking contract/design, rewards, approval flow, emergency behavior, admin controls, and Safe control.

## Phase 13 — Minting Preflight
- Confirm mint contract, price, supply, metadata, royalties, admin controls, and UI boundaries.

## Phase 14 — Liquidity Preflight
- Confirm token, paired asset, router/factory, pair, amount, treasury source, slippage, LP recipient, and LP custody/lock policy.

## Phase 15 — Treasury Readiness
- Define treasury wallet/Safe, signer policy, funding source, spending categories, emergency pause, and accounting receipt format.

## Phase 16 — Limited Canary Launch
- Enable one feature only with limited amounts and limited participants.
- Monitor, record, and pause if needed.

## Phase 17 — Public Live Launch
- Public status says live.
- Official addresses are updated.
- Guardian controls are verified.
- Monitoring is active.
- Launch receipt is sealed.

## Phase 18 — Post-launch Monitoring
- Monitor uptime, RPC, events, treasury, staking, minting, liquidity, issues, and scams.
- Publish periodic status receipts.

## Phase 19 — Expansion
- Add builders, docs, analytics, grant status, partner pages, API docs, SDK examples, AI-agent examples, dashboards, and governance proposals.

## Non-Negotiable Boundary

No wallet signing, staking, minting, liquidity provision, contract deployment, private-key access, or transaction broadcast occurs from this roadmap document. Each live-action lane requires its own explicit human approval and receipt.
