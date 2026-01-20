-- Supabase Ownership Tables Setup
-- Run this in Supabase SQL Editor

-- ==================== OWNERS TABLE ====================
CREATE TABLE IF NOT EXISTS owners (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  business_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE owners ENABLE ROW LEVEL SECURITY;

-- Owner can view their own record
CREATE POLICY "Owners can view own record" ON owners
  FOR SELECT USING (profile_id = auth.uid());

-- Owner can update their own record
CREATE POLICY "Owners can update own record" ON owners
  FOR UPDATE USING (profile_id = auth.uid());

-- Owner can insert their own record
CREATE POLICY "Owners can insert own record" ON owners
  FOR INSERT WITH CHECK (profile_id = auth.uid());

-- ==================== BUSES TABLE ====================
CREATE TABLE IF NOT EXISTS buses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  plate_number TEXT NOT NULL,
  route_number TEXT,
  owner_id UUID REFERENCES owners(id) ON DELETE CASCADE NOT NULL,
  bus_name TEXT,
  capacity INT DEFAULT 50,
  status TEXT CHECK (status IN ('active', 'inactive', 'maintenance')) DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE buses ENABLE ROW LEVEL SECURITY;

-- Owner can view their own buses
CREATE POLICY "Owners can view own buses" ON buses
  FOR SELECT USING (
    owner_id IN (SELECT id FROM owners WHERE profile_id = auth.uid())
  );

-- Owner can insert buses for themselves
CREATE POLICY "Owners can insert own buses" ON buses
  FOR INSERT WITH CHECK (
    owner_id IN (SELECT id FROM owners WHERE profile_id = auth.uid())
  );

-- Owner can update their own buses
CREATE POLICY "Owners can update own buses" ON buses
  FOR UPDATE USING (
    owner_id IN (SELECT id FROM owners WHERE profile_id = auth.uid())
  );

-- Owner can delete their own buses
CREATE POLICY "Owners can delete own buses" ON buses
  FOR DELETE USING (
    owner_id IN (SELECT id FROM owners WHERE profile_id = auth.uid())
  );

-- ==================== HELPER FUNCTION ====================
-- Function to get current user's owner_id
CREATE OR REPLACE FUNCTION get_my_owner_id()
RETURNS UUID AS $$
  SELECT id FROM owners WHERE profile_id = auth.uid() LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER;

-- ==================== INDEXES ====================
CREATE INDEX IF NOT EXISTS idx_buses_owner_id ON buses(owner_id);
CREATE INDEX IF NOT EXISTS idx_owners_profile_id ON owners(profile_id);
