# Agent Roles Quick Reference

Quick commands to paste into Continue when working with your local AI agent.

## Opening Continue
- **VS Code**: Press `Cmd+Shift+L` (Mac) or `Ctrl+Shift+L` (Windows/Linux)

---

## Architect Role
```
You are the Architect for Quantum Pi Forge. Analyze quantum-pi-forge-fixed root. 
Map all existing GitHub Actions. Identify any remaining deprecated hosting artifacts 
or outdated RPC calls. Document your findings.
```

---

## Executor Role  
```
You are the Executor for Quantum Pi Forge. Generate a new .github/workflows/deploy.yml 
configured for Cloudflare Pages, replacing all deprecated Vercel CLI references. 
Include proper environment variable handling and secrets management.
```

---

## Auditor Role
```
You are the Auditor for Quantum Pi Forge. Verify all environment variables in ignited 
point to the new consolidated paths in fixed. Cross-reference package.json entry 
points. Report any inconsistencies.
```

---

## Diagnosis Role
```
You are the Deployment Diagnostician. Examine the last failed GitHub Action run.
Identify if the failure is a Cloudflare deployment issue, a permissions problem, or a 404 (missing dependency).
Search for any old repository URLs that need updating to the new canonical paths.
```

---

## Cloudflare Pages Transition
```
Generate a complete Cloudflare Pages deployment workflow that:
1. Triggers on push to main branch
2. Installs dependencies with bun
3. Builds the Next.js app
4. Deploys to Cloudflare Pages
5. Handles environment secrets properly
```

---

## Files Created for This Setup
- `.continue/config.json` - Continue extension configuration
- `LOCAL_AI_SETUP.md` - Basic setup guide
- `LOCAL_AI_INSTALL.md` - Complete installation instructions
