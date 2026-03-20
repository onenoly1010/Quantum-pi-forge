# 🚀 Ledger API v1 - Complete Financial Ledger Service

## Overview

This PR introduces the **Ledger API** - a standalone, independently deployable financial transaction ledger service for Pi Forge Quantum Genesis. It implements the LEDGER SCHEMA v1.0 and provides a single source of truth for all treasury operations, automatic fund allocations, reconciliation, and audit trails.

**⚠️ TESTNET-ONLY**: This implementation enforces `NFT_MINT_VALUE=0` with runtime safety checks. No mainnet operations are enabled.

---

## 🎯 What's Included

### Core Services

- ✅ **Transaction Ledger**: Complete tracking of all deposits, withdrawals, and internal allocations
- ✅ **Automatic Allocation Engine**: Atomic and idempotent fund distribution based on configurable rules
- ✅ **Treasury Management**: Real-time balance tracking across logical accounts
- ✅ **Reconciliation Service**: Compare internal ledger with external blockchain state
- ✅ **Audit Trail**: Complete logging of all financial operations
- ✅ **Guardian Authentication**: JWT-based access control for sensitive operations

### Database Schema (PostgreSQL)

- `logical_accounts` - Internal treasury accounts with balances
- `ledger_transactions` - All financial transactions
- `allocation_rules` - Configurable fund distribution rules
- `audit_log` - Complete audit trail
- `reconciliation_log` - External vs internal balance reconciliation

### API Endpoints

#### Public Endpoints (No Auth Required)
- `GET /api/v1/treasury/status` - Treasury balances and status
- `GET /api/v1/transactions` - List transactions (with filters)
- `GET /api/v1/allocation_rules` - View allocation rules

#### Protected Endpoints (Guardian JWT Required)
- `POST /api/v1/transactions` - Create new transaction
- `POST /api/v1/allocation_rules` - Create/update allocation rules
- `POST /api/v1/treasury/reconcile` - Trigger reconciliation

---

## 📁 Files Added

All files are under `ledger-api/` directory:

### Database & Schema
- `sql/schema/001_initial_ledger.sql` - Complete PostgreSQL schema with triggers
- `migrations/env.py` - Alembic migration environment
- `migrations/script.py.mako` - Migration template
- `migrations/versions/0001_initial_ledger_schema.py` - Initial migration
- `migrations/README.md` - Migration usage guide
- `alembic.ini` - Alembic configuration

### Application Code
- `ledger_api/main.py` - FastAPI application entry point
- `ledger_api/db.py` - Database connection and session management
- `ledger_api/models/ledger_models.py` - SQLAlchemy ORM models
- `ledger_api/schemas/transaction_schemas.py` - Pydantic request/response schemas
- `ledger_api/schemas/account_schemas.py` - Account schemas
- `ledger_api/schemas/allocation_schemas.py` - Allocation rule schemas
- `ledger_api/schemas/reconciliation_schemas.py` - Reconciliation schemas

### Services & Business Logic
- `ledger_api/services/allocation.py` - **Allocation engine** (atomic, idempotent)
- `ledger_api/services/audit.py` - Audit logging service
- `ledger_api/services/reconciliation.py` - Reconciliation service

### API Routes
- `ledger_api/api/v1/transactions.py` - Transaction endpoints
- `ledger_api/api/v1/treasury.py` - Treasury status endpoints
- `ledger_api/api/v1/reconcile.py` - Reconciliation endpoints
- `ledger_api/api/v1/allocation_rules.py` - Allocation rule management

### Security & Authentication
- `ledger_api/utils/jwt_auth.py` - Guardian JWT validation (requires `guardian` role)
- `ledger_api/utils/pi_auth.py` - Pi Network wallet signature verification stub (TODO)

### Testing
- `ledger_api/tests/conftest.py` - Test fixtures and setup
- `ledger_api/tests/test_allocation.py` - Allocation engine tests
- `ledger_api/tests/test_transactions.py` - Transaction API tests

### Docker & Deployment
- `Dockerfile` - Multi-stage container image
- `docker-compose.yml` - PostgreSQL development environment
- `docker-compose.test.yml` - PostgreSQL integration testing
- `.env.example` - Environment variable template
- `.github/workflows/ledger-api-ci.yml` - GitHub Actions CI pipeline

### Documentation
- `README.md` - Complete service documentation
- `RUNBOOK.md` - Operational runbook
- `scripts/smoke_test.sh` - Health check smoke tests

### Dependencies
- `requirements.txt` - Pinned Python dependencies

---

## 🔐 Security & Safety

### Runtime Safety Checks
- ✅ `NFT_MINT_VALUE=0` enforced at module level (raises RuntimeError if violated)
- ✅ `APP_ENVIRONMENT=testnet` required
- ✅ Guardian JWT requires minimum 32-character secret
- ✅ Guardian role enforcement on sensitive endpoints

### No Secrets Committed
- ✅ Only `.env.example` with placeholders
- ✅ No private keys or real credentials
- ✅ `GUARDIAN_JWT_SECRET` must be set via environment

### Allocation Engine Guarantees
- ✅ **Atomic**: All allocations succeed or fail together (DB transaction)
- ✅ **Idempotent**: Re-running allocation for same transaction is safe (checks for existing children)
- ✅ **Validated**: Allocation percentages must sum to exactly 100%

---

## 🧪 Testing

### Unit Tests (SQLite In-Memory)
```bash
cd ledger-api
pytest ledger_api/tests/ -v
```

### Integration Tests (PostgreSQL via Docker)
```bash
cd ledger-api
docker-compose -f docker-compose.test.yml up -d
pytest ledger_api/tests/ -v --integration
docker-compose -f docker-compose.test.yml down
```

### Smoke Tests
```bash
cd ledger-api
./scripts/smoke_test.sh
```

### CI Pipeline
- ✅ Runs on every push and PR
- ✅ Matrix testing: SQLite + PostgreSQL
- ✅ Code coverage reporting
- ✅ Linting and type checking

---

## 🚀 Quick Start

### Local Development

```bash
# 1. Navigate to ledger-api
cd ledger-api

# 2. Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Set up environment
cp .env.example .env
# Edit .env with your configuration

# 5. Run migrations
alembic upgrade head

# 6. Start the service
uvicorn ledger_api.main:app --reload --port 8000
```

### Docker Compose

```bash
cd ledger-api
docker-compose up -d
```

Service will be available at `http://localhost:8000`

---

## 📊 Allocation Engine Example

When a transaction is created with `status=COMPLETED` and `transaction_type=EXTERNAL_DEPOSIT`, the allocation engine automatically:

1. **Checks for existing allocations** (idempotency)
2. **Finds the highest-priority active allocation rule**
3. **Validates allocations sum to 100%**
4. **Creates child INTERNAL_ALLOCATION transactions**
5. **Updates logical account balances atomically**
6. **Records audit trail**

Example allocation rule:
```json
{
  "rule_name": "Default Deposit Allocation",
  "trigger_transaction_type": "EXTERNAL_DEPOSIT",
  "allocations": [
    {"account_id": 1, "percentage": 40.0},  // Reserve
    {"account_id": 2, "percentage": 30.0},  // Development
    {"account_id": 3, "percentage": 20.0},  // Community
    {"account_id": 4, "percentage": 10.0}   // Operations
  ],
  "priority": 100,
  "is_active": true
}
```

---

## ✅ Acceptance Criteria

- [x] Branch `infra/ledger-api-v1` created from `main`
- [x] All files added under `ledger-api/` directory
- [x] SQL schema matches LEDGER SCHEMA v1.0 specification
- [x] SQLAlchemy models map all schema tables
- [x] Pydantic schemas for all API operations
- [x] JWT authentication with guardian role enforcement
- [x] Pi wallet signature verification stub (marked TODO)
- [x] Allocation engine is atomic and idempotent
- [x] POST `/api/v1/transactions` with COMPLETED EXTERNAL_DEPOSIT triggers allocations
- [x] Allocations sum to 100% validation
- [x] Child transactions created with status COMPLETED
- [x] Logical account balances updated correctly
- [x] Audit logging for all operations
- [x] Unit tests present and passing
- [x] Integration tests with PostgreSQL
- [x] CI workflow configured and runs on push/PR
- [x] No secrets or credentials committed
- [x] NFT_MINT_VALUE=0 enforced at runtime
- [x] README with quick start and examples
- [x] RUNBOOK with operational procedures
- [x] Smoke test script included
- [x] Alembic migrations configured
- [x] Docker and docker-compose files
- [x] Draft PR created with this body

---

## 🔍 Reviewer Checklist

### Code Review
- [ ] Review SQL schema for completeness and correctness
- [ ] Verify SQLAlchemy models match database schema
- [ ] Check Pydantic schemas for proper validation
- [ ] Review allocation engine for atomicity and idempotency
- [ ] Verify JWT authentication implementation
- [ ] Check error handling and logging
- [ ] Review test coverage

### Security Review
- [ ] Confirm no secrets or credentials in code
- [ ] Verify NFT_MINT_VALUE=0 enforcement
- [ ] Check Guardian JWT secret validation (min 32 chars)
- [ ] Review Pi auth stub is properly marked TODO
- [ ] Verify allocation percentages validation
- [ ] Check SQL injection prevention (parameterized queries)

### Testing Review
- [ ] Run unit tests locally
- [ ] Run integration tests with PostgreSQL
- [ ] Execute smoke tests against running service
- [ ] Verify CI pipeline passes
- [ ] Test allocation engine edge cases
- [ ] Test idempotency by creating duplicate transactions
- [ ] Test allocation percentage validation (e.g., sum to 99% should fail)

### Documentation Review
- [ ] README is clear and complete
- [ ] RUNBOOK has operational procedures
- [ ] Migration README explains usage
- [ ] API endpoints documented
- [ ] Environment variables documented

### Deployment Review
- [ ] Docker build succeeds
- [ ] docker-compose.yml works for development
- [ ] docker-compose.test.yml works for CI
- [ ] Migrations run successfully
- [ ] Service starts without errors

---

## 📝 Post-Merge Actions

After this PR is merged, the following actions are required before deployment:

### 1. Set Repository Secrets

Add the following secrets in GitHub repository settings:

```bash
GUARDIAN_JWT_SECRET=<secure-random-string-min-32-chars>
DATABASE_URL=postgresql://user:password@host:5432/ledger
```

Generate a secure JWT secret:
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

### 2. Deploy Database

```bash
# Create database
createdb ledger

# Run migrations
cd ledger-api
alembic upgrade head
```

### 3. Verify Deployment

```bash
# Run smoke tests
cd ledger-api
./scripts/smoke_test.sh
```

### 4. Create Initial Allocation Rules

Use the Guardian JWT to create allocation rules via API:

```bash
# Example: Create default deposit allocation
curl -X POST http://localhost:8000/api/v1/allocation_rules \
  -H "Authorization: Bearer $GUARDIAN_JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "rule_name": "Default Deposit Allocation",
    "trigger_transaction_type": "EXTERNAL_DEPOSIT",
    "allocations": [
      {"account_id": 1, "percentage": 40.0},
      {"account_id": 2, "percentage": 30.0},
      {"account_id": 3, "percentage": 20.0},
      {"account_id": 4, "percentage": 10.0}
    ],
    "priority": 100,
    "is_active": true
  }'
```

---

## 🔗 Related Issues

- Issue: Create standalone ledger-api service
- Milestone: Testnet Infrastructure v1.0
- Epic: Treasury Management System

---

## 👥 Contributors

- Implementation: GitHub Copilot Agent
- Review: Project Maintainers
- Schema Design: Pi Forge Team

---

## 📚 Additional Resources

- [Ledger API README](ledger-api/README.md)
- [Ledger API RUNBOOK](ledger-api/RUNBOOK.md)
- [Database Schema](ledger-api/sql/schema/001_initial_ledger.sql)
- [Migration Guide](ledger-api/migrations/README.md)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Alembic Documentation](https://alembic.sqlalchemy.org/)

---

**Status**: ✅ Ready for Review  
**Type**: Feature  
**Priority**: High  
**Labels**: `infrastructure`, `ledger-api`, `testnet`, `database`, `fastapi`
