# 🔧 Setup Admin Account - Sunest Auto

## ⚠️ PENTING: Buat Admin User Terlebih Dahulu!

Karena Anda menggunakan database baru (**sunest-auto-new**, ID: `tvugghippwvoxsjqyxkr`), Anda perlu membuat admin user terlebih dahulu.

---

## 🚀 Quick Setup (2 Langkah)

### **Langkah 1: Buka SQL Editor di Supabase**

1. Buka dashboard Supabase: https://supabase.com/dashboard/project/tvugghippwvoxsjqyxkr
2. Klik menu **"SQL Editor"** di sidebar kiri
3. Klik **"New query"**

---

### **Langkah 2: Copy & Paste SQL Berikut**

```sql
-- ========================================
-- CREATE ADMIN USER FOR SUNEST AUTO
-- ========================================

-- 1. Create admin auth user with email & password
-- Password: admin123 (GANTI SETELAH LOGIN PERTAMA!)
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  aud,
  role
)
VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'admin@sunest.com',
  crypt('admin123', gen_salt('bf')), -- Password: admin123
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Admin Sunest Auto","phone":"081234567890"}',
  'authenticated',
  'authenticated'
)
ON CONFLICT (email) DO NOTHING;

-- 2. Get the user ID we just created
DO $$
DECLARE
  admin_user_id uuid;
BEGIN
  -- Get the admin user ID
  SELECT id INTO admin_user_id
  FROM auth.users
  WHERE email = 'admin@sunest.com'
  LIMIT 1;

  -- 3. Create profile with admin role
  INSERT INTO public.profiles (
    id,
    email,
    full_name,
    phone,
    role,
    created_at,
    updated_at
  )
  VALUES (
    admin_user_id,
    'admin@sunest.com',
    'Admin Sunest Auto',
    '081234567890',
    'admin',
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE
  SET role = 'admin';
  
  RAISE NOTICE 'Admin user created successfully with ID: %', admin_user_id;
END $$;

-- 4. Verify the admin was created
SELECT 
  u.id,
  u.email,
  u.email_confirmed_at,
  p.full_name,
  p.role
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE u.email = 'admin@sunest.com';
```

---

## 📋 Credentials Login

Setelah run SQL di atas, gunakan credentials ini untuk login:

```
Email: admin@sunest.com
Password: admin123
```

⚠️ **PENTING:** Ganti password setelah login pertama melalui menu Settings!

---

## ✅ Verifikasi Setup

Setelah run SQL:

1. **Cek output query** - Harus muncul 1 row dengan:
   - ✅ email: `admin@sunest.com`
   - ✅ role: `admin`
   - ✅ email_confirmed_at: (timestamp)

2. **Test Login:**
   - Buka aplikasi Sunest Auto
   - Klik **"Masuk"** atau **"Admin Login"**
   - Input email & password
   - Harus redirect ke Admin Dashboard

---

## 🔄 Alternative: Create via Supabase UI

Jika SQL tidak work, bisa manual:

1. **Buka Authentication** → **Users** → **Add user**
2. **Email:** `admin@sunest.com`
3. **Password:** `admin123`
4. **Auto Confirm User:** ✅ (CENTANG INI!)
5. **User metadata:**
   ```json
   {
     "full_name": "Admin Sunest Auto",
     "phone": "081234567890"
   }
   ```

6. **Setelah create user**, buka **Table Editor** → **profiles**
7. **Insert row:**
   - `id`: (copy dari auth.users ID)
   - `email`: `admin@sunest.com`
   - `full_name`: `Admin Sunest Auto`
   - `phone`: `081234567890`
   - `role`: `admin` ⭐ **PENTING!**

---

## 🆘 Troubleshooting

### Error: "Invalid login credentials"
**Solusi:**
- Pastikan SQL sudah dijalankan
- Cek di **Authentication → Users** - harus ada user `admin@sunest.com`
- Cek **email_confirmed_at** tidak null
- Password: `admin123` (case sensitive!)

### Error: "Email not confirmed"
**Solusi:**
- Run query ini:
  ```sql
  UPDATE auth.users
  SET email_confirmed_at = NOW()
  WHERE email = 'admin@sunest.com';
  ```

### User exist tapi role bukan admin
**Solusi:**
- Run query ini:
  ```sql
  UPDATE public.profiles
  SET role = 'admin'
  WHERE email = 'admin@sunest.com';
  ```

---

## 🎯 Next Steps

Setelah berhasil login sebagai admin:

1. ✅ Ganti password di menu **Settings**
2. ✅ Update profile info (nama, phone)
3. ✅ Mulai kelola booking, inventory, dan teknisi
4. ✅ Tambah teknisi baru jika diperlukan

---

## 📞 Support

Jika masih ada masalah, cek:
- Console browser (F12) untuk error details
- Supabase logs: Dashboard → Logs → Auth logs
- Database tables: `auth.users` dan `public.profiles`

**Happy managing! 🚀**
