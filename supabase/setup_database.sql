-- ============================================
-- SubSentry - Complete Database Setup
-- Run this in Supabase SQL Editor
-- ============================================

-- ============================================
-- 1. CREATE TABLES
-- ============================================

-- Subscriptions Table
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    billing_cycle VARCHAR(20) NOT NULL,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    next_renewal_date TIMESTAMP WITH TIME ZONE NOT NULL,
    category VARCHAR(100),
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    description TEXT,
    website_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Preferences Table
CREATE TABLE IF NOT EXISTS user_preferences (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    renewal_alerts BOOLEAN DEFAULT true,
    price_changes BOOLEAN DEFAULT true,
    marketing_emails BOOLEAN DEFAULT false,
    monthly_budget NUMERIC(10, 2) DEFAULT 100,
    currency VARCHAR(3) DEFAULT 'USD',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 2. ADD CONSTRAINTS
-- ============================================

-- Subscriptions Constraints
ALTER TABLE subscriptions
DROP CONSTRAINT IF EXISTS positive_amount;

ALTER TABLE subscriptions
ADD CONSTRAINT positive_amount CHECK (amount > 0);

ALTER TABLE subscriptions
DROP CONSTRAINT IF EXISTS valid_billing_cycle;

ALTER TABLE subscriptions
ADD CONSTRAINT valid_billing_cycle 
CHECK (billing_cycle IN ('weekly', 'monthly', 'yearly'));

ALTER TABLE subscriptions
DROP CONSTRAINT IF EXISTS valid_status;

ALTER TABLE subscriptions
ADD CONSTRAINT valid_status 
CHECK (status IN ('active', 'paused', 'cancelled'));

ALTER TABLE subscriptions
DROP CONSTRAINT IF EXISTS valid_currency;

ALTER TABLE subscriptions
ADD CONSTRAINT valid_currency 
CHECK (currency ~ '^[A-Z]{3}$');

-- User Preferences Constraints
ALTER TABLE user_preferences
DROP CONSTRAINT IF EXISTS valid_pref_currency;

ALTER TABLE user_preferences
ADD CONSTRAINT valid_pref_currency 
CHECK (currency IS NULL OR currency ~ '^[A-Z]{3}$');

ALTER TABLE user_preferences
DROP CONSTRAINT IF EXISTS positive_budget;

ALTER TABLE user_preferences
ADD CONSTRAINT positive_budget 
CHECK (monthly_budget IS NULL OR monthly_budget >= 0);

-- ============================================
-- 3. CREATE INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id 
ON subscriptions(user_id);

CREATE INDEX IF NOT EXISTS idx_subscriptions_status 
ON subscriptions(status);

CREATE INDEX IF NOT EXISTS idx_subscriptions_next_renewal 
ON subscriptions(next_renewal_date);

CREATE INDEX IF NOT EXISTS idx_subscriptions_user_status 
ON subscriptions(user_id, status);

CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id 
ON user_preferences(user_id);

-- ============================================
-- 4. ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any (safe to run even if they don't exist)
DROP POLICY IF EXISTS "Users can view own subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "Users can insert own subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "Users can update own subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "Users can delete own subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "Users can manage own preferences" ON user_preferences;

-- ============================================
-- 5. CREATE RLS POLICIES
-- ============================================

-- Subscriptions Policies
CREATE POLICY "Users can view own subscriptions"
ON subscriptions FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own subscriptions"
ON subscriptions FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own subscriptions"
ON subscriptions FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own subscriptions"
ON subscriptions FOR DELETE
USING (auth.uid() = user_id);

-- User Preferences Policies
CREATE POLICY "Users can manage own preferences"
ON user_preferences FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- ============================================
-- 6. CREATE UPDATED_AT TRIGGER
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for subscriptions
DROP TRIGGER IF EXISTS update_subscriptions_updated_at ON subscriptions;
CREATE TRIGGER update_subscriptions_updated_at
    BEFORE UPDATE ON subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger for user_preferences
DROP TRIGGER IF EXISTS update_user_preferences_updated_at ON user_preferences;
CREATE TRIGGER update_user_preferences_updated_at
    BEFORE UPDATE ON user_preferences
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 7. VERIFICATION QUERIES (OPTIONAL)
-- ============================================
-- Uncomment these to verify everything is set up correctly

-- Check tables exist
-- SELECT table_name 
-- FROM information_schema.tables 
-- WHERE table_schema = 'public' 
-- AND table_name IN ('subscriptions', 'user_preferences');

-- Check constraints
-- SELECT 
--     conname as constraint_name,
--     contype as constraint_type,
--     pg_get_constraintdef(oid) as definition
-- FROM pg_constraint
-- WHERE conrelid = 'subscriptions'::regclass
--    OR conrelid = 'user_preferences'::regclass
-- ORDER BY conrelid, conname;

-- Check RLS policies
-- SELECT 
--     schemaname,
--     tablename,
--     policyname,
--     permissive,
--     cmd
-- FROM pg_policies
-- WHERE tablename IN ('subscriptions', 'user_preferences')
-- ORDER BY tablename, policyname;

-- Check indexes
-- SELECT 
--     tablename,
--     indexname,
--     indexdef
-- FROM pg_indexes
-- WHERE tablename IN ('subscriptions', 'user_preferences')
-- ORDER BY tablename, indexname;

-- ============================================
-- SETUP COMPLETE!
-- ============================================
-- Your database is now ready for SubSentry
