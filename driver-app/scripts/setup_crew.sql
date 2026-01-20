-- Supabase Bus Crew Tables Setup
-- Run this in Supabase SQL Editor

-- ==================== BUS CREWS TABLE ====================
CREATE TABLE IF NOT EXISTS bus_crews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  bus_id UUID REFERENCES buses(id) ON DELETE CASCADE NOT NULL,
  role TEXT CHECK (role IN ('driver', 'conductor')) DEFAULT 'driver',
  is_active BOOLEAN DEFAULT true,
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Each profile can only be assigned once per bus
  UNIQUE(profile_id, bus_id)
);

-- Enable RLS
ALTER TABLE bus_crews ENABLE ROW LEVEL SECURITY;

-- Crew can view their own assignments
CREATE POLICY "Crew can view own assignments" ON bus_crews
  FOR SELECT USING (profile_id = auth.uid());

-- Owners can view crew for their buses
CREATE POLICY "Owners can view crew for own buses" ON bus_crews
  FOR SELECT USING (
    bus_id IN (
      SELECT b.id FROM buses b
      JOIN owners o ON b.owner_id = o.id
      WHERE o.profile_id = auth.uid()
    )
  );

-- Owners can assign crew to their buses
CREATE POLICY "Owners can insert crew for own buses" ON bus_crews
  FOR INSERT WITH CHECK (
    bus_id IN (
      SELECT b.id FROM buses b
      JOIN owners o ON b.owner_id = o.id
      WHERE o.profile_id = auth.uid()
    )
  );

-- Owners can update crew assignments for their buses
CREATE POLICY "Owners can update crew for own buses" ON bus_crews
  FOR UPDATE USING (
    bus_id IN (
      SELECT b.id FROM buses b
      JOIN owners o ON b.owner_id = o.id
      WHERE o.profile_id = auth.uid()
    )
  );

-- Owners can remove crew from their buses
CREATE POLICY "Owners can delete crew from own buses" ON bus_crews
  FOR DELETE USING (
    bus_id IN (
      SELECT b.id FROM buses b
      JOIN owners o ON b.owner_id = o.id
      WHERE o.profile_id = auth.uid()
    )
  );

-- ==================== UPDATE BUSES RLS ====================
-- Allow crew to view buses they're assigned to
CREATE POLICY "Crew can view assigned buses" ON buses
  FOR SELECT USING (
    id IN (SELECT bus_id FROM bus_crews WHERE profile_id = auth.uid() AND is_active = true)
  );

-- ==================== INDEXES ====================
CREATE INDEX IF NOT EXISTS idx_bus_crews_profile_id ON bus_crews(profile_id);
CREATE INDEX IF NOT EXISTS idx_bus_crews_bus_id ON bus_crews(bus_id);
CREATE INDEX IF NOT EXISTS idx_bus_crews_active ON bus_crews(is_active) WHERE is_active = true;

-- ==================== HELPER FUNCTIONS ====================
-- Get buses assigned to current crew member
CREATE OR REPLACE FUNCTION get_my_assigned_buses()
RETURNS SETOF buses AS $$
  SELECT b.* FROM buses b
  JOIN bus_crews bc ON b.id = bc.bus_id
  WHERE bc.profile_id = auth.uid() AND bc.is_active = true;
$$ LANGUAGE sql SECURITY DEFINER;
