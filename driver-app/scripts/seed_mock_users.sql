-- ============================================================
-- MOCK USERS SEED SCRIPT
-- Run this in Supabase SQL Editor to create test accounts
-- ============================================================

-- NOTE: For Supabase Auth, users must be created via the API or Dashboard.
-- This script creates the profiles and related data for testing.
-- 
-- CREATE USERS IN SUPABASE DASHBOARD FIRST:
-- 1. Go to Authentication > Users > Add User
-- 2. Create these accounts with the passwords shown below
--
-- ============================================================
-- TEST ACCOUNTS (Create these in Supabase Auth Dashboard)
-- ============================================================
-- 
-- PASSENGER:
--   Email: passenger@test.com
--   Password: Test@123
--
-- CREW/DRIVER:
--   Email: crew@test.com  
--   Password: Test@123
--
-- OWNER:
--   Email: owner@test.com
--   Password: Test@123
--
-- ADMIN:
--   Email: admin@test.com
--   Password: Test@123
--
-- ============================================================

-- After creating users via Dashboard, run this SQL to set up profiles:

-- Create profiles for test users (replace UUIDs with actual ones from auth.users)
-- You can find the UUIDs in: Authentication > Users table

-- First, let's create a helper function to get or create profile
CREATE OR REPLACE FUNCTION seed_test_profile(
  user_email TEXT,
  user_name TEXT,
  user_role TEXT,
  user_phone TEXT
) RETURNS UUID AS $$
DECLARE
  user_id UUID;
BEGIN
  -- Get user ID from auth.users by email
  SELECT id INTO user_id FROM auth.users WHERE email = user_email;
  
  IF user_id IS NULL THEN
    RAISE NOTICE 'User % not found in auth.users. Create in Dashboard first.', user_email;
    RETURN NULL;
  END IF;
  
  -- Insert or update profile
  INSERT INTO profiles (id, name, role, phone, created_at, updated_at)
  VALUES (user_id, user_name, user_role, user_phone, NOW(), NOW())
  ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    role = EXCLUDED.role,
    phone = EXCLUDED.phone,
    updated_at = NOW();
    
  RETURN user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- SEED PROFILES (Run after creating users in Dashboard)
-- ============================================================

-- Passenger
SELECT seed_test_profile(
  'passenger@test.com',
  'Kasun Perera',
  'passenger',
  '+94771234567'
);

-- Crew/Driver  
SELECT seed_test_profile(
  'crew@test.com',
  'Nimal Silva',
  'crew',
  '+94772345678'
);

-- Owner
SELECT seed_test_profile(
  'owner@test.com',
  'Mahinda Fernando',
  'owner',
  '+94773456789'
);

-- Admin
SELECT seed_test_profile(
  'admin@test.com',
  'System Admin',
  'admin',
  '+94774567890'
);

-- ============================================================
-- SEED RELATED DATA FOR OWNER
-- ============================================================

-- Create owner record (if owners table exists)
DO $$
DECLARE
  owner_profile_id UUID;
BEGIN
  SELECT id INTO owner_profile_id FROM auth.users WHERE email = 'owner@test.com';
  
  IF owner_profile_id IS NOT NULL THEN
    INSERT INTO owners (profile_id, business_name, nic, created_at)
    VALUES (owner_profile_id, 'Fernando Transport Services', '881234567V', NOW())
    ON CONFLICT (profile_id) DO NOTHING;
  END IF;
EXCEPTION WHEN undefined_table THEN
  RAISE NOTICE 'owners table does not exist';
END $$;

-- ============================================================
-- SEED SAMPLE ROUTE AND BUS
-- ============================================================

DO $$
DECLARE
  owner_id UUID;
  route_id UUID;
  bus_id UUID;
  crew_profile_id UUID;
BEGIN
  -- Get owner ID
  SELECT o.id INTO owner_id FROM owners o
  JOIN auth.users u ON o.profile_id = u.id
  WHERE u.email = 'owner@test.com';
  
  IF owner_id IS NULL THEN
    RAISE NOTICE 'Owner not found, skipping bus/route seed';
    RETURN;
  END IF;
  
  -- Create sample route
  INSERT INTO routes (route_number, name, start_point, end_point, created_at)
  VALUES ('138', 'Colombo - Homagama', 'Pettah', 'Homagama', NOW())
  ON CONFLICT (route_number) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO route_id;
  
  -- Create sample bus
  INSERT INTO buses (owner_id, route_id, registration_number, bus_name, total_seats, created_at)
  VALUES (owner_id, route_id, 'ND-4567', 'Express 138', 54, NOW())
  ON CONFLICT (registration_number) DO UPDATE SET bus_name = EXCLUDED.bus_name
  RETURNING id INTO bus_id;
  
  -- Assign crew to bus
  SELECT id INTO crew_profile_id FROM auth.users WHERE email = 'crew@test.com';
  
  IF crew_profile_id IS NOT NULL AND bus_id IS NOT NULL THEN
    INSERT INTO bus_crews (profile_id, bus_id, role, is_active, created_at)
    VALUES (crew_profile_id, bus_id, 'driver', true, NOW())
    ON CONFLICT (profile_id, bus_id) DO NOTHING;
  END IF;
  
EXCEPTION WHEN undefined_table THEN
  RAISE NOTICE 'Some tables do not exist, partial seed completed';
END $$;

-- ============================================================
-- CLEANUP FUNCTION
-- ============================================================
DROP FUNCTION IF EXISTS seed_test_profile;

-- ============================================================
-- VERIFY SEEDED DATA
-- ============================================================
SELECT 
  p.name,
  p.role,
  p.phone,
  u.email
FROM profiles p
JOIN auth.users u ON p.id = u.id
WHERE u.email LIKE '%@test.com'
ORDER BY p.role;
