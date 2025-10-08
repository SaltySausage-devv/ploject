-- ============================================
-- DISABLE ROW LEVEL SECURITY ON ALL TABLES
-- ============================================
-- WARNING: This removes security policies!
-- Only use for development/testing
-- Re-enable RLS before production!
-- ============================================

-- Disable RLS on all tables
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE tutor_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE centre_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE availability_slots DISABLE ROW LEVEL SECURITY;
ALTER TABLE bookings DISABLE ROW LEVEL SECURITY;
ALTER TABLE reviews DISABLE ROW LEVEL SECURITY;
ALTER TABLE conversations DISABLE ROW LEVEL SECURITY;
ALTER TABLE messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE notifications DISABLE ROW LEVEL SECURITY;
ALTER TABLE notification_preferences DISABLE ROW LEVEL SECURITY;
ALTER TABLE profile_views DISABLE ROW LEVEL SECURITY;
ALTER TABLE verification_documents DISABLE ROW LEVEL SECURITY;
ALTER TABLE review_reports DISABLE ROW LEVEL SECURITY;
ALTER TABLE push_tokens DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_points DISABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboards DISABLE ROW LEVEL SECURITY;
ALTER TABLE earnings DISABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_tokens DISABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_events DISABLE ROW LEVEL SECURITY;
ALTER TABLE location_cache DISABLE ROW LEVEL SECURITY;
ALTER TABLE travel_times DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies (optional - they won't be enforced anyway)
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Users can insert own profile" ON users;
DROP POLICY IF EXISTS "Anyone can view tutor profiles" ON tutor_profiles;
DROP POLICY IF EXISTS "Tutors can update own profile" ON tutor_profiles;
DROP POLICY IF EXISTS "Tutors can insert own profile" ON tutor_profiles;
DROP POLICY IF EXISTS "Anyone can view centre profiles" ON centre_profiles;
DROP POLICY IF EXISTS "Centres can update own profile" ON centre_profiles;
DROP POLICY IF EXISTS "Centres can insert own profile" ON centre_profiles;
DROP POLICY IF EXISTS "Users can view own bookings" ON bookings;
DROP POLICY IF EXISTS "Students can create bookings" ON bookings;
DROP POLICY IF EXISTS "Involved parties can update bookings" ON bookings;
DROP POLICY IF EXISTS "Anyone can view reviews" ON reviews;
DROP POLICY IF EXISTS "Students can create reviews" ON reviews;
DROP POLICY IF EXISTS "Users can view own conversations" ON conversations;
DROP POLICY IF EXISTS "Users can create conversations" ON conversations;
DROP POLICY IF EXISTS "Users can view own messages" ON messages;
DROP POLICY IF EXISTS "Users can send messages" ON messages;
DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;

-- ============================================
-- VERIFICATION
-- ============================================
SELECT
    tablename,
    CASE
        WHEN rowsecurity = true THEN 'ENABLED ⚠️'
        ELSE 'DISABLED ✓'
    END as rls_status
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- ============================================
-- RLS IS NOW DISABLED
-- ============================================
-- All tables are now accessible without security checks
-- Remember to re-enable RLS before production!
-- ============================================
