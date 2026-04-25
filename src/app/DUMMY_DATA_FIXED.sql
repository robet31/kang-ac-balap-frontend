-- ============================================================================
-- DUMMY DATA FOR REAL-TIME TESTING - Sunest Auto (FIXED VERSION)
-- ============================================================================
-- Supports BOTH schema versions:
-- - customer_id OR user_id in vehicles table
-- - plate_number OR license_plate
-- ============================================================================

-- First, check which column exists
DO $$
BEGIN
  -- Check if customer_id exists, if not assume user_id
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'vehicles' 
    AND column_name = 'customer_id'
  ) THEN
    RAISE NOTICE 'Using customer_id column';
  ELSE
    RAISE NOTICE 'Using user_id column';
  END IF;
END $$;

-- Get demo users
DO $$
DECLARE
  admin_user_id UUID;
  customer_user_id UUID;
BEGIN
  SELECT id INTO admin_user_id FROM auth.users WHERE email = 'admin@demo.com' LIMIT 1;
  SELECT id INTO customer_user_id FROM auth.users WHERE email = 'customer@demo.com' LIMIT 1;
  
  IF admin_user_id IS NULL THEN
    RAISE EXCEPTION 'Admin user not found! Please login as admin@demo.com first to create the user.';
  END IF;
  
  IF customer_user_id IS NULL THEN
    RAISE EXCEPTION 'Customer user not found! Please login as customer@demo.com first to create the user.';
  END IF;

  CREATE TEMP TABLE IF NOT EXISTS temp_users (admin_id UUID, customer_id UUID);
  DELETE FROM temp_users;
  INSERT INTO temp_users VALUES (admin_user_id, customer_user_id);
  
  RAISE NOTICE 'Admin ID: %', admin_user_id;
  RAISE NOTICE 'Customer ID: %', customer_user_id;
END $$;

-- ============================================================================
-- CREATE DUMMY VEHICLES - Version 1 (with customer_id & plate_number)
-- ============================================================================

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'vehicles' AND column_name = 'customer_id'
  ) THEN
    -- Use customer_id schema
    INSERT INTO public.vehicles (id, customer_id, brand, model, year, plate_number, color)
    SELECT 
      gen_random_uuid(),
      (SELECT customer_id FROM temp_users),
      'Honda', 'Beat', 2020, 'B 1234 XYZ', 'Merah'
    WHERE NOT EXISTS (SELECT 1 FROM public.vehicles WHERE plate_number = 'B 1234 XYZ');

    INSERT INTO public.vehicles (id, customer_id, brand, model, year, plate_number, color)
    SELECT 
      gen_random_uuid(),
      (SELECT customer_id FROM temp_users),
      'Yamaha', 'NMAX', 2021, 'B 5678 ABC', 'Hitam'
    WHERE NOT EXISTS (SELECT 1 FROM public.vehicles WHERE plate_number = 'B 5678 ABC');

    INSERT INTO public.vehicles (id, customer_id, brand, model, year, plate_number, color)
    SELECT 
      gen_random_uuid(),
      (SELECT customer_id FROM temp_users),
      'Suzuki', 'Satria FU', 2019, 'B 9999 DEF', 'Biru'
    WHERE NOT EXISTS (SELECT 1 FROM public.vehicles WHERE plate_number = 'B 9999 DEF');
    
    RAISE NOTICE '✅ Vehicles created using customer_id schema';
  ELSE
    -- Use user_id schema (fallback)
    INSERT INTO public.vehicles (id, user_id, brand, model, year, license_plate, color)
    SELECT 
      gen_random_uuid(),
      (SELECT customer_id FROM temp_users),
      'Honda', 'Beat', 2020, 'B 1234 XYZ', 'Merah'
    WHERE NOT EXISTS (SELECT 1 FROM public.vehicles WHERE license_plate = 'B 1234 XYZ');

    INSERT INTO public.vehicles (id, user_id, brand, model, year, license_plate, color)
    SELECT 
      gen_random_uuid(),
      (SELECT customer_id FROM temp_users),
      'Yamaha', 'NMAX', 2021, 'B 5678 ABC', 'Hitam'
    WHERE NOT EXISTS (SELECT 1 FROM public.vehicles WHERE license_plate = 'B 5678 ABC');

    INSERT INTO public.vehicles (id, user_id, brand, model, year, license_plate, color)
    SELECT 
      gen_random_uuid(),
      (SELECT customer_id FROM temp_users),
      'Suzuki', 'Satria FU', 2019, 'B 9999 DEF', 'Biru'
    WHERE NOT EXISTS (SELECT 1 FROM public.vehicles WHERE license_plate = 'B 9999 DEF');
    
    RAISE NOTICE '✅ Vehicles created using user_id schema';
  END IF;
END $$;

-- ============================================================================
-- CREATE 10 DUMMY JOBS - Works with BOTH schemas
-- ============================================================================

-- Helper function to get vehicle ID by plate
CREATE OR REPLACE FUNCTION get_vehicle_id_by_plate(p_plate TEXT) RETURNS UUID AS $$
BEGIN
  -- Try plate_number first
  RETURN (SELECT id FROM public.vehicles WHERE plate_number = p_plate LIMIT 1);
EXCEPTION WHEN OTHERS THEN
  -- Fallback to license_plate
  RETURN (SELECT id FROM public.vehicles WHERE license_plate = p_plate LIMIT 1);
END;
$$ LANGUAGE plpgsql;

-- Job 1: Pending
INSERT INTO public.jobs (
  id, user_id, vehicle_id, job_number, service_type, 
  description, status, amount, created_at
)
SELECT 
  gen_random_uuid(),
  (SELECT customer_id FROM temp_users),
  get_vehicle_id_by_plate('B 1234 XYZ'),
  'DEMO-001',
  'Service Rutin',
  'Ganti oli + filter udara + cek rem',
  'pending',
  250000,
  NOW() - INTERVAL '5 minutes'
WHERE NOT EXISTS (SELECT 1 FROM public.jobs WHERE job_number = 'DEMO-001');

-- Job 2: Pending
INSERT INTO public.jobs (
  id, user_id, vehicle_id, job_number, service_type, 
  description, status, amount, created_at
)
SELECT 
  gen_random_uuid(),
  (SELECT customer_id FROM temp_users),
  get_vehicle_id_by_plate('B 5678 ABC'),
  'DEMO-002',
  'Perbaikan',
  'Perbaikan CVT dan ganti vanbelt',
  'pending',
  800000,
  NOW() - INTERVAL '3 minutes'
WHERE NOT EXISTS (SELECT 1 FROM public.jobs WHERE job_number = 'DEMO-002');

-- Job 3: Scheduled
INSERT INTO public.jobs (
  id, user_id, vehicle_id, job_number, service_type, 
  description, status, scheduled_date, amount, created_at, updated_at
)
SELECT 
  gen_random_uuid(),
  (SELECT customer_id FROM temp_users),
  get_vehicle_id_by_plate('B 1234 XYZ'),
  'DEMO-003',
  'Service Berkala',
  'Service 10.000 KM',
  'scheduled',
  CURRENT_DATE + INTERVAL '1 day',
  350000,
  NOW() - INTERVAL '2 hours',
  NOW() - INTERVAL '1 hour'
WHERE NOT EXISTS (SELECT 1 FROM public.jobs WHERE job_number = 'DEMO-003');

-- Job 4: In Progress
INSERT INTO public.jobs (
  id, user_id, vehicle_id, job_number, service_type, 
  description, status, scheduled_date, amount, progress, created_at, updated_at
)
SELECT 
  gen_random_uuid(),
  (SELECT customer_id FROM temp_users),
  get_vehicle_id_by_plate('B 5678 ABC'),
  'DEMO-004',
  'Perbaikan',
  'Ganti kampas rem + cek sistem kelistrikan',
  'in_progress',
  CURRENT_DATE,
  450000,
  45,
  NOW() - INTERVAL '5 hours',
  NOW() - INTERVAL '1 hour'
WHERE NOT EXISTS (SELECT 1 FROM public.jobs WHERE job_number = 'DEMO-004');

-- Job 5: In Progress
INSERT INTO public.jobs (
  id, user_id, vehicle_id, job_number, service_type, 
  description, status, scheduled_date, amount, progress, created_at, updated_at
)
SELECT 
  gen_random_uuid(),
  (SELECT customer_id FROM temp_users),
  get_vehicle_id_by_plate('B 9999 DEF'),
  'DEMO-005',
  'Service Rutin',
  'Service rutin + tune up',
  'in_progress',
  CURRENT_DATE,
  300000,
  70,
  NOW() - INTERVAL '3 hours',
  NOW() - INTERVAL '30 minutes'
WHERE NOT EXISTS (SELECT 1 FROM public.jobs WHERE job_number = 'DEMO-005');

-- Job 6: Awaiting Payment
INSERT INTO public.jobs (
  id, user_id, vehicle_id, job_number, service_type, 
  description, status, scheduled_date, completed_date, amount, progress, created_at, updated_at
)
SELECT 
  gen_random_uuid(),
  (SELECT customer_id FROM temp_users),
  get_vehicle_id_by_plate('B 1234 XYZ'),
  'DEMO-006',
  'Service Berkala',
  'Service 5.000 KM + ganti oli',
  'awaiting_payment',
  CURRENT_DATE - INTERVAL '1 day',
  CURRENT_DATE,
  280000,
  100,
  NOW() - INTERVAL '1 day',
  NOW() - INTERVAL '2 hours'
WHERE NOT EXISTS (SELECT 1 FROM public.jobs WHERE job_number = 'DEMO-006');

-- Job 7: Completed
INSERT INTO public.jobs (
  id, user_id, vehicle_id, job_number, service_type, 
  description, status, scheduled_date, completed_date, amount, progress, created_at, updated_at
)
SELECT 
  gen_random_uuid(),
  (SELECT customer_id FROM temp_users),
  get_vehicle_id_by_plate('B 5678 ABC'),
  'DEMO-007',
  'Perbaikan',
  'Ganti sparepart CDI dan koil',
  'completed',
  CURRENT_DATE - INTERVAL '3 days',
  CURRENT_DATE - INTERVAL '3 days',
  650000,
  100,
  NOW() - INTERVAL '4 days',
  NOW() - INTERVAL '3 days'
WHERE NOT EXISTS (SELECT 1 FROM public.jobs WHERE job_number = 'DEMO-007');

-- Job 8: Scheduled
INSERT INTO public.jobs (
  id, user_id, vehicle_id, job_number, service_type, 
  description, status, scheduled_date, amount, created_at, updated_at
)
SELECT 
  gen_random_uuid(),
  (SELECT customer_id FROM temp_users),
  get_vehicle_id_by_plate('B 9999 DEF'),
  'DEMO-008',
  'Service Rutin',
  'Ganti oli mesin + oli gardan',
  'scheduled',
  CURRENT_DATE + INTERVAL '2 days',
  320000,
  NOW() - INTERVAL '1 day',
  NOW() - INTERVAL '1 day'
WHERE NOT EXISTS (SELECT 1 FROM public.jobs WHERE job_number = 'DEMO-008');

-- Job 9: Pending
INSERT INTO public.jobs (
  id, user_id, vehicle_id, job_number, service_type, 
  description, status, amount, created_at
)
SELECT 
  gen_random_uuid(),
  (SELECT customer_id FROM temp_users),
  get_vehicle_id_by_plate('B 1234 XYZ'),
  'DEMO-009',
  'Perbaikan',
  'Cek bunyi aneh di mesin + tune up',
  'pending',
  400000,
  NOW() - INTERVAL '1 minute'
WHERE NOT EXISTS (SELECT 1 FROM public.jobs WHERE job_number = 'DEMO-009');

-- Job 10: Completed
INSERT INTO public.jobs (
  id, user_id, vehicle_id, job_number, service_type, 
  description, status, scheduled_date, completed_date, amount, progress, created_at, updated_at
)
SELECT 
  gen_random_uuid(),
  (SELECT customer_id FROM temp_users),
  get_vehicle_id_by_plate('B 5678 ABC'),
  'DEMO-010',
  'Service Berkala',
  'Service lengkap 20.000 KM',
  'completed',
  CURRENT_DATE - INTERVAL '5 days',
  CURRENT_DATE - INTERVAL '5 days',
  750000,
  100,
  NOW() - INTERVAL '6 days',
  NOW() - INTERVAL '5 days'
WHERE NOT EXISTS (SELECT 1 FROM public.jobs WHERE job_number = 'DEMO-010');

-- ============================================================================
-- VERIFICATION
-- ============================================================================

SELECT '📊 DUMMY DATA CREATED!' AS status;

SELECT 
  COUNT(*) FILTER (WHERE status = 'pending') AS "⏳ Pending",
  COUNT(*) FILTER (WHERE status = 'scheduled') AS "📅 Scheduled",
  COUNT(*) FILTER (WHERE status = 'in_progress') AS "🔧 In Progress",
  COUNT(*) FILTER (WHERE status = 'awaiting_payment') AS "💰 Awaiting Payment",
  COUNT(*) FILTER (WHERE status = 'completed') AS "✅ Completed",
  COUNT(*) AS "📊 Total"
FROM public.jobs
WHERE job_number LIKE 'DEMO%';

SELECT 
  '📋 JOB DETAILS' AS section,
  job_number AS "Job #",
  status AS "Status",
  service_type AS "Service",
  amount AS "Amount",
  TO_CHAR(created_at, 'DD Mon HH24:MI') AS "Created"
FROM public.jobs
WHERE job_number LIKE 'DEMO%'
ORDER BY created_at DESC;

-- Cleanup helper function
DROP FUNCTION IF EXISTS get_vehicle_id_by_plate(TEXT);

SELECT '🎉 All done! 10 dummy jobs created.' AS result;
SELECT '💡 Next: Enable real-time for jobs table in Database Replication' AS step_1;
SELECT '💡 Next: Test booking flow (Customer → Admin approve → Real-time update)' AS step_2;
