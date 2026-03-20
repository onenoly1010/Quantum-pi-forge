# Pi Forge Frontend

Frontend assets for the Pi Forge Quantum Genesis platform.

## Files

### `pi-forge-integration.js`

JavaScript SDK for browser-based Pi Network interactions.

**Features:**
- Pi Network authentication
- Payment creation and management
- Mining boost activation
- Payment history retrieval
- Real-time resonance visualization
- Session management

**Usage:**

```html
<!-- Include Pi SDK first -->
<script src="https://sdk.minepi.com/pi-sdk.js"></script>

<!-- Include Pi Forge SDK -->
<script src="/frontend/pi-forge-integration.js"></script>

<script>
  // Initialize
  await PiForge.initialize({
    network: 'testnet',  // or 'mainnet'
    debug: true,
    apiBase: 'http://localhost:8000'
  });

  // Authenticate
  const auth = await PiForge.authenticate(['payments', 'username']);
  console.log('Authenticated:', auth.user.username);

  // Create payment
  const payment = await PiForge.createPayment({
    amount: 1.5,
    memo: 'Mining boost activation',
    metadata: { type: 'boost' }
  });

  // Activate mining boost (convenience method)
  const boost = await PiForge.activateMiningBoost(50); // +50% boost
</script>
```

**API Methods:**

- `initialize(options)` - Initialize the SDK
- `authenticate(scopes)` - Authenticate with Pi Network
- `createPayment(paymentData)` - Create a new payment
- `activateMiningBoost(boostPercent)` - Activate mining boost
- `getPaymentHistory(limit)` - Get payment history
- `verifyPayment(paymentId, txid)` - Verify a payment
- `getStatus()` - Get system status

**Events:**

The SDK emits custom events that you can listen for:

```javascript
// Payment error
window.addEventListener('piforge:payment:error', (event) => {
  console.error('Payment error:', event.detail);
});

// Resonance visualization trigger
window.addEventListener('piforge:resonance', (event) => {
  console.log('Resonance triggered:', event.detail.payment);
  // Trigger your visualization here
});
```

## Configuration

The SDK can be configured with the following options:

```javascript
await PiForge.initialize({
  network: 'testnet',      // Network mode: 'testnet' or 'mainnet'
  debug: false,            // Enable debug logging
  apiBase: 'http://localhost:8000',  // Base URL for API endpoints
  apiPath: '/api/pi-network'  // API path (optional)
});
```

## Security Notes

- Always use HTTPS in production
- Never commit API keys to version control
- Validate `NFT_MINT_VALUE=0` in testnet mode
- Use environment-specific configuration

## Documentation

For complete documentation, see:
- [Pi Network Integration Guide](../docs/PI_NETWORK_INTEGRATION.md)
- [Pi Network Quick Reference](../docs/PI_NETWORK_QUICK_REFERENCE.md)
- [Pi Payment API Reference](../docs/PI_PAYMENT_API_REFERENCE.md)

## Version

**1.0.0** - December 2024
