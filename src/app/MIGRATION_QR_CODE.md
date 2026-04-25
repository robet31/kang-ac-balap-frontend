# 🔧 Migration: Add QR Code Token Field

## ⚠️ IMPORTANT - Jalankan Migration Ini Dulu!

Sebelum QR Code bisa berfungsi, Anda perlu menambahkan field `qr_code_token` ke database.

---

## 📋 Cara Menjalankan Migration

### **Option 1: Via Supabase Dashboard (Recommended)**

1. **Login ke Supabase Dashboard**
   - Buka: https://supabase.com/dashboard
   - Pilih project: `sunest-auto-new` (ID: tvugghippwvoxsjqyxkr)

2. **Buka SQL Editor**
   - Sidebar kiri → klik **"SQL Editor"**
   - Klik **"New query"**

3. **Copy-Paste SQL Migration**
   ```sql
   -- Add QR Code token field to job_orders table
   ALTER TABLE job_orders 
   ADD COLUMN IF NOT EXISTS qr_code_token VARCHAR(50) UNIQUE;

   -- Create index for faster lookup
   CREATE INDEX IF NOT EXISTS idx_qr_code_token 
   ON job_orders(qr_code_token);

   -- Add comment
   COMMENT ON COLUMN job_orders.qr_code_token IS 'Unique QR code token for customer check-in. Format: SUNEST-YYYYMMDD-XXXX. Auto-deleted when booking completed.';

   -- Check result
   SELECT column_name, data_type, is_nullable 
   FROM information_schema.columns 
   WHERE table_name = 'job_orders' 
   AND column_name = 'qr_code_token';
   ```

4. **Run Query**
   - Klik tombol **"Run"** (atau tekan Ctrl+Enter / Cmd+Enter)
   - Tunggu sampai muncul konfirmasi sukses

5. **Verify**
   - Scroll ke bawah, lihat hasil query
   - Harus muncul 1 row dengan:
     ```
     column_name: qr_code_token
     data_type: character varying
     is_nullable: YES
     ```

---

### **Option 2: Via Supabase CLI**

```bash
# 1. Install Supabase CLI (jika belum)
npm install -g supabase

# 2. Login
supabase login

# 3. Link ke project
supabase link --project-ref tvugghippwvoxsjqyxkr

# 4. Apply migration
supabase db push

# 5. Verify
supabase db remote inspect
```

---

## ✅ Verifikasi Migration Berhasil

### **Test via SQL Editor:**

```sql
-- 1. Check column exists
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'job_orders' 
AND column_name = 'qr_code_token';

-- Expected output:
-- qr_code_token | character varying | YES

-- 2. Check index exists
SELECT indexname 
FROM pg_indexes 
WHERE tablename = 'job_orders' 
AND indexname = 'idx_qr_code_token';

-- Expected output:
-- idx_qr_code_token

-- 3. Test insert (untuk memastikan field berfungsi)
INSERT INTO job_orders (
  job_number, 
  customer_id, 
  customer_name, 
  vehicle_info, 
  service_type, 
  status, 
  qr_code_token
) VALUES (
  'TEST-QR-001',
  '00000000-0000-0000-0000-000000000001',
  'Test Customer',
  'Test Vehicle',
  'Test Service',
  'pending',
  'SUNEST-20260207-TEST'
);

-- 4. Verify data inserted
SELECT job_number, qr_code_token 
FROM job_orders 
WHERE job_number = 'TEST-QR-001';

-- Expected output:
-- TEST-QR-001 | SUNEST-20260207-TEST

-- 5. Cleanup test data
DELETE FROM job_orders WHERE job_number = 'TEST-QR-001';
```

---

## 🧪 Test QR Code System

### **1. Test via Customer Booking**

1. Login sebagai customer
2. Buat booking baru
3. Cek di "Pending Bookings" tab
4. **QR Code section harus muncul** dengan:
   - QR Code image
   - Credential token (format: SUNEST-YYYYMMDD-XXXX)

### **2. Test via Database**

```sql
-- Check QR token generated for new bookings
SELECT 
  job_number, 
  customer_name, 
  status, 
  qr_code_token,
  created_at
FROM job_orders 
WHERE qr_code_token IS NOT NULL
ORDER BY created_at DESC
LIMIT 5;
```

Expected output:
```
job_number  | customer_name | status  | qr_code_token          | created_at
------------|---------------|---------|------------------------|-------------------
JO-17...    | Budi Santoso  | pending | SUNEST-20260207-A1B2   | 2026-02-07 10:30:00
```

### **3. Test Auto-Delete on Completed**

```sql
-- 1. Create test booking
INSERT INTO job_orders (
  job_number, customer_id, customer_name, vehicle_info, 
  service_type, status, qr_code_token
) VALUES (
  'TEST-DELETE-001', '00000000-0000-0000-0000-000000000001',
  'Test Customer', 'Test Vehicle', 'Test Service', 
  'pending', 'SUNEST-20260207-DEL1'
);

-- 2. Verify QR token exists
SELECT job_number, status, qr_code_token 
FROM job_orders 
WHERE job_number = 'TEST-DELETE-001';
-- Should show: TEST-DELETE-001 | pending | SUNEST-20260207-DEL1

-- 3. Update to completed (via API - will auto-delete QR)
-- Use Postman or curl to call:
-- PUT https://tvugghippwvoxsjqyxkr.supabase.co/functions/v1/make-server-c1ef5280/bookings/:id/status
-- Body: { "status": "completed" }

-- OR manually update:
UPDATE job_orders 
SET status = 'completed', qr_code_token = NULL 
WHERE job_number = 'TEST-DELETE-001';

-- 4. Verify QR token deleted
SELECT job_number, status, qr_code_token 
FROM job_orders 
WHERE job_number = 'TEST-DELETE-001';
-- Should show: TEST-DELETE-001 | completed | NULL

-- 5. Cleanup
DELETE FROM job_orders WHERE job_number = 'TEST-DELETE-001';
```

---

## 🐛 Troubleshooting

### **Problem: Migration gagal "permission denied"**

**Solution:**
```sql
-- Grant permission ke role service_role
GRANT ALL ON TABLE job_orders TO service_role;
ALTER TABLE job_orders OWNER TO postgres;
```

### **Problem: QR Code tidak muncul di UI**

**Checklist:**
1. ✅ Migration sudah dijalankan? (cek via SQL)
2. ✅ Backend sudah generate QR token? (cek server logs)
3. ✅ Field `qr_code_token` ada di response API?
4. ✅ Frontend sudah check `booking.qr_code_token`?

**Debug:**
```javascript
// Di browser console (saat lihat pending bookings)
console.log('Booking data:', bookings);
// Check apakah qr_code_token ada di setiap booking object
```

### **Problem: Duplicate QR code error**

Jika error: `duplicate key value violates unique constraint "job_orders_qr_code_token_key"`

**Solution:**
```sql
-- Check duplicate QR tokens
SELECT qr_code_token, COUNT(*) 
FROM job_orders 
WHERE qr_code_token IS NOT NULL
GROUP BY qr_code_token 
HAVING COUNT(*) > 1;

-- Fix: Regenerate QR for duplicates
UPDATE job_orders 
SET qr_code_token = 'SUNEST-' || to_char(NOW(), 'YYYYMMDD') || '-' || upper(substring(md5(random()::text) from 1 for 4))
WHERE id IN (
  SELECT id FROM (
    SELECT id, ROW_NUMBER() OVER (PARTITION BY qr_code_token ORDER BY created_at) as rn
    FROM job_orders 
    WHERE qr_code_token IS NOT NULL
  ) t WHERE rn > 1
);
```

---

## 📊 Monitoring QR Usage

### **Check QR Statistics**

```sql
-- Total bookings with QR
SELECT COUNT(*) as total_with_qr
FROM job_orders 
WHERE qr_code_token IS NOT NULL;

-- Bookings by status with QR
SELECT 
  status, 
  COUNT(*) as count,
  COUNT(qr_code_token) as with_qr
FROM job_orders
GROUP BY status
ORDER BY count DESC;

-- Recent QR codes (last 24 hours)
SELECT 
  job_number,
  customer_name,
  qr_code_token,
  created_at
FROM job_orders
WHERE qr_code_token IS NOT NULL
AND created_at >= NOW() - INTERVAL '24 hours'
ORDER BY created_at DESC;
```

---

## ✅ Migration Checklist

Setelah migration, pastikan:

- [ ] Column `qr_code_token` ada di table `job_orders`
- [ ] Index `idx_qr_code_token` sudah dibuat
- [ ] Test insert booking berhasil generate QR token
- [ ] QR Code muncul di customer dashboard (PendingBookings)
- [ ] QR Code auto-delete saat status = completed
- [ ] Tidak ada duplicate QR token error

---

## 🚀 Next Steps

Setelah migration berhasil:

1. ✅ Test customer booking → QR harus muncul
2. ✅ Test update status to completed → QR harus hilang
3. ✅ Implement admin QR scanner page (upcoming)
4. ✅ Implement check-in flow (upcoming)

---

**Status:** Ready to run  
**Priority:** HIGH (QR tidak akan berfungsi tanpa migration ini)  
**Estimated Time:** 5 minutes

**Support:** Jika ada error, screenshot dan kirim ke development team.
