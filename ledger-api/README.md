# Pi Forge Quantum Genesis - Ledger API

**Version:** 1.0.0  
**Status:** Testnet-Only (NFT_MINT_VALUE=0 enforced)

## Overview

The Ledger API is a standalone financial transaction ledger service for Pi Forge Quantum Genesis. It provides a single source of truth for all treasury operations, automatic fund allocations, reconciliation, and audit trails.

### Key Features

- ✅ **Complete Transaction Ledger**: Track all deposits, withdrawals, and internal allocations
- ✅ **Automatic Allocation Engine**: Atomically distribute funds based on configurable rules
- ✅ **Treasury Management**: Real-time balance tracking across logical accounts
- ✅ **Reconciliation**: Compare internal ledger with external blockchain state
- ✅ **Audit Trail**: Complete logging of all financial operations
- ✅ **Guardian Authentication**: JWT-based access control for sensitive operations
- ✅ **Testnet Safety**: Enforced NFT_MINT_VALUE=0 with runtime checks

## Quick Start

### Prerequisites

- Python 3.11+
- PostgreSQL 15+ (or SQLite for development)
- Docker and Docker Compose (optional)

### Local Development Setup

1. **Clone and navigate to ledger-api:**
   ```bash
   cd ledger-api
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. **Initialize database:**
   ```bash
   # For SQLite (development)
   python -c "from ledger_api.db import init_db; init_db()"
   
   # For PostgreSQL (see docker-compose.yml)
   docker-compose up -d postgres
   ```

6. **Run the API:**
   ```bash
   uvicorn ledger_api.main:app --reload --port 8001
   ```

7. **Access API documentation:**
   - Interactive docs: http://localhost:8001/docs
   - ReDoc: http://localhost:8001/redoc
   - Health check: http://localhost:8001/health

### Docker Development

```bash
# Start all services (PostgreSQL + API)
docker-compose up

# Run in background
docker-compose up -d

# View logs
docker-compose logs -f ledger-api

# Stop services
docker-compose down
```

## Environment Variables

### Required

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | Database connection string | `postgresql://user:pass@localhost:5432/ledger_db` |
| `GUARDIAN_JWT_SECRET` | JWT secret (min 32 chars) | `your-secure-secret-min-32-chars` |

### Optional

| Variable | Description | Default |
|----------|-------------|---------|
| `APP_ENVIRONMENT` | Environment mode | `testnet` |
| `NFT_MINT_VALUE` | **Must be 0** for testnet | `0` |
| `SERVICE_PORT` | API server port | `8001` |
| `JWT_ALGORITHM` | JWT signing algorithm | `HS256` |
| `JWT_ACCESS_TOKEN_EXPIRE_MINUTES` | Token expiration | `30` |
| `LOG_LEVEL` | Logging level | `INFO` |
| `CORS_ORIGINS` | Allowed CORS origins | `*` |

## API Endpoints

### Public Endpoints (No Authentication)

#### Health Check
```bash
GET /health
```

**Response:**
```json
{
  "status": "healthy",
  "service": "ledger-api",
  "version": "v1",
  "environment": "testnet",
  "database": "connected",
  "nft_mint_value": 0
}
```

#### List Transactions
```bash
GET /api/v1/transactions/?limit=50&offset=0

# With filters
GET /api/v1/transactions/?transaction_type=EXTERNAL_DEPOSIT&status=COMPLETED
```

**Response:**
```json
[
  {
    "id": 1,
    "transaction_hash": "0x123...",
    "transaction_type": "EXTERNAL_DEPOSIT",
    "amount": 100.0,
    "status": "COMPLETED",
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

#### Create Transaction
```bash
POST /api/v1/transactions/
Content-Type: application/json

{
  "transaction_type": "EXTERNAL_DEPOSIT",
  "to_account_id": 1,
  "amount": 100.0,
  "status": "COMPLETED",
  "purpose": "Initial deposit"
}
```

**Response:**
```json
{
  "parent_transaction": {
    "id": 123,
    "transaction_type": "EXTERNAL_DEPOSIT",
    "amount": 100.0,
    "status": "COMPLETED"
  },
  "allocation_result": {
    "parent_transaction_id": 123,
    "child_transaction_ids": [124, 125, 126, 127],
    "total_allocated": 100.0,
    "allocations": [
      {
        "account_id": 1,
        "account_name": "Reserve Treasury",
        "amount": 40.0,
        "percentage": 40.0
      }
    ]
  }
}
```

#### Treasury Status
```bash
GET /api/v1/treasury/status
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

#### List Allocation Rules
```bash
GET /api/v1/allocation_rules/
```

### Guardian Endpoints (Require JWT Authentication)

#### Create Allocation Rule
```bash
POST /api/v1/allocation_rules/
Authorization: Bearer <guardian_token>
Content-Type: application/json

{
  "rule_name": "Custom Allocation",
  "trigger_transaction_type": "EXTERNAL_DEPOSIT",
  "allocations": [
    {"account_id": 1, "percentage": 50.0},
    {"account_id": 2, "percentage": 50.0}
  ],
  "is_active": true,
  "priority": 1
}
```

#### Reconcile Treasury
```bash
POST /api/v1/treasury/reconcile
Authorization: Bearer <guardian_token>
Content-Type: application/json

{
  "external_wallet_address": "GXXX...XXX",
  "external_wallet_balance": 10000.50,
  "notes": "Monthly reconciliation"
}
```

**Response:**
```json
{
  "id": 1,
  "external_wallet_balance": 10000.50,
  "internal_ledger_balance": 10000.50,
  "discrepancy": 0.0,
  "status": "MATCHED"
}
```

## Authentication

### Generating a Guardian JWT Token

For testing, you can generate a JWT token using Python:

```python
from ledger_api.utils.jwt_auth import create_guardian_token

token = create_guardian_token(user_id="admin", role="guardian")
print(f"Bearer {token}")
```

Or using OpenSSL and Python:

```bash
# Generate JWT secret
openssl rand -base64 32

# Create token (Python)
python -c "
from datetime import timedelta
from ledger_api.utils.jwt_auth import create_guardian_token
token = create_guardian_token('admin', 'guardian', timedelta(hours=1))
print('Bearer', token)
"
```

### Using JWT in Requests

```bash
# Export token as variable
export GUARDIAN_TOKEN="eyJ..."

# Use in curl
curl -H "Authorization: Bearer $GUARDIAN_TOKEN" \
  http://localhost:8001/api/v1/allocation_rules/ \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"rule_name": "Test", ...}'
```

## Running Tests

### Unit Tests (SQLite)

```bash
# Run all tests
pytest ledger_api/tests/ -v

# Run with coverage
pytest ledger_api/tests/ --cov=ledger_api --cov-report=term-missing

# Run specific test file
pytest ledger_api/tests/test_allocation.py -v
```

### Integration Tests (PostgreSQL)

```bash
# Using docker-compose
docker-compose -f docker-compose.test.yml up --abort-on-container-exit

# Or manually with PostgreSQL running
DATABASE_URL=postgresql://user:pass@localhost:5432/test_db \
  pytest ledger_api/tests/ -v
```

## Database Migrations

### Using Alembic

```bash
# Generate migration
alembic revision --autogenerate -m "Description"

# Apply migrations
alembic upgrade head

# Rollback migration
alembic downgrade -1

# View migration history
alembic history
```

### Using SQL Schema Directly

```bash
# Apply schema to PostgreSQL
psql -U ledger_user -d ledger_db -f sql/schema/001_initial_ledger.sql
```

## Architecture

### Database Schema

- **logical_accounts**: Internal treasury accounts (Reserve, Development, Community, Operations)
- **ledger_transactions**: All financial transactions (deposits, withdrawals, allocations)
- **allocation_rules**: Rules for automatic fund distribution
- **audit_log**: Audit trail of all changes
- **reconciliation_log**: Reconciliation records between internal/external state

### Allocation Engine

The allocation engine automatically distributes funds when a COMPLETED EXTERNAL_DEPOSIT transaction is created:

1. Transaction created with status=COMPLETED
2. Engine finds active allocation rules matching EXTERNAL_DEPOSIT
3. Validates allocations sum to 100%
4. Creates child INTERNAL_ALLOCATION transactions atomically
5. Updates account balances
6. Records audit trail

**Idempotency**: Running allocations twice for the same transaction is safe (no duplicates).

## Safety & Security

### Testnet-Only Enforcement

- `NFT_MINT_VALUE=0` enforced at module level
- Runtime checks prevent production on-chain operations
- Pi Network integrations stubbed (TODO for future)

### Authentication

- JWT tokens signed with HS256 algorithm
- Guardian role required for sensitive operations
- Tokens expire after 30 minutes (configurable)

### Validation

- All allocation rules must sum to 100%
- Positive amounts only
- Account existence verified
- Transaction atomicity guaranteed

## Troubleshooting

### Database Connection Errors

```bash
# Check PostgreSQL is running
docker-compose ps

# View PostgreSQL logs
docker-compose logs postgres

# Test connection
psql postgresql://ledger_user:ledger_pass@localhost:5432/ledger_db -c "SELECT 1"
```

### Import Errors

```bash
# Ensure ledger-api is in PYTHONPATH
export PYTHONPATH="${PYTHONPATH}:/path/to/ledger-api"

# Or run from ledger-api directory
cd ledger-api
python -m ledger_api.main
```

### JWT Token Issues

```bash
# Verify secret is set and long enough
python -c "import os; print(len(os.environ.get('GUARDIAN_JWT_SECRET', '')))"

# Must be >= 32 characters
```

## Development

### Code Style

```bash
# Format code
black ledger_api/

# Sort imports
isort ledger_api/

# Lint
flake8 ledger_api/
```

### Adding a New Endpoint

1. Create route in `ledger_api/api/v1/your_endpoint.py`
2. Define Pydantic schemas in `ledger_api/schemas/`
3. Add business logic in `ledger_api/services/`
4. Register router in `ledger_api/main.py`
5. Add tests in `ledger_api/tests/`

## Deployment

### Production Checklist

- [ ] Set strong GUARDIAN_JWT_SECRET (min 32 chars)
- [ ] Use PostgreSQL (not SQLite)
- [ ] Set DATABASE_URL with production credentials
- [ ] Configure CORS_ORIGINS appropriately
- [ ] Set LOG_LEVEL=WARNING or ERROR
- [ ] Verify NFT_MINT_VALUE=0
- [ ] Enable HTTPS/TLS
- [ ] Set up database backups
- [ ] Configure monitoring and alerts
- [ ] Review audit logs regularly

### Environment-Specific Configs

**Development:**
```env
DATABASE_URL=sqlite:///./ledger.db
DEBUG=true
RELOAD=true
```

**Testnet:**
```env
DATABASE_URL=postgresql://...
APP_ENVIRONMENT=testnet
NFT_MINT_VALUE=0
DEBUG=false
```

**Production:**
```env
DATABASE_URL=postgresql://...
APP_ENVIRONMENT=production
NFT_MINT_VALUE=0
DEBUG=false
LOG_LEVEL=WARNING
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass (`pytest`)
6. Format code (`black`, `isort`)
7. Commit changes (`git commit -m 'Add amazing feature'`)
8. Push to branch (`git push origin feature/amazing-feature`)
9. Open a Pull Request

## License

Copyright (c) 2025 Pi Forge Collective - Quantum Genesis Initiative

## Support

For issues or questions:
- Open an issue on GitHub
- Review API documentation at `/docs`
- Check logs for detailed error messages

---

**⚠️ IMPORTANT**: This service is currently in testnet-only mode. All on-chain operations are stubbed. Do not use with real Pi Network mainnet transactions without proper implementation of Pi wallet verification and on-chain integration.
