-- ============================================================
-- SEED DATA: DASHBOARD & BOOKINGS
-- Run this AFTER creating users/buses
-- ============================================================

DO $$
DECLARE
  v_owner_id uuid;
  v_bus_id uuid;
  v_passenger_id uuid;
  v_route_id uuid;
  v_stage_start uuid;
  v_stage_end uuid;
BEGIN
  -- 1. Get an existing Owner (or create temp if needed, but assuming setup_all ran)
  -- Try to find the first owner
  SELECT id INTO v_owner_id FROM owners LIMIT 1;

  -- 2. Get an existing Bus
  SELECT id INTO v_bus_id FROM buses WHERE owner_id = v_owner_id LIMIT 1;

  -- 3. Get a Passenger (use the first profile that is not the owner)
  SELECT id INTO v_passenger_id FROM profiles WHERE id NOT IN (SELECT profile_id FROM owners) LIMIT 1;
  
  -- If no passenger, just use the owner profile for testing
  IF v_passenger_id IS NULL THEN
     SELECT profile_id INTO v_passenger_id FROM owners LIMIT 1;
  END IF;

  -- 4. Get Route Stages
  SELECT id INTO v_stage_start FROM stages LIMIT 1;
  SELECT id INTO v_stage_end FROM stages OFFSET 2 LIMIT 1;

  -- ====================================================
  -- INSERT DUMMY BOOKINGS FOR TODAY (To populate Dashboard)
  -- ====================================================
  
  IF v_bus_id IS NOT NULL AND v_passenger_id IS NOT NULL THEN
    
    -- Booking 1: Paid & Confirmed
    INSERT INTO bookings (bus_id, passenger_id, seat_number, pickup_stage, dropoff_stage, trip_date, amount, payment_status, status)
    VALUES (v_bus_id, v_passenger_id, '1', v_stage_start, v_stage_end, CURRENT_DATE, 1500.00, 'Paid', 'Booked');

    -- Booking 2: Completed (Used)
    INSERT INTO bookings (bus_id, passenger_id, seat_number, pickup_stage, dropoff_stage, trip_date, amount, payment_status, status)
    VALUES (v_bus_id, v_passenger_id, '2', v_stage_start, v_stage_end, CURRENT_DATE, 1500.00, 'Paid', 'Completed');

    -- Booking 3: Another Paid
    INSERT INTO bookings (bus_id, passenger_id, seat_number, pickup_stage, dropoff_stage, trip_date, amount, payment_status, status)
    VALUES (v_bus_id, v_passenger_id, '5', v_stage_start, v_stage_end, CURRENT_DATE, 1500.00, 'Paid', 'Booked');
    
    -- Booking 4: Cancelled
    INSERT INTO bookings (bus_id, passenger_id, seat_number, pickup_stage, dropoff_stage, trip_date, amount, payment_status, status)
    VALUES (v_bus_id, v_passenger_id, '6', v_stage_start, v_stage_end, CURRENT_DATE, 1500.00, 'Refunded', 'Cancelled');

    -- Historical Data (Last Month) for Monthly Revenue
    INSERT INTO bookings (bus_id, passenger_id, seat_number, pickup_stage, dropoff_stage, trip_date, amount, payment_status, status)
    VALUES (v_bus_id, v_passenger_id, '1', v_stage_start, v_stage_end, CURRENT_DATE - INTERVAL '5 days', 1200.00, 'Paid', 'Completed');

  END IF;

END $$;
