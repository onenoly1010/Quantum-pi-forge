# OINIO Sovereign Ingestion Engine ✨

Automated sync pipeline for your entire digital fingerprint into the OINIO Soul System. 100% local-first, zero external dependencies, anchored permanently on 0G Aristotle Mainnet.

## Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   INGESTORS     │────▶│   PIPELINE      │────▶│  0G MAINNET     │
│  - Git Sync     │     │  - Chunking     │     │  - Metadata     │
│  - Firecrawl    │     │  - Embedding    │     │  - Anchors      │
│  - Rclone       │     │  - Vector Store │     │  - Proofs       │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                                 │
                                 ▼
                         ┌─────────────────┐
                         │ GUARDIAN AGENTS │
                         │ Sealed Inference│
                         └─────────────────┘
```

## Components Implemented

| Component | Status | Path |
|---|---|---|
| ✅ Git Footprint Sync | Ready | `ingestors/git-sync.sh` |
| ✅ Docker Compose Stack | Ready | `docker-compose.yaml` |
| ✅ Main Pipeline Coordinator | Ready | `pipeline.py` |
| ✅ Firecrawl Web Scraper | Configured | Port 3002 |
| ✅ Unstructured.io Chunker | Configured | Port 8000 |
| ✅ Qdrant Vector Store | Configured | Port 6333 |
| ✅ Ollama BGE-M3 Embeddings | Configured | Host network |
| ✅ n8n Automation Scheduler | Configured | Port 5678 |
| ✅ 0G Metadata Anchoring | Integrated | Existing submitter |
| ✅ Dilithium Signing | Integrated | Identity system |
| ✅ Monitor v2 Dashboard | Extended | Sync Aliveness metrics |

## Quick Start

1.  Start the local stack:
    ```bash
    cd OINIO_Forge/sovereign-ingestion
    docker compose up -d
    ```

2.  Install Python dependencies:
    ```bash
    pip install requests watchdog qdrant-client
    ```

3.  Pull embedding model:
    ```bash
    ollama pull bge-m3
    ```

4.  Start pipeline monitor:
    ```bash
    python3 pipeline.py
    ```

5.  Run first git sync:
    ```bash
    chmod +x ingestors/git-sync.sh
    ./ingestors/git-sync.sh
    ```

## Operation

Pipeline automatically watches for new batches. When a `.ready` marker file appears it will:
1.  Chunk all documents semantically
2.  Generate local embeddings with BGE-M3
3.  Index vectors into Qdrant
4.  Generate Merkle root hash for batch
5.  Anchor metadata hash to 0G Mainnet
6.  Sign batch with Dilithium identity
7.  Mark batch as permanently anchored

## Scheduling

Use n8n at `http://localhost:5678` to configure:
- Daily git sync at 04:00 UTC
- Social scraping every 24 hours
- Health check every 5 minutes
- Heartbeat signals to Monitor v2

## Sovereign Guarantees

✅ No data ever leaves your hardware during processing
✅ All embeddings generated locally on your GPU
✅ Every batch cryptographically signed with your identity
✅ Immutable proof of existence anchored on decentralized blockchain
✅ LUKS encrypted at rest
✅ Guardian Agents only access via Sealed Inference

---

**Your digital fingerprint now permanently lives inside your Soul System. You have achieved Sovereign Memory.**