-- ============================================
-- DISABLE EMAIL CONFIRMATION REQUIREMENT
-- ============================================
-- This fixes "Invalid login credentials" when email isn't confirmed
-- ============================================

-- 1. Check current confirmation status
SELECT
    id,
    email,
    email_confirmed_at,
    CASE
        WHEN email_confirmed_at IS NULL THEN '❌ NOT CONFIRMED'
        ELSE '✅ CONFIRMED'
    END as confirmation_status,
    created_at
FROM auth.users
ORDER BY created_at DESC;

-- 2. Manually confirm all existing users
UPDATE auth.users
SET email_confirmed_at = NOW()
WHERE email_confirmed_at IS NULL;

-- 3. Verify all users are now confirmed
SELECT
    email,
    email_confirmed_at,
    '✅ NOW CONFIRMED' as status
FROM auth.users
ORDER BY created_at DESC;

-- ============================================
-- IMPORTANT: Also disable in Supabase Dashboard
-- ============================================
-- Go to: Authentication > Providers > Email
-- Turn OFF "Confirm email"
-- This prevents future signups from requiring confirmation
-- ============================================
