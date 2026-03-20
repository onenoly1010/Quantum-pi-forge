-- =====================================================
-- Pi Forge Quantum Genesis - Payments Schema
-- Version: 1.0.0
-- Purpose: Track Pi Network payments and transactions
-- =====================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- PAYMENTS TABLE
-- Stores all Pi Network payment transactions
-- =====================================================
CREATE TABLE IF NOT EXISTS payments (
    -- Primary key
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Pi Network payment information
    payment_id VARCHAR(255) UNIQUE NOT NULL,
    txid VARCHAR(255),  -- Blockchain transaction ID (null until completed)
    
    -- User and amount
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    amount DECIMAL(18, 7) NOT NULL CHECK (amount > 0),  -- Pi supports 7 decimals
    
    -- Payment status
    status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN (
        'pending',
        'approved',
        'completed',
        'cancelled',
        'failed'
    )),
    
    -- Quantum resonance state (for visualization)
    resonance_state VARCHAR(50) CHECK (resonance_state IN (
        'foundation',
        'growth',
        'harmony',
        'transcendence'
    )),
    
    -- Additional metadata (JSON for flexibility)
    metadata JSONB DEFAULT '{}'::jsonb,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    approved_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Indexes for performance
    CONSTRAINT payment_id_unique UNIQUE (payment_id)
);

-- =====================================================
-- INDEXES
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_txid ON payments(txid);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON payments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_payments_completed_at ON payments(completed_at DESC) WHERE completed_at IS NOT NULL;

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Users can view their own payments
CREATE POLICY "Users can view own payments"
    ON payments FOR SELECT
    USING (auth.uid() = user_id);

-- Users can insert their own payments
CREATE POLICY "Users can create own payments"
    ON payments FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Service role can do everything (for backend operations)
CREATE POLICY "Service role has full access"
    ON payments FOR ALL
    USING (auth.role() = 'service_role');

-- =====================================================
-- UPDATED_AT TRIGGER
-- Automatically update updated_at timestamp
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_payments_updated_at
    BEFORE UPDATE ON payments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- PAYMENT_ANALYTICS VIEW
-- For dashboard analytics and reporting
-- =====================================================
CREATE OR REPLACE VIEW payment_analytics AS
SELECT 
    DATE_TRUNC('day', created_at) as payment_date,
    status,
    resonance_state,
    COUNT(*) as payment_count,
    SUM(amount) as total_amount,
    AVG(amount) as avg_amount,
    MIN(amount) as min_amount,
    MAX(amount) as max_amount
FROM payments
GROUP BY DATE_TRUNC('day', created_at), status, resonance_state
ORDER BY payment_date DESC;

-- =====================================================
-- USER_PAYMENT_SUMMARY VIEW
-- Summary of payments per user
-- =====================================================
CREATE OR REPLACE VIEW user_payment_summary AS
SELECT 
    user_id,
    COUNT(*) as total_payments,
    COUNT(*) FILTER (WHERE status = 'completed') as completed_payments,
    COUNT(*) FILTER (WHERE status = 'pending') as pending_payments,
    SUM(amount) FILTER (WHERE status = 'completed') as total_pi_spent,
    MAX(completed_at) as last_payment_date
FROM payments
GROUP BY user_id;

-- =====================================================
-- GRANT PERMISSIONS
-- =====================================================
GRANT SELECT, INSERT, UPDATE ON payments TO authenticated;
GRANT SELECT ON payment_analytics TO authenticated;
GRANT SELECT ON user_payment_summary TO authenticated;

-- =====================================================
-- COMMENTS FOR DOCUMENTATION
-- =====================================================
COMMENT ON TABLE payments IS 'Stores all Pi Network payment transactions with quantum resonance states';
COMMENT ON COLUMN payments.payment_id IS 'Unique payment ID from Pi Network SDK';
COMMENT ON COLUMN payments.txid IS 'Blockchain transaction ID (populated after completion)';
COMMENT ON COLUMN payments.resonance_state IS 'Quantum resonance visualization state based on payment amount';
COMMENT ON COLUMN payments.metadata IS 'Flexible JSON storage for additional payment context';

-- =====================================================
-- SAMPLE QUERY EXAMPLES (for reference)
-- =====================================================
-- Get all completed payments for a user:
-- SELECT * FROM payments WHERE user_id = '...' AND status = 'completed' ORDER BY completed_at DESC;

-- Get payment analytics for last 30 days:
-- SELECT * FROM payment_analytics WHERE payment_date >= NOW() - INTERVAL '30 days';

-- Get user payment summary:
-- SELECT * FROM user_payment_summary WHERE user_id = '...';

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================
