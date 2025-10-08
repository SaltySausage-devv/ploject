-- Quick fix to restore access to existing data
-- Run this in Supabase SQL editor

-- Temporarily disable RLS to restore access
ALTER TABLE conversations DISABLE ROW LEVEL SECURITY;
ALTER TABLE messages DISABLE ROW LEVEL SECURITY;

-- The data should now be accessible again
-- You can re-enable RLS later with proper policies if needed
