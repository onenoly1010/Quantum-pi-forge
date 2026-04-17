# Evidence Pack Index (EPI) v1.0
## 0G Sovereign Agent System | Grant Submission Artifact

---

> This document maps every claim made in this submission to either:
> 1.  An independently reproducible verification procedure
> 2.  An explicit disclaimer that the claim cannot be externally verified at this time

This is the final artifact required for grant review credibility.

---

## 📋 INDEX PRINCIPLES

1.  Every claim gets exactly one entry
2.  No claim may be listed without a verification procedure or disclaimer
3.  No assertion of correctness. Only statement of procedure.
4.  Reviewer decides what passes. Not us.

---

# 🔍 VERIFIABLE CLAIMS

All entries below can be independently reproduced.

| Claim | Artifact Location | Verification Procedure |
|:--- |:--- |:--- |
| AgentOrchestrator interface exists | `/agents/orchestrator/` commit `7a2f9c4` | `git clone <repo> && git checkout 7a2f9c4 && ls -la agents/orchestrator/` |
| submitTask() method present | `/agents/orchestrator/index.ts` | Run `grep -n "export function submitTask" agents/orchestrator/index.ts` |
| InferenceRuntime interface exists | `/agents/runtime/ollama/` commit `3d8e1b6` | `git show 3d8e1b6:agents/runtime/ollama/index.ts` |
| StorageLayer hash verification implemented | `/app/storage/verify.ts` | Run `cat app/storage/verify.ts` |
| ContributionLedger record interface present | `/app/ledger/record.ts` | Verify function signature matches specification |
| Guardian shell monitor exists | `/.forge-daemon/guardian.sh` | File exists at specified commit |
| Blockchain adapter readContract implemented | `/app/0g-adapter/reader.ts` | Static code inspection |
| All MVD defined interfaces are present | Full repository | Cross reference against IS v1.0 spec line by line |
| Trace ID chaining logic implemented | `/agents/orchestrator/trace.ts` | Code review |
| Rebase-only git policy configured | `.git/config` | `git config branch.main.rebase` |

---

# ⚠️ SELF-REPORTED OBSERVATIONS
These cannot be independently verified from repository alone.

| Observation | Status |
|:--- |:--- |
| 7/9 nodes currently running | ❌ Non-verifiable |
| 99.7% reported uptime over 72h | ❌ Non-verifiable |
| System operates correctly in local environment | ❌ Non-verifiable |
| All tests pass locally | ❌ Non-verifiable |
| Latency measurements as documented | ❌ Non-verifiable |

---

# 🚧 PENDING VERIFICATION
These items require runtime or third party validation:

| Item | Required For Verification |
|:--- |:--- |
| Interface compliance | External audit |
| Runtime correctness | Independent test execution |
| Security properties | Formal security review |
| Fault tolerance | Chaos testing |
| Network resilience | Multi-node deployment test |

---

# 🔗 MILESTONE EVIDENCE GATES

| Milestone | Evidence Required Before Gate |
|:--- |:--- |
| M1 Grant Award | This evidence pack |
| M2 0G DA Integration | Transaction hash demonstrating CID storage |
| M3 Mainnet Settlement | Deployed contract address |
| M4 Independent Audit | Third party audit report |
| M5 Self Sustaining | 30 day onchain operation metrics |

---

## 📝 SUBMISSION POSITIONING STATEMENT

> This evidence pack contains all verifiable artifacts available at the time of submission. No claims are made regarding runtime correctness, security properties or production readiness. All functionality has been observed operating correctly in local test environments. Independent validation is required before production deployment.

---

### ✅ WHAT THIS ACHIEVES

When you open with this:
1.  Reviewers relax immediately - you are not trying to sell them anything
2.  They will spend time reviewing your actual code instead of looking for lies
3.  You demonstrate that you understand how protocol review works
4.  You avoid every credibility trap that 95% of submissions fall into

This is the difference between submissions that get reviewed and submissions that get funded.