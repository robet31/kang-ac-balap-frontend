-- ============================================================================
-- DEBUG ADMIN LOGIN ISSUE
-- ============================================================================
-- Run this to check and fix admin login problems
-- ============================================================================

-- STEP 1: Check if users exist
SELECT 
  'USERS IN AUTH TABLE:' AS info,
  id,
  email,
  raw_user_meta_data->>'role' AS metadata_role,
  raw_user_meta_data->>'full_name' AS metadata_name,
  created_at
FROM auth.users
ORDER BY created_at DESC;

-- STEP 2: Check if profiles exist
SELECT 
  'PROFILES IN PROFILES TABLE:' AS info,
  id,
  email,
  full_name,
  role,
  created_at
FROM public.profiles
ORDER BY created_at DESC;

-- STEP 3: Check for missing profiles
SELECT 
  'USERS WITHOUT PROFILES:' AS info,
  u.id,
  u.email,
  u.raw_user_meta_data->>'role' AS should_be_role
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE p.id IS NULL;

-- ============================================================================
-- FIX: Manually create profiles for users without profiles
-- ============================================================================

-- This will create profiles for any auth.users that don't have profiles yet
INSERT INTO public.profiles (id, email, full_name, role)
SELECT 
  u.id,
  u.email,
  COALESCE(u.raw_user_meta_data->>'full_name', 'User'),
  COALESCE(u.raw_user_meta_data->>'role', 'customer')
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE p.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- FIX: Update existing profiles with correct role from metadata
-- ============================================================================

-- This ensures profiles have the same role as user_metadata
UPDATE public.profiles p
SET 
  role = COALESCE(u.raw_user_meta_data->>'role', 'customer'),
  full_name = COALESCE(u.raw_user_meta_data->>'full_name', p.full_name)
FROM auth.users u
WHERE p.id = u.id
  AND (
    p.role != COALESCE(u.raw_user_meta_data->>'role', 'customer')
    OR p.full_name != COALESCE(u.raw_user_meta_data->>'full_name', p.full_name)
  );

-- ============================================================================
-- VERIFY: Check again after fixes
-- ============================================================================

SELECT 
  'FINAL CHECK - ALL USERS WITH PROFILES:' AS info,
  u.email,
  u.raw_user_meta_data->>'role' AS metadata_role,
  p.role AS profile_role,
  p.full_name,
  CASE 
    WHEN p.id IS NULL THEN '❌ MISSING PROFILE'
    WHEN p.role != u.raw_user_meta_data->>'role' THEN '⚠️ ROLE MISMATCH'
    ELSE '✅ OK'
  END AS status
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
ORDER BY u.created_at DESC;

-- ============================================================================
-- ✅ DONE!
-- ============================================================================

SELECT '✅ Admin login debug & fix complete!' AS result;
