# Deployment Notes

> **📌 Note**: This document is part of the deployment documentation suite.  
> For the complete deployment guide, see the **[Deployment Dashboard](docs/DEPLOYMENT_DASHBOARD.md)**.

## Vercel Deployment
## ⚠️ Important: Repository Purpose

**This repository is a COORDINATION HUB, not a deployable application.**

This repo serves as:
- Governance and documentation center for the Quantum Pi Forge ecosystem
- Coordination space for multi-repo workflows
- GitHub Agent operational base
- Canon of Autonomy preservation

**For production deployments, refer to the appropriate service repositories:**
- **Public Site**: `quantum-pi-forge-site` → GitHub Pages
- **Backend API**: Deployed to Railway from this repo's `/server` directory
- **Resonance Engine**: `quantum-resonance-clean` → Vercel

---

## Vercel Deployment (Optional Documentation Hosting)

**Note**: Vercel deployment is OPTIONAL and used primarily for:
- Static documentation hosting
- Development preview environments  
- Build verification in CI/CD

**This is NOT a production application deployment.**

### When to Use Vercel for This Repo

✅ **Use Vercel if you want to**:
- Host static documentation pages
- Preview changes to HTML interfaces
- Test build processes

❌ **Do NOT use Vercel if**:
- You're looking for the main production site (use `quantum-pi-forge-site` instead)
- You need the backend API (deployed via Railway)
- You expect a full-featured web application

### How to Disconnect from Vercel

If this repository was accidentally connected to Vercel:

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Find the `pi-forge-quantum-genesis` project
3. Navigate to **Settings** → **General**
4. Scroll to **Delete Project**
5. Confirm deletion

The repository will continue to function normally without Vercel.

---

### Build Configuration (If Using Vercel)

e- **Framework**: None (static site with custom build)
- **Build Command**: `npm run build`
- **Output Directory**: `.vercel/output/static` (Vercel Build Output API v3)
- **Node.js Version**: 20.x (pinned to major version 20)

The build process:
1. Creates `.vercel/output/static` directory
2. Generates `config.json` with routing rules
3. Copies static HTML files (index.html, ceremonial_interface.html, etc.)
4. Copies static JavaScript files (pi-forge-integration.js)

**Important**: This repository uses Vercel Build Output API v3 format, not the traditional `public` directory. The `vercel.json` file explicitly sets `"framework": null` to prevent framework auto-detection.

### Environment Variables

Set these in your Vercel project settings:
- `PI_APP_SECRET` - Required for Pi Network authentication
- `GUARDIAN_SLACK_WEBHOOK_URL` - Optional for Slack alerts
- `MAILGUN_DOMAIN` and `MAILGUN_API_KEY` - Optional for email alerts
- `SENDGRID_API_KEY` and `SENDGRID_FROM` - Optional for SendGrid emails

### Serverless Functions

API endpoints in the `api/` directory are automatically deployed as Vercel serverless functions:
- `/api/pi-identify` - Pi Network authentication endpoint

### Local Testing

To test the build locally:
```bash
npm install
npm run build
```

The `.vercel/output/static` directory will contain all deployable assets, and `.vercel/output/config.json` will contain the routing configuration.

---

## Render Deployment (Backend)

The backend is now deployed on Render using Docker containerization:

### Docker Configuration

- **Dockerfile**: Multi-stage build with Python 3.11
- **Service Type**: Web Service
- **Build Command**: `docker build -t pi-forge-backend .`
- **Start Command**: `cd server && uvicorn main:app --host 0.0.0.0 --port $PORT`

### Environment Variables

Set these in your Render service environment variables:
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_KEY` - Supabase anon/public key
- `SECRET_KEY` - Application secret key (generate random string)
- `PI_APP_SECRET` - Pi Network application secret
- `GUARDIAN_SLACK_WEBHOOK_URL` - Optional Slack webhook for alerts
- `MAILGUN_DOMAIN` and `MAILGUN_API_KEY` - Optional for email alerts
- `SENDGRID_API_KEY` and `SENDGRID_FROM` - Optional for SendGrid emails
- `OPENAI_API_KEY` - Optional for AI features
- `ANTHROPIC_API_KEY` - Optional for AI features
- `SENTRY_DSN` - Optional for error tracking

### Health Checks

- **Health Check Path**: `/health`
- **Health Check Timeout**: 30 seconds

### Deployment Notes

- The service is configured to auto-deploy from the main branch
- Docker build context is the root directory
- Production URL: https://pi-forge-quantum-genesis-1.onrender.com

---

## Railway Deployment (Deprecated)

**Note**: Railway deployment is deprecated. Use Render for new deployments.

This repository includes a `railway.toml` to assist with Railway deployments. Quick notes:

- Start command used by Railway (in railway.toml):

```
cd server && uvicorn main:app --host 0.0.0.0 --port $PORT
```

- Ensure the following environment variables are set in Railway project settings:
  - `SUPABASE_URL` and `SUPABASE_KEY` if using Supabase integration
  - `SECRET_KEY` for application secrets
  - `DATABASE_URL` if you use a database
  - Any tracing/sentry/API keys (e.g., `SENTRY_DSN`)

- If your application relies on X-Forwarded-For headers for rate limiting, ensure Railway provides these headers or adjust proxy settings.

- For production, consider using Gunicorn with Uvicorn workers. Example start command:

```
cd server && exec gunicorn -k uvicorn.workers.UvicornWorker main:app -b 0.0.0.0:$PORT -w 4
```

- Healthcheck endpoints available:
  - `/health` (lightweight)
  - `/` (detailed health_check)
