# 💳 Payment API

Technical details of the Pi Payment flow.

## Client-Side (JavaScript)
```javascript
Pi.createPayment({
  amount: 1.0,
  memo: "Resonance Boost",
  metadata: { type: "boost", ... }
}, {
  onReadyForServerApproval: (paymentId) => { ... },
  onPaymentSuccess: (payment) => { ... },
  onPaymentError: (error, payment) => { ... },
  onIncompletePaymentFound: (payment) => { ... }
});
```

## Server-Side (Python/FastAPI)
*   **Endpoint:** `POST /api/verify-payment`
*   **Logic:**
    1.  Receive `paymentId`.
    2.  Call Pi Platform API `/v2/payments/{paymentId}`.
    3.  Verify status is `COMPLETED` (or `authorized` if capturing).
    4.  Record in Supabase.
    5.  Trigger WebSocket broadcast.
