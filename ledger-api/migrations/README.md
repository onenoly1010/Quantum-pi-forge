# Database Migrations

This directory contains Alembic database migrations for the Ledger API.

## Overview

We use [Alembic](https://alembic.sqlalchemy.org/) for database schema versioning and migrations. Alembic tracks changes to your database schema over time and provides tools to upgrade/downgrade between versions.

## Quick Start

### Running Migrations

```bash
# Upgrade to the latest version
alembic upgrade head

# Upgrade to a specific version
alembic upgrade 0001_initial_ledger

# Downgrade one version
alembic downgrade -1

# Downgrade to a specific version
alembic downgrade 0001_initial_ledger

# Show current version
alembic current

# Show migration history
alembic history --verbose
```

### Creating New Migrations

```bash
# Auto-generate migration from model changes
alembic revision --autogenerate -m "Description of changes"

# Create empty migration for manual SQL
alembic revision -m "Description of changes"
```

## Migration Files

### Current Migrations

1. **0001_initial_ledger_schema.py** - Initial database schema
   - Creates logical_accounts table
   - Creates ledger_transactions table
   - Creates allocation_rules table
   - Creates audit_log table
   - Creates reconciliation_log table
   - Adds triggers and functions
   - Inserts initial seed data

## Configuration

- **alembic.ini** - Alembic configuration file (in parent directory)
- **env.py** - Python environment configuration for Alembic
- **script.py.mako** - Template for new migration files

## Database Connection

The database URL is configured via the `DATABASE_URL` environment variable.

For local development with SQLite:
```bash
export DATABASE_URL=sqlite:///./ledger.db
```

For PostgreSQL (production/testing):
```bash
export DATABASE_URL=postgresql://user:password@host:5432/database
```

## Migration Strategy

### Development
- Use SQLite for quick local development
- Run migrations with `alembic upgrade head`

### Testing
- CI runs migrations against PostgreSQL in Docker
- Each test run starts with a fresh database

### Production
- Always backup database before running migrations
- Test migrations in staging environment first
- Run migrations during maintenance window
- Use `alembic upgrade head` to apply all pending migrations

## Troubleshooting

### "Target database is not up to date"
This means your database has migrations that haven't been applied yet.
```bash
alembic upgrade head
```

### "Can't locate revision identified by"
This usually means your migrations are out of sync. Check:
1. Are all migration files present?
2. Is the alembic_version table correct?
3. Try: `alembic stamp head` to mark current state (use with caution)

### Manual Migration Fixes

If you need to manually fix the migration state:

```sql
-- Check current version
SELECT * FROM alembic_version;

-- Manually set version (use with extreme caution)
UPDATE alembic_version SET version_num = '0001_initial_ledger';
```

## Best Practices

1. **Always review auto-generated migrations** - Alembic's autogenerate is helpful but not perfect
2. **Test migrations in both directions** - Always test both upgrade and downgrade
3. **Use transactions** - Migrations should be atomic when possible
4. **Document complex migrations** - Add comments explaining non-obvious changes
5. **Backup before production migrations** - Always have a rollback plan
6. **Version control** - All migration files should be in git

## Initial Setup

For a brand new database:

```bash
# 1. Set your database URL
export DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ledger

# 2. Run migrations
alembic upgrade head

# 3. Verify
alembic current
```

## References

- [Alembic Documentation](https://alembic.sqlalchemy.org/)
- [SQLAlchemy Documentation](https://docs.sqlalchemy.org/)
- [Ledger API Documentation](../README.md)
