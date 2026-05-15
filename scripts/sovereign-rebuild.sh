#!/bin/bash
# 0G Aristotle Continuity Protocol
echo "--- Starting Resonance Worker Rebuild ---"

# 1. Clean Environment
docker rm -f oinio-worker 2>/dev/null
docker rmi oinio-resonance-worker 2>/dev/null

# 2. Re-establish Build Definition
cat <<DOCKER > Dockerfile
FROM node:20-slim
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
# Dynamic entry point discovery
CMD ["sh", "-c", "node \$(find . -name index.js | head -n 1)"]
DOCKER

# 3. Build & Launch
docker build -t oinio-resonance-worker:2026.05.14 .
docker tag oinio-resonance-worker:2026.05.14 oinio-resonance-worker:latest
docker run -d --name oinio-worker oinio-resonance-worker:latest

# 4. Immediate Forensic Verification
echo "--- Monitoring Startup Heartbeat ---"
sleep 5
docker logs oinio-worker
