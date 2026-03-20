# Pi Network Integration Guide

## Overview

The Pi Forge Quantum Genesis platform now includes a fully operational, modular Pi Network integration that enables seamless connectivity for authentication, payments, and blockchain interactions.

## Table of Contents

1. [Architecture](#architecture)
2. [Getting Started](#getting-started)
3. [Configuration](#configuration)
4. [API Endpoints](#api-endpoints)
5. [Frontend Integration](#frontend-integration)
6. [Examples](#examples)
7. [Testing](#testing)
8. [Security](#security)
9. [Troubleshooting](#troubleshooting)

## Architecture

The Pi Network integration follows a modular, three-layer architecture:

### Core Layer (`server/pi_network/`)

- **`client.py`**: Main client interface orchestrating all Pi Network operations
- **`auth.py`**: Authentication and session management
- **`payments.py`**: Payment lifecycle management (create, approve, complete, verify)
- **`config.py`**: Configuration management with environment-based settings
- **`exceptions.py`**: Custom exception hierarchy for error handling

### API Layer (`server/pi_network_router.py`)

FastAPI router providing RESTful endpoints for:
- User authentication and session management
- Payment creation and lifecycle
- Payment verification and history
- System status and health checks

### Frontend Layer (`frontend/pi-forge-integration.js`)

JavaScript SDK for browser-based Pi Network interactions:
- Pi SDK integration
- Payment flow orchestration
- Real-time resonance visualization
- Session management

## Getting Started

### Installation

1. **Install Dependencies**

```bash
cd pi-forge-quantum-genesis
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r server/requirements.txt
```

2. **Configure Environment**

Create a `.env` file in the project root:

```bash
# Pi Network Configuration
PI_NETWORK_MODE=testnet  # or "mainnet"
PI_NETWORK_API_KEY=your_api_key_here
PI_NETWORK_APP_ID=your_app_id_here
PI_NETWORK_API_ENDPOINT=https://api.minepi.com

# Safety Settings (required for testnet)
NFT_MINT_VALUE=0
APP_ENVIRONMENT=testnet

# Optional Settings
PI_NETWORK_TIMEOUT=30
PI_NETWORK_MAX_RETRIES=3
PI_SANDBOX_MODE=true
```

3. **Start the Server**

```bash
cd server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The server will start with Pi Network integration enabled. Check the logs for confirmation:

```
✅ Pi Network background tasks started
INFO:pi_network.client:PiNetworkClient initialized: testnet mode
```

## Configuration

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `PI_NETWORK_MODE` | No | `mainnet` | Network mode: `mainnet` or `testnet` |
| `PI_NETWORK_API_KEY` | Yes* | - | Pi Network API key |
| `PI_NETWORK_APP_ID` | Yes* | - | Pi Network application ID |
| `PI_NETWORK_API_ENDPOINT` | No | `https://api.minepi.com` | Pi Network API base URL |
| `PI_SANDBOX_MODE` | No | `false` | Enable sandbox mode for testing |
| `PI_NETWORK_TIMEOUT` | No | `30` | Request timeout in seconds |
| `PI_NETWORK_MAX_RETRIES` | No | `3` | Maximum retry attempts |
| `NFT_MINT_VALUE` | Yes** | `0` | Must be 0 for testnet |
| `APP_ENVIRONMENT` | No | `testnet` | Application environment |

\* Required for production  
\** Required to be 0 for testnet/development

### Programmatic Configuration

```python
from pi_network import PiNetworkClient, PiNetworkConfig

# Create custom configuration
config = PiNetworkConfig(
    network="testnet",
    api_key="your_api_key",
    app_id="your_app_id",
    sandbox_mode=True,
    timeout=60
)

# Initialize client with custom config
client = PiNetworkClient(config)
```

## API Endpoints

All Pi Network endpoints are prefixed with `/api/pi-network`. Full API documentation is available at `/docs` when the server is running.

### Authentication

#### Authenticate User

```http
POST /api/pi-network/authenticate
Content-Type: application/json

{
  "pi_uid": "user_unique_id",
  "username": "pioneer_username",
  "access_token": "pi_access_token",
  "session_data": {  // optional
    "additional": "metadata"
  }
}
```

**Response:**
```json
{
  "status": "authenticated",
  "session_id": "session_abc123",
  "pi_uid": "user_unique_id",
  "username": "pioneer_username",
  "expires_at": 1702345678.0
}
```

#### Verify Session

```http
POST /api/pi-network/session/verify
Content-Type: application/json

{
  "session_id": "session_abc123"
}
```

#### Logout

```http
POST /api/pi-network/logout?session_id=session_abc123
```

### Payments

#### Create Payment

```http
POST /api/pi-network/payments/create
Content-Type: application/json

{
  "amount": 1.5,
  "memo": "Payment for quantum resonance boost",
  "user_id": "user_unique_id",
  "metadata": {  // optional
    "type": "mining_boost",
    "boost_percent": 50
  }
}
```

**Response:**
```json
{
  "payment_id": "pi_pay_abc123def456",
  "amount": 1.5,
  "memo": "Payment for quantum resonance boost",
  "user_id": "user_unique_id",
  "status": "pending",
  "tx_hash": null,
  "created_at": 1702345678.0,
  "metadata": {...}
}
```

#### Approve Payment

```http
POST /api/pi-network/payments/approve
Content-Type: application/json

{
  "payment_id": "pi_pay_abc123def456"
}
```

#### Complete Payment

```http
POST /api/pi-network/payments/complete
Content-Type: application/json

{
  "payment_id": "pi_pay_abc123def456",
  "tx_hash": "0x1234567890abcdef"
}
```

#### Verify Payment

```http
POST /api/pi-network/payments/verify
Content-Type: application/json

{
  "payment_id": "pi_pay_abc123def456",
  "tx_hash": "0x1234567890abcdef"
}
```

**Response:**
```json
{
  "success": true,
  "verification": {
    "verified": true,
    "payment_id": "pi_pay_abc123def456",
    "tx_hash": "0x1234567890abcdef",
    "amount": 1.5,
    "status": "completed",
    "timestamp": 1702345678.0
  }
}
```

#### Get Payment

```http
GET /api/pi-network/payments/{payment_id}
```

#### Get User Payments

```http
GET /api/pi-network/payments/user/{user_id}?status=completed&limit=50
```

Query parameters:
- `status`: Filter by payment status (pending, approved, completed, cancelled, failed)
- `limit`: Maximum number of results (default: 100, max: 100)

### System

#### Get Status

```http
GET /api/pi-network/status
```

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "network": "testnet",
    "is_testnet": true,
    "is_production": false,
    "active_sessions": 5,
    "payment_statistics": {...},
    "configuration": {...}
  }
}
```

#### Health Check

```http
GET /api/pi-network/health
```

#### Get Statistics

```http
GET /api/pi-network/statistics
```

## Frontend Integration

### Basic Setup

Include the Pi SDK and Pi Forge integration in your HTML:

```html
<script src="https://sdk.minepi.com/pi-sdk.js"></script>
<script src="/frontend/pi-forge-integration.js"></script>
```

### Initialize Pi Forge

```javascript
// Initialize with default configuration
await PiForge.initialize();

// Or with custom configuration
await PiForge.initialize({
    network: 'testnet',  // or 'mainnet'
    debug: true,
    apiBase: 'http://localhost:8000'
});
```

### Authenticate User

```javascript
// Authenticate with Pi Network
const authResult = await PiForge.authenticate(['payments', 'username']);

console.log('User authenticated:', authResult.user.username);
console.log('Session ID:', authResult.accessToken);
```

### Create Payment

```javascript
// Create a payment
const paymentResult = await PiForge.createPayment({
    amount: 2.5,
    memo: 'Mining boost activation',
    metadata: {
        type: 'mining_boost',
        boostPercent: 75
    }
});

console.log('Payment created:', paymentResult.paymentId);
console.log('Transaction hash:', paymentResult.txid);
```

### Activate Mining Boost

```javascript
// Simplified mining boost activation
const boostResult = await PiForge.activateMiningBoost(50);

console.log('Mining boost activated:', boostResult);
```

## Examples

### Complete Payment Flow (Backend)

```python
from pi_network import PiNetworkClient

# Initialize client
client = PiNetworkClient()

# Authenticate user
auth_result = client.authenticate_user(
    pi_uid="user123",
    username="pioneer_one",
    access_token="pi_token_abc"
)
session_id = auth_result["session_id"]

# Create payment
payment = client.create_payment(
    amount=1.5,
    memo="Quantum resonance boost",
    user_id="user123",
    metadata={"type": "boost"}
)

# Approve payment (server-side approval logic)
payment = client.approve_payment(payment.payment_id)

# Complete payment with blockchain transaction
payment = client.complete_payment(
    payment.payment_id,
    tx_hash="0x123abc"
)

# Verify payment
verification = client.verify_payment(
    payment.payment_id,
    "0x123abc"
)

print(f"Payment verified: {verification['verified']}")
```

### Complete Payment Flow (Frontend)

```javascript
// Initialize
await PiForge.initialize({ network: 'testnet' });

// Authenticate
const auth = await PiForge.authenticate(['payments', 'username']);

// Create and process payment
const payment = await PiForge.createPayment({
    amount: 1.0,
    memo: 'Test payment',
    metadata: { type: 'test' }
});

// The SDK handles approval and completion automatically
// Resonance visualization will trigger on completion
```

### Background Tasks

```python
import asyncio
from pi_network import PiNetworkClient

async def main():
    async with PiNetworkClient() as client:
        # Background tasks automatically start
        # (session cleanup, monitoring)
        
        # Your application logic here
        payment = client.create_payment(
            amount=1.0,
            memo="Test",
            user_id="user123"
        )
        
        await asyncio.sleep(10)
        
    # Background tasks automatically stop on context exit

asyncio.run(main())
```

## Testing

### Run Unit Tests

```bash
# Test core Pi Network module
pytest tests/test_pi_network_integration.py -v

# Test API endpoints
pytest tests/test_pi_network_api.py -v

# Run all tests
pytest tests/ -v
```

### Test Coverage

The integration includes comprehensive test coverage:

- **36 unit tests** for core modules (auth, payments, config, client)
- **20 API integration tests** for endpoints
- **Total: 56 tests** with 100% pass rate

### Manual Testing

1. **Start the server in testnet mode:**
```bash
export PI_NETWORK_MODE=testnet
export APP_ENVIRONMENT=testnet
export NFT_MINT_VALUE=0
uvicorn server.main:app --reload
```

2. **Access API documentation:**
```
http://localhost:8000/docs
```

3. **Test endpoints interactively** using the Swagger UI

## Security

### Testnet Safety

The integration includes multiple safety layers for testnet operation:

1. **Configuration Validation**: `NFT_MINT_VALUE` must be 0 in testnet
2. **Runtime Checks**: Prevents production operations in testnet mode
3. **Session Management**: Secure HMAC-based session verification
4. **Rate Limiting**: Built-in request rate limiting (60 req/min per IP)

### Best Practices

1. **Never commit API keys** to version control
2. **Use environment variables** for all sensitive configuration
3. **Enable SSL verification** in production (`PI_VERIFY_SSL=true`)
4. **Implement additional authentication** for sensitive endpoints
5. **Monitor session activity** and implement session timeouts
6. **Validate all user input** before processing payments
7. **Log all transactions** for audit trails

### Production Checklist

Before deploying to production:

- [ ] Set `PI_NETWORK_MODE=mainnet`
- [ ] Configure real Pi Network API credentials
- [ ] Set `APP_ENVIRONMENT=production`
- [ ] Enable SSL certificate verification
- [ ] Configure proper CORS origins
- [ ] Set up monitoring and alerting
- [ ] Implement backup and recovery procedures
- [ ] Review and test all payment flows
- [ ] Conduct security audit
- [ ] Set up rate limiting per user

## Troubleshooting

### Common Issues

#### Pi Network Client Initialization Failed

**Symptom**: `PiConfigurationError: Invalid network mode`

**Solution**: Check your environment variables:
```bash
echo $PI_NETWORK_MODE  # Should be 'mainnet' or 'testnet'
```

#### Session Verification Fails

**Symptom**: `401 Unauthorized: Invalid or expired session`

**Solution**: Sessions expire after 1 hour. Re-authenticate the user:
```javascript
await PiForge.authenticate(['payments', 'username']);
```

#### Payment Creation Fails

**Symptom**: `PiPaymentError: Invalid payment amount`

**Solution**: Ensure amount is positive and has max 7 decimal places:
```python
amount = round(1.5, 7)  # Correct
amount = 1.123456789    # Too many decimals
amount = -1.0           # Negative (invalid)
```

#### Background Tasks Not Starting

**Symptom**: Warning in logs about background tasks

**Solution**: Ensure you're using async context manager or calling `start_background_tasks()`:
```python
async with PiNetworkClient() as client:
    # Background tasks run automatically
    pass
```

### Debug Mode

Enable debug logging to troubleshoot issues:

```python
import logging

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger("pi_network")
logger.setLevel(logging.DEBUG)
```

### Support

For additional support:

1. Check the [API documentation](/docs)
2. Review test files for usage examples
3. Check server logs for detailed error messages
4. Open an issue on GitHub

## Maintenance

### Session Cleanup

Sessions are automatically cleaned up every 5 minutes by background tasks. Manual cleanup:

```python
from pi_network_router import pi_client

cleaned = pi_client.auth.cleanup_expired_sessions()
print(f"Cleaned {cleaned} expired sessions")
```

### Payment Statistics

Monitor payment statistics:

```python
stats = pi_client.payments.get_payment_statistics()
print(f"Total payments: {stats['total_payments']}")
print(f"Completed volume: {stats['completed_volume_pi']} Pi")
```

### Health Monitoring

Implement health checks in your monitoring system:

```bash
curl http://localhost:8000/api/pi-network/health
```

Expected response for healthy system:
```json
{
  "success": true,
  "health": {
    "overall": true,
    "config_valid": true,
    "auth_manager": true,
    "payment_manager": true
  }
}
```

## Roadmap

Future enhancements planned:

- [ ] WebSocket support for real-time payment updates
- [ ] Batch payment processing
- [ ] Advanced analytics and reporting
- [ ] Multi-signature wallet support
- [ ] Integration with Pi blockchain explorer
- [ ] Automated refund processing
- [ ] Enhanced fraud detection
- [ ] GraphQL API endpoints

## License

Part of Pi Forge Quantum Genesis - See project LICENSE for details.

---

**Last Updated**: December 2024  
**Version**: 1.0.0  
**Maintainer**: Pi Forge Collective
