# 🚀 QR Code System - Quick Setup Guide

## ⚡ 3 Langkah Setup QR Code

QR Code sistem sudah **90% siap**! Tinggal jalankan 1 migration, dan QR akan langsung muncul!

---

## 📝 Step-by-Step

### **Step 1: Run Database Migration** ✅ WAJIB!

1. Login ke **Supabase Dashboard**: https://supabase.com/dashboard
2. Pilih project: **sunest-auto-new** (tvugghippwvoxsjqyxkr)
3. Klik **SQL Editor** (sidebar kiri)
4. Klik **New query**
5. Copy-paste SQL ini:

```sql
-- Add QR Code field
ALTER TABLE job_orders 
ADD COLUMN IF NOT EXISTS qr_code_token VARCHAR(50) UNIQUE;

-- Add index
CREATE INDEX IF NOT EXISTS idx_qr_code_token 
ON job_orders(qr_code_token);

-- Verify
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'job_orders' AND column_name = 'qr_code_token';
```

6. Klik **Run** (atau Ctrl+Enter)
7. Lihat hasil: harus muncul `qr_code_token` ✅

---

### **Step 2: Test Customer Booking** ✅

1. Login sebagai **customer**
2. **Buat booking baru** (pilih service, tanggal, dll)
3. Submit booking
4. Pergi ke tab **"Pending Bookings"**
5. **QR Code harus muncul!** 🎉

Expected result:
```
┌──────────────────────────┐
│ 🔐 QR Code Check-In      │
│ Tunjukkan ke admin       │
│                          │
│   [QR CODE IMAGE]        │
│                          │
│ Kode Credential:         │
│ SUNEST-20260207-A1B2     │
│                          │
│ 💡 Screenshot untuk      │
│    check-in              │
└──────────────────────────┘
```

---

### **Step 3: Verify Auto-Delete** ✅

1. Buat booking test
2. QR Code muncul di pending bookings
3. Admin update status → **Completed**
4. Refresh halaman
5. **QR Code hilang** (auto-deleted dari database) ✅

---

## ✨ Apa yang Sudah Siap?

### ✅ Backend (100% Done)
- [x] Generate QR token saat booking dibuat
- [x] Format: `SUNEST-YYYYMMDD-XXXX`
- [x] Simpan di database field `qr_code_token`
- [x] Auto-delete saat status `completed`

### ✅ Frontend - Customer (100% Done)
- [x] Display QR Code di PendingBookings component
- [x] Show QR image (180x180px)
- [x] Show credential code
- [x] Beautiful purple/pink gradient design
- [x] Conditional rendering (hanya jika ada token)

### ⏳ Frontend - Admin (Coming Soon)
- [ ] QR Scanner page
- [ ] Manual input fallback
- [ ] Check-in flow
- [ ] Booking validation

---

## 🧪 Testing Checklist

### **1. Generate QR Code**
```bash
✅ Create booking
✅ Check database: qr_code_token field ada value
✅ Check UI: QR Code muncul di PendingBookings
```

### **2. QR Code Display**
```bash
✅ QR image ter-render
✅ Token format benar: SUNEST-YYYYMMDD-XXXX
✅ Copy button berfungsi
✅ Screenshot QR Code bisa
```

### **3. Auto-Delete**
```bash
✅ Status = pending → QR Code ada
✅ Status = completed → QR Code NULL
✅ Database cleanup berhasil
```

---

## 🔍 Debugging

### **QR Code tidak muncul?**

**1. Check Database**
```sql
SELECT job_number, qr_code_token, status 
FROM job_orders 
WHERE customer_id = 'YOUR_USER_ID'
ORDER BY created_at DESC 
LIMIT 5;
```

Expected: `qr_code_token` harus ada value seperti `SUNEST-20260207-A1B2`

**2. Check Browser Console**
```javascript
// Saat di halaman PendingBookings
console.log('Bookings:', bookings);
// Lihat apakah qr_code_token ada di object
```

**3. Check Backend Logs**
```
🔲 Generated QR Code: SUNEST-20260207-A1B2
📤 Prepared job data: { ..., qr_code_token: "SUNEST-..." }
✅ Job created successfully
```

### **QR Code tidak hilang saat completed?**

**Check Update Logic**
```sql
-- Manual test
UPDATE job_orders 
SET status = 'completed', qr_code_token = NULL 
WHERE id = 123;

SELECT qr_code_token FROM job_orders WHERE id = 123;
-- Should be NULL
```

---

## 📱 QR Code Format

### **Token Format:**
```
SUNEST-YYYYMMDD-XXXX

Examples:
✅ SUNEST-20260207-A1B2
✅ SUNEST-20260208-K9P3
✅ SUNEST-20260209-M7X4

❌ SUNEST-123
❌ QR-20260207-A1B2
❌ sunest-20260207-a1b2 (lowercase not allowed)
```

### **QR Code Image API:**
```
https://api.qrserver.com/v1/create-qr-code/
  ?size=180x180
  &data=SUNEST-20260207-A1B2
```

Free API, no key required! ✅

---

## 🎨 UI Design

### **QR Section Location:**
```
Pending Bookings Card
├── Header (Job Number, Status)
├── 📅 Jadwal Service    ← Tanggal & Waktu
├── 🔐 QR Code Check-In  ← QR CODE SECTION (NEW!)
├── 🏍️ Kendaraan         ← Vehicle info
└── 📝 Catatan          ← Notes
```

### **Color Scheme:**
- Background: Purple-Pink gradient (`from-purple-50 to-pink-50`)
- Border: Purple-300 (`border-2 border-purple-300`)
- Text: Purple-700 & Purple-900
- Icon: White on purple gradient background

---

## 🚀 Future Enhancements

### **Admin QR Scanner** (Next Priority)
```typescript
// pages/admin/qr-scanner.tsx
import { Html5QrcodeScanner } from 'html5-qrcode';

// Camera-based QR scanning
// Manual input fallback
// Validate token → Show booking details
// Confirm check-in
```

### **QR Validation API**
```typescript
POST /make-server-c1ef5280/qr/validate
Body: { token: "SUNEST-20260207-A1B2" }

Response: {
  valid: true,
  booking: { ... }
}
```

### **Check-in Endpoint**
```typescript
POST /make-server-c1ef5280/bookings/:id/checkin
Body: { qr_token: "SUNEST-20260207-A1B2" }

Response: {
  success: true,
  status: "checked_in"
}
```

---

## 📚 Documentation

**Full docs:**
- `/QR_CODE_SYSTEM.md` - Complete system documentation
- `/MIGRATION_QR_CODE.md` - Migration instructions
- `/utils/qr-code.ts` - Utility functions

**Updated components:**
- `/components/dashboard/PendingBookings.tsx` - QR display
- `/supabase/functions/server/index.tsx` - QR generation & auto-delete

---

## ✅ Final Checklist

Sebelum deploy:

- [ ] Run migration (add qr_code_token field)
- [ ] Test customer booking → QR muncul
- [ ] Test status update → QR auto-delete
- [ ] Screenshot QR code berhasil
- [ ] Copy credential code berhasil
- [ ] No errors di console
- [ ] No errors di backend logs

---

## 🎉 Success Criteria

QR Code system **berhasil** jika:

1. ✅ Customer buat booking → QR muncul otomatis
2. ✅ QR Code unik untuk setiap booking
3. ✅ Customer bisa screenshot/copy QR
4. ✅ Status completed → QR auto-delete
5. ✅ Database bersih (no orphan QR tokens)

---

**Version:** 1.0.0  
**Status:** ✅ Ready to deploy (after migration)  
**Author:** Sunest Auto Dev Team  
**Date:** 7 Februari 2026
