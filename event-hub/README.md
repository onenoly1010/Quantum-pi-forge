# OINIO Edge Event Hub

Cloudflare Worker real-time event streaming system.

## Architecture

```
RPC Producer → Cloudflare Worker Event Hub → Browser SSE / WebSocket Clients
```

## Components

| File | Purpose |
|------|---------|
| `worker.js` | Edge event router, SSE + WebSocket endpoints, pub/sub broadcasting, state cache |
| `producer.js` | Off-edge RPC poller that fetches chain data and publishes to worker |
| `wrangler.toml` | Cloudflare Worker configuration |
| `.env` | Environment variables (copy from .env.example) |

## Features

✅ **SSE Streaming** - simple, reliable server-sent events with automatic reconnection
✅ **WebSocket Fallback** - full bidirectional support
✅ **Edge Caching** - latest state always available for new connections
✅ **Authenticated Publishing** - secure endpoint for event producers
✅ **Connection Cleanup** - automatic subscriber garbage collection
✅ **Multi-Protocol** - same event stream available over both transports

## Quick Start

### 1. Run the Worker locally
```bash
cd event-hub
npx wrangler dev
```

Worker will be running at: `http://localhost:8787`

### 2. Run the RPC Producer
```bash
cp .env.example .env
# Edit .env with your RPC and contract details
node producer.js
```

### 3. Open Monitor
```bash
open ../OINIO_Forge/monitor_v2.html
```

## Endpoints

| Path | Protocol | Purpose |
|------|----------|---------|
| `/events` | HTTP GET | SSE event stream |
| `/ws` | WebSocket | Bidirectional stream |
| `/publish` | HTTP POST | Event ingestion endpoint |
| `/status` | HTTP GET | Hub health status |

## Deployment

```bash
npx wrangler deploy
```

## Upgrade Paths

This architecture is ready for:
- Multi-region event mesh
- Durable Object ordered event logs
- Multi-source consensus engine
- Real-time anomaly detection
- On-chain verifiable event proofs

---

**Now running true edge-native event streaming architecture**