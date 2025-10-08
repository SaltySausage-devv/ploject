-- ============================================
-- CHECK AUTH USERS AND FIX MISMATCHES
-- ============================================

-- 1. Check if users exist in auth.users but not in public.users
SELECT
    a.id,
    a.email,
    a.email_confirmed_at,
    a.created_at,
    CASE
        WHEN p.id IS NULL THEN '❌ MISSING FROM public.users'
        ELSE '✅ EXISTS IN public.users'
    END as status
FROM auth.users a
LEFT JOIN public.users p ON a.id = p.id
ORDER BY a.created_at DESC;

-- 2. Check if users exist in public.users but not in auth.users (orphaned)
SELECT
    p.id,
    p.email,
    p.first_name,
    '⚠️ ORPHANED (no auth.users entry)' as status
FROM public.users p
LEFT JOIN auth.users a ON p.id = a.id
WHERE a.id IS NULL;

-- ============================================
-- FIX: Create missing public.users entries
-- ============================================
-- This will create public.users entries for any auth.users that don't have one

INSERT INTO public.users (id, email, first_name, last_name, user_type, created_at)
SELECT
    a.id,
    a.email,
    'User' as first_name,
    '' as last_name,
    'student' as user_type,
    a.created_at
FROM auth.users a
LEFT JOIN public.users p ON a.id = p.id
WHERE p.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- VERIFY THE FIX
-- ============================================
SELECT
    COUNT(CASE WHEN p.id IS NOT NULL THEN 1 END) as matched_users,
    COUNT(CASE WHEN p.id IS NULL THEN 1 END) as missing_users
FROM auth.users a
LEFT JOIN public.users p ON a.id = p.id;
