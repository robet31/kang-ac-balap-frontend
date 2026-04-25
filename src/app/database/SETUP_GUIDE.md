# 🔧 Setup Guide: Integrasi Database & Authentication Supabase

## 📋 Prerequisites

Sebelum memulai, pastikan Anda memiliki:
- ✅ Akun Supabase (https://supabase.com)
- ✅ Project ID: `ltscqsrghbdqhcoxqhfb`
- ✅ Anon Public Key (sudah dikonfigurasi)

---

## 🚀 Langkah 1: Setup Database Schema

### 1.1 Buka Supabase SQL Editor

1. Login ke dashboard Supabase: https://supabase.com/dashboard
2. Pilih project: **ltscqsrghbdqhcoxqhfb**
3. Navigasi ke: **SQL Editor** (di sidebar kiri)

### 1.2 Run Migration Script

1. Buka file `/database/migration.sql` dari project ini
2. Copy semua isi file tersebut
3. Paste ke SQL Editor di Supabase
4. Klik **Run** atau tekan `Ctrl + Enter`

### 1.3 Verifikasi Instalasi

Setelah migration berhasil, Anda harus melihat table berikut di **Table Editor**:

✅ Tables Created:
- `profiles` - User profiles dengan role (customer, technician, admin)
- `services` - Master data layanan bengkel
- `vehicles` - Kendaraan pelanggan
- `job_orders` - Order servis (core table)
- `inventory` - Inventory parts dan stock
- `job_parts` - Junction table antara job dan parts
- `job_updates` - Timeline updates untuk setiap job

---

## 🔐 Langkah 2: Konfigurasi Authentication

### 2.1 Enable Email Authentication

1. Di Supabase Dashboard, navigasi ke: **Authentication > Providers**
2. Pastikan **Email** provider sudah enabled
3. **PENTING**: Karena ini development environment, disable email confirmation:
   - Pergi ke **Authentication > Settings**
   - Cari setting **"Enable email confirmations"**
   - **UNCHECK** (disable) untuk development
   - Klik **Save**

> ⚠️ **Note**: Di production, Anda harus enable email confirmation dan setup SMTP server

### 2.2 Row Level Security (RLS)

RLS policies sudah otomatis dibuat oleh migration script. Verifikasi dengan:

1. Pergi ke **Table Editor**
2. Pilih table `profiles`
3. Klik **RLS policies** tab
4. Pastikan policies berikut ada:
   - "Public profiles are viewable by everyone"
   - "Users can update own profile"

Ulangi untuk table lain (`job_orders`, `vehicles`, `inventory`, dll)

---

## 🎯 Langkah 3: Create Demo Users

### 3.1 Manual User Creation (Recommended untuk Development)

Run SQL command berikut di SQL Editor untuk create demo users:

```sql
-- Create demo admin user
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@demo.com',
  crypt('password123', gen_salt('bf')),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Admin Demo","role":"admin"}',
  NOW(),
  NOW(),
  '',
  ''
);

-- Create demo technician user
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'tech@demo.com',
  crypt('password123', gen_salt('bf')),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Ari Wijaya","role":"technician"}',
  NOW(),
  NOW(),
  '',
  ''
);

-- Create demo customer user
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'customer@demo.com',
  crypt('password123', gen_salt('bf')),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Cahya Pradipta","role":"customer"}',
  NOW(),
  NOW(),
  '',
  ''
);
```

### 3.2 Verify Demo Users

Check di **Authentication > Users** untuk memastikan 3 demo users sudah tercreat:
- ✅ admin@demo.com (role: admin)
- ✅ tech@demo.com (role: technician)
- ✅ customer@demo.com (role: customer)

---

## 🧪 Langkah 4: Testing Authentication

### 4.1 Test Login

1. Refresh aplikasi MotoCare Pro
2. Klik tombol **"Masuk"** di navbar
3. Login dengan salah satu demo account:
   - Email: `admin@demo.com`
   - Password: `password123`

### 4.2 Test Signup (Optional)

1. Klik tombol **"Daftar Gratis"**
2. Isi form registrasi
3. Pilih role: Customer atau Technician
4. Submit form
5. Setelah berhasil, akan auto-switch ke login tab

---

## 📊 Langkah 5: Seed Sample Data

### 5.1 Using Seed Button

1. Setelah login sebagai **admin**, klik tombol **"Seed Demo Data"** di bottom navigation bar
2. Wait for toast notification: "Demo data berhasil di-seed ke database!"

### 5.2 Verify Data

Check di Supabase **Table Editor**:

✅ `services` table harus ada 5 rows (Basic Tune-Up, Premium Service, dll)
✅ `inventory` table harus ada 8 rows (parts dengan berbagai stock levels)
✅ `job_orders` table harus ada sample job orders
✅ `vehicles` table harus ada sample vehicles

---

## 🔄 Langkah 6: Update Supabase Edge Function (Optional)

Jika Anda ingin menggunakan real Supabase tables instead of KV store:

### 6.1 Update Server Code

File `/supabase/functions/server/index.tsx` saat ini menggunakan KV store. Untuk production, update ke:

```typescript
// Instead of:
const jobs = await kv.getByPrefix("job:");

// Use direct Supabase queries:
const supabase = getSupabaseClient();
const { data: jobs, error } = await supabase
  .from('job_orders')
  .select('*')
  .order('created_at', { ascending: false });
```

Contoh lengkap ada di file `/database/supabase-api-example.tsx` (akan dibuat)

---

## 🛡️ Security Checklist

### Development Environment (Current)

- [x] RLS policies enabled
- [x] Email confirmation disabled
- [x] Demo users dengan known passwords
- [ ] Rate limiting (not implemented)
- [ ] API key rotation (not implemented)

### Before Production Deployment

- [ ] Enable email confirmation
- [ ] Setup proper SMTP server (Resend, SendGrid, etc.)
- [ ] Implement rate limiting
- [ ] Remove demo users
- [ ] Enable 2FA for admin accounts
- [ ] Review and tighten RLS policies
- [ ] Setup database backups
- [ ] Configure CORS properly
- [ ] Use environment variables for all secrets

---

## 🐛 Troubleshooting

### Problem: "JWT expired" error

**Solution**: User session expired. Logout and login again.

### Problem: "RLS policy violation"

**Solution**: 
1. Check if RLS policies are correctly set in Table Editor
2. Verify user's role in `profiles` table
3. Re-run migration script if needed

### Problem: Demo users tidak bisa login

**Solution**:
1. Verify users exist di **Authentication > Users**
2. Check email confirmation is disabled
3. Re-create users menggunakan SQL script di Step 3.1

### Problem: "Failed to fetch" saat call API

**Solution**:
1. Check Supabase project is running
2. Verify anon key di `/utils/supabase/info.tsx`
3. Check browser console for CORS errors

---

## 📞 Support

Jika mengalami masalah:
1. Check Supabase logs: **Logs > API**
2. Check browser console untuk error messages
3. Verify semua migration steps sudah dilakukan

---

## 🎉 Next Steps

Setelah setup berhasil:

1. ✅ Login dengan demo account
2. ✅ Explore Customer Dashboard (tracking, vehicles, history)
3. ✅ Test Technician App (job management, parts)
4. ✅ Test Admin Dashboard (KPIs, inventory, finance)
5. ⏭️ Customize branding dan colors
6. ⏭️ Add real service packages
7. ⏭️ Configure payment gateway (Midtrans)
8. ⏭️ Setup email notifications

---

**Selamat! Database dan Authentication Supabase sudah terintegrasi! 🚀**
