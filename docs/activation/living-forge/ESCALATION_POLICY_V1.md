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

## P0 / P1 (interrupt Kris) — EXECUTION_AUTHORIZATION_V1.0

- Cryptographic signing / private key use  
- Spend or move funds  
- Change wallet ownership  
- Export keys / reveal secrets  
- Delete repos or important files  
- Publish confidential information  
- Accept legal agreements on Kris’s behalf  
- Submitting identity (KYC, portal login **as Kris**)  
- Choosing/owning receiving account (Kris fills destination)  
- Physical travel confirmations (M-01…M-04)  
- Marking `confirmed_secured_total` > 0 without payment proof  

## P3 (autonomous under EXECUTION_AUTHORIZATION_V1.0)

- git status, verify, build, preflight (non-executing)  
- Evidence append, queue updates, heartbeats  
- Commits and **pushes** of non-secret project work  
- Open PRs when useful  
- Code changes, tests, docs, grant/revenue **draft** packages  
- Discovering/listing opportunities (no impersonated portal login)  

## Success metrics (ops)

| Metric | Direction |
| --- | --- |
| Human interruptions / day | ↓ |
| Autonomous tasks completed | ↑ |
| Hours without prompts | ↑ |
| Backlog (open P3) | ↓ |
| External opportunities discovered | ↑ |

**Not** primary metrics: report count, receipt volume for its own sake.
