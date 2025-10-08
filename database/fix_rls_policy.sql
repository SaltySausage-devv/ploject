-- ============================================
-- FIX RLS POLICY FOR USER REGISTRATION
-- ============================================
-- This fixes the "new row violates row-level security policy" error
-- The issue: RLS policy is too restrictive during registration
-- ============================================

-- Drop all existing policies on users table
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Users can insert own profile" ON users;

-- Recreate policies with proper role targeting

-- 1. SELECT: Users can view their own profile
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT
    TO authenticated
    USING (auth.uid() = id);

-- 2. INSERT: Allow authenticated users to insert their own profile during registration
CREATE POLICY "Users can insert own profile" ON users
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = id);

-- 3. UPDATE: Users can update their own profile
CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- ============================================
-- VERIFICATION
-- ============================================
-- Check that all policies are correctly created
SELECT
    policyname,
    cmd,
    roles
FROM pg_policies
WHERE tablename = 'users'
ORDER BY cmd;
