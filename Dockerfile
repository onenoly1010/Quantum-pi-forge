# Multi-stage Docker build for Quantum Resonance Lattice
FROM python:3.11-slim as base

# Install system dependencies + Node.js 20 LTS
RUN apt-get update && apt-get install -y \
    curl \
    build-essential \
    gnupg \
    && curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/trusted.gpg.d/nodesource.gpg \
    && echo "deb https://deb.nodesource.com/node_20.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list \
    && apt-get update && apt-get install -y nodejs

# Set environment variables
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONPATH=/app

WORKDIR /app

# Development stage with hot reload
FROM base as development

# Copy requirements first for better caching
COPY server/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY server/ ./server/
COPY frontend/ ./frontend/

# Create non-root user for development
RUN useradd --create-home --shell /bin/bash app \
    && chown -R app:app /app
USER app

# Development command with hot reload
CMD ["python", "-m", "uvicorn", "server.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload", "--reload-dir", "/app"]

# Production stage
FROM python:3.11-slim as production

# COPY NODE.JS DIRECTLY FROM OFFICIAL IMAGE. NO MORE APT. NO MORE DOWNLOADS.
COPY --from=node:20.18.3-bullseye-slim /usr/local/bin/node /usr/local/bin/node
COPY --from=node:20.18.3-bullseye-slim /usr/local/lib/node_modules /usr/local/lib/node_modules
RUN ln -s /usr/local/lib/node_modules/npm/bin/npm-cli.js /usr/local/bin/npm

# Install minimal system dependencies only
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Set environment variables
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONPATH=/app

WORKDIR /app

# Copy requirements and install
COPY server/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code to /app root (not /app/server)
COPY server/ ./

# Create non-root user
RUN useradd --create-home --shell /bin/bash app \
    && chown -R app:app /app

# Ensure node is in PATH for non-root user
ENV PATH="/usr/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"

USER app

# Health check for Railway - use PORT env var
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:${PORT:-8000}/health || exit 1

# Production command - Railway provides $PORT dynamically
# Use shell form to allow environment variable expansion
CMD sh -c "python -m uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}"
