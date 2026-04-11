# 🌐 DEPLOYMENT STATUS — LIVE ENDPOINTS

**Last Verified:** December 21, 2025 (Solstice Genesis)  
**Next Verification:** March 21, 2026 (Quarterly)  
**Verification Protocol:** Automated health checks + manual quarterly audit

---

## 🎯 Primary Services

| Service | URL | Status | Health Check | Last Verified |
|---------|-----|--------|--------------|---------------|
| **Pi Forge Genesis API** | https://pi-forge-quantum-genesis.railway.app | ✅ LIVE | `/health` → 200 OK | Dec 21, 2025 |
| **Quantum Resonance Engine** | https://your-project.workers.dev | ⚠️ EXPOSED | No `/health` endpoint | Dec 21, 2025 |
| **Quantum Pi Forge Site** | https://onenoly1010.github.io/quantum-pi-forge-site/ | ✅ LIVE | Static site loads | Dec 21, 2025 |
| **DEX Dashboard** | https://quantum-pi-forge-fixed.vercel.app/dashboard | ❌ ARCHIVED | 404 NOT_FOUND | Dec 21, 2025 |

---

## 📊 Service Details

### Pi Forge Genesis API (Railway)

**Base URL:** `https://pi-forge-quantum-genesis.railway.app`  
**Platform:** Railway  
**Status:** ✅ Operational  
**Architecture:** FastAPI Quantum Conduit (Port 8000)

**Key Endpoints:**
- `/health` — Health check (returns 200 OK with "OK" response)
- `/` — Root endpoint with service info
- `/docs` — Swagger UI documentation
- `/api/*` — API routes

**Verification:**
```bash
curl -I https://pi-forge-quantum-genesis.railway.app/health
# Expected: HTTP/2 200
```

---

### Quantum Resonance Engine (Vercel)

**Base URL:** `https://your-project.workers.dev`  
**Platform:** Vercel  
**Status:** ⚠️ Directory listing exposed (see Security Agent Issue #157)

**Notes:**
- Raw directory listing visible (may be intentional "radical transparency")
- No `/health` endpoint available
- Source code accessible via directory browsing
- Security assessment in progress

---

### Quantum Pi Forge Site (GitHub Pages)

**Base URL:** `https://onenoly1010.github.io/quantum-pi-forge-site/`  
**Platform:** GitHub Pages  
**Status:** ✅ Fully operational

**Features:**
- Genesis countdown complete (00:00:00:00)
- Launch manifesto accessible
- Ecosystem overview integrated
- Static site with no backend dependencies

---

### DEX Dashboard (Archived)

**Previous URL:** `https://quantum-pi-forge-fixed.vercel.app/dashboard`  
**Platform:** Vercel  
**Status:** ❌ Archived/Deprecated

**Notes:**
- Returns 404 NOT_FOUND (DEPLOYMENT_NOT_FOUND)
- May have been intentionally sunset post-launch
- Historical reference only — not for production use

---

## 🔄 Verification Schedule

**Automated Checks (Every 30 minutes):**
- Railway API health endpoint
- GitHub Pages site availability
- Vercel platform status

**Manual Audits (Quarterly):**
- Full endpoint testing
- Security posture review
- Documentation accuracy verification
- Cross-repo link validation

**Next Manual Audit:** March 21, 2026

---

## 🚨 Reporting Issues

If any endpoint shows degraded status for >12 hours:
1. Open issue with `deployment` label
2. Tag Documentation Agent
3. Include timestamp and error details
4. Trigger emergency verification protocol

---

## 📚 Related Documentation

- [Genesis Declaration](../GENESIS.md) — Foundation and principles
- [API Documentation](./API.md) — Endpoint specifications
- [Runbook](../RUNBOOK.md) — Operational procedures
- [Quick Start Guide](./QUICK_START.md) — Getting started guide

---

**This document is the source of truth for all deployment URLs. All other documentation references this file.**

*Last updated: December 21, 2025 (Solstice Genesis)*
