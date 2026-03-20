# Render Deployment Setup Guide

## Overview

This guide provides step-by-step instructions for deploying the Pi Forge Quantum Genesis backend to Render.

## Prerequisites

- Render account ([https://render.com](https://render.com))
- GitHub repository with your code
- Environment variables configured

## Step-by-Step Deployment

### 1. Connect Your Repository

1. Log in to your Render dashboard
2. Click "New" → "Web Service"
3. Connect your GitHub repository (pi-forge-quantum-genesis)
4. Select the main branch

### 2. Configure Build Settings

- **Name**: pi-forge-backend (or your preferred name)
- **Environment**: Docker
- **Region**: Choose the closest region to your users
- **Branch**: main (or your deployment branch)
- **Root Directory**: Leave empty (deploys from root)
- **Dockerfile Path**: Dockerfile (should auto-detect)

### 3. Environment Variables

Add the following environment variables in Render:

#### Required Variables

```bash
PORT=8000
PYTHON_VERSION=3.11
```

#### Application Variables

```bash
# Database
DATABASE_URL=postgresql://...

# Pi Network
PI_API_KEY=your_pi_api_key
PI_APP_ID=your_pi_app_id

# Other secrets as needed
```

### 4. Deploy

1. Click "Create Web Service"
2. Render will build and deploy automatically
3. Monitor the build logs for any issues

### 5. Health Check

Once deployed, verify the service is running:

- Visit `https://your-service-name.onrender.com/health`
- Should return a 200 status with health information

### 6. Update Frontend

After deployment, update your Vercel frontend:

1. Go to Vercel dashboard
2. Update `NEXT_PUBLIC_BACKEND_URL` to `https://your-service-name.onrender.com`

## Troubleshooting

### Build Failures

- Check Dockerfile syntax
- Ensure all dependencies are in requirements.txt
- Verify Python version compatibility

### Runtime Issues

- Check environment variables are set correctly
- Review application logs in Render dashboard
- Ensure database connectivity

### Port Issues

- Render assigns dynamic ports, but our Dockerfile uses PORT env var
- Make sure the service binds to 0.0.0.0:$PORT

## Cost Optimization

- Free tier: 750 hours/month
- Paid plans start at $7/month for 1000 hours
- Consider scaling based on usage

## Security Notes

- Never commit secrets to code
- Use Render's environment variable system
- Enable HTTPS (Render provides automatically)
- Consider adding rate limiting for production

## Next Steps

- Set up monitoring and alerts
- Configure custom domain if needed
- Set up staging environment for testing
