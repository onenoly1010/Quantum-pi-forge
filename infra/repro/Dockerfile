# EPI v1.5 - Minimal Hermetic Environment for Deterministic Proof
# Purpose: Prove table → JSON → Hash pipeline is reproducible

FROM debian:bookworm-20240211-slim

ENV SOURCE_DATE_EPOCH=1713360000 \
    LANG=C.UTF-8 \
    LC_ALL=C.UTF-8 \
    TZ=UTC \
    DEBIAN_FRONTEND=noninteractive \
    PYTHONUNBUFFERED=1

# Install only required pinned packages
RUN apt-get update && apt-get install -y --no-install-recommends \
    git=1:2.39.2-1.1 \
    jq=1.6-2.1 \
    ca-certificates=20230311 \
    curl=7.88.1-10+deb12u5 \
    python3.11=3.11.2-6+deb12u* \
    && rm -rf /var/lib/apt/lists/* /var/cache/apt/* \
    && apt-get clean

# Non-privileged auditor user
RUN useradd -m -s /bin/bash auditor && \
    mkdir -p /forge/output && \
    chown -R auditor:auditor /forge

WORKDIR /forge
USER auditor

# Copy pipeline assets
COPY --chown=auditor:auditor ./scripts/epi-reproduce.sh ./scripts/
COPY --chown=auditor:auditor ./EVIDENCE_BINDING_LAYER_EPI_v1.0_NORMALIZED.md ./

# Enforce contract: run transformation, output manifest + SHA-256, exit cleanly
ENTRYPOINT ["/bin/bash", "./scripts/epi-reproduce.sh"]
CMD ["--verify"]