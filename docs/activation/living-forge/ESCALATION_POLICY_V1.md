# Living Forge Escalation Policy v1

## Rule

**Never ask Kris what to do next if another autonomous task exists.**

## Priority levels

| P | Name | Behavior |
| --- | --- | --- |
| P0 | Human signature required | Stop stream; single escalation line only |
| P1 | Human decision / identity | Stop stream; ranked in human queue |
| P2 | External response pending | Poll/record only; do not spam Kris |
| P3 | Autonomous work | Execute without prompt |
| P4 | Background optimization | Only if P3 empty and resources free |

## P0 / P1 (interrupt Kris)

- Cryptographic signing / private key use  
- Commit push **if** policy requires explicit auth (current: yes)  
- Submitting identity (KYC, portal login as Kris)  
- Approving irreversible chain/money actions  
- Choosing receiving account ownership  
- Physical travel confirmations (M-01…M-04)  
- Marking `confirmed_secured_total` > 0  

## P3 (never interrupt)

- git status, verify, build, preflight (non-executing)  
- Evidence append, queue updates, heartbeats  
- Classification of known files  
- Drafting packages Kris already authorized as docs-only  
- Discovering/listing opportunities (no send as Kris)  

## Success metrics (ops)

| Metric | Direction |
| --- | --- |
| Human interruptions / day | ↓ |
| Autonomous tasks completed | ↑ |
| Hours without prompts | ↑ |
| Backlog (open P3) | ↓ |
| External opportunities discovered | ↑ |

**Not** primary metrics: report count, receipt volume for its own sake.
