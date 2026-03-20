# 🔗 Cross-Repository Reference Guide

**Date**: 2026-01-13  
**Purpose**: Unified navigation across the Pi Forge ecosystem

---

## 🏛️ **Canonical Hub**

**Primary Repository**  
📍 [pi-forge-quantum-genesis](https://github.com/onenoly1010/pi-forge-quantum-genesis)  
→ All core development, features, and operations  
→ Deployed to: Railway (backend) + Vercel (frontend)

---

## 🔧 **Independent Services**

Use these repositories for specialized functionality. Each maintains its own deployment pipeline and versioning.

### Smart Contracts & NFT Deployment

📍 [pi-mr-nft-contracts](https://github.com/onenoly1010/pi-mr-nft-contracts)  
- **Language**: Solidity  
- **Purpose**: NFT contract code and deployment  
- **Why Separate**: Smart contracts need independent versioning and security audit cycles  
- **How to Use**: Clone separately, deploy with Foundry/Hardhat  
- **Status**: ✅ Active

---

## 📚 **Templates & Reference Implementations**

Use these repositories as examples for building new projects.

### NestJS + Chatbase Integration

📍 [nest-js-chatbase-template](https://github.com/onenoly1010/nest-js-chatbase-template)  
- **Language**: TypeScript (NestJS)  
- **Purpose**: Reference implementation for chatbot integrations  
- **How to Use**: Fork or reference as a starting point  
- **Status**: ✅ Active (TypeScript)

### FastAPI Backend Template

📍 [fastapi](https://github.com/onenoly1010/fastapi)  
- **Language**: Python  
- **Purpose**: Lightweight FastAPI backend service  
- **How to Use**: Reference for Python-based microservices  
- **Status**: ✅ Active (Private)  
- **Access**: Available to team members

### Autonomous Repository Template

📍 [autonomous-repo-template](https://github.com/onenoly1010/autonomous-repo-template)  
- **Language**: Configuration/Documentation  
- **Purpose**: Self-governance patterns and autonomous workflows  
- **How to Use**: Reference for setting up other autonomous projects  
- **Status**: ✅ Active

---

## 🧬 **Philosophical Systems & Frameworks**

These repositories define core concepts and patterns used across the ecosystem.

### OINIO Soul System

📍 [oinio-soul-system](https://github.com/onenoly1010/oinio-soul-system)  
- **Language**: JavaScript  
- **Purpose**: Sovereign OINIO system definition and patterns  
- **How to Use**: Reference from Canon directory; link in documentation  
- **Status**: ✅ Active (Template repo)  
- **Documentation**: See `/canon/INDEX.md` in primary hub

---

## 🗂️ **Archived Repositories**

These repositories are **read-only** and preserved for historical reference. They are no longer actively developed.

| Repository | Archive Date | Reason | Recovery |
|------------|--------------|--------|----------|
| `pi-forge-quantum-genesis-OPEN` | 2026-01-13 | Duplicate of primary hub | Use primary hub instead |
| `PiForgeSovereign-GoldStandard` | 2026-01-13 | Outdated fork | Reference oinio-soul-system |
| `Oinio-server-` | 2026-01-13 | Incomplete implementation | Merged into main hub |
| `Piforge` | 2026-01-13 | Early iteration | Use primary hub |
| `mainnetstatus` | 2026-01-13 | Superseded by dashboard | Use STATUS.md |
| `countdown` | 2026-01-13 | Temporary utility | Not maintained |

**To Recover**: If an archived repo is needed, contact the team to unarchive it.

---

## 📊 **Repository Dependency Map**

```
pi-forge-quantum-genesis (PRIMARY HUB)
│
├── Merged from:
│   ├── quantum-resonance-clean    → /frontend
│   ├── quantum-pi-forge-fixed     → /server
│   ├── quantum-pi-forge-site      → /docs/site
│   └── pi-mr-nft-agent           → /server/agents
│
├── Links to (Independent):
│   ├── pi-mr-nft-contracts       (Smart contracts)
│   ├── nest-js-chatbase-template (Template)
│   ├── fastapi                   (API template)
│   ├── oinio-soul-system         (Framework)
│   └── autonomous-repo-template  (Governance)
│
└── References (Canon):
    └── canon/INDEX.md
```

---

## 🔄 **How to Contribute**

### To Contribute to Core Features
1. Fork or branch from `pi-forge-quantum-genesis`
2. Create a feature branch
3. Submit a pull request
4. See [RUNBOOK.md](../RUNBOOK.md) for workflows

### To Contribute to Smart Contracts
1. Work in `pi-mr-nft-contracts`
2. Write tests and documentation
3. Deploy via Foundry/Hardhat
4. Link results back to primary hub docs

### To Create a New Service
1. Start from the appropriate template repo
2. Document it in REPO_LINKS.md
3. Add a cross-link from README.md
4. Update CONSOLIDATION.md if it's meant to be independent

---

## 🧭 **Navigation Tips**

**For Frontend Development** → Start in `pi-forge-quantum-genesis/frontend`  
**For Backend Development** → Start in `pi-forge-quantum-genesis/server`  
**For Smart Contracts** → Go to `pi-mr-nft-contracts`  
**For New Backend Project** → Reference `fastapi` template  
**For Chatbot Integration** → Reference `nest-js-chatbase-template`  
**For Governance Patterns** → Reference `autonomous-repo-template`  
**For Framework Reference** → See `oinio-soul-system`

---

## 📞 **Questions?**

- **Operational questions**: See [RUNBOOK.md](../RUNBOOK.md)
- **Architecture questions**: See [CONSOLIDATION.md](./CONSOLIDATION.md)
- **Status questions**: See [STATUS.md](../STATUS.md)
- **Canon/Philosophy**: See [canon/INDEX.md](../canon/INDEX.md)

---

**Last Updated**: 2026-01-13  
**Maintainer**: Autonomous Reset Protocol  
**Next Review**: 2026-02-13
