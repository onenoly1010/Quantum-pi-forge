-- =====================================================
-- Pi Forge Quantum Genesis - Resonance & NFT Schema
-- Version: 1.0.0
-- Purpose: Track resonance scores, user metadata, and NFT mints
-- =====================================================

-- =====================================================
-- RESONANCE_SCORES TABLE
-- Tracks quantum resonance evolution per user
-- =====================================================
CREATE TABLE IF NOT EXISTS resonance_scores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- User reference
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Resonance metrics (0.0 to 1.0 scale)
    harmony_index DECIMAL(5, 4) NOT NULL DEFAULT 0.5000 CHECK (harmony_index >= 0 AND harmony_index <= 1),
    ethical_entropy DECIMAL(5, 4) NOT NULL DEFAULT 0.3000 CHECK (ethical_entropy >= 0 AND ethical_entropy <= 1),
    consciousness_level DECIMAL(5, 4) NOT NULL DEFAULT 0.2500 CHECK (consciousness_level >= 0 AND consciousness_level <= 1),
    
    -- Composite resonance score (auto-calculated)
    composite_score DECIMAL(5, 4) GENERATED ALWAYS AS (
        (harmony_index * 0.4) + ((1.0 - ethical_entropy) * 0.3) + (consciousness_level * 0.3)
    ) STORED,
    
    -- Resonance phase classification
    resonance_phase VARCHAR(50) NOT NULL DEFAULT 'foundation' CHECK (resonance_phase IN (
        'foundation',
        'growth', 
        'harmony',
        'transcendence'
    )),
    
    -- Engagement metrics
    total_payments INTEGER NOT NULL DEFAULT 0,
    total_pi_volume DECIMAL(18, 7) NOT NULL DEFAULT 0,
    guardian_validations INTEGER NOT NULL DEFAULT 0,
    
    -- Archetype distribution (JSONB for flexibility)
    archetype_affinity JSONB DEFAULT '{
        "sage": 0.25,
        "explorer": 0.25,
        "creator": 0.25,
        "guardian": 0.25
    }'::jsonb,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_resonance_update TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure one record per user
    CONSTRAINT unique_user_resonance UNIQUE (user_id)
);

-- =====================================================
-- USER_METADATA TABLE
-- Extended user profile for Pi Network integration
-- =====================================================
CREATE TABLE IF NOT EXISTS user_metadata (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- User reference
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Pi Network identity
    pi_uid VARCHAR(255),
    pi_username VARCHAR(100),
    pi_verified BOOLEAN DEFAULT FALSE,
    
    -- Genesis status
    genesis_fee_paid BOOLEAN DEFAULT FALSE,
    genesis_fee_payment_id VARCHAR(255),
    genesis_fee_txid VARCHAR(255),
    genesis_timestamp TIMESTAMP WITH TIME ZONE,
    
    -- NFT ownership
    nft_collection_ids TEXT[] DEFAULT ARRAY[]::TEXT[],
    total_nfts_minted INTEGER DEFAULT 0,
    
    -- Preferences (JSONB for flexibility)
    preferences JSONB DEFAULT '{
        "visualization_theme": "quantum",
        "notification_enabled": true,
        "privacy_mode": false
    }'::jsonb,
    
    -- Profile stats
    first_payment_at TIMESTAMP WITH TIME ZONE,
    last_active_at TIMESTAMP WITH TIME ZONE,
    total_sessions INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure one metadata record per user
    CONSTRAINT unique_user_metadata UNIQUE (user_id)
);

-- =====================================================
-- NFT_MINT_LOGS TABLE
-- Track all NFT minting events and resonance artifacts
-- =====================================================
CREATE TABLE IF NOT EXISTS nft_mint_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- User reference
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- NFT identification
    collection_id VARCHAR(100) NOT NULL,
    token_id VARCHAR(255) NOT NULL,
    
    -- NFT metadata
    nft_type VARCHAR(50) NOT NULL CHECK (nft_type IN (
        'genesis_artifact',
        'resonance_badge',
        'archetype_emblem',
        'transcendence_mark',
        'guardian_seal'
    )),
    
    -- Associated payment (if applicable)
    payment_id UUID REFERENCES payments(id) ON DELETE SET NULL,
    
    -- Resonance snapshot at mint time
    resonance_snapshot JSONB DEFAULT '{}'::jsonb,
    
    -- Minting details
    mint_status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (mint_status IN (
        'pending',
        'minting',
        'confirmed',
        'failed'
    )),
    
    -- Blockchain data (for 0G Aristotle or Pi mainnet)
    chain_id INTEGER,
    tx_hash VARCHAR(255),
    block_number BIGINT,
    
    -- Metadata URI (IPFS or similar)
    metadata_uri TEXT,
    image_uri TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    minted_at TIMESTAMP WITH TIME ZONE,
    confirmed_at TIMESTAMP WITH TIME ZONE,
    
    -- Ensure unique token per collection
    CONSTRAINT unique_collection_token UNIQUE (collection_id, token_id)
);

-- =====================================================
-- GENESIS_FEE_TRANSACTIONS TABLE
-- Dedicated tracking for Genesis Fee payments
-- =====================================================
CREATE TABLE IF NOT EXISTS genesis_fee_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- User reference
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Payment reference
    payment_id UUID REFERENCES payments(id) ON DELETE SET NULL,
    pi_payment_id VARCHAR(255) NOT NULL,
    
    -- Transaction details
    amount DECIMAL(18, 7) NOT NULL,
    fee_type VARCHAR(50) NOT NULL DEFAULT 'genesis' CHECK (fee_type IN (
        'genesis',
        'renewal',
        'upgrade'
    )),
    
    -- Status tracking
    status VARCHAR(50) NOT NULL DEFAULT 'initiated' CHECK (status IN (
        'initiated',
        'pending_approval',
        'approved',
        'completed',
        'failed',
        'refunded'
    )),
    
    -- Bridge metadata
    bridge_session_id VARCHAR(255),
    bridge_metadata JSONB DEFAULT '{}'::jsonb,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    approved_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    
    -- One genesis fee per user (can have renewal/upgrade)
    CONSTRAINT unique_user_genesis UNIQUE (user_id, fee_type)
);

-- =====================================================
-- INDEXES
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_resonance_user_id ON resonance_scores(user_id);
CREATE INDEX IF NOT EXISTS idx_resonance_phase ON resonance_scores(resonance_phase);
CREATE INDEX IF NOT EXISTS idx_resonance_composite ON resonance_scores(composite_score DESC);

CREATE INDEX IF NOT EXISTS idx_user_metadata_user_id ON user_metadata(user_id);
CREATE INDEX IF NOT EXISTS idx_user_metadata_pi_uid ON user_metadata(pi_uid);
CREATE INDEX IF NOT EXISTS idx_user_metadata_genesis ON user_metadata(genesis_fee_paid);

CREATE INDEX IF NOT EXISTS idx_nft_mint_user_id ON nft_mint_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_nft_mint_collection ON nft_mint_logs(collection_id);
CREATE INDEX IF NOT EXISTS idx_nft_mint_status ON nft_mint_logs(mint_status);
CREATE INDEX IF NOT EXISTS idx_nft_mint_type ON nft_mint_logs(nft_type);

CREATE INDEX IF NOT EXISTS idx_genesis_fee_user_id ON genesis_fee_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_genesis_fee_status ON genesis_fee_transactions(status);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================
ALTER TABLE resonance_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE nft_mint_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE genesis_fee_transactions ENABLE ROW LEVEL SECURITY;

-- Users can view their own data
CREATE POLICY "Users can view own resonance" ON resonance_scores FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view own metadata" ON user_metadata FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view own nft logs" ON nft_mint_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view own genesis fees" ON genesis_fee_transactions FOR SELECT USING (auth.uid() = user_id);

-- Service role has full access
CREATE POLICY "Service role full resonance" ON resonance_scores FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full metadata" ON user_metadata FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full nft logs" ON nft_mint_logs FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full genesis fees" ON genesis_fee_transactions FOR ALL USING (auth.role() = 'service_role');

-- =====================================================
-- TRIGGERS
-- =====================================================
CREATE TRIGGER update_resonance_updated_at
    BEFORE UPDATE ON resonance_scores
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_metadata_updated_at
    BEFORE UPDATE ON user_metadata
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Function to determine resonance phase from composite score
CREATE OR REPLACE FUNCTION determine_resonance_phase(score DECIMAL)
RETURNS VARCHAR(50) AS $$
BEGIN
    IF score >= 0.85 THEN RETURN 'transcendence';
    ELSIF score >= 0.70 THEN RETURN 'harmony';
    ELSIF score >= 0.50 THEN RETURN 'growth';
    ELSE RETURN 'foundation';
    END IF;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to update resonance phase automatically
CREATE OR REPLACE FUNCTION auto_update_resonance_phase()
RETURNS TRIGGER AS $$
BEGIN
    NEW.resonance_phase := determine_resonance_phase(NEW.composite_score);
    NEW.last_resonance_update := NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER auto_resonance_phase
    BEFORE INSERT OR UPDATE ON resonance_scores
    FOR EACH ROW EXECUTE FUNCTION auto_update_resonance_phase();

-- Function to initialize user resonance on first payment
CREATE OR REPLACE FUNCTION initialize_user_resonance()
RETURNS TRIGGER AS $$
BEGIN
    -- Create resonance record if not exists
    INSERT INTO resonance_scores (user_id)
    VALUES (NEW.user_id)
    ON CONFLICT (user_id) DO UPDATE SET
        total_payments = resonance_scores.total_payments + 1,
        total_pi_volume = resonance_scores.total_pi_volume + NEW.amount;
    
    -- Create metadata record if not exists
    INSERT INTO user_metadata (user_id, first_payment_at)
    VALUES (NEW.user_id, NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        last_active_at = NOW();
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER payment_init_resonance
    AFTER INSERT ON payments
    FOR EACH ROW EXECUTE FUNCTION initialize_user_resonance();

-- =====================================================
-- VIEWS
-- =====================================================

-- Leaderboard view for top resonators
CREATE OR REPLACE VIEW resonance_leaderboard AS
SELECT 
    r.user_id,
    um.pi_username,
    r.composite_score,
    r.resonance_phase,
    r.harmony_index,
    r.total_payments,
    r.total_pi_volume,
    um.total_nfts_minted,
    r.archetype_affinity,
    RANK() OVER (ORDER BY r.composite_score DESC) as rank
FROM resonance_scores r
LEFT JOIN user_metadata um ON r.user_id = um.user_id
ORDER BY r.composite_score DESC;

-- Genesis pioneers view
CREATE OR REPLACE VIEW genesis_pioneers AS
SELECT 
    um.user_id,
    um.pi_username,
    um.genesis_timestamp,
    gft.amount as genesis_amount,
    r.resonance_phase,
    r.composite_score
FROM user_metadata um
JOIN genesis_fee_transactions gft ON um.user_id = gft.user_id AND gft.fee_type = 'genesis'
LEFT JOIN resonance_scores r ON um.user_id = r.user_id
WHERE um.genesis_fee_paid = TRUE
ORDER BY um.genesis_timestamp ASC;

-- =====================================================
-- GRANTS
-- =====================================================
GRANT SELECT ON resonance_scores TO authenticated;
GRANT SELECT ON user_metadata TO authenticated;
GRANT SELECT ON nft_mint_logs TO authenticated;
GRANT SELECT ON genesis_fee_transactions TO authenticated;
GRANT SELECT ON resonance_leaderboard TO authenticated;
GRANT SELECT ON genesis_pioneers TO authenticated;

-- =====================================================
-- DOCUMENTATION
-- =====================================================
COMMENT ON TABLE resonance_scores IS 'Tracks quantum resonance evolution and consciousness metrics per user';
COMMENT ON TABLE user_metadata IS 'Extended user profile with Pi Network identity and genesis status';
COMMENT ON TABLE nft_mint_logs IS 'Records all NFT minting events and resonance artifacts';
COMMENT ON TABLE genesis_fee_transactions IS 'Dedicated tracking for Genesis Fee payments through the bridge';

COMMENT ON COLUMN resonance_scores.composite_score IS 'Auto-calculated: (harmony * 0.4) + ((1 - entropy) * 0.3) + (consciousness * 0.3)';
COMMENT ON COLUMN resonance_scores.archetype_affinity IS 'JSON distribution of sage, explorer, creator, guardian affinities';
COMMENT ON COLUMN nft_mint_logs.resonance_snapshot IS 'Captures resonance state at moment of NFT mint';
