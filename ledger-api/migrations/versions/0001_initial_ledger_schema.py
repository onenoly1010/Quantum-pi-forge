"""Initial ledger schema

Revision ID: 0001_initial_ledger
Revises: 
Create Date: 2024-01-01 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from pathlib import Path


# revision identifiers, used by Alembic.
revision = '0001_initial_ledger'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    """
    Apply the initial ledger schema from SQL file.
    Executes sql/schema/001_initial_ledger.sql
    """
    # Get the path to the SQL schema file
    sql_file = Path(__file__).parent.parent.parent / "sql" / "schema" / "001_initial_ledger.sql"
    
    # Read and execute the SQL schema
    with open(sql_file, 'r') as f:
        sql_content = f.read()
    
    # Execute the SQL (this handles multi-statement execution)
    connection = op.get_bind()
    
    # Split statements by semicolon and execute individually
    # This is necessary because some SQL drivers don't support executing multiple statements at once
    statements = [stmt.strip() for stmt in sql_content.split(';') if stmt.strip()]
    
    for statement in statements:
        if statement:
            connection.execute(sa.text(statement))


def downgrade() -> None:
    """
    Remove the ledger schema tables in reverse dependency order.
    """
    # Drop tables in reverse order to handle foreign key dependencies
    op.execute("DROP TABLE IF EXISTS reconciliation_log CASCADE")
    op.execute("DROP TABLE IF EXISTS audit_log CASCADE")
    op.execute("DROP TABLE IF EXISTS allocation_rules CASCADE")
    op.execute("DROP TABLE IF EXISTS ledger_transactions CASCADE")
    op.execute("DROP TABLE IF EXISTS logical_accounts CASCADE")
    
    # Drop the UUID extension if it was created
    op.execute("DROP EXTENSION IF EXISTS \"uuid-ossp\"")
