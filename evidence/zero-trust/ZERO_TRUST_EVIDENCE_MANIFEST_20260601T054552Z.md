# Zero-Trust Evidence Manifest

**Timestamp UTC:** 20260601T054552Z  
**Repository:** Quantum-pi-forge  
**Branch:** evidence/direct-compute-shadow-node22  
**HEAD:** 3e340edcdbe0a21f5ef97a21cd44aec8babdcd14  

## Principle

All claims must be proven with evidence, not authority.

This project is public, open source, and governed through GitHub-visible commits, branches, pull requests, branch protection, workflow logs, and review gates.

## Evidence of Non-Override

Direct push to protected main was rejected by GitHub branch protection.

Admin squash merge was also blocked because the repository requires at least one approving review from a reviewer with write access.

This proves the maintainer cannot silently bypass the public governance path.

## Evidence of Local Verification

Local workflow was executed and restored to the project-required Node 22 runtime.

The workflow completed successfully after correcting the runtime mismatch.

## Evidence of 0G Compute State

Direct provider compute was confirmed with HTTP 200.

Router chat remains degraded with HTTP 402 billing-state warning.

This separates working direct compute from the router billing abstraction issue.

## Safety Posture

- Resonance worker mode: dry-run only
- Router execution: disabled
- Autonomous authority: disabled
- Transaction submission: disabled
- Mainnet writes: disabled
- Wallet signing: not authorized
- Fund movement: not authorized
- Contract mutation: not authorized
- Human review: required

## Zero-Trust Conclusion

The current system does not depend on personal claims of authority.

The evidence shows that public review gates, branch protection, local workflow logs, commit history, and explicit no-authority runtime flags define the operational boundary.

The local AI role is evidence witness only.

It may observe, hash, summarize, and report.

It may not push, merge, deploy, sign, spend, mutate contracts, or submit mainnet transactions.
