-- ============================================
-- CREATE DEMO USERS FOR MOTOCARE PRO
-- ============================================
-- Run this AFTER running migration.sql
-- This creates 3 demo users for testing

-- 1. CREATE ADMIN USER
-- Email: admin@demo.com
-- Password: password123
DO $$
DECLARE
  admin_user_id UUID;
BEGIN
  -- Insert into auth.users
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    recovery_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'admin@demo.com',
    crypt('password123', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Admin MotoCare","role":"admin"}',
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
  )
  RETURNING id INTO admin_user_id;

  -- Profile will be auto-created by trigger
  RAISE NOTICE 'Admin user created with ID: %', admin_user_id;
END $$;

-- 2. CREATE TECHNICIAN USER
-- Email: tech@demo.com
-- Password: password123
DO $$
DECLARE
  tech_user_id UUID;
BEGIN
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    recovery_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'tech@demo.com',
    crypt('password123', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Ari Wijaya","role":"technician"}',
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
  )
  RETURNING id INTO tech_user_id;

  RAISE NOTICE 'Technician user created with ID: %', tech_user_id;
END $$;

-- 3. CREATE CUSTOMER USER
-- Email: customer@demo.com
-- Password: password123
DO $$
DECLARE
  customer_user_id UUID;
BEGIN
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    recovery_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'customer@demo.com',
    crypt('password123', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Cahya Pradipta","role":"customer"}',
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
  )
  RETURNING id INTO customer_user_id;

  RAISE NOTICE 'Customer user created with ID: %', customer_user_id;
END $$;

-- Verify users were created
SELECT 
  au.email,
  p.full_name,
  p.role,
  au.created_at
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
WHERE au.email IN ('admin@demo.com', 'tech@demo.com', 'customer@demo.com')
ORDER BY p.role;

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Demo users created successfully!';
  RAISE NOTICE 'Login with:';
  RAISE NOTICE '  admin@demo.com / password123';
  RAISE NOTICE '  tech@demo.com / password123';
  RAISE NOTICE '  customer@demo.com / password123';
END $$;
