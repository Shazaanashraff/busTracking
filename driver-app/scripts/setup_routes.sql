-- Supabase Routes & Stages Setup (Sri Lankan Style)
-- Run this in Supabase SQL Editor

-- ==================== ROUTES TABLE ====================
CREATE TABLE IF NOT EXISTS routes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  route_number TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  start_location TEXT,
  end_location TEXT,
  distance_km DOUBLE PRECISION,
  estimated_duration_mins INT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE routes ENABLE ROW LEVEL SECURITY;

-- Anyone can view routes (public info)
CREATE POLICY "Anyone can view routes" ON routes
  FOR SELECT USING (true);

-- Only admins can modify routes (you can adjust this)
CREATE POLICY "Admins can manage routes" ON routes
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ==================== STAGES TABLE ====================
CREATE TABLE IF NOT EXISTS stages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  route_id UUID REFERENCES routes(id) ON DELETE CASCADE NOT NULL,
  stage_name TEXT NOT NULL,
  stage_name_sinhala TEXT,
  order_no INT NOT NULL,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  is_major_stop BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Each stage order must be unique per route
  UNIQUE(route_id, order_no)
);

-- Enable RLS
ALTER TABLE stages ENABLE ROW LEVEL SECURITY;

-- Anyone can view stages (public info)
CREATE POLICY "Anyone can view stages" ON stages
  FOR SELECT USING (true);

-- Only admins can modify stages
CREATE POLICY "Admins can manage stages" ON stages
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ==================== BUS CURRENT STAGE ====================
-- Add current_stage tracking to bus_locations
ALTER TABLE bus_locations 
  ADD COLUMN IF NOT EXISTS current_stage_id UUID REFERENCES stages(id),
  ADD COLUMN IF NOT EXISTS next_stage_id UUID REFERENCES stages(id);

-- ==================== UPDATE BUSES TABLE ====================
-- Link buses to routes
ALTER TABLE buses 
  ADD COLUMN IF NOT EXISTS route_id UUID REFERENCES routes(id);

-- ==================== INDEXES ====================
CREATE INDEX IF NOT EXISTS idx_stages_route_id ON stages(route_id);
CREATE INDEX IF NOT EXISTS idx_stages_order ON stages(route_id, order_no);
CREATE INDEX IF NOT EXISTS idx_buses_route_id ON buses(route_id);

-- ==================== SAMPLE DATA (138 Route Example) ====================
-- Uncomment to insert sample data

-- INSERT INTO routes (route_number, name, start_location, end_location) VALUES
-- ('138', 'Kadawatha - Kollupitiya', 'Kadawatha', 'Kollupitiya');

-- INSERT INTO stages (route_id, stage_name, stage_name_sinhala, order_no, is_major_stop) VALUES
-- ((SELECT id FROM routes WHERE route_number = '138'), 'Kadawatha', 'කඩවත', 1, true),
-- ((SELECT id FROM routes WHERE route_number = '138'), 'Kiribathgoda', 'කිරිබත්ගොඩ', 2, true),
-- ((SELECT id FROM routes WHERE route_number = '138'), 'Kelaniya', 'කැලණිය', 3, true),
-- ((SELECT id FROM routes WHERE route_number = '138'), 'Peliyagoda', 'පැලියගොඩ', 4, false),
-- ((SELECT id FROM routes WHERE route_number = '138'), 'Dematagoda', 'දෙමටගොඩ', 5, false),
-- ((SELECT id FROM routes WHERE route_number = '138'), 'Maradana', 'මරදාන', 6, true),
-- ((SELECT id FROM routes WHERE route_number = '138'), 'Fort', 'කොටුව', 7, true),
-- ((SELECT id FROM routes WHERE route_number = '138'), 'Kollupitiya', 'කොල්ලුපිටිය', 8, true);
