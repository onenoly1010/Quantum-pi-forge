# 📡 API Documentation - Pi Forge Quantum Genesis

## Overview

Pi Forge Quantum Genesis provides multiple API layers for different purposes. This document serves as a central reference for all API documentation.

---

## FastAPI - Main REST API (Port 8000)

### Interactive Documentation

The FastAPI application provides auto-generated interactive API documentation:

- **Swagger UI**: `http://localhost:8000/docs` (local) or `https://pi-forge-quantum-genesis.railway.app/docs` (production)
- **ReDoc**: `http://localhost:8000/redoc` (local) or `https://pi-forge-quantum-genesis.railway.app/redoc` (production)

> **Note:** For the most current deployment status, see [DEPLOYMENT_STATUS.md](./DEPLOYMENT_STATUS.md)

### Core Endpoints

#### Authentication

```http
POST /api/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "secure_password"
}
```

```http
POST /api/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "secure_password"
}
```

**Response**:
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "token_type": "bearer",
  "user": {
    "id": "user-id",
    "email": "user@example.com"
  }
}
```

#### Health & Status

```http
GET /
```

**Response**:
```json
{
  "status": "healthy",
  "service": "FastAPI",
  "version": "2.0"
}
```

```http
GET /api/health
```

**Response**:
```json
{
  "status": "healthy",
  "database": "connected",
  "pi_network": "operational",
  "timestamp": "2025-12-14T19:05:00Z"
}
```

#### Pi Network Integration

See [Pi Network Payment API Reference](./PI_PAYMENT_API_REFERENCE.md) for complete documentation.

**Quick reference**:

```http
POST /api/payments/approve
Authorization: Bearer <token>
Content-Type: application/json

{
  "payment_id": "payment-id",
  "amount": 0.15
}
```

```http
POST /api/payments/complete
Authorization: Bearer <token>
Content-Type: application/json

{
  "payment_id": "payment-id",
  "txid": "transaction-hash"
}
```

```http
GET /api/pi-network/status
```

**Response**:
```json
{
  "mode": "testnet",
  "api_ready": true,
  "endpoints_available": 13,
  "last_check": "2025-12-14T19:00:00Z"
}
```

#### Autonomous Decision API

```http
POST /api/autonomous/decision
Authorization: Bearer <guardian-token>
Content-Type: application/json

{
  "decision_type": "deployment",
  "priority": "high",
  "parameters": [
    {
      "name": "test_coverage",
      "value": 0.95,
      "threshold": 0.8,
      "weight": 0.5
    }
  ],
  "source": "ci-pipeline"
}
```

**Response**:
```json
{
  "decision_id": "deployment_1234567890",
  "decision_type": "deployment",
  "approved": true,
  "confidence": 0.95,
  "reasoning": "High test coverage and successful CI pipeline",
  "actions": ["deploy_to_production"],
  "requires_guardian": false,
  "timestamp": 1734200700.123
}
```

```http
GET /api/autonomous/decision-history?limit=50&decision_type=deployment
Authorization: Bearer <guardian-token>
```

```http
GET /api/autonomous/metrics
Authorization: Bearer <guardian-token>
```

**Response**:
```json
{
  "metrics": {
    "total_decisions": 150,
    "approval_rate": 0.87,
    "average_confidence": 0.89,
    "guardian_required_rate": 0.13,
    "by_type": {
      "deployment": {"count": 50, "approval_rate": 0.92},
      "scaling": {"count": 40, "approval_rate": 0.85},
      "healing": {"count": 35, "approval_rate": 0.90},
      "rollback": {"count": 15, "approval_rate": 0.75},
      "monitoring": {"count": 10, "approval_rate": 0.95}
    }
  }
}
```

#### Guardian Dashboard API

```http
GET /api/guardian/dashboard
Authorization: Bearer <guardian-token>
```

**Response**:
```json
{
  "system_status": "healthy",
  "pending_decisions": 3,
  "recent_actions": [
    {
      "id": "deployment_123",
      "type": "deployment",
      "approved": true,
      "timestamp": "2025-12-14T18:30:00Z"
    }
  ],
  "safety_metrics": {
    "transaction_safety": 0.95,
    "ethical_compliance": 0.92,
    "security_score": 0.88,
    "overall": 0.92
  },
  "alerts": []
}
```

```http
POST /api/guardian/approve/{decision_id}
Authorization: Bearer <guardian-token>
Content-Type: application/json

{
  "approved": true,
  "comments": "Approved after review"
}
```

```http
POST /api/guardian/emergency-stop
Authorization: Bearer <guardian-token>
Content-Type: application/json

{
  "reason": "Critical incident detected",
  "guardian_id": "guardian-user-id"
}
```

```http
POST /api/guardian/resume
Authorization: Bearer <guardian-token>
Content-Type: application/json

{
  "confirmed": true,
  "guardian_id": "guardian-user-id"
}
```

#### WebSocket API

```javascript
// Connect to WebSocket
const ws = new WebSocket('wss://pi-forge-quantum-genesis.railway.app/ws/collective-insight?token=<jwt-token>');

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Received:', data);
};

ws.send(JSON.stringify({
  type: 'subscribe',
  channels: ['system_status', 'decisions', 'alerts']
}));
```

**Message Types**:
- `system_status`: Real-time system health updates
- `decision`: New autonomous decision made
- `alert`: System alerts and notifications
- `resonance`: Pi Network payment resonance events

---

## Flask Dashboard API (Port 5000)

### Health Check

```http
GET /health
```

**Response**: HTML health status page

### Resonance Visualization

```http
GET /resonance/{transaction_hash}
```

**Response**: HTML page with SVG resonance visualization

### Dashboard Routes

```http
GET /dashboard
```

**Response**: Interactive dashboard with quantum visualizations

---

## Gradio Interface (Port 7860)

### Ethical AI Audit Interface

Access via web browser: `http://localhost:7860` (local) or `https://quantum-resonance-clean.vercel.app` (production)

**Features**:
- AI model evaluation
- Bias detection
- Ethical compliance checking
- Transparency scoring

**Programmatic Access**: See [Gradio API documentation](https://www.gradio.app/docs/api_info)

---

## Vercel Serverless Functions

### Autonomous Metrics API

```http
POST /api/autonomous-metrics
Content-Type: application/json

{
  "metric_type": "decision",
  "data": {
    "decision_id": "deployment_123",
    "confidence": 0.95,
    "approved": true
  },
  "timestamp": "2025-12-14T19:00:00Z"
}
```

```http
GET /api/autonomous-metrics?metric_type=decision&limit=50
```

### Pi Network Callbacks

```http
POST /api/pi-identify
Content-Type: application/json

{
  "user_uid": "user-pi-uid",
  "username": "pi-username"
}
```

**Response**:
```json
{
  "success": true,
  "user_id": "internal-user-id"
}
```

---

## Smart Contract API (Pi Network Blockchain)

See [Smart Contracts README](../contracts/README.md) for complete documentation.

### OINIO Token (ERC-20)

**Contract**: `OINIOToken`  
**Network**: Pi Network (Testnet: 2025, Mainnet: 314159)

**Methods**:
```solidity
// Query balance
function balanceOf(address account) external view returns (uint256)

// Transfer tokens
function transfer(address to, uint256 amount) external returns (bool)

// Approve spending
function approve(address spender, uint256 amount) external returns (bool)

// Burn tokens
function burn(uint256 amount) external
```

### OINIO Model Registry (ERC-721)

**Contract**: `OINIOModelRegistry`  
**Network**: Pi Network (Testnet: 2025, Mainnet: 314159)

**Methods**:
```solidity
// Register AI model
function registerModel(
    string memory name,
    string memory metadataURI,
    uint256 stakeAmount
) external returns (uint256)

// Get model details
function getModel(uint256 modelId) external view returns (AIModel memory)

// Get models by creator
function getModelsByCreator(address creator) external view returns (uint256[] memory)

// Update model metadata
function updateModelMetadata(uint256 modelId, string memory metadataURI) external

// Transfer model ownership
function transferModel(address to, uint256 modelId) external
```

**Example Usage (Web3.js)**:
```javascript
const OINIOTokenABI = require('./out/OINIOToken.sol/OINIOToken.json').abi;
const token = new web3.eth.Contract(OINIOTokenABI, tokenAddress);

// Check balance
const balance = await token.methods.balanceOf(userAddress).call();

// Transfer tokens
await token.methods.transfer(recipient, amount).send({ from: userAddress });
```

**Example Usage (Ethers.js)**:
```javascript
const OINIOModelRegistryABI = require('./out/OINIOModelRegistry.sol/OINIOModelRegistry.json').abi;
const registry = new ethers.Contract(registryAddress, OINIOModelRegistryABI, signer);

// Register model
const tx1 = await token.approve(registryAddress, stakeAmount);
await tx1.wait();

const tx2 = await registry.registerModel(name, metadataURI, stakeAmount);
await tx2.wait();
```

---

## Authentication & Authorization

### JWT Token Authentication

All protected endpoints require a JWT token in the `Authorization` header:

```http
Authorization: Bearer <jwt-token>
```

**Token Structure**:
```json
{
  "sub": "user-id",
  "email": "user@example.com",
  "exp": 1734287100,
  "iat": 1734200700
}
```

**Token Expiration**: 24 hours

### Guardian Authentication

Guardian endpoints require special guardian-level JWT tokens with elevated permissions.

**Permissions**:
- Approve/reject autonomous decisions
- Emergency stop/resume
- Access sensitive metrics
- Override system actions

---

## Rate Limiting

| Endpoint Category | Rate Limit | Window |
|------------------|------------|--------|
| **Public endpoints** | 100 req | 1 minute |
| **Authenticated** | 1000 req | 1 minute |
| **Guardian** | 5000 req | 1 minute |
| **Payments** | 10 req | 1 minute |
| **WebSocket** | 100 messages | 1 minute |

**Rate Limit Headers**:
```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 950
X-RateLimit-Reset: 1734200760
```

---

## Error Responses

All APIs use consistent error response format:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": "Additional context or debugging info",
    "timestamp": "2025-12-14T19:00:00Z"
  }
}
```

**Common Error Codes**:
- `400` - Bad Request: Invalid input
- `401` - Unauthorized: Missing or invalid token
- `403` - Forbidden: Insufficient permissions
- `404` - Not Found: Resource doesn't exist
- `429` - Too Many Requests: Rate limit exceeded
- `500` - Internal Server Error: Server-side issue
- `503` - Service Unavailable: Temporary outage

---

## Testing & Development

### Local Development

```bash
# Start FastAPI with auto-reload
uvicorn server.main:app --reload --host 0.0.0.0 --port 8000

# Access interactive docs
open http://localhost:8000/docs
```

### Testing Endpoints

```bash
# Health check
curl http://localhost:8000/

# Login (get token)
TOKEN=$(curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}' | jq -r .access_token)

# Use token
curl http://localhost:8000/api/guardian/dashboard \
  -H "Authorization: Bearer $TOKEN"
```

### API Testing Tools

- **Postman**: Import OpenAPI spec from `/docs`
- **Insomnia**: Use `/docs` endpoint
- **curl**: Command-line testing
- **httpie**: User-friendly HTTP client
- **pytest**: Automated testing (see `server/test_*.py`)

---

## API Versioning

**Current Version**: 2.0

**Version Strategy**:
- Major version in URL path (future: `/api/v2/...`)
- Current endpoints support backward compatibility
- Breaking changes will require new major version

---

## WebSocket Events Reference

### Client → Server

```json
// Subscribe to channels
{
  "type": "subscribe",
  "channels": ["system_status", "decisions", "alerts"]
}

// Unsubscribe from channels
{
  "type": "unsubscribe",
  "channels": ["decisions"]
}

// Send action
{
  "type": "action",
  "action": "trigger_resonance",
  "data": {
    "transaction_hash": "0x..."
  }
}
```

### Server → Client

```json
// System status update
{
  "type": "system_status",
  "status": "healthy",
  "timestamp": "2025-12-14T19:00:00Z"
}

// Decision notification
{
  "type": "decision",
  "decision_id": "deployment_123",
  "decision_type": "deployment",
  "approved": true,
  "confidence": 0.95
}

// Alert notification
{
  "type": "alert",
  "priority": "high",
  "message": "High memory usage detected",
  "timestamp": "2025-12-14T19:00:00Z"
}

// Resonance event
{
  "type": "resonance",
  "transaction_hash": "0x...",
  "phase": "foundation",
  "progress": 0.25
}
```

---

## Additional Resources

- **Pi Network Integration**: [PI_NETWORK_INTEGRATION.md](./PI_NETWORK_INTEGRATION.md)
- **Pi Payment API**: [PI_PAYMENT_API_REFERENCE.md](./PI_PAYMENT_API_REFERENCE.md)
- **Quick Reference**: [PI_NETWORK_QUICK_REFERENCE.md](./PI_NETWORK_QUICK_REFERENCE.md)
- **Smart Contracts**: [contracts/README.md](../contracts/README.md)
- **Architecture**: [ARCHITECTURE.md](./ARCHITECTURE.md)
- **Quick Start**: [QUICK_START.md](./QUICK_START.md)

---

## Support

For API-related questions or issues:
- **GitHub Issues**: [Report API bugs](https://github.com/onenoly1010/pi-forge-quantum-genesis/issues)
- **Documentation**: [View all docs](https://github.com/onenoly1010/pi-forge-quantum-genesis/tree/main/docs)
- **Interactive Docs**: Access `/docs` endpoint for live API exploration

---

**Last Updated**: December 2025  
**API Version**: 2.0  
**Status**: Production Ready
