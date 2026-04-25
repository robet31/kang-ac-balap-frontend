-- ============================================================================
-- ULTRA SAFE DUMMY DATA - Auto-Detect Schema
-- ============================================================================
-- This script automatically detects your schema and adapts!
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
CREATE POLICY "Users can view own jobs"
  ON public.jobs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all jobs"
  ON public.jobs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Users can insert own jobs"
  ON public.jobs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can update all jobs"
  ON public.jobs FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

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
-- PART 2: DETECT VEHICLES TABLE SCHEMA
-- ============================================================================

DO $$
DECLARE
  v_columns TEXT;
BEGIN
  -- Get all columns from vehicles table
  SELECT string_agg(column_name, ', ' ORDER BY ordinal_position)
  INTO v_columns
  FROM information_schema.columns
  WHERE table_schema = 'public' 
    AND table_name = 'vehicles';
  
  IF v_columns IS NULL THEN
    RAISE EXCEPTION '❌ Table "vehicles" does not exist! Please run database migration first.';
  END IF;
  
  RAISE NOTICE '📋 Vehicles table columns: %', v_columns;
  
  -- Store schema info in temp table
  CREATE TEMP TABLE IF NOT EXISTS temp_schema (
    has_customer_id BOOLEAN,
    has_user_id BOOLEAN,
    has_plate_number BOOLEAN,
    has_license_plate BOOLEAN,
    owner_column TEXT,
    plate_column TEXT
  );
  
  DELETE FROM temp_schema;
  
  INSERT INTO temp_schema
  SELECT
    EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'vehicles' AND column_name = 'customer_id'),
    EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'vehicles' AND column_name = 'user_id'),
    EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'vehicles' AND column_name = 'plate_number'),
    EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'vehicles' AND column_name = 'license_plate'),
    CASE 
      WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'vehicles' AND column_name = 'customer_id') THEN 'customer_id'
      WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'vehicles' AND column_name = 'user_id') THEN 'user_id'
      ELSE NULL
    END,
    CASE 
      WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'vehicles' AND column_name = 'plate_number') THEN 'plate_number'
      WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'vehicles' AND column_name = 'license_plate') THEN 'license_plate'
      ELSE NULL
    END;
  
  RAISE NOTICE '✅ Schema detected - Owner column: %, Plate column: %', 
    (SELECT owner_column FROM temp_schema),
    (SELECT plate_column FROM temp_schema);
END $$;

-- ============================================================================
-- PART 3: GET DEMO USERS
-- ============================================================================

DO $$
DECLARE
  admin_user_id UUID;
  customer_user_id UUID;
BEGIN
  SELECT id INTO admin_user_id FROM auth.users WHERE email = 'admin@demo.com' LIMIT 1;
  SELECT id INTO customer_user_id FROM auth.users WHERE email = 'customer@demo.com' LIMIT 1;
  
  IF admin_user_id IS NULL THEN
    RAISE EXCEPTION '❌ Admin user not found! Please login as admin@demo.com first.';
  END IF;
  
  IF customer_user_id IS NULL THEN
    RAISE EXCEPTION '❌ Customer user not found! Please login as customer@demo.com first.';
  END IF;

  CREATE TEMP TABLE IF NOT EXISTS temp_users (admin_id UUID, customer_id UUID);
  DELETE FROM temp_users;
  INSERT INTO temp_users VALUES (admin_user_id, customer_user_id);
  
  RAISE NOTICE '✅ Admin ID: %', admin_user_id;
  RAISE NOTICE '✅ Customer ID: %', customer_user_id;
END $$;

-- ============================================================================
-- PART 4: CREATE VEHICLES (Dynamic SQL based on schema)
-- ============================================================================

DO $$
DECLARE
  v_owner_col TEXT;
  v_plate_col TEXT;
  v_sql TEXT;
  v_customer_id UUID;
BEGIN
  -- Get schema info
  SELECT owner_column, plate_column 
  INTO v_owner_col, v_plate_col
  FROM temp_schema;
  
  -- Get customer ID
  SELECT customer_id INTO v_customer_id FROM temp_users;
  
  IF v_owner_col IS NULL THEN
    RAISE EXCEPTION '❌ Cannot find owner column (customer_id or user_id) in vehicles table!';
  END IF;
  
  IF v_plate_col IS NULL THEN
    RAISE EXCEPTION '❌ Cannot find plate column (plate_number or license_plate) in vehicles table!';
  END IF;
  
  -- Vehicle 1: Honda Beat
  v_sql := format(
    'INSERT INTO public.vehicles (id, %I, brand, model, year, %I, color)
     SELECT $1, $2, $3, $4, $5, $6, $7
     WHERE NOT EXISTS (SELECT 1 FROM public.vehicles WHERE %I = $6)',
    v_owner_col, v_plate_col, v_plate_col
  );
  EXECUTE v_sql USING gen_random_uuid(), v_customer_id, 'Honda', 'Beat', 2020, 'B 1234 XYZ', 'Merah';
  
  -- Vehicle 2: Yamaha NMAX
  v_sql := format(
    'INSERT INTO public.vehicles (id, %I, brand, model, year, %I, color)
     SELECT $1, $2, $3, $4, $5, $6, $7
     WHERE NOT EXISTS (SELECT 1 FROM public.vehicles WHERE %I = $6)',
    v_owner_col, v_plate_col, v_plate_col
  );
  EXECUTE v_sql USING gen_random_uuid(), v_customer_id, 'Yamaha', 'NMAX', 2021, 'B 5678 ABC', 'Hitam';
  
  -- Vehicle 3: Suzuki Satria
  v_sql := format(
    'INSERT INTO public.vehicles (id, %I, brand, model, year, %I, color)
     SELECT $1, $2, $3, $4, $5, $6, $7
     WHERE NOT EXISTS (SELECT 1 FROM public.vehicles WHERE %I = $6)',
    v_owner_col, v_plate_col, v_plate_col
  );
  EXECUTE v_sql USING gen_random_uuid(), v_customer_id, 'Suzuki', 'Satria FU', 2019, 'B 9999 DEF', 'Biru';
  
  RAISE NOTICE '✅ 3 vehicles created using columns: % and %', v_owner_col, v_plate_col;
END $$;

-- ============================================================================
-- PART 5: CREATE 10 DUMMY JOBS (Dynamic SQL)
-- ============================================================================

DO $$
DECLARE
  v_customer_id UUID;
  v_vehicle1_id UUID;
  v_vehicle2_id UUID;
  v_vehicle3_id UUID;
  v_plate_col TEXT;
  v_sql TEXT;
BEGIN
  -- Get customer ID
  SELECT customer_id INTO v_customer_id FROM temp_users;
  
  -- Get plate column
  SELECT plate_column INTO v_plate_col FROM temp_schema;
  
  -- Get vehicle IDs using dynamic SQL
  v_sql := format('SELECT id FROM public.vehicles WHERE %I = $1 LIMIT 1', v_plate_col);
  EXECUTE v_sql INTO v_vehicle1_id USING 'B 1234 XYZ';
  EXECUTE v_sql INTO v_vehicle2_id USING 'B 5678 ABC';
  EXECUTE v_sql INTO v_vehicle3_id USING 'B 9999 DEF';
  
  IF v_vehicle1_id IS NULL OR v_vehicle2_id IS NULL OR v_vehicle3_id IS NULL THEN
    RAISE EXCEPTION '❌ Cannot find vehicles! IDs: %, %, %', v_vehicle1_id, v_vehicle2_id, v_vehicle3_id;
  END IF;
  
  -- Clear existing demo data
  DELETE FROM public.jobs WHERE job_number LIKE 'DEMO-%';
  
  -- Insert 10 jobs
  INSERT INTO public.jobs (id, user_id, vehicle_id, job_number, service_type, description, status, amount, created_at)
  VALUES (gen_random_uuid(), v_customer_id, v_vehicle1_id, 'DEMO-001', 'Service Rutin', 'Ganti oli + filter udara + cek rem', 'pending', 250000, NOW() - INTERVAL '5 minutes');
  
  INSERT INTO public.jobs (id, user_id, vehicle_id, job_number, service_type, description, status, amount, created_at)
  VALUES (gen_random_uuid(), v_customer_id, v_vehicle2_id, 'DEMO-002', 'Perbaikan', 'Perbaikan CVT dan ganti vanbelt', 'pending', 800000, NOW() - INTERVAL '3 minutes');
  
  INSERT INTO public.jobs (id, user_id, vehicle_id, job_number, service_type, description, status, scheduled_date, amount, created_at, updated_at)
  VALUES (gen_random_uuid(), v_customer_id, v_vehicle1_id, 'DEMO-003', 'Service Berkala', 'Service 10.000 KM', 'scheduled', CURRENT_DATE + INTERVAL '1 day', 350000, NOW() - INTERVAL '2 hours', NOW() - INTERVAL '1 hour');
  
  INSERT INTO public.jobs (id, user_id, vehicle_id, job_number, service_type, description, status, scheduled_date, amount, progress, created_at, updated_at)
  VALUES (gen_random_uuid(), v_customer_id, v_vehicle2_id, 'DEMO-004', 'Perbaikan', 'Ganti kampas rem + cek sistem kelistrikan', 'in_progress', CURRENT_DATE, 450000, 45, NOW() - INTERVAL '5 hours', NOW() - INTERVAL '1 hour');
  
  INSERT INTO public.jobs (id, user_id, vehicle_id, job_number, service_type, description, status, scheduled_date, amount, progress, created_at, updated_at)
  VALUES (gen_random_uuid(), v_customer_id, v_vehicle3_id, 'DEMO-005', 'Service Rutin', 'Service rutin + tune up', 'in_progress', CURRENT_DATE, 300000, 70, NOW() - INTERVAL '3 hours', NOW() - INTERVAL '30 minutes');
  
  INSERT INTO public.jobs (id, user_id, vehicle_id, job_number, service_type, description, status, scheduled_date, completed_date, amount, progress, created_at, updated_at)
  VALUES (gen_random_uuid(), v_customer_id, v_vehicle1_id, 'DEMO-006', 'Service Berkala', 'Service 5.000 KM + ganti oli', 'awaiting_payment', CURRENT_DATE - INTERVAL '1 day', CURRENT_DATE, 280000, 100, NOW() - INTERVAL '1 day', NOW() - INTERVAL '2 hours');
  
  INSERT INTO public.jobs (id, user_id, vehicle_id, job_number, service_type, description, status, scheduled_date, completed_date, amount, progress, created_at, updated_at)
  VALUES (gen_random_uuid(), v_customer_id, v_vehicle2_id, 'DEMO-007', 'Perbaikan', 'Ganti sparepart CDI dan koil', 'completed', CURRENT_DATE - INTERVAL '3 days', CURRENT_DATE - INTERVAL '3 days', 650000, 100, NOW() - INTERVAL '4 days', NOW() - INTERVAL '3 days');
  
  INSERT INTO public.jobs (id, user_id, vehicle_id, job_number, service_type, description, status, scheduled_date, amount, created_at, updated_at)
  VALUES (gen_random_uuid(), v_customer_id, v_vehicle3_id, 'DEMO-008', 'Service Rutin', 'Ganti oli mesin + oli gardan', 'scheduled', CURRENT_DATE + INTERVAL '2 days', 320000, NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day');
  
  INSERT INTO public.jobs (id, user_id, vehicle_id, job_number, service_type, description, status, amount, created_at)
  VALUES (gen_random_uuid(), v_customer_id, v_vehicle1_id, 'DEMO-009', 'Perbaikan', 'Cek bunyi aneh di mesin + tune up', 'pending', 400000, NOW() - INTERVAL '1 minute');
  
  INSERT INTO public.jobs (id, user_id, vehicle_id, job_number, service_type, description, status, scheduled_date, completed_date, amount, progress, created_at, updated_at)
  VALUES (gen_random_uuid(), v_customer_id, v_vehicle2_id, 'DEMO-010', 'Service Berkala', 'Service lengkap 20.000 KM', 'completed', CURRENT_DATE - INTERVAL '5 days', CURRENT_DATE - INTERVAL '5 days', 750000, 100, NOW() - INTERVAL '6 days', NOW() - INTERVAL '5 days');
  
  RAISE NOTICE '✅ 10 dummy jobs created successfully!';
END $$;

-- ============================================================================
-- VERIFICATION
-- ============================================================================

SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' AS separator;
SELECT '📊 DUMMY DATA SUMMARY' AS title;
SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' AS separator;

SELECT 
  '⏳ Pending' AS status, COUNT(*) AS count
FROM public.jobs WHERE status = 'pending' AND job_number LIKE 'DEMO-%'
UNION ALL
SELECT '📅 Scheduled' AS status, COUNT(*) AS count
FROM public.jobs WHERE status = 'scheduled' AND job_number LIKE 'DEMO-%'
UNION ALL
SELECT '🔧 In Progress' AS status, COUNT(*) AS count
FROM public.jobs WHERE status = 'in_progress' AND job_number LIKE 'DEMO-%'
UNION ALL
SELECT '💰 Awaiting Payment' AS status, COUNT(*) AS count
FROM public.jobs WHERE status = 'awaiting_payment' AND job_number LIKE 'DEMO-%'
UNION ALL
SELECT '✅ Completed' AS status, COUNT(*) AS count
FROM public.jobs WHERE status = 'completed' AND job_number LIKE 'DEMO-%'
UNION ALL
SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' AS status, NULL AS count
UNION ALL
SELECT '📊 TOTAL JOBS' AS status, COUNT(*) AS count
FROM public.jobs WHERE job_number LIKE 'DEMO-%';

SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' AS separator;
SELECT '🎉 ALL DONE!' AS result;
SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' AS separator;
SELECT '💡 Next: Enable real-time for jobs table' AS step;
SELECT '   → Database > Replication > jobs (toggle ON)' AS info;
SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' AS separator;
