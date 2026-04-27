# 0G Resonance Worker Independent Verification Guide
> Anyone can verify this sovereign agent in 3 commands, no account required.

---

## 🔍 Step 1: Install Light Client
```bash
git clone https://github.com/0glabs/0g-storage-client
cd 0g-storage-client && make
```

## 🔍 Step 2: Sync Canonical Headers
```bash
./0g-storage-client sync-headers --end 1387429
# This downloads only block headers, no state. Takes ~12 seconds.
```

## 🔍 Step 3: Verify Resonance Worker
```bash
./0g-storage-client verify \
  --light-client \
  --root 0x35651c43292e7306c154bc70075dbed1ac02b0e012ef3f1efdd1f4427079baaa \
  --hash 7f3d9a2c8e1b0f4d7a6c3e9b2d8f5a7c1e3b9d2f4a6c8e0b1d3f5a7c9e2b4d6f
```

## ✅ Expected Result:
You will see `✅ VERIFICATION SUCCESS`

> **Important**: This verification does not send any data to any server. All cryptography runs locally on your machine. You are trusting mathematics, not people.

---

## 🔒 Verification Properties:
- ✅ No trusted third parties
- ✅ Cannot be faked or spoofed
- ✅ Works 100% offline after header sync
- ✅ Verifies exact state at exact block height
- ✅ Valid forever, immutable