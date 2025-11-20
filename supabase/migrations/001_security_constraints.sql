-- ============================================
-- SubSentry Database Security & Constraints
-- Run these in your Supabase SQL Editor
-- ============================================

-- 1. ADD DATABASE CONSTRAINTS
-- ============================================

-- Ensure positive subscription amounts
ALTER TABLE subscriptions
DROP CONSTRAINT IF EXISTS positive_amount;

ALTER TABLE subscriptions
ADD CONSTRAINT positive_amount CHECK (amount > 0);

-- Valid billing cycles
ALTER TABLE subscriptions
DROP CONSTRAINT IF EXISTS valid_billing_cycle;

ALTER TABLE subscriptions
ADD CONSTRAINT valid_billing_cycle 
CHECK (billing_cycle IN ('weekly', 'monthly', 'yearly'));

-- Valid subscription statuses
ALTER TABLE subscriptions
DROP CONSTRAINT IF EXISTS valid_status;

ALTER TABLE subscriptions
ADD CONSTRAINT valid_status 
CHECK (status IN ('active', 'paused', 'cancelled'));

-- Valid currency codes (ISO 4217)
ALTER TABLE subscriptions
DROP CONSTRAINT IF EXISTS valid_currency;

ALTER TABLE subscriptions
ADD CONSTRAINT valid_currency 
CHECK (currency ~ '^[A-Z]{3}$');

-- User preferences currency validation
ALTER TABLE user_preferences
DROP CONSTRAINT IF EXISTS valid_pref_currency;

ALTER TABLE user_preferences
ADD CONSTRAINT valid_pref_currency 
CHECK (currency IS NULL OR currency ~ '^[A-Z]{3}$');

-- Positive budget
ALTER TABLE user_preferences
DROP CONSTRAINT IF EXISTS positive_budget;

ALTER TABLE user_preferences
ADD CONSTRAINT positive_budget 
CHECK (monthly_budget IS NULL OR monthly_budget >= 0);


-- 2. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on tables
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can view own subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "Users can insert own subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "Users can update own subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "Users can delete own subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "Users can manage own preferences" ON user_preferences;

-- SUBSCRIPTIONS POLICIES
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

-- USER_PREFERENCES POLICIES
CREATE POLICY "Users can manage own preferences"
ON user_preferences FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);


-- 3. INDEXES FOR PERFORMANCE
-- ============================================

-- Index on user_id for faster queries
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id 
ON subscriptions(user_id);

CREATE INDEX IF NOT EXISTS idx_subscriptions_status 
ON subscriptions(status);

CREATE INDEX IF NOT EXISTS idx_subscriptions_next_renewal 
ON subscriptions(next_renewal_date);

-- Composite index for common query pattern
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_status 
ON subscriptions(user_id, status);


-- 4. VERIFICATION QUERIES
-- ============================================
-- Run these to verify everything is set up correctly

-- Check constraints
SELECT 
    conname as constraint_name,
    contype as constraint_type,
    pg_get_constraintdef(oid) as definition
FROM pg_constraint
WHERE conrelid = 'subscriptions'::regclass
   OR conrelid = 'user_preferences'::regclass
ORDER BY conrelid, conname;

-- Check RLS policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename IN ('subscriptions', 'user_preferences')
ORDER BY tablename, policyname;

-- Check indexes
SELECT 
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE tablename IN ('subscriptions', 'user_preferences')
ORDER BY tablename, indexname;
