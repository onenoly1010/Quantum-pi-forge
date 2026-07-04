# EPI v1.5 - Minimal Hermetic Environment for Deterministic Proof
# Purpose: Prove table → JSON → Hash pipeline is reproducible

FROM debian:bookworm-20240211-slim

ENV SOURCE_DATE_EPOCH=1713360000 \
    LANG=C.UTF-8 \
    LC_ALL=C.UTF-8 \
    TZ=UTC \
    DEBIAN_FRONTEND=noninteractive \
    PYTHONUNBUFFERED=1 \
    GIT_TERMINAL_PROMPT=0

# Pin apt to the same bookworm snapshot as the base image. Live Debian mirrors
# no longer serve these exact package revisions, which broke determinism CI.
RUN printf '%s\n' \
    'Types: deb' \
    'URIs: http://snapshot.debian.org/archive/debian/20240211T000000Z' \
    'Suites: bookworm' \
    'Components: main' \
    'Check-Valid-Until: no' \
    '' \
    'Types: deb' \
    'URIs: http://snapshot.debian.org/archive/debian-security/20240211T000000Z' \
    'Suites: bookworm-security' \
    'Components: main' \
    'Check-Valid-Until: no' \
    > /etc/apt/sources.list.d/debian.sources

# Install only required pinned packages (add exact versions from v1.3 if more needed)
RUN apt-get update && apt-get install -y --no-install-recommends \
    git=1:2.39.2-1.1 \
    jq=1.6-2.1 \
    ca-certificates=20230311 \
    curl=7.88.1-10+deb12u5 \
    python3.11=3.11.2-6 \
    && rm -rf /var/lib/apt/lists/* /var/cache/apt/* \
    && apt-get clean

# Non-privileged auditor user. UID/GID 1001 matches GitHub Actions ubuntu-latest
# runner so bind-mounted ./output (created by the workflow) is writable in CI.
RUN groupadd -g 1001 auditor && \
    useradd -m -s /bin/bash -u 1001 -g 1001 auditor && \
    mkdir -p /forge/output && \
    chown -R auditor:auditor /forge && \
    chmod 775 /forge/output

WORKDIR /forge
USER auditor

# Copy pipeline assets (keep .dockerignore clean to avoid sending unnecessary files)
COPY --chown=auditor:auditor ./scripts/epi-reproduce.sh ./scripts/
COPY --chown=auditor:auditor ./EVIDENCE_BINDING_LAYER_EPI_v1.0_NORMALIZED.md ./

# Enforce contract: run transformation, output manifest + SHA-256, exit cleanly
ENTRYPOINT ["/bin/bash", "./scripts/epi-reproduce.sh"]
CMD ["--verify"]