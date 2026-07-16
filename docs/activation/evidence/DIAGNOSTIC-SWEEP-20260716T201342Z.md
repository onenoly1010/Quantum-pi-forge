# Diagnostic Sweep — 20260716T201342Z

Protocol: LOCAL_AI_EXECUTION_PROTOCOL_V1
Mode: SYSTEM HEALTH (no wallet, no funds, no deploy)

---

## ACTION: git status
### REASON: Root state / working tree integrity
### COMMAND: git status -sb && git status --porcelain | wc -l
### RESULT:
```
## main...origin/main [ahead 4]
 M cache/compile-cache.json
 M contracts/DEPLOYED_ADDRESSES.md
 M docs/activation/ACTIVATION_GATE_PROTOCOL_V1.md
 M docs/activation/activation-gate-state-v1.json
?? docs/activation/LOCAL_AI_EXECUTION_PROTOCOL_V1.md
?? docs/activation/ROOT_AWARENESS_VERIFICATION_PROTOCOL_V1.md
?? docs/activation/evidence/DIAGNOSTIC-SWEEP-20260716T201342Z.md
?? docs/activation/evidence/G-01-recheck-20260716T194717Z.md
?? docs/activation/evidence/G-02-build-integrity-20260716T194734Z.md
?? docs/activation/evidence/G-02-build-log-20260716T194734Z.txt
?? docs/activation/evidence/G-03-runtime-integrity-20260716T194900Z.md
?? docs/activation/evidence/G-03-runtime-smoke-20260716T194900Z.txt
?? docs/activation/evidence/G-04-wallet-verification-20260716T194921Z.md
?? docs/activation/evidence/G-04-wallet-verifier-log-20260716T195000Z.txt
?? docs/activation/evidence/G-05-bytecode-compare-20260716T195200Z.json
?? docs/activation/evidence/G-05-bytecode-compare-broadcast-set-20260716T195300Z.json
?? docs/activation/evidence/G-05-contract-rpc-20260716T195100Z.json
?? docs/activation/evidence/G-05-contract-verification-20260716T195100Z.md
?? docs/activation/evidence/G-06-documentation-audit-20260716T195400Z.md
?? docs/activation/evidence/G-07-security-20260716T195400Z.md
?? docs/activation/evidence/G-08-activation-report-20260716T195500Z.md
?? docs/activation/final/
?? docs/activation/root-awareness-verification-protocol-v1.json
?? docs/activation/spiral-return/
porcelain_count=24
```

## ACTION: git log -1
### REASON: Latest durable commit identity
### COMMAND: git log -1 --oneline && git rev-parse HEAD
### RESULT:
```
ce275b8 docs: claim hygiene SSOT, public surface audit, activation gate protocol
ce275b81f54d4f166a17f7fac8ffa67f0c937435
ahead_behind=0	4
```

## ACTION: npm run verify:evidence
### REASON: Evidence index integrity (system health)
### COMMAND: npm run verify:evidence
### RESULT:
```

> verify:evidence
> node scripts/verify-evidence.cjs


=== Verify evidence index ===

> verify:evidence-index
> node scripts/verify-evidence-index.cjs

OK evidence index verified: 3 lanes, 6 paths checked.

=== Verify evidence receipt ===

> evidence:receipt:check
> node scripts/check-evidence-receipt.cjs

OK evidence receipt matches evidence index hash.
indexSha256=a63dc16e5f577c808fd495e5a18e87f25006980cf0d84d23b61f5beca57e58fa

=== Verify claim map ===

> verify:claim-map
> node scripts/verify-claim-map.cjs


> verify:evidence-index
> node scripts/verify-evidence-index.cjs

OK evidence index verified: 3 lanes, 6 paths checked.
OK claim map verified: 3 claims checked.

=== Verify claim map drift guard ===

> claim-map:check
> node scripts/check-claim-map.cjs


> verify:claim-map
> node scripts/verify-claim-map.cjs


> verify:evidence-index
> node scripts/verify-evidence-index.cjs

OK evidence index verified: 3 lanes, 6 paths checked.
OK claim map verified: 3 claims checked.
OK claim map drift check passed.
claims=3

=== Verify evidence snapshot ===

> verify:snapshot
> node scripts/verify-snapshot.cjs

OK evidence snapshot verified.
snapshotVersion=1.0.0
canonicalCommit=7e6281d
currentHead=ce275b8
baselineReceiptHash=b720d54e7a07b89edd4e7dd20ce6631d5d252bef273e8c59ab62cffa2fd27fb1
currentReceiptHash=a63dc16e5f577c808fd495e5a18e87f25006980cf0d84d23b61f5beca57e58fa
proofCommand=npm run verify:evidence

OK evidence verification bundle passed.
steps=5
```
exit_code=0

## ACTION: npm run build
### REASON: Static site / deploy artifact build integrity
### COMMAND: npm run build
### RESULT:
```

> build
> node scripts/build.js

Building static assets for Cloudflare Pages

OK created out/_redirects

Copying static files
OK copied deploy/_headers -> out/_headers
OK copied deploy/index.html -> out/index.html
OK copied deploy/dao.html -> out/dao.html
OK copied deploy/resonate.html -> out/resonate.html
OK copied deploy/staking.html -> out/staking.html
OK copied deploy/what-it-does.html -> out/what-it-does.html
OK copied deploy/for-builders.html -> out/for-builders.html
OK copied deploy/why-this-matters.html -> out/why-this-matters.html
OK copied deploy/human-onboarding.html -> out/human-onboarding.html
OK copied deploy/deployed-addresses.html -> out/deployed-addresses.html
OK copied deploy/onboarding-status.html -> out/onboarding-status.html
OK copied deploy/manifest.json -> out/manifest.json
OK copied mint.html -> out/mint.html
OK copied mint-status.html -> out/mint-status.html
OK copied human-cockpit.html -> out/human-cockpit.html
OK copied ceremonial_interface.html -> out/ceremonial_interface.html
OK copied spectral_command_shell.html -> out/spectral_command_shell.html
OK copied pi-forge-integration.js -> out/pi-forge-integration.js

Copying static directories
OK copied frontend/ -> out/frontend/
OK copied deploy/trust/ -> out/trust/
OK copied receipts/human-cockpit/ -> out/receipts/human-cockpit/
OK pruned dev artifact out/frontend/README.md
OK pruned dev artifact out/frontend/example.html
OK generated version manifest for ce275b8

Build completed: /home/kris/Quantum-pi-forge/out

OK copied run-guardian.sh -> out/run-guardian.sh
OK copied api/ -> out/api
```
exit_code=0

## FUNDING SNAPSHOT (read-only classification)
| Item | Classification |
| --- | --- |
| On-chain payout / balance change this session | UNCONFIRMED (not checked; no wallet access) |
| Grant application / milestones (project docs) | PENDING (awaiting grant review per tracker) |
| Spiral confirmed_secured_total | VERIFIED as 0 in receipts/spiral-return/spiral-return-funding-action-plan-v1.json |
| Assume funds available | FORBIDDEN |

## SUMMARY TABLE
| Check | Exit | Status |
| --- | ---: | --- |
| git status | 0 | OBSERVED |
| git log -1 | 0 | OBSERVED |
| verify:evidence | 0 | PASS |
| build | 0 | PASS |

## NEXT STEP
1. Human: define 169K/500K metric if relevant; pin Spiral Return deadline.
2. Human: funding — supply tx hash or confirm still PENDING grant review.
3. Optional: Authorize commit of diagnostic + activation evidence (no push).

## FINAL RULE COMPLIANCE
- No wallet movement
- No secrets exposed
- No funds assumed
- No mint/liquidity/transfer

REPORT_PATH=docs/activation/evidence/DIAGNOSTIC-SWEEP-20260716T201342Z.md
