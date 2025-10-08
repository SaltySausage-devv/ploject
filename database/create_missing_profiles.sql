-- ============================================
-- CREATE MISSING PROFILES FOR AUTH USERS
-- ============================================
-- This creates public.users profiles for any auth.users
-- that don't have a profile yet
-- ============================================

-- 1. Check which auth users are missing profiles
SELECT
    a.id,
    a.email,
    a.created_at,
    '❌ MISSING PROFILE' as status
FROM auth.users a
LEFT JOIN public.users p ON a.id = p.id
WHERE p.id IS NULL
ORDER BY a.created_at DESC;

-- 2. Create missing profiles automatically
INSERT INTO public.users (id, email, first_name, last_name, user_type, created_at)
SELECT
    a.id,
    a.email,
    'User' as first_name,
    COALESCE(SPLIT_PART(a.email, '@', 1), 'User') as last_name,
    'student' as user_type,
    a.created_at
FROM auth.users a
LEFT JOIN public.users p ON a.id = p.id
WHERE p.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- 3. Verify all users now have profiles
SELECT
    COUNT(*) as total_auth_users,
    COUNT(p.id) as users_with_profiles,
    COUNT(*) - COUNT(p.id) as users_missing_profiles
FROM auth.users a
LEFT JOIN public.users p ON a.id = p.id;

-- ============================================
-- All auth users should now have profiles!
-- Try logging in now.
-- ============================================
