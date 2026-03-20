# Pi Network Integration - Quick Reference

## Quick Start

```bash
# 1. Set environment variables
export PI_NETWORK_MODE=testnet
export NFT_MINT_VALUE=0
export APP_ENVIRONMENT=testnet

# 2. Start server
uvicorn server.main:app --reload
```

## API Endpoints

Base URL: `http://localhost:8000/api/pi-network`

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/authenticate` | Authenticate Pi Network user |
| POST | `/session/verify` | Verify active session |
| POST | `/logout` | Logout user |

### Payments

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/payments/create` | Create new payment |
| POST | `/payments/approve` | Approve payment |
| POST | `/payments/complete` | Complete payment with tx hash |
| POST | `/payments/verify` | Verify payment on blockchain |
| GET | `/payments/{id}` | Get payment details |
| GET | `/payments/user/{user_id}` | Get user payment history |

### System

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/status` | Integration status |
| GET | `/health` | Health check |
| GET | `/statistics` | Payment statistics |

## Code Examples

### Python (Backend)

```python
from pi_network import PiNetworkClient

client = PiNetworkClient()

# Authenticate
auth = client.authenticate_user(
    pi_uid="user123",
    username="pioneer",
    access_token="token"
)

# Create payment
payment = client.create_payment(
    amount=1.5,
    memo="Test payment",
    user_id="user123"
)

# Complete workflow
client.approve_payment(payment.payment_id)
client.complete_payment(payment.payment_id, "0x123abc")
```

### JavaScript (Frontend)

```javascript
// Initialize
await PiForge.initialize({ network: 'testnet' });

// Authenticate
const auth = await PiForge.authenticate(['payments', 'username']);

// Create payment
const payment = await PiForge.createPayment({
    amount: 1.5,
    memo: 'Test payment',
    metadata: { type: 'test' }
});
```

### cURL

```bash
# Authenticate
curl -X POST http://localhost:8000/api/pi-network/authenticate \
  -H "Content-Type: application/json" \
  -d '{
    "pi_uid": "user123",
    "username": "pioneer",
    "access_token": "token"
  }'

# Create payment
curl -X POST http://localhost:8000/api/pi-network/payments/create \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 1.5,
    "memo": "Test payment",
    "user_id": "user123"
  }'

# Get status
curl http://localhost:8000/api/pi-network/status
```

## Configuration

```bash
# Required for testnet
PI_NETWORK_MODE=testnet
NFT_MINT_VALUE=0
APP_ENVIRONMENT=testnet

# Optional
PI_NETWORK_API_KEY=your_key
PI_NETWORK_APP_ID=your_app_id
PI_NETWORK_TIMEOUT=30
PI_SANDBOX_MODE=true
```

## Testing

```bash
# Run all tests
pytest tests/test_pi_network_integration.py tests/test_pi_network_api.py -v

# Unit tests only
pytest tests/test_pi_network_integration.py -v

# API tests only
pytest tests/test_pi_network_api.py -v
```

## Common Response Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (auth failed) |
| 404 | Not Found |
| 422 | Unprocessable Entity (validation error) |
| 500 | Internal Server Error |
| 503 | Service Unavailable |

## Payment Status Flow

```
pending → approved → completed
   ↓
cancelled
```

## Session Management

- Sessions expire after: **1 hour**
- Auto-cleanup runs: **Every 5 minutes**
- Refresh before expiry: Use `refresh_session()`

## Rate Limits

- **60 requests per minute** per IP address
- Applies to all HTTP endpoints
- Returns `429 Too Many Requests` when exceeded

## Security Notes

✅ **DO:**
- Use environment variables for secrets
- Validate NFT_MINT_VALUE=0 in testnet
- Enable SSL in production
- Monitor session activity

❌ **DON'T:**
- Commit API keys to git
- Use testnet mode in production
- Skip input validation
- Ignore error responses

## Troubleshooting

### Session expired
```javascript
// Re-authenticate
await PiForge.authenticate(['payments', 'username']);
```

### Payment amount invalid
```python
# Round to 7 decimals
amount = round(1.5, 7)
```

### Background tasks not starting
```python
# Use async context manager
async with PiNetworkClient() as client:
    # Tasks start automatically
    pass
```

## Links

- Full Documentation: `/docs/PI_NETWORK_INTEGRATION.md`
- API Docs (Swagger): `http://localhost:8000/docs`
- Health Check: `http://localhost:8000/api/pi-network/health`

---

**Version**: 1.0.0  
**Last Updated**: December 2024
