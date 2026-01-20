-- ============================================================
-- MASTER SUPABASE SETUP SCRIPT
-- Run this script in Supabase SQL Editor
-- This combines all tables in the correct dependency order
-- ============================================================

-- ==================== 1. PROFILES ====================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT,
  role TEXT CHECK (role IN ('passenger', 'owner', 'crew', 'admin')) DEFAULT 'passenger',
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, phone)
  VALUES (NEW.id, NEW.phone);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ==================== 2. OWNERS ====================
CREATE TABLE IF NOT EXISTS owners (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  business_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE owners ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Owners can view own record" ON owners;
DROP POLICY IF EXISTS "Owners can update own record" ON owners;
DROP POLICY IF EXISTS "Owners can insert own record" ON owners;

CREATE POLICY "Owners can view own record" ON owners FOR SELECT USING (profile_id = auth.uid());
CREATE POLICY "Owners can update own record" ON owners FOR UPDATE USING (profile_id = auth.uid());
CREATE POLICY "Owners can insert own record" ON owners FOR INSERT WITH CHECK (profile_id = auth.uid());

-- ==================== 3. ROUTES ====================
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

ALTER TABLE routes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view routes" ON routes;
CREATE POLICY "Anyone can view routes" ON routes FOR SELECT USING (true);

-- ==================== 4. STAGES ====================
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
  UNIQUE(route_id, order_no)
);

ALTER TABLE stages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view stages" ON stages;
CREATE POLICY "Anyone can view stages" ON stages FOR SELECT USING (true);

-- ==================== 5. BUSES ====================
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

-- Add route_id column if it doesn't exist (for existing tables)
DO $$
BEGIN
  ALTER TABLE buses ADD COLUMN route_id UUID REFERENCES routes(id);
EXCEPTION WHEN duplicate_column THEN
  NULL;
END $$;

ALTER TABLE buses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Owners can view own buses" ON buses;
DROP POLICY IF EXISTS "Owners can insert own buses" ON buses;
DROP POLICY IF EXISTS "Owners can update own buses" ON buses;
DROP POLICY IF EXISTS "Owners can delete own buses" ON buses;

CREATE POLICY "Owners can view own buses" ON buses FOR SELECT USING (
  owner_id IN (SELECT id FROM owners WHERE profile_id = auth.uid())
);
CREATE POLICY "Owners can insert own buses" ON buses FOR INSERT WITH CHECK (
  owner_id IN (SELECT id FROM owners WHERE profile_id = auth.uid())
);
CREATE POLICY "Owners can update own buses" ON buses FOR UPDATE USING (
  owner_id IN (SELECT id FROM owners WHERE profile_id = auth.uid())
);
CREATE POLICY "Owners can delete own buses" ON buses FOR DELETE USING (
  owner_id IN (SELECT id FROM owners WHERE profile_id = auth.uid())
);

-- ==================== 6. BUS CREWS ====================
CREATE TABLE IF NOT EXISTS bus_crews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  bus_id UUID REFERENCES buses(id) ON DELETE CASCADE NOT NULL,
  role TEXT CHECK (role IN ('driver', 'conductor')) DEFAULT 'driver',
  is_active BOOLEAN DEFAULT true,
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(profile_id, bus_id)
);

ALTER TABLE bus_crews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Crew can view own assignments" ON bus_crews;
DROP POLICY IF EXISTS "Owners can view crew for own buses" ON bus_crews;
DROP POLICY IF EXISTS "Owners can insert crew for own buses" ON bus_crews;
DROP POLICY IF EXISTS "Owners can update crew for own buses" ON bus_crews;
DROP POLICY IF EXISTS "Owners can delete crew from own buses" ON bus_crews;

CREATE POLICY "Crew can view own assignments" ON bus_crews FOR SELECT USING (profile_id = auth.uid());
CREATE POLICY "Owners can view crew for own buses" ON bus_crews FOR SELECT USING (
  bus_id IN (SELECT b.id FROM buses b JOIN owners o ON b.owner_id = o.id WHERE o.profile_id = auth.uid())
);
CREATE POLICY "Owners can insert crew for own buses" ON bus_crews FOR INSERT WITH CHECK (
  bus_id IN (SELECT b.id FROM buses b JOIN owners o ON b.owner_id = o.id WHERE o.profile_id = auth.uid())
);
CREATE POLICY "Owners can update crew for own buses" ON bus_crews FOR UPDATE USING (
  bus_id IN (SELECT b.id FROM buses b JOIN owners o ON b.owner_id = o.id WHERE o.profile_id = auth.uid())
);
CREATE POLICY "Owners can delete crew from own buses" ON bus_crews FOR DELETE USING (
  bus_id IN (SELECT b.id FROM buses b JOIN owners o ON b.owner_id = o.id WHERE o.profile_id = auth.uid())
);

-- Crew can view assigned buses
DROP POLICY IF EXISTS "Crew can view assigned buses" ON buses;
CREATE POLICY "Crew can view assigned buses" ON buses FOR SELECT USING (
  id IN (SELECT bus_id FROM bus_crews WHERE profile_id = auth.uid() AND is_active = true)
);

-- ==================== 7. BUS LOCATIONS ====================
CREATE TABLE IF NOT EXISTS bus_locations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  bus_id UUID REFERENCES buses(id) ON DELETE CASCADE UNIQUE NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  speed DOUBLE PRECISION DEFAULT 0,
  heading DOUBLE PRECISION DEFAULT 0,
  accuracy DOUBLE PRECISION,
  is_moving BOOLEAN DEFAULT false,
  current_stage_id UUID REFERENCES stages(id),
  next_stage_id UUID REFERENCES stages(id),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE bus_locations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view bus locations" ON bus_locations;
DROP POLICY IF EXISTS "Crew can update own bus location" ON bus_locations;
DROP POLICY IF EXISTS "Crew can insert own bus location" ON bus_locations;
DROP POLICY IF EXISTS "Owners can update own bus location" ON bus_locations;
DROP POLICY IF EXISTS "Owners can insert own bus location" ON bus_locations;

CREATE POLICY "Anyone can view bus locations" ON bus_locations FOR SELECT USING (true);
CREATE POLICY "Crew can update own bus location" ON bus_locations FOR UPDATE USING (
  bus_id IN (SELECT bus_id FROM bus_crews WHERE profile_id = auth.uid() AND is_active = true)
);
CREATE POLICY "Crew can insert own bus location" ON bus_locations FOR INSERT WITH CHECK (
  bus_id IN (SELECT bus_id FROM bus_crews WHERE profile_id = auth.uid() AND is_active = true)
);
CREATE POLICY "Owners can update own bus location" ON bus_locations FOR UPDATE USING (
  bus_id IN (SELECT b.id FROM buses b JOIN owners o ON b.owner_id = o.id WHERE o.profile_id = auth.uid())
);
CREATE POLICY "Owners can insert own bus location" ON bus_locations FOR INSERT WITH CHECK (
  bus_id IN (SELECT b.id FROM buses b JOIN owners o ON b.owner_id = o.id WHERE o.profile_id = auth.uid())
);

-- ==================== 8. BOOKINGS ====================
CREATE TABLE IF NOT EXISTS bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  bus_id UUID REFERENCES buses(id) ON DELETE CASCADE NOT NULL,
  passenger_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  seat_number TEXT,
  pickup_stage UUID REFERENCES stages(id),
  dropoff_stage UUID REFERENCES stages(id),
  trip_date DATE DEFAULT CURRENT_DATE,
  pickup_status TEXT CHECK (pickup_status IN ('Pending', 'Confirmed', 'Cancelled', 'NoAnswer')) DEFAULT 'Pending',
  amount DECIMAL(10, 2) DEFAULT 0,
  payment_status TEXT CHECK (payment_status IN ('Pending', 'Paid', 'Refunded')) DEFAULT 'Pending',
  status TEXT CHECK (status IN ('Booked', 'Cancelled', 'Completed', 'NoShow')) DEFAULT 'Booked',
  booked_at TIMESTAMPTZ DEFAULT NOW(),
  confirmed_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Passengers can view own bookings" ON bookings;
DROP POLICY IF EXISTS "Passengers can create bookings" ON bookings;
DROP POLICY IF EXISTS "Passengers can update own bookings" ON bookings;
DROP POLICY IF EXISTS "Owners can view bookings for own buses" ON bookings;
DROP POLICY IF EXISTS "Owners can update bookings for own buses" ON bookings;
DROP POLICY IF EXISTS "Crew can view bookings for assigned buses" ON bookings;
DROP POLICY IF EXISTS "Crew can update bookings for assigned buses" ON bookings;

CREATE POLICY "Passengers can view own bookings" ON bookings FOR SELECT USING (passenger_id = auth.uid());
CREATE POLICY "Passengers can create bookings" ON bookings FOR INSERT WITH CHECK (passenger_id = auth.uid());
CREATE POLICY "Passengers can update own bookings" ON bookings FOR UPDATE USING (passenger_id = auth.uid());
CREATE POLICY "Owners can view bookings for own buses" ON bookings FOR SELECT USING (
  bus_id IN (SELECT b.id FROM buses b JOIN owners o ON b.owner_id = o.id WHERE o.profile_id = auth.uid())
);
CREATE POLICY "Owners can update bookings for own buses" ON bookings FOR UPDATE USING (
  bus_id IN (SELECT b.id FROM buses b JOIN owners o ON b.owner_id = o.id WHERE o.profile_id = auth.uid())
);
CREATE POLICY "Crew can view bookings for assigned buses" ON bookings FOR SELECT USING (
  bus_id IN (SELECT bus_id FROM bus_crews WHERE profile_id = auth.uid() AND is_active = true)
);
CREATE POLICY "Crew can update bookings for assigned buses" ON bookings FOR UPDATE USING (
  bus_id IN (SELECT bus_id FROM bus_crews WHERE profile_id = auth.uid() AND is_active = true)
);

-- ==================== REALTIME ====================
DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE bus_locations;
EXCEPTION WHEN duplicate_object THEN
  NULL;
END $$;

DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE bookings;
EXCEPTION WHEN duplicate_object THEN
  NULL;
END $$;

-- ==================== INDEXES ====================
CREATE INDEX IF NOT EXISTS idx_buses_owner_id ON buses(owner_id);
CREATE INDEX IF NOT EXISTS idx_buses_route_id ON buses(route_id);
CREATE INDEX IF NOT EXISTS idx_bus_crews_profile_id ON bus_crews(profile_id);
CREATE INDEX IF NOT EXISTS idx_bus_crews_bus_id ON bus_crews(bus_id);
CREATE INDEX IF NOT EXISTS idx_stages_route_id ON stages(route_id);
CREATE INDEX IF NOT EXISTS idx_bus_locations_bus_id ON bus_locations(bus_id);
CREATE INDEX IF NOT EXISTS idx_bookings_bus_id ON bookings(bus_id);
CREATE INDEX IF NOT EXISTS idx_bookings_passenger_id ON bookings(passenger_id);
CREATE INDEX IF NOT EXISTS idx_bookings_trip_date ON bookings(trip_date);

-- ==================== DONE ====================
SELECT 'All tables created successfully!' as status;
