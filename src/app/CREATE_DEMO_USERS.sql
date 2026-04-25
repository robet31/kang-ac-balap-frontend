-- 🔥 CREATE DEMO USERS FOR TESTING
-- Run this SQL in Supabase SQL Editor to create demo users

-- ============================================
-- STEP 1: Create Demo Users in Auth
-- ============================================
-- NOTE: This requires Service Role Key access
-- You need to do this manually in Supabase Dashboard:
-- 1. Go to Authentication > Users
-- 2. Click "Add User"
-- 3. Create these users:

/*
ADMIN USER:
- Email: admin@demo.com
- Password: password123
- Auto Confirm Email: YES

CUSTOMER USER:
- Email: customer@demo.com
- Password: password123
- Auto Confirm Email: YES
*/

-- ============================================
-- STEP 2: After users created, add profiles
-- ============================================

-- IMPORTANT: Replace 'USER_ID_HERE' with actual user IDs from auth.users table

-- Check existing users first
SELECT id, email FROM auth.users WHERE email IN ('admin@demo.com', 'customer@demo.com');

-- ============================================
-- INSERT ADMIN PROFILE
-- ============================================
-- First, get the admin user ID:
-- SELECT id FROM auth.users WHERE email = 'admin@demo.com';

INSERT INTO profiles (id, full_name, phone, role, avatar_url)
VALUES (
  (SELECT id FROM auth.users WHERE email = 'admin@demo.com'),
  'Admin Demo',
  '+62 812-1234-5678',
  'admin',
  NULL
)
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  role = EXCLUDED.role,
  avatar_url = EXCLUDED.avatar_url;

-- ============================================
-- INSERT CUSTOMER PROFILE
-- ============================================
-- First, get the customer user ID:
-- SELECT id FROM auth.users WHERE email = 'customer@demo.com';

INSERT INTO profiles (id, full_name, phone, role, avatar_url)
VALUES (
  (SELECT id FROM auth.users WHERE email = 'customer@demo.com'),
  'Customer Demo',
  '+62 812-9876-5432',
  'customer',
  NULL
)
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  role = EXCLUDED.role,
  avatar_url = EXCLUDED.avatar_url;

-- ============================================
-- VERIFY PROFILES CREATED
-- ============================================
SELECT 
  p.id,
  p.full_name,
  p.role,
  p.phone,
  u.email
FROM profiles p
JOIN auth.users u ON p.id = u.id
WHERE u.email IN ('admin@demo.com', 'customer@demo.com');

-- ============================================
-- EXPECTED OUTPUT:
-- ============================================
/*
id                                   | full_name      | role     | phone              | email
-------------------------------------|----------------|----------|--------------------|-----------------
xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx | Admin Demo     | admin    | +62 812-1234-5678  | admin@demo.com
xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx | Customer Demo  | customer | +62 812-9876-5432  | customer@demo.com
*/

-- ✅ If you see 2 rows with admin and customer roles, you're good to go!

-- ============================================
-- TROUBLESHOOTING
-- ============================================

-- If profiles not created, check if trigger exists:
SELECT 
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

-- If trigger doesn't exist, create it:
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', 'New User'),
    COALESCE(new.raw_user_meta_data->>'role', 'customer')
  );
  RETURN new;
END;
$$;

-- Create trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- MANUAL PROFILE FIX (if needed)
-- ============================================

-- If profiles exist but role is wrong, update them:
UPDATE profiles 
SET role = 'admin', full_name = 'Admin Demo', phone = '+62 812-1234-5678'
WHERE id = (SELECT id FROM auth.users WHERE email = 'admin@demo.com');

UPDATE profiles 
SET role = 'customer', full_name = 'Customer Demo', phone = '+62 812-9876-5432'
WHERE id = (SELECT id FROM auth.users WHERE email = 'customer@demo.com');

-- ============================================
-- DELETE USERS (if you need to start fresh)
-- ============================================

-- WARNING: This will delete all data!

-- Delete profiles first
DELETE FROM profiles WHERE id IN (
  SELECT id FROM auth.users WHERE email IN ('admin@demo.com', 'customer@demo.com')
);

-- Then delete auth users (requires Service Role)
-- You need to do this in Supabase Dashboard:
-- 1. Go to Authentication > Users
-- 2. Find admin@demo.com and customer@demo.com
-- 3. Click "..." menu and "Delete user"
