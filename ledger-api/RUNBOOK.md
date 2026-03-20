# Ledger API Runbook

Quick reference guide for operating the Pi Forge Ledger API.

## Table of Contents
- [Quick Start](#quick-start)
- [API Endpoints](#api-endpoints)
- [Authentication](#authentication)
- [Common Operations](#common-operations)
- [Troubleshooting](#troubleshooting)

---

## Quick Start

### 1. Start the Service

**Local Development:**
```bash
cd ledger-api
python -m uvicorn ledger_api.main:app --reload --port 8001
```

**Docker Compose:**
```bash
cd ledger-api
docker-compose up
```

### 2. Verify Service is Running

```bash
curl http://localhost:8001/health
```

Expected response:
```json
{
  "status": "healthy",
  "service": "ledger-api",
  "database": "connected",
  "nft_mint_value": 0
}
```

---

## API Endpoints

### Base URL
- Local: `http://localhost:8001`
- Testnet: `https://your-deployment.com`

### Endpoints Overview

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/health` | No | Health check |
| POST | `/api/v1/transactions/` | No | Create transaction |
| GET | `/api/v1/transactions/` | No | List transactions |
| GET | `/api/v1/treasury/status` | No | Treasury status |
| POST | `/api/v1/treasury/reconcile` | Guardian | Reconcile balances |
| GET | `/api/v1/allocation_rules/` | No | List allocation rules |
| POST | `/api/v1/allocation_rules/` | Guardian | Create allocation rule |

---

## Authentication

### Generate Guardian JWT Token

**Method 1: Python Script**
```bash
python <<EOF
from ledger_api.utils.jwt_auth import create_guardian_token
from datetime import timedelta

token = create_guardian_token(
    user_id="admin",
    role="guardian",
    expires_delta=timedelta(hours=24)
)
print(f"Bearer {token}")
EOF
```

**Method 2: OpenSSL + Python**
```bash
# Generate secret (if needed)
openssl rand -base64 32

# Create token
python -c "
from ledger_api.utils.jwt_auth import create_guardian_token
print(create_guardian_token('admin', 'guardian'))
"
```

### Use Token in Requests

```bash
# Export as variable
export GUARDIAN_TOKEN="your-jwt-token-here"

# Use in curl
curl -H "Authorization: Bearer $GUARDIAN_TOKEN" \
  http://localhost:8001/api/v1/allocation_rules/
```

---

## Common Operations

### 1. Create External Deposit (Triggers Allocation)

```bash
curl -X POST http://localhost:8001/api/v1/transactions/ \
  -H "Content-Type: application/json" \
  -d '{
    "transaction_type": "EXTERNAL_DEPOSIT",
    "to_account_id": 1,
    "amount": 1000.0,
    "status": "COMPLETED",
    "transaction_hash": "0x123abc...",
    "purpose": "Initial Pi deposit from wallet"
  }'
```

**Response:**
```json
{
  "parent_transaction": {
    "id": 123,
    "transaction_type": "EXTERNAL_DEPOSIT",
    "amount": 1000.0,
    "status": "COMPLETED"
  },
  "allocation_result": {
    "parent_transaction_id": 123,
    "child_transaction_ids": [124, 125, 126, 127],
    "total_allocated": 1000.0,
    "allocations": [
      {
        "account_id": 1,
        "account_name": "Reserve Treasury",
        "amount": 400.0,
        "percentage": 40.0
      },
      {
        "account_id": 2,
        "account_name": "Development Fund",
        "amount": 250.0,
        "percentage": 25.0
      }
    ]
  }
}
```

### 2. List Recent Transactions

```bash
curl "http://localhost:8001/api/v1/transactions/?limit=10&transaction_type=EXTERNAL_DEPOSIT&status=COMPLETED"
```

### 3. Check Treasury Status

```bash
curl http://localhost:8001/api/v1/treasury/status
```

**Response:**
```json
{
  "total_balance": 10000.0,
  "accounts": [
    {
      "id": 1,
      "account_name": "Reserve Treasury",
      "account_type": "RESERVE",
      "current_balance": 4000.0,
      "allocation_percentage": 40.0,
      "is_active": true
    }
  ],
  "reserve_status": {
    "reserve_percentage": 40.0,
    "reserve_balance": 4000.0,
    "is_healthy": true
  }
}
```

### 4. Reconcile Treasury (Guardian Only)

```bash
curl -X POST http://localhost:8001/api/v1/treasury/reconcile \
  -H "Authorization: Bearer $GUARDIAN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "external_wallet_address": "GXXX...XXX",
    "external_wallet_balance": 10000.50,
    "notes": "Monthly reconciliation"
  }'
```

**Response:**
```json
{
  "id": 1,
  "external_wallet_balance": 10000.50,
  "internal_ledger_balance": 10000.50,
  "discrepancy": 0.0,
  "status": "MATCHED",
  "reconciliation_date": "2024-01-01T00:00:00Z"
}
```

### 5. Create Custom Allocation Rule (Guardian Only)

```bash
curl -X POST http://localhost:8001/api/v1/allocation_rules/ \
  -H "Authorization: Bearer $GUARDIAN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "rule_name": "Custom Split",
    "trigger_transaction_type": "EXTERNAL_DEPOSIT",
    "allocations": [
      {"account_id": 1, "percentage": 50.0},
      {"account_id": 2, "percentage": 30.0},
      {"account_id": 3, "percentage": 20.0}
    ],
    "is_active": true,
    "priority": 1
  }'
```

### 6. List Allocation Rules

```bash
curl http://localhost:8001/api/v1/allocation_rules/
```

---

## Database Operations

### Run Migrations

```bash
# Using Alembic
alembic upgrade head

# Or apply SQL directly
psql -U ledger_user -d ledger_db -f sql/schema/001_initial_ledger.sql
```

### Backup Database

```bash
# PostgreSQL
pg_dump -U ledger_user ledger_db > backup_$(date +%Y%m%d).sql

# SQLite
cp ledger.db ledger_backup_$(date +%Y%m%d).db
```

### Query Database Directly

```bash
# PostgreSQL
psql -U ledger_user -d ledger_db

# Common queries
SELECT * FROM logical_accounts;
SELECT * FROM ledger_transactions ORDER BY created_at DESC LIMIT 10;
SELECT * FROM v_treasury_status;
```

---

## Monitoring

### Check Logs

```bash
# Docker Compose
docker-compose logs -f ledger-api

# Local
tail -f /var/log/ledger-api.log
```

### Health Check

```bash
# Simple check
curl http://localhost:8001/health

# With jq formatting
curl -s http://localhost:8001/health | jq .
```

### Metrics

```bash
# Transaction count by type
curl http://localhost:8001/api/v1/transactions/ | jq 'group_by(.transaction_type) | map({type: .[0].transaction_type, count: length})'

# Treasury totals
curl http://localhost:8001/api/v1/treasury/status | jq '.total_balance'
```

---

## Troubleshooting

### Issue: Service Won't Start

**Check:**
1. Database connection:
   ```bash
   psql $DATABASE_URL -c "SELECT 1"
   ```

2. Environment variables:
   ```bash
   echo $DATABASE_URL
   echo $GUARDIAN_JWT_SECRET
   ```

3. Port availability:
   ```bash
   lsof -i :8001
   ```

### Issue: Authentication Fails

**Check:**
1. JWT secret is set:
   ```bash
   python -c "import os; print(len(os.environ.get('GUARDIAN_JWT_SECRET', '')))"
   # Should be >= 32
   ```

2. Token is valid:
   ```bash
   python -c "
   from ledger_api.utils.jwt_auth import verify_guardian_token
   verify_guardian_token('YOUR_TOKEN')
   "
   ```

### Issue: Allocation Not Triggered

**Check:**
1. Transaction status is COMPLETED
2. Transaction type is EXTERNAL_DEPOSIT
3. Active allocation rule exists:
   ```bash
   curl http://localhost:8001/api/v1/allocation_rules/ | jq '.[] | select(.is_active == true)'
   ```

### Issue: Database Connection Error

**PostgreSQL:**
```bash
# Test connection
pg_isready -h localhost -p 5432 -U ledger_user

# Check if database exists
psql -U ledger_user -l | grep ledger_db
```

**SQLite:**
```bash
# Check file exists and is readable
ls -la ledger.db
sqlite3 ledger.db "SELECT 1"
```

---

## Security Checklist

- [ ] `GUARDIAN_JWT_SECRET` is at least 32 characters
- [ ] `NFT_MINT_VALUE` is set to 0
- [ ] `APP_ENVIRONMENT` is set to "testnet" or "development"
- [ ] Database credentials are not committed to git
- [ ] CORS origins are properly configured
- [ ] TLS/HTTPS enabled in production
- [ ] Regular database backups configured
- [ ] Audit logs reviewed periodically

---

## Environment Variables Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DATABASE_URL` | Yes | - | PostgreSQL connection string |
| `GUARDIAN_JWT_SECRET` | Yes | - | JWT signing secret (min 32 chars) |
| `NFT_MINT_VALUE` | Yes | 0 | Must be 0 for testnet |
| `APP_ENVIRONMENT` | No | testnet | Environment mode |
| `SERVICE_PORT` | No | 8001 | API server port |
| `LOG_LEVEL` | No | INFO | Logging level |
| `CORS_ORIGINS` | No | * | Allowed CORS origins |

---

## Support

**Documentation:**
- README: `/ledger-api/README.md`
- API Docs: `http://localhost:8001/docs`
- Runbook: This file

**Logs:**
- Application: Check console or `/var/log/ledger-api.log`
- Database: Check PostgreSQL logs
- Docker: `docker-compose logs ledger-api`

**Common Issues:**
- See [Troubleshooting](#troubleshooting) section above
- Check GitHub Issues
- Review application logs

---

**Last Updated:** 2024-12-11  
**Version:** 1.0.0  
**Maintainer:** Pi Forge Collective
