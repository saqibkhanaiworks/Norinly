-- =====================================================================
-- Norinly Supabase Database RLS Policies Fix
-- Copy and run these queries in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/_/sql
-- =====================================================================

-- OPTION A: Disable Row Level Security (Recommended for simplified anonymous apps)
-- ---------------------------------------------------------------------
ALTER TABLE match_queue DISABLE ROW LEVEL SECURITY;
ALTER TABLE sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE reports DISABLE ROW LEVEL SECURITY;
ALTER TABLE push_subscriptions DISABLE ROW LEVEL SECURITY;
ALTER TABLE rooms DISABLE ROW LEVEL SECURITY;
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- OPTION B: Enable RLS and Configure Explicit Anonymous Policies (If you prefer to keep RLS active)
-- ---------------------------------------------------------------------
/*
-- 1. match_queue policies
ALTER TABLE match_queue ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow anon select" ON match_queue;
DROP POLICY IF EXISTS "Allow anon insert" ON match_queue;
DROP POLICY IF EXISTS "Allow anon update" ON match_queue;
DROP POLICY IF EXISTS "Allow anon delete" ON match_queue;

CREATE POLICY "Allow anon select" ON match_queue FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anon insert" ON match_queue FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow anon update" ON match_queue FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon delete" ON match_queue FOR DELETE TO anon USING (true);

-- 2. sessions policies
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow anon select" ON sessions;
DROP POLICY IF EXISTS "Allow anon insert" ON sessions;
DROP POLICY IF EXISTS "Allow anon update" ON sessions;
DROP POLICY IF EXISTS "Allow anon delete" ON sessions;

CREATE POLICY "Allow anon select" ON sessions FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anon insert" ON sessions FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow anon update" ON sessions FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon delete" ON sessions FOR DELETE TO anon USING (true);

-- 3. reports policies
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow anon insert" ON reports;

CREATE POLICY "Allow anon insert" ON reports FOR INSERT TO anon WITH CHECK (true);

-- 4. push_subscriptions policies
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow anon select" ON push_subscriptions;
DROP POLICY IF EXISTS "Allow anon insert" ON push_subscriptions;
DROP POLICY IF EXISTS "Allow anon delete" ON push_subscriptions;

CREATE POLICY "Allow anon select" ON push_subscriptions FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anon insert" ON push_subscriptions FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow anon delete" ON push_subscriptions FOR DELETE TO anon USING (true);

-- 5. rooms policies
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow anon select" ON rooms;
DROP POLICY IF EXISTS "Allow anon update" ON rooms;

CREATE POLICY "Allow anon select" ON rooms FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anon update" ON rooms FOR UPDATE TO anon USING (true) WITH CHECK (true);
*/
