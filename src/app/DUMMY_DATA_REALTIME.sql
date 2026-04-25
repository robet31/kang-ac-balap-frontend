-- ============================================================================
-- DUMMY DATA FOR REAL-TIME TESTING - Sunest Auto
-- ============================================================================
-- Creates 10 dummy bookings with various statuses for testing real-time flow
-- ============================================================================

-- First, make sure we have demo users
DO $$
DECLARE
  admin_user_id UUID;
  customer_user_id UUID;
BEGIN
  -- Get or create admin user
  SELECT id INTO admin_user_id FROM auth.users WHERE email = 'admin@demo.com' LIMIT 1;
  
  -- Get or create customer user
  SELECT id INTO customer_user_id FROM auth.users WHERE email = 'customer@demo.com' LIMIT 1;
  
  -- If users don't exist, we'll use dummy UUIDs (you should create them via signup first)
  IF admin_user_id IS NULL THEN
    admin_user_id := 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::UUID;
    RAISE NOTICE 'Admin user not found! Create admin@demo.com first.';
  END IF;
  
  IF customer_user_id IS NULL THEN
    customer_user_id := 'cccccccc-cccc-cccc-cccc-cccccccccccc'::UUID;
    RAISE NOTICE 'Customer user not found! Create customer@demo.com first.';
  END IF;

  -- Store in temp table for use below
  CREATE TEMP TABLE temp_users (admin_id UUID, customer_id UUID);
  INSERT INTO temp_users VALUES (admin_user_id, customer_user_id);
END $$;

-- ============================================================================
-- CREATE DUMMY VEHICLES (if not exist)
-- ============================================================================

-- Note: Using customer_id (check your schema - might be user_id)
INSERT INTO public.vehicles (id, customer_id, brand, model, year, plate_number, color)
SELECT 
  gen_random_uuid(),
  (SELECT customer_id FROM temp_users),
  'Honda',
  'Beat',
  2020,
  'B 1234 XYZ',
  'Merah'
WHERE NOT EXISTS (
  SELECT 1 FROM public.vehicles WHERE plate_number = 'B 1234 XYZ'
);

INSERT INTO public.vehicles (id, customer_id, brand, model, year, plate_number, color)
SELECT 
  gen_random_uuid(),
  (SELECT customer_id FROM temp_users),
  'Yamaha',
  'NMAX',
  2021,
  'B 5678 ABC',
  'Hitam'
WHERE NOT EXISTS (
  SELECT 1 FROM public.vehicles WHERE plate_number = 'B 5678 ABC'
);

INSERT INTO public.vehicles (id, customer_id, brand, model, year, plate_number, color)
SELECT 
  gen_random_uuid(),
  (SELECT customer_id FROM temp_users),
  'Suzuki',
  'Satria FU',
  2019,
  'B 9999 DEF',
  'Biru'
WHERE NOT EXISTS (
  SELECT 1 FROM public.vehicles WHERE plate_number = 'B 9999 DEF'
);

-- ============================================================================
-- CREATE 10 DUMMY BOOKINGS/JOBS
-- ============================================================================

-- Clear existing dummy data (optional - comment out if you want to keep)
-- DELETE FROM public.jobs WHERE job_number LIKE 'DEMO%';

-- Job 1: Pending (Baru masuk, tunggu admin approve)
INSERT INTO public.jobs (
  id, user_id, vehicle_id, job_number, service_type, 
  description, status, amount, created_at
)
SELECT 
  gen_random_uuid(),
  (SELECT customer_id FROM temp_users),
  (SELECT id FROM public.vehicles WHERE plate_number = 'B 1234 XYZ' LIMIT 1),
  'DEMO-001',
  'Service Rutin',
  'Ganti oli + filter udara + cek rem',
  'pending',
  250000,
  NOW() - INTERVAL '5 minutes'
WHERE NOT EXISTS (SELECT 1 FROM public.jobs WHERE job_number = 'DEMO-001');

-- Job 2: Pending (Baru masuk)
INSERT INTO public.jobs (
  id, user_id, vehicle_id, job_number, service_type, 
  description, status, amount, created_at
)
SELECT 
  gen_random_uuid(),
  (SELECT customer_id FROM temp_users),
  (SELECT id FROM public.vehicles WHERE plate_number = 'B 5678 ABC' LIMIT 1),
  'DEMO-002',
  'Perbaikan',
  'Perbaikan CVT dan ganti vanbelt',
  'pending',
  800000,
  NOW() - INTERVAL '3 minutes'
WHERE NOT EXISTS (SELECT 1 FROM public.jobs WHERE job_number = 'DEMO-002');

-- Job 3: Scheduled (Admin sudah approve)
INSERT INTO public.jobs (
  id, user_id, vehicle_id, job_number, service_type, 
  description, status, scheduled_date, amount, created_at, updated_at
)
SELECT 
  gen_random_uuid(),
  (SELECT customer_id FROM temp_users),
  (SELECT id FROM public.vehicles WHERE plate_number = 'B 1234 XYZ' LIMIT 1),
  'DEMO-003',
  'Service Berkala',
  'Service 10.000 KM',
  'scheduled',
  CURRENT_DATE + INTERVAL '1 day',
  350000,
  NOW() - INTERVAL '2 hours',
  NOW() - INTERVAL '1 hour'
WHERE NOT EXISTS (SELECT 1 FROM public.jobs WHERE job_number = 'DEMO-003');

-- Job 4: In Progress (Sedang dikerjakan)
INSERT INTO public.jobs (
  id, user_id, vehicle_id, job_number, service_type, 
  description, status, scheduled_date, amount, progress, created_at, updated_at
)
SELECT 
  gen_random_uuid(),
  (SELECT customer_id FROM temp_users),
  (SELECT id FROM public.vehicles WHERE plate_number = 'B 5678 ABC' LIMIT 1),
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

-- Job 5: In Progress (Sedang dikerjakan)
INSERT INTO public.jobs (
  id, user_id, vehicle_id, job_number, service_type, 
  description, status, scheduled_date, amount, progress, created_at, updated_at
)
SELECT 
  gen_random_uuid(),
  (SELECT customer_id FROM temp_users),
  (SELECT id FROM public.vehicles WHERE plate_number = 'B 9999 DEF' LIMIT 1),
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

-- Job 6: Awaiting Payment (Selesai, tunggu bayar)
INSERT INTO public.jobs (
  id, user_id, vehicle_id, job_number, service_type, 
  description, status, scheduled_date, completed_date, amount, progress, created_at, updated_at
)
SELECT 
  gen_random_uuid(),
  (SELECT customer_id FROM temp_users),
  (SELECT id FROM public.vehicles WHERE plate_number = 'B 1234 XYZ' LIMIT 1),
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

-- Job 7: Completed (Selesai & sudah bayar)
INSERT INTO public.jobs (
  id, user_id, vehicle_id, job_number, service_type, 
  description, status, scheduled_date, completed_date, amount, progress, created_at, updated_at
)
SELECT 
  gen_random_uuid(),
  (SELECT customer_id FROM temp_users),
  (SELECT id FROM public.vehicles WHERE plate_number = 'B 5678 ABC' LIMIT 1),
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

-- Job 8: Scheduled (Jadwal besok)
INSERT INTO public.jobs (
  id, user_id, vehicle_id, job_number, service_type, 
  description, status, scheduled_date, amount, created_at, updated_at
)
SELECT 
  gen_random_uuid(),
  (SELECT customer_id FROM temp_users),
  (SELECT id FROM public.vehicles WHERE plate_number = 'B 9999 DEF' LIMIT 1),
  'DEMO-008',
  'Service Rutin',
  'Ganti oli mesin + oli gardan',
  'scheduled',
  CURRENT_DATE + INTERVAL '2 days',
  320000,
  NOW() - INTERVAL '1 day',
  NOW() - INTERVAL '1 day'
WHERE NOT EXISTS (SELECT 1 FROM public.jobs WHERE job_number = 'DEMO-008');

-- Job 9: Pending (Baru banget)
INSERT INTO public.jobs (
  id, user_id, vehicle_id, job_number, service_type, 
  description, status, amount, created_at
)
SELECT 
  gen_random_uuid(),
  (SELECT customer_id FROM temp_users),
  (SELECT id FROM public.vehicles WHERE plate_number = 'B 1234 XYZ' LIMIT 1),
  'DEMO-009',
  'Perbaikan',
  'Cek bunyi aneh di mesin + tune up',
  'pending',
  400000,
  NOW() - INTERVAL '1 minute'
WHERE NOT EXISTS (SELECT 1 FROM public.jobs WHERE job_number = 'DEMO-009');

-- Job 10: Completed (Success story)
INSERT INTO public.jobs (
  id, user_id, vehicle_id, job_number, service_type, 
  description, status, scheduled_date, completed_date, amount, progress, created_at, updated_at
)
SELECT 
  gen_random_uuid(),
  (SELECT customer_id FROM temp_users),
  (SELECT id FROM public.vehicles WHERE plate_number = 'B 5678 ABC' LIMIT 1),
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

SELECT 
  '📊 DUMMY DATA SUMMARY' AS info,
  COUNT(*) FILTER (WHERE status = 'pending') AS pending_jobs,
  COUNT(*) FILTER (WHERE status = 'scheduled') AS scheduled_jobs,
  COUNT(*) FILTER (WHERE status = 'in_progress') AS in_progress_jobs,
  COUNT(*) FILTER (WHERE status = 'awaiting_payment') AS awaiting_payment_jobs,
  COUNT(*) FILTER (WHERE status = 'completed') AS completed_jobs,
  COUNT(*) AS total_dummy_jobs
FROM public.jobs
WHERE job_number LIKE 'DEMO%';

-- Show all dummy jobs
SELECT 
  '📋 ALL DUMMY JOBS' AS info,
  job_number,
  service_type,
  status,
  amount,
  TO_CHAR(created_at, 'DD Mon HH24:MI') AS created,
  description
FROM public.jobs
WHERE job_number LIKE 'DEMO%'
ORDER BY created_at DESC;

-- ============================================================================
-- ✅ DONE! 
-- ============================================================================
-- You should now have:
-- - 3 Vehicles
-- - 10 Jobs with different statuses:
--   • 3 Pending (waiting admin approval)
--   • 2 Scheduled (approved, scheduled for service)
--   • 2 In Progress (currently being worked on)
--   • 1 Awaiting Payment (done, waiting payment)
--   • 2 Completed (fully done)
-- ============================================================================

SELECT '🎉 10 dummy bookings created successfully!' AS result;
SELECT '💡 Refresh Admin Dashboard to see pending bookings' AS next_step;
SELECT '💡 Approve pending jobs to see real-time update in Customer Dashboard' AS next_step_2;