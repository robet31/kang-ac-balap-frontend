-- ============================================================================
-- TRACKING 10 DUMMY DATA - FIXED VERSION with Vehicle IDs
-- ============================================================================
-- Creates 10 bookings with proper vehicle references
-- Real-time sync to customer tracking and admin dashboard!
-- ============================================================================

-- Prerequisites check
DO $$
DECLARE
  customer_user_id UUID;
  vehicle_count INT;
BEGIN
  -- Get customer from auth.users
  SELECT id INTO customer_user_id FROM auth.users WHERE email = 'customer@demo.com' LIMIT 1;
  
  IF customer_user_id IS NULL THEN
    RAISE EXCEPTION '❌ Customer user not found! Please login as customer@demo.com first.';
  END IF;

  -- Check if customer has vehicles
  SELECT COUNT(*) INTO vehicle_count FROM public.vehicles WHERE customer_id = customer_user_id;
  
  IF vehicle_count = 0 THEN
    RAISE EXCEPTION '❌ Customer has no vehicles! Please add vehicles first or run vehicle creation SQL.';
  END IF;

  -- Store in temp table
  CREATE TEMP TABLE IF NOT EXISTS temp_tracking_setup (customer_id UUID, vehicle_count INT);
  DELETE FROM temp_tracking_setup;
  INSERT INTO temp_tracking_setup VALUES (customer_user_id, vehicle_count);
  
  RAISE NOTICE '✅ Customer ID: %', customer_user_id;
  RAISE NOTICE '✅ Customer has % vehicles', vehicle_count;
END $$;

-- ============================================================================
-- CREATE 10 TRACKING BOOKINGS WITH VEHICLE IDs
-- ============================================================================

DO $$
DECLARE
  v_customer_id UUID;
  v_vehicle1_id UUID;
  v_vehicle2_id UUID;
  v_vehicle3_id UUID;
BEGIN
  -- Get customer ID
  SELECT customer_id INTO v_customer_id FROM temp_tracking_setup;
  
  -- Get first 3 vehicles (or reuse if customer has fewer)
  SELECT id INTO v_vehicle1_id FROM public.vehicles WHERE customer_id = v_customer_id LIMIT 1 OFFSET 0;
  SELECT id INTO v_vehicle2_id FROM public.vehicles WHERE customer_id = v_customer_id LIMIT 1 OFFSET 1;
  SELECT id INTO v_vehicle3_id FROM public.vehicles WHERE customer_id = v_customer_id LIMIT 1 OFFSET 2;
  
  -- If customer only has 1 or 2 vehicles, reuse them
  IF v_vehicle2_id IS NULL THEN v_vehicle2_id := v_vehicle1_id; END IF;
  IF v_vehicle3_id IS NULL THEN v_vehicle3_id := v_vehicle1_id; END IF;
  
  RAISE NOTICE '📌 Using vehicle IDs: %, %, %', v_vehicle1_id, v_vehicle2_id, v_vehicle3_id;
  
  -- Clear existing tracking demo data
  DELETE FROM public.jobs WHERE job_number LIKE 'TRACK-%';
  
  -- ========== MENUNGGU (3 jobs) ==========
  
  -- 1. Menunggu - Just created (1 min ago) - Vehicle 1
  INSERT INTO public.jobs (
    id, user_id, vehicle_id, job_number, service_type, description, 
    status, amount, created_at
  ) VALUES (
    gen_random_uuid(), v_customer_id, v_vehicle1_id, 'TRACK-001', 
    'Service Rutin', 'Ganti oli mesin + filter + cek rem',
    'pending', 250000, NOW() - INTERVAL '1 minute'
  );
  
  -- 2. Menunggu - Created 5 mins ago - Vehicle 2
  INSERT INTO public.jobs (
    id, user_id, vehicle_id, job_number, service_type, description,
    status, amount, created_at
  ) VALUES (
    gen_random_uuid(), v_customer_id, v_vehicle2_id, 'TRACK-002',
    'Perbaikan', 'CVT bermasalah + ganti vanbelt',
    'pending', 800000, NOW() - INTERVAL '5 minutes'
  );
  
  -- 3. Menunggu - Created 10 mins ago - Vehicle 3
  INSERT INTO public.jobs (
    id, user_id, vehicle_id, job_number, service_type, description,
    status, amount, created_at
  ) VALUES (
    gen_random_uuid(), v_customer_id, v_vehicle3_id, 'TRACK-003',
    'Tune Up', 'Tune up lengkap + carbon clean',
    'pending', 450000, NOW() - INTERVAL '10 minutes'
  );
  
  -- ========== DIJADWALKAN (2 jobs) ==========
  
  -- 4. Dijadwalkan - Tomorrow - Vehicle 1
  INSERT INTO public.jobs (
    id, user_id, vehicle_id, job_number, service_type, description,
    status, scheduled_date, amount, created_at, updated_at
  ) VALUES (
    gen_random_uuid(), v_customer_id, v_vehicle1_id, 'TRACK-004',
    'Service Berkala', 'Service 10.000 KM',
    'scheduled', CURRENT_DATE + INTERVAL '1 day', 
    350000, NOW() - INTERVAL '2 hours', NOW() - INTERVAL '1 hour'
  );
  
  -- 5. Dijadwalkan - Day after tomorrow - Vehicle 2
  INSERT INTO public.jobs (
    id, user_id, vehicle_id, job_number, service_type, description,
    status, scheduled_date, amount, created_at, updated_at
  ) VALUES (
    gen_random_uuid(), v_customer_id, v_vehicle2_id, 'TRACK-005',
    'Ganti Sparepart', 'Ganti kampas rem depan + belakang',
    'scheduled', CURRENT_DATE + INTERVAL '2 days',
    320000, NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'
  );
  
  -- ========== SEDANG DIPERBAIKI (3 jobs) ==========
  
  -- 6. Sedang Diperbaiki - 45% progress - Vehicle 3
  INSERT INTO public.jobs (
    id, user_id, vehicle_id, job_number, service_type, description,
    status, scheduled_date, amount, progress, created_at, updated_at
  ) VALUES (
    gen_random_uuid(), v_customer_id, v_vehicle3_id, 'TRACK-006',
    'Service Premium', 'Service besar + ganti oli + tune up',
    'in_progress', CURRENT_DATE,
    550000, 45, NOW() - INTERVAL '5 hours', NOW() - INTERVAL '1 hour'
  );
  
  -- 7. Sedang Diperbaiki - 70% progress - Vehicle 1
  INSERT INTO public.jobs (
    id, user_id, vehicle_id, job_number, service_type, description,
    status, scheduled_date, amount, progress, created_at, updated_at
  ) VALUES (
    gen_random_uuid(), v_customer_id, v_vehicle1_id, 'TRACK-007',
    'Perbaikan Mesin', 'Overhaul mesin + setel klep',
    'in_progress', CURRENT_DATE,
    1200000, 70, NOW() - INTERVAL '3 hours', NOW() - INTERVAL '30 minutes'
  );
  
  -- 8. Sedang Diperbaiki - 25% progress - Vehicle 2
  INSERT INTO public.jobs (
    id, user_id, vehicle_id, job_number, service_type, description,
    status, scheduled_date, amount, progress, created_at, updated_at
  ) VALUES (
    gen_random_uuid(), v_customer_id, v_vehicle2_id, 'TRACK-008',
    'Service Rutin', 'Ganti oli + cek sistem kelistrikan',
    'in_progress', CURRENT_DATE,
    300000, 25, NOW() - INTERVAL '2 hours', NOW() - INTERVAL '15 minutes'
  );
  
  -- ========== SELESAI (2 jobs) ==========
  
  -- 9. Selesai - Yesterday - Vehicle 3
  INSERT INTO public.jobs (
    id, user_id, vehicle_id, job_number, service_type, description,
    status, scheduled_date, completed_date, amount, progress, created_at, updated_at
  ) VALUES (
    gen_random_uuid(), v_customer_id, v_vehicle3_id, 'TRACK-009',
    'Service Berkala', 'Service 5.000 KM + ganti oli',
    'completed', CURRENT_DATE - INTERVAL '1 day', CURRENT_DATE - INTERVAL '1 day',
    280000, 100, NOW() - INTERVAL '2 days', CURRENT_DATE - INTERVAL '1 day'
  );
  
  -- 10. Selesai - 3 days ago - Vehicle 1
  INSERT INTO public.jobs (
    id, user_id, vehicle_id, job_number, service_type, description,
    status, scheduled_date, completed_date, amount, progress, created_at, updated_at
  ) VALUES (
    gen_random_uuid(), v_customer_id, v_vehicle1_id, 'TRACK-010',
    'Perbaikan', 'Ganti CDI + koil + busi',
    'completed', CURRENT_DATE - INTERVAL '3 days', CURRENT_DATE - INTERVAL '3 days',
    650000, 100, NOW() - INTERVAL '4 days', CURRENT_DATE - INTERVAL '3 days'
  );
  
  RAISE NOTICE '✅ 10 tracking jobs created successfully with vehicle IDs!';
END $$;

-- ============================================================================
-- VERIFICATION WITH VEHICLE INFO
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
SELECT '📋 JOB DETAILS WITH VEHICLES' AS title;
SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' AS separator;

SELECT 
  j.job_number AS "Job #",
  CASE 
    WHEN j.status = 'pending' THEN '⏳ Menunggu'
    WHEN j.status = 'scheduled' THEN '📅 Dijadwalkan'
    WHEN j.status = 'in_progress' THEN '🔧 Sedang Diperbaiki'
    WHEN j.status = 'completed' THEN '✅ Selesai'
    ELSE j.status
  END AS "Status",
  j.service_type AS "Service Type",
  v.brand || ' ' || v.model AS "Vehicle",
  v.plate_number AS "Plate",
  COALESCE(j.progress, 0) || '%' AS "Progress",
  'Rp ' || TO_CHAR(j.amount, 'FM999,999,999') AS "Amount"
FROM public.jobs j
LEFT JOIN public.vehicles v ON j.vehicle_id = v.id
WHERE j.job_number LIKE 'TRACK-%'
ORDER BY j.created_at DESC;

SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' AS separator;
SELECT '🎉 ALL DONE!' AS result;
SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' AS separator;
SELECT '💡 NEXT STEPS:' AS step;
SELECT '   1. Refresh customer dashboard (auto-refresh 5s)' AS info_1;
SELECT '   2. Go to Tracking tab → See 10 bookings!' AS info_2;
SELECT '   3. Try filters: Menunggu (3), Dijadwalkan (2), etc.' AS info_3;
SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' AS separator;
SELECT '🔥 ADMIN REAL-TIME TEST:' AS admin_test;
SELECT '   1. Open incognito → Login as admin@demo.com' AS admin_1;
SELECT '   2. See all 10 bookings in dashboard!' AS admin_2;
SELECT '   3. Approve pending → Customer sees real-time!' AS admin_3;
SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' AS separator;
