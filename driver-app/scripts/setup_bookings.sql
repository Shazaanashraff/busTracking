-- Supabase Bookings Setup
-- Run this in Supabase SQL Editor

-- ==================== BOOKINGS TABLE ====================
CREATE TABLE IF NOT EXISTS bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  bus_id UUID REFERENCES buses(id) ON DELETE CASCADE NOT NULL,
  passenger_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  
  -- Seat & Trip Info
  seat_number TEXT,
  pickup_stage UUID REFERENCES stages(id),
  dropoff_stage UUID REFERENCES stages(id),
  trip_date DATE DEFAULT CURRENT_DATE,
  
  -- Pickup Status
  pickup_status TEXT CHECK (pickup_status IN ('Pending', 'Confirmed', 'Cancelled', 'NoAnswer')) DEFAULT 'Pending',
  
  -- Payment
  amount DECIMAL(10, 2) DEFAULT 0,
  payment_status TEXT CHECK (payment_status IN ('Pending', 'Paid', 'Refunded')) DEFAULT 'Pending',
  
  -- Booking Status
  status TEXT CHECK (status IN ('Booked', 'Cancelled', 'Completed', 'NoShow')) DEFAULT 'Booked',
  
  -- Timestamps
  booked_at TIMESTAMPTZ DEFAULT NOW(),
  confirmed_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- ==================== RLS POLICIES ====================

-- Passengers can view their own bookings
CREATE POLICY "Passengers can view own bookings" ON bookings
  FOR SELECT USING (passenger_id = auth.uid());

-- Passengers can create bookings
CREATE POLICY "Passengers can create bookings" ON bookings
  FOR INSERT WITH CHECK (passenger_id = auth.uid());

-- Passengers can cancel their own bookings
CREATE POLICY "Passengers can update own bookings" ON bookings
  FOR UPDATE USING (passenger_id = auth.uid());

-- Owners can view bookings for their buses
CREATE POLICY "Owners can view bookings for own buses" ON bookings
  FOR SELECT USING (
    bus_id IN (
      SELECT b.id FROM buses b
      JOIN owners o ON b.owner_id = o.id
      WHERE o.profile_id = auth.uid()
    )
  );

-- Owners can update bookings for their buses
CREATE POLICY "Owners can update bookings for own buses" ON bookings
  FOR UPDATE USING (
    bus_id IN (
      SELECT b.id FROM buses b
      JOIN owners o ON b.owner_id = o.id
      WHERE o.profile_id = auth.uid()
    )
  );

-- Crew can view bookings for their assigned buses
CREATE POLICY "Crew can view bookings for assigned buses" ON bookings
  FOR SELECT USING (
    bus_id IN (SELECT bus_id FROM bus_crews WHERE profile_id = auth.uid() AND is_active = true)
  );

-- Crew can update pickup status for their assigned buses
CREATE POLICY "Crew can update bookings for assigned buses" ON bookings
  FOR UPDATE USING (
    bus_id IN (SELECT bus_id FROM bus_crews WHERE profile_id = auth.uid() AND is_active = true)
  );

-- ==================== ENABLE REALTIME ====================
ALTER PUBLICATION supabase_realtime ADD TABLE bookings;

-- ==================== INDEXES ====================
CREATE INDEX IF NOT EXISTS idx_bookings_bus_id ON bookings(bus_id);
CREATE INDEX IF NOT EXISTS idx_bookings_passenger_id ON bookings(passenger_id);
CREATE INDEX IF NOT EXISTS idx_bookings_trip_date ON bookings(trip_date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);

-- ==================== AUTO-UPDATE TIMESTAMP ====================
CREATE OR REPLACE FUNCTION update_booking_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  
  -- Auto-set timestamps based on status
  IF NEW.status = 'Confirmed' AND OLD.status != 'Confirmed' THEN
    NEW.confirmed_at = NOW();
  END IF;
  IF NEW.status = 'Completed' AND OLD.status != 'Completed' THEN
    NEW.completed_at = NOW();
  END IF;
  IF NEW.status = 'Cancelled' AND OLD.status != 'Cancelled' THEN
    NEW.cancelled_at = NOW();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS booking_timestamp ON bookings;
CREATE TRIGGER booking_timestamp
  BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_booking_timestamp();
