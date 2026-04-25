# ⚡ QUICK FIX - "Invalid login credentials" Error

## 🔴 ERROR: Invalid login credentials

### PENYEBAB:
Database belum di-setup. Tables dan demo users belum dibuat.

---

## ✅ SOLUSI CEPAT (5 Menit):

### 1️⃣ Buka Supabase Dashboard
```
https://supabase.com/dashboard/project/ltscqsrghbdqhcoxqhfb
```

---

### 2️⃣ Disable Email Confirmation
1. Sidebar > **Authentication**
2. Tab **Providers**
3. Click **Email** provider
4. **UNCHECK** "Confirm email"
5. Click **Save**

---

### 3️⃣ Run Migration Script
1. Sidebar > **SQL Editor**
2. Click **New query**
3. Copy seluruh isi file `/database/migration.sql`
4. Paste ke SQL Editor
5. Click **Run** (Ctrl+Enter)
6. Wait 30-60 seconds
7. Check for "Success" message

---

### 4️⃣ Create Demo Users
1. Masih di **SQL Editor**
2. Click **New query** lagi
3. Copy seluruh isi file `/database/CREATE_DEMO_USERS.sql`
4. Paste ke SQL Editor
5. Click **Run** (Ctrl+Enter)
6. Check for success notices

---

### 5️⃣ Verify Users Created
1. Sidebar > **Authentication**
2. Tab **Users**
3. Harus ada **3 users**:
   - ✅ admin@demo.com
   - ✅ tech@demo.com
   - ✅ customer@demo.com

---

### 6️⃣ Test Login
1. Refresh aplikasi (F5)
2. Click **"Masuk"**
3. Login dengan:
   - Email: `admin@demo.com`
   - Password: `password123`
4. Should work! ✅

---

## 🔍 Verify Setup Berhasil

Run query ini di SQL Editor:

```sql
-- Check tables exist
SELECT COUNT(*) as table_count 
FROM information_schema.tables 
WHERE table_schema = 'public';
-- Should return: 7

-- Check users exist
SELECT email, email_confirmed_at IS NOT NULL as confirmed
FROM auth.users
WHERE email IN ('admin@demo.com', 'tech@demo.com', 'customer@demo.com');
-- Should return: 3 rows, all confirmed = true
```

---

## 🆘 Masih Error?

### Error: "Email not confirmed"
**Fix:**
```sql
UPDATE auth.users 
SET email_confirmed_at = NOW() 
WHERE email IN ('admin@demo.com', 'tech@demo.com', 'customer@demo.com');
```

### Error: "User already exists"
Users sudah pernah dibuat. Coba login langsung atau reset password.

### Error: Tables tidak muncul
Migration script belum berhasil. Coba run lagi dari awal.

---

## 📚 Dokumentasi Lengkap

Untuk panduan detail dengan screenshot:
👉 `/database/SETUP_STEP_BY_STEP.md`

---

**Done! Sekarang bisa login! 🎉**
