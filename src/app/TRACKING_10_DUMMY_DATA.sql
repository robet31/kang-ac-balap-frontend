-- ============================================================================
-- ADD 10 DUMMY TRACKING DATA - Real-Time to Admin Dashboard
-- ============================================================================
-- Adds 10 bookings for customer to see in Tracking tab
-- Admin will see these real-time in dashboard!
-- ============================================================================

-- Get customer user
DO $$
DECLARE
  customer_user_id UUID;
BEGIN
  -- Get customer from auth.users
  SELECT id INTO customer_user_id FROM auth.users WHERE email = 'customer@demo.com' LIMIT 1;
  
  IF customer_user_id IS NULL THEN
    RAISE EXCEPTION '❌ Customer user not found! Please login as customer@demo.com first.';
  END IF;

  -- Store in temp table
  CREATE TEMP TABLE IF NOT EXISTS temp_customer (customer_id UUID);
  DELETE FROM temp_customer;
  INSERT INTO temp_customer VALUES (customer_user_id);
  
  RAISE NOTICE '✅ Customer ID: %', customer_user_id;
END $$;

-- ============================================================================
-- CREATE 10 TRACKING BOOKINGS
-- ============================================================================

DO $$
DECLARE
  v_customer_id UUID;
BEGIN
  -- Get customer ID
  SELECT customer_id INTO v_customer_id FROM temp_customer;
  
  -- Clear existing tracking demo data
  DELETE FROM public.jobs WHERE job_number LIKE 'TRACK-%';
  
  -- ========== MENUNGGU (3 jobs) ==========
  
  -- 1. Menunggu - Just created (1 min ago)
  INSERT INTO public.jobs (
    id, user_id, job_number, service_type, description, 
    status, amount, created_at
  ) VALUES (
    gen_random_uuid(), v_customer_id, 'TRACK-001', 
    'Service Rutin', 'Ganti oli mesin + filter + cek rem',
    'pending', 250000, NOW() - INTERVAL '1 minute'
  );
  
  -- 2. Menunggu - Created 5 mins ago
  INSERT INTO public.jobs (
    id, user_id, job_number, service_type, description,
    status, amount, created_at
  ) VALUES (
    gen_random_uuid(), v_customer_id, 'TRACK-002',
    'Perbaikan', 'CVT bermasalah + ganti vanbelt',
    'pending', 800000, NOW() - INTERVAL '5 minutes'
  );
  
  -- 3. Menunggu - Created 10 mins ago
  INSERT INTO public.jobs (
    id, user_id, job_number, service_type, description,
    status, amount, created_at
  ) VALUES (
    gen_random_uuid(), v_customer_id, 'TRACK-003',
    'Tune Up', 'Tune up lengkap + carbon clean',
    'pending', 450000, NOW() - INTERVAL '10 minutes'
  );
  
  -- ========== DIJADWALKAN (2 jobs) ==========
  
  -- 4. Dijadwalkan - Tomorrow
  INSERT INTO public.jobs (
    id, user_id, job_number, service_type, description,
    status, scheduled_date, amount, created_at, updated_at
  ) VALUES (
    gen_random_uuid(), v_customer_id, 'TRACK-004',
    'Service Berkala', 'Service 10.000 KM',
    'scheduled', CURRENT_DATE + INTERVAL '1 day', 
    350000, NOW() - INTERVAL '2 hours', NOW() - INTERVAL '1 hour'
  );
  
  -- 5. Dijadwalkan - Day after tomorrow
  INSERT INTO public.jobs (
    id, user_id, job_number, service_type, description,
    status, scheduled_date, amount, created_at, updated_at
  ) VALUES (
    gen_random_uuid(), v_customer_id, 'TRACK-005',
    'Ganti Sparepart', 'Ganti kampas rem depan + belakang',
    'scheduled', CURRENT_DATE + INTERVAL '2 days',
    320000, NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'
  );
  
  -- ========== SEDANG DIPERBAIKI (3 jobs) ==========
  
  -- 6. Sedang Diperbaiki - 45% progress
  INSERT INTO public.jobs (
    id, user_id, job_number, service_type, description,
    status, scheduled_date, amount, progress, created_at, updated_at
  ) VALUES (
    gen_random_uuid(), v_customer_id, 'TRACK-006',
    'Service Premium', 'Service besar + ganti oli + tune up',
    'in_progress', CURRENT_DATE,
    550000, 45, NOW() - INTERVAL '5 hours', NOW() - INTERVAL '1 hour'
  );
  
  -- 7. Sedang Diperbaiki - 70% progress
  INSERT INTO public.jobs (
    id, user_id, job_number, service_type, description,
    status, scheduled_date, amount, progress, created_at, updated_at
  ) VALUES (
    gen_random_uuid(), v_customer_id, 'TRACK-007',
    'Perbaikan Mesin', 'Overhaul mesin + setel klep',
    'in_progress', CURRENT_DATE,
    1200000, 70, NOW() - INTERVAL '3 hours', NOW() - INTERVAL '30 minutes'
  );
  
  -- 8. Sedang Diperbaiki - 25% progress (baru mulai)
  INSERT INTO public.jobs (
    id, user_id, job_number, service_type, description,
    status, scheduled_date, amount, progress, created_at, updated_at
  ) VALUES (
    gen_random_uuid(), v_customer_id, 'TRACK-008',
    'Service Rutin', 'Ganti oli + cek sistem kelistrikan',
    'in_progress', CURRENT_DATE,
    300000, 25, NOW() - INTERVAL '2 hours', NOW() - INTERVAL '15 minutes'
  );
  
  -- ========== SELESAI (2 jobs) ==========
  
  -- 9. Selesai - Yesterday
  INSERT INTO public.jobs (
    id, user_id, job_number, service_type, description,
    status, scheduled_date, completed_date, amount, progress, created_at, updated_at
  ) VALUES (
    gen_random_uuid(), v_customer_id, 'TRACK-009',
    'Service Berkala', 'Service 5.000 KM + ganti oli',
    'completed', CURRENT_DATE - INTERVAL '1 day', CURRENT_DATE - INTERVAL '1 day',
    280000, 100, NOW() - INTERVAL '2 days', CURRENT_DATE - INTERVAL '1 day'
  );
  
  -- 10. Selesai - 3 days ago
  INSERT INTO public.jobs (
    id, user_id, job_number, service_type, description,
    status, scheduled_date, completed_date, amount, progress, created_at, updated_at
  ) VALUES (
    gen_random_uuid(), v_customer_id, 'TRACK-010',
    'Perbaikan', 'Ganti CDI + koil + busi',
    'completed', CURRENT_DATE - INTERVAL '3 days', CURRENT_DATE - INTERVAL '3 days',
    650000, 100, NOW() - INTERVAL '4 days', CURRENT_DATE - INTERVAL '3 days'
  );
  
  RAISE NOTICE '✅ 10 tracking jobs created successfully!';
END $$;

-- ============================================================================
-- VERIFICATION
-- ============================================================================

SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' AS separator;
SELECT '📊 TRACKING DATA SUMMARY' AS title;
SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' AS separator;

SELECT 
  '⏳ Menunggu' AS status, COUNT(*) AS count
FROM public.jobs WHERE status = 'pending' AND job_number LIKE 'TRACK-%'
UNION ALL
SELECT '📅 Dijadwalkan' AS status, COUNT(*) AS count
FROM public.jobs WHERE status = 'scheduled' AND job_number LIKE 'TRACK-%'
UNION ALL
SELECT '🔧 Sedang Diperbaiki' AS status, COUNT(*) AS count
FROM public.jobs WHERE status = 'in_progress' AND job_number LIKE 'TRACK-%'
UNION ALL
SELECT '✅ Selesai' AS status, COUNT(*) AS count
FROM public.jobs WHERE status = 'completed' AND job_number LIKE 'TRACK-%'
UNION ALL
SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' AS status, NULL AS count
UNION ALL
SELECT '📊 TOTAL TRACKING' AS status, COUNT(*) AS count
FROM public.jobs WHERE job_number LIKE 'TRACK-%';

SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' AS separator;
SELECT '📋 JOB DETAILS' AS title;
SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' AS separator;

SELECT 
  job_number AS "Job #",
  CASE 
    WHEN status = 'pending' THEN '⏳ Menunggu'
    WHEN status = 'scheduled' THEN '📅 Dijadwalkan'
    WHEN status = 'in_progress' THEN '🔧 Sedang Diperbaiki'
    WHEN status = 'completed' THEN '✅ Selesai'
    ELSE status
  END AS "Status",
  service_type AS "Service Type",
  COALESCE(progress, 0) || '%' AS "Progress",
  'Rp ' || TO_CHAR(amount, 'FM999,999,999') AS "Amount",
  TO_CHAR(created_at, 'DD Mon HH24:MI') AS "Created"
FROM public.jobs
WHERE job_number LIKE 'TRACK-%'
ORDER BY created_at DESC;

SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' AS separator;
SELECT '🎉 ALL DONE!' AS result;
SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' AS separator;
SELECT '💡 NEXT: Login as customer@demo.com' AS step_1;
SELECT '   → Go to Tracking tab' AS info_1;
SELECT '   → See 10 bookings with filters!' AS info_2;
SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' AS separator;
SELECT '💡 NEXT: Login as admin@demo.com (incognito)' AS step_2;
SELECT '   → Dashboard shows all bookings real-time!' AS info_3;
SELECT '   → Approve pending → Customer sees real-time!' AS info_4;
SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' AS separator;
