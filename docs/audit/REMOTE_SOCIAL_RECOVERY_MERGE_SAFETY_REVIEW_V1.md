# Remote Social Recovery Merge Safety Review v1

Status: REVIEW_REQUIRED_BEFORE_MERGE

Finding: origin/main adds ZeroGSocialRecovery.sol and DeploySocialRecovery.s.sol.

Risk boundary: contract introduces wallet owner recovery state and executeRecovery flow; deploy script includes private-key/broadcast/startBroadcast usage.

Decision: do not merge, rebase, push, broadcast, sign, deploy, mint, stake, bridge, or add liquidity until this lane is reviewed and explicitly authorized.

Preserved branch: safety/guardian-recovery-before-remote-merge-f53695b.
