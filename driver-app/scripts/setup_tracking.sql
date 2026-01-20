-- Supabase Live Bus Tracking Setup
-- Run this in Supabase SQL Editor

-- ==================== BUS LOCATIONS TABLE ====================
CREATE TABLE IF NOT EXISTS bus_locations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  bus_id UUID REFERENCES buses(id) ON DELETE CASCADE UNIQUE NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  speed DOUBLE PRECISION DEFAULT 0,
  heading DOUBLE PRECISION DEFAULT 0,
  accuracy DOUBLE PRECISION,
  is_moving BOOLEAN DEFAULT false,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE bus_locations ENABLE ROW LEVEL SECURITY;

-- Anyone can view bus locations (for passenger tracking)
CREATE POLICY "Anyone can view bus locations" ON bus_locations
  FOR SELECT USING (true);

-- Only crew assigned to the bus can update location
CREATE POLICY "Crew can update own bus location" ON bus_locations
  FOR UPDATE USING (
    bus_id IN (SELECT bus_id FROM bus_crews WHERE profile_id = auth.uid() AND is_active = true)
  );

-- Only crew can insert location for their bus
CREATE POLICY "Crew can insert own bus location" ON bus_locations
  FOR INSERT WITH CHECK (
    bus_id IN (SELECT bus_id FROM bus_crews WHERE profile_id = auth.uid() AND is_active = true)
  );

-- Owners can also update location for their buses
CREATE POLICY "Owners can update own bus location" ON bus_locations
  FOR UPDATE USING (
    bus_id IN (
      SELECT b.id FROM buses b
      JOIN owners o ON b.owner_id = o.id
      WHERE o.profile_id = auth.uid()
    )
  );

CREATE POLICY "Owners can insert own bus location" ON bus_locations
  FOR INSERT WITH CHECK (
    bus_id IN (
      SELECT b.id FROM buses b
      JOIN owners o ON b.owner_id = o.id
      WHERE o.profile_id = auth.uid()
    )
  );

-- ==================== ENABLE REALTIME ====================
-- Enable realtime for bus_locations table
ALTER PUBLICATION supabase_realtime ADD TABLE bus_locations;

-- ==================== INDEXES ====================
CREATE INDEX IF NOT EXISTS idx_bus_locations_bus_id ON bus_locations(bus_id);
CREATE INDEX IF NOT EXISTS idx_bus_locations_updated_at ON bus_locations(updated_at);

-- ==================== AUTO-UPDATE TIMESTAMP ====================
CREATE OR REPLACE FUNCTION update_bus_location_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS bus_location_timestamp ON bus_locations;
CREATE TRIGGER bus_location_timestamp
  BEFORE UPDATE ON bus_locations
  FOR EACH ROW EXECUTE FUNCTION update_bus_location_timestamp();
