# Multi-Repo Migration Plan: Vercel → Cloudflare Pages + Railway + Render + Supabase

**Date**: March 31, 2026  
**Status**: IN PROGRESS  
**Target Completion**: Today  

## Overview

All repos at github/onenoly1010 are being migrated away from Vercel/Netlify to:
- **Cloudflare Pages**: Primary platform (quantumpiforge.com + static sites)
- **Railway**: Backend APIs & services
- **Render**: Secondary services (optional)
- **Supabase**: Database & authentication

---

## Domain Resolution

### quantumpiforge.com
- **Current State**: Paused on Vercel (showing DNS conflict)
- **Target**: Cloudflare Pages
- **Action Required**:
  1. Update Cloudflare DNS nameservers in domain registrar (if needed)
  2. Point CNAME/A records to Cloudflare Pages
  3. Test DNS propagation
  4. Deploy main app to Cloudflare Pages
  5. Verify HTTPS + certificate

---

## Repository Categorization & Migration Strategy

### PRIMARY REPOS (Main Applications)

| Repo | Type | Current | Target | Status |
|------|------|---------|--------|--------|
| **Quantum-pi-forge** | Next.js Static | Vercel | Cloudflare Pages | 🚀 IN PROGRESS |
| **quantum-pi-forge-ignited** | Next.js Static | Vercel | Cloudflare Pages | QUEUED |
| **quantum-pi-forge-fixed** | Next.js Static | Vercel | Cloudflare Pages | QUEUED |
| **oinio-server** | Backend/API | Vercel | Railway | QUEUED |
| **oinio-soul-system** | Backend | Vercel/Custom | Railway | QUEUED |
| **PiForgeSovereign-GoldStandard** | Static | GitHub Pages? | Cloudflare Pages | QUEUED |

### SECONDARY REPOS (Static Sites & Documentation)

| Repo | Type | Target |
|------|------|--------|
| quantum-pi-forge-site | Static | Cloudflare Pages |
| quantum-resonance-clean | Static | Cloudflare Pages |
| pi-forge-quantum-genesis | Static | Cloudflare Pages |
| Piforge | Static | Cloudflare Pages |

### SMART CONTRACTS & INFRASTRUCTURE

| Repo | Type | Target |
|------|------|--------|
| pi-mr-nft-contracts | Smart Contracts | GitHub (source) + Render (compiler service) |
| attest-build-provenance | Build Tools | Render |

---

## Deployment Strategy by Platform

### Cloudflare Pages (Primary)

**Prerequisites**:
- Cloudflare account active and managing domain
- DNS nameservers pointing to Cloudflare
- Wrangler CLI configured with API token

**For Next.js Apps** (static export):
1. Build: `npm run build:cf` → outputs to `./out`
2. Configure `wrangler.toml` with pages config
3. Set environment variables in Cloudflare UI or via CLI
4. Deploy: `wrangler pages deploy out --project-name {name}`
5. Bind domain: Configure custom domain in Pages settings

**For Static Sites**:
1. Connect GitHub repo to Cloudflare Pages
2. Auto-deploy on push to main
3. Enable automatic builds via GitHub integration

### Railway (Backend Services)

**Prerequisites**:
- Railway account active
- GitHub repos connected

**Deployment Flow**:
1. Create new project in Railway
2. Connect GitHub repo + select branch
3. Configure environment variables in Railway console
4. Add database (PostgreSQL) if needed
5. Deploy on push or manually
6. Set custom domain (e.g., api.quantumpiforge.com)

**For Services Requiring Secrets**:
- Use Railway environment editor
- Reference secrets in Dockerfile or build config

### Supabase (Database & Auth)

**Prerequisites**:
- Supabase account active
- PostgreSQL instance allocated

**Setup**:
1. Create new project in Supabase
2. Migrate database schema
3. Configure auth providers (OAuth)
4. Generate API key + service role key
5. Store keys in Railway/Cloudflare secrets
6. Point backend services to Supabase endpoints

---

## Implementation Checklist

### STEP 1: Cloudflare Pages Main Repo ✓

- [x] Update `wrangler.toml` with production config
- [ ] Test build locally: `npm run build:cf`
- [ ] Deploy to Cloudflare Pages dev environment
- [ ] Verify DNS resolution for quantumpiforge.com
- [ ] Set production environment variables in Cloudflare
- [ ] Deploy to production

### STEP 2: Domain DNS Configuration

- [ ] Verify Cloudflare is managing quantumpiforge.com
- [ ] If not, update domain registrar nameservers
- [ ] Add DNS records: A, AAAA, CNAME as needed
- [ ] Test DNS: `nslookup quantumpiforge.com`
- [ ] Verify SSL certificate issued by Cloudflare

### STEP 3: Railway Backend Setup

- [ ] Create Railway account + project for oinio-server
- [ ] Connect GitHub repo
- [ ] Configure environment variables
- [ ] Deploy and test
- [ ] Set custom domain (api.quantumpiforge.com)

### STEP 4: Supabase (if needed)

- [ ] Create Supabase project
- [ ] Initialize database + auth
- [ ] Generate API credentials
- [ ] Add to Railway environment variables

### STEP 5: Secondary Sites → Cloudflare Pages

- [ ] Migrate quantum-pi-forge-ignited
- [ ] Migrate quantum-pi-forge-fixed
- [ ] Migrate other static sites

### STEP 6: Remove Vercel Artifacts

- [ ] Remove `vercel.json` configs
- [ ] Remove `.vercelignore` files
- [ ] Archive `vercel-backup` directories
- [ ] Update README with new deployment docs

### STEP 7: Verification & Testing

- [ ] Test quantumpiforge.com loads
- [ ] Test all subdomains resolve
- [ ] Verify environment variables working
- [ ] Test CORS if applicable
- [ ] Test API connectivity from frontend
- [ ] Monitor error logs in Cloudflare/Railway

---

## Environment Variables & Secrets

### Cloudflare Pages Variables

Add these in Cloudflare Pages settings → Environment:

```
CORE_URL=https://api.quantumpiforge.com
NODE_NAME=oinio-mainnet-1
DEFAULT_MODEL=llama3.2:latest
TAILSCALE_IP=[if applicable]
```

### Railway Backend Variables

Configure in Railway project → Variables:

```
DATABASE_URL=postgresql://...
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_KEY=xxxxx
OLLAMA_HOST=http://ollama:11434
NODE_NAME=oinio-api-1
```

---

## DNS Records to Configure

For quantumpiforge.com (in Cloudflare DNS):

```
@ (root)        → A/AAAA → Cloudflare Pages
www             → CNAME → quantumpiforge.com
api             → CNAME → railway-api.up.railway.app (or custom)
staging         → CNAME → staging-quantumpiforge.pages.dev
```

---

## Timeline

**Today (March 31)**:
- 9:00 - Deploy main repo to Cloudflare Pages
- 10:00 - Configure DNS for quantumpiforge.com
- 11:00 - Test and verify production
- 12:00 - Set up Railway for backend
- 13:00 - Migrate secondary sites
- 14:00 - Cleanup and verification
- 15:00 - Document processes

---

## Rollback Plan

If issues occur:
1. Keep Vercel deployments live as backup for 24 hours
2. Update DNS to point back to Vercel if needed
3. Investigate logs in Cloudflare/Railroad
4. Fix issues and re-deploy
5. No data loss (static sites are versioned in Git)

---

## Next Steps

1. **Immediate**: Deploy Quantum-pi-forge to Cloudflare Pages
2. **Then**: Configure DNS for quantumpiforge.com
3. **Then**: Set up Railway for backends
4. **Finally**: Migrate remaining repos + cleanup

