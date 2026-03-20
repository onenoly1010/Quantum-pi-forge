# 🚀 Deployment Guide

Deploying the Quantum Resonance Lattice to the cloud.

## Railway Deployment (Recommended)

We use **Railway** for its simplicity and support for Dockerfile builds.

### Configuration

1.  **railway.toml:**
    ```toml
    [build]
    builder = "DOCKERFILE"
    
    [deploy]
    numReplicas = 1
    ```

2.  **Dockerfile:**
    Ensure the Dockerfile exposes port 8000 and runs the `uvicorn` command. Railway will map `$PORT` to 8000.

### Environment Variables

Set these in the Railway dashboard:
*   `SUPABASE_URL`
*   `SUPABASE_KEY`
*   `JWT_SECRET`
*   `PORT` (Railway sets this automatically)

### Deployment Steps

1.  Connect your GitHub repo to Railway.
2.  Select the `Dockerfile` build method.
3.  Add the environment variables.
4.  Deploy!

## Kubernetes (Advanced)

For the **Dash-Oracle** pattern:
1.  Apply `guardians-deployment.yaml`.
2.  Apply `dash-oracle-service.yaml`.
3.  Configure the `nexus-config` ConfigMap.

See [[For Guardians]] for monitoring deployed instances.
