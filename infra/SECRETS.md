# Required Secrets - TESTNET ONLY

## ⚠️ CRITICAL SECURITY NOTICE ⚠️

**NEVER commit secret values to this repository or any configuration file.**

This document lists the **names and purposes** of required secrets only. Actual values must be configured in:
- Railway Dashboard → Project Settings → Variables (for Railway deployments)
- GitHub Repository Settings → Secrets and Variables → Actions (for GitHub Actions workflows)
- Local `.env` file (for local development, `.gitignore`d)

## Required Secrets

### 1. Supabase Configuration

**SUPABASE_URL**
- **Purpose**: Supabase project URL for authentication and database
- **Format**: `https://your-project-id.supabase.co`
- **Scope**: Railway, GitHub Actions, Local
- **Required**: Yes
- **Testnet Note**: Use a separate Supabase project for testnet

**SUPABASE_KEY**
- **Purpose**: Supabase anonymous public key (anon key)
- **Format**: Long JWT token starting with `eyJ...`
- **Scope**: Railway, GitHub Actions, Local
- **Required**: Yes
- **Testnet Note**: Use testnet project's anon key, NOT production

### 2. JWT Configuration

**JWT_SECRET**
- **Purpose**: Secret key for signing JWT tokens in the application
- **Format**: Random secure string (minimum 32 characters)
- **Scope**: Railway, GitHub Actions, Local
- **Required**: Yes
- **Generation**: `openssl rand -hex 32` or any secure random generator
- **Testnet Note**: Use separate secret from production

### 3. Pi Network Testnet Configuration

**PI_NETWORK_APP_ID**
- **Purpose**: Pi Network application ID (testnet/sandbox)
- **Format**: Application ID from Pi Developer Portal (sandbox)
- **Scope**: Railway, Local
- **Required**: Yes
- **Testnet Note**: MUST be sandbox/testnet app ID, NOT mainnet

**PI_NETWORK_API_KEY**
- **Purpose**: Pi Network API key for payment verification (testnet)
- **Format**: API key from Pi Developer Portal (sandbox)
- **Scope**: Railway, Local
- **Required**: Yes
- **Testnet Note**: MUST be sandbox/testnet API key, NOT mainnet

### 4. GitHub Actions Secrets

**RAILWAY_TOKEN**
- **Purpose**: Railway API token for CLI operations in CI/CD
- **Format**: Railway CLI token
- **Scope**: GitHub Actions only
- **Required**: Yes (for automated deployments)
- **Generation**: Run `railway login` then `railway whoami --token`
- **Permissions**: Deploy access to Railway project

**GHCR_TOKEN**
- **Purpose**: GitHub Container Registry token for pushing Docker images
- **Format**: GitHub Personal Access Token
- **Scope**: GitHub Actions only
- **Required**: Yes (for image builds)
- **Permissions**: `write:packages`, `read:packages`
- **Generation**: GitHub Settings → Developer settings → Personal access tokens

### 5. Optional Configuration Secrets

**POSTGRES_USER** (for local Docker Compose)
- **Purpose**: PostgreSQL username for local guardian database
- **Format**: Alphanumeric string
- **Scope**: Local only
- **Required**: No (has default: `testnet_user`)
- **Testnet Note**: Use separate credentials from production

**POSTGRES_PASSWORD** (for local Docker Compose)
- **Purpose**: PostgreSQL password for local guardian database
- **Format**: Secure random string
- **Scope**: Local only
- **Required**: No (has default: `testnet_password`)
- **Testnet Note**: Use separate credentials from production

**SESSION_SECRET**
- **Purpose**: Flask session encryption key
- **Format**: Random secure string
- **Scope**: Railway, Local
- **Required**: No (Flask will generate if missing)
- **Generation**: `openssl rand -hex 24`

## Safety-Critical Variables (Not Secrets)

These are configuration variables that MUST be set correctly for safety:

**APP_ENVIRONMENT** (REQUIRED)
- **Value**: `testnet` (MUST be exactly this)
- **Purpose**: Enforces testnet-only operations
- **Validation**: Deployment aborts if not `testnet`

**NFT_MINT_VALUE** (REQUIRED)
- **Value**: `0` (zero)
- **Purpose**: Ensures all NFT mints are zero-value (testnet safe)
- **Validation**: Deployment aborts if non-zero

**PI_NETWORK_MODE** (REQUIRED)
- **Value**: `sandbox`
- **Purpose**: Forces Pi SDK to use testnet/sandbox endpoints
- **Validation**: Deployment aborts if not `sandbox`

**PI_SANDBOX_MODE** (REQUIRED)
- **Value**: `true`
- **Purpose**: Additional Pi SDK safety flag
- **Validation**: Deployment aborts if not `true`

**GUARDIAN_KILL_SWITCH** (Optional)
- **Value**: `off` (default) or `on` (emergency stop)
- **Purpose**: Emergency halt of all guardian operations
- **Validation**: Deployment aborts if `on` (unless testing)

## Prohibited Variables

These variables MUST NOT exist in testnet deployments:

**FORCE_DEPLOY_TO_MAINNET**
- **Why Prohibited**: Would bypass all safety checks
- **Enforcement**: GitHub Actions pre-deployment check fails if present
- **Mainnet**: Only allowed in separate mainnet PR with 5/5 guardian approvals

## Recommended Secret Scopes

### Railway Environment Variables

Configure in Railway Dashboard → Project Settings → Variables:

**Production Testnet Service:**
```
SUPABASE_URL=<testnet-supabase-url>
SUPABASE_KEY=<testnet-supabase-key>
JWT_SECRET=<testnet-jwt-secret>
PI_NETWORK_APP_ID=<sandbox-app-id>
PI_NETWORK_API_KEY=<sandbox-api-key>
APP_ENVIRONMENT=testnet
NFT_MINT_VALUE=0
PI_NETWORK_MODE=sandbox
PI_SANDBOX_MODE=true
LOG_LEVEL=INFO
```

### GitHub Actions Secrets

Configure in GitHub Repository → Settings → Secrets and Variables → Actions:

**Repository Secrets:**
```
RAILWAY_TOKEN=<railway-cli-token>
GHCR_TOKEN=<github-container-registry-token>
SUPABASE_URL=<testnet-supabase-url>
SUPABASE_KEY=<testnet-supabase-key>
```

### Local Development (.env)

Create `.env` file in repository root (automatically ignored by `.gitignore`):

```bash
# Copy template
cp .env.example .env

# Edit .env and set testnet values
# NEVER commit this file
```

## Secret Rotation Policy

### Recommended Rotation Schedule

- **JWT_SECRET**: Every 90 days
- **SUPABASE_KEY**: When compromised or annually
- **PI_NETWORK_API_KEY**: When compromised or bi-annually
- **RAILWAY_TOKEN**: When team members change or annually
- **GHCR_TOKEN**: When compromised or annually

### Rotation Procedure

1. Generate new secret value using appropriate method
2. Update in Railway Dashboard (if applicable)
3. Update in GitHub Secrets (if applicable)
4. Update in local `.env` (if applicable)
5. Test deployment with new secret
6. Document rotation in team log
7. Invalidate old secret (if possible)

## Security Best Practices

### Secret Generation

✅ **DO**:
- Use cryptographically secure random generators
- Use at least 32 characters for symmetric keys
- Use separate secrets for testnet and production
- Store secrets in password manager
- Use Railway/GitHub secret management

❌ **DO NOT**:
- Reuse secrets across environments
- Use predictable or weak secrets
- Share secrets via chat/email
- Commit secrets to repository
- Store secrets in code comments

### Access Control

- **Railway**: Grant minimum required permissions
- **GitHub**: Use fine-grained personal access tokens
- **Supabase**: Use RLS policies and separate projects
- **Team Access**: Document who has access to what secrets

### Incident Response

If a secret is compromised:

1. **Immediate**: Rotate the secret in all systems
2. **Audit**: Check logs for unauthorized usage
3. **Notify**: Inform team and stakeholders
4. **Document**: Record incident and remediation
5. **Review**: Update security practices if needed

## Compliance & Audit

### Audit Checklist

- [ ] All secrets stored in secure secret management systems
- [ ] No secrets committed to repository (run `git log -p | grep -i secret`)
- [ ] Separate secrets for testnet and production
- [ ] All team members using unique credentials (no shared secrets)
- [ ] Secret rotation schedule documented and followed
- [ ] Incident response plan documented
- [ ] Access logs reviewed monthly

### Tools for Secret Scanning

```bash
# Check for accidentally committed secrets
git log -p | grep -E "(api_key|secret|password|token)" | grep -v ".env.example"

# Use GitHub's secret scanning (automatically enabled)
# Use git-secrets or similar tools

# Verify .env is gitignored
git check-ignore .env
```

## Support

If you have questions about secrets or need help:

1. **Never share secret values** in issues or discussions
2. Open a GitHub Discussion for general secret management questions
3. Contact repository maintainers privately for secret rotation assistance
4. Report suspected compromises immediately via private security advisory

---

## Mainnet Secret Requirements

Mainnet deployments (separate PR with guardian approvals) require additional secrets:

- Production Supabase credentials (separate project)
- Production Pi Network app credentials (mainnet, not sandbox)
- Production-grade JWT secret (rotated independently)
- Enhanced monitoring and alerting credentials
- Incident response contact information

**Mainnet secrets MUST NEVER be used in testnet deployments.**

---

**Remember**: The security of Pi Forge Quantum Genesis depends on proper secret management. When in doubt, rotate secrets and seek guidance.
