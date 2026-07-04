# QPF Audit Readiness Permission Map and Threat Model v1

Status: EVIDENCE_ONLY_DRAFT
Created: 2026-07-04T05:21:32Z

## Purpose
This document strengthens the QPF valuation and audit-readiness lane by converting live gate receipts into a reviewer-readable permission map and threat model. It does not authorize financial activation.

## Permission map
| Surface | Current authority posture | Activation posture | Evidence source |
|---|---|---|---|
| Public mint | Guardian/governance gated | Not open unless controlled mint verification and authorization receipts permit it | receipts/governance and valuation evidence |
| Liquidity | Governance gated | Not authorized | receipts/governance and valuation evidence |
| Staking | Governance gated | Not authorized | receipts/governance and valuation evidence |
| Bridge | Governance gated | Not authorized | receipts/governance and valuation evidence |
| Guardian Safe | Designated governance authority | Required for protected actions | live address evidence where present |
| Deployer wallet | Historical deployment authority only | Not sufficient for downstream public activation | deployment/address evidence |
| Local AI / observer | Review and evidence support | No private key, no signing, no broadcast | runtime and governance receipts |

## Threat model
| Threat | Risk | Current mitigation | FMV relevance |
|---|---|---|---|
| Unauthorized mint opening | Public mint could create financial/legal exposure | Mint policy and authorization gates remain required | Stronger investor/auditor confidence |
| Premature liquidity activation | Market manipulation or uncontrolled trading risk | Liquidity explicitly not authorized | Protects valuation from token-first discount |
| Premature staking/yield activation | Yield promises could create compliance/security risk | Staking explicitly not authorized | Preserves audit-first posture |
| Bridge activation risk | Cross-chain bridge exploits are high-impact | Bridge explicitly not authorized | Reduces catastrophic technical risk |
| Guardian authority confusion | Wrong signer or deployer mistaken for governance | Safe/guardian evidence lane separates roles | Improves diligence clarity |
| AI agent overreach | Local agent could appear to control funds or signing | Observer/evidence-only posture, no private-key access | Preserves human-rooted sovereignty |
| Valuation overclaim | Unsupported FMV claim could damage credibility | FMV memo uses scenario bands and evidence requirements | Makes valuation defensible |

## Live receipt evidence found

### receipts/contracts/safe-ownership-transfer-preflight-phase-6-v1.json
- receipt: None
- status: None
- matched terms: 0x75995EC0fdf881189850aeD864cB3f43c0DFCb58, 0x67aD7169184581f23D1E10B39d4eb4e98293E87a, 0x5E50b92E57e854659f7D98c733088aABd551C49F, 0x8d088B88219D072aB035502065ee2410c2cb4389

### receipts/execution/first-controlled-mint-verification-v1.json
- receipt: first-controlled-mint-verification-v1
- status: CONTROLLED_MINT_VERIFIED
- matched terms: 0x75995EC0fdf881189850aeD864cB3f43c0DFCb58, 0x67aD7169184581f23D1E10B39d4eb4e98293E87a, 0x335651BD160fDA89C9E7A095dF9Dc1BB9f3cF4DC

### receipts/execution/v2-first-pair-live-createpair-execution-v1.json
- receipt: None
- status: LIVE_CREATEPAIR_EXECUTED
- matched terms: 0x335651BD160fDA89C9E7A095dF9Dc1BB9f3cF4DC

### receipts/execution/v2-full-dex-deployment-execution-v1.json
- receipt: v2-full-dex-deployment-execution-v1
- status: success
- matched terms: 0x335651BD160fDA89C9E7A095dF9Dc1BB9f3cF4DC

### receipts/governance/ai-inner-docs-improvement-lane-closure-v1.json
- receipt: ai-inner-docs-improvement-lane-closure-v1
- status: SEALED
- matched terms: AWAITING_GUARDIAN_ADDRESS

### receipts/governance/ai-inner-docs-improvement-lane-v1.json
- receipt: ai-inner-docs-improvement-lane-v1
- status: OPEN
- matched terms: AWAITING_GUARDIAN_ADDRESS

### receipts/governance/bridge-policy-readiness-v1.json
- receipt: bridge-policy-readiness-v1
- status: BRIDGE_NOT_AUTHORIZED
- matched terms: BRIDGE_NOT_AUTH

### receipts/governance/controlled-mint-approval-and-stake-risk-v1.json
- receipt: controlled-mint-approval-and-stake-risk-v1
- status: CONTROLLED_MINT_APPROVAL_REQUIRED
- matched terms: 0x8d088B88219D072aB035502065ee2410c2cb4389

### receipts/governance/current-vs-historical-activation-status-index-v1.json
- receipt: None
- status: SEALED
- matched terms: AWAITING_GUARDIAN_ADDRESS

### receipts/governance/external-guardian-assistance-required-v1.json
- receipt: external-guardian-assistance-required-v1
- status: EXTERNAL_GUARDIAN_ASSISTANCE_REQUIRED
- matched terms: 0x8d088B88219D072aB035502065ee2410c2cb4389

### receipts/governance/guardian-authority-reconciliation-v1.json
- receipt: guardian-authority-reconciliation-v1
- status: GUARDIAN_AUTHORITY_RECONCILED
- matched terms: 0x8d088B88219D072aB035502065ee2410c2cb4389

### receipts/governance/guardian-completion-acceptance-v1.json
- receipt: guardian-completion-acceptance-v1
- status: GUARDIAN_ACCEPTED_AND_VERIFIED
- matched terms: 0x8d088B88219D072aB035502065ee2410c2cb4389

### receipts/governance/guardian-controlled-mint-authorization-v1.json
- receipt: guardian-controlled-mint-authorization-v1
- status: AUTHORIZATION_DEFINED_NOT_YET_GRANTED
- matched terms: 0x67aD7169184581f23D1E10B39d4eb4e98293E87a, 0x8d088B88219D072aB035502065ee2410c2cb4389

### receipts/governance/guardian-governance-readiness-v1.json
- receipt: None
- status: None
- matched terms: 0x8d088B88219D072aB035502065ee2410c2cb4389

### receipts/governance/guardian-signature-recovery-required-v1.json
- receipt: guardian-signature-recovery-required-v1
- status: SIGNATURE_RECOVERY_REQUIRED
- matched terms: SIGNATURE_RECOVERY_REQUIRED, 0x8d088B88219D072aB035502065ee2410c2cb4389

### receipts/governance/guardian-ux-recovery-redesign-required-v1.json
- receipt: guardian-ux-recovery-redesign-required-v1
- status: GUARDIAN_UX_RECOVERY_REDESIGN_REQUIRED
- matched terms: 0x8d088B88219D072aB035502065ee2410c2cb4389

### receipts/governance/human-balance-activation-v1.json
- receipt: human-balance-activation-v1
- status: NON_ZERO_BALANCES_EXTRACTED_FOR_HUMAN_CLASSIFICATION
- matched terms: 0x8d088B88219D072aB035502065ee2410c2cb4389, 0x335651BD160fDA89C9E7A095dF9Dc1BB9f3cF4DC

### receipts/governance/human-balance-map-v1.json
- receipt: human-balance-map-v1
- status: None
- matched terms: 0x75995EC0fdf881189850aeD864cB3f43c0DFCb58, 0x67aD7169184581f23D1E10B39d4eb4e98293E87a, 0x5E50b92E57e854659f7D98c733088aABd551C49F, 0x8d088B88219D072aB035502065ee2410c2cb4389, 0x335651BD160fDA89C9E7A095dF9Dc1BB9f3cF4DC

### receipts/governance/liquidity-approval-command-hash-blocked-v1.json
- receipt: None
- status: APPROVAL_COMMAND_HASH_BLOCKED_UNTIL_FUNDED
- matched terms: 0x335651BD160fDA89C9E7A095dF9Dc1BB9f3cF4DC

### receipts/governance/liquidity-funding-plan-v1.json
- receipt: None
- status: LIQUIDITY_FUNDING_PLAN_REQUIRED_NO_EXECUTION
- matched terms: 0x335651BD160fDA89C9E7A095dF9Dc1BB9f3cF4DC

### receipts/governance/liquidity-policy-readiness-v1.json
- receipt: liquidity-policy-readiness-v1
- status: LIQUIDITY_NOT_AUTHORIZED
- matched terms: LIQUIDITY_NOT_AUTHORIZED

### receipts/governance/liquidity-readiness-preflight-v1.json
- receipt: None
- status: LIQUIDITY_READINESS_PREFLIGHT_READ_ONLY_COMPLETE
- matched terms: 0x335651BD160fDA89C9E7A095dF9Dc1BB9f3cF4DC

### receipts/governance/local-ai-agent-runtime-inventory-v1.json
- receipt: local-ai-agent-runtime-inventory-v1
- status: SEALED
- matched terms: AWAITING_GUARDIAN_ADDRESS

### receipts/governance/official-0g-building-docs-reference-v1.json
- receipt: official-0g-building-docs-reference-v1
- status: SEALED
- matched terms: AWAITING_GUARDIAN_ADDRESS

### receipts/governance/phase-13-controlled-mint-authorization-request-v1.json
- receipt: phase-13-controlled-mint-authorization-request-v1
- status: AWAITING_HUMAN_DECISIONS_AND_GUARDIAN_APPROVAL
- matched terms: 0x75995EC0fdf881189850aeD864cB3f43c0DFCb58, 0x67aD7169184581f23D1E10B39d4eb4e98293E87a, 0x8d088B88219D072aB035502065ee2410c2cb4389

### receipts/governance/phase-13-controlled-mint-final-authorization-v1.json
- receipt: phase-13-controlled-mint-final-authorization-v1
- status: PRE_EXECUTION_AUTHORIZATION_SEALED_WALLET_ACTION_NOT_YET_AUTHORIZED
- matched terms: 0x75995EC0fdf881189850aeD864cB3f43c0DFCb58, 0x67aD7169184581f23D1E10B39d4eb4e98293E87a, 0x335651BD160fDA89C9E7A095dF9Dc1BB9f3cF4DC

### receipts/governance/phase-13-controlled-mint-human-decisions-v1.json
- receipt: phase-13-controlled-mint-human-decisions-v1
- status: HUMAN_DECISIONS_RECORDED_EXECUTION_NOT_AUTHORIZED
- matched terms: 0x335651BD160fDA89C9E7A095dF9Dc1BB9f3cF4DC

### receipts/governance/phase-13-controlled-mint-parameter-candidate-v1.json
- receipt: phase-13-controlled-mint-parameter-candidate-v1
- status: PARAMETERS_CANDIDATE_ONLY_NOT_AUTHORIZED
- matched terms: 0x75995EC0fdf881189850aeD864cB3f43c0DFCb58, 0x67aD7169184581f23D1E10B39d4eb4e98293E87a, 0x8d088B88219D072aB035502065ee2410c2cb4389

### receipts/governance/phase-27-public-mint-execution-script-review-findings-v1.json
- receipt: phase-27-public-mint-execution-script-review-findings-v1
- status: NO_GO_EXECUTION_PATH_INCOMPLETE
- matched terms: 0x75995EC0fdf881189850aeD864cB3f43c0DFCb58, 0x67aD7169184581f23D1E10B39d4eb4e98293E87a

### receipts/governance/phase-29-public-mint-execution-path-completion-plan-v1.json
- receipt: phase-29-public-mint-execution-path-completion-plan-v1
- status: PHASE_29_EXECUTION_PATH_COMPLETION_PLAN_OPEN_BUILDER_REVIEW_ONLY
- matched terms: 0x75995EC0fdf881189850aeD864cB3f43c0DFCb58, 0x67aD7169184581f23D1E10B39d4eb4e98293E87a

### receipts/governance/phase-29-public-mint-execution-path-completion-v1.json
- receipt: phase-29-public-mint-execution-path-completion-v1
- status: PHASE_29_EXECUTION_PATH_COMPLETION_RECORDED_REVIEW_ONLY
- matched terms: 0x67aD7169184581f23D1E10B39d4eb4e98293E87a

### receipts/governance/phase-30-public-mint-final-execution-review-reopen-v1.json
- receipt: phase-30-public-mint-final-execution-review-reopen-v1
- status: PHASE_30_FINAL_EXECUTION_REVIEW_REOPENED_REVIEW_ONLY
- matched terms: 0x67aD7169184581f23D1E10B39d4eb4e98293E87a

### receipts/governance/phase-35-final-reviewed-values-human-confirmation-v1.json
- receipt: phase-35-final-reviewed-values-human-confirmation-v1
- status: KRIS_FINAL_REVIEWED_VALUES_CONFIRMED
- matched terms: 0x75995EC0fdf881189850aeD864cB3f43c0DFCb58, 0x67aD7169184581f23D1E10B39d4eb4e98293E87a

### receipts/governance/phase-7-ai-docs-master-status-v1.json
- receipt: phase-7-ai-docs-master-status-v1
- status: SEALED
- matched terms: AWAITING_GUARDIAN_ADDRESS

### receipts/governance/phase-7-authorization-proposal-v1.json
- receipt: phase-7-authorization-proposal-v1
- status: AUTHORIZATION_PROPOSAL_READY
- matched terms: 0x8d088B88219D072aB035502065ee2410c2cb4389

### receipts/governance/phase-7-deploy-yield-router-script-created-v1.json
- receipt: None
- status: DEPLOY_SCRIPT_CREATED_PRE_BROADCAST
- matched terms: 0x8d088B88219D072aB035502065ee2410c2cb4389

### receipts/governance/phase-7-guardian-address-intake-v1.json
- receipt: phase-7-guardian-address-intake-v1-updated
- status: ACCEPTED
- matched terms: 0x8d088B88219D072aB035502065ee2410c2cb4389

### receipts/governance/phase-7-pre-execution-validation-v1.json
- receipt: phase-7-pre-execution-validation-v1
- status: PRE_EXECUTION_VALIDATION_PASSED
- matched terms: 0x8d088B88219D072aB035502065ee2410c2cb4389

### receipts/governance/phase-7-yield-routing-post-execution-v1.json
- receipt: None
- status: PHASE_7_YIELD_ROUTING_BROADCAST_CONFIRMED
- matched terms: 0x8d088B88219D072aB035502065ee2410c2cb4389

### receipts/governance/phase-8-human-onboarding-main-closure-v1.json
- receipt: phase-8-human-onboarding-main-closure-v1
- status: CLOSED
- matched terms: MINT_POLICY_REQUIRED, MINT_POLICY_REQUIRED

### receipts/governance/post-guardian-no-advance-lock-v1.json
- receipt: post-guardian-no-advance-lock-v1
- status: NO_DOWNSTREAM_ADVANCE
- matched terms: AUTHORIZATION_PENDING, PENDING_CONTROLLED_MINT_VERIFICATION, LIQUIDITY_NOT_AUTHORIZED, STAKING_NOT_AUTHORIZED, BRIDGE_NOT_AUTH

### receipts/governance/pr-516-phase-7-post-merge-closure-v1.json
- receipt: phase-7-post-merge-closure-v1
- status: COMPLETE
- matched terms: 0x8d088B88219D072aB035502065ee2410c2cb4389

### receipts/governance/public-mint-authorization-v1.json
- receipt: public-mint-authorization-v1
- status: AUTHORIZATION_PENDING
- matched terms: AUTHORIZATION_PENDING, 0x8d088B88219D072aB035502065ee2410c2cb4389

### receipts/governance/public-mint-dry-run-execution-preview-v1.json
- receipt: public-mint-dry-run-execution-preview-v1
- status: DRY_RUN_PREVIEW_NO_BROADCAST
- matched terms: 0x75995EC0fdf881189850aeD864cB3f43c0DFCb58, 0x67aD7169184581f23D1E10B39d4eb4e98293E87a

### receipts/governance/public-mint-execution-approval-request-v1.json
- receipt: public-mint-execution-approval-request-v1
- status: PENDING_KRIS_EXPLICIT_EXECUTION_APPROVAL
- matched terms: 0x75995EC0fdf881189850aeD864cB3f43c0DFCb58, 0x67aD7169184581f23D1E10B39d4eb4e98293E87a

### receipts/governance/public-mint-execution-authorization-retry-request-v1.json
- receipt: public-mint-execution-authorization-retry-request-v1
- status: PENDING_KRIS_EXPLICIT_RETRY_APPROVAL
- matched terms: 0x75995EC0fdf881189850aeD864cB3f43c0DFCb58, 0x67aD7169184581f23D1E10B39d4eb4e98293E87a

### receipts/governance/public-mint-execution-path-spec-v1.json
- receipt: public-mint-execution-path-spec-v1
- status: REVIEW_ONLY_NOT_EXECUTABLE
- matched terms: 0x75995EC0fdf881189850aeD864cB3f43c0DFCb58, 0x67aD7169184581f23D1E10B39d4eb4e98293E87a

### receipts/governance/public-mint-final-reviewed-values-confirmation-request-v1.json
- receipt: public-mint-final-reviewed-values-confirmation-request-v1
- status: PENDING_KRIS_EXPLICIT_CONFIRMATION
- matched terms: 0x75995EC0fdf881189850aeD864cB3f43c0DFCb58, 0x67aD7169184581f23D1E10B39d4eb4e98293E87a

### receipts/governance/public-mint-final-reviewed-values-v1.json
- receipt: public-mint-final-reviewed-values-v1
- status: FINAL_REVIEWED_VALUES_SEALED_NO_EXECUTION
- matched terms: 0x75995EC0fdf881189850aeD864cB3f43c0DFCb58, 0x67aD7169184581f23D1E10B39d4eb4e98293E87a

### receipts/governance/public-mint-human-signing-approval-request-v1.json
- receipt: public-mint-human-signing-approval-request-v1
- status: PENDING_KRIS_EXPLICIT_APPROVAL
- matched terms: 0x75995EC0fdf881189850aeD864cB3f43c0DFCb58, 0x67aD7169184581f23D1E10B39d4eb4e98293E87a

### receipts/governance/public-mint-open-v1.json
- receipt: public-mint-open-v1
- status: CONTROLLED_MINT_VERIFIED_PUBLIC_MINT_REQUIRES_SEPARATE_AUTHORIZATION
- matched terms: 0x67aD7169184581f23D1E10B39d4eb4e98293E87a

### receipts/governance/public-mint-policy-final-v1.json
- receipt: public-mint-policy-final-v1
- status: DEFINED_NO_ACTIVATION
- matched terms: 0x67aD7169184581f23D1E10B39d4eb4e98293E87a

### receipts/governance/public-mint-policy-readiness-v1.json
- receipt: public-mint-policy-readiness-v1
- status: MINT_POLICY_REQUIRED
- matched terms: MINT_POLICY_REQUIRED, MINT_POLICY_REQUIRED

### receipts/governance/public-mint-wallet-prompt-inspection-v1.json
- receipt: public-mint-wallet-prompt-inspection-v1
- status: INSPECTION_ONLY_NO_WALLET_PROMPT_TRIGGERED
- matched terms: 0x75995EC0fdf881189850aeD864cB3f43c0DFCb58, 0x67aD7169184581f23D1E10B39d4eb4e98293E87a

### receipts/governance/public-onboarding-readiness-v1-evidence-v1.json
- receipt: None
- status: prepared
- matched terms: 0x8d088B88219D072aB035502065ee2410c2cb4389

### receipts/governance/public-ready-ecosystem-gate-index-v1.json
- receipt: public-ready-ecosystem-gate-index-v1
- status: None
- matched terms: MINT_POLICY_REQUIRED, AUTHORIZATION_PENDING, PENDING_CONTROLLED_MINT_VERIFICATION, LIQUIDITY_NOT_AUTHORIZED, STAKING_NOT_AUTHORIZED, BRIDGE_NOT_AUTH, MINT_POLICY_REQUIRED, 0x8d088B88219D072aB035502065ee2410c2cb4389

### receipts/governance/public-validation-status-v1.json
- receipt: None
- status: PUBLIC_VALIDATION_OPEN
- matched terms: 0x335651BD160fDA89C9E7A095dF9Dc1BB9f3cF4DC

### receipts/governance/qpf-constitutional-closure-v1.json
- receipt: qpf-constitutional-closure-v1
- status: CONSTITUTIONAL_CLOSURE_PREPARED
- matched terms: 0x8d088B88219D072aB035502065ee2410c2cb4389

### receipts/governance/quarantined-conflicting-governance-receipts-v1.json
- receipt: quarantined-conflicting-governance-receipts-v1
- status: QUARANTINED
- matched terms: SIGNATURE_RECOVERY_REQUIRED

### receipts/governance/staking-policy-readiness-v1.json
- receipt: staking-policy-readiness-v1
- status: STAKING_NOT_AUTHORIZED
- matched terms: STAKING_NOT_AUTHORIZED

### receipts/onboarding/explorer-verification-phase-3-v1.json
- receipt: None
- status: None
- matched terms: 0x75995EC0fdf881189850aeD864cB3f43c0DFCb58, 0x67aD7169184581f23D1E10B39d4eb4e98293E87a, 0x5E50b92E57e854659f7D98c733088aABd551C49F, 0x8d088B88219D072aB035502065ee2410c2cb4389

### receipts/security/eth-mainnet-old-wallet-untrusted-v1.json
- receipt: None
- status: COMPROMISED_OR_UNTRUSTED
- matched terms: 0x335651BD160fDA89C9E7A095dF9Dc1BB9f3cF4DC

### receipts/valuation/qpf-audit-readiness-live-evidence-addendum-v1.json
- receipt: qpf-audit-readiness-live-evidence-addendum-v1
- status: LIVE_EVIDENCE_ADDENDUM_CREATED
- matched terms: MINT_POLICY_REQUIRED, AUTHORIZATION_PENDING, PENDING_CONTROLLED_MINT_VERIFICATION, LIQUIDITY_NOT_AUTHORIZED, STAKING_NOT_AUTHORIZED, BRIDGE_NOT_AUTH, MINT_POLICY_REQUIRED, 0x75995EC0fdf881189850aeD864cB3f43c0DFCb58, 0x67aD7169184581f23D1E10B39d4eb4e98293E87a, 0x5E50b92E57e854659f7D98c733088aABd551C49F, 0x8d088B88219D072aB035502065ee2410c2cb4389

## Safety assertions
- No wallet action performed.
- No signing performed.
- No transaction broadcast.
- No mint opened.
- No liquidity authorized.
- No staking authorized.
- No bridge authorized.
- Evidence-only audit-readiness expansion.
