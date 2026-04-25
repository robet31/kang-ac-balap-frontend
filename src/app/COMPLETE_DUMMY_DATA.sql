-- ============================================================================
-- COMPLETE DUMMY DATA SETUP - Sunest Auto
-- ============================================================================
-- Creates tables (if not exist) + inserts 10 dummy jobs for testing
-- ============================================================================

-- ============================================================================
-- PART 1: CREATE JOBS TABLE (if not exists)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE SET NULL,
  job_number TEXT UNIQUE NOT NULL,
  service_type TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN (
    'pending', 
    'scheduled', 
    'in_progress', 
    'awaiting_payment', 
    'completed', 
    'cancelled'
  )),
  scheduled_date TIMESTAMP,
  completed_date TIMESTAMP,
  amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  progress INT DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_jobs_user_id ON public.jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON public.jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_created_at ON public.jobs(created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can view own jobs" ON public.jobs;
DROP POLICY IF EXISTS "Admins can view all jobs" ON public.jobs;
DROP POLICY IF EXISTS "Users can insert own jobs" ON public.jobs;
DROP POLICY IF EXISTS "Admins can update all jobs" ON public.jobs;
DROP POLICY IF EXISTS "Admins can delete jobs" ON public.jobs;

-- RLS Policies
-- Customers can see their own jobs
CREATE POLICY "Users can view own jobs"
  ON public.jobs FOR SELECT
  USING (auth.uid() = user_id);

-- Admins can see all jobs
CREATE POLICY "Admins can view all jobs"
  ON public.jobs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Users can create their own jobs
CREATE POLICY "Users can insert own jobs"
  ON public.jobs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Admins can update all jobs
CREATE POLICY "Admins can update all jobs"
  ON public.jobs FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admins can delete jobs
CREATE POLICY "Admins can delete jobs"
  ON public.jobs FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

SELECT '✅ Jobs table created/verified' AS status;

-- ============================================================================
-- PART 2: GET DEMO USERS
-- ============================================================================

DO $$
DECLARE
  admin_user_id UUID;
  customer_user_id UUID;
BEGIN
  -- Get users from auth.users
  SELECT id INTO admin_user_id FROM auth.users WHERE email = 'admin@demo.com' LIMIT 1;
  SELECT id INTO customer_user_id FROM auth.users WHERE email = 'customer@demo.com' LIMIT 1;
  
  -- Check if users exist
  IF admin_user_id IS NULL THEN
    RAISE EXCEPTION '❌ Admin user not found! Please login as admin@demo.com first.';
  END IF;
  
  IF customer_user_id IS NULL THEN
    RAISE EXCEPTION '❌ Customer user not found! Please login as customer@demo.com first.';
  END IF;

  -- Store in temp table
  CREATE TEMP TABLE IF NOT EXISTS temp_users (admin_id UUID, customer_id UUID);
  DELETE FROM temp_users;
  INSERT INTO temp_users VALUES (admin_user_id, customer_user_id);
  
  RAISE NOTICE '✅ Admin ID: %', admin_user_id;
  RAISE NOTICE '✅ Customer ID: %', customer_user_id;
END $$;

-- ============================================================================
-- PART 3: CREATE VEHICLES (if not exist)
-- ============================================================================

DO $$
DECLARE
  has_customer_id BOOLEAN;
  has_plate_number BOOLEAN;
  cust_id UUID;
BEGIN
  -- Get customer ID
  SELECT customer_id INTO cust_id FROM temp_users;
  
  -- Check schema
  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'vehicles' AND column_name = 'customer_id'
  ) INTO has_customer_id;
  
  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'vehicles' AND column_name = 'plate_number'
  ) INTO has_plate_number;

  -- Insert vehicles based on schema
  IF has_customer_id AND has_plate_number THEN
    -- Schema: customer_id + plate_number
    INSERT INTO public.vehicles (id, customer_id, brand, model, year, plate_number, color)
    SELECT gen_random_uuid(), cust_id, 'Honda', 'Beat', 2020, 'B 1234 XYZ', 'Merah'
    WHERE NOT EXISTS (SELECT 1 FROM public.vehicles WHERE plate_number = 'B 1234 XYZ');

    INSERT INTO public.vehicles (id, customer_id, brand, model, year, plate_number, color)
    SELECT gen_random_uuid(), cust_id, 'Yamaha', 'NMAX', 2021, 'B 5678 ABC', 'Hitam'
    WHERE NOT EXISTS (SELECT 1 FROM public.vehicles WHERE plate_number = 'B 5678 ABC');

    INSERT INTO public.vehicles (id, customer_id, brand, model, year, plate_number, color)
    SELECT gen_random_uuid(), cust_id, 'Suzuki', 'Satria FU', 2019, 'B 9999 DEF', 'Biru'
    WHERE NOT EXISTS (SELECT 1 FROM public.vehicles WHERE plate_number = 'B 9999 DEF');
    
    RAISE NOTICE '✅ Vehicles created (customer_id + plate_number schema)';
  ELSE
    -- Schema: user_id + license_plate (fallback)
    INSERT INTO public.vehicles (id, user_id, brand, model, year, license_plate, color)
    SELECT gen_random_uuid(), cust_id, 'Honda', 'Beat', 2020, 'B 1234 XYZ', 'Merah'
    WHERE NOT EXISTS (SELECT 1 FROM public.vehicles WHERE license_plate = 'B 1234 XYZ');

    INSERT INTO public.vehicles (id, user_id, brand, model, year, license_plate, color)
    SELECT gen_random_uuid(), cust_id, 'Yamaha', 'NMAX', 2021, 'B 5678 ABC', 'Hitam'
    WHERE NOT EXISTS (SELECT 1 FROM public.vehicles WHERE license_plate = 'B 5678 ABC');

    INSERT INTO public.vehicles (id, user_id, brand, model, year, license_plate, color)
    SELECT gen_random_uuid(), cust_id, 'Suzuki', 'Satria FU', 2019, 'B 9999 DEF', 'Biru'
    WHERE NOT EXISTS (SELECT 1 FROM public.vehicles WHERE license_plate = 'B 9999 DEF');
    
    RAISE NOTICE '✅ Vehicles created (user_id + license_plate schema)';
  END IF;
END $$;

-- ============================================================================
-- PART 4: CREATE 10 DUMMY JOBS
-- ============================================================================

DO $$
DECLARE
  cust_id UUID;
  vehicle1_id UUID;
  vehicle2_id UUID;
  vehicle3_id UUID;
BEGIN
  -- Get customer ID
  SELECT customer_id INTO cust_id FROM temp_users;
  
  -- Get vehicle IDs (try both plate_number and license_plate)
  SELECT id INTO vehicle1_id FROM public.vehicles 
  WHERE plate_number = 'B 1234 XYZ' OR license_plate = 'B 1234 XYZ' LIMIT 1;
  
  SELECT id INTO vehicle2_id FROM public.vehicles 
  WHERE plate_number = 'B 5678 ABC' OR license_plate = 'B 5678 ABC' LIMIT 1;
  
  SELECT id INTO vehicle3_id FROM public.vehicles 
  WHERE plate_number = 'B 9999 DEF' OR license_plate = 'B 9999 DEF' LIMIT 1;

  -- Clear existing demo data
  DELETE FROM public.jobs WHERE job_number LIKE 'DEMO-%';
  
  -- Job 1: Pending (5 mins ago)
  INSERT INTO public.jobs (id, user_id, vehicle_id, job_number, service_type, description, status, amount, created_at)
  VALUES (
    gen_random_uuid(), cust_id, vehicle1_id,
    'DEMO-001', 'Service Rutin',
    'Ganti oli + filter udara + cek rem',
    'pending', 250000, NOW() - INTERVAL '5 minutes'
  );

  -- Job 2: Pending (3 mins ago)
  INSERT INTO public.jobs (id, user_id, vehicle_id, job_number, service_type, description, status, amount, created_at)
  VALUES (
    gen_random_uuid(), cust_id, vehicle2_id,
    'DEMO-002', 'Perbaikan',
    'Perbaikan CVT dan ganti vanbelt',
    'pending', 800000, NOW() - INTERVAL '3 minutes'
  );

  -- Job 3: Scheduled (tomorrow)
  INSERT INTO public.jobs (id, user_id, vehicle_id, job_number, service_type, description, status, scheduled_date, amount, created_at, updated_at)
  VALUES (
    gen_random_uuid(), cust_id, vehicle1_id,
    'DEMO-003', 'Service Berkala',
    'Service 10.000 KM',
    'scheduled', CURRENT_DATE + INTERVAL '1 day',
    350000, NOW() - INTERVAL '2 hours', NOW() - INTERVAL '1 hour'
  );

  -- Job 4: In Progress (45% done)
  INSERT INTO public.jobs (id, user_id, vehicle_id, job_number, service_type, description, status, scheduled_date, amount, progress, created_at, updated_at)
  VALUES (
    gen_random_uuid(), cust_id, vehicle2_id,
    'DEMO-004', 'Perbaikan',
    'Ganti kampas rem + cek sistem kelistrikan',
    'in_progress', CURRENT_DATE,
    450000, 45, NOW() - INTERVAL '5 hours', NOW() - INTERVAL '1 hour'
  );

  -- Job 5: In Progress (70% done)
  INSERT INTO public.jobs (id, user_id, vehicle_id, job_number, service_type, description, status, scheduled_date, amount, progress, created_at, updated_at)
  VALUES (
    gen_random_uuid(), cust_id, vehicle3_id,
    'DEMO-005', 'Service Rutin',
    'Service rutin + tune up',
    'in_progress', CURRENT_DATE,
    300000, 70, NOW() - INTERVAL '3 hours', NOW() - INTERVAL '30 minutes'
  );

  -- Job 6: Awaiting Payment
  INSERT INTO public.jobs (id, user_id, vehicle_id, job_number, service_type, description, status, scheduled_date, completed_date, amount, progress, created_at, updated_at)
  VALUES (
    gen_random_uuid(), cust_id, vehicle1_id,
    'DEMO-006', 'Service Berkala',
    'Service 5.000 KM + ganti oli',
    'awaiting_payment', CURRENT_DATE - INTERVAL '1 day', CURRENT_DATE,
    280000, 100, NOW() - INTERVAL '1 day', NOW() - INTERVAL '2 hours'
  );

  -- Job 7: Completed
  INSERT INTO public.jobs (id, user_id, vehicle_id, job_number, service_type, description, status, scheduled_date, completed_date, amount, progress, created_at, updated_at)
  VALUES (
    gen_random_uuid(), cust_id, vehicle2_id,
    'DEMO-007', 'Perbaikan',
    'Ganti sparepart CDI dan koil',
    'completed', CURRENT_DATE - INTERVAL '3 days', CURRENT_DATE - INTERVAL '3 days',
    650000, 100, NOW() - INTERVAL '4 days', NOW() - INTERVAL '3 days'
  );

  -- Job 8: Scheduled (2 days from now)
  INSERT INTO public.jobs (id, user_id, vehicle_id, job_number, service_type, description, status, scheduled_date, amount, created_at, updated_at)
  VALUES (
    gen_random_uuid(), cust_id, vehicle3_id,
    'DEMO-008', 'Service Rutin',
    'Ganti oli mesin + oli gardan',
    'scheduled', CURRENT_DATE + INTERVAL '2 days',
    320000, NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'
  );

  -- Job 9: Pending (just now!)
  INSERT INTO public.jobs (id, user_id, vehicle_id, job_number, service_type, description, status, amount, created_at)
  VALUES (
    gen_random_uuid(), cust_id, vehicle1_id,
    'DEMO-009', 'Perbaikan',
    'Cek bunyi aneh di mesin + tune up',
    'pending', 400000, NOW() - INTERVAL '1 minute'
  );

  -- Job 10: Completed
  INSERT INTO public.jobs (id, user_id, vehicle_id, job_number, service_type, description, status, scheduled_date, completed_date, amount, progress, created_at, updated_at)
  VALUES (
    gen_random_uuid(), cust_id, vehicle2_id,
    'DEMO-010', 'Service Berkala',
    'Service lengkap 20.000 KM',
    'completed', CURRENT_DATE - INTERVAL '5 days', CURRENT_DATE - INTERVAL '5 days',
    750000, 100, NOW() - INTERVAL '6 days', NOW() - INTERVAL '5 days'
  );

  RAISE NOTICE '✅ 10 dummy jobs created successfully!';
END $$;

-- ============================================================================
-- PART 5: VERIFICATION
-- ============================================================================

SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' AS separator;
SELECT '📊 DUMMY DATA SUMMARY' AS title;
SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' AS separator;

SELECT 
  '⏳ Pending' AS status,
  COUNT(*) AS count
FROM public.jobs WHERE status = 'pending' AND job_number LIKE 'DEMO-%'
UNION ALL
SELECT 
  '📅 Scheduled' AS status,
  COUNT(*) AS count
FROM public.jobs WHERE status = 'scheduled' AND job_number LIKE 'DEMO-%'
UNION ALL
SELECT 
  '🔧 In Progress' AS status,
  COUNT(*) AS count
FROM public.jobs WHERE status = 'in_progress' AND job_number LIKE 'DEMO-%'
UNION ALL
SELECT 
  '💰 Awaiting Payment' AS status,
  COUNT(*) AS count
FROM public.jobs WHERE status = 'awaiting_payment' AND job_number LIKE 'DEMO-%'
UNION ALL
SELECT 
  '✅ Completed' AS status,
  COUNT(*) AS count
FROM public.jobs WHERE status = 'completed' AND job_number LIKE 'DEMO-%'
UNION ALL
SELECT 
  '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' AS status,
  NULL AS count
UNION ALL
SELECT 
  '📊 TOTAL JOBS' AS status,
  COUNT(*) AS count
FROM public.jobs WHERE job_number LIKE 'DEMO-%';

SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' AS separator;
SELECT '📋 JOB DETAILS' AS title;
SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' AS separator;

SELECT 
  job_number AS "Job #",
  CASE 
    WHEN status = 'pending' THEN '⏳ Pending'
    WHEN status = 'scheduled' THEN '📅 Scheduled'
    WHEN status = 'in_progress' THEN '🔧 In Progress'
    WHEN status = 'awaiting_payment' THEN '💰 Awaiting Payment'
    WHEN status = 'completed' THEN '✅ Completed'
    ELSE status
  END AS "Status",
  service_type AS "Service Type",
  'Rp ' || TO_CHAR(amount, 'FM999,999,999') AS "Amount",
  TO_CHAR(created_at, 'DD Mon HH24:MI') AS "Created At"
FROM public.jobs
WHERE job_number LIKE 'DEMO-%'
ORDER BY created_at DESC;

SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' AS separator;
SELECT '🎉 ALL DONE!' AS result;
SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' AS separator;
SELECT '💡 NEXT STEP 1: Enable real-time for jobs table' AS next_step;
SELECT '   → Database > Replication > jobs (toggle ON)' AS info;
SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' AS separator;
SELECT '💡 NEXT STEP 2: Test booking flow' AS next_step;
SELECT '   → Customer: Create booking' AS info;
SELECT '   → Admin: Approve booking' AS info;
SELECT '   → Customer modal: Auto-updates! ✨' AS info;
SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' AS separator;
