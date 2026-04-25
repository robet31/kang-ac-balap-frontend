# 🚀 SETUP DATABASE - STEP BY STEP (5 Menit)

## ❗ PENTING: Error "Invalid login credentials" berarti database belum di-setup!

Ikuti langkah-langkah di bawah ini dengan **TELITI**:

---

## 📋 Checklist Setup

- [ ] Step 1: Buka Supabase Dashboard
- [ ] Step 2: Disable Email Confirmation
- [ ] Step 3: Run Migration SQL
- [ ] Step 4: Verify Tables Created
- [ ] Step 5: Create Demo Users
- [ ] Step 6: Test Login

---

## STEP 1: Buka Supabase Dashboard

1. Buka browser, pergi ke: **https://supabase.com/dashboard**
2. Login dengan akun Supabase Anda
3. Pilih project: **ltscqsrghbdqhcoxqhfb**
4. Tunggu sampai project dashboard terbuka

✅ **Checkpoint**: Anda harus melihat sidebar dengan menu "Table Editor", "SQL Editor", dll.

---

## STEP 2: Disable Email Confirmation (CRITICAL!)

**Ini SANGAT PENTING untuk development environment!**

### 2.1 Buka Settings
1. Di sidebar kiri, klik **"Authentication"**
2. Pilih tab **"Providers"**
3. Scroll ke bawah, cari section **"Email"**

### 2.2 Disable Confirmation
1. Klik pada **"Email"** provider untuk expand settings
2. Scroll ke bawah sampai ketemu setting:
   - **"Enable email confirmations"** atau **"Confirm email"**
3. **UNCHECK** (disable) checkbox tersebut
4. Klik **"Save"** button di bagian bawah

### 2.3 Verify
- Setting "Confirm email" harus **OFF** / **DISABLED** (tidak ada checkmark)

✅ **Checkpoint**: Email confirmation sudah disabled

---

## STEP 3: Run Migration SQL

### 3.1 Buka SQL Editor
1. Di sidebar kiri, klik **"SQL Editor"**
2. Klik tombol **"New query"** (atau + icon)

### 3.2 Copy Migration Script
1. Di code editor Anda, buka file: **`/database/migration.sql`**
2. **Select ALL** text (Ctrl+A / Cmd+A)
3. **Copy** (Ctrl+C / Cmd+C)

### 3.3 Paste & Run
1. Kembali ke Supabase SQL Editor
2. **Paste** script di editor (Ctrl+V / Cmd+V)
3. Klik tombol **"Run"** (atau tekan Ctrl+Enter / Cmd+Enter)
4. **TUNGGU** sampai selesai (bisa 30 detik - 1 menit)

### 3.4 Check for Success
Di bagian bawah editor, Anda harus melihat:
- **Success** message (hijau)
- Atau **"Query executed successfully"**
- Atau hasil query yang menampilkan list tables

❌ **Jika error:**
- Baca error message dengan teliti
- Pastikan Anda copy SEMUA isi file migration.sql
- Coba run lagi

✅ **Checkpoint**: Migration script berhasil dijalankan tanpa error

---

## STEP 4: Verify Tables Created

### 4.1 Buka Table Editor
1. Di sidebar kiri, klik **"Table Editor"**
2. Anda harus melihat list tables di sidebar kiri

### 4.2 Check Tables
Pastikan tables berikut ADA:
- ✅ `profiles`
- ✅ `services`
- ✅ `vehicles`
- ✅ `job_orders`
- ✅ `inventory`
- ✅ `job_parts`
- ✅ `job_updates`

### 4.3 Check Sample Data
1. Klik table **`services`** di sidebar
2. Anda harus melihat **5 rows** (Basic Tune-Up, Premium Service, dll)
3. Klik table **`inventory`**
4. Anda harus melihat **8 rows** (Oli Mesin, Filter Oli, dll)

✅ **Checkpoint**: Semua tables ada dan services + inventory sudah ada data

---

## STEP 5: Create Demo Users

### 5.1 Kembali ke SQL Editor
1. Klik **"SQL Editor"** di sidebar
2. Klik **"New query"** untuk query baru

### 5.2 Copy Demo Users Script
1. Di code editor, buka file: **`/database/CREATE_DEMO_USERS.sql`**
2. **Select ALL** text (Ctrl+A / Cmd+A)
3. **Copy** (Ctrl+C / Cmd+C)

### 5.3 Paste & Run
1. Kembali ke Supabase SQL Editor
2. **Paste** script di editor
3. Klik **"Run"** (atau Ctrl+Enter / Cmd+Enter)
4. Tunggu sampai selesai

### 5.4 Check Success
Anda harus melihat message:
- "Admin user created with ID: ..."
- "Technician user created with ID: ..."
- "Customer user created with ID: ..."
- Table showing 3 users

✅ **Checkpoint**: Demo users created successfully

---

## STEP 6: Verify Users in Dashboard

### 6.1 Buka Authentication
1. Di sidebar, klik **"Authentication"**
2. Pastikan Anda di tab **"Users"** (default)

### 6.2 Check Users
Anda harus melihat **3 users**:
- ✅ admin@demo.com
- ✅ tech@demo.com
- ✅ customer@demo.com

### 6.3 Check User Details
1. Klik salah satu user (misal: admin@demo.com)
2. Anda harus melihat:
   - Email confirmed: ✅ (checkmark)
   - User metadata: `{"full_name":"...","role":"..."}`

✅ **Checkpoint**: 3 demo users ada di Authentication > Users

---

## STEP 7: Test Login! 🎉

### 7.1 Refresh Application
1. Kembali ke aplikasi MotoCare Pro
2. **Refresh page** (F5 atau Ctrl+R)

### 7.2 Open Login Modal
1. Klik tombol **"Masuk"** di navbar

### 7.3 Login with Admin
1. Email: `admin@demo.com`
2. Password: `password123`
3. Klik **"Login"** button

### 7.4 Verify Success
Jika berhasil:
- ✅ Modal akan close
- ✅ Toast notification: "Login berhasil!"
- ✅ Auto-redirect ke Admin Dashboard
- ✅ Navbar menampilkan nama Anda dan role badge

### 7.5 Test Other Accounts
Logout, lalu login dengan:
- **Technician**: tech@demo.com / password123
- **Customer**: customer@demo.com / password123

✅ **Checkpoint**: Login berhasil! 🎉

---

## 🐛 Troubleshooting

### Problem 1: "Invalid login credentials"
**Cause**: Users belum dibuat atau email confirmation masih enabled

**Solution**:
1. Check Step 2: Email confirmation harus DISABLED
2. Check Step 5: Run CREATE_DEMO_USERS.sql lagi
3. Verify di Authentication > Users ada 3 users

---

### Problem 2: "Email not confirmed"
**Cause**: Email confirmation masih enabled di Settings

**Solution**:
1. Pergi ke Authentication > Providers
2. Klik Email provider
3. **DISABLE** "Confirm email"
4. Save
5. Di SQL Editor, run:
```sql
UPDATE auth.users 
SET email_confirmed_at = NOW() 
WHERE email IN ('admin@demo.com', 'tech@demo.com', 'customer@demo.com');
```

---

### Problem 3: Tables tidak muncul di Table Editor
**Cause**: Migration script belum dijalankan atau error

**Solution**:
1. Kembali ke SQL Editor
2. Run migration.sql lagi
3. Baca error message jika ada
4. Pastikan tidak ada typo saat copy-paste

---

### Problem 4: "Failed to fetch" error
**Cause**: Supabase URL atau Anon Key salah

**Solution**:
1. Check file `/utils/supabase/info.tsx`
2. Verify:
   - projectId: `ltscqsrghbdqhcoxqhfb`
   - publicAnonKey: (your key)
3. Refresh page

---

### Problem 5: Login berhasil tapi tidak ada data
**Cause**: Seed data belum dibuat

**Solution**:
1. Login sebagai admin
2. Klik **"Seed Demo Data"** button di bottom navigation
3. Wait for success toast
4. Refresh page

---

## 📊 Verify Complete Setup

Run this query di SQL Editor untuk verify everything:

```sql
-- Check all tables exist
SELECT 
  COUNT(*) as total_tables
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('profiles', 'services', 'vehicles', 'job_orders', 'inventory', 'job_parts', 'job_updates');
-- Should return: 7

-- Check demo users
SELECT 
  email,
  email_confirmed_at IS NOT NULL as email_confirmed
FROM auth.users
WHERE email IN ('admin@demo.com', 'tech@demo.com', 'customer@demo.com');
-- Should return: 3 rows, all with email_confirmed = true

-- Check profiles created
SELECT 
  p.full_name,
  p.role
FROM public.profiles p
JOIN auth.users u ON p.id = u.id
WHERE u.email IN ('admin@demo.com', 'tech@demo.com', 'customer@demo.com');
-- Should return: 3 rows with correct roles

-- Check sample data
SELECT 
  (SELECT COUNT(*) FROM services) as services_count,
  (SELECT COUNT(*) FROM inventory) as inventory_count;
-- Should return: services_count=5, inventory_count=8
```

Expected results:
- total_tables: **7**
- demo users: **3** (all confirmed)
- profiles: **3** (with correct roles)
- services: **5**
- inventory: **8**

✅ **If all checks pass, setup is COMPLETE!**

---

## 🎉 Success!

Setelah semua langkah selesai, Anda harus bisa:

✅ Login dengan demo accounts
✅ Auto-redirect ke dashboard sesuai role
✅ Seed demo data as admin
✅ View all features (Customer, Technician, Admin)

**Selamat! Database sudah fully integrated! 🚀**

---

## 📞 Butuh Bantuan?

Jika masih error:

1. **Check Browser Console** (F12)
   - Ada error messages?
   - Network tab: API calls failed?

2. **Check Supabase Logs**
   - Dashboard > Logs > API
   - Dashboard > Logs > Database

3. **Re-run Setup**
   - Delete semua users di Authentication
   - Run migration.sql lagi
   - Run CREATE_DEMO_USERS.sql lagi

4. **Screenshot error message** dan share untuk troubleshooting

---

**Good luck! 🍀**
