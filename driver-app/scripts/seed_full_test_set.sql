-- ============================================================
-- FULL TEST DATA SEED (FIXED)
-- Run this in Supabase SQL Editor to populate EVERYTHING
-- ============================================================

-- EXTENSIONS NEEDED FOR PASSWORDS
CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$
DECLARE
  v_user_id uuid;
  v_owner_id uuid;
  v_bus_id uuid;
  v_route_id uuid;
  v_stage_start uuid;
  v_stage_end uuid;
BEGIN

  -- 1. GET OR CREATE USER
  -- Try to find an existing user
  SELECT id INTO v_user_id FROM auth.users LIMIT 1;

  -- If no user exists, create a dummy one "admin@test.com" / "password123"
  IF v_user_id IS NULL THEN
    v_user_id := gen_random_uuid();
    
    INSERT INTO auth.users (
      id,
      instance_id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      created_at,
      updated_at,
      raw_app_meta_data,
      raw_user_meta_data,
      is_super_admin
    )
    VALUES (
      v_user_id,
      '00000000-0000-0000-0000-000000000000',
      'authenticated',
      'authenticated',
      'admin@test.com',
      crypt('password123', gen_salt('bf')), -- Password: password123
      now(),
      now(),
      now(),
      '{"provider":"email","providers":["email"]}',
      '{}',
      false
    );
    
    -- The trigger in setup_all.sql might create the profile automatically.
    -- But just in case, or if we need to update it:
  END IF;

  -- 2. ENSURE PROFILE EXISTS & IS OWNER
  -- Upsert profile to be sure
  INSERT INTO profiles (id, name, role, phone)
  VALUES (v_user_id, 'Demo Owner', 'owner', '0771234567')
  ON CONFLICT (id) DO UPDATE SET role = 'owner';

  -- 3. CREATE OWNER RECORD
  INSERT INTO owners (profile_id, business_name)
  VALUES (v_user_id, 'Ace Travels (Demo)')
  ON CONFLICT (profile_id) DO UPDATE SET business_name = 'Ace Travels (Demo)'
  RETURNING id INTO v_owner_id;

  -- 4. CREATE ROUTE
  INSERT INTO routes (route_number, name, start_location, end_location, distance_km, is_active)
  VALUES ('138', 'Pettah - Homagama', 'Pettah', 'Homagama', 24.5, true)
  ON CONFLICT (route_number) DO UPDATE SET is_active = true
  RETURNING id INTO v_route_id;

  -- 5. CREATE STAGES
  INSERT INTO stages (route_id, stage_name, order_no, latitude, longitude)
  VALUES 
    (v_route_id, 'Pettah', 1, 6.9344, 79.8428),
    (v_route_id, 'Town Hall', 2, 6.9147, 79.8643),
    (v_route_id, 'Nugegoda', 3, 6.8649, 79.8997),
    (v_route_id, 'Kottawa', 4, 6.8412, 79.9654),
    (v_route_id, 'Homagama', 5, 6.8436, 80.0031)
  ON CONFLICT DO NOTHING;
  
  -- Get Stage IDs
  SELECT id INTO v_stage_start FROM stages WHERE route_id = v_route_id AND order_no = 1;
  SELECT id INTO v_stage_end FROM stages WHERE route_id = v_route_id AND order_no = 5;

  -- 6. CREATE BUS
  INSERT INTO buses (plate_number, route_number, owner_id, bus_name, capacity, status, route_id)
  VALUES ('ND-4567', '138', v_owner_id, 'Luxury Liner', 54, 'active', v_route_id)
  RETURNING id INTO v_bus_id;

  -- 7. ASSIGN USER AS DRIVER (CREW)
  -- This ensures the user sees "Driver Stats" too
  INSERT INTO bus_crews (profile_id, bus_id, role, is_active)
  VALUES (v_user_id, v_bus_id, 'driver', true)
  ON CONFLICT (profile_id, bus_id) DO NOTHING;

  -- 8. CREATE BOOKINGS
  IF v_bus_id IS NOT NULL THEN
    -- Used Booking (Completed)
    INSERT INTO bookings (bus_id, passenger_id, seat_number, pickup_stage, dropoff_stage, trip_date, amount, payment_status, status) VALUES
    (v_bus_id, v_user_id, '1A', v_stage_start, v_stage_end, CURRENT_DATE, 850, 'Paid', 'Completed');
    
    -- Valid Booking (Booked)
    INSERT INTO bookings (bus_id, passenger_id, seat_number, pickup_stage, dropoff_stage, trip_date, amount, payment_status, status) VALUES
    (v_bus_id, v_user_id, '1B', v_stage_start, v_stage_end, CURRENT_DATE, 850, 'Paid', 'Booked');
    
    -- Pending Booking (Simulated as Booked but maybe unpaid or just booked)
    INSERT INTO bookings (bus_id, passenger_id, seat_number, pickup_stage, dropoff_stage, trip_date, amount, payment_status, status) VALUES
    (v_bus_id, v_user_id, '2A', v_stage_start, v_stage_end, CURRENT_DATE, 850, 'Pending', 'Booked');
    
    -- Historical Booking
    INSERT INTO bookings (bus_id, passenger_id, seat_number, pickup_stage, dropoff_stage, trip_date, amount, payment_status, status) VALUES
    (v_bus_id, v_user_id, '3A', v_stage_start, v_stage_end, CURRENT_DATE - INTERVAL '1 day', 850, 'Paid', 'Completed');
  END IF;

END $$;
