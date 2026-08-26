# Outreach — intelligence packet (no send)

```text
AGENT: Outreach
ROLE: declared operating role
TASK: one bounded outreach intelligence packet from verified QPF capabilities
AUTHORIZED SCOPE: identify targets; do not send, commit, or represent unverified capability
EXECUTION: live 0G docs/guild pages + QPF canonical artifacts
ARTIFACT: this file
RESULT: EXECUTED (packet only)
NEXT GATE: separate GO to send any message
```

Verified QPF capabilities used as the qualification filter (this cycle):

- Level 0 digest-binding verification + `qpfv0:` / `qpfpkg0` / identity bind on `e43cd55`
- Contracts live on 0G Aristotle 16661 (token, model registry, DEX pair **empty reserves**)
- 0G skill cluster (#782) Router-first compute documentation
- **Not** claimed: public mint, LP, yield, 8004/7857 QPF identity, live payments

| Target | Relevance | Qualification | Channel (public) | Proposed purpose of contact | Evidence | Send? |
| --- | --- | --- | --- | --- | --- | --- |
| **0G Builder Hub / Foundation ecosystem** | Primary chain and AI-agent infra QPF already uses | QPF has live 16661 contracts + verification protocol; 0G markets verifiable AI | https://build.0g.ai · https://docs.0g.ai · https://guild.0gfoundation.ai | Technical: “deterministic identity + evidence + verification for 0G agents” — **not** “please fund QPF” | RPC `eth_chainId=0x4115`; #782 docs; Model Registry `totalModels=2` | **NOT SENT** |
| **0G Hall (Guild category)** | Existing OINIO/QPF thread exists | Historical grant post; Guild 2.0 applications **currently closed** | https://hall.0g.ai/t/oinio-resonance-worker-…/274 | If Guild reopens: update evidence pack to current SHA `e43cd55`, not April 2026 claims | hall.0g.ai 200; guild.0gfoundation.ai “Applications Closed” 2026-08-21 | **NOT SENT** |
| **8004scan / ERC-8004 ecosystem** | Discoverability, not QPF identity SoR | Official 0G 8004 registries exist; QPF has **not** registered | https://8004scan.io · docs `BUILDER_HUB_OPERATOR_V1.md` | Future: optional discoverability **after** identity SoR remains Docs DEPLOYMENT_SET | 8004 `totalAgents()` call reverted; P0-D NO GO | **NOT SENT** |

Do not represent: live mint, LP, staking, agent earnings, or that JSON named agents are on-chain INFTs.
