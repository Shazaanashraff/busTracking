-- Bus Status Table for Crowd Level
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS bus_status (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  bus_id UUID REFERENCES buses(id) ON DELETE CASCADE UNIQUE NOT NULL,
  crowd_level TEXT CHECK (crowd_level IN ('Free', 'Medium', 'Full')) DEFAULT 'Free',
  passenger_count INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  last_stop TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID REFERENCES profiles(id)
);

ALTER TABLE bus_status ENABLE ROW LEVEL SECURITY;

-- Anyone can view bus status (passengers need this)
CREATE POLICY "Anyone can view bus status" ON bus_status
  FOR SELECT USING (true);

-- Crew can update bus status
CREATE POLICY "Crew can update bus status" ON bus_status
  FOR UPDATE USING (
    bus_id IN (SELECT bus_id FROM bus_crews WHERE profile_id = auth.uid() AND is_active = true)
  );

-- Crew can insert bus status
CREATE POLICY "Crew can insert bus status" ON bus_status
  FOR INSERT WITH CHECK (
    bus_id IN (SELECT bus_id FROM bus_crews WHERE profile_id = auth.uid() AND is_active = true)
  );

-- Owners can update bus status
CREATE POLICY "Owners can update bus status" ON bus_status
  FOR UPDATE USING (
    bus_id IN (
      SELECT b.id FROM buses b
      JOIN owners o ON b.owner_id = o.id
      WHERE o.profile_id = auth.uid()
    )
  );

CREATE POLICY "Owners can insert bus status" ON bus_status
  FOR INSERT WITH CHECK (
    bus_id IN (
      SELECT b.id FROM buses b
      JOIN owners o ON b.owner_id = o.id
      WHERE o.profile_id = auth.uid()
    )
  );

-- Enable Realtime
DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE bus_status;
EXCEPTION WHEN duplicate_object THEN
  NULL;
END $$;

-- Index
CREATE INDEX IF NOT EXISTS idx_bus_status_bus_id ON bus_status(bus_id);

-- Auto-update timestamp trigger
CREATE OR REPLACE FUNCTION update_bus_status_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS bus_status_timestamp ON bus_status;
CREATE TRIGGER bus_status_timestamp
  BEFORE UPDATE ON bus_status
  FOR EACH ROW EXECUTE FUNCTION update_bus_status_timestamp();
