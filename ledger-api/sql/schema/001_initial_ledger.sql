-- Pi Forge Quantum Genesis - Ledger API Database Schema
-- Version: 001_initial_ledger
-- Description: Complete ledger system with logical accounts, transactions, allocation rules, and audit trails

-- ============================================================================
-- LOGICAL ACCOUNTS TABLE
-- Represents internal treasury accounts with allocation percentages
-- ============================================================================
CREATE TABLE IF NOT EXISTS logical_accounts (
    id SERIAL PRIMARY KEY,
    account_name VARCHAR(100) NOT NULL UNIQUE,
    account_type VARCHAR(50) NOT NULL, -- 'RESERVE', 'OPERATIONAL', 'DEVELOPMENT', 'COMMUNITY', etc.
    current_balance DECIMAL(20, 8) NOT NULL DEFAULT 0.0,
    allocation_percentage DECIMAL(5, 2) DEFAULT 0.0, -- Percentage of incoming deposits
    is_active BOOLEAN DEFAULT TRUE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT positive_balance CHECK (current_balance >= 0),
    CONSTRAINT valid_allocation CHECK (allocation_percentage >= 0 AND allocation_percentage <= 100)
);

-- ============================================================================
-- LEDGER TRANSACTIONS TABLE
-- All financial transactions in the system
-- ============================================================================
CREATE TABLE IF NOT EXISTS ledger_transactions (
    id SERIAL PRIMARY KEY,
    transaction_hash VARCHAR(255), -- External blockchain tx hash (nullable for internal txs)
    transaction_type VARCHAR(50) NOT NULL, -- 'EXTERNAL_DEPOSIT', 'EXTERNAL_WITHDRAWAL', 'INTERNAL_ALLOCATION', 'INTERNAL_TRANSFER'
    from_account_id INTEGER REFERENCES logical_accounts(id),
    to_account_id INTEGER REFERENCES logical_accounts(id),
    amount DECIMAL(20, 8) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING', -- 'PENDING', 'COMPLETED', 'FAILED', 'CANCELLED'
    purpose VARCHAR(255),
    parent_transaction_id INTEGER REFERENCES ledger_transactions(id), -- For linked allocations
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE,
    CONSTRAINT positive_amount CHECK (amount > 0),
    CONSTRAINT valid_status CHECK (status IN ('PENDING', 'COMPLETED', 'FAILED', 'CANCELLED')),
    CONSTRAINT valid_transaction_type CHECK (transaction_type IN (
        'EXTERNAL_DEPOSIT', 
        'EXTERNAL_WITHDRAWAL', 
        'INTERNAL_ALLOCATION', 
        'INTERNAL_TRANSFER'
    ))
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_ledger_tx_hash ON ledger_transactions(transaction_hash);
CREATE INDEX IF NOT EXISTS idx_ledger_tx_type ON ledger_transactions(transaction_type);
CREATE INDEX IF NOT EXISTS idx_ledger_tx_status ON ledger_transactions(status);
CREATE INDEX IF NOT EXISTS idx_ledger_tx_parent ON ledger_transactions(parent_transaction_id);
CREATE INDEX IF NOT EXISTS idx_ledger_tx_created ON ledger_transactions(created_at);

-- ============================================================================
-- ALLOCATION RULES TABLE
-- Defines how incoming funds are automatically allocated
-- ============================================================================
CREATE TABLE IF NOT EXISTS allocation_rules (
    id SERIAL PRIMARY KEY,
    rule_name VARCHAR(100) NOT NULL UNIQUE,
    trigger_transaction_type VARCHAR(50) NOT NULL, -- 'EXTERNAL_DEPOSIT', etc.
    purpose VARCHAR(255),
    allocations JSONB NOT NULL, -- Array of {account_id, percentage} objects
    is_active BOOLEAN DEFAULT TRUE,
    priority INTEGER DEFAULT 0, -- Higher priority rules execute first
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    CONSTRAINT valid_trigger_type CHECK (trigger_transaction_type IN (
        'EXTERNAL_DEPOSIT',
        'EXTERNAL_WITHDRAWAL'
    ))
);

-- Index for active rules lookup
CREATE INDEX IF NOT EXISTS idx_allocation_active ON allocation_rules(is_active, trigger_transaction_type);

-- ============================================================================
-- AUDIT LOG TABLE
-- Records all changes to critical tables for compliance and debugging
-- ============================================================================
CREATE TABLE IF NOT EXISTS audit_log (
    id SERIAL PRIMARY KEY,
    table_name VARCHAR(100) NOT NULL,
    record_id INTEGER NOT NULL,
    operation VARCHAR(20) NOT NULL, -- 'CREATE', 'UPDATE', 'DELETE'
    old_values JSONB,
    new_values JSONB,
    changed_by VARCHAR(100),
    changed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45),
    user_agent TEXT,
    CONSTRAINT valid_operation CHECK (operation IN ('CREATE', 'UPDATE', 'DELETE'))
);

-- Index for audit queries
CREATE INDEX IF NOT EXISTS idx_audit_table ON audit_log(table_name, record_id);
CREATE INDEX IF NOT EXISTS idx_audit_timestamp ON audit_log(changed_at);

-- ============================================================================
-- RECONCILIATION LOG TABLE
-- Tracks reconciliation between internal ledger and external wallets
-- ============================================================================
CREATE TABLE IF NOT EXISTS reconciliation_log (
    id SERIAL PRIMARY KEY,
    reconciliation_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    external_wallet_address VARCHAR(255),
    external_wallet_balance DECIMAL(20, 8) NOT NULL,
    internal_ledger_balance DECIMAL(20, 8) NOT NULL,
    discrepancy DECIMAL(20, 8) NOT NULL,
    status VARCHAR(50) NOT NULL, -- 'MATCHED', 'DISCREPANCY', 'INVESTIGATING', 'RESOLVED'
    notes TEXT,
    reconciled_by VARCHAR(100),
    resolved_at TIMESTAMP WITH TIME ZONE,
    CONSTRAINT valid_recon_status CHECK (status IN ('MATCHED', 'DISCREPANCY', 'INVESTIGATING', 'RESOLVED'))
);

-- Index for reconciliation queries
CREATE INDEX IF NOT EXISTS idx_recon_date ON reconciliation_log(reconciliation_date);
CREATE INDEX IF NOT EXISTS idx_recon_status ON reconciliation_log(status);

-- ============================================================================
-- SEED DATA FOR DEVELOPMENT
-- Default logical accounts for Pi Forge treasury structure
-- ============================================================================
INSERT INTO logical_accounts (account_name, account_type, allocation_percentage, metadata) VALUES
    ('Reserve Treasury', 'RESERVE', 40.0, '{"description": "Long-term reserve fund for platform stability"}'),
    ('Development Fund', 'DEVELOPMENT', 25.0, '{"description": "Funding for platform development and improvements"}'),
    ('Community Rewards', 'COMMUNITY', 20.0, '{"description": "Rewards and incentives for community participation"}'),
    ('Operational Fund', 'OPERATIONAL', 15.0, '{"description": "Day-to-day operational expenses"}')
ON CONFLICT (account_name) DO NOTHING;

-- ============================================================================
-- DEFAULT ALLOCATION RULE
-- Automatically splits external deposits according to account allocations
-- ============================================================================
INSERT INTO allocation_rules (rule_name, trigger_transaction_type, purpose, allocations, priority, created_by) VALUES
    ('Default Deposit Allocation', 'EXTERNAL_DEPOSIT', 'Automatic allocation of incoming Pi deposits', 
     '[
        {"account_id": 1, "percentage": 40.0},
        {"account_id": 2, "percentage": 25.0},
        {"account_id": 3, "percentage": 20.0},
        {"account_id": 4, "percentage": 15.0}
     ]'::jsonb, 
     1, 'system')
ON CONFLICT (rule_name) DO NOTHING;

-- ============================================================================
-- TRIGGERS FOR AUTOMATIC TIMESTAMP UPDATES
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_logical_accounts_updated_at BEFORE UPDATE ON logical_accounts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ledger_transactions_updated_at BEFORE UPDATE ON ledger_transactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_allocation_rules_updated_at BEFORE UPDATE ON allocation_rules
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- VIEWS FOR COMMON QUERIES
-- ============================================================================

-- View: Current Treasury Status
CREATE OR REPLACE VIEW v_treasury_status AS
SELECT 
    la.id,
    la.account_name,
    la.account_type,
    la.current_balance,
    la.allocation_percentage,
    la.is_active,
    (SELECT SUM(current_balance) FROM logical_accounts WHERE is_active = TRUE) as total_balance,
    CASE 
        WHEN (SELECT SUM(current_balance) FROM logical_accounts WHERE is_active = TRUE) > 0 
        THEN ROUND((la.current_balance / (SELECT SUM(current_balance) FROM logical_accounts WHERE is_active = TRUE)) * 100, 2)
        ELSE 0
    END as actual_percentage
FROM logical_accounts la
WHERE la.is_active = TRUE
ORDER BY la.allocation_percentage DESC;

-- View: Recent Transactions
CREATE OR REPLACE VIEW v_recent_transactions AS
SELECT 
    lt.id,
    lt.transaction_hash,
    lt.transaction_type,
    fa.account_name as from_account,
    ta.account_name as to_account,
    lt.amount,
    lt.status,
    lt.purpose,
    lt.created_at,
    lt.completed_at
FROM ledger_transactions lt
LEFT JOIN logical_accounts fa ON lt.from_account_id = fa.id
LEFT JOIN logical_accounts ta ON lt.to_account_id = ta.id
ORDER BY lt.created_at DESC
LIMIT 100;

-- ============================================================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================================================
COMMENT ON TABLE logical_accounts IS 'Internal treasury accounts representing different fund allocations';
COMMENT ON TABLE ledger_transactions IS 'All financial transactions including external deposits/withdrawals and internal allocations';
COMMENT ON TABLE allocation_rules IS 'Rules defining automatic fund allocation on transaction triggers';
COMMENT ON TABLE audit_log IS 'Audit trail for all changes to critical financial data';
COMMENT ON TABLE reconciliation_log IS 'Reconciliation records between internal ledger and external blockchain state';

COMMENT ON COLUMN logical_accounts.allocation_percentage IS 'Target percentage for automatic allocation of incoming deposits';
COMMENT ON COLUMN ledger_transactions.parent_transaction_id IS 'Links child allocation transactions to parent deposit transaction';
COMMENT ON COLUMN allocation_rules.allocations IS 'JSONB array of allocation targets: [{"account_id": 1, "percentage": 40.0}, ...]';
COMMENT ON COLUMN allocation_rules.priority IS 'Execution priority (higher values execute first)';
