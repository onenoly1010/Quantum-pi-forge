# 🔌 Pi Network Payment API Reference

Complete API documentation for Pi Network payment integration endpoints.

---

## Authentication

All payment endpoints (except webhooks) require JWT authentication:

```javascript
headers: {
  'Authorization': 'Bearer YOUR_JWT_TOKEN',
  'Content-Type': 'application/json'
}
```

---

## Endpoints

### 1. Payment Approval

**Endpoint:** `POST /api/payments/approve`

**Purpose:** Approve a Pi Network payment after SDK's `onReadyForServerApproval` callback.

**Request:**
```json
{
  "payment_id": "pi_payment_abc123",
  "amount": 0.15,
  "user_id": "user_uuid_here",
  "metadata": {
    "type": "mining_boost",
    "boost_percent": 25
  }
}
```

**Response (Success):**
```json
{
  "approved": true,
  "payment_id": "pi_payment_abc123",
  "status": "approved",
  "message": "Payment approved - proceed to blockchain",
  "processing_time_ns": 45234567,
  "timestamp": 1702345678.123
}
```

**Response (Error):**
```json
{
  "detail": "Payment amount mismatch: expected 0.15, got 0.10"
}
```

**Status Codes:**
- `200` - Payment approved successfully
- `400` - Invalid payment data or amount mismatch
- `401` - Unauthorized (missing/invalid JWT)
- `500` - Server error or Pi Network API unavailable

---

### 2. Payment Completion

**Endpoint:** `POST /api/payments/complete`

**Purpose:** Complete payment after blockchain confirmation (SDK's `onReadyForServerCompletion`).

**Request:**
```json
{
  "payment_id": "pi_payment_abc123",
  "txid": "blockchain_transaction_hash_xyz"
}
```

**Response (Success):**
```json
{
  "success": true,
  "payment_id": "pi_payment_abc123",
  "txid": "blockchain_transaction_hash_xyz",
  "status": "completed",
  "resonance_state": "harmony",
  "amount": 0.15,
  "message": "Payment completed successfully",
  "processing_time_ns": 38765432,
  "timestamp": 1702345698.456
}
```

**Resonance States (based on amount):**
- `foundation` - Amount < 0.1 Pi
- `growth` - Amount 0.1 - 0.49 Pi
- `harmony` - Amount 0.5 - 0.99 Pi
- `transcendence` - Amount >= 1.0 Pi

**Status Codes:**
- `200` - Payment completed successfully
- `500` - Server error or Pi Network API unavailable

---

### 3. Incomplete Payment Handler

**Endpoint:** `POST /api/payments/incomplete`

**Purpose:** Handle payments that were interrupted during the flow.

**Request:**
```json
{
  "payment_id": "pi_payment_abc123",
  "amount": 0.15,
  "user_uid": "user_uid_from_pi"
}
```

**Response (Completed):**
```json
{
  "status": "completed",
  "message": "Payment was completed"
}
```

**Response (Still Pending):**
```json
{
  "status": "pending",
  "message": "Payment is pending"
}
```

---

### 4. Pi Network Webhook

**Endpoint:** `POST /api/pi-webhooks/payment`

**Purpose:** Receive payment status updates from Pi Network servers.

**Authentication:** Webhook signature verification (HMAC-SHA256)

**Headers:**
```
X-Pi-Signature: hmac_sha256_signature
Content-Type: application/json
```

**Payload:**
```json
{
  "payment_id": "pi_payment_abc123",
  "status": "completed",
  "txid": "blockchain_tx_hash",
  "amount": 0.15,
  "user_uid": "user_uid_from_pi",
  "created_at": "2025-12-12T10:30:00Z"
}
```

**Status Values:**
- `completed` - Payment successful on blockchain
- `cancelled` - User cancelled payment
- `failed` - Payment failed

**Response:**
```json
{
  "status": "received",
  "payment_id": "pi_payment_abc123"
}
```

**Status Codes:**
- `200` - Webhook processed successfully
- `401` - Invalid signature
- `500` - Processing error

---

### 5. Pi Network Status

**Endpoint:** `GET /api/pi-network/status`

**Purpose:** Check Pi Network integration configuration.

**Authentication:** None required

**Response:**
```json
{
  "network": "mainnet",
  "sandbox_mode": false,
  "api_configured": true,
  "app_configured": true,
  "mainnet_ready": true,
  "timestamp": 1702345678.123
}
```

---

### 6. Legacy Payment Verification

**Endpoint:** `POST /api/verify-payment`

**Purpose:** Legacy endpoint for payment verification (use new endpoints instead).

**Note:** This endpoint is maintained for backward compatibility but new integrations should use `/api/payments/approve` and `/api/payments/complete`.

---

## Complete Payment Flow

### Frontend Integration:

```javascript
// Initialize Pi SDK
await PiForge.initialize({ network: 'mainnet' });

// Authenticate user
const user = await PiForge.authenticate(['payments']);

// Create payment
const payment = await PiForge.createPayment({
    amount: 0.15,
    memo: "PiForge Boost: 25% Mining",
    metadata: { 
        type: 'mining_boost',
        boost_percent: 25 
    }
});

// SDK automatically calls:
// 1. onReadyForServerApproval -> POST /api/payments/approve
// 2. onReadyForServerCompletion -> POST /api/payments/complete
// 3. Your app receives webhook -> POST /api/pi-webhooks/payment
```

### Backend Flow:

```
1. User initiates payment in Pi Browser
   ↓
2. Pi SDK calls onReadyForServerApproval
   ↓
3. Frontend → POST /api/payments/approve
   ↓
4. Backend validates with Pi Network API
   ↓
5. Backend returns approval
   ↓
6. Pi Network processes blockchain transaction
   ↓
7. Pi SDK calls onReadyForServerCompletion
   ↓
8. Frontend → POST /api/payments/complete
   ↓
9. Backend verifies txid with Pi Network
   ↓
10. Pi Network sends webhook to backend
    ↓
11. Backend updates database & broadcasts to WebSocket
    ↓
12. Frontend displays success & visualization
```

---

## Database Schema

Payments are stored in Supabase `payments` table:

```sql
CREATE TABLE payments (
    id UUID PRIMARY KEY,
    payment_id VARCHAR(255) UNIQUE NOT NULL,
    txid VARCHAR(255),
    user_id UUID REFERENCES auth.users(id),
    amount DECIMAL(18, 7) NOT NULL,
    status VARCHAR(50) NOT NULL,
    resonance_state VARCHAR(50),
    metadata JSONB,
    created_at TIMESTAMP,
    approved_at TIMESTAMP,
    completed_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

**Query Examples:**

```sql
-- Get user's payment history
SELECT * FROM payments 
WHERE user_id = 'user_uuid' 
ORDER BY created_at DESC;

-- Get completed payments
SELECT * FROM payments 
WHERE status = 'completed'
AND completed_at >= NOW() - INTERVAL '7 days';

-- Get payment analytics
SELECT * FROM payment_analytics
WHERE payment_date >= CURRENT_DATE - INTERVAL '30 days';
```

---

## Error Handling

### Common Errors:

**1. Amount Mismatch:**
```json
{
  "detail": "Payment amount mismatch: expected 0.15, got 0.10"
}
```
**Cause:** Frontend and backend amounts don't match
**Solution:** Ensure consistent amount formatting (7 decimals max)

**2. Invalid Payment State:**
```json
{
  "detail": "Payment not in pending state: completed"
}
```
**Cause:** Trying to approve already processed payment
**Solution:** Check payment status before approval

**3. Pi Network API Error:**
```json
{
  "detail": "Pi Network API error: Rate limit exceeded"
}
```
**Cause:** Too many API requests
**Solution:** Implement request queuing/retry logic

**4. Webhook Signature Failure:**
```json
{
  "detail": "Invalid webhook signature"
}
```
**Cause:** Webhook secret mismatch
**Solution:** Verify `PI_NETWORK_WEBHOOK_SECRET` matches Pi Developer Portal

---

## Rate Limits

- **General API:** 60 requests/minute per IP (built-in)
- **Pi Network API:** Check Pi Network documentation
- **Webhooks:** No rate limit (signature verified)

---

## Testing

### Sandbox Testing:

```bash
# Set environment to sandbox
export PI_NETWORK_MODE=testnet
export PI_SANDBOX_MODE=true
export PI_NETWORK_API_KEY=sandbox_key
```

### Mock Payment Flow:

```bash
# Test approval
curl -X POST http://localhost:8000/api/payments/approve \
  -H "Authorization: Bearer $JWT" \
  -H "Content-Type: application/json" \
  -d '{"payment_id": "test_123", "amount": 0.15, "user_id": "uuid"}'

# Test completion
curl -X POST http://localhost:8000/api/payments/complete \
  -H "Content-Type: application/json" \
  -d '{"payment_id": "test_123", "txid": "test_tx_hash"}'
```

---

## WebSocket Integration

Payment status updates are broadcast to WebSocket clients:

```javascript
// Connect to WebSocket
const ws = new WebSocket('wss://your-domain.com/ws/collective-insight?token=JWT');

// Listen for payment updates
ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    
    if (data.type === 'payment_status_update') {
        console.log('Payment update:', data);
        // {
        //   type: "payment_status_update",
        //   payment_id: "pi_payment_abc123",
        //   status: "completed",
        //   txid: "blockchain_tx_hash",
        //   timestamp: 1702345698.456
        // }
    }
};
```

---

## Security Best Practices

1. **Always verify payment amounts** server-side
2. **Use webhook signature verification** in production
3. **Implement idempotency** for payment endpoints
4. **Store sensitive data securely** (never log API keys)
5. **Use HTTPS only** for all API calls
6. **Validate user ownership** before approving payments
7. **Monitor for duplicate payments** using payment_id

---

## Support

- **API Issues:** Check server logs with `railway logs`
- **Pi Network Issues:** [Pi Developer Portal](https://developer.pi)
- **Database Issues:** Check Supabase logs and RLS policies
- **Integration Help:** See `/docs/PI_NETWORK_DEPLOYMENT_GUIDE.md`
