-- ============================================================================
-- FIX ADMIN ROUTING - Admin masuk ke Customer Dashboard
-- ============================================================================
-- Problem: Admin login tapi masuk ke Customer Dashboard instead of Admin Dashboard
-- Root Cause: Profile role di database salah atau tidak sync dengan user metadata
-- ============================================================================

-- STEP 1: Check current user roles in auth.users
SELECT 
  '📋 STEP 1: Users in auth.users' AS info,
  email,
  raw_user_meta_data->>'role' AS metadata_role,
  raw_user_meta_data->>'full_name' AS metadata_name,
  created_at
FROM auth.users
ORDER BY created_at DESC;

-- STEP 2: Check current profiles in profiles table
SELECT 
  '📋 STEP 2: Profiles in profiles table' AS info,
  email,
  role AS profile_role,
  full_name,
  created_at
FROM public.profiles
ORDER BY created_at DESC;

-- STEP 3: Compare roles between auth.users and profiles
SELECT 
  '🔍 STEP 3: Role Comparison' AS info,
  u.email,
  u.raw_user_meta_data->>'role' AS auth_metadata_role,
  p.role AS profile_table_role,
  CASE 
    WHEN p.id IS NULL THEN '❌ PROFILE MISSING'
    WHEN p.role != u.raw_user_meta_data->>'role' THEN '⚠️ ROLE MISMATCH!'
    ELSE '✅ OK'
  END AS status
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
ORDER BY u.created_at DESC;

-- ============================================================================
-- FIX 1: Create missing profiles (if any)
-- ============================================================================

INSERT INTO public.profiles (id, email, full_name, role)
SELECT 
  u.id,
  u.email,
  COALESCE(u.raw_user_meta_data->>'full_name', 'User') AS full_name,
  COALESCE(u.raw_user_meta_data->>'role', 'customer') AS role
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE p.id IS NULL
ON CONFLICT (id) DO NOTHING;

SELECT '✅ Missing profiles created' AS result;

-- ============================================================================
-- FIX 2: Update profile roles to match user metadata
-- ============================================================================

UPDATE public.profiles p
SET 
  role = COALESCE(u.raw_user_meta_data->>'role', 'customer'),
  full_name = COALESCE(u.raw_user_meta_data->>'full_name', p.full_name),
  updated_at = NOW()
FROM auth.users u
WHERE p.id = u.id
  AND (
    p.role != COALESCE(u.raw_user_meta_data->>'role', 'customer')
    OR p.full_name != COALESCE(u.raw_user_meta_data->>'full_name', p.full_name)
  );

SELECT '✅ Profile roles synced with auth metadata' AS result;

-- ============================================================================
-- FIX 3: Explicitly ensure admin users have admin role
-- ============================================================================

-- Update admin@demo.com to be admin
UPDATE public.profiles
SET role = 'admin', full_name = 'Admin Sunest', updated_at = NOW()
WHERE email LIKE '%admin%'
  OR email = 'admin@demo.com'
  OR email = 'admin@sunest.com';

SELECT '✅ Admin users set to admin role' AS result;

-- Update customer@demo.com to be customer
UPDATE public.profiles
SET role = 'customer', full_name = 'John Customer', updated_at = NOW()
WHERE email LIKE '%customer%'
  OR email = 'customer@demo.com';

SELECT '✅ Customer users set to customer role' AS result;

-- ============================================================================
-- VERIFICATION: Check final state
-- ============================================================================

SELECT 
  '🎯 FINAL VERIFICATION' AS info,
  u.email,
  u.raw_user_meta_data->>'role' AS auth_metadata,
  p.role AS profile_role,
  p.full_name,
  CASE 
    WHEN p.id IS NULL THEN '❌ MISSING PROFILE'
    WHEN p.role != u.raw_user_meta_data->>'role' THEN '⚠️ MISMATCH'
    WHEN p.role = 'admin' THEN '✅ ADMIN - Should go to Admin Dashboard'
    WHEN p.role = 'customer' THEN '✅ CUSTOMER - Should go to Customer Dashboard'
    ELSE '✅ OK'
  END AS status
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
ORDER BY u.created_at DESC;

-- ============================================================================
-- ✅ DONE! Now test login:
-- ============================================================================
-- 1. Hard refresh browser (Ctrl+Shift+R)
-- 2. Logout if logged in
-- 3. Login as admin@demo.com → Should go to ADMIN DASHBOARD
-- 4. Logout
-- 5. Login as customer@demo.com → Should go to CUSTOMER DASHBOARD
-- ============================================================================

SELECT '🎉 All fixes applied! Check console logs after login.' AS final_message;
